(() => {
  const initProductPage = (root) => {
    if (!root || root.dataset.fomReady === 'true') return;
    root.dataset.fomReady = 'true';

    const mainImage = root.querySelector('.fom-product-gallery__main');
    const thumbnails = [...root.querySelectorAll('[data-fom-thumbnail]')];
    const setImage = (url, alt = '') => {
      if (!mainImage || !url) return;
      mainImage.src = url;
      mainImage.removeAttribute('srcset');
      mainImage.alt = alt;
    };

    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', () => {
        thumbnails.forEach((item) => {
          item.classList.remove('is-active');
          item.setAttribute('aria-pressed', 'false');
        });
        thumbnail.classList.add('is-active');
        thumbnail.setAttribute('aria-pressed', 'true');
        setImage(thumbnail.dataset.imageUrl, thumbnail.dataset.imageAlt);
      });
    });

    const variantInput = root.querySelector('[data-fom-variant-id]');
    const price = root.querySelector('[data-fom-price]');
    const comparePrice = root.querySelector('[data-fom-compare-price]');
    const stock = root.querySelector('[data-fom-stock]');
    const addButton = root.querySelector('[data-fom-add]');
    const productForm = root.querySelector('product-form-component');
    const quantityInput = root.querySelector('[data-fom-quantity-input]');
    const weight = root.querySelector('[data-fom-weight]');
    const unitPrice = root.querySelector('[data-fom-unit-price]');
    const variantButtons = [...root.querySelectorAll('[data-fom-variant]')];
    const lowStockThreshold = Number(root.dataset.lowStockThreshold) || 5;

    const normalizeQuantity = () => {
      if (!quantityInput) return;
      const minimum = Number(quantityInput.min) || 1;
      const maximum = quantityInput.max ? Number(quantityInput.max) : Infinity;
      const increment = Number(quantityInput.step) || 1;
      let value = Number(quantityInput.value) || minimum;
      value = minimum + Math.round((value - minimum) / increment) * increment;
      quantityInput.value = String(Math.min(maximum, Math.max(minimum, value)));
      quantityInput.setCustomValidity('');
    };

    const updateStock = (button, available) => {
      if (!stock) return;
      const limited = button.dataset.inventoryLimited === 'true';
      const inventory = Number(button.dataset.inventoryQuantity);
      const low = available && limited && inventory > 0 && inventory <= lowStockThreshold;
      stock.classList.toggle('is-unavailable', !available);
      stock.classList.toggle('is-low', low);
      const label = stock.querySelector('[data-fom-stock-text]');
      if (label) {
        if (!available) label.textContent = stock.dataset.soldOutText;
        else if (low) label.textContent = stock.dataset.lowStockText;
        else label.textContent = stock.dataset.inStockText;
      }
    };

    variantButtons.forEach((button) => {
      button.addEventListener('click', () => {
        variantButtons.forEach((item) => {
          item.classList.remove('is-selected');
          item.setAttribute('aria-pressed', 'false');
          item.setAttribute('aria-checked', 'false');
          item.tabIndex = -1;
        });
        button.classList.add('is-selected');
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-checked', 'true');
        button.tabIndex = 0;
        if (variantInput) {
          variantInput.value = button.dataset.variantId;
          variantInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (price) price.textContent = button.dataset.price;
        if (comparePrice) {
          comparePrice.textContent = button.dataset.comparePrice || '';
          comparePrice.hidden = !button.dataset.comparePrice;
        }
        const available = button.dataset.available === 'true';
        updateStock(button, available);
        if (addButton) {
          addButton.disabled = !available;
          const label = addButton.querySelector('[data-fom-add-label]');
          if (label) label.textContent = available ? addButton.dataset.addText : addButton.dataset.soldOutText;
        }
        if (quantityInput) {
          quantityInput.min = button.dataset.quantityMin || '1';
          quantityInput.step = button.dataset.quantityIncrement || '1';
          if (button.dataset.quantityMax) quantityInput.max = button.dataset.quantityMax;
          else quantityInput.removeAttribute('max');
          quantityInput.value = quantityInput.min;
          if (productForm) productForm.dataset.quantityDefault = quantityInput.min;
          normalizeQuantity();
        }
        if (weight) {
          const weightValue = weight.querySelector('span');
          if (weightValue) weightValue.textContent = button.dataset.weight || '';
          weight.hidden = !button.dataset.weight;
        }
        if (unitPrice) {
          unitPrice.textContent = button.dataset.unitPrice || '';
          unitPrice.hidden = !button.dataset.unitPrice;
        }
        if (button.dataset.imageUrl) setImage(button.dataset.imageUrl, button.dataset.imageAlt || '');
        const url = new URL(window.location.href);
        url.searchParams.set('variant', button.dataset.variantId);
        window.history.replaceState({}, '', url);
      });
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const currentIndex = variantButtons.indexOf(button);
        let nextIndex = currentIndex;
        if (['ArrowLeft', 'ArrowUp'].includes(event.key)) nextIndex = (currentIndex - 1 + variantButtons.length) % variantButtons.length;
        if (['ArrowRight', 'ArrowDown'].includes(event.key)) nextIndex = (currentIndex + 1) % variantButtons.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = variantButtons.length - 1;
        variantButtons[nextIndex].focus();
        variantButtons[nextIndex].click();
      });
    });

    root.querySelectorAll('[data-fom-quantity-change]').forEach((button) => {
      button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('input');
        if (!input) return;
        const step = Number(input.step) || 1;
        const minimum = Number(input.min) || 1;
        const maximum = input.max ? Number(input.max) : Infinity;
        const next = Number(input.value || minimum) + Number(button.dataset.fomQuantityChange) * step;
        input.value = Math.min(maximum, Math.max(minimum, next));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
    quantityInput?.addEventListener('change', normalizeQuantity);
    quantityInput?.addEventListener('blur', normalizeQuantity);

    const tabs = [...root.querySelectorAll('[role="tab"]')];
    tabs.forEach((tab, index) => {
      const activate = () => {
        tabs.forEach((item) => {
          const selected = item === tab;
          item.setAttribute('aria-selected', String(selected));
          item.tabIndex = selected ? 0 : -1;
          const panel = document.getElementById(item.getAttribute('aria-controls'));
          if (panel) panel.hidden = !selected;
        });
      };
      tab.addEventListener('click', activate);
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        tabs[next].focus();
        tabs[next].click();
      });
    });

    const lightbox = root.querySelector('[data-fom-lightbox]');
    const zoom = root.querySelector('[data-fom-zoom]');
    const close = root.querySelector('[data-fom-lightbox-close]');
    if (lightbox && zoom && mainImage) {
      zoom.addEventListener('click', () => {
        const image = lightbox.querySelector('img');
        image.src = mainImage.currentSrc || mainImage.src;
        image.alt = mainImage.alt;
        lightbox.showModal();
      });
      close?.addEventListener('click', () => lightbox.close());
      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) lightbox.close();
      });
    }
  };

  const initialize = () => document.querySelectorAll('[data-fom-product-root]').forEach(initProductPage);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
  document.addEventListener('shopify:section:load', initialize);
})();
