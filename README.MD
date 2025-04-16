# Quiz App

A responsive web application for creating, taking, and managing quizzes. This project is built using React for the frontend and a PHP backend for handling API requests.

---

## Features

- **Take a Quiz**: Users can select a quiz and answer questions with a timer.
- **Add a Quiz**: Admins can create new quizzes with custom questions, options, and time limits.
- **Responsive Design**: Fully responsive UI for desktop and mobile devices.
- **Dynamic Timer**: Displays time left in hours, minutes, or seconds based on the remaining time.

---

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **CSS**: For styling and responsive design.

### Backend
- **PHP**: For handling API requests.
- **MySQL**: For storing quiz data.

---

## Installation

### Prerequisites
- Node.js and npm installed.
- PHP and MySQL installed.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/comp3421.git
2. Navigate to the frontend folder and install dependencies:
    cd frontend
    npm install
3. Start the development server:
    npm start
4. Set up the backend:
    Import the .sql file in ./backend/SQL folder into your MySQL database.
    Configure the database connection in PHP files.

## Usage
1. Adding a Quiz
    - Navigate to the "Add a New Quiz" page.
    - Fill in the quiz title, time limit, and questions.
    - Submit the form to save the quiz.
2. Taking a Quiz
    - Navigate to the "Take Quiz" page.
    - Select a quiz from the list.
    - Answer the questions within the time limit.