    const quizMenu = document.getElementById('quizMenu');
    const quizSection = document.getElementById('quizSection');
    const quizContainer = document.getElementById('quizContainer');
    const resultDisplay = document.getElementById('resultDisplay');
    const quizTitle = document.getElementById('quizTitle');

    const submitBtn = document.getElementById('submitQuizBtn');
    const restartBtn = document.getElementById('restartQuizBtn');
    const backBtn = document.getElementById('backToMenuBtn');

    // ✅ Tray setup
    const tray = document.getElementById('bottomTray');
    const trayToggle = document.getElementById('trayToggle');
    const trayButtons = tray.querySelector('.tray-buttons');

    let trayCollapsed = false;
    let trayVisible = false;

    // Start completely hidden (no quiz selected)
    tray.style.display = "none"; 

    // ✅ Show tray (when quiz loads)
    function showBottomTray() {
        tray.style.display = "flex"; // make visible
        tray.classList.remove('hidden'); // ensure it’s up
        trayButtons.style.display = "flex";
        trayCollapsed = false;
        trayVisible = true;
        trayToggle.textContent = "▼";
    }

    // ✅ Hide tray (when returning to menu)
    function hideBottomTray() {
        tray.style.display = "none"; // fully remove
        tray.classList.add('hidden'); // reset transform state
        trayCollapsed = false;
        trayVisible = false;
    }

    // ✅ Toggle between expanded and collapsed states
    trayToggle.addEventListener('click', () => {
        if (!trayVisible) return; // ignore clicks when no quiz open

        trayCollapsed = !trayCollapsed;

        if (trayCollapsed) {
            tray.classList.add('hidden'); // slide down
            trayToggle.textContent = "▲";
        } else {
            tray.classList.remove('hidden'); // slide up
            trayToggle.textContent = "▼";
        }
    });



    // ✅ Load JSON & inject quiz
    function loadQuiz(quizName, folderDisplayName) {
        quizTitle.textContent = folderDisplayName;

        fetch(`../../js/Quizes_FITB/${quizName}.json`)
            .then(res => res.json())
            .then(quiz => {
                if (!quiz) {
                    quizContainer.innerHTML = `<p style="color:red;">Quiz not found.</p>`;
                    return;
                }

                if (quiz.title && quiz.title.trim() !== folderDisplayName.trim()) {
                    quizTitle.innerHTML = `${folderDisplayName}`;
                }

                generateQuiz(quiz.paragraphs);
                setupQuizLogic(quizName);
                quizMenu.style.display = "none";
                quizSection.style.display = "block";
                showBottomTray(); // ✅ Only show tray after quiz loads
            })
            .catch(err => {
                console.error("Error loading quiz:", err);
                quizContainer.innerHTML = `<p style="color:red;">Failed to load quiz data.</p>`;
            });
    }

    // ✅ Convert 'word' → <input> and include rationale
    function generateQuiz(paragraphs) {
        let html = '';

        paragraphs.forEach(item => {
            if (item.title && !item.text) {
                html += `
                    <div class="quiz-section-title">
                        <h3><strong>${item.title}</strong></h3>
                        <hr style="border: 1px solid #ccc; margin: 8px 0;"><br><br>
                    </div>
                `;
                return;
            }

            const paragraphHTML = item.text.replace(/'([^']+)'/g, (match, answer) => {
                return `<input type="text" class="blank-input" data-answer="${answer.trim()}">`;
            });

            let rationaleHTML = '';
            if (item.rationale && item.rationale.trim() !== '') {
                rationaleHTML = `<p class="rationale"><strong>Rationale:</strong> ${item.rationale}</p>`;
            }

            html += `
                <div class="quiz-block">
                    <p class="paragraph">${paragraphHTML}</p>
                    ${rationaleHTML}
                    <br><br>
                </div>
            `;
        });

        quizContainer.innerHTML = html;

        const inputs = quizContainer.querySelectorAll('.blank-input');
        inputs.forEach(input => {
            const answerLength = input.dataset.answer.length;
            input.style.width = `${Math.max(answerLength + 1, 4)}ch`;
            input.style.textAlign = 'center';
        });
    }

    // ✅ Core quiz logic (with score saving)
    function setupQuizLogic(quizName) {
        const inputs = quizContainer.querySelectorAll('.blank-input');
        const clueBtn = document.getElementById('clueBtn');

        submitBtn.onclick = () => {
            let correctCount = 0;
            let totalCount = inputs.length;

            inputs.forEach(input => {
                const correct = input.dataset.answer.trim().toLowerCase();
                const userAnswer = input.value.trim().toLowerCase();

                if (userAnswer === correct) {
                    input.style.borderBottomColor = 'limegreen';
                    correctCount++;
                } else {
                    input.style.borderBottomColor = 'red';
                }
            });

            resultDisplay.textContent = `Score: ${correctCount} / ${totalCount}`;

            // 🟢 Save highest score
            const prevHigh = JSON.parse(localStorage.getItem('quizScores')) || {};
            const prevScore = prevHigh[quizName] || 0;

            if (correctCount > prevScore) {
                prevHigh[quizName] = correctCount;
                localStorage.setItem('quizScores', JSON.stringify(prevHigh));
            }

            updateFolderScores();
        };

        // 🟡 Clue button (hold to peek answers)
        function showClues() {
            inputs.forEach(input => {
                input.placeholder = input.dataset.answer;
            });
        }
        function hideClues() {
            inputs.forEach(input => {
                input.placeholder = '';
            });
        }

        clueBtn.addEventListener('mousedown', showClues);
        clueBtn.addEventListener('mouseup', hideClues);
        clueBtn.addEventListener('mouseleave', hideClues);
        clueBtn.addEventListener('touchstart', showClues);
        clueBtn.addEventListener('touchend', hideClues);

        restartBtn.onclick = () => {
            inputs.forEach(input => {
                input.value = '';
                input.placeholder = '';
                input.style.borderBottomColor = '';
            });
            resultDisplay.textContent = '';
        };

        backBtn.onclick = () => {
            quizSection.style.display = 'none';
            quizMenu.style.display = 'flex';
            resultDisplay.textContent = '';
            updateFolderScores();
            hideBottomTray(); // ✅ Hide entire tray when returning
        };
    }

    // ✅ Folder click listener
    document.querySelectorAll('.fillblank-folder').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const quizName = link.dataset.quiz;
            const folderDisplayName = link.textContent.trim();
            loadQuiz(quizName, folderDisplayName);
        });
    });

    // ✅ Auto-hide tray when browser back button is pressed
    window.addEventListener('popstate', hideBottomTray);

    // ✅ Show saved scores below folder names
    function updateFolderScores() {
        const scores = JSON.parse(localStorage.getItem('quizScores')) || {};
        document.querySelectorAll('.fillblank-folder').forEach(link => {
            const quizName = link.dataset.quiz;
            const parent = link.closest('.folder');
            let existing = parent.querySelector('.score-display');

            if (scores[quizName]) {
                if (!existing) {
                    existing = document.createElement('div');
                    existing.className = 'score-display';
                    existing.style.fontSize = '0.9em';
                    existing.style.color = 'gold';
                    existing.style.marginLeft = '20px';
                    existing.style.marginTop = '5px';
                    parent.appendChild(existing);
                }
                existing.textContent = `Highest Score: ${scores[quizName]}`;
            } else if (existing) {
                existing.remove();
            }
        });
    }

    // ✅ Run once on page load
    updateFolderScores();