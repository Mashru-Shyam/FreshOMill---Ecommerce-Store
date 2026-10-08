import { StandardEvents } from '@shopify/events';

class FomCartSummary extends HTMLElement {
  connectedCallback() {
    this.controller = new AbortController();
    this.onUpdate = (event) => {
      if (event.promise) event.promise.then(() => this.schedule()).catch(() => {});
      else this.schedule();
    };
    document.addEventListener(StandardEvents.cartLinesUpdate, this.onUpdate, { signal: this.controller.signal });
    document.addEventListener('cart:update', this.onUpdate, { signal: this.controller.signal });
    window.addEventListener('pageshow', () => this.schedule(), { signal: this.controller.signal });
  }

  disconnectedCallback() {
    this.controller?.abort();
    clearTimeout(this.timer);
    this.request?.abort();
  }

  schedule() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.refresh(), 120);
  }

  async refresh() {
    this.request?.abort();
    const request = new AbortController();
    this.request = request;
    try {
      const response = await fetch(this.dataset.cartUrl, { signal: request.signal, credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) return;
      const cart = await response.json();
      if (!this.isConnected || request.signal.aborted) return;
      const currency = cart.currency || this.dataset.currency;
      const money = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : this.dataset.locale, { style: 'currency', currency }).format(cart.total_price / 100);
      this.querySelector('[data-fom-total]').textContent = money;
      this.querySelector('[data-fom-count]').textContent = String(cart.item_count);
    } catch {}
  }
}

if (!customElements.get('fom-cart-summary')) customElements.define('fom-cart-summary', FomCartSummary);
