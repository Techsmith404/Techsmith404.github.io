// Function to handle the header's scroll behavior.
function setupHeaderScrollClass() {
    const header = document.querySelector('header');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Function to set up smooth scrolling for internal anchor links.
function setupSmoothScrolling() {
    document.querySelectorAll(
        'nav ul li a[href^="#"], ' +
        '.cta-buttons a[href^="#"], ' +
        '.btn-sticky[href^="#"]'
    ).forEach(link => {
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
}

// Function to handle all the logic for the terminal animation.
// All related variables and nested functions are contained within this scope.
function setupTerminalAnimation() {
    const diagnosticText = [
        `> system_diagnostics.exe --run-full-scan`,
        `> Initializing hardware subsystem check... [ OK ]`,
        `> Initializing software subsystem check... [ OK ]`,
        `> [ SKILL CHECK ]`,
        `>   - Hardware Assembly: <span class="diagnostic-status">[ PASSED ]</span>`,
        `>   - Troubleshooting:   <span class="diagnostic-status">[ PASSED ]</span>`,
        `>   - Sys. Optimization: <span class="diagnostic-status">[ PASSED ]</span>`,
        `> All systems are fully operational.`,
        `> No problems found.`,
    ];

    const outputElement = document.getElementById('diagnostic-output');
    if (!outputElement) return;
    let isTyping = false;

    // Helper function to type a single line, nested for scope.
    function typeLine(line, callback) {
        const parts = line.split(/(<span.*?<\/span>)/g).filter(Boolean);
        let partIndex = 0;
        
        function typePart() {
            if (partIndex >= parts.length) {
                outputElement.innerHTML += '\n';
                return callback();
            }

            const currentPart = parts[partIndex];
            partIndex++;

            if (currentPart.startsWith('<')) {
                outputElement.innerHTML += currentPart;
                typePart();
            } else {
                let charIndex = 0;
                const lineInterval = setInterval(() => {
                    outputElement.innerHTML += currentPart[charIndex];
                    charIndex++;
                    if (charIndex === currentPart.length) {
                        clearInterval(lineInterval);
                        typePart();
                    }
                }, 25);
            }
        }
        typePart();
    }

    // Main function to start the entire animation sequence.
    function startTypingAnimation() {
        if (isTyping) return;
        isTyping = true;
        outputElement.innerHTML = '';
        let lineIndex = 0;

        function nextLine() {
            if (lineIndex < diagnosticText.length) {
                typeLine(diagnosticText[lineIndex], () => {
                    lineIndex++;
                    setTimeout(nextLine, 500);
                });
            } else {
                isTyping = false;
            }
        }
        nextLine();
    }

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isTyping) {
                    startTypingAnimation();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -20% 0px'
        });
        observer.observe(aboutSection);
    } else {
        startTypingAnimation();
    }
}

// Creates and appends animated circuit lines to the circuit overlay.
function createCircuitAnimation() {
    const circuitOverlay = document.querySelector('.circuit-overlay');
    if (!circuitOverlay) return;
    
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 10; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line horizontal';
        line.style.width = `${Math.random() * 300 + 100}px`;
        line.style.top = `${Math.random() * 100}%`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDelay = `${Math.random() * 3}s`;
        fragment.appendChild(line);
    }
    
    for (let i = 0; i < 10; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line vertical';
        line.style.height = `${Math.random() * 300 + 100}px`;
        line.style.top = `${Math.random() * 100}%`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDelay = `${Math.random() * 3}s`;
        fragment.appendChild(line);
    }
    circuitOverlay.appendChild(fragment);
}

/*
    ==============================
    EVENT LISTENERS
    ==============================
*/
document.addEventListener('DOMContentLoaded', function() {
    // Initializes the Formbricks library for tracking events.
    !function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://form.techsmith404.com/js/formbricks.umd.cjs",t.onload=function(){window.formbricks?window.formbricks.setup({environmentId:"cmdybndr70009mu0106h2w97f",appUrl:"https://form.techsmith404.com"}):console.error("Formbricks library failed to load properly. The formbricks object is not available.");};var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}();

    // Event listeners for Formbricks buttons.
    const primaryButton = document.getElementById('request-form-button');
    const stickyButton = document.getElementById('sticky-request-button');
    const orderWhiteDwarfButton = document.getElementById('order-white-dwarf-btn');
    const orderDarkMatterButton = document.getElementById('order-dark-matter-btn');
    
    const buttons = [primaryButton, stickyButton].filter(btn => btn !== null);
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (window.formbricks) {
                window.formbricks.track("button_clicked");
            } else {
                console.error("Formbricks object not found. Cannot track event.");
            }
        });
    });

    if (orderWhiteDwarfButton) {
        orderWhiteDwarfButton.addEventListener('click', () => {
            if (window.formbricks) {
                window.formbricks.track("order_white_dwarf");
            } else {
                console.error("Formbricks object not found. Cannot track event.");
            }
        });
    }

    if (orderDarkMatterButton) {
        orderDarkMatterButton.addEventListener('click', () => {
            if (window.formbricks) {
                window.formbricks.track("order_dark_matter");
            } else {
                console.error("Formbricks object not found. Cannot track event.");
            }
        });
    }
    
    // Function Calls
    setupHeaderScrollClass();
    setupSmoothScrolling();
    setupTerminalAnimation();
    createCircuitAnimation();
});