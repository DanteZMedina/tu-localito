import { inventario } from './stock-productos.js';

// ===============================
// 🔹 1. Aplanar inventario
// ===============================
function flattenInventario(inventario) {
  const allProducts = [];
  inventario.forEach(dep => {
    dep.categorias.forEach(cat => {
      cat.productos.forEach(prod => {
        allProducts.push({
          ...prod,
          departamento: dep.departamento,
          categoria: cat.nombre
        });
      });
    });
  });
  return allProducts;
}

const allProducts = flattenInventario(inventario);

// ===============================
// 🔸 Carrito (persistencia)
// ===============================
const CART_KEY = 'tl_cart_v1';

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const cartObj = {};
    stored.forEach(item => {
      cartObj[item.id] = item.cantidadSeleccionada;
    });
    return cartObj;
  } catch {
    return {};
  }
}

function saveCart(cartObj) {
  const cartArray = Object.entries(cartObj)
    .filter(([_, cantidad]) => cantidad > 0)
    .map(([id, cantidad]) => {
      const prod = allProducts.find(p => String(p.id) === String(id));
      if (!prod) return null;
      return {
        ...prod,
        cantidadSeleccionada: cantidad
      };
    })
    .filter(Boolean);

  localStorage.setItem(CART_KEY, JSON.stringify(cartArray));
}

function getCartTotalItems(cartObj) {
  return Object.values(cartObj).reduce((acc, n) => acc + Number(n || 0), 0);
}

function toggleCartTriggers(enabled) {
  ['#carrito-btn-mobile', '#carrito-btn-desktop'].forEach(sel => {
    const btn = document.querySelector(sel);
    if (!btn) return;

    if (enabled) {
      btn.classList.remove('disabled');
      btn.removeAttribute('aria-disabled');
      btn.style.pointerEvents = '';
      btn.setAttribute('data-bs-toggle', 'modal');
      btn.setAttribute('data-bs-target', '#carritoModal');
      btn.removeAttribute('tabindex');
      btn.title = '';
    } else {
      btn.classList.add('disabled');
      btn.setAttribute('aria-disabled', 'true');
      btn.style.pointerEvents = 'none';
      btn.removeAttribute('data-bs-toggle');
      btn.removeAttribute('data-bs-target');
      btn.setAttribute('tabindex', '-1');
      btn.title = 'Carrito vacío';
    }
  });
}

function updateCartBadges(cartObj) {
  const total = getCartTotalItems(cartObj);
  const display = total > 9 ? '9+' : String(total);
  ['carrito-count-mobile', 'carrito-count-desktop'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = display;
  });
  toggleCartTriggers(total > 0);
}



// ===============================
// 🔹 2. Variables globales
// ===============================
let currentPage = 1;
const itemsPerPage = 10;
let cart = loadCart();
let currentProducts = allProducts.slice();

// ===============================
// 🔹 3. Renderizar productos
// ===============================
function renderProducts(products = currentProducts) {
  currentProducts = products;

  const container = document.getElementById("contenedor-productos");
  if (!container) {
    console.error("No existe el contenedor de productos (#contenedor-productos)");
    return;
  }
  container.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  paginatedProducts.forEach(prod => {
    const col = document.createElement("div");
    col.classList.add(
      "col",
      "producto-card",
      (prod.departamento || "").replace(/\s+/g, "-").toLowerCase(),
      (prod.categoria || "").replace(/\s+/g, "-").toLowerCase()
    );

    const prodId = productDomId(prod);

    col.innerHTML = `
      <div class="card h-100 text-center shadow-sm">
        <img src="${prod.imagen || '../img/Catalogo/default.jpg'}" class="card-img-top category-img" alt="${prod.nombre || ''}">
        <div class="card-body">
          <h5 class="card-title">${prod.nombre || ''}</h5>
          <p class="card-text"><strong>Precio:</strong> $${Number(prod.precio || 0).toFixed(2)} / ${prod.unidad || ''}</p>
        </div>
        <div class="d-flex justify-content-center align-items-center gap-2">
          <button class="btn btn-sm btn-outline-danger rounded-circle minus-btn" data-id="${prodId}">-</button>
          <span class="counter-badge" data-id="${prodId}">0</span>
          <button class="btn btn-sm btn-outline-success rounded-circle plus-btn" data-id="${prodId}">+</button>
        </div>
      </div>
    `;

    cart[prodId] = cart[prodId] || 0;

    const counterBadge = col.querySelector(`.counter-badge[data-id="${prodId}"]`);
    const plusBtn = col.querySelector(`.plus-btn[data-id="${prodId}"]`);
    const minusBtn = col.querySelector(`.minus-btn[data-id="${prodId}"]`);

    counterBadge.textContent = cart[prodId] || 0;

    plusBtn.addEventListener("click", e => {
      e.preventDefault();
      cart[prodId] = (cart[prodId] || 0) + 1;
      counterBadge.textContent = cart[prodId];
      saveCart(cart);
      updateCartBadges(cart);
      refreshCartIfOpen();
    });

    minusBtn.addEventListener("click", e => {
      e.preventDefault();
      const current = cart[prodId] || 0;
      if (current > 0) {
        cart[prodId] = current - 1;
        counterBadge.textContent = cart[prodId] || 0;
        saveCart(cart);
        updateCartBadges(cart);
        refreshCartIfOpen();
      }
    });

    container.appendChild(col);
  });

  renderPagination(products.length);
}

