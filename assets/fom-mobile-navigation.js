import { StandardEvents } from '@shopify/events';

export function sheetMetrics(height) {
  const expanded = Math.max(100, height - 12);
  const collapsed = Math.min(expanded, Math.max(220, height * 0.64));
  return { collapsed, expanded };
}

export function dragDecision({ delta, offset, velocity, startExpanded, height, collapsed, expanded }) {
  if (offset > 80 || (!startExpanded && delta > 50 && velocity > 0.7)) return 'close';
  if (delta < -40) return 'expand';
  if (delta > 40) return 'collapse';
  return height > (collapsed + expanded) / 2 ? 'expand' : 'collapse';
}

class FomMobileNavigation extends HTMLElement {
  connectedCallback() {
    this.controller = new AbortController();
    this.sheets = new Map();
    this.mobile = window.matchMedia('(max-width: 989px)');
    const options = { signal: this.controller.signal };
    this.addEventListener('click', (event) => this.onNavigation(event), options);
    this.mobile.addEventListener('change', () => this.resizeSheets(), options);
    window.addEventListener('resize', () => this.resizeSheets(), options);
    window.visualViewport?.addEventListener('resize', () => this.resizeSheets(), options);
    window.visualViewport?.addEventListener('scroll', () => this.resizeSheets(), options);
    const refresh = (event) => {
      if (event.promise) event.promise.then(() => this.queueCartRefresh()).catch(() => {});
      else this.queueCartRefresh();
    };
    document.addEventListener(StandardEvents.cartLinesUpdate, refresh, options);
    document.addEventListener('cart:update', refresh, options);
    window.addEventListener('pageshow', (event) => { if (event.persisted) this.queueCartRefresh(); }, options);
    this.structureObserver = new MutationObserver(() => {
      if (this.scanFrame) return;
      this.scanFrame = requestAnimationFrame(() => { this.scanFrame = 0; this.scanSheets(); });
    });
    this.structureObserver.observe(document.body, { childList: true, subtree: true });
    this.scanSheets();
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.structureObserver?.disconnect();
    cancelAnimationFrame(this.scanFrame);
    clearTimeout(this.cartTimer);
    this.cartRequest?.abort();
    for (const state of this.sheets?.values() || []) this.disposeSheet(state);
  }

