(function () {
  'use strict';

  function init() {
    var dataEl = document.getElementById('b2b-tier-data');
    if (!dataEl) return;

    var data;
    try { data = JSON.parse(dataEl.textContent); }
    catch (e) { console.error('[B2B] tier data parse error', e); return; }

    var tiers     = data.tiers;
    var basePrice = data.basePrice;
    var currency  = data.currencySymbol || '£';

    /* ── DOM refs ── */
    var qtyInput      = document.querySelector('[data-b2b-qty]');
    var variantSelect = document.getElementById('b2b-variant-select');
    var variantHidden = document.getElementById('b2b-variant-id');
    var skuEl         = document.getElementById('b2b-sku-value');
    var summaryQtyEl  = document.getElementById('b2b-summary-qty');
    var summaryTotal  = document.getElementById('b2b-summary-total');
    var tierCards     = document.querySelectorAll('.b2b-tier');

    /* Code panel */
    var codePanel  = document.getElementById('b2b-code-panel');
    var codeValue  = document.getElementById('b2b-code-value');
    var codePct    = document.getElementById('b2b-code-pct');
    var codeCopy   = document.getElementById('b2b-code-copy');

    /* Track active code for localStorage write on ATC */
    var activeCode = '';

    function fmt(cents) {
      return currency + (cents / 100).toFixed(2);
    }

    /* Highest applicable tier */
    function getTier(qty) {
      var t = tiers[0];
      for (var i = 0; i < tiers.length; i++) {
        if (qty >= tiers[i].qty) t = tiers[i];
      }
      return t;
    }

    function updateUI(qty) {
      qty = Math.max(1, parseInt(qty, 10) || 1);

      var tier       = getTier(qty);
      var totalCents = basePrice * qty;

      /* Summary */
      if (summaryQtyEl)  summaryQtyEl.textContent  = qty + ' unit' + (qty !== 1 ? 's' : '');
      if (summaryTotal)  summaryTotal.textContent   = fmt(totalCents);

      /* Tier card highlight */
      tierCards.forEach(function (card) {
        card.classList.toggle('active', parseInt(card.getAttribute('data-qty'), 10) === tier.qty);
      });

      /* Code panel */
      activeCode = tier.code || '';
      if (codePanel) {
        if (activeCode) {
          codePanel.style.display = '';
          if (codeValue) codeValue.textContent = activeCode;
          if (codePct)   codePct.textContent   = tier.discount + '% OFF';
        } else {
          codePanel.style.display = 'none';
        }
      }
    }

    /* ── Tier card click → set qty ── */
    tierCards.forEach(function (card) {
      card.addEventListener('click', function () {
        var tQty = parseInt(card.getAttribute('data-qty'), 10);
        if (qtyInput) {
          qtyInput.value = tQty;
          qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        updateUI(tQty);
      });
    });

    /* ── quantity-input change ── */
    if (qtyInput) {
      qtyInput.addEventListener('change', function () { updateUI(qtyInput.value); });
      qtyInput.addEventListener('input',  function () { updateUI(qtyInput.value); });
    }

    /* ── Variant <select> change ── */
    if (variantSelect) {
      variantSelect.addEventListener('change', function () {
        var opt    = variantSelect.options[variantSelect.selectedIndex];
        var newId  = opt.value;
        var newSku = opt.getAttribute('data-sku') || '';
        basePrice  = parseInt(opt.getAttribute('data-price'), 10) || basePrice;
        if (variantHidden) variantHidden.value = newId;
        if (skuEl && newSku) skuEl.textContent = newSku;
        updateUI(qtyInput ? qtyInput.value : 1);
      });
    }

    /* ── Copy code button ── */
    if (codeCopy) {
      codeCopy.addEventListener('click', function () {
        if (!activeCode) return;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(activeCode).then(function () {
            codeCopy.textContent = 'Copied!';
            setTimeout(function () { codeCopy.textContent = 'Copy'; }, 2000);
          });
        } else {
          /* Fallback for older browsers */
          var tmp = document.createElement('input');
          tmp.value = activeCode;
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand('copy');
          document.body.removeChild(tmp);
          codeCopy.textContent = 'Copied!';
          setTimeout(function () { codeCopy.textContent = 'Copy'; }, 2000);
        }
      });
    }

    /* ── On ATC: write code to localStorage so theme pre-fills cart discount field ──
       The theme (theme.js) reads localStorage("discount_code") and populates
       .bls__discount_code input on the cart page automatically.                      ── */
    var form = document.querySelector('[data-type="add-to-cart-form"]');
    if (form) {
      form.addEventListener('submit', function () {
        if (activeCode) {
          try { localStorage.setItem('discount_code', activeCode); } catch (e) {}
        }
      });
    }

    /* ── Init ── */
    updateUI(qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
