const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");

const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const timerSpan = document.getElementById("timer");
const progressBar = document.getElementById("progress");

const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const highScoreSpan = document.getElementById("high-score");
const resultMessage = document.getElementById("result-message");
const difficultySelect = document.getElementById("difficulty");

// sounds
const clickSound = new Audio("sounds/click.mp3");
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");

let questions = [];
let index = 0;
let score = 0;
let timer;
let timeLeft = 10;

// high score
let highScore = Number(localStorage.getItem("highScore")) || 0;
highScoreSpan.textContent = highScore;

// load questions
async function loadQuestions() {
  const res = await fetch("data/questions.json");
  const data = await res.json();
  const diff = difficultySelect.value;

  questions = data.filter(q => q.difficulty === diff);
  questions.sort(() => Math.random() - 0.5);

  totalQuestionsSpan.textContent = questions.length;
  maxScoreSpan.textContent = questions.length;
}

startBtn.addEventListener("click", async () => {
  clickSound.play();
  await loadQuestions();

  index = 0;
  score = 0;
  scoreSpan.textContent = 0;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
});

function showQuestion() {
  clearInterval(timer);
  timeLeft = 10;
  timerSpan.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft === 0) nextQuestion();
  }, 1000);

  const q = questions[index];
  questionText.textContent = q.question;
  currentQuestionSpan.textContent = index + 1;
  progressBar.style.width = ((index + 1) / questions.length) * 100 + "%";

  answersContainer.innerHTML = "";
  q.answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans.text;
    btn.classList.add("answer-btn");
    btn.onclick = () => selectAnswer(btn, ans.correct);
    answersContainer.appendChild(btn);
  });
}

function selectAnswer(btn, correct) {
  clearInterval(timer);
  clickSound.play();

  if (correct) {
    btn.classList.add("correct");
    score++;
    scoreSpan.textContent = score;
    correctSound.play();
  } else {
    btn.classList.add("incorrect");
    wrongSound.play();
  }

  setTimeout(nextQuestion, 800);
}

function nextQuestion() {
  index++;
  if (index < questions.length) showQuestion();
  else showResults();
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  highScoreSpan.textContent = highScore;

  resultMessage.textContent =
    score === questions.length
      ? "Perfect Score 🎉"
      : "Nice Try 👍";
}

restartBtn.addEventListener("click", () => {
  clickSound.play();
  resultScreen.classList.remove("active");
  startScreen.classList.add("active");
});
