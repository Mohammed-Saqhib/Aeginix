document.addEventListener('DOMContentLoaded', function() {
    // Add all animation styles in one go to improve performance
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Consolidated animation styles */
        .service-item, .feature, .contact-form, .about-section p, 
        .stat-item, .footer-column, .testimonial {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1), 
                        transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
            will-change: opacity, transform;
        }
        
        .service-item.animate, .feature.animate, .contact-form.animate, .about-section p.animate, 
        .stat-item.animate, .footer-column.animate, .testimonial.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Advanced staggered animations */
        .service-item:nth-child(2), .feature:nth-child(2), .footer-column:nth-child(2) {
            transition-delay: 0.15s;
        }
        
        .service-item:nth-child(3), .feature:nth-child(3), .footer-column:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        .feature:nth-child(4) {
            transition-delay: 0.45s;
        }
        
        /* Consolidated animation keyframes */
        @keyframes spotlight {
            0% { transform: translate(0, 0) scale(1); }
            20% { transform: translate(200%, 50%) scale(1.2); }
            40% { transform: translate(300%, 200%) scale(0.8); }
            60% { transform: translate(50%, 300%) scale(1.1); }
            80% { transform: translate(-100%, 100%) scale(0.9); }
            100% { transform: translate(0, 0) scale(1); }
        }
        
        @keyframes sheen {
            0% {
                opacity: 0;
                transform: rotateZ(60deg) translate(-1em, 7.5em);
            }
            10% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: rotateZ(60deg) translate(15em, -10em);
            }
        }
        
        @keyframes textScrambleIn {
            0% {
                opacity: 0;
                filter: blur(10px);
                transform: translateX(-20px);
            }
            50% {
                opacity: 0.5;
                filter: blur(5px);
            }
            100% {
                opacity: 1;
                filter: blur(0);
                transform: translateX(0);
            }
        }
        
        @keyframes animatedGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: scale(1);}
            40% {transform: scale(1.2);}
            60% {transform: scale(1.1);}
        }
        
        /* All consolidated animation styles */
        .text-scramble-in {
            animation: textScrambleIn 1.2s forwards;
        }
        
        .bounce {
            animation: bounce 0.5s ease;
        }
        
        .tilt-card {
            transform-style: preserve-3d;
            transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        
        .image-reveal {
            position: relative;
            overflow: hidden;
        }
        
        .image-reveal::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--primary);
            transform: translateX(0);
            transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1);
        }
        
        .image-reveal.animate::after {
            transform: translateX(100%);
        }
        
        .gradient-border {
            position: relative;
        }
        
        .gradient-border:before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--primary), var(--accent), var(--primary-dark), var(--accent));
            background-size: 400% 400%;
            z-index: -1;
            border-radius: 17px;
            animation: animatedGradient 6s ease alternate infinite;
        }
        
        .floating {
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
    `;
    document.head.appendChild(styleElement);

    // Optimized stats counter with reduced code
    function animateStats() {
        const statElements = document.querySelectorAll('.stat-count');
        if (!statElements.length) return;
        
        const options = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const targetValue = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds animation
                    const frameDuration = 1000 / 60; // 60fps
                    const totalFrames = Math.round(duration / frameDuration);
                    const easeOutQuad = t => t * (2 - t);
                    
                    let frame = 0;
                    const countUp = setInterval(() => {
                        frame++;
                        
                        const progress = easeOutQuad(frame / totalFrames);
                        const currentCount = Math.round(targetValue * progress);
                        
                        if (parseInt(stat.textContent, 10) !== currentCount) {
                            stat.textContent = currentCount;
                        }
                        
                        if (frame === totalFrames) {
                            clearInterval(countUp);
                            // Add bounce effect when done
                            stat.classList.add('bounce');
                            setTimeout(() => stat.classList.remove('bounce'), 500);
                        }
                    }, frameDuration);
                    
                    observer.unobserve(stat);
                }
            });
        }, options);
        
        statElements.forEach(stat => {
            observer.observe(stat);
        });
    }

    // Text scramble effect - optimized
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#_';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Apply text scramble to section headers
    const setupTextScramble = () => {
        document.querySelectorAll('section .section-header h2').forEach(heading => {
            heading.classList.add('text-scramble-in');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const text = heading.textContent;
                        const fx = new TextScramble(heading);
                        fx.setText(text);
                        observer.unobserve(heading);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(heading);
        });
    };

    // Optimized tilt effect
    const setupTiltEffect = () => {
        const tiltElements = document.querySelectorAll('.service-item, .feature, .testimonial');
        
        tiltElements.forEach(element => {
            element.classList.add('tilt-card');
            element.addEventListener('mousemove', tiltEffect);
            element.addEventListener('mouseleave', resetTilt);
            element.addEventListener('touchmove', touchTiltEffect);
            element.addEventListener('touchend', resetTilt);
        });
    };
    
    function tiltEffect(e) {
        const card = this;
        const boundingRect = card.getBoundingClientRect();
        const cardWidth = boundingRect.width;
        const cardHeight = boundingRect.height;
        
        // Get mouse position relative to card
        const x = e.clientX - boundingRect.left;
        const y = e.clientY - boundingRect.top;
        
        // Calculate tilt angles (max 15 degrees)
        const tiltX = (y / cardHeight - 0.5) * 15;
        const tiltY = (0.5 - x / cardWidth) * 15;
        
        // Apply transform
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        
        // Add glare effect if supported
        updateGlare(card, x / cardWidth, y / cardHeight);
    }
    
    function touchTiltEffect(e) {
        if (e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const card = this;
        const boundingRect = card.getBoundingClientRect();
        const cardWidth = boundingRect.width;
        const cardHeight = boundingRect.height;
        
        // Get touch position relative to card
        const x = touch.clientX - boundingRect.left;
        const y = touch.clientY - boundingRect.top;
        
        // Calculate tilt angles (reduced for touch - max 10 degrees)
        const tiltX = (y / cardHeight - 0.5) * 10;
        const tiltY = (0.5 - x / cardWidth) * 10;
        
        // Apply transform
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
    
    function updateGlare(card, posX, posY) {
        let glare = card.querySelector('.glare');
        
        if (!glare) {
            glare = document.createElement('div');
            glare.className = 'glare';
            glare.style.position = 'absolute';
            glare.style.top = '0';
            glare.style.left = '0';
            glare.style.width = '100%';
            glare.style.height = '100%';
            glare.style.pointerEvents = 'none';
            glare.style.background = 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))';
            glare.style.borderRadius = 'inherit';
            glare.style.opacity = '0';
            glare.style.transition = 'opacity 0.3s ease';
            card.appendChild(glare);
        }
        
        // Update glare position and opacity
        glare.style.opacity = '0.15';
        glare.style.transform = `rotate(${Math.atan2(posY - 0.5, posX - 0.5) * 180 / Math.PI + 90}deg)`;
    }
    
    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        
        const glare = this.querySelector('.glare');
        if (glare) {
            glare.style.opacity = '0';
        }
    }

    // Enhanced scroll animation detection with IntersectionObserver
    function setupScrollAnimations() {
        const elementsToAnimate = document.querySelectorAll('.service-item, .feature, .contact-form, .about-section p, .stat-item, .footer-column, .testimonial, .image-reveal');
        
        const animateOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    animateObserver.unobserve(entry.target);
                }
            });
        }, animateOptions);
        
        elementsToAnimate.forEach(element => {
            animateObserver.observe(element);
        });
    }

    // Enhanced dark mode toggle - unified implementation
    function createEnhancedDarkModeToggle() {
        // Check if toggle already exists
        if (document.querySelector('.dark-mode-toggle')) {
            return;
        }
        
        const toggle = document.createElement('div');
        toggle.className = 'dark-mode-toggle';
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        
        // Set initial state based on localStorage or system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedDarkMode = localStorage.getItem('darkMode');
        const isDarkMode = storedDarkMode === 'enabled' || (storedDarkMode === null && prefersDarkMode);
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
            toggle.setAttribute('aria-pressed', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
            toggle.setAttribute('aria-pressed', 'false');
        }
        
        // Add the toggle to the page
        document.body.appendChild(toggle);
        
        // Toggle dark mode on click and keypress
        toggle.addEventListener('click', toggleDarkMode);
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDarkMode();
            }
        });
        
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                toggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('darkMode', 'enabled');
                toggle.setAttribute('aria-pressed', 'true');
            } else {
                toggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('darkMode', 'disabled');
                toggle.setAttribute('aria-pressed', 'false');
            }
            
            // Dispatch event for other components to react to theme change
            document.body.dispatchEvent(new CustomEvent('themeChanged'));
        }
    }

    // Initialize all animations
    function init() {
        setupScrollAnimations();
        animateStats();
        setupTextScramble();
        setupTiltEffect();
        createEnhancedDarkModeToggle();
    }

    // Run initializations
    init();
    
    // Handle theme changes
    document.body.addEventListener('themeChanged', function() {
        // Recalculate any theme-dependent animations here if needed
    });
});