// stock.js
import { products, addProduct, getProducts } from './stock-productos.js';

// ========================= Config de paginación =========================
const PAGE_SIZE = 10;
let currentPage = 1;

// ========================= Referencias a los campos =========================
const form = document.getElementById('form-producto');
const nombreInput = document.getElementById('nombre-producto');
const categoriaSelect = document.getElementById('categoria-producto');
const skuInput = document.getElementById('sku-producto');
const cantidadInput = document.getElementById('cantidad-producto');
const unidadSelect = document.getElementById('unidad-producto');
const precioInput = document.getElementById('precio-producto');

// ===================== Helpers para custom validity =====================
function clearValidity(...els) {
  els.forEach(el => el.setCustomValidity(''));
}

function isEmpty(value) {
  return value == null || String(value).trim() === '';
}

function isNegativeNumber(el) {
  const val = Number(el.value);
  return Number.isFinite(val) && val < 0;
}

function isDuplicateSKU(value) {
  return products.some(p => String(p.sku) === String(value));
}

function isDuplicateName(value) {
  return products.some(p => String(p.nombre).toLowerCase() === String(value).toLowerCase());
}

// ============================ Submit del formulario ============================
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Limpiar estados previos
  clearValidity(nombreInput, categoriaSelect, skuInput, cantidadInput, unidadSelect, precioInput);

  let valid = true;

  // Nombre: no vacío, no repetido
  if (isEmpty(nombreInput.value)) {
    nombreInput.setCustomValidity('El nombre es obligatorio.');
    valid = false;
  } else if (isDuplicateName(nombreInput.value)) {
    nombreInput.setCustomValidity('El nombre del producto ya existe. Debe ser único.');
    valid = false;
  }

  // Categoría: seleccionada
  if (isEmpty(categoriaSelect.value)) {
    categoriaSelect.setCustomValidity('Selecciona una categoría.');
    valid = false;
  }

  // SKU: no vacío y no repetido
  if (isEmpty(skuInput.value)) {
    skuInput.setCustomValidity('El SKU es obligatorio.');
    valid = false;
  } else if (isDuplicateSKU(skuInput.value)) {
    skuInput.setCustomValidity('El SKU ya existe. Debe ser único.');
    valid = false;
  }

  // Cantidad: no vacía y no negativa
  if (isEmpty(cantidadInput.value)) {
    cantidadInput.setCustomValidity('La cantidad es obligatoria.');
    valid = false;
  } else if (isNegativeNumber(cantidadInput)) {
    cantidadInput.setCustomValidity('La cantidad no puede ser negativa.');
    valid = false;
  }

  // Unidad: seleccionada
  if (isEmpty(unidadSelect.value)) {
    unidadSelect.setCustomValidity('Selecciona la unidad.');
    valid = false;
  }

  // Precio: no vacío y no negativo
  if (isEmpty(precioInput.value)) {
    precioInput.setCustomValidity('El precio es obligatorio.');
    valid = false;
  } else if (isNegativeNumber(precioInput)) {
    precioInput.setCustomValidity('El precio no puede ser negativo.');
    valid = false;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = {
    nombre: nombreInput.value.trim(),
    categoria: categoriaSelect.value,
    sku: String(skuInput.value).trim(),
    cantidad: Number(cantidadInput.value),
    unidad: unidadSelect.value,
    precio: Number(precioInput.value)
  };

  const creado = addProduct ? addProduct(data) : (products.push({ ...data, id: Date.now() }), data);

  alert(`Producto agregado ✅ (ID: ${creado.id})`);
  console.log(products);
  form.reset();

  // Re-render manteniendo página actual (o salta a la última; descomenta si prefieres):
  // const { totalPages } = getPagedItems(currentPage);
  // goToPage(totalPages);
  renderProductsTable(currentPage);
});

// ============================ Cargar datos del stock ============================

// Utilidad para formatear moneda MXN
const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });

// Mapea la unidad a cómo la quieres mostrar en la tabla
function formatUnits(p) {
  const u = (p.unidad || '').toLowerCase();
  if (u === 'kilo') return `${p.cantidad} KG`;
  if (u === 'pieza') return `${p.cantidad} Pza`;
  if (u === 'litro') return `${p.cantidad} L`;
  return `${p.cantidad} ${p.unidad || ''}`.trim();
}

// =============== Paginación ===============
function getPagedItems(page = 1) {
  const items = getProducts ? getProducts() : products; // si no usas getProducts, usa products
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return {
    items,
    pageItems: items.slice(start, end),
    total,
    totalPages,
    page: safePage
  };
}

function renderProductsTable(page = 1) {
  const tbody = document.getElementById('tbody-productos');
  if (!tbody) return;

  const { pageItems, totalPages, page: safePage } = getPagedItems(page);
  currentPage = safePage;

  // Limpia el cuerpo de la tabla
  tbody.innerHTML = '';

  // Crea filas
  pageItems.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><!-- imagen --></td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>${p.sku}</td>
      <td>${formatUnits(p)}</td>
      <td>${mxn.format(p.precio)}</td>
    `;
    tbody.appendChild(tr);
  });

  renderPagination(totalPages, safePage);
}

function renderPagination(totalPages, page) {
  const ul = document.getElementById('paginacion');
  if (!ul) return;

  ul.innerHTML = '';

  const makeLi = (label, targetPage, disabled = false, active = false, ariaLabel = null) => {
    const liEl = document.createElement('li');
    liEl.className = `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`;

    const aEl = document.createElement('a');
    aEl.className = 'page-link';
    aEl.href = '#';
    aEl.textContent = label;
    if (ariaLabel) aEl.setAttribute('aria-label', ariaLabel);

    aEl.addEventListener('click', (e) => {
      e.preventDefault();
      if (!disabled && targetPage !== page) goToPage(targetPage);
    });

    liEl.appendChild(aEl);
    return liEl;
  };

  // Previous
  ul.appendChild(makeLi('Previous', page - 1, page === 1, false, 'Previous'));

  // Ventana de páginas (máx 5 visibles)
  const MAX_VISIBLE = 5;
  let start = Math.max(1, page - Math.floor(MAX_VISIBLE / 2));
  let end = Math.min(totalPages, start + MAX_VISIBLE - 1);
  if (end - start + 1 < MAX_VISIBLE) start = Math.max(1, end - MAX_VISIBLE + 1);

  // Inicio con "1" + …
  if (start > 1) {
    ul.appendChild(makeLi('1', 1, false, page === 1));
    if (start > 2) {
      const dots = document.createElement('li');
      dots.className = 'page-item disabled';
      dots.innerHTML = `<span class="page-link">…</span>`;
      ul.appendChild(dots);
    }
  }

  // Rango central
  for (let p = start; p <= end; p++) {
    ul.appendChild(makeLi(String(p), p, false, p === page));
  }

  // … + última
  if (end < totalPages) {
    if (end < totalPages - 1) {
      const dots = document.createElement('li');
      dots.className = 'page-item disabled';
      dots.innerHTML = `<span class="page-link">…</span>`;
      ul.appendChild(dots);
    }
    ul.appendChild(makeLi(String(totalPages), totalPages, false, page === totalPages));
  }

  // Next
  ul.appendChild(makeLi('Next', page + 1, page === totalPages, false, 'Next'));
}

function goToPage(page) {
  renderProductsTable(page);
}

// ============================ Inicializa ============================
document.addEventListener('DOMContentLoaded', () => {
  renderProductsTable(1);
});
