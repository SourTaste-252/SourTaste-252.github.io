const slides = document.querySelector('.slides');
const slideImages = slides.querySelectorAll('img');

slideImages.forEach(img => {
    const clone = img.cloneNode(true);
    slides.appendChild(clone);
});

function adjustAnimation() {
    const totalWidth = Array.from(slides.children).reduce((acc, img) => acc + img.offsetWidth + 20, 0); // +20 for margin
    const animationDuration = totalWidth / 100; 

    slides.style.animationDuration = `${animationDuration}s`;

}

window.addEventListener('load', adjustAnimation);

function toggleMenu() {
    const nav = document.querySelector('.nav-buttons');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
}