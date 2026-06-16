document.addEventListener('DOMContentLoaded', () => {
  initPills();
  initSubmit();
  initBackNavigation();
});

let selectedDivision = null;

function initPills() {
  const pills = document.querySelectorAll('.sb-pill');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedDivision = pill.dataset.division;
      clearConstraint();
    });
  });
}

function initSubmit() {
  const btnSave = document.getElementById('btnSaveSB');

  btnSave.addEventListener('click', (e) => {
    e.preventDefault();
    handleSubmit();
  });
}

function showConstraint() {
  const errorEl = document.querySelector('.sb-error');
  const btnSave = document.getElementById('btnSaveSB');
  errorEl.classList.add('visible');
  btnSave.classList.add('constraint-btn');
}

function clearConstraint() {
  const errorEl = document.querySelector('.sb-error');
  const btnSave = document.getElementById('btnSaveSB');
  errorEl.classList.remove('visible');
  btnSave.classList.remove('constraint-btn');
}

function handleSubmit() {
  if (!selectedDivision) {
    showConstraint();
    return;
  }

  const data = {
    department: 'skillbuilder',
    division: selectedDivision,
  };

  console.log('Skill Builder division data ready for backend:', data);

  window.location.href = 'loading.html';
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
