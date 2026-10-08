(function () {
  if (!document.body.classList.contains('template-product')) return;

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEN8nC8KE9yMSz98aEX-AYSfkxy2Ocvjo4aTjEmBxUgvmMRJpKs967hUnexbnKqFzL/exec';
  const TESTING_MODE = false;

  const PRODUCT_HANDLE = window.location.pathname.split('/products/')[1]?.split('?')[0] || 'unknown';

  const SECTIONS = [
    'shopify-section-category-navigation',
    'shopify-section-template--25908875395337__breadcrumb',
    'shopify-section-template--25908875395337__main',
    'shopify-section-template--25908875395337__collection_products_Gd4JMd',
    'shopify-section-template--25908875395337__hvc_products_fEMgfx',
    'shopify-section-template--25908875395337__176153683630ccefa6',
    'shopify-section-template--25908875395337__product-sidebar',
    'shopify-section-template--25908875395337__information-tabs',
    'shopify-section-template--25908875395337__product-recommendations',
    'shopify-section-template--25908875395337__subscribe_form_N3i6LL'
  ];

  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(data => {
      const country = data.country_code || 'UNKNOWN';
      if (country === 'LK' && !TESTING_MODE) return;
      startTracking(country);
    })
    .catch(() => startTracking('UNKNOWN'));

  function startTracking(country) {
    const today = new Date().toISOString().split('T')[0];
    const ua = navigator.userAgent;
    let device = 'Desktop';
    if (/Tablet|iPad/i.test(ua)) device = 'Tablet';
    else if (/Mobile|Android|iPhone/i.test(ua)) device = 'Mobile';

    function getTime() {
      const p = new Intl.DateTimeFormat('de-DE', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).formatToParts(new Date());
      const m = Object.fromEntries(p.map(x => [x.type, x.value]));
      return `${m.hour}-${m.minute}-${m.second}`;
    }

    function sendEvent(eventName, section_id) {
      fetch(APPS_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          section_id: `product/${PRODUCT_HANDLE}/${section_id}`,
          date: today,
          time: getTime(),
          country,
          device
        })
      });
    }

    // ── PAGE VIEW ──
    sendEvent('product_impression', 'page-view');

    // ── SECTION IMPRESSIONS ──
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sendEvent('product_impression', entry.target.id);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        el.addEventListener('click', () => sendEvent('product_click', id));
      }
    });

    // ── ADD TO CART ──
    document.querySelectorAll('[name="add"], #AddToCart, .add-to-cart, [id*="add-to-cart"], .btn-addtocart').forEach(btn => {
      btn.addEventListener('click', () => sendEvent('product_click', 'add-to-cart'));
    });

    // ── BUY NOW ──
    document.querySelectorAll('[name="buy-now"], #BuyNow, .buy-it-now, [id*="buy-now"], [class*="buy-now"]').forEach(btn => {
      btn.addEventListener('click', () => sendEvent('product_click', 'buy-now'));
    });

    // ── IMAGE GALLERY ──
    document.querySelectorAll('.product__media img, .product-gallery img, [class*="product"] img').forEach(img => {
      img.addEventListener('click', () => sendEvent('product_click', 'image-gallery'));
    });

    console.log('Product tracker ready:', PRODUCT_HANDLE);
  }
})();