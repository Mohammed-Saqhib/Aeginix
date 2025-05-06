document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonial slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');
    const slider = document.querySelector('.testimonial-slider');
    
    // If no slider is found, exit early
    if (!slider || !testimonials.length) return;
    
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoplayInterval;
    let isAnimating = false;
    
    // Enhanced accessibility setup
    function setupAccessibility() {
        slider.setAttribute('aria-roledescription', 'carousel');
        slider.setAttribute('aria-label', 'Testimonials carousel');
        
        testimonials.forEach((testimonial, index) => {
            // Set unique ID for each slide
            const id = `testimonial-${index}`;
            testimonial.id = id;
            
            // Set correct ARIA attributes
            testimonial.setAttribute('role', 'tabpanel');
            testimonial.setAttribute('aria-roledescription', 'slide');
            testimonial.setAttribute('aria-label', `Slide ${index + 1} of ${testimonials.length}`);
            
            // Connect dots to testimonials with ARIA
            if (dots[index]) {
                dots[index].setAttribute('aria-controls', id);
                dots[index].setAttribute('aria-label', `Go to slide ${index + 1}`);
                dots[index].setAttribute('role', 'tab');
                dots[index].setAttribute('tabindex', '0');
                
                // Add keyboard support for dots
                dots[index].addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        showTestimonial(index);
                    }
                });
            }
        });
    }
    
    // Set up event listeners for dots
    dots.forEach((dot, index) => {
        if (dot) {
            dot.addEventListener('click', () => {
                if (isAnimating) return;
                showTestimonial(index);
            });
        }
    });
    
    // Initialize slider
    function initSlider() {
        // Set min-height of slider container to match tallest testimonial
        let maxHeight = 0;
        testimonials.forEach(testimonial => {
            const height = testimonial.offsetHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
        slider.style.minHeight = `${maxHeight + 20}px`;
        
        // Setup accessibility
        setupAccessibility();
        
        // Start autoplay
        startAutoplay();
        
        // Set up touch events for mobile swipe
        slider.addEventListener('touchstart', handleTouchStart, {passive: true});
        slider.addEventListener('touchmove', handleTouchMove, {passive: true});
        slider.addEventListener('touchend', handleTouchEnd, {passive: true});
        
        // Pause autoplay on hover or focus
        slider.addEventListener('mouseenter', pauseAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('focusin', pauseAutoplay);
        slider.addEventListener('focusout', startAutoplay);
    }
    
    // Show testimonial by index with enhanced accessibility
    function showTestimonial(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        if (index < 0) index = testimonials.length - 1;
        if (index >= testimonials.length) index = 0;
        
        // Update ARIA attributes for all testimonials
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            testimonial.style.transform = 'translateX(50px)';
            testimonial.style.opacity = '0';
            testimonial.style.visibility = 'hidden';
            testimonial.setAttribute('aria-hidden', 'true');
            testimonial.setAttribute('tabindex', '-1');
            
            // Update dots ARIA
            if (dots[i]) {
                dots[i].classList.remove('active');
                dots[i].setAttribute('aria-selected', 'false');
            }
        });
        
        // Show selected testimonial with animation
        setTimeout(() => {
            testimonials[index].classList.add('active');
            testimonials[index].style.transform = 'translateX(0)';
            testimonials[index].style.opacity = '1';
            testimonials[index].style.visibility = 'visible';
            testimonials[index].setAttribute('aria-hidden', 'false');
            testimonials[index].setAttribute('tabindex', '0');
            
            // Update dot ARIA
            if (dots[index]) {
                dots[index].classList.add('active');
                dots[index].setAttribute('aria-selected', 'true');
            }
            
            // Announce slide change to screen readers
            announceSlideChange(index);
            
            // Reset animation flag after transition
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }, 100);
        
        // Update current index
        currentIndex = index;
    }
    
    function announceSlideChange(index) {
        const liveRegion = document.querySelector('.sr-only.live-region') || createLiveRegion();
        liveRegion.textContent = `Showing slide ${index + 1} of ${testimonials.length}`;
    }
    
    function createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.className = 'sr-only live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
        return liveRegion;
    }
    
    // Next testimonial
    function nextTestimonial() {
        if (isAnimating) return;
        showTestimonial(currentIndex + 1);
    }
    
    // Previous testimonial
    function prevTestimonial() {
        if (isAnimating) return;
        showTestimonial(currentIndex - 1);
    }
    
    // Start autoplay
    function startAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            nextTestimonial();
        }, 5000); // Change testimonial every 5 seconds
    }
    
    // Pause autoplay
    function pauseAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Touch event handlers
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }
    
    function handleTouchMove(e) {
        touchEndX = e.touches[0].clientX;
    }
    
    function handleTouchEnd() {
        if (!touchStartX || !touchEndX) return;
        
        const distance = touchStartX - touchEndX;
        const threshold = 50; // Minimum swipe distance
        
        if (Math.abs(distance) >= threshold) {
            if (distance > 0) {
                nextTestimonial(); // Swipe left
            } else {
                prevTestimonial(); // Swipe right
            }
        }
        
        // Reset touch values
        touchStartX = 0;
        touchEndX = 0;
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only handle keyboard events when the testimonial section is in viewport
        if (!isElementInViewport(slider)) return;
        
        if (e.key === 'ArrowRight') {
            nextTestimonial();
        } else if (e.key === 'ArrowLeft') {
            prevTestimonial();
        }
    });
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
            rect.bottom >= 0 &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) && 
            rect.right >= 0
        );
    }
    
    // Create navigation buttons
    function createNavigationButtons() {
        if (!slider) return;
        
        // Check if nav already exists
        if (slider.querySelector('.testimonial-nav')) return;
        
        const nav = document.createElement('div');
        nav.className = 'testimonial-nav';
        nav.innerHTML = `
            <button class="nav-prev" aria-label="Previous testimonial">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="nav-next" aria-label="Next testimonial">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        slider.appendChild(nav);
        
        // Add event listeners to buttons
        nav.querySelector('.nav-prev').addEventListener('click', prevTestimonial);
        nav.querySelector('.nav-next').addEventListener('click', nextTestimonial);
        
        // Add CSS for navigation buttons
        if (!document.getElementById('testimonial-nav-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'testimonial-nav-styles';
            styleEl.textContent = `
                .testimonial-nav {
                    position: absolute;
                    width: 100%;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                    display: flex;
                    justify-content: space-between;
                    padding: 0 10px;
                    z-index: 10;
                    pointer-events: none;
                }
                
                .testimonial-nav button {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(52, 152, 219, 0.8);
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.7;
                    pointer-events: auto;
                }
                
                .testimonial-nav button:hover {
                    background: rgba(52, 152, 219, 1);
                    opacity: 1;
                    transform: scale(1.1);
                }
                
                @media (max-width: 768px) {
                    .testimonial-nav button {
                        width: 36px;
                        height: 36px;
                    }
                }
                
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border-width: 0;
                }
            `;
            document.head.appendChild(styleEl);
        }
    }
    
    // Initialize slider
    initSlider();
    
    // Add navigation buttons with enhanced accessibility
    createNavigationButtons();
});
