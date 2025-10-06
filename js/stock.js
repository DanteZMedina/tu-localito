// stock.js
import { inventario, findProductById } from './stock-productos.js';
import { getDepartamentos, getCategorias, capitalize } from './helpers-inventario.js';

// --- SINCRONIZAR INVENTARIO DESDE LOCALSTORAGE ---
function syncInventarioFromStorage() {
  try {
    const raw = localStorage.getItem('inventario');
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return;
    // MUY IMPORTANTE: mutar (no reasignar) para conservar la referencia exportada
    inventario.splice(0, inventario.length, ...data);
  } catch (_) { }
}

// ========================= Config de paginación =========================
const PAGE_SIZE = 10;
let currentPage = 1;

// ⬇️ NUEVO: lista "externa" que llega desde el buscador (o null = usar todo)
let externalItems = null;

// ========================= Referencias a los campos =========================
const form = document.getElementById('form-producto');
const nombreInput = document.getElementById('nombre-producto');
const departamentoSelect = document.getElementById('departamento-producto');
const categoriaSelect = document.getElementById('categoria-producto');
const cantidadInput = document.getElementById('cantidad-producto');
const unidadSelect = document.getElementById('unidad-producto');
const precioInput = document.getElementById('precio-producto');

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
  const id = nextProductId();                               // 👈 ID autoincremental
  const sku = nextSkuForCategory(data.departamento, data.categoria);
  const nuevo = { id, ...data, sku };
  bucket.cat.productos.push(nuevo);
  return nuevo;
}

// ============================ Submit del formulario agregar producto ============================
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
    saveInventarioToStorage();
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

// ⬇️ CAMBIO: usar resultados de búsqueda (externalItems) si existen
function getPagedItems(page = 1) {
  // 1) Fuente: resultados de búsqueda activos o inventario plano
  const base = externalItems ?? getFlatProducts();

  // 2) Leer config guardada y aplicar orden SIEMPRE
  const { ordenar } = loadConfigListado();
  const items = sortByConfigKey(base, ordenar);

  // 3) Paginar
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
    page: safePage,
  };
}


