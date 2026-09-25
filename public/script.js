/**
 * Mathokkil Global Scripts
 * Unified theme management, smooth scrolling, and scroll animations across the site.
 */

// Global Theme Management
(function () {
    function initTheme() {
        const savedTheme = localStorage.getItem('color-scheme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        applyTheme(currentTheme);
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
        if (metaColorScheme) {
            metaColorScheme.content = theme;
        }

        // Update any theme toggler buttons on the page
        const toggleButtons = document.querySelectorAll('.theme-toggle-btn, #theme-toggle, #theme-toggle-btn');
        toggleButtons.forEach(btn => {
            const icon = btn.querySelector('i, svg');
            const text = btn.querySelector('.theme-text, #theme-label');
            if (theme === 'light') {
                if (icon && icon.classList) {
                    icon.className = 'fas fa-moon';
                }
                if (text) {
                    text.textContent = 'Dark';
                }
            } else {
                if (icon && icon.classList) {
                    icon.className = 'fas fa-sun';
                }
                if (text) {
                    text.textContent = 'Light';
                }
            }
        });
    }

    // Run immediately to prevent FOUC
    initTheme();

    function setupThemeToggle() {
        const toggleButtons = document.querySelectorAll('.theme-toggle-btn, #theme-toggle, #theme-toggle-btn');
        toggleButtons.forEach(btn => {
            if (btn.dataset.themeBound) return;
            btn.dataset.themeBound = 'true';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                const nextTheme = current === 'dark' ? 'light' : 'dark';
                localStorage.setItem('color-scheme', nextTheme);
                applyTheme(nextTheme);
            });
        });

        // Listen for OS theme preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('color-scheme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-on-scroll');
        fadeElements.forEach(el => observer.observe(el));

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    if (document.readyState !== 'loading') {
        setupThemeToggle();
    } else {
        document.addEventListener('DOMContentLoaded', setupThemeToggle);
    }
})();
