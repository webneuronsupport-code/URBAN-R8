document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------
    // MÓDULO: FORMULARIO DE ADMINISTRACIÓN
    // ----------------------------------------
    const adminForm = document.getElementById('admin-property-form');
    const adminStatus = document.getElementById('admin-status');

    if (adminForm) {
        adminForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Mostrar estado de carga
            const submitBtn = adminForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Subiendo...';
            submitBtn.disabled = true;
            adminStatus.innerHTML = '';
            adminStatus.className = 'admin-status';

            // 2. Recopilar datos del formulario
            const payload = {
                id: document.getElementById('prop-id').value,
                titulo: document.getElementById('prop-title').value,
                precio: document.getElementById('prop-price').value,
                zona: document.getElementById('prop-zone').value,
                colonia: document.getElementById('prop-colonia').value,
                imagen: document.getElementById('prop-image').value,
                recamaras: document.getElementById('prop-rooms').value,
                banos: document.getElementById('prop-baths').value,
                estacionamiento: document.getElementById('prop-parking').value
            };

            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // ATENCIÓN: PEGAR AQUÍ LA URL DEL WEB APP DE APPS SCRIPT
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            const APPS_SCRIPT_WEB_APP_URL = "REEMPLAZAR_CON_TU_URL_DE_APPS_SCRIPT";

            if (APPS_SCRIPT_WEB_APP_URL === "REEMPLAZAR_CON_TU_URL_DE_APPS_SCRIPT") {
                adminStatus.innerHTML = "⚠️ Falta configurar la URL de Google Apps Script en admin.js";
                adminStatus.classList.add('error');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                return;
            }

            try {
                // 3. Enviar datos a Google Sheets
                // Apps Script POST requests from browser sometimes require 'no-cors' 
                // or specific URL encoded data. Here we send text plain to bypass preflight.
                const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    }
                });

                adminStatus.innerHTML = "✅ ¡Propiedad cargada con éxito! Ve a la página principal para verla.";
                adminStatus.classList.add('success');
                
                // Limpiar formulario
                adminForm.reset();
                
            } catch (error) {
                console.error("Error subiendo datos:", error);
                adminStatus.innerHTML = "❌ Hubo un error al conectar con Google Sheets. Intenta nuevamente.";
                adminStatus.classList.add('error');
            } finally {
                // Restaurar botón
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
