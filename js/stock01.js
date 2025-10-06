// stock.js
import { inventario } from './stock-productos.js';
import { getDepartamentos, getCategorias, capitalize } from './helpers-inventario.js';

// ========================= Config de paginación =========================
const PAGE_SIZE = 10;
let currentPage = 1;

// ========================= Referencias a los campos =========================
const form = document.getElementById('product-form');
const nombreInput = document.getElementById('product-name');
const departamentoSelect = document.getElementById('product-department');
const categoriaSelect = document.getElementById('product-category');
const cantidadInput = document.getElementById('product-stock');
const unidadSelect = document.getElementById('product-unit');
const precioInput = document.getElementById('product-price');

// ========================= Poblar selects =========================
// Poblar departamentos al cargar
document.addEventListener('DOMContentLoaded', () => {
  const departamentos = getDepartamentos();

  departamentos.forEach(dep => {
    const option = document.createElement('option');
    option.value = dep;
    option.textContent = dep;
    departamentoSelect.appendChild(option);
  });
});

// Cuando el usuario selecciona un departamento → poblar categorías
departamentoSelect.addEventListener('change', () => {
  const categorias = getCategorias(capitalize(departamentoSelect.value));

  // Limpiar opciones previas
  categoriaSelect.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';

  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoriaSelect.appendChild(option);
  });
});

// ===================== Utils base sobre inventario =====================
function getFlatProducts() {
  const flat = [];
  for (const dep of inventario) {
    for (const cat of dep.categorias) {
      for (const prod of cat.productos) {
        flat.push({
          ...prod,
          _departamento: dep.departamento,
          _categoriaNombre: cat.nombre
        });
      }
    }
  }
  return flat;
}

// Busca un departamento por nombre
function findDepartamentoNode(nombreDepto) {
  return inventario.find(
    d => d.departamento.toLowerCase() === String(nombreDepto).toLowerCase()
  );
}

// Busca la categoría dentro de un departamento específico
function findCategoriaNode(nombreDepto, nombreCategoria) {
  const dep = findDepartamentoNode(nombreDepto);
  if (!dep) return null;
  const cat = dep.categorias.find(
    c => c.nombre.toLowerCase() === String(nombreCategoria).toLowerCase()
  );
  return cat ? { dep, cat } : null;
}

// ===================== Helpers para custom validity =====================
function clearValidity(...els) {
  els.forEach(el => el && el.setCustomValidity && el.setCustomValidity(''));
}

function isEmpty(value) {
  return value == null || String(value).trim() === '';
}

function isNegativeNumber(el) {
  const val = Number(el.value);
  return Number.isFinite(val) && val < 0;
}

// Verifica nombre duplicado en misma categoría del mismo departamento
function isDuplicateName(nombre, departamento, categoria) {
  const bucket = findCategoriaNode(departamento, categoria);
  if (!bucket) return false;
  const needle = String(nombre).toLowerCase();
  return bucket.cat.productos.some(
    p => String(p.nombre).toLowerCase() === needle
  );
}

// ===================== SKU automático =====================
const pad3 = n => String(n).padStart(3, '0');

function nextSkuForCategory(departamento, categoria) {
  const bucket = findCategoriaNode(departamento, categoria);
  if (!bucket) return '';
  const prefix = String(categoria).slice(0, 2).toUpperCase();
  let maxSeq = 0;

  for (const p of bucket.cat.productos) {
    const m = /^([A-Z]{2})-(\d{3})$/.exec(String(p.sku || ''));
    if (m && m[1] === prefix) {
      const n = parseInt(m[2], 10);
      if (!Number.isNaN(n) && n > maxSeq) maxSeq = n;
    }
  }
  return `${prefix}-${pad3(maxSeq + 1)}`;
}

// ===================== ID autoincremental =====================
function nextProductId() {
  const items = getFlatProducts();
  let maxId = 0;
  for (const p of items) {
    const idNum = Number(p.id);
    if (Number.isInteger(idNum) && idNum > maxId) {
      maxId = idNum;
    }
  }
  return maxId + 1;
}

// ===================== Alta de producto =====================
function addProductToInventario(data) {
  const bucket = findCategoriaNode(data.departamento, data.categoria);
  if (!bucket) {
    throw new Error(
      `La categoría "${data.categoria}" no existe en el departamento "${data.departamento}".`
    );
  }
  const id = nextProductId();                               // 👈 nuevo ID autoincremental
  const sku = nextSkuForCategory(data.departamento, data.categoria);
  const nuevo = { id, ...data, sku };
  bucket.cat.productos.push(nuevo);
  return nuevo;
}

