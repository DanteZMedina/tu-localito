// stock-config-listado.js
import { inventario } from './stock-productos.js';

const STORAGE_KEY = 'configListadoSettings';

// ======== DOM refs ========
const formConfigListado = document.getElementById('form-stock-config-listado'); // 👈 ID de tu form en HTML
const inputUmbralConfig = document.getElementById('input-umbral');
const inputOrdenarConfig = document.getElementById('input-ordenar');
const tbodyProductos = document.getElementById('tbody-productos');
const paginacionProductos = document.getElementById('paginacion');

// ======== Persistencia ========
function loadConfigListado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { umbral: 5, ordenar: 'nombre' };
    const parsed = JSON.parse(raw);
    return {
      umbral: Number.isFinite(+parsed.umbral) ? +parsed.umbral : 5,
      ordenar: typeof parsed.ordenar === 'string' ? parsed.ordenar : 'nombre',
    };
  } catch {
    return { umbral: 5, ordenar: 'nombre' };
  }
}

function saveConfigListado({ umbral, ordenar }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ umbral, ordenar }));
}

// ======== Flatten del inventario (igual idea que en stock.js) ========
function getFlatProductos() {
  const out = [];
  for (const dep of inventario) {
    for (const cat of dep.categorias) {
      for (const prod of cat.productos) {
        out.push({
          ...prod,
          _departamento: dep.departamento,
          _categoriaNombre: cat.nombre,
        });
      }
    }
  }
  return out;
}

// ======== Ordenamiento ========
function sortProductosByKey(items, key) {
  const map = {
    departamento: '_departamento',
    categoria: 'categoria' in (items[0] || {}) ? 'categoria' : '_categoriaNombre',
    nombre: 'nombre',
    cantidad: 'cantidad',
    unidad: 'unidad',
    precio: 'precio',
  };
  const realKey = map[key] || key;

  const clone = [...items];
  clone.sort((a, b) => {
    const va = a?.[realKey];
    const vb = b?.[realKey];

    if (typeof va === 'number' && typeof vb === 'number') {
      return va - vb;
    }
    return String(va ?? '').localeCompare(String(vb ?? ''), 'es', { sensitivity: 'base' });
  });
  return clone;
}

// ======== Pintar filas según umbral ========
function applyConfigListadoColors(umbral) {
  if (!tbodyProductos) return;

  for (const tr of tbodyProductos.rows) {
    tr.classList.remove('tr-alerta-low', 'tr-alerta-equal');

    const unidadesCell = tr.cells?.[5]; // 6ta columna
    if (!unidadesCell) continue;

    const oldBadge = unidadesCell.querySelector('.badge-stock');
    if (oldBadge) oldBadge.remove();

    const text = unidadesCell.textContent || '';
    const match = text.match(/-?\d+(\.\d+)?/);
    const qty = match ? parseFloat(match[0]) : NaN;

    if (!Number.isFinite(qty)) continue;

    if (qty < umbral) {
      tr.classList.add('tr-alerta-low');
      unidadesCell.insertAdjacentHTML(
        'beforeend',
        ` <span class="badge-stock badge-low">Bajo</span>`
      );
    } else if (qty === umbral) {
      tr.classList.add('tr-alerta-equal');
      unidadesCell.insertAdjacentHTML(
        'beforeend',
        ` <span class="badge-stock badge-equal">Umbral</span>`
      );
    }
  }
}

// ======== Observer para re-colorear ========
const mo = new MutationObserver(() => {
  const { umbral } = loadConfigListado();
  applyConfigListadoColors(umbral);
});
if (tbodyProductos) {
  mo.observe(tbodyProductos, { childList: true, subtree: false });
}

// ======== Envío de resultados ordenados a stock.js ========
function pushConfigListadoToTable(ordenar) {
  const flat = getFlatProductos();
  const ordenados = sortProductosByKey(flat, ordenar);
  document.dispatchEvent(new CustomEvent('search:results', { detail: { items: ordenados } }));
  markOrderedColumn(ordenar); // 👈 aquí
}

// ======== Submit del formulario ========
if (formConfigListado) {
  formConfigListado.addEventListener('submit', (e) => {
    e.preventDefault();

    const umbral = Math.max(0, parseInt(inputUmbralConfig.value, 10) || 0);
    const ordenar = inputOrdenarConfig.value || 'nombre';

    saveConfigListado({ umbral, ordenar });
    pushConfigListadoToTable(ordenar);

    alert('✅ Configuración de listado guardada. 💾');
  });
}

// ======== Marcar columna ordenada ========
function markOrderedColumn(ordenar) {
  // limpia todos los th
  document.querySelectorAll('thead th').forEach(th => {
    th.textContent = th.textContent.replace(/^🔽\s*/, ''); // quita el ícono previo
  });

  // mapea keys de config -> id del th
  const map = {
    nombre: 'th-nombre',
    departamento: 'th-departamento',
    categoria: 'th-categoria',
    cantidad: 'th-cantidad',
    unidad: 'th-cantidad', // si prefieres otra col para "unidad" cámbialo
    precio: 'th-precio',
  };

  const thId = map[ordenar];
  if (thId) {
    const th = document.getElementById(thId);
    if (th) th.textContent = `🔽 ${th.textContent}`;
  }
}

// ======== Init ========
document.addEventListener('DOMContentLoaded', () => {
  const { umbral, ordenar } = loadConfigListado();

  if (inputUmbralConfig) inputUmbralConfig.value = umbral;
  if (inputOrdenarConfig) inputOrdenarConfig.value = ordenar;

  pushConfigListadoToTable(ordenar);
  applyConfigListadoColors(umbral);

  if (paginacionProductos) {
    paginacionProductos.addEventListener('click', () => {
      setTimeout(() => applyConfigListadoColors(loadConfigListado().umbral), 0);
    });
  }
});
