document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            }
        });
    });
    
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

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Find the span element with the id 'year'
    const yearSpan = document.getElementById('year');

    // Update the content of the span with the current year
    yearSpan.textContent = currentYear;
    
    // Create circuit animation
    createCircuitAnimation();

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

 // Highlight current page in navigation
 const pathParts = location.pathname.split('/');
 const currentPage = pathParts[pathParts.length - 2] || 'index.html'; 
 const navLinks = document.querySelectorAll('nav ul li a');

 navLinks.forEach(link => {
     let linkPage = link.getAttribute('href');
     if (linkPage.endsWith('/')) {
         linkPage = linkPage.slice(0, -1); 
     }
     const linkFolder = linkPage.split('/').pop(); 
     if (currentPage === linkFolder) {
         link.classList.add('active');
     } else {
         link.classList.remove('active');
     }
 });
