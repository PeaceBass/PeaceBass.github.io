// ============================================================
// contact.js — Contact form validation
// Demonstrates: event handling, form validation, regular
// expressions, and dynamic status messaging.
// ============================================================

(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');

  const fields = {
    name: {
      input: document.getElementById('name'),
      wrapper: document.getElementById('field-name'),
      validate: function (value) { return value.trim().length > 0; }
    },
    email: {
      input: document.getElementById('email'),
      wrapper: document.getElementById('field-email'),
      validate: function (value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value.trim().length > 0 && emailPattern.test(value.trim());
      }
    },
    phone: {
      input: document.getElementById('phone'),
      wrapper: document.getElementById('field-phone'),
      validate: function (value) {
        const digitsOnly = /^[0-9]+$/;
        return value.trim().length > 0 && digitsOnly.test(value.trim());
      }
    },
    message: {
      input: document.getElementById('message'),
      wrapper: document.getElementById('field-message'),
      validate: function (value) { return value.trim().length > 0; }
    }
  };

  function validateField(key) {
    const field = fields[key];
    const isValid = field.validate(field.input.value);
    field.wrapper.classList.toggle('invalid', !isValid);
    return isValid;
  }

  // Validate on the fly as the user types/leaves a field
  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener('blur', function () { validateField(key); });
    fields[key].input.addEventListener('input', function () {
      if (fields[key].wrapper.classList.contains('invalid')) {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let allValid = true;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(key)) allValid = false;
    });

    status.classList.remove('show', 'success', 'fail');

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.classList.add('show', 'fail');
      return;
    }

    // Simulated submission (no backend attached to this static site)
    status.textContent = 'Thanks, ' + fields.name.input.value.trim().split(' ')[0] + '! Your message has been recorded. I\'ll reply within 2 business days.';
    status.classList.add('show', 'success');
    form.reset();
    Object.keys(fields).forEach(function (key) {
      fields[key].wrapper.classList.remove('invalid');
    });
  });
})();
