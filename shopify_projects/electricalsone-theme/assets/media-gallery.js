// ─── Amazon-style product image lightbox ──────────────────────────────────────
class ProductLightboxEnhancer {
  constructor(modal) {
    this.modal   = modal;
    this.dialog  = modal.querySelector('.product-media-modal__dialog');
    this.content = modal.querySelector('.product-media-modal__content');
    if (!this.dialog || !this.content) return;

    // Derive section id to sync with the MediaGallery element
    const mid = modal.id || '';
    this.sectionId = mid.replace('ProductModal-', '');
    this.gallery   = document.querySelector('media-gallery');

    this._idx = 0;

    this._buildUI();
    this._bindEvents();

    new MutationObserver(() => {
      if (this.modal.hasAttribute('open')) this._onOpen();
      else this._onClose();
    }).observe(this.modal, { attributes: true, attributeFilter: ['open'] });
  }

  // ── SVG helpers ─────────────────────────────────────────────────────────────

  _svgClose() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  }

  _svgChev(dir) {
    const pts = dir === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="${pts}"/></svg>`;
  }

  // ── Build DOM ────────────────────────────────────────────────────────────────

  _buildUI() {
    // Hide the theme default close button; we inject our own
    const themeClose = this.modal.querySelector('.product-media-modal__toggle');
    if (themeClose) themeClose.setAttribute('data-lbx-replaced', '');

    this.wrap = document.createElement('div');
    this.wrap.className = 'lbx-wrap';
    this.wrap.setAttribute('aria-label', 'Product image viewer');
    this.wrap.innerHTML = `
      <button type="button" class="lbx-close" aria-label="Close image viewer">${this._svgClose()}</button>
      <div class="lbx-thumbs" role="list" aria-label="Product images"></div>
      <div class="lbx-stage">
        <div class="lbx-image-area"></div>
        <button type="button" class="lbx-arrow lbx-arrow--prev" aria-label="Previous image" disabled>${this._svgChev('left')}</button>
        <button type="button" class="lbx-arrow lbx-arrow--next" aria-label="Next image">${this._svgChev('right')}</button>
        <div class="lbx-counter" aria-live="polite" aria-atomic="true"></div>
      </div>`;

    this.dialog.appendChild(this.wrap);

    this.lbxClose    = this.wrap.querySelector('.lbx-close');
    this.lbxThumbs   = this.wrap.querySelector('.lbx-thumbs');
    this.lbxImgArea  = this.wrap.querySelector('.lbx-image-area');
    this.lbxPrev     = this.wrap.querySelector('.lbx-arrow--prev');
    this.lbxNext     = this.wrap.querySelector('.lbx-arrow--next');
    this.lbxCounter  = this.wrap.querySelector('.lbx-counter');
  }

  // ── Data helpers ─────────────────────────────────────────────────────────────

  _items() {
    // product-media.liquid renders bare <img data-media-id> for images
    // and wrapper elements for video/model — all direct children of content
    return Array.from(this.content.children);
  }

  _activeIndex() {
    return this._items().findIndex(el => el.classList.contains('active'));
  }

  _sourceImg(item) {
    return item.tagName === 'IMG' ? item : item.querySelector('img');
  }

  _largestSrc(img) {
    if (!img || !img.srcset) return img ? img.src : '';
    let maxW = 0, best = img.src;
    img.srcset.split(',').forEach(chunk => {
      const parts = chunk.trim().split(/\s+/);
      const w = parts[1] ? parseInt(parts[1]) : 0;
      if (w > maxW) { maxW = w; best = parts[0]; }
    });
    return best;
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  _buildThumbs(items) {
    this.lbxThumbs.innerHTML = '';
    items.forEach((item, i) => {
      const src = this._sourceImg(item);
      const li  = document.createElement('div');
      li.className = 'lbx-thumb';
      li.setAttribute('role', 'listitem');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lbx-thumb-btn';
      btn.setAttribute('aria-label', `Image ${i + 1}`);
      btn.dataset.lbxIdx = i;

      if (src) {
        const tImg = new Image(64, 64);
        tImg.src    = src.src;
        tImg.alt    = src.alt || '';
        tImg.loading = 'lazy';
        btn.appendChild(tImg);
      } else {
        btn.innerHTML = `<span class="lbx-thumb-icon">▶</span>`;
      }

      li.appendChild(btn);
      this.lbxThumbs.appendChild(li);
    });
  }

  _show(idx) {
    const items = this._items();
    if (idx < 0 || idx >= items.length) return;
    this._idx = idx;

    // Mark active on original content (used by theme's product-modal logic)
    items.forEach(el => el.classList.remove('active'));
    items[idx].classList.add('active');

    // Render main image
    this.lbxImgArea.innerHTML = '';
    const src = this._sourceImg(items[idx]);
    if (src) {
      const img = new Image();
      img.src       = this._largestSrc(src);
      img.alt       = src.alt || '';
      img.className = 'lbx-main-img';
      img.draggable = false;
      this.lbxImgArea.appendChild(img);
    }

    // Update thumbnail highlight
    this.lbxThumbs.querySelectorAll('.lbx-thumb-btn').forEach((btn, i) => {
      btn.classList.toggle('is-active', i === idx);
      btn.setAttribute('aria-pressed', String(i === idx));
    });
    const activeBtn = this.lbxThumbs.querySelector('.lbx-thumb-btn.is-active');
    if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    // Arrow states
    this.lbxPrev.disabled = idx <= 0;
    this.lbxNext.disabled = idx >= items.length - 1;

    // Counter
    this.lbxCounter.textContent = `${idx + 1} / ${items.length}`;

    // Sync main gallery thumbnails
    this._syncGallery(items[idx]);
  }

  _syncGallery(item) {
    if (!this.gallery) return;
    let mediaId = item.dataset.mediaId;
    if (!mediaId) {
      const inner = item.querySelector('[data-media-id]');
      if (inner) mediaId = inner.dataset.mediaId;
    }
    if (!mediaId) return;
    const fullId = this.sectionId ? `${this.sectionId}-${mediaId}` : mediaId;
    if (typeof this.gallery.setActiveMedia === 'function') {
      try { this.gallery.setActiveMedia(fullId, false); } catch (_) {
        try { this.gallery.setActiveMedia(mediaId, false); } catch (__) {}
      }
    }
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────────

  _onOpen() {
    const items = this._items();
    this._buildThumbs(items);
    const start = this._activeIndex();
    this._show(start >= 0 ? start : 0);
    document.body.classList.add('lbx-scroll-lock');
    requestAnimationFrame(() => this.lbxClose.focus());
  }

  _onClose() {
    document.body.classList.remove('lbx-scroll-lock');
  }

  _close() {
    if (typeof this.modal.hide === 'function') this.modal.hide();
    else this.modal.removeAttribute('open');
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  _bindEvents() {
    // Dawn's ModalDialog closes the modal on any pointerup inside .media-modal
    // that isn't inside deferred-media/product-model. Stop propagation from lbx-wrap
    // so our internal clicks (arrows, thumbs, close) don't trigger that handler.
    this.wrap.addEventListener('click',     (e) => e.stopPropagation());
    this.wrap.addEventListener('pointerup', (e) => e.stopPropagation());

    this.lbxClose.addEventListener('click', () => this._close());
    this.lbxPrev.addEventListener('click',  () => this._show(this._idx - 1));
    this.lbxNext.addEventListener('click',  () => this._show(this._idx + 1));

    this.lbxThumbs.addEventListener('click', (e) => {
      const btn = e.target.closest('.lbx-thumb-btn');
      if (btn) this._show(parseInt(btn.dataset.lbxIdx, 10));
    });

    document.addEventListener('keydown', (e) => {
      if (!this.modal.hasAttribute('open')) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); this._show(this._idx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); this._show(this._idx + 1); }
      if (e.key === 'Escape')     this._close();
    });

    // Backdrop click closes modal
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this._close();
    });

    // Touch swipe on image area
    let tx = 0, ty = 0;
    this.lbxImgArea.addEventListener('touchstart', (e) => {
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    }, { passive: true });

    this.lbxImgArea.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - tx;
      const dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
        this._show(this._idx + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-media-modal').forEach(modal => {
    new ProductLightboxEnhancer(modal);
  });
});

if (!customElements.get('media-gallery')) {
  customElements.define('media-gallery', class MediaGallery extends HTMLElement {
    constructor() {
      super();
      this.elements = {
        liveRegion: this.querySelector('[id^="GalleryStatus"]'),
        viewer: this.querySelector('[id^="GalleryViewer"]'),
        thumbnails: this.querySelector('[id^="GalleryThumbnails"]')
      }
      this.mql = window.matchMedia('(min-width: 750px)');

      this.initOverlayArrows();

      if (!this.elements.thumbnails) return;

      this.elements.viewer.addEventListener('slideChanged', debounce(this.onSlideChanged.bind(this), 500));
      this.elements.thumbnails.querySelectorAll('[data-target]').forEach((mediaToSwitch) => {
        mediaToSwitch.querySelector('button').addEventListener('click', this.setActiveMedia.bind(this, mediaToSwitch.dataset.target, false));
      });
      if (this.dataset.desktopLayout !== 'stacked' && this.mql.matches) this.removeListSemantic();
    }

    initOverlayArrows() {
      this.prevArrow = this.querySelector('.pgn-arrow--prev');
      this.nextArrow = this.querySelector('.pgn-arrow--next');
      if (!this.prevArrow || !this.nextArrow) return;

      this.prevArrow.addEventListener('click', () => this.navigateOverlay(-1));
      this.nextArrow.addEventListener('click', () => this.navigateOverlay(1));

      const sliderList = this.querySelector('[id^="Slider-Gallery"]');
      if (sliderList) {
        sliderList.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') { e.preventDefault(); this.navigateOverlay(-1); }
          if (e.key === 'ArrowRight') { e.preventDefault(); this.navigateOverlay(1); }
        });
      }

      this.updateOverlayArrows();
    }

    getNavigableIds() {
      if (this.elements.thumbnails) {
        return Array.from(this.elements.thumbnails.querySelectorAll('[data-target]'))
          .map(el => el.dataset.target);
      }
      return Array.from(this.elements.viewer.querySelectorAll('[data-media-id]'))
        .map(el => el.dataset.mediaId);
    }

    navigateOverlay(direction) {
      const navigableIds = this.getNavigableIds();
      const activeSlide = this.elements.viewer.querySelector('[data-media-id].is-active');
      if (!activeSlide) return;

      const activeIndex = navigableIds.indexOf(activeSlide.dataset.mediaId);
      if (activeIndex === -1) return;

      const targetIndex = activeIndex + direction;
      if (targetIndex < 0 || targetIndex >= navigableIds.length) return;

      this.setActiveMedia(navigableIds[targetIndex], false);
      this.updateOverlayArrows();
    }

    updateOverlayArrows() {
      if (!this.prevArrow || !this.nextArrow) return;
      const navigableIds = this.getNavigableIds();
      const activeSlide = this.elements.viewer.querySelector('[data-media-id].is-active');
      if (!activeSlide) return;

      const activeIndex = navigableIds.indexOf(activeSlide.dataset.mediaId);
      this.prevArrow.toggleAttribute('disabled', activeIndex <= 0);
      this.nextArrow.toggleAttribute('disabled', activeIndex >= navigableIds.length - 1);
    }

    onSlideChanged(event) {
      const thumbnail = this.elements.thumbnails.querySelector(`[data-target="${ event.detail.currentElement.dataset.mediaId }"]`);
      this.setActiveThumbnail(thumbnail);
      this.updateOverlayArrows();
    }

    setActiveMedia(mediaId, prepend) {
      const activeMedia = this.elements.viewer.querySelector(`[data-media-id="${ mediaId }"]`);
      this.elements.viewer.querySelectorAll('[data-media-id]').forEach((element) => {
        element.classList.remove('is-active');
      });
      activeMedia.classList.add('is-active');

      if (prepend) {
        activeMedia.parentElement.prepend(activeMedia);
        if (this.elements.thumbnails) {
          const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${ mediaId }"]`);
          activeThumbnail.parentElement.prepend(activeThumbnail);
        }
        if (this.elements.viewer.slider) this.elements.viewer.resetPages();
      }

      this.preventStickyHeader();
      window.setTimeout(() => {
        if (this.elements.thumbnails) {
          activeMedia.parentElement.scrollTo({ left: activeMedia.offsetLeft });
        }
        if (!this.elements.thumbnails || this.dataset.desktopLayout === 'stacked') {
          activeMedia.scrollIntoView({behavior: 'smooth'});
        }
      });
      this.playActiveMedia(activeMedia);

      if (!this.elements.thumbnails) return;
      const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${ mediaId }"]`);
      this.setActiveThumbnail(activeThumbnail);
      this.announceLiveRegion(activeMedia, activeThumbnail.dataset.mediaPosition);
      this.updateOverlayArrows();
    }

    setActiveThumbnail(thumbnail) {
      if (!this.elements.thumbnails || !thumbnail) return;

      this.elements.thumbnails.querySelectorAll('button').forEach((element) => element.removeAttribute('aria-current'));
      thumbnail.querySelector('button').setAttribute('aria-current', true);
      if (this.elements.thumbnails.isSlideVisible(thumbnail, 10)) return;

      this.elements.thumbnails.slider.scrollTo({ left: thumbnail.offsetLeft });
    }

    announceLiveRegion(activeItem, position) {
      const image = activeItem.querySelector('.product__modal-opener--image img');
      if (!image) return;
      image.onload = () => {
        this.elements.liveRegion.setAttribute('aria-hidden', false);
        this.elements.liveRegion.innerHTML = window.accessibilityStrings.imageAvailable.replace(
          '[index]',
          position
        );
        setTimeout(() => {
          this.elements.liveRegion.setAttribute('aria-hidden', true);
        }, 2000);
      };
      image.src = image.src;
    }

    playActiveMedia(activeItem) {
      window.pauseAllMedia();
      const deferredMedia = activeItem.querySelector('.deferred-media');
      if (deferredMedia) deferredMedia.loadContent(false);
    }

    preventStickyHeader() {
      this.stickyHeader = this.stickyHeader || document.querySelector('sticky-header');
      if (!this.stickyHeader) return;
      this.stickyHeader.dispatchEvent(new Event('preventHeaderReveal'));
    }

    removeListSemantic() {
      if (!this.elements.viewer.slider) return;
      this.elements.viewer.slider.setAttribute('role', 'presentation');
      this.elements.viewer.sliderItems.forEach(slide => slide.setAttribute('role', 'presentation'));
    }
  });
}
