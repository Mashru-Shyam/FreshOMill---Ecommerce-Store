(() => {
  const initialize = (scope = document) => {
    scope.querySelectorAll('[data-fom-recommendations]').forEach((root) => {
      if (root.dataset.ready === 'true' || !root.dataset.url) return;
      root.dataset.ready = 'true';
      const load = async () => {
        try {
          const response = await fetch(root.dataset.url);
          if (!response.ok) return;
          const html = document.createElement('div');
          html.innerHTML = await response.text();
          const replacement = html.querySelector('[data-fom-recommendations]');
          if (replacement?.querySelector('[data-fom-live-recommendations]')) root.innerHTML = replacement.innerHTML;
        } catch (error) {
          root.dataset.ready = 'false';
        }
      };
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          load();
        }, { rootMargin: '240px' });
        observer.observe(root);
      } else load();
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initialize());
  else initialize();
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
})();
