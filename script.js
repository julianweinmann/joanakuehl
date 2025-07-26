document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Function to fetch and insert HTML components
    const loadComponent = (url, placeholder) => {
        if (placeholder) {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Could not load ${url}: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(data => {
                    placeholder.innerHTML = data;
                    
                    // After loading the header, initialize its interactive elements
                    if (placeholder.id === 'header-placeholder') {
                        initializeHeaderScripts();
                    }
                })
                .catch(error => console.error('Error loading component:', error));
        }
    };

    // Function to handle scripts within the loaded header
    const initializeHeaderScripts = () => {
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        // Mobile menu toggle
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    };

    // Load header and footer into their placeholders
    loadComponent('/header.html', headerPlaceholder);
    loadComponent('/footer.html', footerPlaceholder);
});