// ===============================
// 🔹 4. Renderizar paginación con puntos suspensivos
// ===============================
function renderPagination(totalItems) {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const prevItem = document.createElement("li");
  prevItem.className = "page-item" + (currentPage === 1 ? " disabled" : "");
  prevItem.innerHTML = `<a class="page-link" href="#">Previous</a>`;
  prevItem.addEventListener("click", e => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
    }
  });
  paginationContainer.appendChild(prevItem);

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) endPage = Math.min(totalPages, maxVisible);
  else if (currentPage >= totalPages - 2) startPage = Math.max(1, totalPages - (maxVisible - 1));

  if (startPage > 1) {
    addPageItem(1, paginationContainer);
    if (startPage > 2) {
      const dots = document.createElement("li");
      dots.className = "page-item disabled";
      dots.innerHTML = `<span class="page-link">...</span>`;
      paginationContainer.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    addPageItem(i, paginationContainer);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("li");
      dots.className = "page-item disabled";
      dots.innerHTML = `<span class="page-link">...</span>`;
      paginationContainer.appendChild(dots);
    }
    addPageItem(totalPages, paginationContainer);
  }

  const nextItem = document.createElement("li");
  nextItem.className = "page-item" + (currentPage === totalPages ? " disabled" : "");
  nextItem.innerHTML = `<a class="page-link" href="#">Next</a>`;
  nextItem.addEventListener("click", e => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
    }
  });
  paginationContainer.appendChild(nextItem);
}

// ===============================
// 🔹 5. Helper crear botón de página
// ===============================
function addPageItem(page, container) {
  const li = document.createElement("li");
  li.className = "page-item" + (page === currentPage ? " active" : "");
  li.innerHTML = `<a class="page-link" href="#">${page}</a>`;
  li.addEventListener("click", e => {
    e.preventDefault();
    if (page !== currentPage) {
      currentPage = page;
      renderProducts();
    }
  });
  container.appendChild(li);
}



// ===============================
// 🔹 6. Categorías (sidebar + mobile dropdown)
// ===============================
const listaCategoriasEl = document.getElementById('lista-categorias');
const listaCategoriasMobileEl = document.getElementById('lista-categorias-mobile');

function getCategoriaEmoji(categoria) {
  const emojis = {
    "Frutas": "🍎",
    "Verduras": "🥕",
    "Carnes Frías": "🍖",
    "Granel": "⚖️",
    "Lácteos": "🧀",
    "Bebidas": "🥤",
    "Limpieza": "🧼",
    "Mascotas": "🐾",
    "Abarrotes": "🥫",
    "Cuidado Personal": "🧴",
    "Enlatados": "🥫",
    "Basicos": "🥐",
    "Jabón": "🧼",
    "Detergentes": "🫧",
    "Shampoo": "🧴",
    "Papel de baño": "🧻",
    "Toallas femeninas": "🩲",
    "Desodorante": "🐿️",
    "Croquetas": "🐶",
    "Juguetes": "🧸",
    "Accesorios": "🐕‍🦺"
  };
  return emojis[categoria] || "🛒";
}

// ===============================
// 🛒 Helpers carrito
// ===============================
function productDomId(prod) {
  return prod.id ?? `${(prod.departamento || "").replace(/\s+/g, "-")}-${(prod.categoria || "").replace(/\s+/g, "-")}-${(prod.nombre || "").replace(/\s+/g, "-")}`.toLowerCase();
}

