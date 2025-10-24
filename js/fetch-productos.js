// fetch-productos.js
// 100.24.238.243
// const API_BASE = 'http://localhost:8081';
const API_BASE = 'http://100.24.238.243:8080';
const PLACEHOLDER_IMG = '../img/Catalogo/default.jpg';

// ===== CACHES EN MEMORIA =====
let _productosFlat = [];     // [{ id, nombre, categoria, departamento, sku, cantidad, unidad, precio, imagen }]
let _inventario = [];        // [{ departamento, categorias: [{ nombre, productos: [...] }] }]

// ====== FETCH CRUDO ======
async function fetchProductsAPI() {
  const url = `${API_BASE}/products`;
  console.log('[fetch-productos] GET', url);

  const res = await fetch(
    url, {
    method: 'GET',
    mode: 'cors',
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error ${res.status} en /products: ${text || res.statusText}`);
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error('[fetch-productos] JSON inválido:', e);
    throw e;
  }

  console.log('[fetch-productos] recibidos', Array.isArray(data) ? data.length : 0, 'items');
  console.log(data);

  return data;
}

// ====== MAPEO A PLANO QUE USA CATALOGO ======
function mapToFlat(products) {
  return (products || []).map(p => ({
    id: p.id,
    nombre: p.productName ?? p.nombre ?? 'Producto',
    categoria: p?.category?.categoryName ?? 'Sin categoria',
    departamento: p?.category?.department?.departmentName ?? 'Sin departamento',
    sku: p.sku ?? '',
    cantidad: Number(p.quantity ?? 0),
    unidad: p.unitOfMeasure ?? '',
    precio: Number(p.price ?? 0),
    imagen: p.imagen || PLACEHOLDER_IMG,
  }));
}

// ====== AGRUPAR A INVENTARIO (para Stock) ======
function buildInventario(flat) {
  const depMap = new Map();
  for (const p of flat || []) {
    const dep = p.departamento ?? 'Sin departamento';
    const cat = p.categoria ?? 'Sin categoria';

    if (!depMap.has(dep)) depMap.set(dep, new Map());
    const catMap = depMap.get(dep);
    if (!catMap.has(cat)) catMap.set(cat, { nombre: cat, productos: [] });

    catMap.get(cat).productos.push({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      sku: p.sku,
      cantidad: p.cantidad,
      unidad: p.unidad,
      precio: p.precio,
      imagen: p.imagen,
    });
  }

  const inventario = [];
  for (const [dep, catMap] of depMap.entries()) {
    inventario.push({
      departamento: dep,
      categorias: Array.from(catMap.values()),
    });
  }
  return inventario;
}

// ====== API PUBLICA ======

/**
 * Carga productos desde backend y llena los caches (flat + inventario).
 * Dispara el evento global "productos:updated".
 * @returns {{flat: Array, inventario: Array}}
 */
export async function loadProductos() {
  const raw = await fetchProductsAPI();
  _productosFlat = mapToFlat(raw);
  _inventario = buildInventario(_productosFlat);

  // Notifica a quien escuche
  try { window.dispatchEvent(new CustomEvent('productos:updated')); } catch { }
  return { flat: _productosFlat, inventario: _inventario };
}

/** Devuelve el cache plano (si aún no has llamado loadProductos, estará vacío) */
export function getProductosFlat() {
  return _productosFlat.slice();
}

/** Devuelve el cache anidado (si aún no has llamado loadProductos, estará vacío) */
export function getInventario() {
  // copia superficial
  return _inventario.map(d => ({
    departamento: d.departamento,
    categorias: d.categorias.map(c => ({ nombre: c.nombre, productos: c.productos.slice() }))
  }));
}
