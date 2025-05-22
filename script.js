/**
 * Charmant Clothing Store JavaScript
 * Features:
 * - Navbar functionality (scroll detection, active link highlighting)
 * - Smooth scrolling
 * - Product slider/carousel
 * - Section detection using Intersection Observer
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functions
    initNavbar();
    initSmoothScroll();
    initProductSlider();
    initSectionObserver();
});

/**
 * Navbar Functionality
 * - Change navbar background on scroll
 * - Mobile menu toggle
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Change navbar style on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle (if exists)
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle between hamburger and close icon
            const icon = mobileNavToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !mobileNavToggle.contains(e.target)
        ) {
            navLinks.classList.remove('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

/**
 * Smooth Scrolling
 * - Smooth scroll to section when clicking nav links
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links a, .footer-links a, a.btn');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if link is an anchor link
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    // Get the navbar height for offset
                    const navbarHeight = document.getElementById('navbar').offsetHeight;

                    // Calculate the position to scroll to
                    const offsetTop = targetSection.offsetTop - navbarHeight;

                    // Smooth scroll to the target section
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu after clicking a link
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        const icon = document.querySelector('.mobile-nav-toggle i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
}

/**
 * Product Slider
 * - Auto sliding
 * - Manual navigation (prev/next buttons)
 * - Dot indicators
 * - Touch support
 */
function initProductSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) return; // Exit if slider doesn't exist

    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const sliderDotsContainer = document.querySelector('.slider-dots');

    let currentSlide = 0;
    const slideCount = slides.length;
    let autoSlideInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    // Create dot indicators
    const createDots = () => {
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoSlideTimer();
            });
            
            sliderDotsContainer.appendChild(dot);
        }
    };

    // Update active dot
    const updateDots = () => {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Go to specific slide
    const goToSlide = (slideIndex) => {
        if (slideIndex < 0) {
            slideIndex = slideCount - 1;
        } else if (slideIndex >= slideCount) {
            slideIndex = 0;
        }
        
        currentSlide = slideIndex;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    };

    // Next slide
    const nextSlide = () => {
        goToSlide(currentSlide + 1);
    };

    // Previous slide
    const prevSlide = () => {
        goToSlide(currentSlide - 1);
    };

    // Event listeners for prev/next buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlideTimer();
        });
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlideTimer();
        });
    }

    // Auto sliding
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds
    };

    // Reset auto slide timer
    const resetAutoSlideTimer = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    // Touch events for mobile
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        resetAutoSlideTimer();
    }, { passive: true });

    const handleSwipe = () => {
        const touchDiff = touchStartX - touchEndX;
        
        // If the swipe is significant enough (more than 50px)
        if (Math.abs(touchDiff) > 50) {
            if (touchDiff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    };

    // Key navigation
    document.addEventListener('keydown', (e) => {
        if (isElementInViewport(slider)) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoSlideTimer();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoSlideTimer();
            }
        }
    });

    // Function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Initialize slider
    createDots();
    startAutoSlide();
}

/**
 * Section Observer
 * - Detect which section is currently in view
 * - Update nav links accordingly
 */
function initSectionObserver() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Options for the Intersection Observer
    const options = {
        rootMargin: '-100px 0px -50%',
        threshold: 0
    };

    // Callback for the Intersection Observer
    const sectionCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.getAttribute('id');
                
                // Update active nav link
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    // Create new Intersection Observer
    const sectionObserver = new IntersectionObserver(sectionCallback, options);

    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/**
 * Form Handling
 * - Simple form validation
 * - Prevent default form submission
 */
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // In a real application, you would send the form data to a server
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
});

// Helper function to add animation when elements come into view
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.animate');
    
    const options = {
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize animation on scroll if there are elements to animate
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelectorAll('.animate').length > 0) {
        animateOnScroll();
    }
});

