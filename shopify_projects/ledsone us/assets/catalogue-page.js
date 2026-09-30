'use strict';

// ─── Catalogue Page ───────────────────────────────────────────────────────────
// Drives /pages/all-product-catalogue.
//
// MECHANISM:
//   When a collection tab is selected, an AJAX request is made to
//   /collections/<handle>?view=catalogue&section_id=catalogue-product-grid
//   ?view=catalogue forces Shopify to render collection.catalogue.json
//   (regardless of what template the collection has assigned), which contains
//   the catalogue-product-grid section key.  Without ?view=catalogue, Shopify
//   falls back to the default collection.json, which has no matching key → 404.
//
//   After injection, BlsEventCollectionShopify.renderUrl is patched so that all
//   filter/sort re-renders also use the collection URL (not window.location.pathname,
//   which is the page URL with no collection context).
//   The patch reads _currentHandle from the module closure, NOT from a DOM
//   attribute, because renderSectionFilter replaces the injected section node on
//   every filter update and the replacement node has no custom data attributes.
//
// GLOBALS ASSUMED FROM theme.js (confirmed present):
//   parser, BlsEventCollectionShopify, BlsColorSwatchesShopify,
//   BlsSubActionProduct, BlsReloadSpr, BlsLazyloadImg, slideAnime

