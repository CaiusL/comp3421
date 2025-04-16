import React, { useState } from "react";
import { addNewQuiz } from "../api"; // Import the API function
import "../css/AddQuiz.css"; 
const NewQuizForm = ({ onQuizAdded }) => {
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    timer: 60, // Default time limit in seconds
    timeUnit: "seconds", // Default time unit
    questions: [{ question: "", options: ["", ""], correctOption: null }], // Start with 2 options
  });

  const handleTimeChange = (value, unit) => {
    let timerInSeconds = parseInt(value, 10) || 0;

    // Convert the time to seconds based on the selected unit
    if (unit === "minutes") {
      timerInSeconds *= 60;
    } else if (unit === "hours") {
      timerInSeconds *= 3600;
    }

    setNewQuiz({ ...newQuiz, timer: timerInSeconds, timeUnit: unit });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[index][field] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const setCorrectOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[questionIndex].correctOption = optionIndex;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...newQuiz.questions];
    if (updatedQuestions[questionIndex].options.length < 10) {
      updatedQuestions[questionIndex].options.push("");
      setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    } else {
      alert("You can only add up to 10 options.");
    }
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...newQuiz.questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);

      // Reset the correctOption if the removed option was the correct one
      if (updatedQuestions[questionIndex].correctOption === optionIndex) {
        updatedQuestions[questionIndex].correctOption = null;
      }

      // Adjust the correctOption index if necessary
      if (updatedQuestions[questionIndex].correctOption > optionIndex) {
        updatedQuestions[questionIndex].correctOption -= 1;
      }

      setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    } else {
      alert("Each question must have at least 2 options.");
    }
  };

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { question: "", options: ["", ""], correctOption: null }],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = newQuiz.questions.filter((_, i) => i !== index);
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();

    // Validation: Check if the title is filled
    if (!newQuiz.title.trim()) {
      alert("Quiz title is required!");
      return;
    }

    // Validation: Check if all questions, options, and correct answers are filled
    for (let i = 0; i < newQuiz.questions.length; i++) {
      const question = newQuiz.questions[i];
      if (!question.question.trim()) {
        alert(`Question ${i + 1} is required!`);
        return;
      }
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].trim()) {
          alert(`Option ${j + 1} for Question ${i + 1} is required!`);
          return;
        }
      }
      if (question.correctOption === null) {
        alert(`A correct option is required for Question ${i + 1}!`);
        return;
      }
    }

    // If validation passes, proceed to add the quiz
    try {
      const quizData = {
        title: newQuiz.title,
        timer: newQuiz.timer, // Timer is already in seconds
        questions: newQuiz.questions.map((q) => ({
          question_text: q.question, // Rename `question` to `question_text`
          options: q.options.map((text, id) => ({ id: id + 1, text })), // Add IDs to options
          correct_option: q.correctOption + 1, // Send the correct option index (1-based)
        })),
      };

      console.log("Quiz data being sent:", quizData); // Log the data being sent

      const response = await addNewQuiz(quizData); // Use the API function
      alert("Quiz added successfully!");
      console.log("Response from server:", response);

      setNewQuiz({
        title: "",
        timer: 60, // Reset timer to default
        timeUnit: "seconds", // Reset time unit to default
        questions: [{ question: "", options: ["", ""], correctOption: null }], // Reset to 2 options
      });

      if (onQuizAdded) onQuizAdded(); // Notify parent component if callback is provided
    } catch (error) {
      alert("Failed to add quiz. Please try again.");
      console.error("Error adding quiz:", error);
    }
  };

  return (
    <form id = "add-quiz" onSubmit={handleAddQuiz}>
      <h2>Add a New Quiz</h2>
      <div>
        <label>Quiz Title:</label>
        <input
          type="text"
          placeholder="Enter quiz title"
          value={newQuiz.title}
          onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
        />
      </div>
      <div>
        <label>Time Limit:</label>
        <input
          type="number"
          placeholder="Enter time limit"
          value={
            newQuiz.timeUnit === "seconds"
              ? newQuiz.timer
              : newQuiz.timeUnit === "minutes"
              ? newQuiz.timer / 60
              : newQuiz.timer / 3600
          }
          onChange={(e) => handleTimeChange(e.target.value, newQuiz.timeUnit)}
        />
        <select
          value={newQuiz.timeUnit}
          onChange={(e) =>
            handleTimeChange(
              newQuiz.timer / (newQuiz.timeUnit === "seconds" ? 1 : newQuiz.timeUnit === "minutes" ? 60 : 3600),
              e.target.value
            )
          }
        >
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
        </select>
      </div>
      {newQuiz.questions.map((q, index) => (
        <div key={index} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h3>Question {index + 1}</h3>
          <input
            type="text"
            placeholder={`Enter question ${index + 1}`}
            value={q.question}
            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
          />
          <div>
            {q.options.map((option, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <label>Option {i + 1}:</label>
                <input
                  type="text"
                  placeholder={`Enter option ${i + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, i, e.target.value)}
                />
                <input
                  type="radio"
                  name={`correctOption-${index}`}
                  checked={q.correctOption === i}
                  onChange={() => setCorrectOption(index, i)}
                  style={{ marginLeft: "10px" }}
                />
                <span>Correct</span>
                <button
                  type="button"
                  onClick={() => removeOption(index, i)}
                  style={{ marginLeft: "10px" }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addOption(index)}>
              Add Option
            </button>
          </div>
          <button type="button" onClick={() => removeQuestion(index)}>
            Remove Question
          </button>
        </div>
      ))}
      <button type="button" onClick={addQuestion}>
        Add Another Question
      </button>
      <button type="submit">Submit Quiz</button>
    </form>
  );
};

export default NewQuizForm;