function renderizarCategoriasDinamico() {
  const categorias = ['Todos', ...new Set(allProducts.map(p => p.categoria))];
  listaCategoriasEl.innerHTML = '';
  if (listaCategoriasMobileEl) listaCategoriasMobileEl.innerHTML = '';

  categorias.forEach(cat => {
    // Sidebar
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = cat === 'Todos' ? '🛒 Todos' : `${getCategoriaEmoji(cat)} ${cat}`;
    a.dataset.cat = cat; // ⭐ data-cat para comparar sin emojis
    a.classList.toggle('active', cat === 'Todos');
    a.addEventListener('click', e => {
      e.preventDefault();
      filtrarPorCategoria(cat, a);
    });
    li.appendChild(a);
    listaCategoriasEl.appendChild(li);

    // Dropdown (mobile)
    if (listaCategoriasMobileEl) {
      const liMobile = document.createElement('li');
      const aMobile = document.createElement('a');
      aMobile.href = '#';
      aMobile.classList.add('dropdown-item');
      aMobile.textContent = cat === 'Todos' ? '🛒 Todos' : `${getCategoriaEmoji(cat)} ${cat}`;
      aMobile.dataset.cat = cat; // ⭐ también aquí
      aMobile.addEventListener('click', e => {
        e.preventDefault();
        filtrarPorCategoria(cat, aMobile);
      });
      liMobile.appendChild(aMobile);
      listaCategoriasMobileEl.appendChild(liMobile);
    }
  });
}

