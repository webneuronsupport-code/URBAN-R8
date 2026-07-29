let propertiesData = []; // Global
document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Select (Glassmorphism) ---
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        // Ignorar si ya tiene wrapper
        if(select.closest('.custom-select-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        
        let placeholderText = 'Selecciona una opción...';
        if(select.options[select.selectedIndex]) {
            placeholderText = select.options[select.selectedIndex].text;
        }
        
        trigger.innerHTML = `<span>${placeholderText}</span><i class="ph ph-caret-down" style="color: var(--primary-gold);"></i>`;
        wrapper.appendChild(trigger);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-options';
        
        Array.from(select.options).forEach(option => {
            if(option.disabled) return; 
            
            const customOption = document.createElement('div');
            customOption.className = 'custom-option';
            customOption.textContent = option.text;
            
            customOption.addEventListener('click', (e) => {
                select.value = option.value;
                trigger.querySelector('span').textContent = option.text;
                trigger.querySelector('span').style.color = '#fff';
                
                select.dispatchEvent(new Event('change'));
                
                optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                customOption.classList.add('selected');
                wrapper.classList.remove('open');
            });
            optionsContainer.appendChild(customOption);
        });
        
        wrapper.appendChild(optionsContainer);
        
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
                if(w !== wrapper) w.classList.remove('open');
            });
            
            wrapper.classList.toggle('open');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(w => w.classList.remove('open'));
    });

    // --- Preloader Logic ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // match CSS transition duration
        }, 1500);
    }

    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Hero GSAP Animations ---
    initHeroAnimations();

    // --- Custom Select Implementation ---
    function setupCustomSelect(select) {
        if (select.parentNode.classList.contains('custom-select-wrapper')) {
            const wrapper = select.parentNode;
            wrapper.parentNode.insertBefore(select, wrapper);
            wrapper.remove();
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);
        
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        trigger.innerHTML = `<span>${select.options.length > 0 ? select.options[select.selectedIndex].text : ''}</span> <i class="ph ph-caret-down"></i>`;
        wrapper.appendChild(trigger);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-options';
        
        Array.from(select.options).forEach((option, index) => {
            const customOption = document.createElement('div');
            customOption.className = `custom-option ${index === select.selectedIndex ? 'selected' : ''}`;
            customOption.textContent = option.text;
            customOption.dataset.value = option.value;
            
            customOption.addEventListener('click', function(e) {
                e.stopPropagation();
                select.value = this.dataset.value;
                select.dispatchEvent(new Event('change'));
                
                trigger.querySelector('span').textContent = this.textContent;
                
                optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                wrapper.classList.remove('open');
            });
            
            optionsContainer.appendChild(customOption);
        });
        
        wrapper.appendChild(optionsContainer);
        
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                if (w !== wrapper) w.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        });
    }

    const glassSelects = document.querySelectorAll('.glass-form-group select');
    glassSelects.forEach(setupCustomSelect);

    document.addEventListener('click', function() {
        document.querySelectorAll('.custom-select-wrapper').forEach(w => {
            w.classList.remove('open');
        });
    });

    window.setupCustomSelect = setupCustomSelect; // Export for use in dynamic updates

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let scrollPosition = 0;

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
            document.documentElement.classList.add('no-scroll');
            document.body.classList.add('no-scroll');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
            document.documentElement.classList.remove('no-scroll');
            document.body.classList.remove('no-scroll');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
                document.documentElement.classList.remove('no-scroll');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Selective touchmove preventer for iOS Safari
    document.addEventListener('touchmove', (e) => {
        if (navMenu.classList.contains('active')) {
            // Allow scrolling inside the nav menu itself, but prevent background scroll
            if (!navMenu.contains(e.target)) {
                e.preventDefault();
            }
        }
    }, { passive: false });

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



    // Contact Form — envío real a enviar_contacto.php
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Enviando...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            const nombre = document.getElementById('name')?.value || '';
            const telefono = document.getElementById('phone')?.value || '';
            const correo = document.getElementById('email')?.value || '';
            const asunto = document.getElementById('service')?.value || '';
            const mensaje = document.getElementById('message')?.value || '';

            if (!nombre.trim() || !telefono.trim() || !correo.trim() || !asunto.trim()) {
                alert('Por favor, completa todos los campos obligatorios (*).');
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
                return;
            }

            const formData = new FormData();
            formData.append('nombre',   document.getElementById('name')?.value    || '');
            formData.append('telefono', document.getElementById('phone')?.value   || '');
            formData.append('correo',   document.getElementById('email')?.value   || '');
            formData.append('asunto',   document.getElementById('service')?.value || '');
            formData.append('mensaje',  document.getElementById('message')?.value || '');
            formData.append('origen',   'Sitio Web - Formulario de Contacto');

            fetch('enviar_contacto.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        btn.textContent = '✅ ¡Mensaje Enviado!';
                        btn.style.backgroundColor = '#22c55e';
                        btn.style.color = '#fff';
                        contactForm.reset();
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.style.backgroundColor = '';
                            btn.style.color = '';
                            btn.style.opacity = '1';
                            btn.disabled = false;
                        }, 4000);
                    } else {
                        btn.textContent = '❌ Error al enviar';
                        btn.style.backgroundColor = '#ef4444';
                        btn.style.color = '#fff';
                        btn.disabled = false;
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.style.backgroundColor = '';
                            btn.style.opacity = '1';
                        }, 4000);
                    }
                })
                .catch(err => {
                    console.error('Error:', err);
                    alert('Error de conexión. Asegúrate de estar probando la página en Hostinger (el formulario requiere un servidor web para enviar correos).');
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                });
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
        

        // Display a loading state initially
        propertiesGrid.innerHTML = '<div style="text-align:center; width:100%; color:var(--text-main); font-size:1.2rem; grid-column:1/-1; padding: 40px;"><i class="ph ph-spinner ph-spin" style="font-size: 2rem; color: var(--primary-gold); margin-bottom: 10px; display: block;"></i> Cargando catálogo de propiedades en vivo...</div>';

        const formatPrice = (number) => {
            return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(number);
        };        let displayLimit = 6;
        let currentFiltered = [];

        const renderProperties = () => {
            propertiesGrid.innerHTML = ''; // Clear current
            
            if (currentFiltered.length === 0) {
                propertiesGrid.classList.add('hidden');
                noResults.classList.remove('hidden');
                return;
            }
            
            propertiesGrid.classList.remove('hidden');
            noResults.classList.add('hidden');

            const toDisplay = currentFiltered.slice(0, displayLimit);

            toDisplay.forEach(prop => {
                const card = document.createElement('div');
                card.className = 'property-card';
                // Helper for status colors
                const st = (prop.status || 'Disponible').toLowerCase();
                const stBg = st === 'vendida' ? '#ef4444' : (st === 'apartada' ? '#facc15' : (st === 'rentada' ? '#3b82f6' : '#4ade80'));
                
                card.innerHTML = `
                    <div class="property-img" style="background-image: url('${prop.img}'), url('assets/hero_building_modern_1782099405549.png');">
                        <div style="position: absolute; top: 16px; left: 16px; right: 16px; display: flex; justify-content: space-between; gap: 8px; z-index: 2; flex-wrap: wrap;">
                            <div class="property-zone-badge" style="position: relative; top: 0; left: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; max-width: 100%;">${prop.zoneLabel}</div>
                            <div style="display: flex; gap: 6px;">
                                <div class="property-zone-badge" style="position: relative; top: 0; left: 0; background: var(--bg-dark); color: #fff; flex-shrink: 0; display: flex; align-items: center; gap: 6px;">
                                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${stBg}; box-shadow: 0 0 8px ${stBg};"></span>
                                    ${prop.status}
                                </div>
                                <div class="property-zone-badge" style="position: relative; top: 0; left: 0; background: var(--bg-dark); color: var(--primary-gold); flex-shrink: 0;">${prop.tipo}</div>
                            </div>
                        </div>
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
                        <button class="property-btn" onclick="openModal('${prop.id}')">Ver detalles</button>
                    </div>
                `;
                propertiesGrid.appendChild(card);
            });

            if (currentFiltered.length > displayLimit) {
                const loadMoreBtn = document.createElement('button');
                loadMoreBtn.className = 'load-more-card';
                loadMoreBtn.innerHTML = '<i class="ph ph-plus-circle"></i><span>Cargar más<br>propiedades</span>';
                loadMoreBtn.onclick = () => {
                    displayLimit += 6;
                    renderProperties();
                };
                propertiesGrid.appendChild(loadMoreBtn);
            }
        };

        const filterData = () => {
            const typeVal = filterType.value;
            const priceVal = filterPrice.value;
            const zoneVal = filterZone.value;

            currentFiltered = propertiesData.filter(prop => {
                // Check Type (Venta/Renta)
                let matchType = true;
                if (typeVal !== 'all') {
                    const normPropType = prop.tipo.toLowerCase();
                    matchType = normPropType === typeVal;
                }

                // Check Price Category
                let matchPrice = true;
                if (priceVal !== 'all') {
                    const price = prop.price;
                    if (typeVal === 'renta') {
                        if (priceVal === 'range-1') matchPrice = price < 10000;
                        else if (priceVal === 'range-2') matchPrice = price >= 10000 && price <= 20000;
                        else if (priceVal === 'range-3') matchPrice = price > 20000 && price <= 30000;
                        else if (priceVal === 'range-4') matchPrice = price > 30000 && price <= 50000;
                        else if (priceVal === 'range-5') matchPrice = price > 50000;
                    } else {
                        if (priceVal === 'range-1') matchPrice = price < 1000000;
                        else if (priceVal === 'range-2') matchPrice = price >= 1000000 && price <= 3000000;
                        else if (priceVal === 'range-3') matchPrice = price > 3000000 && price <= 6000000;
                        else if (priceVal === 'range-4') matchPrice = price > 6000000 && price <= 10000000;
                        else if (priceVal === 'range-5') matchPrice = price > 10000000;
                    }
                }
                
                // Check Zone (Normalize string)
                let matchZone = true;
                if (zoneVal !== 'all') {
                    const normZone = prop.zoneLabel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    matchZone = normZone.includes(zoneVal);
                }
                
                return matchType && matchPrice && matchZone;
            });

            displayLimit = 6;
            renderProperties();
        };

        // Attach Event Listeners
        filterType.addEventListener('change', filterData);
        filterPrice.addEventListener('change', filterData);
        filterZone.addEventListener('change', filterData);

        // Fetch Data from Google Sheets
        // Añadimos un cache-buster con Date.now() para que los cambios se reflejen inmediatamente
        const sheetUrl = `https://docs.google.com/spreadsheets/d/1P9q06s-CTqHcwCmk1GuRw4ujDkptNBYim3Qc9Oi9QDs/gviz/tq?tqx=out:json&_=${Date.now()}`;
        
        fetch(sheetUrl)
            .then(res => res.text())
            .then(text => {
                // Remove the wrapper to get pure JSON safely without lookbehind regex
                const start = text.indexOf('{');
                const end = text.lastIndexOf('}');
                const jsonString = text.substring(start, end + 1);
                const data = JSON.parse(jsonString);
                
                // Map columns to our format based on the new official catalog:
                // C (2): Operación, E (4): Título, F (5): Precio,
                // H (7): Colonia, I (8): Zona,
                // M (12): Recámaras, N (13): Baños, O (14): Estacionamiento,
                // R (17): Imágenes (solo nombre, por ahora usamos placeholder)
                const extractAllDriveImages = (cellVal) => {
                    if (!cellVal) return [];
                    const str = String(cellVal);
                    const urls = [];
                    // Match file/d/ID
                    const regex1 = /file\/d\/([a-zA-Z0-9_-]+)/g;
                    let match;
                    while ((match = regex1.exec(str)) !== null) {
                        urls.push(`https://lh3.googleusercontent.com/d/${match[1]}`);
                    }
                    // Match open?id=ID
                    const regex2 = /id=([a-zA-Z0-9_-]+)/g;
                    while ((match = regex2.exec(str)) !== null) {
                        urls.push(`https://lh3.googleusercontent.com/d/${match[1]}`);
                    }
                    // Fallback if they put a direct image URL (not google drive)
                    if (urls.length === 0 && (str.endsWith('.jpg') || str.endsWith('.png') || str.endsWith('.jpeg'))) {
                        urls.push(str.trim());
                    }
                    return urls;
                };

                // Mapeo dinamico de columnas (removiendo acentos para evitar problemas de codificacion)
                const colMap = {};
                if (data.table.cols) {
                    data.table.cols.forEach((c, idx) => {
                        if (c && c.label) {
                            const l = c.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            if (l.includes('estatus')) colMap.estatus = idx;
                            else if (l.includes('operaci')) colMap.tipo = idx;
                            else if (l.includes('tipo de propiedad')) colMap.propiedad = idx;
                            else if (l.includes('titulo')) colMap.titulo = idx;
                            else if (l.includes('precio')) colMap.precio = idx;
                            else if (l.includes('colonia')) colMap.colonia = idx;
                            else if (l.includes('ciudad')) colMap.ciudad = idx;
                            else if (l.includes('estado')) colMap.estado = idx;
                            else if (l.includes('m2 terreno') || l.includes('terreno')) colMap.m2t = idx;
                            else if (l.includes('construcci')) colMap.m2c = idx;
                            else if (l.includes('recamara')) colMap.recamaras = idx;
                            else if (l.includes('bano')) colMap.banos = idx;
                            else if (l.includes('estacionamiento')) colMap.estacionamientos = idx;
                            else if (l.includes('amenidades')) colMap.amenidades = idx;
                            else if (l.includes('descripci')) colMap.descripcion = idx;
                            else if (l.includes('direcci') || l.includes('ubicaci')) colMap.direccion = idx;
                            else if (l.includes('foto 1')) colMap.foto1 = idx;
                        }
                    });
                }

                propertiesData = data.table.rows.map((row, index) => {
                    const getVal = (key, defaultVal) => {
                        const i = colMap[key];
                        return (i !== undefined && row.c[i] && row.c[i].v !== null && row.c[i].v !== undefined) ? row.c[i].v : defaultVal;
                    };

                    const priceNum = getVal('precio', 0);
                    
                    // Photos
                    const photos = [];
                    if (colMap.foto1 !== undefined) {
                        for (let i = colMap.foto1; i < data.table.cols.length; i++) {
                            const c = data.table.cols[i];
                            if (c && c.label && c.label.toLowerCase().includes('foto')) {
                                const cellVal = (row.c[i] && row.c[i].v) ? row.c[i].v : null;
                                const extracted = extractAllDriveImages(cellVal);
                                photos.push(...extracted);
                            }
                        }
                    }
                    
                    let mainImg = photos.length > 0 ? photos[0] : 'assets/hero_building_modern_1782099405549.png';
                    
                    return {
                        id: `prop_${index}`,
                        status: getVal('estatus', 'Disponible'),
                        tipo: getVal('tipo', 'Venta'),
                        title: getVal('titulo', 'Propiedad'),
                        price: priceNum,
                        priceFormatted: formatPrice(priceNum),
                        zoneLabel: getVal('ciudad', 'Zona no especificada'),
                        colonia: getVal('colonia', ''),
                        rooms: getVal('recamaras', 0),
                        bathrooms: getVal('banos', 0),
                        parking: getVal('estacionamientos', 0),
                        m2t: getVal('m2t', '-'),
                        m2c: getVal('m2c', '-'),
                        amenities: String(getVal('amenidades', '')),
                        description: String(getVal('descripcion', 'Descripción no disponible.')),
                        locationUrl: String(getVal('direccion', '')).trim(),
                        img: mainImg,
                        photos: photos.length > 0 ? photos : [mainImg]
                    };
                });
                
                // Initial Render
                filterData();
            })
            .catch(err => {
                // console.error("Error fetching Google Sheets:", err);
                propertiesGrid.innerHTML = '<div style="color:red; grid-column:1/-1; text-align:center;">Error al cargar las propiedades. Intenta de nuevo más tarde.</div>';
            });
    }
});

