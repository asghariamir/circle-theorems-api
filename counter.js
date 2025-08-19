(() => {
  const API = 'https://ai.mathswell.com/api/visitors';
  const NS  = 'mathswell';
  const KEY = 'circles';                // <-- different key
  const OUT = document.getElementById('visitor-count-circles');
  const DATE_KEY = 'mw_circles_last_hit_date';

  function show(val) { OUT && (OUT.textContent = (val ?? '—')); }

  const today = new Date().toISOString().slice(0,10);
  const mode = (localStorage.getItem(DATE_KEY) === today) ? 'get' : 'hit';

  fetch(`${API}?ns=${encodeURIComponent(NS)}&key=${encodeURIComponent(KEY)}&mode=${mode}`)
    .then(r => r.json())
    .then(d => {
      if (typeof d.value === 'number') {
        show(d.value.toLocaleString());
        if (mode === 'hit') localStorage.setItem(DATE_KEY, today);
      } else {
        show('—');
      }
    })
    .catch(() => show('—'));
})();
