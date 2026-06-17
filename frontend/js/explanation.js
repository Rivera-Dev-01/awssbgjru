document.addEventListener('DOMContentLoaded', () => {
  initFormValidation();
  initBackNavigation();
});

function initFormValidation() {
  const textarea = document.getElementById('explanationText');
  const btnSave = document.getElementById('btnSave');

  btnSave.addEventListener('click', (e) => {
    e.preventDefault();
    validateForm();
  });

  textarea.addEventListener('input', () => {
    clearFieldError();
  });
}

function validateForm() {
  const textarea = document.getElementById('explanationText');
  const btnSave = document.getElementById('btnSave');

  if (!textarea.value.trim()) {
    showFieldError();
    btnSave.classList.add('constraint-btn');
  } else {
    btnSave.classList.remove('constraint-btn');
    onValidSubmit();
  }
}

function showFieldError() {
  const textarea = document.getElementById('explanationText');
  const group = textarea.closest('.form-group');
  if (!group) return;
  const errorEl = group.querySelector('.form-error');
  if (errorEl) errorEl.classList.add('visible');
}

function clearFieldError() {
  const textarea = document.getElementById('explanationText');
  const group = textarea.closest('.form-group');
  if (!group) return;
  const errorEl = group.querySelector('.form-error');
  if (errorEl) errorEl.classList.remove('visible');

  const btnSave = document.getElementById('btnSave');
  const hasErrors = document.querySelectorAll('.form-error.visible').length;
  if (hasErrors === 0) {
    btnSave.classList.remove('constraint-btn');
  }
}

function onValidSubmit() {
  const textarea = document.getElementById('explanationText');
  const btnSave = document.getElementById('btnSave');

  sessionStorage.setItem('regExplanation', textarea.value.trim());

  btnSave.textContent = 'Submitting...';
  btnSave.disabled = true;

  setTimeout(() => {
    btnSave.textContent = 'Save & Continue';
    btnSave.disabled = false;
    window.location.href = '/department';
  }, 1000);
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


