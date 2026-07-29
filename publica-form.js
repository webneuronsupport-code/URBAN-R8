document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('property-form');
    if (!form) return;

    // Elementos del DOM
    const nameInput = document.getElementById('qNombre');
    const phoneInput = document.getElementById('qTel');

    // 1. Máscara de teléfono (solo números, max 10 dígitos)
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,4})(\d{0,4})/);
            if (!x[2]) {
                e.target.value = x[1];
            } else {
                e.target.value = !x[3] ? x[1] + ' ' + x[2] : x[1] + ' ' + x[2] + ' ' + x[3];
            }
        });
    }

    // 2. File Input UX (Cambiar el texto cuando seleccionan archivos)
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const dropArea = this.closest('.file-drop-area');
            const msg = dropArea.querySelector('.file-msg');
            
            if (this.files && this.files.length > 1) {
                msg.textContent = `${this.files.length} archivos seleccionados`;
            } else if (this.files && this.files.length === 1) {
                msg.textContent = this.files[0].name;
            } else {
                if (this.id === 'pub-photos') {
                    msg.innerHTML = 'Arrastra fotos aquí o haz clic<br><span style="opacity:.7;">Mín. 3 · Máx. 20 · JPG/PNG</span>';
                } else {
                    msg.innerHTML = 'Escrituras o comprobante (opcional)<br><span style="opacity:.7;">PDF o imagen</span>';
                }
            }
            
            // Si es el input de fotos, contar si cumple el mínimo
            if (this.id === 'pub-photos') {
                if (this.files.length > 0 && this.files.length < 3) {
                    msg.innerHTML = `<span style="color: #ff4444;">Debes subir mínimo 3 fotos. Tienes ${this.files.length}.</span>`;
                    this.setCustomValidity('Selecciona al menos 3 fotos.');
                } else if (this.files.length > 20) {
                    msg.innerHTML = `<span style="color: #ff4444;">Máximo 20 fotos permitidas.</span>`;
                    this.setCustomValidity('Máximo 20 fotos.');
                } else {
                    this.setCustomValidity('');
                }
            }
        });
    });

    // 3. Validaciones y envío
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar nombre (mínimo 2 palabras)
        if (nameInput) {
            const nameVal = nameInput.value.trim();
            if (nameVal.split(/\s+/).length < 2) {
                alert('Por favor, ingresa tu nombre y al menos un apellido.');
                nameInput.focus();
                return;
            }
        }

        const btn = document.getElementById('submit-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
        btn.disabled = true;

        // Envío real a enviar_propiedad.php (incluye archivos)
        const formData = new FormData(form);

        fetch('enviar_propiedad.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                if (data.success) {
                    alert('✅ ¡Propiedad enviada con éxito! Uno de nuestros asesores se pondrá en contacto contigo pronto.');
                    form.reset();
                    document.querySelectorAll('.file-msg').forEach(msg => {
                        if (msg.closest('.file-drop-area')?.querySelector('#pub-photos')) {
                            msg.innerHTML = 'Arrastra fotos aquí o haz clic<br><span style="opacity:.7;">Mín. 3 · Máx. 20 · JPG/PNG</span>';
                        } else {
                            msg.innerHTML = 'Escrituras o comprobante (opcional)<br><span style="opacity:.7;">PDF o imagen</span>';
                        }
                    });
                } else {
                    alert('❌ Error al enviar: ' + (data.message || 'Intenta de nuevo.'));
                }
            })
            .catch(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                alert('❌ Error de conexión. Por favor intenta de nuevo.');
            });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const detailToggle = document.getElementById('detailToggle');
    const detailBody = document.getElementById('detailBody');
    if (detailToggle && detailBody) {
        detailToggle.addEventListener('click', () => {
            detailBody.classList.toggle('open');
            detailToggle.classList.toggle('open');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const faqs = document.querySelectorAll('.faq-q');
    faqs.forEach(q => {
        q.addEventListener('click', () => {
            const currentItem = q.parentElement;
            const isOpen = currentItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            if (!isOpen) {
                currentItem.classList.add('active');
            }
        });
    });
});
