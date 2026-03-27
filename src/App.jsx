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

    if (storedDisqualified) {
      setIsDisqualified(true);
      setGameState('disqualified');
    }
    setConsecutiveYellows(storedYellows);
    setLastResult(storedLastResult);
  }, []);

  const handleStart = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResult(score + (isCorrect ? 1 : 0));
    }
  };

  const calculateResult = (finalScore) => {
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
