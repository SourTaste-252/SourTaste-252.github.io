let shapeIndex = 0;
const shapes = ['circle', 'square', 'diamond'];
const shapeElement = document.getElementById('shape');
const redirectLink = document.getElementById('redirectLink');

function changeShape() {
    // Remove all shape classes
    shapeElement.classList.remove('circle', 'square', 'diamond');
    
    // Add the new shape class based on the current index
    shapeElement.classList.add(shapes[shapeIndex]);
    
    // Update the index to the next shape (looping back to 0 after 2)
    shapeIndex = (shapeIndex + 1) % shapes.length;
}

// Change shape every 500ms
setInterval(changeShape, 500);

// Automatically redirect after 4 seconds
setTimeout(() => {
    window.location.href = redirectLink.href;  // Redirect to the href of the <a> tag
}, 4000);
