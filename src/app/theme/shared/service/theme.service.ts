import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private storageKey = 'berry-dark-mode';
  isDark = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const stored = localStorage.getItem(this.storageKey);
    this.isDark = stored === null ? true : stored === 'true';
    this.apply();
  }

  toggle() {
    this.isDark = !this.isDark;
    this.apply();
  }

  private apply() {
    localStorage.setItem(this.storageKey, String(this.isDark));
    if (this.isDark) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }
}
