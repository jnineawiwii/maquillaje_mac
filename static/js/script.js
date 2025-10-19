document.addEventListener('DOMContentLoaded', function() {
    // ===== Añadir al carrito =====
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.getElementById('cart-count');

    function bumpCart(){
        if(cartCount){
            cartCount.classList.add('bump');
            setTimeout(()=>cartCount.classList.remove('bump'),200);
        }
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            addToCart(productId, 1);
            bumpCart(); // efecto bump al agregar
        });
    });

    // Inicializar funcionalidad del carrito
    if (document.querySelector('.cart-container')) {
        initCartFunctionality();
    }

    // ===== Dropdown menú usuario y menú hamburguesa =====
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');

        if(btn && content){
            content.style.maxHeight = '0px';
            content.style.overflow = 'hidden';
            content.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
            content.style.opacity = '0';

            btn.addEventListener('click', e => {
                e.stopPropagation();
                // Ocultar temporalmente el botón activo según la página
                const currentPage = window.location.pathname;
                const links = content.querySelectorAll('a');
                links.forEach(link => {
                    link.style.display = (link.getAttribute('href') === currentPage) ? 'none' : 'block';
                });

                if(content.classList.contains('show')){
                    content.style.maxHeight = '0px';
                    content.style.opacity = '0';
                    content.classList.remove('show');
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.opacity = '1';
                    content.classList.add('show');
                }
            });
        }
    });

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if(mobileMenuBtn && navMenu){
        navMenu.style.maxHeight = '0px';
        navMenu.style.overflow = 'hidden';
        navMenu.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        navMenu.style.opacity = '0';

        mobileMenuBtn.addEventListener('click', e => {
            e.stopPropagation();
            if(navMenu.classList.contains('show')){
                navMenu.style.maxHeight = '0px';
                navMenu.style.opacity = '0';
                navMenu.classList.remove('show');
            } else {
                navMenu.style.maxHeight = navMenu.scrollHeight + 'px';
                navMenu.style.opacity = '1';
                navMenu.classList.add('show');
            }
        });
    }

    // Cerrar dropdowns y menú al hacer click fuera
    document.addEventListener('click', e => {
        dropdowns.forEach(dropdown => {
            const content = dropdown.querySelector('.dropdown-content');
            if(content) {
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                content.classList.remove('show');
            }
        });
        if(navMenu){
            navMenu.style.maxHeight = '0px';
            navMenu.style.opacity = '0';
            navMenu.classList.remove('show');
        }
    });

    // ===== Tema y lector de pantalla =====
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeBtnMenu = document.getElementById('themeToggleBtnMenu');
    const srToggle = document.getElementById('srToggleBtn');
    const srToggleMenu = document.getElementById('srToggleBtnMenu');

    if(localStorage.getItem('theme') === 'dark'){
        document.body.classList.add('dark-mode');
        if(themeBtn) themeBtn.textContent = '☀️';
        if(themeBtnMenu) themeBtnMenu.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        if(themeBtn) themeBtn.textContent = '🌙';
        if(themeBtnMenu) themeBtnMenu.textContent = '🌙';
    }

    function toggleTheme(){
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark':'light');
        if(themeBtn) themeBtn.textContent = isDark ? '☀️':'🌙';
        if(themeBtnMenu) themeBtnMenu.textContent = isDark ? '☀️':'🌙';
    }

    if(themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if(themeBtnMenu) themeBtnMenu.addEventListener('click', toggleTheme);

    // Lector de pantalla
    window.srEnabled = false;
    window.srSpeechEnabled = false;

    function srAnnounce(message, politeness='polite'){
        const el = document.getElementById('sr-announcer');
        if(el){
            el.setAttribute('aria-live', politeness);
            el.textContent = '';
            setTimeout(()=>{ el.textContent = message; }, 100);
        }
        if(window.srSpeechEnabled && 'speechSynthesis' in window && message){
            try{
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(message);
                u.lang = 'es-ES';
                window.speechSynthesis.speak(u);
            } catch(e){ console.warn('SpeechSynthesis error', e); }
        }
    }

    function toggleSR(){
        window.srEnabled = !window.srEnabled;
        const isActive = window.srEnabled;
        if(srToggle) srToggle.classList.toggle('active', isActive);
        if(srToggle) srToggle.setAttribute('aria-pressed', isActive?'true':'false');
        if(srToggleMenu) srToggleMenu.classList.toggle('active', isActive);
        if(srToggleMenu) srToggleMenu.setAttribute('aria-pressed', isActive?'true':'false');
        window.srSpeechEnabled = isActive;
        srAnnounce(isActive ? 'Lector de pantalla activado':'Lector de pantalla desactivado');
    }

    if(srToggle) srToggle.addEventListener('click', toggleSR);
    if(srToggleMenu) srToggleMenu.addEventListener('click', toggleSR);
});

// ===== Funciones de carrito =====
function initCartFunctionality(){ /* ... tu código de carrito aquí ... */ }
function removeItemFromCart(productId){ /* ... tu código de eliminar aquí ... */ }
function updateQuantity(productId, quantity, quantityElement){ /* ... */ }
function addToCart(productId, quantity){ /* ... */ }
function showNotification(message,type){ /* ... */ }
function updateCartCount(change=0){ /* ... */ }
