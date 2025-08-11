document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Create circuit animation
    createCircuitAnimation();
});

const button = document.getElementById('request-form-button');
            if (button) {
                button.addEventListener('click', () => {
                    // Check if the formbricks object is available before trying to use it.
                    if (window.formbricks) {
                        // This is the code action. The string "button_clicked" needs to match the key
                        // you set up in your Formbricks dashboard.
                        window.formbricks.track("button_clicked");
                    } else {
                        console.error("Formbricks object not found. Cannot track event.");
                    }
                });
            }

function createCircuitAnimation() {
    const circuitOverlay = document.querySelector('.circuit-overlay');
    
    // Create horizontal circuit lines
    for (let i = 0; i < 10; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line';
        line.style.width = `${Math.random() * 300 + 100}px`;
        line.style.height = '1px';
        line.style.top = `${Math.random() * 100}%`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDelay = `${Math.random() * 3}s`;
        circuitOverlay.appendChild(line);
    }
    
    // Create vertical circuit lines
    for (let i = 0; i < 10; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line';
        line.style.width = '1px';
        line.style.height = `${Math.random() * 300 + 100}px`;
        line.style.top = `${Math.random() * 100}%`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDelay = `${Math.random() * 3}s`;
        circuitOverlay.appendChild(line);
    }
}
