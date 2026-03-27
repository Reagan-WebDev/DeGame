import React from 'react';

export default function DisqualifiedScreen() {
  return (
    <div className="glass-card cert-red" style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--neon-red)' }}>DISQUALIFIED</h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
        You have been permanently banned from attempting the quiz due to poor performance.
      </p>
      <div style={{ marginTop: '30px', fontSize: '3rem' }}>
        🚫
      </div>
    </div>
  );
}