  scanSheets() {
    for (const [panel, state] of this.sheets) {
      if (!panel.isConnected) { this.disposeSheet(state); this.sheets.delete(panel); }
    }
    for (const id of ['cart-drawer', 'search-modal']) {
      const host = document.getElementById(id);
      const panel = host?.querySelector(':scope > dialog');
      if (!panel || this.sheets.has(panel)) continue;
      const handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'fom-sheet-handle';
      handle.setAttribute('aria-label', this.dataset.resizeLabel);
      handle.setAttribute('aria-expanded', 'false');
      if (!panel.id) panel.id = `fom-${id}-panel`;
      handle.setAttribute('aria-controls', panel.id);
      panel.prepend(handle);
      const state = { host, panel, handle, id, expanded: false, wasOpen: false, controller: new AbortController() };
      this.sheets.set(panel, state);
      const options = { signal: state.controller.signal };
      handle.addEventListener('pointerdown', (event) => this.startDrag(state, event), options);
      handle.addEventListener('pointermove', (event) => this.moveDrag(state, event), options);
      handle.addEventListener('pointerup', (event) => this.endDrag(state, event), options);
      handle.addEventListener('pointercancel', () => this.cancelDrag(state), options);
      handle.addEventListener('click', (event) => {
        if (!this.mobile.matches || !panel.open) return;
        if (state.suppressClick && event.detail > 0) { event.preventDefault(); return; }
        this.setSheetSize(state, !state.expanded);
      }, options);
      handle.addEventListener('keydown', (event) => {
        if (!this.mobile.matches || !panel.open) return;
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          this.setSheetSize(state, event.key === 'ArrowUp');
        }
      }, options);
      state.observer = new MutationObserver(() => this.syncSheet(state));
      state.observer.observe(panel, { attributes: true, attributeFilter: ['open'] });
      this.syncSheet(state);
    }
  }

  disposeSheet(state) {
    state.controller.abort();
    state.observer.disconnect();
    clearTimeout(state.clickTimer);
    state.handle.remove();
    this.clearSheetStyle(state);
  }

  syncSheet(state) {
    const open = state.panel.open;
    const action = state.id === 'search-modal' ? 'search' : 'cart';
    this.querySelector(`[data-fom-action="${action}"]`)?.setAttribute('aria-expanded', String(open));
    if (open && !state.wasOpen && this.mobile.matches) {
      this.setSheetSize(state, false);
      for (const other of this.sheets.values()) {
        if (other !== state && other.panel.open) this.closeSheet(other).catch(() => {});
      }
    }
    if (!open) {
      state.drag = null;
      state.panel.removeAttribute('data-fom-dragging');
      this.clearSheetStyle(state);
    }
    state.wasOpen = open;
  }

  viewport() {
    const visual = window.visualViewport;
    return { height: visual?.height || window.innerHeight, bottom: Math.max(0, window.innerHeight - (visual?.height || window.innerHeight) - (visual?.offsetTop || 0)) };
  }

  setSheetSize(state, expanded) {
    const viewport = this.viewport();
    const sizes = sheetMetrics(viewport.height);
    state.expanded = expanded;
    state.panel.style.setProperty('--fom-sheet-height', `${expanded ? sizes.expanded : sizes.collapsed}px`);
    state.panel.style.setProperty('--fom-sheet-bottom', `${viewport.bottom}px`);
    state.panel.style.setProperty('--fom-sheet-offset', '0px');
    state.handle.setAttribute('aria-expanded', String(expanded));
  }

  clearSheetStyle(state) {
    for (const key of ['--fom-sheet-height', '--fom-sheet-bottom', '--fom-sheet-offset']) state.panel.style.removeProperty(key);
  }

  resizeSheets() {
    for (const state of this.sheets.values()) {
      if (!this.mobile.matches) {
        state.drag = null;
        state.panel.removeAttribute('data-fom-dragging');
        this.clearSheetStyle(state);
      } else if (state.panel.open && !state.drag) this.setSheetSize(state, state.expanded);
    }
  }

  startDrag(state, event) {
    if (!this.mobile.matches || !state.panel.open || event.button !== 0 || !event.isPrimary) return;
    state.drag = { id: event.pointerId, y: event.clientY, time: performance.now(), height: state.panel.getBoundingClientRect().height, expanded: state.expanded };
    state.suppressClick = false;
    state.panel.setAttribute('data-fom-dragging', '');
    state.handle.setPointerCapture(event.pointerId);
  }

  moveDrag(state, event) {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.id) return;
    event.preventDefault();
    const delta = event.clientY - drag.y;
    const sizes = sheetMetrics(this.viewport().height);
    const requested = drag.height - delta;
    const height = Math.max(sizes.collapsed, Math.min(sizes.expanded, requested));
    const offset = Math.max(0, sizes.collapsed - requested);
    state.panel.style.setProperty('--fom-sheet-height', `${height}px`);
    state.panel.style.setProperty('--fom-sheet-offset', `${offset}px`);
    state.suppressClick = Math.abs(delta) > 6;
  }

  endDrag(state, event) {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.id) return;
    const delta = event.clientY - drag.y;
    const sizes = sheetMetrics(this.viewport().height);
    const height = drag.height - delta;
    const decision = dragDecision({ delta, offset: Math.max(0, sizes.collapsed - height), velocity: delta / Math.max(1, performance.now() - drag.time), startExpanded: drag.expanded, height, ...sizes });
    state.drag = null;
    state.panel.removeAttribute('data-fom-dragging');
    state.panel.style.setProperty('--fom-sheet-offset', '0px');
    if (state.handle.hasPointerCapture(event.pointerId)) state.handle.releasePointerCapture(event.pointerId);
    if (Math.abs(delta) > 6) {
      state.suppressClick = true;
      clearTimeout(state.clickTimer);
      state.clickTimer = setTimeout(() => { state.suppressClick = false; }, 350);
    }
    if (decision === 'close') this.closeSheet(state);
    else if (Math.abs(delta) > 6) this.setSheetSize(state, decision === 'expand');
  }

  cancelDrag(state) {
    if (!state.drag) return;
    const expanded = state.drag.expanded;
    state.drag = null;
    state.panel.removeAttribute('data-fom-dragging');
    this.setSheetSize(state, expanded);
  }

  async closeSheet(state) {
    if (state.id === 'cart-drawer') await state.host.close();
    else await state.host.closeDialog();
  }

  async onNavigation(event) {
    const trigger = event.target.closest('[data-fom-action]');
    if (!trigger || !this.contains(trigger)) return;
    const search = trigger.dataset.fomAction === 'search';
    const host = document.getElementById(search ? 'search-modal' : 'cart-drawer');
    if (!host) {
      if (search) window.location.assign(this.dataset.searchUrl);
      return;
    }
    event.preventDefault();
    try {
      await customElements.whenDefined(search ? 'dialog-component' : 'theme-drawer');
      this.scanSheets();
      for (const state of this.sheets.values()) if (state.host !== host && state.panel.open) await this.closeSheet(state);
      trigger.focus({ preventScroll: true });
      if (search) host.showDialog();
      else host.open();
    } catch {
      window.location.assign(search ? this.dataset.searchUrl : trigger.href);
    }
  }

  queueCartRefresh() {
    clearTimeout(this.cartTimer);
    this.cartTimer = setTimeout(() => this.refreshCart(), 120);
  }

  async refreshCart() {
    this.cartRequest?.abort();
    const request = new AbortController();
    this.cartRequest = request;
    try {
      const response = await fetch(this.dataset.cartUrl, { signal: request.signal, credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) return;
      const cart = await response.json();
      if (!this.isConnected || request.signal.aborted) return;
      const badge = this.querySelector('[data-fom-cart-count]');
      if (!badge) return;
      badge.textContent = String(cart.item_count);
      badge.toggleAttribute('data-empty', cart.item_count === 0);
    } catch {}
  }
}

if (!customElements.get('fom-mobile-navigation')) customElements.define('fom-mobile-navigation', FomMobileNavigation);
