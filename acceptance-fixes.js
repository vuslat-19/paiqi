(() => {
  const form = document.querySelector('#form');
  const saveButton = document.querySelector('#save');
  if (!form || !saveButton) return;

  form.addEventListener('submit', event => {
    if (form.dataset.allowSubmit === 'true') {
      delete form.dataset.allowSubmit;
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    if (form.dataset.submitting === 'true') return;

    form.dataset.submitting = 'true';
    saveButton.disabled = true;
    saveButton.setAttribute('aria-busy', 'true');
    saveButton.textContent = '保存中';

    window.setTimeout(() => {
      form.dataset.allowSubmit = 'true';
      delete form.dataset.submitting;
      saveButton.disabled = false;
      saveButton.removeAttribute('aria-busy');
      saveButton.textContent = '保存';
      form.requestSubmit(saveButton);
    }, 300);
  }, true);
})();
