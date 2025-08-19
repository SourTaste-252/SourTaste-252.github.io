document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const toggle = document.querySelector(".darkmode-toggle");

    if (localStorage.getItem("dark-mode") === "enabled") {
        body.classList.add("dark-mode");
    }

    toggle.addEventListener("click", () => {
        const enabled = body.classList.toggle("dark-mode");
        localStorage.setItem("dark-mode", enabled ? "enabled" : "disabled");
    });
});
