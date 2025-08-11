document.addEventListener('DOMContentLoaded', function() {
    /*
        ==============================
        EVENT LISTENERS
        ==============================
    */

    // Select all internal anchor links for smooth scrolling.
    // This handles nav links, CTA buttons, and the sticky button.
    const scrollLinks = document.querySelectorAll(
        'nav ul li a[href^="#"], ' +
        '.cta-buttons a[href^="#"], ' +
        '.btn-sticky[href^="#"]'
    );

    // Add a click event listener to each selected link.
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default jump behavior.
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smoothly scroll to the target element's position,
                // accounting for a fixed header height (80px).
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header class toggling on scroll.
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        // Add a 'scrolled' class when the user scrolls past 50px.
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /*
        ==============================
        INITIALIZATION
        ==============================
    */

    // Trigger the background circuit animation on page load.
    createCircuitAnimation();
});

/*
    ==============================
    HELPER FUNCTIONS
    ==============================
*/

/**
 * Creates and appends animated circuit lines to the circuit overlay.
 *
 * NOTE: The CSS for the '.circuit-line' class and its animations
 * must be defined for this to work properly.
 */
function createCircuitAnimation() {
    const circuitOverlay = document.querySelector('.circuit-overlay');
    if (!circuitOverlay) return; // Exit if the overlay doesn't exist.
    
    // Create and add 10 horizontal circuit lines with random properties.
    for (let i = 0; i < 10; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line horizontal';
        line.style.width = `${Math.random() * 300 + 100}px`;
        line.style.top = `${Math.random() * 100}%`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDelay = `${Math.random() * 3}s`;
        circuitOverlay.appendChild(line);
    }
    
    // Create and add 10 vertical circuit lines with random properties.
    for (let i = 0; i < 10; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line vertical';
        line.style.height = `${Math.random() * 300 + 100}px`;
        line.style.top = `${Math.random() * 100}%`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDelay = `${Math.random() * 3}s`;
        circuitOverlay.appendChild(line);
    }
}

