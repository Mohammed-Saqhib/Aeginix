document.addEventListener('DOMContentLoaded', function() {
    // Add at the beginning of DOMContentLoaded event in main.js
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }

    // Create SVG filters for visual effects
    document.body.insertAdjacentHTML('afterbegin', `
        <svg class="svg-filters">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    `);

    // Create scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    // Update scroll progress
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalScroll) * 100;
        scrollProgress.style.width = `${progress}%`;
    });

    // Enhanced loader with 3D effect
    setTimeout(function() {
        const loader = document.querySelector('.loader');
        loader.style.opacity = '0';
        setTimeout(function() {
            loader.style.display = 'none';
        }, 500);
    }, 1800);
    
    // Custom cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorOutline);
    
    // Update cursor position
    window.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            cursorOutline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    });
    
    // Add cursor hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-item, .feature, .social-link, .nav-cta, input, textarea');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover');
        });
    });
    
    // Hide cursor when it leaves the window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
    
    // Initialize particles.js with enhanced settings
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { 
                    type: ['circle', 'triangle', 'edge'],
                    stroke: { width: 0, color: '#000000' }, 
                    polygon: { nb_sides: 5 } 
                },
                opacity: { 
                    value: 0.5, 
                    random: true, 
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } 
                },
                size: { 
                    value: 3, 
                    random: true, 
                    anim: { enable: true, speed: 2, size_min: 0.1, sync: false } 
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1,
                    shadow: { enable: true, blur: 5, color: "rgba(255,255,255,0.3)" }
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: { enable: false, rotateX: 600, rotateY: 1200 }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'bubble' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8, speed: 3 },
                    repulse: { distance: 200, duration: 0.4 },
                    push: { particles_nb: 4 },
                    remove: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Active navigation based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });

        // Check if we're at the top of the page for the home link
        if (window.pageYOffset < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    });

    // Set header background image
    const header = document.querySelector('header');
    
    function setHeaderBackground() {
        // Create a modern gradient by default
        header.style.background = 'linear-gradient(135deg, #1a2a6c, #2c3e50)';
    }
    
    setHeaderBackground();

    // Lazy load images for better performance
    const images = document.querySelectorAll('img[data-src]');
    const imgOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    };
    
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                observer.unobserve(img);
            }
        });
    }, imgOptions);
    
    images.forEach(img => {
        imgObserver.observe(img);
    });

    // Enhanced dark mode detection
    function checkSystemDarkMode() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (localStorage.getItem('darkMode') !== 'disabled') {
                document.body.classList.add('dark-mode');
                const darkModeToggle = document.querySelector('.dark-mode-toggle');
                if (darkModeToggle) {
                    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                }
            }
        }
    }
    
    // Check system preferences for dark mode
    checkSystemDarkMode();

    // Create a CSS variable injector for proper theme support
    function injectThemeProperties() {
        const isInDarkMode = document.body.classList.contains('dark-mode');
        
        // Set document's meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', isInDarkMode ? '#1a1d20' : '#3498db');
        }
    }
    
    // Call initially
    injectThemeProperties();
    
    // Call whenever the dark mode toggle is clicked
    document.body.addEventListener('darkModeToggle', injectThemeProperties);
});

// Update menu toggle button
document.body.insertAdjacentHTML('afterbegin', `
    <div class="menu-toggle" aria-label="Toggle navigation menu" role="button" tabindex="0" aria-expanded="false" aria-controls="nav-menu">
        <i class="fas fa-bars"></i>
    </div>
`);

// Update nav menu
document.body.insertAdjacentHTML('afterbegin', `
    <ul class="nav-menu" id="nav-menu" aria-label="Main navigation">
        <!-- existing items... -->
    </ul>
`);

// Update testimonial controls
document.body.insertAdjacentHTML('afterbegin', `
    <div class="testimonial-controls" role="tablist" aria-label="Testimonial navigation">
        <span class="testimonial-dot active" role="tab" tabindex="0" aria-selected="true" aria-controls="testimonial-0" aria-label="View first testimonial"></span>
        <span class="testimonial-dot" role="tab" tabindex="0" aria-selected="false" aria-controls="testimonial-1" aria-label="View second testimonial"></span>
        <span class="testimonial-dot" role="tab" tabindex="0" aria-selected="false" aria-controls="testimonial-2" aria-label="View third testimonial"></span>
    </div>
`);

// Update form groups
document.body.insertAdjacentHTML('afterbegin', `
    <div class="form-group">
        <label for="name" class="visually-hidden">Name</label>
        <input type="text" id="name" placeholder="Your Name" required aria-required="true">
        <span class="floating-label">Name</span>
    </div>
`);

// Register service worker (make sure this points to the root service worker)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}