// =========================================
// Hero GSAP Animations (entrance, parallax, magnetic CTAs, counters)
// =========================================
function initHeroAnimations() {
    if (!window.gsap) return;

    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const hero = document.querySelector('.cinematic-hero');
    if (!hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        return;
    }

    // Entrance Animation
    gsap.set(['.cinematic-badge', '.cinematic-title', '.cinematic-subtitle', '.glass-search-panel'], { autoAlpha: 0, y: 30 });
    
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.cinematic-badge', { autoAlpha: 1, y: 0, duration: 0.8 }, 0.2)
      .to('.cinematic-title', { autoAlpha: 1, y: 0, duration: 1 }, '-=0.6')
      .to('.cinematic-subtitle', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to('.glass-search-panel', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.6');

    // Parallax on Scroll
    if (window.ScrollTrigger) {
        gsap.to('.collage-bg', {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { 
                trigger: hero, 
                start: 'top top', 
                end: 'bottom top', 
                scrub: true 
            }
        });
        
        gsap.to('.cinematic-container', {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: { 
                trigger: hero, 
                start: 'top top', 
                end: 'bottom top', 
                scrub: true 
            }
        });
        
        // Removed .cinematic-content autoAlpha fade out on scroll to prevent it from getting stuck when scrolling up
    }

    // Desktop mouse parallax
    const mm = gsap.matchMedia();
    mm.add('(hover: hover) and (pointer: fine) and (min-width: 992px)', () => {
        const quickX = gsap.quickTo('.collage-bg', 'x', { duration: 0.9, ease: 'power3.out' });
        const quickY = gsap.quickTo('.collage-bg', 'y', { duration: 0.9, ease: 'power3.out' });
        
        const onMove = (e) => {
            const relX = (e.clientX / window.innerWidth - 0.5) * -15;
            const relY = (e.clientY / window.innerHeight - 0.5) * -10;
            quickX(relX);
            quickY(relY);
        };

        hero.addEventListener('mousemove', onMove);
        return () => hero.removeEventListener('mousemove', onMove);
    });
}

// Dynamic Price Filter Logic
document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Select (Glassmorphism) ---
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        // Ignorar si ya tiene wrapper
        if(select.closest('.custom-select-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        
        let placeholderText = 'Selecciona una opción...';
        if(select.options[select.selectedIndex]) {
            placeholderText = select.options[select.selectedIndex].text;
        }
        
        trigger.innerHTML = `<span>${placeholderText}</span><i class="ph ph-caret-down" style="color: var(--primary-gold);"></i>`;
        wrapper.appendChild(trigger);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-options';
        
        Array.from(select.options).forEach(option => {
            if(option.disabled) return; 
            
            const customOption = document.createElement('div');
            customOption.className = 'custom-option';
            customOption.textContent = option.text;
            
            customOption.addEventListener('click', (e) => {
                select.value = option.value;
                trigger.querySelector('span').textContent = option.text;
                trigger.querySelector('span').style.color = '#fff';
                
                select.dispatchEvent(new Event('change'));
                
                optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                customOption.classList.add('selected');
                wrapper.classList.remove('open');
            });
            optionsContainer.appendChild(customOption);
        });
        
        wrapper.appendChild(optionsContainer);
        
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
                if(w !== wrapper) w.classList.remove('open');
            });
            
            wrapper.classList.toggle('open');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(w => w.classList.remove('open'));
    });

    const filterType = document.getElementById('filter-type');
    const filterPrice = document.getElementById('filter-price');
    
    if (filterType && filterPrice) {
        const saleOptions = `
            <option value="all">Sin límite</option>
            <option value="range-1">Menos de $1 Millón</option>
            <option value="range-2">De $1 a $3 Millones</option>
            <option value="range-3">De $3 a $6 Millones</option>
            <option value="range-4">De $6 a $10 Millones</option>
            <option value="range-5">Más de $10 Millones</option>
        `;
        
        const rentOptions = `
            <option value="all">Sin límite</option>
            <option value="range-1">Menos de $10,000 MXN</option>
            <option value="range-2">De $10,000 a $20,000 MXN</option>
            <option value="range-3">De $20,000 a $30,000 MXN</option>
            <option value="range-4">De $30,000 a $50,000 MXN</option>
            <option value="range-5">Más de $50,000 MXN</option>
        `;
        
        filterType.addEventListener('change', (e) => {
            if (e.target.value === 'renta') {
                filterPrice.innerHTML = rentOptions;
            } else {
                filterPrice.innerHTML = saleOptions;
            }
            if (window.setupCustomSelect) {
                window.setupCustomSelect(filterPrice);
            }
        });
    }
});

