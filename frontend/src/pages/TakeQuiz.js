import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllQuizzes } from "../api";
import "../css/TakeQuiz.css"; // Import the CSS file

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);

  // Helper function to format time
  const formatTime = (seconds) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours} hr ${minutes} min${secs > 0 ? ` ${secs} sec` : ""}`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes} min${secs > 0 ? ` ${secs} sec` : ""}`;
    } else {
      return `${seconds} sec`;
    }
  };

  // Fetch all quizzes from the PHP API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await fetchAllQuizzes();
        console.log("Fetched quizzes:", data); // Log the fetched quizzes
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="take-quiz-container">
      <h1 className="take-quiz-heading">Select a Quiz</h1>
      {quizzes.length === 0 ? (
        <p>Loading quizzes...</p>
      ) : (
        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <Link to={`/quiz/${quiz.id}`} className="quiz-link">
                {quiz.title} (Timer: {formatTime(quiz.timer)})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TakeQuiz;