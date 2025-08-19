// counter.js
(async () => {
  const el = document.getElementById('visitor-count');
  if (!el) return;

  // Pick a key per app/page
  const key = el.dataset.key || 'landing';    // e.g. landing, circles, logic
  const ns  = 'mathswell';                    // your namespace

  const endpoint = `https://ai.mathswell.com/api/visitors?ns=${encodeURIComponent(ns)}&key=${encodeURIComponent(key)}&mode=hit`;

  try {
    const r = await fetch(endpoint, { method: 'GET' });
    const j = await r.json();
    if (typeof j.value === 'number') el.textContent = j.value.toLocaleString();
    else el.textContent = '—';
  } catch {
    el.textContent = '—';
  }
})();
