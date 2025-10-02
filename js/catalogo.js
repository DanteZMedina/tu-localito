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
// 🔹 2. Variables globales
// ===============================
let currentPage = 1;
const itemsPerPage = 10;
const cart = {}; // carrito con cantidades por id
let currentProducts = allProducts.slice(); // productos actuales en vista (pueden ser filtrados)

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

    const prodId = prod.id ?? `${(prod.departamento||"").replace(/\s+/g,"-")}-${(prod.categoria||"").replace(/\s+/g,"-")}-${(prod.nombre||"").replace(/\s+/g,"-")}`.toLowerCase();

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

    counterBadge.textContent = cart[prodId];

    plusBtn.addEventListener("click", e => {
      e.preventDefault();
      cart[prodId]++;
      counterBadge.textContent = cart[prodId];
      console.log(`Producto agregado: ${prod.nombre} | Cantidad: ${cart[prodId]}`)
    });

    minusBtn.addEventListener("click", e => {
      e.preventDefault();
      if (cart[prodId] > 0) {
        cart[prodId]--;
        counterBadge.textContent = cart[prodId];
        console.log(`Producto disminuido: ${prod.nombre} | Cantidad: ${cart[prodId]}`)
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
    "Enlatados" : "🥫",
    "Basicos" : "🥐",
    "Jabón" : "🧼",
    "Detergentes" : "🫧",
    "Shampoo" : "🧴",
    "Papel de baño" : "🧻",
    "Toallas femeninas" : "🩲",
    "Desodorante" : "🐿️",
    "Croquetas" : "🐶",
    "Juguetes" : "🧸",
    "Accesorios" : "🐕‍🦺"
  };
  return emojis[categoria] || "🛒";
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
      aMobile.addEventListener('click', e => {
        e.preventDefault();
        filtrarPorCategoria(cat, aMobile);
      });
      liMobile.appendChild(aMobile);
      listaCategoriasMobileEl.appendChild(liMobile);
    }
  });
}

function filtrarPorCategoria(categoria, elemento) {
  document.querySelectorAll('#lista-categorias a').forEach(a => a.classList.remove('active'));
  if (elemento && elemento.closest('#lista-categorias')) {
    elemento.classList.add('active');
  }

  const productosFiltrados = categoria === 'Todos' 
    ? allProducts 
    : allProducts.filter(p => p.categoria === categoria);

  currentPage = 1;
  renderProducts(productosFiltrados);
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

// ===============================
// 🔹 8. Inicializar
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(allProducts);
  renderizarCategoriasDinamico();
  renderizarDepartamentos();
});
