// search.js
import { inventario } from './stock-productos.js';

const form = document.getElementById('form-busqueda');
const input = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-btn');
const meta = document.getElementById('search-meta');

// ---------- utils ----------
const norm = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

function flattenInventario() {
  const out = [];
  for (const dep of inventario) {
    for (const cat of dep.categorias) {
      for (const p of cat.productos) {
        out.push({
          ...p,
          _departamento: dep.departamento,
          _categoriaNombre: cat.nombre
        });
      }
    }
  }
  return out;
}

function allDepartamentos() {
  return inventario.map(d => d.departamento);
}

function allCategorias() {
  const set = new Set();
  for (const d of inventario) for (const c of d.categorias) set.add(c.nombre);
  return Array.from(set);
}

// ---------- búsqueda ----------
function search(queryRaw) {
  const q = norm(queryRaw);
  const items = flattenInventario();

  if (!q) return items; // vacío → todo

  // 1) SKU exacto o empieza con
  const skuExact = items.filter(p => norm(p.sku) === q);
  if (skuExact.length) return skuExact;

  const skuStarts = items.filter(p => norm(p.sku).startsWith(q));
  if (skuStarts.length) return skuStarts;

  // 2) Departamento exacto
  const deps = allDepartamentos();
  const depExact = deps.find(d => norm(d) === q);
  if (depExact) return items.filter(p => norm(p._departamento) === q);

  // 3) Categoría exacta (puede existir en varios deptos)
  const cats = allCategorias();
  const catExact = cats.find(c => norm(c) === q);
  if (catExact) return items.filter(p => norm(p._categoriaNombre) === q || norm(p.categoria) === q);

  // 4) Coincidencia por “contiene” en: nombre, sku, categoría, departamento
  const contains = items.filter(p => {
    const fields = [
      p.nombre,
      p.sku,
      p.categoria,
      p._categoriaNombre,
      p._departamento
    ].map(norm);
    return fields.some(f => f.includes(q));
  });

  return contains;
}

// ---------- wire-up ----------
function publishResults(list) {
  // actualiza meta (opcional)
  if (meta) {
    meta.textContent = `Resultados: ${list.length}`;
  }
  // emite evento para que stock.js pagine/rendere
  document.dispatchEvent(new CustomEvent('search:results', {
    detail: { items: list }
  }));
}

function doSearch() {
  const list = search(input.value);
  publishResults(list);
}

function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

const debouncedSearch = debounce(doSearch, 250);

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    doSearch();
  });
}
if (input) {
  input.addEventListener('input', debouncedSearch); // busca mientras escribe
}
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    input.value = '';
    doSearch(); // restablece a todos
    input.focus();
  });
}

// Primera carga: sin filtro
document.addEventListener('DOMContentLoaded', () => {
  publishResults(flattenInventario());
});
