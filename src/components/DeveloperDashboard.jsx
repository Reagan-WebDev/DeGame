import React, { useState } from 'react';

export default function DeveloperDashboard() {
  const [clickCount, setClickCount] = useState(0);

  const handleReset = () => {
    if (clickCount + 1 >= 3) {
      if (window.confirm("Developer Action: Clear all game data?")) {
        localStorage.clear();
        alert("Game data cleared. Reloading page...");
        window.location.reload();
      }
      setClickCount(0);
    } else {
      setClickCount(prev => prev + 1);
    }
  };

  return (
    <div 
      className="dev-footer" 
      onClick={handleReset} 
      title="Secret Reset Trigger"
    />
  );
}
