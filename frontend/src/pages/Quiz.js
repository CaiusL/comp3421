import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchQuestionsByQuizId, fetchAnswersByQuizId, fetchAllQuizzes } from "../api";
import "../css/Quiz.css";

const Quiz = () => {
  const { id } = useParams(); // Get the quiz ID from the URL
  const [questions, setQuestions] = useState([]); // Store the quiz questions
  const [userAnswers, setUserAnswers] = useState({}); // Store user's answers
  const [correctAnswers, setCorrectAnswers] = useState({}); // Store the correct answers
  const [score, setScore] = useState(null); // Store the user's score
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [timeLeft, setTimeLeft] = useState(null); // Store the time left for the quiz
  const timerRef = useRef(null); // Ref to store the timer ID

  // Helper function to format time
  const formatTime = (seconds) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours} hr ${minutes} min ${secs} sec`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes} min ${secs} sec`;
    } else {
      return `${seconds} sec`;
    }
  };

  // Fetch the quiz questions and timer from the PHP backend
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizzes = await fetchAllQuizzes();
        const currentQuiz = quizzes.find((quiz) => quiz.id === id);

        if (currentQuiz) {
          setTimeLeft(parseInt(currentQuiz.timer, 10)); // Set the timer for the quiz
        }

        const questionsData = await fetchQuestionsByQuizId(id);
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [id]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      if (timeLeft === 0) {
        handleSubmit(); // Automatically submit the quiz when the timer reaches zero
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerRef.current); // Cleanup the timer on component unmount
  }, [timeLeft]);

  // Handle answer selection
  const handleAnswerChange = (questionId, optionId) => {
    setUserAnswers({ ...userAnswers, [questionId]: optionId });
  };

  // Handle quiz submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent form submission if triggered manually
    setIsSubmitting(true); // Indicate that submission is in progress

    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    try {
      const answersData = await fetchAnswersByQuizId(id);

      if (!answersData || !Array.isArray(answersData)) {
        console.error("Invalid answers data:", answersData);
        throw new Error("Failed to fetch valid answers data.");
      }

      const correctAnswersMap = {};
      answersData.forEach((answer) => {
        correctAnswersMap[answer.id] = answer.correct_option;
      });
      setCorrectAnswers(correctAnswersMap);

      let calculatedScore = 0;
      answersData.forEach((answer) => {
        if (userAnswers[answer.id] === answer.correct_option) {
          calculatedScore++;
        }
      });

      setScore(calculatedScore);
    } catch (error) {
      console.error("Error fetching answers:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-heading">Quiz</h1>
      <p className="quiz-timer">
        Time Left: {timeLeft !== null ? formatTime(timeLeft) : "Loading timer..."}
      </p>
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="quiz-question">
            <p>{q.question_text}</p>
            {q.options.map((option) => (
              <label key={option.id} className="quiz-option">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={option.id}
                  onChange={() => handleAnswerChange(q.id, option.id)}
                  disabled={score !== null} // Disable inputs after submission
                  checked={userAnswers[q.id] === option.id} // Keep the user's selection
                />
                {option.text}
              </label>
            ))}
            {score !== null && (
              <p style={{ color: "red" }}>
                Correct answer:{" "}
                {q.options.find((option) => option.id === correctAnswers[q.id])?.text}
              </p>
            )}
          </div>
        ))}
        {score === null && (
          <button type="submit" className="quiz-submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </form>
      {score !== null && (
        <h2 className="quiz-score">
          Your Score: {score}/{questions.length}
        </h2>
      )}
    </div>
  );
};

export default Quiz;