var CataloguePageShopify = (function () {

  // The section key that exists in collection.catalogue.json
  var CATALOGUE_SECTION_ID = 'catalogue-product-grid';

  var _currentHandle = null;
  var _zone = null;
  var _navItems = null;

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  function init() {
    _zone = document.getElementById('catalogue-product-zone');
    _navItems = document.querySelectorAll('[data-catalogue-handle]');

    if (!_zone || _navItems.length === 0) return;

    _bindNavClicks();
    _patchRenderUrl();

    var initialHandle = _resolveInitialHandle();
    if (initialHandle) {
      _loadCollection(initialHandle, false);
    }
  }

  // ── Determine which collection to load on first paint ─────────────────────

  function _resolveInitialHandle() {
    // 1. URL param ?collection=<handle>
    var params = new URLSearchParams(window.location.search);
    var paramHandle = params.get('collection');
    if (paramHandle) return paramHandle;

    // 2. First nav item
    if (_navItems.length > 0) {
      return _navItems[0].dataset.catalogueHandle;
    }
    return null;
  }

  // ── Intercept tab clicks ───────────────────────────────────────────────────

  function _bindNavClicks() {
    _navItems.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var handle = link.dataset.catalogueHandle;
        if (handle && handle !== _currentHandle) {
          _loadCollection(handle, true);
        }
      });
    });
  }

  // ── AJAX: fetch collection section and inject ──────────────────────────────

  function _loadCollection(handle, pushHistory) {
    _currentHandle = handle;
    _setActiveTab(handle);
    _setZoneLoading(true);

    var url = '/collections/' + handle + '?view=catalogue&section_id=' + CATALOGUE_SECTION_ID;

    fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error('Catalogue fetch failed: ' + response.status);
        return response.text();
      })
      .then(function (html) {
        var parsed = new DOMParser().parseFromString(html, 'text/html');
        var newSection = parsed.querySelector('.section-collection-product');

        if (!newSection) {
          // Section not found — collection may not use the catalogue template
          _zone.innerHTML = '<p style="padding:40px 20px;text-align:center;">Products are loading. If this persists, please check the collection template assignment.</p>';
          _setZoneLoading(false);
          return;
        }

        // Tag the section with its collection handle so renderUrl can read it
        newSection.dataset.catalogueHandle = handle;

        _zone.innerHTML = '';
        _zone.appendChild(newSection);
        _setZoneLoading(false);

        // Re-attach all Umino collection event listeners
        if (typeof BlsEventCollectionShopify !== 'undefined') {
          BlsEventCollectionShopify.init();
        }
        if (typeof BlsColorSwatchesShopify !== 'undefined') {
          BlsColorSwatchesShopify.init();
        }
        if (typeof BlsSubActionProduct !== 'undefined') {
          BlsSubActionProduct.init();
        }
        if (typeof BlsReloadSpr !== 'undefined') {
          BlsReloadSpr.init();
        }
        setTimeout(function () {
          if (typeof BlsLazyloadImg !== 'undefined') {
            BlsLazyloadImg.init();
          }
        }, 200);

        if (pushHistory) {
          _pushCatalogueUrl(handle);
        }
      })
      .catch(function (err) {
        _setZoneLoading(false);
        console.error('[CataloguePageShopify]', err);
      });
  }

  // ── Tab active state (JS-driven — collection.handle is nil on page template) ─

  function _setActiveTab(handle) {
    _navItems.forEach(function (link) {
      var isActive = link.dataset.catalogueHandle === handle;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // ── Loading state ──────────────────────────────────────────────────────────

  function _setZoneLoading(loading) {
    if (!_zone) return;
    _zone.classList.toggle('is-loading', loading);
    _zone.setAttribute('aria-busy', loading ? 'true' : 'false');
  }

  // ── URL management ─────────────────────────────────────────────────────────
  // Keeps the browser on /pages/all-product-catalogue.
  // When a collection is selected, adds ?collection=<handle> so the URL is
  // bookmarkable and Back works correctly.

  function _pushCatalogueUrl(handle) {
    var cataloguePath = window.location.pathname; // /pages/all-product-catalogue
    var newUrl = cataloguePath + '?collection=' + handle;
    window.history.pushState({ catalogueHandle: handle }, '', newUrl);
  }

  // ── Patch BlsEventCollectionShopify.renderUrl ──────────────────────────────
  // The original renderUrl uses window.location.pathname (/pages/...) as the
  // fetch base — this would return an empty section because the page template
  // has no collection context.
  //
  // The patch redirects all filter/sort re-renders to the correct
  // /collections/<handle>?view=catalogue&section_id=...&<filter_params> URL.
  //
  // IMPORTANT: reads _currentHandle from the module closure, NOT from a DOM
  // data attribute. renderSectionFilter (collection.js) replaces the injected
  // .section-collection-product node with a fresh one from Shopify on every
  // filter update.  That replacement node has no data-catalogue-handle attribute
  // (Shopify does not know about our custom attribute), so a DOM read would
  // return undefined after the first filter action.  The closure variable always
  // reflects the currently displayed collection regardless of DOM state.
  //
  // updateUrl (which writes the browser address bar) is left unmodified —
  // it will correctly write /pages/all-product-catalogue?<filter_params>
  // because window.location.pathname stays as the catalogue page URL.

  function _patchRenderUrl() {
    if (typeof BlsEventCollectionShopify === 'undefined') return;

    BlsEventCollectionShopify.renderUrl = function (searchParams) {
      var section = document.querySelector('.section-collection-product');
      var sectionId = (section && section.dataset.sectionId) || CATALOGUE_SECTION_ID;

      if (_currentHandle) {
        return '/collections/' + _currentHandle + '?view=catalogue&section_id=' + sectionId + '&' + searchParams;
      }

      // Fallback: original behaviour (should not reach here on catalogue page)
      return window.location.pathname + '?section_id=' + sectionId + '&' + searchParams;
    };
  }

  // ── Handle browser Back/Forward ────────────────────────────────────────────

  function _bindPopState() {
    window.addEventListener('popstate', function (e) {
      var handle;
      if (e.state && e.state.catalogueHandle) {
        handle = e.state.catalogueHandle;
      } else {
        var params = new URLSearchParams(window.location.search);
        handle = params.get('collection');
      }
      if (handle && handle !== _currentHandle) {
        _loadCollection(handle, false);
      }
    });
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  return {
    init: function () {
      init();
      _bindPopState();
    }
  };

})();

// Initialise when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    CataloguePageShopify.init();
  });
} else {
  CataloguePageShopify.init();
}
