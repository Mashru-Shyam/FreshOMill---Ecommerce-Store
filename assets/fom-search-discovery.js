class FomSearchDiscovery {
  constructor(form) {
    this.form = form;
    this.input = form.querySelector('input[type="search"], input[name="q"]');
    if (!this.input || form.closest('predictive-search')) return;
    this.controller = null;
    this.timer = null;
    this.results = document.createElement('div');
    this.results.className = 'fom-live-search';
    this.results.setAttribute('role', 'listbox');
    this.results.hidden = true;
    this.form.classList.add('fom-search-enabled');
    this.form.append(this.results);
    this.input.setAttribute('autocomplete', 'off');
    this.input.addEventListener('input', () => this.queue());
    this.input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.hide();
    });
    document.addEventListener('click', (event) => {
      if (!this.form.contains(event.target)) this.hide();
    });
  }

  queue() {
    window.clearTimeout(this.timer);
    const query = this.input.value.trim();
    if (query.length < 2) {
      this.hide();
      return;
    }
    this.timer = window.setTimeout(() => this.search(query), 220);
  }

  async search(query) {
    this.controller?.abort();
    this.controller = new AbortController();
    try {
      const root = window.Shopify?.routes?.root || '/';
      const url = `${root}search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6&resources[options][unavailable_products]=last`;
      const response = await fetch(url, { signal: this.controller.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Predictive search failed');
      const data = await response.json();
      this.render(data.resources?.results?.products || [], query);
    } catch (error) {
      if (error.name !== 'AbortError') this.hide();
    }
  }

  render(products, query) {
    this.results.replaceChildren();
    if (!products.length) {
      const empty = document.createElement('p');
      empty.className = 'fom-live-search__empty';
      empty.textContent = 'No matching products found';
      this.results.append(empty);
    } else {
      products.forEach((product) => this.results.append(this.productLink(product)));
    }
    const allResults = document.createElement('a');
    allResults.className = 'fom-live-search__all';
    allResults.href = `/search?q=${encodeURIComponent(query)}&type=product&options%5Bprefix%5D=last`;
    allResults.textContent = `View all results for “${query}”`;
    this.results.append(allResults);
    this.results.hidden = false;
  }

  productLink(product) {
    const link = document.createElement('a');
    link.className = 'fom-live-search__item';
    link.href = product.url;
    link.setAttribute('role', 'option');
    const imageUrl = product.featured_image?.url || product.image;
    if (imageUrl) {
      const image = document.createElement('img');
      image.src = imageUrl;
      image.alt = '';
      image.loading = 'lazy';
      link.append(image);
    }
    const copy = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = product.title;
    const price = document.createElement('small');
    price.textContent = this.money(product.price);
    copy.append(title, price);
    link.append(copy);
    return link;
  }

  money(cents) {
    const currency = window.Shopify?.currency?.active || 'INR';
    if (typeof cents === 'string' && /[^0-9.,]/.test(cents)) return cents;
    const numericPrice = Number(String(cents).replace(',', ''));
    if (!Number.isFinite(numericPrice)) return '';
    const amount = typeof cents === 'string' && cents.includes('.') ? numericPrice : numericPrice / 100;
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
    } catch (error) {
      return `₹${amount.toFixed(2)}`;
    }
  }

  hide() {
    this.results.hidden = true;
  }
}

document.querySelectorAll('#header-component form[action*="search"]').forEach((form) => {
  if (!form.dataset.fomSearchReady) {
    form.dataset.fomSearchReady = 'true';
    new FomSearchDiscovery(form);
  }
});
