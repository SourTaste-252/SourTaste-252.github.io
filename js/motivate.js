const jar = document.getElementById('motivate-jar');

const quoteBox = document.getElementById('quote');
quoteBox.classList.add("initial-state");
quoteBox.textContent = "Tap the jar to get your first quote!";



let quotes = [];

// Load quotes from JSON
async function loadQuotes() {
    try {
        const response = await fetch("../../js/quotes.json");
        quotes = await response.json();
        // Do not show any quote yet — wait for first jar tap
    } catch (err) {
        console.error('Failed to load quotes:', err);
        quoteBox.textContent = "Failed to load quotes.";
    }
}

// Show random quote
function showRandomQuote() {
    if (!quotes.length) return;
    const { text, author } = quotes[Math.floor(Math.random() * quotes.length)];
    quoteBox.innerHTML = `
        <div style=" font-style: italic">"${text}"</div> <div style="font-weight: light; font-size: 0.8rem;">-${author}</div>
    `;
    saveBtn.classList.remove("hidden");

}

function pulseQuoteBackground(color) {
    quoteBox.style.transition = "background-color 0.4s ease, box-shadow 0.4s ease";
    quoteBox.style.backgroundColor = color;
    quoteBox.style.boxShadow = `0 0 20px ${color}55`;

    // fade back after pulse
    setTimeout(() => {
        quoteBox.style.backgroundColor = "";
        quoteBox.style.boxShadow = "";
    }, 450);
}

const saveBtn = document.getElementById("saveQuoteBtn");
const savedList = document.getElementById("savedQuotesList");
const toggleSavedBtn = document.getElementById("toggleSavedBtn");

let savedQuotes = JSON.parse(localStorage.getItem("savedQuotes")) || [];

// Render saved quotes
function renderSavedQuotes() {
    savedList.innerHTML = "";

    if (!savedQuotes.length) {
        savedList.innerHTML = "<div class='saved-quote-item'>No saved quotes yet.</div>";
        return;
    }

    savedQuotes.forEach((q, index) => {
        const div = document.createElement("div");
        div.classList.add("saved-quote-item");

        div.innerHTML = `
            <div class="delete-progress"></div>
            "${q.text}" <br><small>- ${q.author}</small>
        `;

        let holdTimer = null;

        const startHold = () => {
            div.classList.add("holding");

            holdTimer = setTimeout(() => {
                // delete after 3s
                savedQuotes.splice(index, 1);
                localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
                renderSavedQuotes();
            }, 3000);
        };

        const cancelHold = () => {
            div.classList.remove("holding");
            clearTimeout(holdTimer);
        };

        // Mouse
        div.addEventListener("mousedown", startHold);
        div.addEventListener("mouseup", cancelHold);
        div.addEventListener("mouseleave", cancelHold);

        // Touch
        div.addEventListener("touchstart", startHold);
        div.addEventListener("touchend", cancelHold);
        div.addEventListener("touchcancel", cancelHold);

        savedList.appendChild(div);
    });
}


// Save current quote
function saveCurrentQuote() {
    const parts = quoteBox.querySelectorAll("div");
    if (parts.length < 2) return;

    const text = parts[0].innerText.replace(/"/g, "").trim();
    const author = parts[1].innerText.replace("-", "").trim();

    if (!text || !author) return;

    const exists = savedQuotes.some(q => q.text === text && q.author === author);
    if (exists) return;

    savedQuotes.push({ text, author });
    localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));

    // Only update saved list — DO NOT TOUCH quoteBox
    renderSavedQuotes();
}
savedList.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});



// Toggle dropdown
toggleSavedBtn.addEventListener("click", () => {
    savedList.classList.toggle("open");
    toggleSavedBtn.classList.toggle("open");
});

saveBtn.addEventListener("click", saveCurrentQuote);


