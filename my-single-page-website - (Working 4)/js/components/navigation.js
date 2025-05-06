// This file handles the navigation functionality, including smooth scrolling to sections and managing the sticky navigation menu.

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section');
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        
        // Toggle ARIA attributes
        if (navMenu.classList.contains('active')) {
            this.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu when link is clicked
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to target section with offset for fixed header
                const headerOffset = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, `#${targetId}`);
                
                // Update active class
                updateActiveNavLink(targetId);
            }
        });
    });

    // Enhanced sticky navigation with backdrop blur effect
    const sticky = header.offsetTop;
    let isSticky = false;
    let ticking = false;
    
    // Store the original header height
    const headerHeight = header.offsetHeight;

    function updateStickyHeader() {
        if (window.pageYOffset > sticky) {
            if (!isSticky) {
                // Add sticky class but don't add padding to body
                header.classList.add('sticky');
                
                // Only apply padding if on mobile to prevent jumpy content
                if (window.innerWidth <= 768) {
                    document.body.style.paddingTop = headerHeight + 'px';
                }
                
                // Add blur effect when sticky
                header.style.backdropFilter = 'blur(10px)';
                header.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
                
                isSticky = true;
            }
        } else {
            if (isSticky) {
                header.classList.remove('sticky');
                document.body.style.paddingTop = 0;
                
                // Remove blur effect when not sticky
                header.style.backdropFilter = 'none';
                header.style.backgroundColor = 'transparent';
                
                isSticky = false;
            }
        }
        
        ticking = false;
    }

    window.onscroll = function() {
        if (!ticking) {
            requestAnimationFrame(updateStickyHeader);
            ticking = true;
            
            // Update active section in navigation
            updateActiveSection();
        }
    };
    
    // Advanced active section tracking with IntersectionObserver
    const navOptions = {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0
    };
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                updateActiveNavLink(activeId);
            }
        });
    }, navOptions);
    
    sections.forEach(section => {
        if (section.id) {
            navObserver.observe(section);
        }
    });
    
    // Fallback for older browsers: update active section based on scroll position
    function updateActiveSection() {
        if ('IntersectionObserver' in window) return;
        
        let currentSectionId = '';
        const scrollPosition = window.scrollY + header.offsetHeight + 10;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });
        
        if (currentSectionId) {
            updateActiveNavLink(currentSectionId);
        }
    }

    // Update active link in navigation
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            
            if (href === activeId) {
                link.classList.add('active');
            }
        });
    }
    
    // Subtle hover effect for nav items
    navLinks.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const boundingRect = this.getBoundingClientRect();
            const x = e.clientX - boundingRect.left;
            const y = e.clientY - boundingRect.top;
            
            const centerX = boundingRect.width / 2;
            const centerY = boundingRect.height / 2;
            
            const deltaX = (x - centerX) / 8;
            const deltaY = (y - centerY) / 8;
            
            this.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
});