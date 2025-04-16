const BASE_URL = "https://comp3421-backend-691480910502.asia-east2.run.app"; 
// Fetch all quizzes
export const fetchAllQuizzes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/index.php?action=overview`);
    if (!response.ok) {
      throw new Error("Failed to fetch quizzes");
    }
    const data = await response.json();
    return data.quizzes; // Return the quizzes array
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

// Fetch questions for a specific quiz by ID
export const fetchQuestionsByQuizId = async (quizId) => {
  try {
    const response = await fetch(`${BASE_URL}/index.php?action=questions&quiz_id=${quizId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data = await response.json();
    return data.questions; // Return the questions array
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

// Fetch answers for a specific quiz by ID
export const fetchAnswersByQuizId = async (quizId) => {
    try {
      const response = await fetch(`${BASE_URL}/index.php?action=answers&quiz_id=${quizId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch answers");
      }
      const data = await response.json();
      console.log("Raw API response for answers:", data); // Log the raw response
      return data.answers; // Return the answers array
    } catch (error) {
      console.error("Error fetching answers:", error);
      throw error;
    }
  };

// Add a new quiz
export const addNewQuiz = async (quizData) => {
    try {
      console.log("Sending quiz data:", quizData); // Debugging log
      const response = await fetch(`${BASE_URL}/index.php?action=add_quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText); // Log server response
        throw new Error("Failed to add quiz");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding quiz:", error);
      throw error;
    }
  };