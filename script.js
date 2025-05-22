// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    // Function to toggle body scroll
    const toggleBodyScroll = (disable) => {
        document.body.style.overflow = disable ? 'hidden' : '';
    };

    // Toggle mobile menu
    mobileNavToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isActive = navLinks.classList.contains('active');
        
        // Toggle icon
        const icon = mobileNavToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        
        // Toggle body scroll
        toggleBodyScroll(isActive);
        
        // Animate menu items with staggered delay
        navLinksItems.forEach((link, index) => {
            link.style.transitionDelay = isActive ? `${0.1 + (index * 0.1)}s` : '0s';
            // Reset opacity and transform for animation
            if (isActive) {
                link.style.opacity = '0';
                link.style.transform = 'translateY(20px)';
                // Force reflow to ensure animation works
                link.offsetWidth;
                setTimeout(() => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                }, 10);
            }
        });
    });

    // Close mobile menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            
            // Re-enable scrolling
            toggleBodyScroll(false);
            
            // Reset transition delays
            navLinksItems.forEach(link => {
                link.style.transitionDelay = '0s';
            });
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileNavToggle.contains(e.target)) {
            
            navLinks.classList.remove('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            toggleBodyScroll(false);
            
            // Reset transition delays
            navLinksItems.forEach(link => {
                link.style.transitionDelay = '0s';
            });
        }
    });

    // Handle navbar transparency on scroll
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
            
            // Hide navbar when scrolling down, show when scrolling up
            if (currentScroll > lastScrollTop && currentScroll > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScroll;
    });
});
