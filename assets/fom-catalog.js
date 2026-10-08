(() => {
  const initialize = (scope = document) => {
    scope.querySelectorAll('[data-fom-catalog-root]').forEach((root) => {
      if (root.dataset.ready === 'true') return;
      root.dataset.ready = 'true';

      const sidebar = root.querySelector('[data-fom-sidebar]');
      root.querySelector('[data-fom-filter-toggle]')?.addEventListener('click', (event) => {
        const open = sidebar?.classList.toggle('is-open');
        event.currentTarget.setAttribute('aria-expanded', String(Boolean(open)));
        if (open) sidebar?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      root.querySelectorAll('[data-fom-sort]').forEach((select) => {
        select.addEventListener('change', () => {
          const url = new URL(window.location.href);
          if (select.value) url.searchParams.set('sort_by', select.value);
          else url.searchParams.delete('sort_by');
          url.searchParams.delete('page');
          window.location.assign(url.toString());
        });
      });

      root.querySelectorAll('[data-fom-filter-form] input[type="checkbox"]').forEach((input) => {
        input.addEventListener('change', () => input.form?.requestSubmit());
      });
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initialize());
  else initialize();
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
})();
