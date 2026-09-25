/**
 * Tech Highlights Page Interactive Logic
 * Handles theme toggling, instant search filtering, and category selection.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------------------------------------
  // Theme Toggle Fallback Handler
  // -----------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn') || document.querySelector('.theme-toggle-btn');
  if (themeToggleBtn && !themeToggleBtn.dataset.themeBound) {
    themeToggleBtn.dataset.themeBound = 'true';
    themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('color-scheme', nextTheme);
      
      const icon = themeToggleBtn.querySelector('i, svg');
      const text = themeToggleBtn.querySelector('.theme-text, #theme-label');
      if (nextTheme === 'light') {
        if (icon) icon.className = 'fas fa-moon';
        if (text) text.textContent = 'Dark';
      } else {
        if (icon) icon.className = 'fas fa-sun';
        if (text) text.textContent = 'Light';
      }
    });
  }

  // -----------------------------------------------------------
  // Filter & Search Functionality
  // -----------------------------------------------------------
  const searchInput = document.getElementById('highlight-search');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchWrapper = document.querySelector('.search-wrapper');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const highlightCards = document.querySelectorAll('.highlight-card');
  const highlightSections = document.querySelectorAll('.highlights-section');
  const emptyState = document.getElementById('empty-state');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;
    const categoryVisibility = {};

    highlightCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardText = (
        (card.querySelector('.card-title')?.textContent || '') + ' ' +
        (card.querySelector('.card-subtitle')?.textContent || '') + ' ' +
        (card.querySelector('.card-description')?.textContent || '') + ' ' +
        (card.getAttribute('data-tags') || '')
      ).toLowerCase();

      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchesSearch = !searchQuery || cardText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
        categoryVisibility[cardCategory] = (categoryVisibility[cardCategory] || 0) + 1;
      } else {
        card.style.display = 'none';
      }
    });

    // Toggle Section headers based on whether any card in that category is visible
    highlightSections.forEach(section => {
      const sectionCategory = section.getAttribute('data-category');
      if (categoryVisibility[sectionCategory] && categoryVisibility[sectionCategory] > 0) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });

    // Toggle empty state
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('visible');
      } else {
        emptyState.classList.remove('visible');
      }
    }
  }

  // Category filter button click handler
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (searchWrapper) {
        if (searchQuery.length > 0) {
          searchWrapper.classList.add('has-value');
        } else {
          searchWrapper.classList.remove('has-value');
        }
      }
      applyFilters();
    });

    // Keyboard shortcut: Press "/" to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchQuery = '';
        if (searchWrapper) searchWrapper.classList.remove('has-value');
        searchInput.blur();
        applyFilters();
      }
    });
  }

  // Clear search button
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        if (searchWrapper) searchWrapper.classList.remove('has-value');
        searchInput.focus();
        applyFilters();
      }
    });
  }

  // Reset filters button in empty state
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      currentCategory = 'all';
      searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
      }
      if (searchWrapper) {
        searchWrapper.classList.remove('has-value');
      }
      filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'all') {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      applyFilters();
    });
  }

  // Run initial filter check
  applyFilters();
});
