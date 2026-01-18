/**
 * Home Page Script
 * Handles lightweight enhancements and accessibility behaviors
 */

/**
 * Initialize home page behaviors
 */
function initHome() {
  const cards = document.querySelectorAll('.game-card');
  cards.forEach(card => {
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', card.querySelector('.game-title')?.textContent || 'Game');
  });
}

document.addEventListener('DOMContentLoaded', initHome);

