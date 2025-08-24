const words = [
    // --- 10 Extremely Difficult (10%) ---
    "zymic", "qophs", "xylyl", "jibba", "knurl",
    "lymph", "crwth", "glyph", "phlox", "whorl",

    // --- 40 Nursing Related (40%) ---
    "nurse", "scrub", "glove", "vital", "pulse",
    "fever", "wound", "medic", "chart", "drain",
    "oxsat", "scope", "stool", "cough", "stool",
    "swabs", "hepar", "urine", "veins", "wards",
    "thera", "lamps", "hands", "shift", "blood",
    "graft", "cells", "salts", "gowns", "trays",
    "notes", "tests", "syrup", "bones", "lungs",
    "heart", "renal", "steth", "spasm", "drugs",

    // Extra Nursing Jargons (20)
    "ivflu", "ivbag", "iminj", "caths",
    "prnly", "abxrx", "oroom", "triag",
    "labrx", "units", "isoal", "rapid",
    "crash", "round", "clean", "stret",
    "npoed", "chart", "stret", "flush",

    // --- 50 Normal Words (50%) ---
    "apple", "chair", "spice", "train", "music",
    "light", "plant", "stone", "water", "smile",
    "bread", "cloud", "dream", "flame", "grape",
    "house", "jelly", "knife", "lemon", "magic",
    "night", "ocean", "pearl", "queen", "river",
    "sugar", "table", "unity", "voice", "wheat",
    "xenon", "young", "zebra", "amber", "beach",
    "candy", "dance", "eagle", "frost", "giant",
    "happy", "index", "jolly", "koala", "lemon",
    "mango", "noble", "orbit", "piano", "quiet",

    // --- Vital signs specific (20) ---
    "beats", "chill", "sweat", "flush", "shock",
    "brace", "cuffe", "temps", "prone", "supin",
    "oxide", "spo2s", "dying", "alert", "scale",
    "alarm", "trend", "score", "level", "rates"
];

const solution = words[Math.floor(Math.random() * words.length)];
const maxGuesses = 6;
let currentRow = 0;
let currentGuess = "";

const grid = document.getElementById("grid");
const message = document.getElementById("message");
const playAgainBtn = document.getElementById("playAgain");

// Build grid
for (let i = 0; i < maxGuesses; i++) {
    const row = document.createElement("div");
    row.classList.add("grid");
    for (let j = 0; j < 5; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        row.appendChild(tile);
    }
    grid.appendChild(row);
}

document.addEventListener("keydown", handleKey);

function handleKey(e) {
    if (currentRow >= maxGuesses) return;

    let key = e.key || e;
    if (key === "Enter") {
        if (currentGuess.length < 5) {
            showMessage("Not enough letters");
            return;
        }
        submitGuess();
    } else if (key === "Backspace") {
        removeLetter();
    } else if (/^[a-zA-Z]$/.test(key)) {
        addLetter(key.toLowerCase());
    }
}

function addLetter(letter) {
    if (currentGuess.length < 5) {
        const row = grid.children[currentRow];
        row.children[currentGuess.length].textContent = letter;
        currentGuess += letter;
    }
}

function removeLetter() {
    if (currentGuess.length > 0) {
        const row = grid.children[currentRow];
        row.children[currentGuess.length - 1].textContent = "";
        currentGuess = currentGuess.slice(0, -1);
    }
}

function submitGuess() {
    const row = grid.children[currentRow];
    const guess = currentGuess;

    for (let i = 0; i < 5; i++) {
        const tile = row.children[i];
        const letter = guess[i];
        const keyBtn = document.querySelector(`.key[data-key="${letter}"]`);

        if (guess[i] === solution[i]) {
            tile.classList.add("correct");
            keyBtn?.classList.remove("present", "absent");
            keyBtn?.classList.add("correct");
        } else if (solution.includes(guess[i])) {
            tile.classList.add("present");
            if (!keyBtn?.classList.contains("correct")) {
                keyBtn?.classList.remove("absent");
                keyBtn?.classList.add("present");
            }
        } else {
            tile.classList.add("absent");
            if (!keyBtn?.classList.contains("correct") &&
                !keyBtn?.classList.contains("present")) {
                keyBtn?.classList.add("absent");
            }
        }
    }

    if (guess === solution) {
        endGame(true);
    } else if (currentRow === maxGuesses - 1) {
        endGame(false);
    } else {
        currentRow++;
        currentGuess = "";
    }
}

function endGame(win) {
    if (win) {
        showMessage("🎉 You win!");
    } else {
        showMessage("❌ Game over! Word was: " + solution.toUpperCase());
    }
    document.removeEventListener("keydown", handleKey);
    playAgainBtn.style.display = "inline-block";
}

playAgainBtn.addEventListener("click", () => {
    location.reload();
});

function showMessage(msg) {
    message.textContent = msg;
}

// Build custom keyboard
const keyboardLayout = [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["Enter","z","x","c","v","b","n","m","Backspace"]
];

const keyboardDiv = document.getElementById("keyboard");

keyboardLayout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("key-row");

    row.forEach(key => {
        const keyBtn = document.createElement("div");
        keyBtn.classList.add("key");
        if (key === "Enter" || key === "Backspace") {
            keyBtn.classList.add("special");
        }
        if (key === "Backspace") {
            keyBtn.textContent = "⌫";
        } else if (key === "Enter") {
            keyBtn.textContent = "⏎";
        } else {
            keyBtn.textContent = key;
        }
        keyBtn.dataset.key = key;
        keyBtn.addEventListener("click", () => {
            handleKey(key);
        });
        rowDiv.appendChild(keyBtn);
    });

    keyboardDiv.appendChild(rowDiv);
});
