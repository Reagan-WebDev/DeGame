import React from 'react';

export default function QuestionCard({ questionData, currentQuestionIndex, totalQuestions, onAnswer }) {
  const { question, options } = questionData;

  return (
    <div className="glass-card question-card">
      <h3 style={{ color: 'var(--neon-blue)', marginBottom: '10px' }}>
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </h3>
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
