document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Hero GSAP Animations ---
    initHeroAnimations();

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


    // --- Property Catalog Logic (Google Sheets) ---
    const propertiesGrid = document.getElementById('properties-grid');
    const noResults = document.getElementById('no-results');
    
    // Filters
    const filterType = document.getElementById('filter-type');
    const filterPrice = document.getElementById('filter-price');
    const filterZone = document.getElementById('filter-zone');

    if (propertiesGrid && filterType && filterPrice && filterZone) {
        let propertiesData = []; // Will hold the fetched data

        // Display a loading state initially
        propertiesGrid.innerHTML = '<div style="text-align:center; width:100%; color:var(--text-main); font-size:1.2rem; grid-column:1/-1; padding: 40px;"><i class="ph ph-spinner ph-spin" style="font-size: 2rem; color: var(--primary-gold); margin-bottom: 10px; display: block;"></i> Cargando catálogo de propiedades en vivo...</div>';

        const formatPrice = (number) => {
            return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(number);
        };

        const renderProperties = (properties) => {
            propertiesGrid.innerHTML = ''; // Clear current
            
            if (properties.length === 0) {
                propertiesGrid.classList.add('hidden');
                noResults.classList.remove('hidden');
                return;
            }
            
            propertiesGrid.classList.remove('hidden');
            noResults.classList.add('hidden');

            properties.forEach(prop => {
                const card = document.createElement('div');
                card.className = 'property-card';
                card.innerHTML = `
                    <div class="property-img" style="background-image: url('${prop.img}');">
                        <div class="property-zone-badge" style="top: 15px; right: 15px; bottom: auto; left: auto; background: var(--bg-dark); color: var(--primary-gold);">${prop.tipo}</div>
                        <div class="property-zone-badge">${prop.zoneLabel}</div>
                        <div class="property-price">${prop.priceFormatted}</div>
                    </div>
                    <div class="property-content">
                        <h3 class="property-title">${prop.title}</h3>
                        <p class="property-location"><i class="ph-fill ph-map-pin"></i> ${prop.colonia || 'Ubicación Premium'}</p>
                        <div class="property-features">
                            <span class="feature"><i class="ph ph-bed"></i> ${prop.rooms}</span>
                            <span class="feature"><i class="ph ph-shower"></i> ${prop.bathrooms}</span>
                            <span class="feature"><i class="ph ph-car"></i> ${prop.parking}</span>
                        </div>
                        <button class="property-btn" onclick="document.getElementById('service').value='comprar'; window.location.href='#contacto';">Me interesa</button>
                    </div>
                `;
                propertiesGrid.appendChild(card);
            });
        };

        const filterData = () => {
            const typeVal = filterType.value;
            const priceVal = filterPrice.value;
            const zoneVal = filterZone.value;

            const filtered = propertiesData.filter(prop => {
                // Check Type (Venta/Renta)
                let matchType = true;
                if (typeVal !== 'all') {
                    const normPropType = prop.tipo.toLowerCase();
                    matchType = normPropType === typeVal;
                }

                // Check Price Category (Mock logic based on number)
                let propPriceCat = "all";
                if (prop.price <= 3000000) propPriceCat = "low";
                else if (prop.price <= 7000000) propPriceCat = "mid";
                else propPriceCat = "high";

                let matchPrice = true;
                if (priceVal !== 'all') {
                    matchPrice = propPriceCat === priceVal;
                }
                
                // Check Zone (Normalize string)
                let matchZone = true;
                if (zoneVal !== 'all') {
                    const normZone = prop.zoneLabel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    matchZone = normZone.includes(zoneVal);
                }
                
                return matchType && matchPrice && matchZone;
            });

            renderProperties(filtered);
        };

        // Attach Event Listeners
        filterType.addEventListener('change', filterData);
        filterPrice.addEventListener('change', filterData);
        filterZone.addEventListener('change', filterData);

        // Fetch Data from Google Sheets
        const sheetUrl = "https://docs.google.com/spreadsheets/d/1KmKRjEYshOAIJEnnf15ok8Wxs9QY4oFhBqhkx18F5K4/gviz/tq?tqx=out:json";
        
        fetch(sheetUrl)
            .then(res => res.text())
            .then(text => {
                // Remove the wrapper to get pure JSON
                const jsonString = text.match(/(?<=.*\().*(?=\);)/s)[0];
                const data = JSON.parse(jsonString);
                
                // Map columns to our format
                // cols index mapping based on fetched JSON:
                // D (3): Titulo, E (4): Zona, F (5): Colonia
                // H (7): Precio, J (9): Recamaras, K (10): Baños, M (12): Estacionamiento, R (17): Imagenes
                
                propertiesData = data.table.rows.map(row => {
                    const priceNum = (row.c[7] && row.c[7].v) ? row.c[7].v : 0;
                    const imgUrl = (row.c[17] && row.c[17].v) ? row.c[17].v : 'assets/hero_building_modern_1782099405549.png';
                    
                    return {
                        id: (row.c[0] && row.c[0].v) ? row.c[0].v : "",
                        tipo: (row.c[1] && row.c[1].v) ? row.c[1].v : "Venta", // Operación
                        title: (row.c[3] && row.c[3].v) ? row.c[3].v : "Propiedad",
                        price: priceNum,
                        priceFormatted: formatPrice(priceNum),
                        zoneLabel: (row.c[4] && row.c[4].v) ? row.c[4].v : "Guadalajara",
                        colonia: (row.c[5] && row.c[5].v) ? row.c[5].v : "",
                        rooms: (row.c[9] && row.c[9].v) ? row.c[9].v : 0,
                        bathrooms: (row.c[10] && row.c[10].v) ? row.c[10].v : 0,
                        parking: (row.c[12] && row.c[12].v) ? row.c[12].v : 0,
                        img: imgUrl
                    };
                });
                
                // Initial Render
                renderProperties(propertiesData);
            })
            .catch(err => {
                console.error("Error fetching Google Sheets:", err);
                propertiesGrid.innerHTML = '<div style="color:red; grid-column:1/-1; text-align:center;">Error al cargar las propiedades. Intenta de nuevo más tarde.</div>';
            });
    }
});

