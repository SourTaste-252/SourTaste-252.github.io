const darkModeToggle = document.getElementById("darkModeToggle");
const root = document.documentElement;

// Load saved mode
const saved = localStorage.getItem("theme");
if (saved) {
    root.setAttribute("data-theme", saved);
    darkModeToggle.checked = saved === "dark";
}

// When user toggles
darkModeToggle.addEventListener("change", () => {
    const isDark = darkModeToggle.checked;
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// toggles between light and dark mode
// and saves the selected mode in localStorage.