// =========================================
// MODAL & CAROUSEL LOGIC
// =========================================
let currentActiveProperty = null;
let currentImageIndex = 0;

function openModal(propId) {
    const prop = propertiesData.find(p => p.id === propId);
    if (!prop) return;
    
    currentActiveProperty = prop;
    currentImageIndex = 0;
    
    // Populate Info
    document.getElementById('modal-tipo').textContent = prop.tipo;
    const estatusEl = document.getElementById('modal-estatus');
    if (estatusEl) {
        const st = (prop.status || 'Disponible').toLowerCase();
        const stBg = st === 'vendida' ? '#ef4444' : (st === 'apartada' ? '#facc15' : (st === 'rentada' ? '#3b82f6' : '#4ade80'));
        estatusEl.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${stBg}; box-shadow: 0 0 8px ${stBg}; margin-right:6px;"></span>${prop.status || 'Disponible'}`;
        estatusEl.style.backgroundColor = 'var(--bg-dark)';
        estatusEl.style.color = '#fff';
        estatusEl.style.display = 'inline-flex';
        estatusEl.style.alignItems = 'center';
    }
    document.getElementById('modal-title').textContent = prop.title;
    document.getElementById('modal-colonia').textContent = prop.colonia || 'Ubicación Premium';
    document.getElementById('modal-zone').textContent = prop.zoneLabel;
    document.getElementById('modal-price').textContent = prop.priceFormatted;
    
    document.getElementById('modal-beds').textContent = prop.rooms;
    document.getElementById('modal-baths').textContent = prop.bathrooms;
    document.getElementById('modal-parking').textContent = prop.parking;
    document.getElementById('modal-m2t').textContent = prop.m2t;
    document.getElementById('modal-m2c').textContent = prop.m2c;
    
    document.getElementById('modal-desc-text').textContent = prop.description;
    
    // Populate Amenities
    const amenitiesList = document.getElementById('modal-amenities-list');
    amenitiesList.innerHTML = '';
    if (prop.amenities) {
        const items = prop.amenities.split(',').map(i => i.trim()).filter(i => i);
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            amenitiesList.appendChild(li);
        });
    } else {
        amenitiesList.innerHTML = '<li>Sin amenidades especificadas</li>';
    }
    
    // Populate Location Link
    const locContainer = document.getElementById('modal-location-container');
    const locLink = document.getElementById('modal-location-link');
    if (locContainer && locLink) {
        if (prop.locationUrl) {
            locLink.href = prop.locationUrl;
            locContainer.style.display = 'block';
        } else {
            locContainer.style.display = 'none';
            locLink.href = '#';
        }
    }
    
    // Populate Hidden Form Fields
    document.getElementById('modal-input-id').value = prop.id;
    document.getElementById('modal-input-title').value = prop.title;
    document.getElementById('modal-input-price').value = prop.priceFormatted;
    document.getElementById('modal-input-photo').value = prop.img;
    
    // Reset Form
    const interestForm = document.getElementById('modal-interest-form');
    if (interestForm) interestForm.reset();
    const msgEl = document.getElementById('modal-form-msg');
    if (msgEl) msgEl.style.display = 'none';

    // Set up Carousel
    updateCarousel();
    
    // Show Modal
    document.getElementById('property-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Check if scroll indicator is needed
    setTimeout(() => {
        const infoSec = document.querySelector('.modal-info-section');
        const indicator = document.querySelector('.modal-scroll-indicator');
        if (infoSec && indicator) {
            infoSec.scrollTop = 0; // Reset scroll
            if (infoSec.scrollHeight > infoSec.clientHeight + 20) {
                indicator.classList.remove('hidden');
            } else {
                indicator.classList.add('hidden');
            }
        }
    }, 100);
}