// =========================================
// Hero GSAP Animations (entrance, parallax, magnetic CTAs, counters)
// =========================================
function initHeroAnimations() {
    if (!window.gsap) return; // GSAP failed to load (offline/CDN blocked) - hero still works statically via CSS

    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setFinalCounters = () => {
        document.querySelectorAll('.hero-stat-number').forEach((el) => {
            el.textContent = el.dataset.count || '0';
        });
    };

    const animateCounters = () => {
        document.querySelectorAll('.hero-stat-number').forEach((el) => {
            const target = Number(el.dataset.count) || 0;
            const counter = { val: 0 };
            gsap.to(counter, {
                val: target,
                duration: 1.8,
                ease: 'power2.out',
                onUpdate: () => { el.textContent = Math.floor(counter.val); }
            });
        });
    };

    // Users who prefer reduced motion get the final state immediately, no motion at all
    if (reduceMotion) {
        gsap.set(['.hero-badge', '.hero-subtitle', '.hero-stat', '.hero-cta-group .hero-btn', '.monolith-search-wrapper'], { autoAlpha: 1, y: 0 });
        gsap.set('.hero-title-line', { y: '0%' });
        gsap.set('.hero-scroll-cue', { autoAlpha: 0 });
        setFinalCounters();
        return;
    }

    // Set the initial ("from") state before the timeline plays, to avoid a flash of visible content
    gsap.set(['.hero-badge', '.hero-subtitle', '.hero-stat'], { autoAlpha: 0, y: 20 });
    gsap.set('.hero-cta-group .hero-btn', { autoAlpha: 0, y: 20 });
    gsap.set('.monolith-search-wrapper', { autoAlpha: 0, y: 40 });
    gsap.set('.hero-scroll-cue', { autoAlpha: 0 });

    // --- Entrance timeline ---
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.hero-badge', { autoAlpha: 1, y: 0, duration: 0.8 }, 0.2)
      .to('.hero-title-line', { y: '0%', duration: 1.1, stagger: 0.15 }, 0.35)
      .to('.hero-subtitle', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.55')
      .to('.hero-cta-group .hero-btn', { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, '-=0.6')
      .to('.hero-stat', {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          onComplete: animateCounters
      }, '-=0.5')
      .to('.monolith-search-wrapper', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.4')
      .to('.hero-scroll-cue', { autoAlpha: 1, duration: 0.6 }, '-=0.2');

    // Ambient floating glows + Ken Burns zoom on the background image (decorative, infinite loops)
    gsap.to('.hero-glow-1', { y: 30, x: 20, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero-glow-2', { y: -35, x: -20, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero-scroll-mouse .hero-scroll-wheel', { y: 12, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero-bg-image', { scale: 1.12, duration: 22, ease: 'sine.inOut', repeat: -1, yoyo: true });

    // --- Responsive extras (only set up here since reduced-motion users already returned above) ---
    const mm = gsap.matchMedia();

    if (window.ScrollTrigger) {
        gsap.to('.hero-bg-image', {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });
        gsap.to('.hero-content', {
            yPercent: -18,
            autoAlpha: 0.25,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });
    }

    // Desktop-only mouse parallax on the background image
    mm.add('(hover: hover) and (pointer: fine) and (min-width: 992px)', () => {
        const quickX = gsap.quickTo('.hero-bg-image', 'x', { duration: 0.9, ease: 'power3.out' });
        const quickY = gsap.quickTo('.hero-bg-image', 'y', { duration: 0.9, ease: 'power3.out' });

        const onMove = (e) => {
            const relX = (e.clientX / window.innerWidth - 0.5) * 30;
            const relY = (e.clientY / window.innerHeight - 0.5) * 20;
            quickX(relX);
            quickY(relY);
        };

        hero.addEventListener('mousemove', onMove);
        return () => hero.removeEventListener('mousemove', onMove);
    });

    // Desktop-only magnetic effect on the CTA buttons
    mm.add('(hover: hover) and (pointer: fine)', () => {
        const buttons = document.querySelectorAll('.hero-btn');
        const cleanups = [];

        buttons.forEach((btn) => {
            const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3.out' });
            const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3.out' });

            const onMove = (e) => {
                const rect = btn.getBoundingClientRect();
                xTo((e.clientX - rect.left - rect.width / 2) * 0.3);
                yTo((e.clientY - rect.top - rect.height / 2) * 0.3);
            };
            const onLeave = () => { xTo(0); yTo(0); };

            btn.addEventListener('mousemove', onMove);
            btn.addEventListener('mouseleave', onLeave);
            cleanups.push(() => {
                btn.removeEventListener('mousemove', onMove);
                btn.removeEventListener('mouseleave', onLeave);
            });
        });

        return () => cleanups.forEach((fn) => fn());
    });
}
