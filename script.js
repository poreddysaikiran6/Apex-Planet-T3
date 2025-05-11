let questions = [];
let currentQuestionIndex = 0;

const questionElement = document.getElementById("question");
const answersContainer = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");

async function fetchQuestions() {
  const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
  const data = await res.json();
  questions = data.results.map(formatQuestion);
  showQuestion();
}

function formatQuestion(q) {
  const answers = [...q.incorrect_answers.map(a => ({ text: a, correct: false }))];
  const correctAnswer = { text: q.correct_answer, correct: true };
  answers.splice(Math.floor(Math.random() * 4), 0, correctAnswer);
  return {
    question: decodeHTML(q.question),
    answers: answers.map(ans => ({ text: decodeHTML(ans.text), correct: ans.correct }))
  };
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

function resetState() {
  nextButton.style.display = "none";
  answersContainer.innerHTML = "";
}

function selectAnswer(e) {
  const selectedButton = e.target;

  Array.from(answersContainer.children).forEach(button => {
    button.disabled = true;
    if (button.dataset.correct === "true") {
      button.style.backgroundColor = "green";
    } else {
      button.style.backgroundColor = "red";
    }
  });

  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    questionElement.textContent = "Quiz completed!";
    answersContainer.innerHTML = "";
    nextButton.style.display = "none";
  }
});

// Start the quiz
fetchQuestions();
