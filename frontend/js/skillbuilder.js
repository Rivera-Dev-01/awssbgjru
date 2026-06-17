const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000'
  : '';

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

async function handleSubmit() {
  if (!selectedDivision) {
    showConstraint();
    return;
  }

  const basic = JSON.parse(sessionStorage.getItem('regBasic') || '{}');
  const explanation = sessionStorage.getItem('regExplanation') || '';

  const payload = {
    full_name: basic.fullName || '',
    student_id: basic.studentId || '',
    email: basic.email || '',
    year: basic.year || '',
    program: basic.program || '',
    dob: basic.dob || '',
    photo_base64: basic.photoBase64 || '',
    explanation: explanation,
    division_type: 'skillbuilder',
    division_name: selectedDivision,
  };

  const btnSave = document.getElementById('btnSaveSB');
  btnSave.textContent = 'Submitting...';
  btnSave.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Registration failed:', err);
      btnSave.textContent = 'Submit';
      btnSave.disabled = false;
      return;
    }

    sessionStorage.removeItem('regBasic');
    sessionStorage.removeItem('regExplanation');
    sessionStorage.removeItem('regDept');
    window.location.href = 'loading.html';
  } catch (err) {
    console.error('Network error:', err);
    btnSave.textContent = 'Submit';
    btnSave.disabled = false;
  }
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