// ⭐ Versión basada en data-cat (sin depender del texto con emojis)
function filtrarPorCategoria(categoria, elemento) {
  // Quitar active en ambas listas
  document.querySelectorAll('#lista-categorias a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('#lista-categorias-mobile a').forEach(a => a.classList.remove('active'));

  if (elemento) {
    // Marca solo el link clicado
    elemento.classList.add('active');
    // y marca su "par" en la otra lista usando data-cat
    const cat = elemento.dataset.cat;
    document.querySelectorAll('#lista-categorias a, #lista-categorias-mobile a').forEach(a => {
      if (a !== elemento && a.dataset.cat === cat) a.classList.add('active');
    });
  } else {
    // Modo programático: marca ambos por data-cat
    document.querySelectorAll('#lista-categorias a, #lista-categorias-mobile a').forEach(a => {
      if ((categoria === 'Todos' && a.dataset.cat === 'Todos') || a.dataset.cat === categoria) {
        a.classList.add('active');
      }
    });
  }

  // Filtrado de productos
  const productosFiltrados = categoria === 'Todos'
    ? allProducts
    : allProducts.filter(p => p.categoria === categoria);

  currentPage = 1;
  renderProducts(productosFiltrados);
}

function vaciarCarrito() {
  localStorage.setItem(CART_KEY, JSON.stringify([]));
  cart = {};
  updateCartBadges(cart);
  renderCartModal();
  document.querySelectorAll('.counter-badge').forEach(badge => {
    badge.textContent = 0;
  });
}


// ===============================
// 🔹 7. Departamentos (cards superiores)
// ===============================
function getDepartamentoImage(departamento) {
  const images = {
    "Alimentos": "https://i.ibb.co/Fkv3PPgM/alimentos.png",
    "Abarrotes": "https://i.ibb.co/k6s5W763/Abarrotes.png",
    "Productos de limpieza": "https://i.ibb.co/FbXVDvHr/Productos-Limpieza.png",
    "Cuidado personal": "https://i.ibb.co/LzhXBhJV/Cuidado-Personal.png",
    "Mascotas": "https://i.ibb.co/6R83JjQn/Productos-Mascotas.png"
  };
  return images[departamento] || "../img/Catalogo/default.jpg";
}

function renderizarDepartamentos() {
  const container = document.getElementById("departamentos-container");
  if (!container) return;
  container.innerHTML = "";

  const departamentos = ["Alimentos", "Abarrotes", "Productos de limpieza", "Cuidado personal", "Mascotas"];

  departamentos.forEach((dep, index) => {
    const card = document.createElement("div");
    card.classList.add("category-card");
    if (index === 0) card.classList.add("active");
    card.dataset.category = dep.replace(/\s+/g, "-").toLowerCase();

    card.innerHTML = `
      <img src="${getDepartamentoImage(dep)}" class="category-img" alt="${dep}">
      <div class="category-text">${dep.toUpperCase()}</div>
    `;

    card.addEventListener("click", () => {
      document.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const productosFiltrados = allProducts.filter(p => p.departamento === dep);
      currentPage = 1;
      renderProducts(productosFiltrados);
    });

    container.appendChild(card);
  });
}

// ============== Modal Carrito (render) ==============
function getStoredCartArray() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function formatCurrency(n) {
  return Number(n || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

function renderCartModal() {
  const items = getStoredCartArray();
  const listEl = document.getElementById('carrito-items');
  const emptyEl = document.getElementById('carrito-vacio');
  const totalEl = document.getElementById('carrito-total');
  const emptyCartBtn = document.getElementById('vaciar-carrito-btn');
  const payBtn = document.querySelector('#carritoModal .btn.btn-primary');

  if (!listEl || !emptyEl || !totalEl) return;

  listEl.innerHTML = '';
  let total = 0;

  if (!items.length) {
    emptyEl.classList.remove('d-none');
    if (payBtn) payBtn.disabled = true;
    if (emptyCartBtn) emptyCartBtn.classList.add('d-none');
    totalEl.textContent = formatCurrency(0);
    return;
  }

  emptyEl.classList.add('d-none');
  if (payBtn) payBtn.disabled = false;
  if (emptyCartBtn) emptyCartBtn.classList.remove('d-none');

  items.forEach(item => {
    const qty = Number(item.cantidadSeleccionada || 0);
    const price = Number(item.precio || 0);
    const subtotal = qty * price;
    total += subtotal;

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex align-items-center gap-3 border-bottom border-top border-1 ';

    li.innerHTML = `
      <div class="position-relative w-100 d-flex align-items-center gap-3">
        <button class="btn btn-sm position-absolute top-0 end-0 text-danger cart-remove-btn"
                data-id="${item.id}" title="Eliminar">
          <i class="bi bi-trash"></i>
        </button>

        <img src="${item.imagen || '../img/Catalogo/default.jpg'}"
            alt="${item.nombre || ''}" width="48" height="48"
            class="rounded object-fit-cover" style="object-fit:cover;">

        <div class="flex-grow-1">
          <div class="fw-semibold">${item.nombre || ''}</div>
          <div class="small text-muted">
            ${item.categoria || ''} · ${item.unidad || ''} ${item.sku ? '· ' + item.sku : ''}
          </div>
          <div class="d-flex align-items-center gap-2 mt-1">
            <button class="btn btn-sm btn-outline-danger rounded-circle cart-minus-btn minus-btn-carrito" data-id="${item.id}">-</button>
            <span class="badge bg-light text-dark border" id="cart-counter-${item.id}">${qty}</span>
            <button class="btn btn-sm btn-outline-success rounded-circle cart-plus-btn plus-btn-carrito" data-id="${item.id}">+</button>
          </div>
        </div>

        <div class="fw-semibold subtotal pt-4" id="cart-subtotal-${item.id}">${formatCurrency(subtotal)}</div>
      </div>
    `;

    listEl.appendChild(li);
  });

  listEl.querySelectorAll('.cart-plus-btn').forEach(btn => {
    btn.addEventListener('click', () => changeCartQty(btn.dataset.id, +1));
  });
  listEl.querySelectorAll('.cart-minus-btn').forEach(btn => {
    btn.addEventListener('click', () => changeCartQty(btn.dataset.id, -1));
  });
  listEl.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });

  totalEl.textContent = formatCurrency(total);
}

function changeCartQty(prodId, delta) {
  const stored = getStoredCartArray();
  const index = stored.findIndex(p => String(p.id) === String(prodId));
  if (index === -1) return;

  let newQty = (stored[index].cantidadSeleccionada || 0) + delta;
  if (newQty < 0) newQty = 0;
  stored[index].cantidadSeleccionada = newQty;

  if (newQty === 0) stored.splice(index, 1);

  localStorage.setItem(CART_KEY, JSON.stringify(stored));

  cart = {};
  stored.forEach(item => cart[item.id] = item.cantidadSeleccionada);

  updateCartBadges(cart);
  renderCartModal();

  const badgeEl = document.querySelector(`.counter-badge[data-id="${prodId}"]`);
  if (badgeEl) badgeEl.textContent = newQty;
}

function removeFromCart(prodId) {
  const stored = getStoredCartArray();
  const newStored = stored.filter(p => String(p.id) !== String(prodId));

  localStorage.setItem(CART_KEY, JSON.stringify(newStored));

  cart = {};
  newStored.forEach(item => cart[item.id] = item.cantidadSeleccionada);

  updateCartBadges(cart);
  renderCartModal();

  const badgeEl = document.querySelector(`.counter-badge[data-id="${prodId}"]`);
  if (badgeEl) badgeEl.textContent = 0;
}

const carritoModalEl = document.getElementById('carritoModal');
if (carritoModalEl) {
  carritoModalEl.addEventListener('show.bs.modal', renderCartModal);
}

function isCartModalOpen() {
  const el = document.getElementById('carritoModal');
  return el && el.classList.contains('show');
}
function refreshCartIfOpen() {
  if (isCartModalOpen()) renderCartModal();
}

const vaciarBtn = document.getElementById('vaciar-carrito-btn');
if (vaciarBtn) {
  vaciarBtn.addEventListener('click', () => {
    if (confirm('¿Seguro que quieres vaciar todo el carrito?')) {
      vaciarCarrito();
    }
  });
}

// ===============================
// 🔹 8. Inicializar
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(allProducts);
  updateCartBadges(cart);
  renderizarCategoriasDinamico();
  renderizarDepartamentos();

  // 🔎 Leer categoría desde query string y filtrar (usa data-cat)
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');

  if (catParam) {
    // Llamamos versión programática para que marque activo en ambas listas por data-cat
    filtrarPorCategoria(catParam, null);

    const cont = document.getElementById('contenedor-productos');
    if (cont) cont.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
