import React, { useEffect, useState } from 'react';

export default function CertificateDisplay({ type, score, title, message, showConfetti }) {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (showConfetti) {
      const newParticles = [...Array(30)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 2}s`,
        animationDelay: `${Math.random() * 2}s`,
        backgroundColor: ['#39ff14', '#00f3ff', '#fefe33', '#ff073a'][Math.floor(Math.random() * 4)]
      }));
      setParticles(newParticles);
    }
  }, [showConfetti]);

  const certClass = `glass-card cert-${type}`;

  return (
    <div className={certClass} style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {showConfetti && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {particles.map(p => (
            <div 
              key={p.id} 
              style={{
                position: 'absolute',
                top: '-10px',
                left: p.left,
                width: '10px',
                height: '10px',
                backgroundColor: p.backgroundColor,
                borderRadius: '50%',
                animation: `floatUp ${p.animationDuration} linear infinite`,
                animationDirection: 'reverse'
              }} 
            />
          ))}
        </div>
      )}
      
      <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{title}</h2>
      <div style={{ 
        width: '150px', 
        height: '150px', 
        borderRadius: '50%', 
        border: `4px solid var(--neon-${type === 'yellow' ? 'yellow' : type})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px auto',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textShadow: `0 0 10px var(--neon-${type === 'yellow' ? 'yellow' : type})`
      }}>
        {score}%
      </div>
      
      <p style={{ fontSize: '1.2rem', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>
    </div>
  );
}
