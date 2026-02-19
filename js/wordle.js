// =========================
// Wordle Game Script (JSON + Difficulty)
// =========================

let words = {};
let solution = "";
const maxGuesses = 6;
let currentRow = 0;
let currentGuess = "";

// DOM Elements
const grid = document.getElementById("grid");
const message = document.getElementById("message");
const keyboardDiv = document.getElementById("keyboard");
const gameOverOverlay = document.getElementById("gameOverOverlay");

// =========================
// Load words from JSON
// =========================
async function loadWords() {
    try {
        const response = await fetch("../../js/words.json"); // adjust path if needed
        words = await response.json();
        chooseSolution("medium"); // default difficulty
    } catch (err) {
        console.error("Failed to load words JSON", err);
    }
}

// =========================
// Choose a solution based on difficulty
// =========================
function chooseSolution(difficulty) {
    const wordArray = words[difficulty];
    solution = wordArray[Math.floor(Math.random() * wordArray.length)];
}

// =========================
// Keyboard Setup
// =========================
const keyboardLayout = [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["Enter","z","x","c","v","b","n","m","Backspace"]
];

function createKeyboard() {
    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("key-row");

        row.forEach(key => {
            const keyBtn = document.createElement("div");
            keyBtn.classList.add("key");
            if (key === "Enter" || key === "Backspace") keyBtn.classList.add("special");

            keyBtn.textContent = key === "Backspace" ? "⌫" : key === "Enter" ? "⏎" : key;
            keyBtn.dataset.key = key;
            keyBtn.addEventListener("click", () => handleKey(key));
            rowDiv.appendChild(keyBtn);
        });

        keyboardDiv.appendChild(rowDiv);
    });
}

// =========================
// Game Logic
// =========================
function handleKey(e) {
    if (currentRow >= maxGuesses) return;

    const key = e.key || e;

    if (key === "Enter") {
        if (currentGuess.length < 5) return showMessage("Not enough letters");
        submitGuess();
    } else if (key === "Backspace") {
        removeLetter();
    } else if (/^[a-zA-Z]$/.test(key)) {
        addLetter(key.toLowerCase());
    }
}

function addLetter(letter) {
    if (currentGuess.length >= 5) return;
    const row = grid.children[currentRow];
    row.children[currentGuess.length].textContent = letter;
    currentGuess += letter;
}

function removeLetter() {
    if (!currentGuess) return;
    const row = grid.children[currentRow];
    row.children[currentGuess.length - 1].textContent = "";
    currentGuess = currentGuess.slice(0, -1);
}

function submitGuess() {
    const row = grid.children[currentRow];
    for (let i = 0; i < 5; i++) {
        const tile = row.children[i];
        const letter = currentGuess[i];
        const keyBtn = document.querySelector(`.key[data-key="${letter}"]`);

        if (letter === solution[i]) {
            tile.classList.add("correct");
            keyBtn?.classList.replace("present", "correct");
        } else if (solution.includes(letter)) {
            tile.classList.add("present");
            if (!keyBtn?.classList.contains("correct")) keyBtn?.classList.add("present");
        } else {
            tile.classList.add("absent");
            if (!keyBtn?.classList.contains("correct") && !keyBtn?.classList.contains("present")) {
                keyBtn?.classList.add("absent");
            }
        }
    }

    if (currentGuess === solution) return endGame(true);
    if (currentRow === maxGuesses - 1) return endGame(false);

    currentRow++;
    currentGuess = "";
}

// =========================
// Game End
// =========================
function endGame(win) {
    gameOverOverlay.style.display = "flex";
    document.removeEventListener("keydown", handleKey);

    if (win) {
        winCount++;
        localStorage.setItem("winCount", winCount); // save to localStorage
        winScoreDisplay.textContent = winCount; // update score display
    }

    // Set overlay content with HTML
    gameOverOverlay.innerHTML = `
        <div class="overlay-content">
            <div class="overlay-title">${win ? "🎉 You Win! 🎉" : "Game Over"}</div>
            ${!win ? `<div class="overlay-word">The word was:</div><br><div class="correct">${solution.toUpperCase()}</div>` : ""}
            <button id="playAgainOverlay" class="overlay-btn">${win ? "Play again" : "Try again"}</button>
        </div>
    `;

    // Attach event listener to the new button
    const playAgainOverlayBtn = document.getElementById("playAgainOverlay");
    playAgainOverlayBtn.addEventListener("click", () => location.reload());
}

// =========================
// Helpers
// =========================
function showMessage(msg) {
    message.textContent = msg;
}

// =========================
// Initialize
// =========================
loadWords().then(() => {
    createKeyboard();
    document.addEventListener("keydown", handleKey);

    // Set default selected difficulty (medium)
    highlightSelectedDifficulty("medium");
});

// =========================
// Difficulty Switcher
// =========================
const difficultyButtons = document.querySelectorAll(".wordle-settings-card button");

difficultyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const diff = btn.dataset.difficulty;
        chooseSolution(diff);  // pick a new word
        currentDifficulty = diff;  // store current difficulty if needed
        resetGame();
        highlightSelectedDifficulty(diff);
    });
});

// Highlight selected difficulty button
function highlightSelectedDifficulty(diff) {
    difficultyButtons.forEach(btn => {
        btn.classList.toggle("selected", btn.dataset.difficulty === diff);
    });
}

// Reset game state and UI
function resetGame() {
    currentRow = 0;
    currentGuess = "";

    // Clear grid tiles
    const rows = grid.children;
    for (let r of rows) {
        for (let tile of r.children) {
            tile.textContent = "";
            tile.className = "tile";
        }
    }

    // Clear keyboard container and rebuild keyboard
    keyboardDiv.innerHTML = "";
    createKeyboard();

    // Hide overlay
    gameOverOverlay.style.display = "none";
    message.textContent = "";

    // Re-enable keyboard input
    document.addEventListener("keydown", handleKey);
}

let winCount = parseInt(localStorage.getItem("winCount")) || 0;
const winScoreDisplay = document.getElementById("winScore");
winScoreDisplay.textContent = winCount; // display initial score