function renderProductsTable(page = 1) {
  const tbody = document.getElementById('tbody-productos');
  const listaMobile = document.getElementById('lista-productos-mobile');
  if (!tbody || !listaMobile) return;

  const { pageItems, totalPages, page: safePage } = getPagedItems(page);
  currentPage = safePage;

  // Desktop
  tbody.innerHTML = '';
  pageItems.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" class="img-thumbnail" style="max-height:60px;">` : ''}</td>
      <td>${p.nombre}</td>
      <td>${p._departamento}</td>
      <td>${p.categoria}</td>
      <td>${p.sku || ''}</td>
      <td>${formatUnits(p)}</td>
      <td>${mxn.format(p.precio)}</td>
      <td class="text-center">${accionesDropdownHTML(p.id)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Mobile
  listaMobile.innerHTML = '';
  const umbralMobile = loadUmbralStock();

  pageItems.forEach(p => {
    const qty = Number(p.cantidad) || 0;
    const badge = buildStockBadge(qty, umbralMobile);

    // decidir color de card según umbral
    let alertaClass = '';
    if (umbralMobile > 0) {
      if (qty < umbralMobile) alertaClass = 'card-alerta-low';
      else if (qty === umbralMobile) alertaClass = 'card-alerta-equal';
    }

    const card = document.createElement('div');
    card.className = 'col-12';
    card.innerHTML = `
    <div class="card shadow border rounded-3 ${alertaClass}">
      <div class="card-body d-flex align-items-center">
        <img src="${p.imagen || '../img/placeholder.png'}"
             alt="${p.nombre}"
             class="img-fluid rounded me-3"
             style="width:70px;height:70px;object-fit:cover;">

        <div class="flex-grow-1">
          <h6 class="fw-semibold mb-1">${p.nombre}</h6>
          <p class="mb-1 text-muted small">
            ${formatUnits(p)} ${badge}
          </p>
          <p class="mb-0 fw-bold text-success">${mxn.format(p.precio)}</p>
        </div>

        <div class="ms-auto">
          ${accionesDropdownHTML(p.id)}
        </div>
      </div>
    </div>
  `;
    listaMobile.appendChild(card);
  });

  renderPagination(totalPages, safePage);
}


// =========== Dropdown acciones (editar, eliminar) ============================
function accionesDropdownHTML(idProducto) {
  return `
    <div class="dropdown">
      <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button"
              data-bs-toggle="dropdown" aria-expanded="false">
        Acciones
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <button class="dropdown-item btn-editar" type="button" data-id="${idProducto}">
            Editar
          </button>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <button class="dropdown-item text-danger btn-eliminar" type="button" data-id="${idProducto}">
            Eliminar
          </button>
        </li>
      </ul>
    </div>
  `;
}

// Delegación de eventos para botones editar/eliminar
const modalEditarEl = document.getElementById('modalEditarProducto');
const modalEditar = new bootstrap.Modal(modalEditarEl);

// Delegación global: funciona en tabla (desktop) y cards (mobile)
document.addEventListener('click', (e) => {
  const editar = e.target.closest('.btn-editar');
  const eliminar = e.target.closest('.btn-eliminar');

  if (editar) {
    const id = editar.dataset.id;
    // Cierra el dropdown si sigue abierto
    editar.closest('.dropdown')?.querySelector('.dropdown-toggle')?.dispatchEvent(new Event('click'));
    abrirModalEdicion(id);
  }

  if (eliminar) {
    const id = eliminar.dataset.id;
    eliminar.closest('.dropdown')?.querySelector('.dropdown-toggle')?.dispatchEvent(new Event('click'));
    confirmarEliminarProducto(id);
  }
});


// =========== Modal edición de producto ============================
function fillEditDepartamentosSelect() {
  const sel = document.getElementById('edit-departamento');
  sel.innerHTML = '<option value="" disabled selected>Selecciona un departamento</option>';
  getDepartamentos().forEach(dep => {
    const op = document.createElement('option');
    op.value = dep;
    op.textContent = dep;
    sel.appendChild(op);
  });
}

function fillEditCategoriasSelect(depValue, selected = '') {
  const sel = document.getElementById('edit-categoria');
  sel.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
  if (!depValue) return;
  const cats = getCategorias(capitalize(depValue));
  cats.forEach(cat => {
    const op = document.createElement('option');
    op.value = cat;
    op.textContent = cat;
    if (cat === selected) op.selected = true;
    sel.appendChild(op);
  });
}

function abrirModalEdicion(id) {
  const found = findProductById(id);
  if (!found) return;

  const { producto, dep, cat } = found;

  // Poblar selects
  fillEditDepartamentosSelect();
  document.getElementById('edit-departamento').value = dep.departamento;
  fillEditCategoriasSelect(dep.departamento, cat.nombre);

  // Llenar campos
  document.getElementById('edit-id').value = producto.id;
  document.getElementById('edit-nombre').value = producto.nombre || '';
  document.getElementById('edit-unidad').value = producto.unidad || '';
  document.getElementById('edit-cantidad').value = Number(producto.cantidad ?? 0);
  document.getElementById('edit-precio').value = Number(producto.precio ?? 0);

  modalEditar.show();
}

// Dependencia depto → categorías dentro del modal
document.getElementById('edit-departamento').addEventListener('change', (e) => {
  fillEditCategoriasSelect(e.target.value, '');
});

// Guardar cambios (Acutalizar producto)
document.getElementById('form-editar-producto').addEventListener('submit', (e) => {
  e.preventDefault();

  const id = document.getElementById('edit-id').value;
  const nombre = document.getElementById('edit-nombre').value.trim();
  const unidad = document.getElementById('edit-unidad').value;
  const departamento = document.getElementById('edit-departamento').value;
  const categoria = document.getElementById('edit-categoria').value;
  const cantidad = Number(document.getElementById('edit-cantidad').value);
  const precio = Number(document.getElementById('edit-precio').value);

  if (!nombre || !unidad || !departamento || !categoria || cantidad < 0 || precio < 0) {
    // podrías usar reportValidity si añades validity a cada input
    alert('Revisa los campos del formulario.');
    return;
  }

  const found = findProductById(id);
  if (!found) return;

  const { dep, cat, idx, producto } = found;

  const sameDep = dep.departamento === departamento;
  const sameCat = cat.nombre === categoria;

  if (sameDep && sameCat) {
    // Actualiza en su lugar
    cat.productos[idx] = { ...producto, nombre, unidad, cantidad, precio };
  } else {
    // Mover de bucket
    cat.productos.splice(idx, 1);

    const targetDep = findDepartamentoNode(departamento);
    if (!targetDep) {
      alert('Departamento destino no encontrado.');
      return;
    }
    let targetCat = targetDep.categorias.find(c => c.nombre === categoria);
    if (!targetCat) {
      targetCat = { nombre: categoria, productos: [] };
      targetDep.categorias.push(targetCat);
    }
    // Mantener id y sku existentes
    targetCat.productos.push({ ...producto, nombre, unidad, cantidad, precio });
  }

  saveInventarioToStorage();
  modalEditar.hide();
  // Mantén página actual y orden/filters
  renderProductsTable(currentPage);
});

// Eliminar con confirmación
function confirmarEliminarProducto(id) {
  if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;

  const found = findProductById(id);
  if (!found) return;

  const { cat, idx } = found;
  cat.productos.splice(idx, 1);

  saveInventarioToStorage();
  renderProductsTable(currentPage);
}

// ========== Paginación ============
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

// ======== Integración con "Configuración de listado" ========
const CONFIG_STORAGE_KEY = 'configListadoSettings';

function loadConfigListado() {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return { ordenar: 'nombre' };
    const parsed = JSON.parse(raw);
    return { ordenar: typeof parsed.ordenar === 'string' ? parsed.ordenar : 'nombre' };
  } catch {
    return { ordenar: 'nombre' };
  }
}

