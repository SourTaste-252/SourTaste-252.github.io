const folderContainer = document.getElementById('folderContainer');

// Fetch subjects from JSON
fetch('../../js/Subjects_Container/subjects.json')  // Adjust path if needed
    .then(response => response.json())
    .then(subjects => {
        subjects.forEach(subject => {
            const folderName = subject[0];
            const fileName = subject[1];

            const folder = document.createElement('div');
            folder.className = 'folder';
            folder.innerHTML = `<span>${folderName}</span>`;

            folder.onclick = () => {
                // Dynamically load JS file
                const script = document.createElement('script');
                script.src = `../Subjects/${fileName}`;
                document.body.appendChild(script);
            };

            folderContainer.appendChild(folder);
        });
    })
    .catch(err => console.error("Failed to load subjects.json:", err));
