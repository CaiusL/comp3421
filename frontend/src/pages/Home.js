import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css"; 

const Home = () => {
  return (
    <div className="container">
      <h1 className="heading">Welcome to the Quiz App</h1>
      <Link to="/take-quiz" className="link">
        Take Quiz Now
      </Link>
      <br />
      <Link to="/add-quiz" className="link">
        Add a New Quiz
      </Link>
    </div>
  );
};

export default Home;