// stock-surtido.js
// Módulo para "Surtido rápido" (agregar existencias a un producto)

import { inventario } from './stock-productos.js';

// ========================= Utilidades =========================
const normalize = (str) =>
  (str ?? '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();

const isPositiveInt = (n) => Number.isInteger(n) && n > 0;

// Extrae un número con pinta de SKU de un texto (e.g. "Zanahoria 12345" => "12345")
const extractSkuFromText = (txt) => {
  const m = (txt ?? '').match(/(\d{3,})$/); // 3+ dígitos al final
  return m ? m[1] : null;
};

// Guarda inventario en localStorage si ya lo usas
const persistIfAvailable = () => {
  try {
    if (localStorage.getItem('inventario')) {
      localStorage.setItem('inventario', JSON.stringify(inventario));
    }
  } catch (_) {
    // Ignorar si storage no está disponible
  }
};

// Renderiza alertas Bootstrap debajo del form
const ensureAlertHost = (form) => {
  let host = form.querySelector('[data-alert-host]');
  if (!host) {
    host = document.createElement('div');
    host.setAttribute('data-alert-host', 'true');
    host.className = 'mt-3';
    form.appendChild(host);
  }
  host.innerHTML = '';
  return host;
};

const showAlert = (form, type, message) => {
  const host = ensureAlertHost(form);
  const div = document.createElement('div');
  div.className = `alert alert-${type} mb-0`;
  div.role = 'alert';
  div.innerText = message;
  host.appendChild(div);
};

// --- helpers para navegar tu estructura anidada ---
const allProductosWithPath = () => {
  const out = [];
  (inventario ?? []).forEach((dep, deptIdx) => {
    (dep?.categorias ?? []).forEach((cat, catIdx) => {
      (cat?.productos ?? []).forEach((p, prodIdx) => {
        out.push({ p, path: { deptIdx, catIdx, prodIdx } });
      });
    });
  });
  return out;
};

const norm = (s) =>
  (s ?? '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();

const normSku = (s) => (s ?? '').toString().trim().toUpperCase();
const looksLikeSku = (txt) => /[A-Z]{1,5}-?\d{2,6}/i.test(txt);

// 🔁 Persistir SIEMPRE
const persistAlways = () => {
  try { localStorage.setItem('inventario', JSON.stringify(inventario)); } catch (_) {}
};

// --- Reemplaza tu findProducto por esta versión ---
const findProducto = (queryRaw) => {
  const qRaw = (queryRaw ?? '').trim();
  if (!qRaw) return { error: 'Ingresa el nombre o SKU del producto.' };

  const productos = allProductosWithPath();
  if (!productos.length) return { error: 'No hay productos cargados en inventario.' };

  // 1) SKU
  if (looksLikeSku(qRaw)) {
    const qSku = normSku(qRaw);
    const hit = productos.find(({ p }) => normSku(p.sku) === qSku);
    if (hit) return { producto: hit.p, via: 'sku', path: hit.path };
  }

  // 2) Nombre exacto
  const qName = norm(qRaw);
  const exact = productos.find(({ p }) => norm(p.nombre) === qName);
  if (exact) return { producto: exact.p, via: 'nombre-exacto', path: exact.path };

  // 3) Nombre parcial único
  const partial = productos.filter(({ p }) => norm(p.nombre).includes(qName));
  if (partial.length === 1) {
    return { producto: partial[0].p, via: 'nombre-parcial', path: partial[0].path };
  }
  if (partial.length > 1) {
    return { error: `Encontré ${partial.length} coincidencias. Especifica mejor o usa el SKU.` };
  }

  return { error: 'No se encontró el producto. Revisa el nombre o el SKU.' };
};

// ✅ Mutación por ruta, dentro del arreglo anidado
const surtirProducto = (path, delta) => {
  const { deptIdx, catIdx, prodIdx } = path;
  const nodo = inventario?.[deptIdx]?.categorias?.[catIdx]?.productos?.[prodIdx];
  if (!nodo) throw new Error('Ruta inválida al producto.');

  nodo.cantidad = (Number(nodo.cantidad) || 0) + delta;  // muta el objeto REAL en inventario
  persistAlways();

  // Evento para que otras partes se sincronicen
  window.dispatchEvent(
    new CustomEvent('inventario:updated', {
      detail: {
        action: 'surtido',
        delta,
        producto: { id: nodo.id, sku: nodo.sku, nombre: nodo.nombre, cantidad: nodo.cantidad },
        path,
      },
    }),
  );
};


// ========================= Inicialización =========================
export function initSurtidoRapido() {
  console.log('[surtido] inventario length:', inventario.length);
  console.log('[surtido] ejemplo:', inventario);

  const form = document.getElementById('boxSurtidoRapido');
  if (!form) return;

  const inputProducto = form.querySelector('#surtido-producto');
  const inputCantidad = form.querySelector('#surtido-cantidad');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const q = inputProducto.value;
    const cant = Math.floor(Number(inputCantidad.value));

    // Validaciones
    if (!isPositiveInt(cant)) {
      showAlert(form, 'warning', 'La cantidad debe ser un número entero positivo (min 1).');
      inputCantidad.focus();
      return;
    }

    submitBtn.disabled = true;

    try {
      const res = findProducto(q);
      if (res.error) {
        showAlert(form, 'danger', res.error);
        return;
      }

      const { producto, path } = res;

      // Debug opcional: antes
      console.log('[surtido][antes]', producto.nombre, '=>', producto.cantidad);

      // 🔁 Mutar por ruta (esto asegura que tocas el nodo REAL del inventario)
      surtirProducto(path, cant);

      // Después de mutar, lee el nodo de nuevo por ruta para el total actualizado
      const nodo = inventario[path.deptIdx].categorias[path.catIdx].productos[path.prodIdx];

      // Debug opcional: después
      console.log('[surtido][después]', nodo.nombre, '=>', nodo.cantidad);

      showAlert(
        form,
        'success',
        `Se surtieron ${cant} unidades de “${nodo.nombre}” (SKU: ${nodo.sku ?? '—'}). Nuevo total: ${nodo.cantidad}.`,
      );

      // Limpia inputs
      inputCantidad.value = '';
      inputProducto.value = '';
      inputProducto.focus();
    } catch (e) {
      console.error(e);
      showAlert(form, 'danger', 'Ocurrió un error al surtir. Intenta de nuevo.');
    } finally {
      submitBtn.disabled = false;
    }
  });
}


// Auto-init al cargar el DOM
document.addEventListener('DOMContentLoaded', initSurtidoRapido);
