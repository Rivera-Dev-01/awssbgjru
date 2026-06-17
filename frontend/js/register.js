document.addEventListener('DOMContentLoaded', () => {
  populateDateDropdowns();
  initDropdowns();
  initPhotoUpload();
  initFormValidation();
  initBackNavigation();
});

function initDropdowns() {
  const selects = document.querySelectorAll('.custom-select');

  selects.forEach(container => {
    const trigger = container.querySelector('.select-trigger');
    const dropdown = container.querySelector('.select-dropdown');
    const placeholder = container.querySelector('.select-placeholder');
    const items = dropdown.querySelectorAll('li');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns(container);
      dropdown.classList.toggle('open');
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        const value = item.dataset.value;
        const text = item.textContent.trim();
        placeholder.textContent = text;
        placeholder.classList.add('selected');
        container.dataset.value = value;
        dropdown.classList.remove('open');
        clearFieldError(container.closest('.form-group'));
      });
    });
  });

  document.addEventListener('click', closeAllDropdowns);
}

function closeAllDropdowns(except) {
  document.querySelectorAll('.select-dropdown.open').forEach(d => {
    const parent = d.closest('.custom-select');
    if (except && parent === except) return;
    d.classList.remove('open');
  });
}

function populateDateDropdowns() {
  const dayDropdown = document.getElementById('dayDropdown');
  for (let i = 1; i <= 31; i++) {
    const li = document.createElement('li');
    li.dataset.value = String(i).padStart(2, '0');
    li.textContent = String(i).padStart(2, '0');
    dayDropdown.appendChild(li);
  }

  const yearDropdown = document.getElementById('yearDropdown');
  const startYear = 2010;
  const endYear = 1960;
  for (let y = startYear; y >= endYear; y--) {
    const li = document.createElement('li');
    li.dataset.value = String(y);
    li.textContent = String(y);
    yearDropdown.appendChild(li);
  }
}

function initPhotoUpload() {
  const photoInput = document.getElementById('photoInput');
  const photoPreview = document.getElementById('photoPreview');

  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.src = e.target.result;
        photoPreview.classList.add('visible');
      };
      reader.readAsDataURL(file);
    }
  });
}

function initFormValidation() {
  const form = document.getElementById('registerForm');
  const btnSave = document.getElementById('btnSave');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    validateForm();
  });

  const textInputs = form.querySelectorAll('.form-input');
  textInputs.forEach(input => {
    input.addEventListener('input', () => {
      clearFieldError(input.closest('.form-group'));
    });
  });

  const consentCheck = document.getElementById('consentCheck');
  consentCheck.addEventListener('change', () => {
    clearFieldError(consentCheck.closest('.form-group'));
  });
}

function validateForm() {
  const errors = [];

  const fullName = document.getElementById('fullName');
  if (!fullName.value.trim()) {
    showFieldError(fullName.closest('.form-group'));
    errors.push('fullName');
  }

  const studentNum = document.getElementById('studentNumber');
  const studentRegex = /^\d{2}-\d{6}$/;
  if (!studentNum.value.trim() || !studentRegex.test(studentNum.value.trim())) {
    showFieldError(studentNum.closest('.form-group'));
    errors.push('studentNumber');
  }

  const jruEmail = document.getElementById('jruEmail');
  if (!jruEmail.value.trim() || !jruEmail.value.includes('@')) {
    showFieldError(jruEmail.closest('.form-group'));
    errors.push('jruEmail');
  }

  const schoolYearSelect = document.querySelector('[data-select="schoolYear"]');
  if (!schoolYearSelect.dataset.value) {
    showFieldError(schoolYearSelect.closest('.form-group'));
    errors.push('schoolYear');
  }

  const programSelect = document.querySelector('[data-select="program"]');
  if (!programSelect.dataset.value) {
    showFieldError(programSelect.closest('.form-group'));
    errors.push('program');
  }

  const dobDay = document.querySelector('[data-select="dobDay"]');
  if (!dobDay.dataset.value) {
    showFieldError(dobDay.closest('.form-group'));
    errors.push('dobDay');
  }

  const dobMonth = document.querySelector('[data-select="dobMonth"]');
  if (!dobMonth.dataset.value) {
    showFieldError(dobMonth.closest('.form-group'));
    errors.push('dobMonth');
  }

  const dobYear = document.querySelector('[data-select="dobYear"]');
  if (!dobYear.dataset.value) {
    showFieldError(dobYear.closest('.form-group'));
    errors.push('dobYear');
  }

  const consentCheck = document.getElementById('consentCheck');
  if (!consentCheck.checked) {
    showFieldError(consentCheck.closest('.form-group'));
    errors.push('consent');
  }

  const btnSave = document.getElementById('btnSave');
  if (errors.length > 0) {
    btnSave.classList.add('constraint-btn');
  } else {
    btnSave.classList.remove('constraint-btn');
    onValidSubmit();
  }
}

function showFieldError(group) {
  if (!group) return;
  const errorEl = group.querySelector('.form-error');
  if (errorEl) errorEl.classList.add('visible');
}

function clearFieldError(group) {
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
  const photoPreview = document.getElementById('photoPreview');
  const photoBase64 = photoPreview.classList.contains('visible') ? photoPreview.src : '';

  const data = {
    fullName: document.getElementById('fullName').value.trim(),
    studentId: document.getElementById('studentNumber').value.trim(),
    email: document.getElementById('jruEmail').value.trim(),
    year: document.querySelector('[data-select="schoolYear"]').dataset.value,
    program: document.querySelector('[data-select="program"]').dataset.value,
    dob: [
      document.querySelector('[data-select="dobYear"]').dataset.value,
      document.querySelector('[data-select="dobMonth"]').dataset.value,
      document.querySelector('[data-select="dobDay"]').dataset.value,
    ].join('-'),
    photoBase64: photoBase64,
  };

  sessionStorage.setItem('regBasic', JSON.stringify(data));

  const btnSave = document.getElementById('btnSave');
  btnSave.textContent = 'Submitting...';
  btnSave.disabled = true;

  setTimeout(() => {
    btnSave.textContent = 'Save & Continue';
    btnSave.disabled = false;
    window.location.href = 'explanation.html';
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
