document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        });
    });

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Hero Carousel Logic
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;
        slides[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        currentSlide++;
        showSlide(currentSlide);
    };

    const prevSlide = () => {
        currentSlide--;
        showSlide(currentSlide);
    };

    const startSlideShow = () => {
        slideInterval = setInterval(nextSlide, 6000); // Change slide every 6s
    };

    const resetSlideShow = () => {
        clearInterval(slideInterval);
        startSlideShow();
    };

    // Event Listeners for Carousel Controls
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideShow();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideShow();
    });

    // Start auto slide
    startSlideShow();

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form submission visual feedback (Prevent default)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Enviando...';
            btn.style.opacity = '0.7';
            
            // Simulate API call
            setTimeout(() => {
                btn.textContent = '¡Mensaje Enviado!';
                btn.style.backgroundColor = '#22c55e'; // Green success
                btn.style.color = '#fff';
                
                contactForm.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // --- Accordion Logic ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            // Mouse enter for Desktop
            item.addEventListener('mouseenter', () => {
                accordionItems.forEach(el => el.classList.remove('active'));
                item.classList.add('active');
            });

            // Click for Touch/Mobile Devices
            item.addEventListener('click', () => {
                accordionItems.forEach(el => el.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    // --- Infinite Parallax Wall Logic ---
    const glassServices = document.querySelectorAll('.glass-service');
    const glassIndicators = document.querySelectorAll('.indicator');
    
    if (glassServices.length > 0 && glassIndicators.length > 0) {
        let currentIndex = 0;
        const totalServices = glassServices.length;
        let wallTimer;

        const switchService = (index) => {
            glassServices.forEach(srv => srv.classList.remove('active'));
            glassIndicators.forEach(ind => ind.classList.remove('active'));
            
            glassServices[index].classList.add('active');
            glassIndicators[index].classList.add('active');
            
            currentIndex = index;
        };

        const nextService = () => {
            let nextIndex = (currentIndex + 1) % totalServices;
            switchService(nextIndex);
        };

        // Start auto cycle every 4 seconds
        const startWallTimer = () => {
            wallTimer = setInterval(nextService, 4000);
        };

        startWallTimer();

        // Allow manual clicking on indicators
        glassIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                clearInterval(wallTimer);
                switchService(index);
                startWallTimer();
            });
        });
    }
});
