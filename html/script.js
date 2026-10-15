const app = document.getElementById('app');
const rowsEl = document.getElementById('rows');
const RES = typeof GetParentResourceName === 'function' ? GetParentResourceName() : 'rex-coords';

function post(name, data = {}) {
  return fetch(`https://${RES}/${name}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());
}

let L = {};
const f = (n, d) => Number(n).toFixed(d);

function applyLocale(loc) {
  L = loc || {};
  document.getElementById('t_title').textContent = L.cl_title;
  document.getElementById('t_subtitle').textContent = L.cl_subtitle;
  document.getElementById('t_hint').textContent = L.cl_hint;
  document.getElementById('refreshBtn').title = L.cl_refresh;
  document.getElementById('closeBtn').title = L.cl_close;
}

function build(d) {
  const p = d.decimals;
  const x = f(d.x, p), y = f(d.y, p), z = f(d.z, p), h = f(d.h, p);
  const list = [
    ['V3', 'vector3', `vector3(${x}, ${y}, ${z})`, 'Lua'],
    ['V4', 'vector4', `vector4(${x}, ${y}, ${z}, ${h})`, 'Lua'],
    ['XYZ', L.cl_lbl_xyz, `${x}, ${y}, ${z}`, L.cl_badge_raw],
    ['XYZW', L.cl_lbl_xyzh, `${x}, ${y}, ${z}, ${h}`, L.cl_badge_raw],
    ['TBL', L.cl_lbl_table, `{ x = ${x}, y = ${y}, z = ${z}, w = ${h} }`, 'Lua'],
    ['JSON', 'JSON', `{"x":${x},"y":${y},"z":${z},"heading":${h}}`, 'JSON'],
    ['H', L.cl_lbl_heading, `${h}`, L.cl_badge_float],
    ['ROT', L.cl_lbl_rotation, `vector3(${f(d.rx, p)}, ${f(d.ry, p)}, ${f(d.rz, p)})`, 'Lua'],
  ];
  if (d.groundZ != null) list.splice(2, 0, ['GND', L.cl_lbl_ground, `vector3(${x}, ${y}, ${f(d.groundZ, p)})`, 'Lua']);

  rowsEl.innerHTML = '';
  list.forEach(([icon, label, value, badge]) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<div class="icon">${icon}</div><div class="info"><div class="label">${label}</div><div class="value"></div></div><div class="badge">${badge}</div>`;
    row.querySelector('.value').textContent = value;
    row.onclick = () => { copy(value); row.classList.add('copied'); setTimeout(() => row.classList.remove('copied'), 600); };
    rowsEl.appendChild(row);
  });
}

function copy(text) {
  const ta = document.getElementById('clip');
  ta.value = text; ta.select();
  document.execCommand('copy');
  toast(L.cl_copied, text);
}

function toast(label, msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<div class="tl">${label}</div><div class="tm"></div>`;
  t.querySelector('.tm').textContent = msg;
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 250); }, 1800);
}

window.addEventListener('message', (e) => {
  const { action, data } = e.data;
  if (action === 'open') { applyLocale(e.data.locale); build(data); app.classList.remove('hidden'); }
  if (action === 'close') app.classList.add('hidden');
});

document.getElementById('closeBtn').onclick = () => post('close');
document.getElementById('refreshBtn').onclick = () => post('refresh').then(d => { build(d); toast(L.cl_refreshed, L.cl_position_updated); });
document.addEventListener('keyup', (e) => { if (e.key === 'Escape') post('close'); });
