const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark");
    themeBtn.textContent = "Dark Mode";
  }
}

themeBtn.addEventListener("click", () => {
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "light");
    applyTheme("light");
  } else {
    localStorage.setItem("theme", "dark");
    applyTheme("dark");
  }
});

applyTheme(localStorage.getItem("theme"));

// error and loading helpers
const errorBox = document.getElementById("error");
const loading = document.getElementById("loading");

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

// save and load the API key
const apiKeyInput = document.getElementById("apiKey");
const saveKeyBtn = document.getElementById("saveKeyBtn");

apiKeyInput.value = localStorage.getItem("apiKey") || "";

saveKeyBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (key === "") {
    showError("Please enter your API key first.");
    return;
  }
  localStorage.setItem("apiKey", key);
  hideError();
  alert("API key saved in your browser.");
});

// character counter
const notesInput = document.getElementById("notes");
const charCount = document.getElementById("charCount");

notesInput.addEventListener("input", () => {
  charCount.textContent = notesInput.value.length;
});

// tabs (summary / quiz / flashcards)
const summaryTab = document.getElementById("summaryTab");
const quizTab = document.getElementById("quizTab");
const flashTab = document.getElementById("flashTab");
const summaryBox = document.getElementById("summaryBox");
const quizBox = document.getElementById("quizBox");
const flashBox = document.getElementById("flashBox");

function showTab(name) {
  summaryBox.classList.add("hidden");
  quizBox.classList.add("hidden");
  flashBox.classList.add("hidden");

  // highlight the active tab button
  summaryTab.classList.remove("active");
  quizTab.classList.remove("active");
  flashTab.classList.remove("active");

  if (name === "summary") {
    summaryBox.classList.remove("hidden");
    summaryTab.classList.add("active");
  } else if (name === "quiz") {
    quizBox.classList.remove("hidden");
    quizTab.classList.add("active");
  } else {
    flashBox.classList.remove("hidden");
    flashTab.classList.add("active");
  }
}

summaryTab.addEventListener("click", () => showTab("summary"));
quizTab.addEventListener("click", () => showTab("quiz"));
flashTab.addEventListener("click", () => showTab("flashcards"));

// build the prompt
function buildPrompt(notes, style) {
  const styles = {
    eli10: "Explain in very simple words, like I am 10 years old.",
    exam: "Focus on key points and facts useful for an exam.",
    detailed: "Give a detailed and complete explanation."
  };

  return `You are a study assistant. ${styles[style]}
Use the notes below and reply ONLY in JSON, with no extra text, in exactly this format:
{
  "summary": "short summary text",
  "quiz": [
    { "question": "text", "options": ["A", "B", "C", "D"], "answerIndex": 0 }
  ],
  "flashcards": [
    { "front": "question or term", "back": "answer or meaning" }
  ]
}
Give exactly 5 quiz questions with 4 options each. answerIndex is the position (0 to 3) of the correct option. Give 6 flashcards.

Notes:
${notes}`;
}

// call the Gemini API (POST request)
// check the model name in the Gemini docs if this stops working
const MODEL = "gemini-2.5-flash";

async function callGemini(prompt, key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
  } catch (error) {
    throw new Error("Network error. Please check your internet connection.");
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      throw new Error("Invalid API key. Please check your key in Settings.");
    } else if (response.status === 429) {
      throw new Error("Too many requests (rate limit). Please wait a minute and try again.");
    } else {
      throw new Error(`Something went wrong. Status code: ${response.status}`);
    }
  }

  const data = await response.json();
  console.log(data); // check where the answer text is located

  return data.candidates[0].content.parts[0].text;
}

// parse and check the AI reply
function parseResult(text) {
  let result;
  try {
    result = JSON.parse(text);
  } catch (error) {
    throw new Error("The AI reply was not in the correct format. Please try again.");
  }

  const { summary, quiz, flashcards } = result;

  if (typeof summary !== "string" || summary === "") {
    throw new Error("The AI reply has no summary. Please try again.");
  }
  if (!Array.isArray(quiz) || quiz.length === 0) {
    throw new Error("The AI reply has no quiz. Please try again.");
  }
  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    throw new Error("The AI reply has no flashcards. Please try again.");
  }

  return result;
}

// summary (show, copy, download, read aloud)
const summaryText = document.getElementById("summaryText");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const speakBtn = document.getElementById("speakBtn");
const stopBtn = document.getElementById("stopBtn");

function showSummary(summary) {
  summaryText.textContent = summary;
}

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(summaryText.textContent);
  alert("Summary copied!");
});