function closeModal() {
    document.getElementById('property-modal').classList.remove('active');
    currentActiveProperty = null;
    document.body.style.overflow = '';
}

function updateCarousel() {
    if (!currentActiveProperty) return;
    const photos = currentActiveProperty.photos;
    const imgEl = document.getElementById('modal-carousel-image');
    imgEl.style.opacity = '0';
    const tempImg = new Image();
    tempImg.onload = () => {
        imgEl.style.backgroundImage = `url('${photos[currentImageIndex]}')`;
        imgEl.style.opacity = '1';
    };
    tempImg.onerror = () => {
        imgEl.style.backgroundImage = `url('${photos[currentImageIndex]}')`;
        imgEl.style.opacity = '1';
    };
    tempImg.src = photos[currentImageIndex];
    
    // Update dots
    const dotsContainer = document.getElementById('carousel-indicators');
    dotsContainer.innerHTML = '';
    if (photos.length > 1) {
        photos.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (i === currentImageIndex ? ' active' : '');
            dot.onclick = () => {
                currentImageIndex = i;
                updateCarousel();
            };
            dotsContainer.appendChild(dot);
        });
        document.getElementById('carousel-prev').style.display = 'flex';
        document.getElementById('carousel-next').style.display = 'flex';
    } else {
        document.getElementById('carousel-prev').style.display = 'none';
        document.getElementById('carousel-next').style.display = 'none';
    }
}

