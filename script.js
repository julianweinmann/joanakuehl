document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    const loadComponent = (url, placeholder) => {
        if (placeholder) {
            fetch(url)
                .then(response => response.ok ? response.text() : Promise.reject(`Could not load ${url}`))
                .then(data => {
                    placeholder.innerHTML = data;
                    if (placeholder.id === 'header-placeholder') {
                        initializeHeaderScripts();
                    }
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
                // This function adds the white background on scroll for the homepage
                if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                    if (window.scrollY > 50) {
                        nav.classList.add('nav-scrolled');
                    } else {
                        nav.classList.remove('nav-scrolled');
                    }
                }
            };
            
            // For all subpages, the header should be white from the start
            if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                nav.classList.add('nav-scrolled');
            }

            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Run on load
        }
    };

    loadComponent('/header.html', headerPlaceholder);
    loadComponent('/footer.html', footerPlaceholder);
});
