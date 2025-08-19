let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    // Grab all navbar links
    const navLinks = Array.from(document.querySelectorAll(".navbar a"));
    const activeIndex = navLinks.findIndex(link => link.classList.contains("active"));

    document.addEventListener("touchstart", e => {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      let distance = touchEndX - touchStartX;
      if (Math.abs(distance) < minSwipeDistance) return;

      if (distance > 0) {
        // Swipe right → go to previous link if exists
        if (activeIndex > 0) {
          window.location.href = navLinks[activeIndex - 1].href;
        }
      } else {
        // Swipe left → go to next link if exists
        if (activeIndex < navLinks.length - 1) {
          window.location.href = navLinks[activeIndex + 1].href;
        }
      }
    }
