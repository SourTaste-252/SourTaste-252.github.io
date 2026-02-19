// ======================= DOM ELEMENTS =======================
const quizMenu = document.getElementById('quizMenu');
const quizSection = document.getElementById('quizSection');
const quizContainer = document.getElementById('quizContainer');
const resultDisplay = document.getElementById('resultDisplay');
const quizTitle = document.getElementById('quizTitle');

const submitBtn = document.getElementById('submitQuizBtn');
const restartBtn = document.getElementById('restartQuizBtn');
const backBtn = document.getElementById('backToMenuBtn');
const clueBtn = document.getElementById('clueBtn');

// ======================= BOTTOM TRAY =======================
const tray = document.getElementById('bottomTray');
const trayToggle = document.getElementById('trayToggle');
let trayCollapsed = false;
tray.classList.add('hidden');

const showBottomTray = () => {
    tray.style.display = "flex";
    tray.classList.remove('hidden', 'collapsed');
    trayCollapsed = false;
    trayToggle.textContent = "▼";
};

const hideBottomTray = () => {
    tray.classList.add('hidden');
    tray.classList.remove('collapsed');
    trayCollapsed = false;
};

trayToggle.addEventListener('click', () => {
    trayCollapsed = !trayCollapsed;
    tray.classList.toggle('collapsed', trayCollapsed);
    trayToggle.textContent = trayCollapsed ? "▲" : "▼";
});

// ======================= LOAD QUIZ =======================
async function loadQuiz(quizName) {
    quizTitle.textContent = quizName;
    quizContainer.innerHTML = `<p>Loading quiz...</p>`;

    try {
        const res = await fetch(`../../js/Quizes_FITB/${quizName}.json`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const quiz = await res.json();

        if (!quiz?.paragraphs?.length) {
            quizContainer.innerHTML = `<p style="color:red;">Quiz not found or empty.</p>`;
            return;
        }

        generateQuiz(quiz.paragraphs);
        setupQuizLogic();

        quizMenu.style.display = "none";
        quizSection.style.display = "block";
        showBottomTray();
    } catch (err) {
        console.error("Error loading quiz:", err);
        quizContainer.innerHTML = `<p style="color:red;">Failed to load quiz data.</p>`;
    }
}

// ======================= GENERATE QUIZ HTML =======================
function generateQuiz(paragraphs) {
    quizContainer.innerHTML = paragraphs.map(item => {
        if (item.title && !item.text) {
            return `<div class="quiz-section-title"><h3>${item.title}</h3><hr></div>`;
        }

        const paragraphHTML = item.text.replace(/'([^']+)'/g, (match, answer) =>
            `<input type="text" class="blank-input" data-answer="${answer.trim()}">`
        );

        const rationaleHTML = item.rationale?.trim() ? `<p><strong>Rationale:</strong> ${item.rationale}</p>` : '';

        return `<div class="quiz-block"><p>${paragraphHTML}</p>${rationaleHTML}</div>`;
    }).join('');

    quizContainer.querySelectorAll('.blank-input').forEach(input => {
        input.style.width = `${Math.max(input.dataset.answer.length + 1, 4)}ch`;
        input.style.textAlign = 'center';
    });
}

// ======================= QUIZ LOGIC =======================
function setupQuizLogic() {
    const inputs = quizContainer.querySelectorAll('.blank-input');

    // Submit quiz
    submitBtn.onclick = () => {
        let correctCount = 0;
        inputs.forEach(input => {
            const correct = input.dataset.answer.trim().toLowerCase();
            const user = input.value.trim().toLowerCase();
            input.style.borderBottomColor = user === correct ? 'limegreen' : 'red';
            if (user === correct) correctCount++;
        });
        resultDisplay.textContent = `Score: ${correctCount} / ${inputs.length}`;
    };

    // Show/hide clues
    const toggleClues = show => inputs.forEach(i => i.placeholder = show ? i.dataset.answer : '');
    ['mousedown', 'touchstart'].forEach(e => clueBtn.addEventListener(e, () => toggleClues(true)));
    ['mouseup', 'mouseleave', 'touchend'].forEach(e => clueBtn.addEventListener(e, () => toggleClues(false)));

    // Restart quiz
    restartBtn.onclick = () => {
        inputs.forEach(i => { i.value = ''; i.placeholder = ''; i.style.borderBottomColor = ''; });
        resultDisplay.textContent = '';
    };

    // Back to menu
    backBtn.onclick = () => {
        quizSection.style.display = 'none';
        quizMenu.style.display = 'flex';
        resultDisplay.textContent = '';
        hideBottomTray();
    };
}

// ======================= MENU SELECTION =======================
// Dynamically create buttons for all available quizzes
const availableQuizzes = ["Quiz1", "Quiz2"]; // Add your JSON quiz names here
quizMenu.innerHTML = ''; // Clear menu
availableQuizzes.forEach(name => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.addEventListener('click', () => loadQuiz(name));
    quizMenu.appendChild(btn);
});
