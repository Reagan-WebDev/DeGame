import React, { useEffect } from 'react';
import CertificateDisplay from './CertificateDisplay';

export default function ResultScreen({ score, percentage, resultType, onRetry, isDisqualified }) {
  // resultType can be 'green', 'yellow', 'red'
  
  if (isDisqualified || resultType === 'red') {
    return (
      <CertificateDisplay 
        type="red" 
        score={percentage} 
        title="Disqualified" 
        message="You failed miserably. No retries."
      />
    );
  }
  
  if (resultType === 'yellow') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <CertificateDisplay 
          type="yellow" 
          score={percentage} 
          title="Almost There" 
          message="Not quite enough. Try again, but be careful..."
        />
        <button className="btn" onClick={onRetry} style={{ marginTop: '20px' }}>
          Try Again
        </button>
      </div>
    );
  }

  // Green Certificate
  return (
    <CertificateDisplay 
      type="green" 
      score={percentage} 
      title="Certified Official" 
      message="Congratulations! Coming soon: Other games."
      showConfetti={true}
    />
  );
}
