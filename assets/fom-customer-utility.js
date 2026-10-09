document.querySelectorAll('.fom-address-form select[data-default]').forEach((select) => {
  if (select.dataset.default) select.value = select.dataset.default;
});

document.querySelectorAll('.fom-account__address-actions form input[name="_method"][value="delete"]').forEach((input) => {
  input.form?.addEventListener('submit', (event) => {
    if (!window.confirm('Remove this address?')) event.preventDefault();
  });
});

if (window.location.hash === '#recover') {
  const recover = document.querySelector('#recover');
  if (recover instanceof HTMLDetailsElement) recover.open = true;
}
