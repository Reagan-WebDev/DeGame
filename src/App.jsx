import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import DisqualifiedScreen from './components/DisqualifiedScreen';
import DeveloperDashboard from './components/DeveloperDashboard';
import { questions } from './data/questions';

export default function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, result, disqualified
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Persistence tracking
  const [consecutiveYellows, setConsecutiveYellows] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [percentage, setPercentage] = useState(0);

  // Load from local storage on mount
  useEffect(() => {
    const storedDisqualified = localStorage.getItem('isDisqualified') === 'true';
    const storedYellows = parseInt(localStorage.getItem('consecutiveYellows') || '0', 10);
    const storedLastResult = localStorage.getItem('lastResult');
    const wasGameInProgress = localStorage.getItem('gameInProgress') === 'true';

    if (storedDisqualified) {
      setIsDisqualified(true);
      setGameState('disqualified');
    } else if (wasGameInProgress) {
      const currentRefreshCount = parseInt(localStorage.getItem('refreshCount') || '0', 10) + 1;
      localStorage.setItem('refreshCount', currentRefreshCount.toString());
      
      if (currentRefreshCount >= 3) {
        // Cheater detected: refreshed page too many times
        setIsDisqualified(true);
        setGameState('disqualified');
        localStorage.setItem('isDisqualified', 'true');
        localStorage.removeItem('gameInProgress');
        localStorage.removeItem('refreshCount');
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('currentScore');
      } else {
        // Resume game where they left off
        const savedIndex = parseInt(localStorage.getItem('currentQuestionIndex') || '0', 10);
        const savedScore = parseInt(localStorage.getItem('currentScore') || '0', 10);
        setCurrentQuestionIndex(savedIndex);
        setScore(savedScore);
        setGameState('playing');
      }
    }
    
    setConsecutiveYellows(storedYellows);
    setLastResult(storedLastResult);
  }, []);

  const handleStart = () => {
    localStorage.setItem('gameInProgress', 'true');
    localStorage.setItem('refreshCount', '0');
    localStorage.setItem('currentQuestionIndex', '0');
    localStorage.setItem('currentScore', '0');
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    const newScore = score + (isCorrect ? 1 : 0);
    
    if (isCorrect) setScore(newScore);

    if (currentQuestionIndex + 1 < questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      localStorage.setItem('currentQuestionIndex', nextIndex.toString());
      localStorage.setItem('currentScore', newScore.toString());
    } else {
      calculateResult(newScore);
    }
  };

  const calculateResult = (finalScore) => {
    localStorage.removeItem('gameInProgress');
    localStorage.removeItem('refreshCount');
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('currentScore');
    const finalPercentage = (finalScore / questions.length) * 100;
    setPercentage(Math.round(finalPercentage));

    let currentResultType = 'green';
    if (finalPercentage < 40) currentResultType = 'red';
    else if (finalPercentage <= 70) currentResultType = 'yellow';

    // Disqualification rules
    if (currentResultType === 'red') {
      triggerDisqualification();
    } else if (currentResultType === 'yellow') {
      const newYellows = consecutiveYellows + 1;
      setConsecutiveYellows(newYellows);
      localStorage.setItem('consecutiveYellows', newYellows.toString());
      if (newYellows >= 3) {
        triggerDisqualification();
        currentResultType = 'red'; // Force red view on disqualification
      }
    } else {
      // User got green - reset yellows if we wanted, but not explicitly requested.
      setConsecutiveYellows(0);
      localStorage.setItem('consecutiveYellows', '0');
    }

    setLastResult(currentResultType);
    localStorage.setItem('lastResult', currentResultType);
    setGameState('result');
  };

  const triggerDisqualification = () => {
    setIsDisqualified(true);
    localStorage.setItem('isDisqualified', 'true');
  };

  return (
    <div id="root">
      {gameState === 'start' && <StartScreen onStart={handleStart} />}
      {gameState === 'playing' && (
        <QuestionCard 
          key={currentQuestionIndex}
          questionData={questions[currentQuestionIndex]}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      )}
      {gameState === 'result' && !isDisqualified && (
        <ResultScreen 
          score={score}
          percentage={percentage}
          resultType={lastResult}
          isDisqualified={false}
          onRetry={handleStart}
        />
      )}
      {(gameState === 'disqualified' || isDisqualified) && (
        <DisqualifiedScreen />
      )}
      
      {/* Hidden button in bottom right corner (invisible to normal users) */}
      <DeveloperDashboard />
    </div>
  );
}
