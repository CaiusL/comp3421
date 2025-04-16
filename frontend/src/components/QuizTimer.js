import React, { useState, useEffect } from "react";

const QuizTimer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return <div>Time Left: {timeLeft}s</div>;
};

export default QuizTimer;