// Pop strip effect
function popStrip() {
    const lidSpawn = document.querySelector(".lid-spawn");
    const quoteBox = document.getElementById("quote");
    if (!lidSpawn || !quoteBox) return;

    // get viewport-based positions
    const spawnRect = lidSpawn.getBoundingClientRect();
    const targetRect = quoteBox.getBoundingClientRect();

    // Create strip
    const strip = document.createElement("div");
    strip.classList.add("fly-strip");
    strip.style.position = "fixed"; 
    strip.style.transformOrigin = "top left";

    // Random sizes
    const width = Math.random() * (220 - 160) + 160;
    const height = Math.random() * (70 - 60) + 60;

    strip.style.width = `${width}px`;
    strip.style.height = `${height}px`;

    // DO NOT CHANGE — your spawn logic
    const startX = spawnRect.left + (spawnRect.width / 2) - (width / 3);
    const startY = spawnRect.top - height - 410;

    strip.style.left = `${startX}px`;
    strip.style.top = `${startY}px`;

    // Random gradient
    const gradients = [
        "linear-gradient(90deg, #ffb74d, #635526)",
        "linear-gradient(90deg, #08690d, #aed581)",
        "linear-gradient(90deg, #64b5f6, #f74ff4)",
        "linear-gradient(90deg, #5d016d, #06c3bd)",
        "linear-gradient(90deg, #aeff00, #ffd180)",
        "linear-gradient(90deg, #ff1111, #c86bac)"
    ];
    const chosen = gradients[Math.floor(Math.random() * gradients.length)];
    strip.style.background = chosen;

    // extract the first color from "linear-gradient(...)"
    const match = chosen.match(/#([0-9a-f]{3,6})/i);
    const pulseColor = match ? match[0] : "#ffffff";

    // pulse quote background using strip color
    pulseQuoteBackground(pulseColor);

    // Styling
    strip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
    strip.style.borderRadius = "8px";
    strip.style.opacity = "1";

    document.body.appendChild(strip);

    // random exit direction
    const initialAngle = (Math.random() * 360 - 0); // wider & natural flutter
    const initialPop = Math.random() * 35 + 15;     // distance of first pop

    // random rotation
    const initialRotation = Math.random() * 20 - 25;

    // random sideways curve (flutter-like)
    const drift = Math.random() * 50 - 55;

    // random wobble mid-flight
    const wobble = Math.random() * 0.3 + 0.1;

    strip.style.transition = "transform 0.25s ease-out";

    // Step 1 — small pop + random angle
    requestAnimationFrame(() => {
        strip.style.transform =
            `translate(${Math.cos(initialAngle) * initialPop}px,
                       ${Math.sin(initialAngle) * -initialPop}px)
             rotate(${initialRotation}deg)`;
    });

    // Step 2 — full flight (curve + drift + spin)
    setTimeout(() => {
        const endX = targetRect.left + targetRect.width / 2 - width / 4; // DO NOT CHANGE
        const endY = targetRect.top + targetRect.height / 2 - height / 2;

        const deltaX = endX - startX + drift; // add curve
        const deltaY = endY - startY;

        const finalSpin = Math.random() * 360 - 180;

        strip.style.transition =
            `transform 0.8s cubic-bezier(.25,.8,.25,1), opacity 0.8s ease-in`;

        strip.style.transform =
            `translate(${deltaX}px, ${deltaY}px)
             rotate(${finalSpin}deg)
             scale(${wobble})`;

        strip.style.opacity = "0";
    }, 300);

    setTimeout(() => strip.remove(), 1200);
}







// Lid animation and click logic
let closeTimeout;

jar.addEventListener("click", () => {

    const firstTap = quoteBox.classList.contains("initial-state");

    popStrip(); // always pop strip immediately

    if (firstTap) {
        // Remove initial-state so this runs only once
        quoteBox.classList.remove("initial-state");

        // Start the delay **after first tap**
        setTimeout(() => {
            showRandomQuote();
        }, 800); // delay in ms, adjust as needed
    } else {
        // Subsequent taps — shorter delay so animation feels responsive
        setTimeout(() => {
            showRandomQuote();
        }, 800);
    }

    // Trigger lid opening
    jar.classList.add("open");
    jar.classList.remove("closing");

    clearTimeout(closeTimeout);

    closeTimeout = setTimeout(() => {
        jar.classList.remove("open");
        jar.classList.add("closing");

        setTimeout(() => jar.classList.remove("closing"), 600);
    }, 600);
});

const strips = document.querySelectorAll('.strip');

strips.forEach(strip => {
    // Random values for floating
    const x1 = (Math.random() * 20 - 10) + "px"; // horizontal drift
    const y1 = (Math.random() * 10 - 5) + "px";  // vertical drift
    const r1 = (Math.random() * 10 - 5) + "deg"; // rotation
    const s1 = 1 + Math.random() * 0.1;          // scale
    const o1 = 0.8 + Math.random() * 0.2;        // opacity

    const x2 = (Math.random() * 20 - 10) + "px";
    const y2 = (Math.random() * 10 - 5) + "px";
    const r2 = (Math.random() * 10 - 5) + "deg";
    const s2 = 1 + Math.random() * 0.1;
    const o2 = 0.8 + Math.random() * 0.2;

    const x3 = (Math.random() * 20 - 10) + "px";
    const y3 = (Math.random() * 10 - 5) + "px";
    const r3 = (Math.random() * 10 - 5) + "deg";
    const s3 = 1 + Math.random() * 0.1;
    const o3 = 0.8 + Math.random() * 0.2;

    // Apply CSS variables
    strip.style.setProperty('--x1', x1);
    strip.style.setProperty('--y1', y1);
    strip.style.setProperty('--r1', r1);
    strip.style.setProperty('--s1', s1);
    strip.style.setProperty('--o1', o1);

    strip.style.setProperty('--x2', x2);
    strip.style.setProperty('--y2', y2);
    strip.style.setProperty('--r2', r2);
    strip.style.setProperty('--s2', s2);
    strip.style.setProperty('--o2', o2);

    strip.style.setProperty('--x3', x3);
    strip.style.setProperty('--y3', y3);
    strip.style.setProperty('--r3', r3);
    strip.style.setProperty('--s3', s3);
    strip.style.setProperty('--o3', o3);

    // Random animation duration and delay
    const duration = 3 + Math.random() * 2; // 3–5s
    const delay = Math.random() * 2;        // 0–2s
    strip.style.animation = `floatStrips ${duration}s ease-in-out ${delay}s infinite alternate`;
});



// Initialize
renderSavedQuotes();

loadQuotes();
createParticles();
