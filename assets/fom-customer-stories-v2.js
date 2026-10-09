class FomStories extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-story-track]');
    this.querySelector('[data-story-previous]')?.addEventListener('click', () => this.previous());
    this.querySelector('[data-story-next]')?.addEventListener('click', () => this.next());
    this.startX = 0;
    this.track?.addEventListener('pointerdown', (event) => {
      this.startX = event.clientX;
    });
    this.track?.addEventListener('pointerup', (event) => {
      const distance = event.clientX - this.startX;
      if (Math.abs(distance) < 48) return;
      if (distance < 0) this.next();
      else this.previous();
    });
    this.track?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') this.next();
      if (event.key === 'ArrowLeft') this.previous();
    });
  }

  next() {
    if (!this.track || this.track.children.length < 2) return;
    this.track.append(this.track.firstElementChild);
    this.announce();
  }

  previous() {
    if (!this.track || this.track.children.length < 2) return;
    this.track.prepend(this.track.lastElementChild);
    this.announce();
  }

  announce() {
    const status = this.querySelector('[data-story-status]');
    const firstName = this.track?.firstElementChild?.querySelector('[data-story-name]')?.textContent;
    if (status && firstName) status.textContent = `${firstName} testimonial is shown first`;
  }
}

if (!customElements.get('fom-stories')) {
  customElements.define('fom-stories', FomStories);
}
