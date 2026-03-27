import React from 'react';

export default function StartScreen({ onStart }) {
  return (
    <div className="glass-card start-screen">
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`
            }} 
          />
        ))}
      </div>
      
      <h1 className="title-glow">CERTIFI ME</h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Think you know everything about me? Take the test and claim your certificate. 
        Fail, and you're disqualified permanently.
      </p>
      
      <button className="btn" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
}