function nextImage() {
    if (!currentActiveProperty) return;
    const max = currentActiveProperty.photos.length;
    currentImageIndex = (currentImageIndex + 1) % max;
    updateCarousel();
}

function prevImage() {
    if (!currentActiveProperty) return;
    const max = currentActiveProperty.photos.length;
    currentImageIndex = (currentImageIndex - 1 + max) % max;
    updateCarousel();
}

// Event Listeners for Modal
document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Select (Glassmorphism) ---
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        // Ignorar si ya tiene wrapper
        if(select.closest('.custom-select-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        
        let placeholderText = 'Selecciona una opción...';
        if(select.options[select.selectedIndex]) {
            placeholderText = select.options[select.selectedIndex].text;
        }
        
        trigger.innerHTML = `<span>${placeholderText}</span><i class="ph ph-caret-down" style="color: var(--primary-gold);"></i>`;
        wrapper.appendChild(trigger);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-options';
        
        Array.from(select.options).forEach(option => {
            if(option.disabled) return; 
            
            const customOption = document.createElement('div');
            customOption.className = 'custom-option';
            customOption.textContent = option.text;
            
            customOption.addEventListener('click', (e) => {
                select.value = option.value;
                trigger.querySelector('span').textContent = option.text;
                trigger.querySelector('span').style.color = '#fff';
                
                select.dispatchEvent(new Event('change'));
                
                optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                customOption.classList.add('selected');
                wrapper.classList.remove('open');
            });
            optionsContainer.appendChild(customOption);
        });
        
        wrapper.appendChild(optionsContainer);
        
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
                if(w !== wrapper) w.classList.remove('open');
            });
            
            wrapper.classList.toggle('open');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(w => w.classList.remove('open'));
    });

    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('property-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'property-modal') closeModal();
    });
    document.getElementById('carousel-next')?.addEventListener('click', nextImage);
    document.getElementById('carousel-prev')?.addEventListener('click', prevImage);

    // Event Listeners for Properties Grid Carousel
    const grid = document.getElementById('properties-grid');
    const swipeIndicator = document.querySelector('.swipe-indicator');
    
    grid?.addEventListener('scroll', () => {
        if (swipeIndicator) {
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            if (grid.scrollLeft >= maxScroll - 20) {
                swipeIndicator.classList.add('left-side');
                swipeIndicator.innerHTML = '<i class="ph ph-hand-swipe-right"></i> Regresa';
            } else {
                swipeIndicator.classList.remove('left-side');
                swipeIndicator.innerHTML = '<i class="ph ph-hand-swipe-left"></i> Desliza';
            }
        }
    });

    const modalInfoSection = document.querySelector('.modal-info-section');
    const modalScrollIndicator = document.querySelector('.modal-scroll-indicator');
    
    modalInfoSection?.addEventListener('scroll', () => {
        if (modalScrollIndicator && !modalScrollIndicator.classList.contains('hidden')) {
            if (modalInfoSection.scrollTop > 20) {
                modalScrollIndicator.classList.add('hidden');
            }
        }
    });

    document.getElementById('grid-prev')?.addEventListener('click', () => {
        if (grid) grid.scrollBy({ left: -380, behavior: 'smooth' }); // card width + gap
    });
    document.getElementById('grid-next')?.addEventListener('click', () => {
        if (grid) grid.scrollBy({ left: 380, behavior: 'smooth' });
    });

    // Handle Modal Interest Form Submission
    const interestForm = document.getElementById('modal-interest-form');
    if (interestForm) {
        interestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('modal-submit-btn');
            const msgEl = document.getElementById('modal-form-msg');
            
            // Gather data
            const payload = {
                name: document.getElementById('modal-input-name').value,
                phone: document.getElementById('modal-input-phone').value,
                email: document.getElementById('modal-input-email').value,
                propId: document.getElementById('modal-input-id').value,
                propTitle: document.getElementById('modal-input-title').value,
                propPrice: document.getElementById('modal-input-price').value,
                propPhoto: document.getElementById('modal-input-photo').value
            };

            if (!payload.name.trim() || !payload.phone.trim() || !payload.email.trim()) {
                msgEl.style.display = 'block';
                msgEl.style.color = '#ff6b6b';
                msgEl.textContent = 'Por favor, completa todos los campos obligatorios (*).';
                return;
            }

            // Update UI
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            msgEl.style.display = 'none';

            fetch('enviar_correo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                btn.textContent = 'Enviar Información';
                btn.disabled = false;
                msgEl.style.display = 'block';
                
                if (data.success) {
                    msgEl.style.color = '#4ade80'; // green
                    msgEl.textContent = '¡Información enviada con éxito! Nos pondremos en contacto pronto.';
                    interestForm.reset();
                } else {
                    msgEl.style.color = '#f87171'; // red
                    msgEl.textContent = 'Error: ' + data.message;
                    // console.error("Mail error:", data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                msgEl.style.color = '#ff6b6b';
                msgEl.textContent = 'Error de conexión. Asegúrate de probar desde Hostinger.';
                btn.textContent = 'Enviar Información';
                btn.disabled = false;
            });
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("interactive-map");
    if (mapElement && typeof L !== "undefined") {
        const map = L.map("interactive-map", { zoomControl: false }).setView([20.7521, -103.4542], 16);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: ""
        }).addTo(map);
        
        const customIcon = L.divIcon({
            className: "custom-map-marker",
            html: "<div style=\"background-color: var(--primary-gold); width: 24px; height: 24px; border-radius: 50%; border: 3px solid #0f1013; box-shadow: 0 0 15px rgba(230,175,46,0.6);\"></div>",
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
        
        L.marker([20.7521, -103.4542], {icon: customIcon}).addTo(map);
    }
});
