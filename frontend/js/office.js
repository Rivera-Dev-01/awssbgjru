document.addEventListener('DOMContentLoaded', () => {
  initPills();
  initSubmit();
  initBackNavigation();
});

let selectedDivision = null;

function initPills() {
  const pills = document.querySelectorAll('.office-pill');

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
  const btnSave = document.getElementById('btnSaveOffice');

  btnSave.addEventListener('click', (e) => {
    e.preventDefault();
    handleSubmit();
  });
}

function showConstraint() {
  const errorEl = document.querySelector('.office-error');
  const btnSave = document.getElementById('btnSaveOffice');
  errorEl.classList.add('visible');
  btnSave.classList.add('constraint-btn');
}

function clearConstraint() {
  const errorEl = document.querySelector('.office-error');
  const btnSave = document.getElementById('btnSaveOffice');
  errorEl.classList.remove('visible');
  btnSave.classList.remove('constraint-btn');
}

function handleSubmit() {
  if (!selectedDivision) {
    showConstraint();
    return;
  }

  const data = {
    department: 'offices',
    division: selectedDivision,
  };

  console.log('Office division data ready for backend:', data);

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
