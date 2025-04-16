// filepath: c:\Users\tommy\Documents\GitHub\comp3421\frontend\src\App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddQuiz from "./pages/AddQuiz";
import Quiz from "./pages/Quiz";
import TakeQuiz from "./pages/TakeQuiz";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-quiz" element={<AddQuiz />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/take-quiz" element={<TakeQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;