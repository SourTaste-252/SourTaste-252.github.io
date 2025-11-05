// Example data loader - can be replaced with JSON fetch
if (!localStorage.getItem("flashcards-data")) {
  const sample = {
    "Sample Deck": [
      { q: "What is 2+2?", a: "4" },
      { q: "Capital of France?", a: "Paris" }
    ]
  };
  localStorage.setItem("flashcards-data", JSON.stringify(sample));
}