// ============================ Submit del formulario ============================
form.addEventListener('submit', (e) => {
  e.preventDefault();

  clearValidity(
    nombreInput,
    departamentoSelect,
    categoriaSelect,
    cantidadInput,
    unidadSelect,
    precioInput
  );

  let valid = true;

  // Nombre
  if (isEmpty(nombreInput.value)) {
    nombreInput.setCustomValidity('El nombre es obligatorio.');
    valid = false;
  } else if (
    isDuplicateName(
      nombreInput.value,
      departamentoSelect.value,
      categoriaSelect.value
    )
  ) {
    nombreInput.setCustomValidity(
      'Ya existe un producto con ese nombre en esta categoría.'
    );
    valid = false;
  }

  // Departamento
  if (isEmpty(departamentoSelect.value)) {
    departamentoSelect.setCustomValidity('Selecciona un departamento.');
    valid = false;
  } else if (!findDepartamentoNode(departamentoSelect.value)) {
    departamentoSelect.setCustomValidity('El departamento no es válido.');
    valid = false;
  }

  // Categoría
  if (isEmpty(categoriaSelect.value)) {
    categoriaSelect.setCustomValidity('Selecciona una categoría.');
    valid = false;
  } else if (!findCategoriaNode(departamentoSelect.value, categoriaSelect.value)) {
    categoriaSelect.setCustomValidity(
      'La categoría no pertenece al departamento seleccionado.'
    );
    valid = false;
  }

  // Cantidad
  if (isEmpty(cantidadInput.value)) {
    cantidadInput.setCustomValidity('La cantidad es obligatoria.');
    valid = false;
  } else if (isNegativeNumber(cantidadInput)) {
    cantidadInput.setCustomValidity('La cantidad no puede ser negativa.');
    valid = false;
  }

  // Unidad
  if (isEmpty(unidadSelect.value)) {
    unidadSelect.setCustomValidity('Selecciona la unidad.');
    valid = false;
  }

  // Precio
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

  // Data
  const data = {
    nombre: nombreInput.value.trim(),
    departamento: departamentoSelect.value,
    categoria: categoriaSelect.value,
    cantidad: Number(cantidadInput.value),
    unidad: unidadSelect.value,
    precio: Number(precioInput.value)
  };

  try {
    const creado = addProductToInventario(data);
    alert(`Producto agregado ✅ (ID: ${creado.id}, SKU: ${creado.sku})`);
  } catch (err) {
    alert(err.message || 'Error al agregar producto.');
    return;
  }

  form.reset();
  renderProductsTable(currentPage);
});

// ============================ Render tabla con paginación ============================
const mxn = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2
});

function formatUnits(p) {
  const u = (p.unidad || '').toLowerCase();
  if (u === 'kilo') return `${p.cantidad} KG`;
  if (u === 'pieza') return `${p.cantidad} Pza`;
  if (u === 'litro') return `${p.cantidad} L`;
  return `${p.cantidad} ${p.unidad || ''}`.trim();
}

function getPagedItems(page = 1) {
  const items = getFlatProducts();
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

  tbody.innerHTML = '';

  pageItems.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" style="max-height:48px;"/>` : ''}</td>
      <td>${p.nombre}</td>
      <td>${p._departamento}</td>
      <td>${p.categoria}</td>
      <td>${p.sku || ''}</td>
      <td>${formatUnits(p)}</td>
      <td>${mxn.format(p.precio)}</td>
      <td> <button class="btn-edit"><img src="../img/stock/edit-icon.png"></button></td>
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

  ul.appendChild(makeLi('Previous', page - 1, page === 1, false, 'Previous'));

  const MAX_VISIBLE = 5;
  let start = Math.max(1, page - Math.floor(MAX_VISIBLE / 2));
  let end = Math.min(totalPages, start + MAX_VISIBLE - 1);
  if (end - start + 1 < MAX_VISIBLE) start = Math.max(1, end - MAX_VISIBLE + 1);

  if (start > 1) {
    ul.appendChild(makeLi('1', 1, false, page === 1));
    if (start > 2) {
      const dots = document.createElement('li');
      dots.className = 'page-item disabled';
      dots.innerHTML = `<span class="page-link">…</span>`;
      ul.appendChild(dots);
    }
  }

  for (let p = start; p <= end; p++) {
    ul.appendChild(makeLi(String(p), p, false, p === page));
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      const dots = document.createElement('li');
      dots.className = 'page-item disabled';
      dots.innerHTML = `<span class="page-link">…</span>`;
      ul.appendChild(dots);
    }
    ul.appendChild(makeLi(String(totalPages), totalPages, false, page === totalPages));
  }

  ul.appendChild(makeLi('Next', page + 1, page === totalPages, false, 'Next'));
}

function goToPage(page) {
  renderProductsTable(page);
}

// ============================ Inicializa ============================
// ============================ Inicializa ============================
document.addEventListener("DOMContentLoaded", () => {
  renderProductsTable(1);
  //============================= Agregar formulario de nuevo producto ============
  const btnShowForm = document.getElementById("btn-show-form");
  const productForm = document.getElementById("product-form");

  btnShowForm.addEventListener("click", () => {
    productForm.classList.remove("d-none"); // Muestra el formulario
  });

});
