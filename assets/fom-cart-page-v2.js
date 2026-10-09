class FomCartPage extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('[data-cart-form]');
    this.querySelectorAll('[data-cart-quantity-change]').forEach((button) => {
      button.addEventListener('click', () => this.changeFromButton(button));
    });
    this.querySelectorAll('[data-cart-quantity-input]').forEach((input) => {
      input.addEventListener('change', () => this.changeLine(input.dataset.line, input.value));
    });
    this.querySelector('[data-clear-cart]')?.addEventListener('click', () => this.clearCart());
  }

  changeFromButton(button) {
    const line = button.dataset.line;
    const input = this.querySelector(`[data-cart-quantity-input][data-line="${line}"]`);
    if (!input) return;
    const nextQuantity = Math.max(0, (Number(input.value) || 0) + Number(button.dataset.cartQuantityChange));
    input.value = nextQuantity;
    this.changeLine(line, nextQuantity);
  }

  async changeLine(line, quantity) {
    this.setLoading(true);
    try {
      const root = window.Shopify?.routes?.root || '/';
      const response = await fetch(`${root}cart/change.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line: Number(line), quantity: Math.max(0, Number(quantity) || 0) })
      });
      if (!response.ok) throw new Error('Cart update failed');
      window.location.reload();
    } catch (error) {
      this.setLoading(false);
      this.form?.requestSubmit();
    }
  }

  async clearCart() {
    this.setLoading(true);
    try {
      const root = window.Shopify?.routes?.root || '/';
      const response = await fetch(`${root}cart/clear.js`, {
        method: 'POST',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Clear cart failed');
      window.location.reload();
    } catch (error) {
      this.setLoading(false);
      window.location.href = '/cart/clear';
    }
  }

  setLoading(isLoading) {
    this.classList.toggle('is-loading', isLoading);
    this.querySelectorAll('button, input').forEach((control) => {
      control.disabled = isLoading;
    });
  }
}

if (!customElements.get('fom-cart-page')) {
  customElements.define('fom-cart-page', FomCartPage);
}
