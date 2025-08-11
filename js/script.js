document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for nav links
    const scrollLinks = document.querySelectorAll('nav ul li a[href^="#"], .cta-buttons a[href^="#"], .btn-sticky[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

    // Scroll to section for sticky button
    document.querySelector('.btn-sticky').addEventListener('click', function(e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });

    // Sticky header logic
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

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
