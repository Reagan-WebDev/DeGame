import React, { useState, useEffect } from 'react';

export default function QuestionCard({ questionData, currentQuestionIndex, totalQuestions, onAnswer }) {
  const { question, options } = questionData;
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft === 0) {
      onAnswer(null); // Time out, incorrect answer
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onAnswer]);

  const timerColor = timeLeft <= 2 ? 'var(--neon-red)' : 'var(--neon-blue)';

  return (
    <div className="glass-card question-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'var(--neon-blue)', margin: 0 }}>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </h3>
        <div style={{ 
          color: timerColor, 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          fontFamily: 'var(--font-heading)',
          textShadow: timeLeft <= 2 ? '0 0 10px var(--neon-red)' : '0 0 5px var(--neon-blue)',
          transition: 'color 0.3s'
        }}>
          00:0{timeLeft}
        </div>
      </div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>{question}</h2>
      
      <div className="options-container">
        {options.map((option, index) => (
          <button 
            key={index} 
            className="btn-option" 
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
