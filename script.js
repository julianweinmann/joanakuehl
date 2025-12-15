document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const cookiePlaceholder = document.getElementById('cookie-banner-placeholder');

    // 1. DETECT LANGUAGE
    // Checks if the current URL contains "/en/" to decide which files to load
    const isEnglish = window.location.pathname.includes('/en/');

    // 2. DEFINE FILE PATHS
    // If English, load the -en.html versions. Otherwise, load standard German files.
    const headerFile = isEnglish ? '/header-en.html' : '/header.html';
    const footerFile = isEnglish ? '/footer-en.html' : '/footer.html';
    const cookieFile = isEnglish ? '/cookie-banner-en.html' : '/cookie-banner.html';

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
            
            // Check if we are on the Home page (German OR English)
            const isHomePage = window.location.pathname === '/' || 
                               window.location.pathname === '/index.html' || 
                               window.location.pathname === '/en/' || 
                               window.location.pathname === '/en/index.html';

            const handleScroll = () => {
                // If on homepage, only show white background after scrolling
                if (isHomePage) {
                    if (window.scrollY > 20) nav.classList.add('nav-scrolled');
                    else nav.classList.remove('nav-scrolled');
                }
            };

            // If NOT on homepage, always show white background
            if (!isHomePage) {
                nav.classList.add('nav-scrolled');
            }

            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Trigger once on load
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

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                setCookie('user_consent', 'granted', 365);
                banner.classList.add('hidden');
                activateAnalytics();
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                setCookie('user_consent', 'denied', 365);
                banner.classList.add('hidden');
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                 banner.classList.add('hidden');
            });
        }
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

    // 3. LOAD COMPONENTS (Using the variables we defined at the top)
    loadComponent(headerFile, headerPlaceholder);
    loadComponent(footerFile, footerPlaceholder);
    loadComponent(cookieFile, cookiePlaceholder);
});

// This function will be called by the script if consent is given
function activateAnalytics() {
    if (typeof gtag === 'function') {
        gtag('config', 'G-Z4CPETEVFE');
    }
}
