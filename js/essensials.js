const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeBtn = document.getElementById('closeBtn');

function openMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
}

function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}

hamburgerBtn.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

// ESC closes the menu
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeMenu();
});

const topbar = document.querySelector('.topbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        topbar.classList.add('shrink');
    } else {
        topbar.classList.remove('shrink');
    }
});

// Initial check in case the page is loaded with scroll
if (window.scrollY > 10) {
    topbar.classList.add('shrink');
} else {
    topbar.classList.remove('shrink');
}

// -------------------- Tools Dropdown with Local Storage --------------------
const toolsBtn = document.getElementById("toolsBtn");
const dropdown = toolsBtn.parentElement;
const DROPDOWN_KEY = "toolsDropdownOpen";

// On page load, restore dropdown state
window.addEventListener("DOMContentLoaded", () => {
    const isOpen = localStorage.getItem(DROPDOWN_KEY) === "true";
    if (isOpen) {
        dropdown.classList.add("open");
    }
});

// Toggle dropdown and save state
toolsBtn.addEventListener("click", () => {
    const isOpen = dropdown.classList.toggle("open");
    localStorage.setItem(DROPDOWN_KEY, isOpen);
});