downloadBtn.addEventListener("click", () => {
  const file = new Blob([summaryText.textContent], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "summary.txt";
  link.click();
});

speakBtn.addEventListener("click", () => {
  const speech = new SpeechSynthesisUtterance(summaryText.textContent);
  speechSynthesis.speak(speech);
});

stopBtn.addEventListener("click", () => {
  speechSynthesis.cancel();
});

// quiz
const quizArea = document.getElementById("quizArea");
const scoreText = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

let quizQuestions = [];
let currentQuestion = 0;
let score = 0;

function showQuestion() {
  quizArea.innerHTML = "";
  const q = quizQuestions[currentQuestion];

  const questionText = document.createElement("p");
  questionText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}: ${q.question}`;
  quizArea.appendChild(questionText);

  for (let i = 0; i < q.options.length; i++) {
    const optionBtn = document.createElement("button");
    optionBtn.textContent = q.options[i];
    optionBtn.addEventListener("click", () => checkAnswer(i));
    quizArea.appendChild(optionBtn);
  }
}

function checkAnswer(chosen) {
  const correct = quizQuestions[currentQuestion].answerIndex;
  const buttons = quizArea.querySelectorAll("button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
    if (i === correct) {
      buttons[i].classList.add("correct");
    }
  }

  if (chosen === correct) {
    score++;
  } else {
    buttons[chosen].classList.add("wrong");
  }
  scoreText.textContent = `Score: ${score} / ${quizQuestions.length}`;
}

nextBtn.addEventListener("click", () => {
  if (quizQuestions.length === 0) {
    return;
  }
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    quizArea.innerHTML = `<p>Quiz finished! Your score is ${score} out of ${quizQuestions.length}.</p>`;
  }
});

function startQuiz(questions) {
  quizQuestions = questions;
  currentQuestion = 0;
  score = 0;
  scoreText.textContent = `Score: 0 / ${quizQuestions.length}`;
  showQuestion();
}

// flashcards
const card = document.getElementById("card");
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const knownBtn = document.getElementById("knownBtn");
const unknownBtn = document.getElementById("unknownBtn");
const knownCount = document.getElementById("knownCount");

let flashcards = [];
let currentCard = 0;
let showingFront = true;
let knownList = [];

function showCard() {
  const c = flashcards[currentCard];
  card.textContent = showingFront ? c.front : c.back;
}

function updateKnownCount() {
  let count = 0;
  for (let i = 0; i < knownList.length; i++) {
    if (knownList[i] === true) {
      count++;
    }
  }
  knownCount.textContent = `Known: ${count} / ${flashcards.length}`;
}

card.addEventListener("click", () => {
  if (flashcards.length === 0) {
    return;
  }
  showingFront = !showingFront;
  showCard();
});

nextCardBtn.addEventListener("click", () => {
  if (flashcards.length === 0) {
    return;
  }
  if (currentCard < flashcards.length - 1) {
    currentCard++;
    showingFront = true;
    showCard();
  }
});

prevCardBtn.addEventListener("click", () => {
  if (flashcards.length === 0) {
    return;
  }
  if (currentCard > 0) {
    currentCard--;
    showingFront = true;
    showCard();
  }
});

knownBtn.addEventListener("click", () => {
  if (flashcards.length === 0) {
    return;
  }
  knownList[currentCard] = true;
  updateKnownCount();
});

unknownBtn.addEventListener("click", () => {
  if (flashcards.length === 0) {
    return;
  }
  knownList[currentCard] = false;
  updateKnownCount();
});

function startFlashcards(cards) {
  flashcards = cards;
  currentCard = 0;
  showingFront = true;
  knownList = [];
  for (let i = 0; i < cards.length; i++) {
    knownList.push(false);
  }
  showCard();
  updateKnownCount();
}

// show all three outputs
function showResult(result) {
  const { summary, quiz, flashcards } = result;
  showSummary(summary);
  startQuiz(quiz);
  startFlashcards(flashcards);
  showTab("summary");
}

// history
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearBtn");

function getHistory() {
  const saved = localStorage.getItem("history");
  if (saved === null) {
    return [];
  }
  return JSON.parse(saved);
}

function saveToHistory(notes, result) {
  const history = getHistory();
  history.push({
    title: notes.substring(0, 30) + "...",
    result: result
  });
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  const history = getHistory();

  for (let i = 0; i < history.length; i++) {
    const item = document.createElement("li");
    item.textContent = history[i].title;
    item.addEventListener("click", () => showResult(history[i].result));
    historyList.appendChild(item);
  }
}

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("history");
  renderHistory();
});

// generate button
const styleSelect = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");

async function generate() {
  hideError();

  const key = apiKeyInput.value.trim();
  const notes = notesInput.value.trim();
  const style = styleSelect.value;

  if (key === "") {
    showError("No API key. Please add your Gemini API key in Settings.");
    return;
  }
  if (notes === "") {
    showError("Please enter some notes or a topic first.");
    return;
  }

  generateBtn.disabled = true;
  loading.classList.remove("hidden");

  try {
    const prompt = buildPrompt(notes, style);
    const text = await callGemini(prompt, key);
    const result = parseResult(text);
    showResult(result);
    saveToHistory(notes, result);
  } catch (error) {
    showError(error.message);
  } finally {
    generateBtn.disabled = false;
    loading.classList.add("hidden");
  }
}

generateBtn.addEventListener("click", generate);

// run when the page loads
renderHistory();
showTab("summary");