// Mapea claves visibles -> propiedades reales de los objetos (flat)
function sortByConfigKey(items, key) {
  if (!Array.isArray(items) || items.length === 0) return items;

  const map = {
    departamento: '_departamento',
    categoria: 'categoria' in items[0] ? 'categoria' : '_categoriaNombre',
    nombre: 'nombre',
    cantidad: 'cantidad',
    unidad: 'unidad',
    precio: 'precio',
  };
  const realKey = map[key] || key;

  const arr = [...items];
  arr.sort((a, b) => {
    const va = a?.[realKey];
    const vb = b?.[realKey];
    if (typeof va === 'number' && typeof vb === 'number') return va - vb;
    return String(va ?? '').localeCompare(String(vb ?? ''), 'es', { sensitivity: 'base' });
  });
  return arr;
}

// ⬇️ Re-ordenar los resultados de búsqueda según la configuración guardada
document.addEventListener('search:results', (e) => {
  const rawItems = Array.isArray(e.detail?.items) ? e.detail.items : null;
  if (!rawItems) {
    externalItems = null;
    renderProductsTable(1);
    return;
  }

  const { ordenar } = loadConfigListado();
  const sorted = sortByConfigKey(rawItems, ordenar);
  externalItems = sorted;
  renderProductsTable(1); // siempre volvemos a la página 1 tras una búsqueda
});


// ============================ Inventario localStorage  ============================
// --- GUARDAR INVENTARIO EN LOCALSTORAGE ---
function saveInventarioToStorage() {
  try {
    localStorage.setItem('inventario', JSON.stringify(inventario));
    // Dispara un evento global (opcional) para que otros módulos se actualicen
    window.dispatchEvent(new Event('inventario:updated'));
  } catch (err) {
    console.error('Error al guardar inventario en localStorage:', err);
  }
}

// --- SIEMBRA INVENTARIO EN LOCALSTORAGE SI NO EXISTE ---
function ensureInventarioInStorage() {
  try {
    const raw = localStorage.getItem('inventario');
    if (!raw) {
      // Guarda el inventario base del módulo stock-productos.js
      localStorage.setItem('inventario', JSON.stringify(inventario));
    }
  } catch (err) {
    console.error('No se pudo inicializar inventario en localStorage:', err);
  }
}

// ============================ Badges(alerta de stock) para mobile ============================
// Lee el umbral guardado (o toma el del input si existe)
function loadUmbralStock() {
  try {
    const raw = localStorage.getItem('configListadoSettings');
    if (raw) {
      const cfg = JSON.parse(raw);
      if (cfg && Number.isFinite(cfg.umbral)) return Number(cfg.umbral);
    }
  } catch (_) { }
  const el = document.getElementById('input-umbral');
  const v = el ? Number(el.value) : NaN;
  return Number.isFinite(v) ? v : 0; // 0 = sin alertas
}

// Devuelve el badge según cantidad vs umbral
function buildStockBadge(cantidad, umbral) {
  const qty = Number(cantidad) || 0;
  if (!Number.isFinite(umbral) || umbral <= 0) return '';
  if (qty < umbral) return `<span class="badge-stock badge-low">Bajo</span>`;
  if (qty === umbral) return `<span class="badge-stock badge-equal">Al límite</span>`;
  return '';
}


// ============================ Inicializa ============================
document.addEventListener('DOMContentLoaded', () => {
  syncInventarioFromStorage();
  renderProductsTable(1);
});

// Re-lee storage (por si el otro módulo persistió) y re-renderiza la tabla
window.addEventListener('inventario:updated', (e) => {
  // Si quieres conservar la página actual:
  const page = currentPage;

  // Si guardas inventario en localStorage, vuelve a sincronizar:
  syncInventarioFromStorage?.();

  // Si tienes resultados de búsqueda activos y quieres mantenerlos, quita esta línea.
  // Si prefieres ver todo de nuevo, déjala:
  externalItems = null;

  renderProductsTable(page);
});
