const quotes = [
  // ------------------ Professional Quotes (50%) ------------------
  { text: "Nursing is an art: and if it is to be made an art, it requires an exclusive devotion as hard a preparation, as any painter's or sculptor's work.", author: "Florence Nightingale" },
  { text: "Save one life, you’re a hero. Save 100 lives, you’re a nurse.", author: "Unknown" },
  { text: "Nurses dispense comfort, compassion, and caring without even a prescription.", author: "Val Saintsbury" },
  { text: "The character of the nurse is as important as the knowledge she possesses.", author: "Carolyn Jarvis" },
  { text: "Every nurse was drawn to nursing because of a desire to care, to serve, or to help.", author: "Christina Feist-Heilmeier" },
  { text: "Caring is the essence of nursing.", author: "Jean Watson" },
  { text: "Nursing is not for the faint of heart, but for those who love deeply.", author: "Unknown" },
  { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
  { text: "Nurses may not be angels, but they are the next best thing.", author: "Unknown" },
  { text: "A nurse will always give us hope, an angel with a stethoscope.", author: "Terri Guillemets" },
  { text: "Nursing is an art of compassion, patience, and courage.", author: "Unknown" },
  { text: "Let your heart guide your hands.", author: "Unknown" },
  { text: "Nursing is a work of heart.", author: "Unknown" },
  { text: "Nurses are the heart of healthcare.", author: "Donna Wilk Cardillo" },
  { text: "A good nurse is not the one who knows everything but the one who cares enough to learn everything.", author: "Unknown" },
  { text: "Healing is a matter of time, but it is sometimes also a matter of opportunity.", author: "Hippocrates" },
  { text: "Nursing is not just a career, it’s a calling.", author: "Unknown" },
  { text: "The very first requirement in a hospital is that it should do the sick no harm.", author: "Florence Nightingale" },
  { text: "Nurses are there when the last breath is taken, and nurses are there when the first breath is taken. Although it is more enjoyable to celebrate the birth, it is just as important to comfort in death.", author: "Christine Belle" },
  { text: "Good nurses know how to comfort, great nurses know when to challenge.", author: "Unknown" },

  // ------------------ Philosophy Quotes (30%) ------------------
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats" },
  { text: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "No one saves us but ourselves. No one can and no one may. We ourselves must walk the path.", author: "Buddha" },
  { text: "Courage is not the absence of fear, but the triumph over it.", author: "Nelson Mandela" },
  { text: "Act only according to that maxim whereby you can at the same time will that it should become a universal law.", author: "Immanuel Kant" },
  { text: "It is not what we do, but also what we do not do, for which we are accountable.", author: "Moliere" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },

  // ------------------ Jokes / Lighthearted (10%) ------------------
  { text: "Nursing is a walk in the park… Jurassic Park.", author: "Unknown" },
  { text: "I’m a nurse. What’s your superpower?", author: "Unknown" },
  { text: "Keep calm and call the nurse.", author: "Unknown" },
  { text: "Coffee: the other nurse’s assistant.", author: "Unknown" },
  { text: "Scrubs: Because real life isn’t as forgiving.", author: "Unknown" },

  // ------------------ Boyfriend Motivating Girlfriend (10%) ------------------
  { text: "You’ve got this, babi. I know you can conquer every shift and exam.", author: "Your boyfriend" },
  { text: "Every late night and hard day brings you closer to your dream. I am so proud of you bubs.", author: "Your boyfriend" },
  { text: "Don’t forget, even superheroes need rest. Take care of yourself, my love.", author: "Your boyfriend" },
  { text: "You inspire me every day with your dedication. Keep going, beautiful.", author: "Your boyfriend" },
  { text: "I was taught that supernovae are the hottest things in the universe- until i saw you baby girl~ ", author: "Your boyfriend" }
];


const jar = document.getElementById('motivate-jar');
const quoteBox = document.getElementById('quote');

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteBox.textContent = `"${quote.text}" — ${quote.author}`;
}

jar.addEventListener('click', showRandomQuote);

// Show a quote on load
showRandomQuote();

const stripColors = [
    'linear-gradient(90deg, #ffb74d, #ffd54f)',
    'linear-gradient(90deg, #81c784, #aed581)',
    'linear-gradient(90deg, #64b5f6, #4fc3f7)',
    'linear-gradient(90deg, #ba68c8, #f06292)',
    'linear-gradient(90deg, #ff8a65, #ffd180)'
];

jar.addEventListener('click', () => {
    const strip = document.createElement('div');
    strip.classList.add('pop-strip');

    // Random horizontal position inside the jar
    const jarWidth = jar.offsetWidth;
    const minX = 10;
    const maxX = jarWidth - 110; // strip width + padding
    const randomLeft = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    strip.style.left = `${randomLeft}px`;

    // Random gradient color
    const randomColor = stripColors[Math.floor(Math.random() * stripColors.length)];
    strip.style.background = randomColor;

    // Add strip to jar
    jar.appendChild(strip);

    // Remove after animation ends
    strip.addEventListener('animationend', () => {
        strip.remove();
    });
});

const particleCount = 25;
const colors = ["#fabcfc","#ffb74d","#81c784","#64b5f6","#ba68c8","#ffd54f","#4fc3f7"];

const jarWidth = jar.clientWidth;
const jarHeight = jar.clientHeight;

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    jar.appendChild(particle);

    let angle = Math.random() * Math.PI * 2;
    const speed = 0.001 + Math.random() * 0.01;
    const radius = 20 + Math.random() * (jarWidth/2 + 10) + 10;
    const yOffset = Math.random() * jarHeight;

    // blinking + glow effect
    setInterval(() => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 15px ${color}, 0 0 25px ${color}, 0 0 40px ${color}`;
    }, 500 + Math.random() * 1000);

    // helical movement
    function animate() {
        angle += speed;
        let x = jarWidth / 2 + radius * Math.cos(angle);
        let y = (yOffset + Math.sin(angle*2) * 30) % jarHeight;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        requestAnimationFrame(animate);
    }
    animate();
}

let isAnimating = false; // lock flag

jar.addEventListener('click', () => {
    if (isAnimating) return; // ignore clicks during animation

    isAnimating = true;
    jar.classList.add('open');

    // After 1 second, start closing
    setTimeout(() => {
        jar.classList.remove('open');
        jar.classList.add('closing');

        // After closing animation ends, unlock
        setTimeout(() => {
            jar.classList.remove('closing');
            isAnimating = false; // unlock
        }, 600); // match lidClose animation duration
    }, 1000); // lid stays open for 1s
});
