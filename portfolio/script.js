




// ===================================
// SMOOTH SCROLL BEHAVIOR
// ===================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}




// ===================================
// CARD TILT EFFECT
// ===================================

function initCardTilt() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ===================================
// GLITCH EFFECT ENHANCEMENT
// ===================================

function enhanceGlitchEffect() {
    const glitchElement = document.querySelector('.glitch');

    if (glitchElement) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                glitchElement.style.textShadow = `
                    ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px rgba(255, 255, 255, 0.3),
    ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px rgba(255, 255, 255, 0.3)
                `;

                setTimeout(() => {
                    glitchElement.style.textShadow = 'none';
                }, 50);
            }
        }, 100);
    }
}

// ===================================
// CURSOR TRAIL EFFECT
// ===================================

function initCursorTrail() {
    const trail = [];
    const trailLength = 10;

    document.addEventListener('mousemove', (e) => {
        const dot = document.createElement('div');
        dot.style.position = 'fixed';
        dot.style.width = '4px';
        dot.style.height = '4px';
        dot.style.borderRadius = '50%';
        dot.style.background = 'rgba(255, 255, 255, 0.5)';
        dot.style.pointerEvents = 'none';
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        dot.style.zIndex = '9999';
        dot.style.transition = 'opacity 0.5s ease';

        document.body.appendChild(dot);
        trail.push(dot);

        if (trail.length > trailLength) {
            const oldDot = trail.shift();
            oldDot.style.opacity = '0';
            setTimeout(() => oldDot.remove(), 500);
        }
    });
}

// ===================================
// TYPING EFFECT FOR SUBTITLE
// ===================================

function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const text = "portfolio.init()";
    typingElement.textContent = '';

    let index = 0;
    const typingSpeed = 100;

    function type() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        }
    }

    setTimeout(type, 1000);
}

// ===================================
// INTERACTIVE PROJECT CARDS
// ===================================

function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    console.log('Initializing', projectCards.length, 'project cards');

    projectCards.forEach((card, index) => {
        card.addEventListener('click', function (e) {
            console.log('Card clicked:', index, e.target);
            // Don't toggle if clicking on a link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                console.log('Link clicked, not toggling');
                return;
            }

            // Check if this card is already expanded
            const isExpanded = this.classList.contains('expanded');
            console.log('Card expanded state before toggle:', isExpanded);

            // Close all other cards (accordion behavior)
            projectCards.forEach(otherCard => {
                if (otherCard !== this) {
                    otherCard.classList.remove('expanded');
                }
            });

            // Toggle this card
            if (isExpanded) {
                this.classList.remove('expanded');
                console.log('Card collapsed');
            } else {
                this.classList.add('expanded');
                console.log('Card expanded');

                // Smooth scroll to show the expanded content if needed
                setTimeout(() => {
                    const cardRect = this.getBoundingClientRect();
                    const cardBottom = cardRect.bottom;
                    const windowHeight = window.innerHeight;

                    if (cardBottom > windowHeight) {
                        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 400); // Wait for expansion animation
            }
        });

        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Update aria-expanded when card state changes
        const observer = new MutationObserver(() => {
            const isExpanded = card.classList.contains('expanded');
            card.setAttribute('aria-expanded', isExpanded.toString());
        });

        observer.observe(card, { attributes: true, attributeFilter: ['class'] });
    });
}


// ===================================
// WELCOME SCREEN ANIMATION
// ===================================

function initWelcomeScreen() {
    const welcomeText = "Loading experience...";
    const typingElement = document.querySelector('.typing-welcome');

    if (!typingElement) return;

    // Initialize code rain effect
    let codeRainCleanup = null;
    if (typeof initCodeRain === 'function') {
        codeRainCleanup = initCodeRain();
    }

    let index = 0;
    const typingSpeed = 80;

    function typeWelcome() {
        if (index < welcomeText.length) {
            typingElement.textContent += welcomeText.charAt(index);
            index++;
            setTimeout(typeWelcome, typingSpeed);
        }
    }

    // Start typing after a short delay
    setTimeout(typeWelcome, 500);

    // Hide welcome screen after animation completes
    setTimeout(() => {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.style.pointerEvents = 'none';

            // Clean up code rain animation
            if (codeRainCleanup) {
                codeRainCleanup();
            }
        }
    }, 4000);
}


// ===================================
// AVATAR ANIMATION CONTROLLER
// ===================================






// ===================================
// INITIALIZE ALL FEATURES
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Portfolio JS Version 2.0 - Interactive Cards');

    // Initialize welcome screen
    initWelcomeScreen();

    // Initialize neural network background
    initNeuralNetwork();



    // Initialize smooth scrolling
    initSmoothScroll();

    // Initialize card tilt effect
    initCardTilt();

    // Initialize scroll animations
    initScrollAnimations();

    // Enhance glitch effect
    enhanceGlitchEffect();

    // Initialize cursor trail (optional - can be disabled if too distracting)
    // initCursorTrail();

    // Initialize typing effect
    initTypingEffect();

    // Initialize interactive project cards
    initProjectCards();

    console.log('🚀 Portfolio initialized successfully!');
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll event listeners
window.addEventListener('scroll', debounce(() => {
    // Add any scroll-based optimizations here
}, 10));
