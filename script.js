document.addEventListener('DOMContentLoaded', () => {
    // Contadores y botones de carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart, .btn-add');
    const cartCount = document.getElementById('cart-count') || document.querySelector('.cart-count');

    function bumpCart(){
        if(!cartCount) return;
        cartCount.classList.add('bump');
        setTimeout(()=>cartCount.classList.remove('bump'), 200);
    }

    function updateCartDisplay(n){
        if(!cartCount) return;
        cartCount.textContent = String(n);
    }

    // Simple implementación cliente (placeholder para integrar backend)
    function addToCart(productId, qty = 1){
        const current = parseInt(cartCount?.textContent) || 0;
        const next = current + qty;
        updateCartDisplay(next);
        bumpCart();
        // Aquí puedes agregar fetch() hacia tu API para persistir el carrito
        return Promise.resolve({ success: true, count: next });
    }

    // Asignar listeners a botones
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.productId || btn.getAttribute('data-product-id') || null;
            addToCart(id, 1);
        });
    });

    // Dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(d => {
        const btn = d.querySelector('.dropdown-btn');
        const content = d.querySelector('.dropdown-content');
        if(!btn || !content) return;

        // init styles
        content.style.maxHeight = content.classList.contains('show') ? content.scrollHeight + 'px' : '0px';
        content.style.overflow = 'hidden';
        content.style.opacity = content.classList.contains('show') ? '1' : '0';
        content.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';

        btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const isOpen = d.classList.toggle('show');
            if(isOpen){
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
            } else {
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
            }
        });
    });

    // Cerrar dropdowns al click fuera
    document.addEventListener('click', (ev) => {
        dropdowns.forEach(d => {
            if(d.classList.contains('show') && !d.contains(ev.target)){
                d.classList.remove('show');
                const content = d.querySelector('.dropdown-content');
                if(content){
                    content.style.maxHeight = '0px';
                    content.style.opacity = '0';
                }
            }
        });
    });

    // Mobile menu toggle (si existe)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if(mobileMenuBtn && navMenu){
        navMenu.style.maxHeight = navMenu.classList.contains('show') ? navMenu.scrollHeight + 'px' : '0px';
        navMenu.style.overflow = 'hidden';
        navMenu.style.opacity = navMenu.classList.contains('show') ? '1' : '0';
        navMenu.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';

        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = navMenu.classList.toggle('show');
            navMenu.style.maxHeight = open ? navMenu.scrollHeight + 'px' : '0px';
            navMenu.style.opacity = open ? '1' : '0';
        });
    }

    // Tema oscuro / claro
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeBtnMenu = document.getElementById('themeToggleBtnMenu');

    function setTheme(isDark){
        document.body.classList.toggle('dark-mode', !!isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if(themeBtn) themeBtn.textContent = isDark ? '☀️' : '🌙';
        if(themeBtnMenu) themeBtnMenu.textContent = isDark ? '☀️' : '🌙';
    }

    setTheme(localStorage.getItem('theme') === 'dark');

    if(themeBtn) themeBtn.addEventListener('click', () => setTheme(!document.body.classList.contains('dark-mode')));
    if(themeBtnMenu) themeBtnMenu.addEventListener('click', () => setTheme(!document.body.classList.contains('dark-mode')));

    // Lector de pantalla (mínimo seguro)
    const srToggle = document.getElementById('srToggleBtn');
    const srToggleMenu = document.getElementById('srToggleBtnMenu');
    const srVisual = document.getElementById('sr-visual-announcer');
    const srLive = document.getElementById('sr-announcer');

    window.srEnabled = !!window.srEnabled;
    window.srSpeechEnabled = !!window.srSpeechEnabled;

    function srAnnounce(message, politeness = 'polite', visual = true){
        if(srLive){
            srLive.setAttribute('aria-live', politeness);
            srLive.textContent = '';
            setTimeout(()=> srLive.textContent = message, 100);
        }
        if(visual && srVisual){
            srVisual.textContent = message;
            srVisual.classList.add('show');
            setTimeout(()=> srVisual.classList.remove('show'), 3000);
        }
        if(window.srSpeechEnabled && 'speechSynthesis' in window && message){
            try{
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(message);
                u.lang = 'es-ES';
                u.rate = 0.95;
                window.speechSynthesis.speak(u);
            }catch(e){ console.warn('speech error', e); }
        }
    }

    // Exponer srAnnounce sin sobrescribir si ya existe
    if(!window.srAnnounce) window.srAnnounce = srAnnounce;

    function toggleSR(){
        window.srEnabled = !window.srEnabled;
        window.srSpeechEnabled = window.srEnabled;
        document.body.classList.toggle('sr-active', window.srEnabled);
        if(srToggle) { srToggle.classList.toggle('active', window.srEnabled); srToggle.setAttribute('aria-pressed', window.srEnabled ? 'true' : 'false'); }
        if(srToggleMenu) { srToggleMenu.classList.toggle('active', window.srEnabled); srToggleMenu.setAttribute('aria-pressed', window.srEnabled ? 'true' : 'false'); }
        srAnnounce(window.srEnabled ? 'Lector de pantalla activado' : 'Lector de pantalla desactivado', 'assertive', true);
    }
    if(srToggle) srToggle.addEventListener('click', toggleSR);
    if(srToggleMenu) srToggleMenu.addEventListener('click', toggleSR);

    // Controles de contraste (slider + reset + botón alto contraste)
    const contrastRange = document.getElementById('contrastRange');
    const contrastValue = document.getElementById('contrastValue');
    const contrastReset = document.getElementById('contrastReset');
    const toggleContrastBtn = document.getElementById('toggleContrastBtn');

    function applyContrast(level){
        const factor = (Number(level) || 100) / 100;
        document.body.style.filter = `contrast(${factor})`;
        localStorage.setItem('contrastLevel', String(level));
        if(contrastValue) contrastValue.textContent = `${level}%`;
    }

    const savedContrast = parseInt(localStorage.getItem('contrastLevel')) || 100;
    applyContrast(savedContrast);
    if(contrastRange){
        contrastRange.value = savedContrast;
        contrastRange.addEventListener('input', (e) => applyContrast(e.target.value));
        contrastRange.addEventListener('change', (e) => { localStorage.setItem('contrastLevel', e.target.value); srAnnounce(`Contraste ${e.target.value} por ciento`); });
    }
    if(contrastReset) contrastReset.addEventListener('click', () => { applyContrast(100); if(contrastRange) contrastRange.value = 100; srAnnounce('Contraste restablecido'); });
    if(toggleContrastBtn) toggleContrastBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('high-contrast');
        const isHC = document.documentElement.classList.contains('high-contrast');
        // Al activar alto contraste, normalizamos el filtro del slider para evitar conflictos visuales
        applyContrast(100);
        if(contrastRange) contrastRange.value = 100;
        localStorage.setItem('a11yHighContrast', isHC ? '1' : '0');
        srAnnounce(isHC ? 'Alto contraste activado' : 'Alto contraste desactivado');
    });

    // Inicializaciones opcionales (si hay contenedor de carrito)
    if(document.querySelector('.cart-container')) {
        if(typeof initCartFunctionality === 'function') initCartFunctionality();
    }
}); // DOMContentLoaded

// Funciones públicas (placeholders)
function initCartFunctionality(){ /* implementar según backend */ }
function removeItemFromCart(productId){ /* implementar según backend */ }
function updateQuantity(productId, quantity, quantityElement){ /* implementar según backend */ }
// Añadir función global addToCart solo si no está definida (mantener compatibilidad)
if(typeof window.addToCart !== 'function'){
    window.addToCart = function(productId, qty){ return addToCartFallback(productId, qty); };
}
function addToCartFallback(productId, qty = 1){
    const cartCountEl = document.getElementById('cart-count') || document.querySelector('.cart-count');
    const current = parseInt(cartCountEl?.textContent) || 0;
    const next = current + qty;
    if(cartCountEl) cartCountEl.textContent = String(next);
    if(cartCountEl) cartCountEl.classList.add('bump') && setTimeout(()=>cartCountEl.classList.remove('bump'), 200);
    return Promise.resolve({ success: true, count: next });
}
function showNotification(message, type){ console.log('notify:', type, message); }
function updateCartCount(change = 0){ /* implementar según necesidad */ }
