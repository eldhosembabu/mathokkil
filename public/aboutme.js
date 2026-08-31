document.addEventListener('DOMContentLoaded', () => {
  const cvContent = document.getElementById('cv-content');
  const themeToggle = document.getElementById('theme-toggle');
  const themeText = themeToggle ? themeToggle.querySelector('.theme-text') : null;
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  const html = document.documentElement;

  // AI Modal DOM References
  const selectionAiBtn = document.getElementById('selection-ai-btn');
  const aiModal = document.getElementById('ai-modal');
  const closeAiModal = document.getElementById('close-ai-modal');
  const aiSelectedText = document.getElementById('ai-selected-text');
  const aiInstruction = document.getElementById('ai-instruction');
  const aiCopyPromptBtn = document.getElementById('ai-copy-prompt-btn');

  let savedRange = null;

  // --- 1. Fetch and Render Markdown ---
  fetch('CV.md?t=' + Date.now())
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load CV.md. Make sure it exists in the root directory.');
      }
      return response.text();
    })
    .then(markdownText => {
      marked.setOptions({
        gfm: true,
        breaks: true
      });
      const htmlContent = marked.parse(markdownText);
      cvContent.innerHTML = htmlContent;

      // Restore scroll position after content renders
      const savedScrollY = sessionStorage.getItem('cv-scroll-position');
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY, 10));
      }
    })
    .catch(error => {
      console.error(error);
      cvContent.innerHTML = `
        <div class="error-box">
          <h3>Error Loading Resume</h3>
          <p>${error.message}</p>
        </div>
      `;
    });

  // Save scroll position on scroll
  window.addEventListener('scroll', () => {
    if (aiModal && !aiModal.open) {
      sessionStorage.setItem('cv-scroll-position', window.scrollY);
    }
  });

  // --- 2. Theme Toggler ---
  function getTheme() {
    return html.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    metaColorScheme.content = theme === 'dark' ? 'dark' : 'light';
    localStorage.setItem('color-scheme', theme);
    if (themeText) {
      themeText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
  }

  const initialTheme = getTheme();
  if (themeText) {
    themeText.textContent = initialTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = getTheme();
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem('color-scheme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });


  // --- 4. Selection AI Assistant logic ---
  function handleTextSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    // Check if selection is within CV content and has actual characters
    if (selectedText.length > 0 && cvContent.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      savedRange = range.cloneRange(); // Cache selection coordinate path

      const rect = range.getBoundingClientRect();

      // Calculate coordinates (position button floating above center of selection)
      const buttonHeight = 32;
      const buttonWidth = 90;
      const top = rect.top + window.scrollY - buttonHeight - 8;
      const left = rect.left + window.scrollX + (rect.width / 2) - (buttonWidth / 2);

      selectionAiBtn.style.top = `${top}px`;
      selectionAiBtn.style.left = `${left}px`;
      selectionAiBtn.classList.remove('hidden');
    } else {
      selectionAiBtn.classList.add('hidden');
    }
  }

  // Monitor mouse and keyboard triggers for selections
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);

  // Prevent selection from collapsing when clicking the floating button
  selectionAiBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
  });

  // Open modal when button is clicked
  selectionAiBtn.addEventListener('click', () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    aiSelectedText.textContent = selectedText;

    // Reset instruction field
    aiInstruction.value = '';

    aiModal.showModal();
    aiInstruction.focus(); // Auto-focus the input textarea
    selectionAiBtn.classList.add('hidden');
  });

  // Helper to aggressively clear text selection across all browser engines
  function clearSelection() {
    try {
      if (window.getSelection) {
        const sel = window.getSelection();
        if (sel.empty) {
          sel.empty();
        }
        if (sel.removeAllRanges) {
          sel.removeAllRanges();
        }
      } else if (document.selection) {
        document.selection.empty();
      }
    } catch (e) {
      console.warn('Failed to clear selection:', e);
    }
    selectionAiBtn.classList.add('hidden');
  }

  closeAiModal.addEventListener('click', () => {
    aiModal.close();
  });

  // Clear text selection and hide button when modal is dismissed
  aiModal.addEventListener('close', () => {
    clearSelection();
    if (document.activeElement) {
      document.activeElement.blur();
    }
  });

  // Construct and Copy AI Prompt to Clipboard
  aiCopyPromptBtn.addEventListener('click', () => {
    const selectedText = aiSelectedText.textContent.trim();
    const instruction = aiInstruction.value.trim();

    if (!instruction) {
      alert('Please specify instructions for the modification.');
      return;
    }

    // Construct the formatted instructions for Antigravity Chat
    const promptText = `Please edit the following text from my CV according to these instructions:
"${instruction}"

Selected Text:
"${selectedText}"

Please respond with ONLY the revised text ready to be copy-pasted.`;

    navigator.clipboard.writeText(promptText)
      .then(() => {
        const originalLabel = aiCopyPromptBtn.textContent;
        aiCopyPromptBtn.textContent = 'Copied! Paste it in the Chat ✓';

        // Add a visual success feedback style
        aiCopyPromptBtn.style.background = '#166534';
        aiCopyPromptBtn.style.borderColor = '#166534';

        setTimeout(() => {
          aiCopyPromptBtn.textContent = originalLabel;
          aiCopyPromptBtn.style.background = '';
          aiCopyPromptBtn.style.borderColor = '';
          aiModal.close(); // Close modal
        }, 1500);
      })
      .catch(err => {
        console.error('Clipboard copy failed:', err);
        alert('Failed to copy to clipboard. Please copy the text manually.');
      });
  });

  // Hide floating button instantly on click outside
  document.addEventListener('mousedown', (e) => {
    if (!selectionAiBtn.contains(e.target) && !aiModal.contains(e.target)) {
      selectionAiBtn.classList.add('hidden');
    }
  });

  // Hide floating button when selection is cleared/collapsed (e.g. keyboard)
  document.addEventListener('selectionchange', () => {
    const activeSel = window.getSelection().toString().trim();
    if (activeSel.length === 0) {
      selectionAiBtn.classList.add('hidden');
    }
  });
});
