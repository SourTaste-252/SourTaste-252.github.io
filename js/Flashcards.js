document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("folders-container");

  try {
    // Load JSON
    const res = await fetch("../js/flashcardsData/Flashcards.json");
    const data = await res.json();

    // Loop through each array name (group of flashcards)
    Object.keys(data).forEach(groupName => {
      const folderDiv = document.createElement("div");
      folderDiv.classList.add("folder");

      const link = document.createElement("a");
      link.classList.add("folder-link");
      link.textContent = groupName;

      // Pass groupName as query param to Flashcards page
      link.href = `../src/Subjects/Medical-Surgical-Nursing.html?set=${encodeURIComponent(groupName)}`;

      folderDiv.appendChild(link);
      container.appendChild(folderDiv);
    });

  } catch (err) {
    console.error("Error loading flashcards.json:", err);
    container.innerHTML = "<p>Failed to load subjects.</p>";
  }
});
