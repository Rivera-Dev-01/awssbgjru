document.addEventListener('DOMContentLoaded', () => {
  initCards();
  initBackNavigation();
});

function initCards() {
  const cards = document.querySelectorAll('.dept-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const dept = card.dataset.dept;
      sessionStorage.setItem('regDept', dept === 'offices' ? 'office' : 'skillbuilder');

      if (dept === 'offices') {
        window.location.href = 'office.html';
      } else {
        window.location.href = 'skillbuilder.html';
      }
    });
  });
}

function initBackNavigation() {
  const backBtn = document.querySelector('.register-back');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = backBtn.getAttribute('href');
    });
  }
}
