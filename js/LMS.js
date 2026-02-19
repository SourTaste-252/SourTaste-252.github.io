const folderContainer = document.querySelector(".selection-container");

async function loadSubjects() {
    try {
        const response = await fetch("../../js/Subjects_Container/subjects.json");
        const subjects = await response.json();

        subjects.forEach(([title, linkHref]) => {

            // Create <a>
            const link = document.createElement("a");
            link.href = linkHref;
            link.className = "content-link";

            // Convert title to CSS-friendly class name
            const className = title.toLowerCase().replace(/\s+/g, "-");

            // Build the card
            link.innerHTML = `
                    <div class="content-card">
                        <div class="userdisplay ${className}">
                            <div class="SubjectTitle">${title}</div><br>
                            <h1 class="textstyle">View subject</h1>
                        </div>
                    </div>
            `;

            folderContainer.appendChild(link);
        });

    } catch (err) {
        console.error("Failed to load subjects.json:", err);
    }
}

loadSubjects();
