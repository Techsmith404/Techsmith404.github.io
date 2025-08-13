document.addEventListener('DOMContentLoaded', function() {
    
    !function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://form.techsmith404.com/js/formbricks.umd.cjs",t.onload=function(){window.formbricks?window.formbricks.setup({environmentId:"cmdybndr70009mu0106h2w97f",appUrl:"https://form.techsmith404.com"}):console.error("Formbricks library failed to load properly. The formbricks object is not available.");};var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}();
    
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
    
    const primaryButton = document.getElementById('request-form-button');
        const stickyButton = document.getElementById('sticky-request-button');
        
        // Put all buttons that should trigger the form in this array.
        const buttons = [primaryButton, stickyButton].filter(btn => btn !== null);
        
        buttons.forEach(button => {
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
        });

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
    })
    
    // This is the text we'll "type" out.
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

// Reference to the element where we'll display the output.
const outputElement = document.getElementById('diagnostic-output');

// A flag to prevent multiple runs of the animation.
let isTyping = false;

// The corrected function to "type" a single line of text.
function typeLine(line, callback) {
    // A regular expression to split the line at the HTML tags.
    const parts = line.split(/(<span.*?<\/span>)/g).filter(Boolean);
    let partIndex = 0;
    
    function typePart() {
        if (partIndex >= parts.length) {
            outputElement.innerHTML += '\n'; // Add a new line after the whole line is done.
            return callback();
        }

        const currentPart = parts[partIndex];
        partIndex++;

        // If the part is an HTML tag, inject it all at once for proper rendering.
        if (currentPart.startsWith('<')) {
            outputElement.innerHTML += currentPart;
            typePart(); // Immediately move to the next part.
        } else {
            // Otherwise, type out the plain text character by character.
            let charIndex = 0;
            const lineInterval = setInterval(() => {
                outputElement.innerHTML += currentPart[charIndex];
                charIndex++;
                if (charIndex === currentPart.length) {
                    clearInterval(lineInterval);
                    typePart(); // Move to the next part after this one is done.
                }
            }, 25); // Typing speed in milliseconds.
        }
    }
    
    typePart(); // Start typing the first part.
}

// Function to start the whole animation sequence.
function startTypingAnimation() {
    if (isTyping) return;
    isTyping = true;
    outputElement.innerHTML = '';
    let lineIndex = 0;

    function nextLine() {
        if (lineIndex < diagnosticText.length) {
            typeLine(diagnosticText[lineIndex], () => {
                lineIndex++;
                setTimeout(nextLine, 500); // Delay before typing the next line.
            });
        } else {
            isTyping = false;
        }
    }
    
    nextLine();
}

// We'll run the animation when the user scrolls to the about section.
// Or, if you want it to run right away, just call startTypingAnimation() directly.
const aboutSection = document.getElementById('about');
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isTyping) {
            startTypingAnimation();
            observer.unobserve(entry.target); // Stop observing after it runs once.
        }
    });
}, {
    rootMargin: '0px 0px -20% 0px' // Trigger when 80% of the element is visible.
});

if (aboutSection) {
    observer.observe(aboutSection);
} else {
    // Fallback: If no about section, just run it on load.
    startTypingAnimation();
}

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

