if (document.body.classList.contains('template-index')) {

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEN8nC8KE9yMSz98aEX-AYSfkxy2Ocvjo4aTjEmBxUgvmMRJpKs967hUnexbnKqFzL/exec';

  const SECTIONS = [
    'shopify-section-announcement',
    'shopify-section-top-bar',
    'shopify-section-horizontal-menu',
    'shopify-section-category-navigation',
    'shopify-section-template--25908874576137__responsive_banner_zpn74G',
    'shopify-section-template--25908874576137__gallery_WrgVxY',
    'shopify-section-template--25908874576137__best_collection_JqHxGk',
    'shopify-section-template--25908874576137__hvc_products_DM4MLE',
    'shopify-section-template--25908874576137__feature_bxBV6F',
    'shopify-section-template--25908874576137__review_ymYnQC',
    'shopify-section-template--25908874576137__custom_html_VcwTaj',
    'shopify-section-template--25908874576137__shop_9thmyU',
    'shopify-section-template--25908874576137__shop_NiAiWw',
    'shopify-section-template--25908874576137__blog_posts_NhAnFk',
    'shopify-section-template--25908874576137__custom_html_fQ9Cti',
    'shopify-section-template--25908874576137__subscribe_form_8HApQw',
    'shopify-section-order-tracker',
    'shopify-section-footer-1',
    'shopify-section-mobile-stickybar',
    'shopify-section-custom-colors',
    'shopify-section-new-arrivils'
  ];

  const TESTING_MODE = false;

  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(data => {
      const country = data.country_code || 'UNKNOWN';
      console.log('User country:', country);

      if (country === 'LK' && !TESTING_MODE) {
        console.log('Sri Lanka - Tracking DISABLED');
        return;
      }
      console.log('Tracking ENABLED');
      startTracking(country);
    })
    .catch(err => {
      console.log('Country check failed, tracking anyway:', err);
      startTracking('UNKNOWN');
    });

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

    function sendEvent(payload) {
      console.log('Sending:', payload);
      fetch(APPS_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sendEvent({
            event: 'impression',
            section_id: entry.target.id,
            date: today,
            time: getTime(),
            country: country,
            device: device
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        el.addEventListener('click', () => {

          // ✅ NEW: Save the clicked section to localStorage
          localStorage.setItem('attributed_section', id);
          localStorage.setItem('attributed_date', today);
          console.log('Attribution saved:', id);

          sendEvent({
            event: 'click',
            section_id: id,
            date: today,
            time: getTime(),
            country: country,
            device: device
          });
        });
      }
    });

    console.log('Homepage tracker initialized.');
  }
}


// ✅ NEW: Call this function when an order is placed
// Put this OUTSIDE the template-index check — works on ALL pages (cart, checkout, thank-you)
window.trackSale = function(orders, revenue) {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEN8nC8KE9yMSz98aEX-AYSfkxy2Ocvjo4aTjEmBxUgvmMRJpKs967hUnexbnKqFzL/exec';

  const attributedSection = localStorage.getItem('attributed_section') || 'unknown';
  const attributedDate    = localStorage.getItem('attributed_date')    || new Date().toISOString().split('T')[0];

  const payload = {
    event: 'sale',
    section_id: attributedSection,
    date: attributedDate,
    orders: orders,
    revenue: revenue
  };

  console.log('Sale attributed to section:', attributedSection, payload);

  fetch(APPS_SCRIPT_URL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  // Clear after sale so next order starts fresh
  localStorage.removeItem('attributed_section');
  localStorage.removeItem('attributed_date');
};

// ✅ NEW: Page tracking for all pages except home
if (!document.body.classList.contains('template-index')) {

  const PAGE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEN8nC8KE9yMSz98aEX-AYSfkxy2Ocvjo4aTjEmBxUgvmMRJpKs967hUnexbnKqFzL/exec';
  const PAGE_TESTING_MODE = false;

  function getPageSlug() {
    // /pages/about-us  → "about-us"
    // /collections/shoes → "shoes"
    // /products/red-sneaker → "red-sneaker"
    const parts = window.location.pathname.replace(/^\/|\/$/g, '').split('/');
    return parts[parts.length - 1] || 'unknown';
  }

  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(data => {
      const country = data.country_code || 'UNKNOWN';
      if (country === 'LK' && !PAGE_TESTING_MODE) {
        console.log('Sri Lanka - Page tracking DISABLED');
        return;
      }
      startPageTracking(country);
    })
    .catch(() => startPageTracking('UNKNOWN'));

  function startPageTracking(country) {
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

    function sendPageEvent(payload) {
      console.log('Page event:', payload);
      fetch(PAGE_APPS_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const pageSlug = getPageSlug();

    // 👁️ Impression — fires once on page load
    sendPageEvent({
      event: 'page_impression',
      page: pageSlug,
      date: today,
      time: getTime(),
      country: country,
      device: device
    });

    // 🖱️ Click — fires on any <a> link click
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (!link) return;

      sendPageEvent({
        event: 'page_click',
        page: pageSlug,
        date: today,
        time: getTime(),
        country: country,
        device: device
      });
    });

    console.log('Page tracker initialized for:', pageSlug);
  }
}