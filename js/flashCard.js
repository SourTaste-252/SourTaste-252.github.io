// DOM elements
const cardSetSelection = document.getElementById('card-set-selection');
const cardSetButtons = document.getElementById('card-set-buttons');
const cardFlipSection = document.getElementById('card-flip');
const backToSetsBtn = document.getElementById('back-to-sets');

const cardWrapper = document.querySelector('.flashCard-wrapper');
const frontDiv = cardWrapper.querySelector('.flashCard-flip-front');
const backDiv = cardWrapper.querySelector('.flashCard-flip-back');

const cardProgress = document.getElementById("card-progress");

let cards = [];
let currentCardIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

let isDragging = false;
let currentDragX = 0;
const glowThreshold = 30;

// Available flashcard sets
const flashcardFiles = ["Cards", "Test"]; // filenames only

// ------------------ Create card set buttons ONCE ------------------
async function buildCardSetButtons() {
    if (cardSetButtons.children.length > 0) return;

    for (const file of flashcardFiles) {
        try {
            const res = await fetch(`../../js/Cards/${file}.json`);
            const data = await res.json();

            const btn = document.createElement("button");
            btn.textContent = data.name;           // <-- JSON controls UI name
            btn.classList.add("card-buttons");
            btn.addEventListener("click", () => loadCards(file));

            cardSetButtons.appendChild(btn);
        } catch (err) {
            console.error(`Failed to load ${file}:`, err);
        }
    }
}

buildCardSetButtons();

// ------------------ Load selected card set ------------------

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function loadCards(flashcardSet) {
    try {
        const res = await fetch(`../../js/Cards/${flashcardSet}.json`);
        if (!res.ok) throw new Error("HTTP error " + res.status);

        const data = await res.json();

        cards = [...data.cards];   // copy array
        shuffleArray(cards);       // 🔥 shuffle once here

        currentCardIndex = 0;
        showCard(currentCardIndex);

        cardSetSelection.style.display = "none";
        cardFlipSection.style.display = "block";
    } catch (err) {
        console.error("Failed to load cards:", err);
        frontDiv.textContent = "Failed to load cards!";
        backDiv.textContent = "";
    }

    updateProgress();
}

// ------------------ Display card ------------------
function showCard(index) {
    const total = cards.length;

    if (index >= total) {
        frontDiv.innerHTML = "No more cards!";
        backDiv.innerHTML = "";
        currentCardIndex = total; // Clamp to total
        updateProgress();
        return;
    }

    const cardData = cards[index];

    // ---------- FRONT ----------
    frontDiv.innerHTML = "";
    const frontText = document.createElement("div");
    frontText.textContent = cardData.front;
    frontDiv.appendChild(frontText);

    if (cardData.frontImg) {
        const img = document.createElement("img");
        img.src = cardData.frontImg;
        img.classList.add("card-image");
        frontDiv.appendChild(img);
    }

    // ---------- BACK ----------
    backDiv.innerHTML = "";
    const backText = document.createElement("div");
    backText.textContent = cardData.back;
    backDiv.appendChild(backText);

    if (cardData.backImg) {
        const img = document.createElement("img");
        img.src = cardData.backImg;
        img.classList.add("card-image");
        backDiv.appendChild(img);
    }

    updateProgress();
}

function updateProgress() {
    const total = cards.length;
    const current = Math.min(currentCardIndex + 1, total); // clamp to total

    cardProgress.textContent = `${current} / ${total}`;
}


// ------------------ Flip card ------------------
cardWrapper.addEventListener("click", () => {
    cardWrapper.classList.toggle("flipped");
});

// ------------------ Swipe detection ------------------
cardWrapper.addEventListener("touchstart", e => {
    if (currentCardIndex >= cards.length) return; // 🚫 ignore swipe
    touchStartX = e.changedTouches[0].screenX;
    isDragging = true;
    cardWrapper.style.transition = "none";
});

cardWrapper.addEventListener("touchmove", e => {
    if (!isDragging || currentCardIndex >= cards.length) return; // 🚫 ignore swipe
    currentDragX = e.changedTouches[0].screenX - touchStartX;

    cardWrapper.style.transform =
        `translateX(${currentDragX}px) rotate(${currentDragX * 0.05}deg)`;

    cardWrapper.classList.remove("drag-left", "drag-right");

    if (Math.abs(currentDragX) > glowThreshold) {
        if (currentDragX > 0) {
            cardWrapper.classList.add("drag-right");
        } else {
            cardWrapper.classList.add("drag-left");
        }
    }
});

cardWrapper.addEventListener("touchend", e => {
    if (currentCardIndex >= cards.length) return; // 🚫 ignore swipe
    isDragging = false;
    touchEndX = e.changedTouches[0].screenX;

    cardWrapper.style.transition = "transform 0.3s ease";
    cardWrapper.style.transform = "";

    cardWrapper.classList.remove("drag-left", "drag-right");

    handleSwipe();
});


// ------------------ Handle swipe logic ------------------

function handleSwipe() {
    if (currentCardIndex >= cards.length) return; // 🚫 ignore swipe

    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 80;

    if (deltaX > swipeThreshold) {
        cardWrapper.classList.add("swipe-right");
        nextCard();
    } 
    else if (deltaX < -swipeThreshold) {
        cardWrapper.classList.add("swipe-left");
        nextCard();
    }
}

// ------------------ Next card ------------------
function nextCard() {
    if (currentCardIndex >= cards.length) return; // stop if no more cards

    backDiv.style.filter = "blur(16px)";

    setTimeout(() => {
        currentCardIndex++;
        showCard(currentCardIndex);

        cardWrapper.classList.remove("swipe-right", "swipe-left", "flipped");
        backDiv.style.filter = "";
    }, 500);
}

// ------------------ Back to selection ------------------
backToSetsBtn.addEventListener("click", () => {
    cardFlipSection.style.display = "none";
    cardSetSelection.style.display = "block";

    // Reset card state
    cards = [];
    currentCardIndex = 0;
    cardProgress.textContent = "0 / 0";

    // Buttons remain fixed; no rebuild needed
});

// ------------------ Previous Card Button ------------------
const prevCardBtn = document.getElementById("prev-card-btn");

prevCardBtn.addEventListener("click", () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showCard(currentCardIndex);
        updateProgress();

        cardWrapper.classList.remove("flipped", "swipe-left", "swipe-right");

        backDiv.style.filter = "blur(5px)";
        setTimeout(() => backDiv.style.filter = "", 200);
    }
});


// ------------------ Button event listener ------------------
prevCardBtn.addEventListener('click', prevCardBtn);
