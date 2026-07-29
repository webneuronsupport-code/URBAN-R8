<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="assets/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Urban R8 | Inmobiliaria y Constructora</title>
    <meta name="description" content="Urban R8 - Hacemos que tus sueños sucedan. Soluciones en construcción, tablaroca y carpintería.">
    <link rel="stylesheet" href="urban-style-cinematic-final.css?v=2.7">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
</head>
<body>
    <!-- Navbar -->
    <header class="header site-header" id="header">
    <!-- Top Tier (Contact & Logo) -->
    <div class="header-top">
        <div class="container header-top-container">
            <div class="logo">
                <a href="#">
                    <img src="assets/LOGO URBAN PNG.png" alt="Urban R8" class="brand-logo">
                </a>
            </div>
            <div class="header-contact-info">
                <div class="social-icons">
    <a href="https://wa.me/523328418117" target="_blank"><i class="ph ph-whatsapp-logo"></i></a>
    <a href="https://www.facebook.com/share/1S8vSSKaYX/?mibextid=wwXIfr" target="_blank"><i class="ph ph-facebook-logo"></i></a>
    <a href="https://www.tiktok.com/@urban.r8?_r=1&_t=ZS-987Z3gZqnyv" target="_blank"><i class="ph ph-tiktok-logo"></i></a>
    <a href="https://www.instagram.com/urbanr8?igsh=ZnEyNGkzaXB1OGl1" target="_blank"><i class="ph ph-instagram-logo"></i></a>
</div>
                <div class="contact-details">
                    <strong><i class="ph-fill ph-phone"></i> 33 28 41 81 17</strong>
                    <span>contacto@urbanr8.com</span>
                </div>
            </div>
            <!-- Menu Toggle on Mobile -->
            <div class="menu-toggle" id="menu-toggle">
                <i class="ph ph-list"></i>
            </div>
        </div>
    </div>
    <!-- Bottom Tier (Navigation) -->
    <div class="header-bottom">
        <div class="container header-bottom-container">
            <nav class="nav" id="nav-menu">
                <a href="index.html" class="nav-link">Inicio</a>
                <a href="index.html#catalogo" class="nav-link">Propiedades</a>
                <a href="publica.html" class="nav-link">Publica tu Propiedad</a>
                <a href="construccion.html" class="nav-link">Construcción</a>
                <a href="index.html#contacto" class="nav-link">Contáctanos</a>
                
                <!-- Mobile Contact Footer (Visible only on mobile) -->
                <div class="mobile-nav-footer">
                    <div class="contact-details">
                        <strong><i class="ph-fill ph-phone"></i> 33 28 41 81 17</strong>
                        <span>contacto@urbanr8.com</span>
                    </div>
                    <div class="social-icons">
    <a href="https://wa.me/523328418117" target="_blank"><i class="ph ph-whatsapp-logo"></i></a>
    <a href="https://www.facebook.com/share/1S8vSSKaYX/?mibextid=wwXIfr" target="_blank"><i class="ph ph-facebook-logo"></i></a>
    <a href="https://www.tiktok.com/@urban.r8?_r=1&_t=ZS-987Z3gZqnyv" target="_blank"><i class="ph ph-tiktok-logo"></i></a>
    <a href="https://www.instagram.com/urbanr8?igsh=ZnEyNGkzaXB1OGl1" target="_blank"><i class="ph ph-instagram-logo"></i></a>
</div>
                </div>
            </nav>
        </div>
    </div>
</header>

    <main>
        <section class="section" style="padding-top: 120px;">
            <div class="container">
                <div class="text-center mb-5">
                    <h2 class="section-title">Panel de Administración</h2>
                    <p class="section-subtitle">Gestiona tus propiedades. Los cambios se sincronizarán con tu página web automáticamente.</p>
                </div>

                <div class="admin-panel">
                    <div class="admin-card">
                        <h3><i class="ph ph-plus-circle"></i> Cargar Nueva Propiedad</h3>
                        <form id="admin-property-form" class="admin-form">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>ID Propiedad</label>
                                    <input type="text" id="prop-id" placeholder="Ej. PROP-021" required>
                                </div>
                                <div class="form-group">
                                    <label>Título / Nombre corto</label>
                                    <input type="text" id="prop-title" placeholder="Ej. Casa minimalista" required>
                                </div>
                                <div class="form-group">
                                    <label>Precio (Solo números)</label>
                                    <input type="number" id="prop-price" placeholder="Ej. 2500000" required>
                                </div>
                                <div class="form-group">
                                    <label>Zona (General)</label>
                                    <select id="prop-zone" required>
                                        <option value="Zapopan">Zapopan</option>
                                        <option value="Guadalajara">Guadalajara</option>
                                        <option value="Tlajomulco">Tlajomulco</option>
                                        <option value="Norte">Norte</option>
                                        <option value="Sur">Sur</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Colonia / Ubicación Específica</label>
                                    <input type="text" id="prop-colonia" placeholder="Ej. Providencia" required>
                                </div>
                                <div class="form-group">
                                    <label>Enlace de Imagen</label>
                                    <input type="url" id="prop-image" placeholder="https://..." required>
                                </div>
                                <div class="form-group">
                                    <label>Habitaciones</label>
                                    <input type="number" id="prop-rooms" value="1" min="0" required>
                                </div>
                                <div class="form-group">
                                    <label>Baños</label>
                                    <input type="number" id="prop-baths" value="1" min="0" step="0.5" required>
                                </div>
                                <div class="form-group">
                                    <label>Estacionamientos</label>
                                    <input type="number" id="prop-parking" value="1" min="0" required>
                                </div>
                            </div>
                            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 20px;">Subir Propiedad a Google Sheets</button>
                            <div id="admin-status" class="admin-status"></div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                <div class="logo">
                    <a href="#">
                        <img src="assets/LOGO URBAN PNG.png" alt="Urban R8" class="brand-logo">
                    </a>
                </div>
                    <p>Inmobiliaria y Constructora. Hacemos que tus sueños sucedan con calidad y excelencia.</p>
                </div>
                <div class="footer-links">
                    <h4>Enlaces Rápidos</h4>
                    <ul>
                        <li><a href="#inicio">Inicio</a></li>

                        <li><a href="#contacto">Contacto</a></li>
                        <li><a href="aviso-privacidad.html">Aviso de Privacidad</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <span id="year"></span> Urban R8. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script src="admin.js"></script>

    <!-- Chatwoot Widget -->
    <script>
      window.chatwootSettings = {"position":"right","type":"expanded_bubble","launcherTitle":""};
      (function(d,t) {
        var BASE_URL="https://orion.webneuron.com.mx";
        var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
        g.src=BASE_URL+"/packs/js/sdk.js";
        g.async = true;
        s.parentNode.insertBefore(g,s);
        g.onload=function(){
          window.chatwootSDK.run({
            websiteToken: 'dKUtPiatQvm2UQ2MgYPj4iHT',
            baseUrl: BASE_URL
          })
        }
      })(document,"script");
    </script>

    <!-- WhatsApp Floating Button -->
    <a href="https://wa.me/523328418117?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20proyectos%20y%20servicios%20de%20Urban%20R8." class="whatsapp-float" target="_blank" aria-label="Chat on WhatsApp">
        <i class="ph-fill ph-whatsapp-logo"></i>
    </a>
</body>
</html>
