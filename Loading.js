let shapeIndex = 0;
const shapes = ['circle', 'square', 'diamond'];
const shapeElement = document.getElementById('shape');

function changeShape() {
    // Remove all shape classes
    shapeElement.classList.remove('circle', 'square', 'diamond');
    
    // Add the new shape class based on the current index
    shapeElement.classList.add(shapes[shapeIndex]);
    
    // Update the index to the next shape (looping back to 0 after 2)
    shapeIndex = (shapeIndex + 1) % shapes.length;
}

// Change shape every 1 second (1000ms)
setInterval(changeShape, 500);

setTimeout(() => {
    window.location.href = 'home.html';
  }, 4000);
