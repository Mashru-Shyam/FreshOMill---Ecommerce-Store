class FomProductPage extends HTMLElement {
  connectedCallback() {
    this.mainImage = this.querySelector('[data-main-image]');
    this.variantInput = this.querySelector('[data-variant-input]');
    this.price = this.querySelector('[data-product-price]');
    this.comparePrice = this.querySelector('[data-compare-price]');
    this.addButton = this.querySelector('[data-add-button]');
    this.quantityInput = this.querySelector('[data-quantity-input]');
    this.bindGallery();
    this.bindVariants();
    this.bindQuantity();
    this.bindTabs();
  }

  bindGallery() {
    this.querySelectorAll('[data-gallery-thumb]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!this.mainImage) return;
        this.mainImage.src = button.dataset.imageSrc;
        this.mainImage.srcset = button.dataset.imageSrcset || '';
        this.mainImage.alt = button.dataset.imageAlt || '';
        this.querySelectorAll('[data-gallery-thumb]').forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
      });
    });
  }

  bindVariants() {
    this.querySelectorAll('[data-variant-button]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.disabled) return;
        this.querySelectorAll('[data-variant-button]').forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        if (this.variantInput) this.variantInput.value = button.dataset.variantId;
        if (this.price) this.price.textContent = button.dataset.price;
        if (this.comparePrice) {
          this.comparePrice.textContent = button.dataset.comparePrice || '';
          this.comparePrice.hidden = !button.dataset.comparePrice;
        }
        if (this.addButton) {
          this.addButton.disabled = button.dataset.available !== 'true';
          this.addButton.querySelector('span').textContent = button.dataset.available === 'true' ? 'Add to cart' : 'Out of stock';
        }
      });
    });
  }

  bindQuantity() {
    this.querySelectorAll('[data-quantity-change]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!this.quantityInput) return;
        const direction = Number(button.dataset.quantityChange);
        const current = Number(this.quantityInput.value) || 1;
        this.quantityInput.value = Math.max(1, current + direction);
      });
    });
  }

  bindTabs() {
    this.querySelectorAll('[data-product-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.productTab;
        this.querySelectorAll('[data-product-tab]').forEach((item) => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        this.querySelectorAll('[data-product-panel]').forEach((panel) => {
          panel.classList.toggle('is-active', panel.dataset.productPanel === target);
        });
      });
    });
  }
}

if (!customElements.get('fom-product-page')) {
  customElements.define('fom-product-page', FomProductPage);
}
