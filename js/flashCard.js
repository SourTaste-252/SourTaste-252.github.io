// DOM elements
const cardSetSelection = document.getElementById('card-set-selection');
const cardSetButtons = document.getElementById('card-set-buttons');
const cardFlipSection = document.getElementById('card-flip');
const backToSetsBtn = document.getElementById('back-to-sets');

const cardWrapper = document.querySelector('.flashCard-wrapper');
const frontDiv = cardWrapper.querySelector('.flashCard-flip-front');
const backDiv = cardWrapper.querySelector('.flashCard-flip-back');

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
}

// ------------------ Display card ------------------
function showCard(index) {
    if (index >= cards.length) {
        frontDiv.textContent = "No more cards!";
        backDiv.textContent = "";
        return;
    }
    const cardData = cards[index];
    frontDiv.textContent = cardData.front;
    backDiv.textContent = cardData.back;
}

// ------------------ Flip card ------------------
cardWrapper.addEventListener("click", () => {
    cardWrapper.classList.toggle("flipped");
});

// ------------------ Swipe detection ------------------
cardWrapper.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
    isDragging = true;
    cardWrapper.style.transition = "none";
});

cardWrapper.addEventListener("touchmove", e => {
    if (!isDragging) return;

    currentDragX = e.changedTouches[0].screenX - touchStartX;

    cardWrapper.style.transform =
        `translateX(${currentDragX}px) rotate(${currentDragX * 0.05}deg)`;

    // Remove old glow
    cardWrapper.classList.remove("drag-left", "drag-right");

    // Only show glow after threshold
    if (Math.abs(currentDragX) > glowThreshold) {
        if (currentDragX > 0) {
            cardWrapper.classList.add("drag-right");
        } else {
            cardWrapper.classList.add("drag-left");
        }
    }
});

cardWrapper.addEventListener("touchend", e => {
    isDragging = false;
    touchEndX = e.changedTouches[0].screenX;

    cardWrapper.style.transition = "transform 0.3s ease";
    cardWrapper.style.transform = "";

    cardWrapper.classList.remove("drag-left", "drag-right");

    handleSwipe();
});


// ------------------ Handle swipe logic ------------------

function handleSwipe() {
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
    // Apply blur immediately to back face to hide next card content
    backDiv.style.filter = "blur(16px)";

    // Add a slight delay to allow swipe animation to play
    setTimeout(() => {
        // Move to next card
        currentCardIndex++;
        showCard(currentCardIndex);

        // Reset classes to prepare for next flip
        cardWrapper.classList.remove("swipe-right", "swipe-left", "flipped");

        // Remove blur after content has updated
        backDiv.style.filter = "";
    }, 500); // matches swipe animation duration
}

// ------------------ Back to selection ------------------
backToSetsBtn.addEventListener("click", () => {
    cardFlipSection.style.display = "none";
    cardSetSelection.style.display = "block";

    // Reset card state
    cards = [];
    currentCardIndex = 0;

    // Buttons remain fixed; no rebuild needed
});

// ------------------ Previous Card Button ------------------
const prevCardBtn = document.getElementById("prev-card-btn");

prevCardBtn.addEventListener("click", () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showCard(currentCardIndex);

        cardWrapper.classList.remove("flipped", "swipe-left", "swipe-right");

        backDiv.style.filter = "blur(5px)";
        setTimeout(() => backDiv.style.filter = "", 200);
    }
});


// ------------------ Button event listener ------------------
prevCardBtn.addEventListener('click', prevCard);
