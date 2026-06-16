document.addEventListener('DOMContentLoaded', () => {
  const btnMembers = document.querySelector('.btn-members');
  if (btnMembers) {
    btnMembers.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = btnMembers.getAttribute('href');
    });
  }
});
