(() => {
  const API = 'https://ai.mathswell.com/api/visitors'; // central API
  const NS  = 'mathswell';                              // your namespace

  function today() { return new Date().toISOString().slice(0,10); }

  function ensurePill() {
    // Look for anchor (optional). Otherwise, place inside .container or page.
    const container = document.querySelector('#mw-visit-anchor')
                     || document.querySelector('.container')
                     || document.body;

    // scope absolute positioning nicely when using .container
    if (container.classList && !getComputedStyle(container).position.match(/relative|absolute|fixed/)) {
      container.style.position = 'relative';
    }

    let host = document.getElementById('mw-visit-wrap');
    if (!host) {
      host = document.createElement('div');
      host.id = 'mw-visit-wrap';
      host.style.position = (container === document.body) ? 'fixed' : 'absolute';
      host.style.top = '12px';
      host.style.right = '12px';
      host.style.zIndex = '1000';
      host.innerHTML = `
        <span class="counter" style="
          display:inline-flex;align-items:center;gap:.45rem;
          padding:.35rem .6rem;border-radius:999px;
          background:#e6fffb;border:1px solid #bdebe3;color:#0f766e;font-weight:700;">
          ${window.mwCounterLabel || 'Visitors'}: <span id="mw-visit-count">…</span>
        </span>`;
      container.appendChild(host);
    }
    return document.getElementById('mw-visit-count');
  }

  async function update() {
    const countEl = ensurePill();
    const KEY = window.mwCounterKey || 'landing';
    const LS_KEY = `mw_last_hit_${KEY}`;
    const mode = (localStorage.getItem(LS_KEY) === today()) ? 'get' : 'hit';

    try {
      const res = await fetch(`${API}?ns=${encodeURIComponent(NS)}&key=${encodeURIComponent(KEY)}&mode=${mode}`, { mode:'cors' });
      const data = await res.json();
      if (typeof data.value === 'number') {
        countEl.textContent = data.value.toLocaleString();
        if (mode === 'hit') localStorage.setItem(LS_KEY, today());
      } else {
        countEl.textContent = '—';
      }
    } catch {
      countEl.textContent = '—';
    }
  }

  document.addEventListener('DOMContentLoaded', update);
})();
