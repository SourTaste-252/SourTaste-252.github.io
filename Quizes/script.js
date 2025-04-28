document.addEventListener("DOMContentLoaded", function () {
    const questionText = document.getElementById("question");
    const answerInput = document.getElementById("answerInput");
    const submitButton = document.querySelector(".submit");
    const nextButton = document.getElementById("next");
    const resultText = document.getElementById("result");
    const solutionText = document.getElementById("solution");

    let currentIndex = Math.floor(Math.random() * questions.length);

    function loadQuestion() {
        questionText.textContent = questions[currentIndex];
        answerInput.value = "";
        resultText.textContent = "";
        solutionText.style.display = "none";
        nextButton.style.display = "none";
        
        // Re-enable input and submit button
        answerInput.disabled = false;
        submitButton.style.display = "inline-block";
    }

    submitButton.addEventListener("click", function () {
        let userAnswer = answerInput.value.trim();
        let correctAnswer = answers[currentIndex].replace(" mL", "");

        if (userAnswer === correctAnswer) {
            resultText.innerHTML = `<span style="color: green;">✅ Correct! The answer is ${answers[currentIndex]}.</span>`;
        } else {
            resultText.innerHTML = `<span style="color: red;">❌ Incorrect. The correct answer is ${answers[currentIndex]}.</span>`;
        }

        solutionText.innerHTML = `<b>Solution:</b><br>${solutions[currentIndex]}`;
        solutionText.style.display = "block";
        nextButton.style.display = "block";

        // Disable input and hide submit button
        answerInput.disabled = true;
        submitButton.style.display = "none";
    });

    nextButton.addEventListener("click", function () {
        currentIndex = Math.floor(Math.random() * questions.length);
        loadQuestion();
    });

    loadQuestion();
});
