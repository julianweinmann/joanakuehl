document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const cookiePlaceholder = document.getElementById('cookie-banner-placeholder');

    const loadComponent = (url, placeholder) => {
        if (placeholder) {
            fetch(url)
                .then(response => response.ok ? response.text() : Promise.reject(`Could not load ${url}`))
                .then(data => {
                    placeholder.innerHTML = data;
                    if (placeholder.id === 'header-placeholder') initializeHeaderScripts();
                    if (placeholder.id === 'cookie-banner-placeholder') initializeCookieBanner();
                })
                .catch(error => console.error('Error loading component:', error));
        }
    };

    const initializeHeaderScripts = () => {
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const nav = document.getElementById('navbar');

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        if (nav) {
            nav.classList.add('nav-sticky');
            const handleScroll = () => {
                if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                    if (window.scrollY > 20) nav.classList.add('nav-scrolled');
                    else nav.classList.remove('nav-scrolled');
                }
            };
            if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                nav.classList.add('nav-scrolled');
            }
            window.addEventListener('scroll', handleScroll);
            handleScroll();
        }
    };

    const initializeCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        const declineBtn = document.getElementById('decline-cookies');
        const closeBtn = document.getElementById('close-cookie-banner');

        const consent = getCookie('user_consent');

        if (!consent) {
            banner.classList.remove('hidden');
        } else if (consent === 'granted') {
            activateAnalytics();
        }

        acceptBtn.addEventListener('click', () => {
            setCookie('user_consent', 'granted', 365);
            banner.classList.add('hidden');
            activateAnalytics();
        });

        declineBtn.addEventListener('click', () => {
            setCookie('user_consent', 'denied', 365);
            banner.classList.add('hidden');
        });
        
        closeBtn.addEventListener('click', () => {
             banner.classList.add('hidden');
        });
    };

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Load components
    loadComponent('/header.html', headerPlaceholder);
    loadComponent('/footer.html', footerPlaceholder);
    loadComponent('/cookie-banner.html', cookiePlaceholder);
});

// This function will be called by the script if consent is given
function activateAnalytics() {
    if (typeof gtag === 'function') {
        gtag('config', 'G-Z4CPETEVFE');
    }
}
