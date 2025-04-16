<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$conn = new mysqli('10.103.64.3', 'root', 'adminComp3421', 'quiz');

if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get request type
$action = $_GET['action'] ?? '';
$quizId = $_GET['quiz_id'] ?? null;

// Debugging: Log the action and request method
error_log("Action: $action");
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);

// Handle different actions
if ($action == 'overview') {
    // Fetch quiz overview
    $quizQuery = "SELECT id, title, timer FROM quiz";
    $quizResult = $conn->query($quizQuery);

    $quizzes = [];
    while ($quiz = $quizResult->fetch_assoc()) {
        $quizzes[] = $quiz;
    }
    
    echo json_encode(["quizzes" => $quizzes], JSON_PRETTY_PRINT);
} elseif ($action == 'questions') {
    // Fetch questions only (without answers)
    $questionQuery = "SELECT id, question_text, options FROM question WHERE quiz_id = ?";
    $stmt = $conn->prepare($questionQuery);
    $stmt->bind_param("i", $quizId);
    $stmt->execute();
    $result = $stmt->get_result();

    $questions = [];
    while ($question = $result->fetch_assoc()) {
        $question["options"] = json_decode($question["options"], true);
        $questions[] = $question;
    }

    echo json_encode(["questions" => $questions], JSON_PRETTY_PRINT);
} elseif ($action == 'answers' && isset($_GET['quiz_id'])) {
    $quizId = intval($_GET['quiz_id']); // Sanitize the quiz_id
    $stmt = $conn->prepare("SELECT id, correct_option FROM question WHERE quiz_id = ?");
    $stmt->bind_param("i", $quizId);
    $stmt->execute();
    $result = $stmt->get_result();

    $answers = [];
    while ($row = $result->fetch_assoc()) {
        $answers[] = $row;
    }

    echo json_encode(["answers" => $answers], JSON_PRETTY_PRINT);
    exit();
} elseif ($action == 'add_quiz' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debugging: Log that the condition is triggered
    error_log("add_quiz action triggered with POST method");

    // Parse the incoming JSON payload
    $input = json_decode(file_get_contents("php://input"), true);

    // Debugging: Log the received input
    error_log("Received Input: " . print_r($input, true));

    // Validate input
    if (empty($input)) {
        error_log("Validation failed: Empty JSON payload");
        echo json_encode(["error" => "Empty JSON payload"]);
        http_response_code(400);
        exit();
    }

    if (!isset($input['title']) || empty($input['title'])) {
        error_log("Validation failed: Quiz title is missing or empty");
        echo json_encode(["error" => "Quiz title is required"]);
        http_response_code(400);
        exit();
    }

    if (!isset($input['questions']) || !is_array($input['questions']) || count($input['questions']) === 0) {
        error_log("Validation failed: Questions are missing or invalid");
        echo json_encode(["error" => "At least one question is required"]);
        http_response_code(400);
        exit();
    }

    // Insert the quiz into the database
    $stmt = $conn->prepare("INSERT INTO quiz (title, timer) VALUES (?, ?)");
    $timer = $input['timer'] ?? 60; // Default timer to 60 if not provided
    $stmt->bind_param("si", $input['title'], $timer);

    if (!$stmt->execute()) {
        error_log("Failed to insert quiz: " . $stmt->error);
        echo json_encode(["error" => "Failed to insert quiz"]);
        http_response_code(500);
        exit();
    }

    $quizId = $stmt->insert_id; // Get the ID of the newly inserted quiz
    $stmt->close();

    // Insert questions into the database
    $stmt = $conn->prepare("INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (?, ?, ?, ?)");

    foreach ($input['questions'] as $index => $question) {
        // Validate each question
        if (!isset($question['question_text'], $question['options'], $question['correct_option'])) {
            error_log("Validation failed: Invalid question format at index $index");
            error_log("Invalid Question: " . print_r($question, true));
            echo json_encode(["error" => "Invalid question format at index $index"]);
            http_response_code(400);
            exit();
        }

        if (!is_array($question['options']) || count($question['options']) === 0) {
            error_log("Validation failed: Options must be a non-empty array at index $index");
            echo json_encode(["error" => "Options must be a non-empty array at index $index"]);
            http_response_code(400);
            exit();
        }

        $questionText = $question['question_text'];
        $options = json_encode($question['options']);
        $correctOption = $question['correct_option'];

        // Ensure correct_option matches a valid option ID
        $validOptionIds = array_column($question['options'], 'id');
        if (!in_array($correctOption, $validOptionIds)) {
            error_log("Validation failed: correct_option does not match any option ID at index $index");
            echo json_encode(["error" => "correct_option does not match any option ID at index $index"]);
            http_response_code(400);
            exit();
        }

        $stmt->bind_param("issi", $quizId, $questionText, $options, $correctOption);

        if (!$stmt->execute()) {
            error_log("Failed to insert question at index $index: " . $stmt->error);
            echo json_encode(["error" => "Failed to insert question at index $index"]);
            http_response_code(500);
            exit();
        }
    }

    $stmt->close();

    // Respond with a success message
    echo json_encode(["message" => "Quiz added successfully", "quiz_id" => $quizId], JSON_PRETTY_PRINT);
}else {
    // Log invalid requests
    error_log("Invalid request: Action = $action, Method = " . $_SERVER['REQUEST_METHOD']);
    error_log("Request Body: " . file_get_contents("php://input"));

    echo json_encode(["message" => "Invalid request"]);
    http_response_code(400);
}

$conn->close();
?>