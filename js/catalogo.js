import { inventario } from './catalogo-productos.js';

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

// ===============================
// 🔹 3. Renderizar productos
// ===============================
function renderProducts(products) {
  const container = document.getElementById("contenedor-productos");
  container.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  paginatedProducts.forEach(prod => {
    const col = document.createElement("div");
    col.classList.add(
      "col",
      "producto-card",
      prod.departamento.replace(/\s+/g, "-").toLowerCase(),
      prod.categoria.replace(/\s+/g, "-").toLowerCase()
    );

    col.innerHTML = `
      <div class="card h-100 text-center shadow-sm">
        <img src="${prod.imagen}" class="card-img-top category-img" alt="${prod.nombre}">
        <div class="card-body">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text"><strong>Precio:</strong> $${prod.precio.toFixed(2)} / ${prod.unidad}</p>
        </div>
        <div class="d-flex justify-content-center align-items-center gap-2">
          <button class="btn btn-sm btn-outline-danger rounded-circle minus-btn">-</button>
          <span class="counter-badge">0</span>
          <button class="btn btn-sm btn-outline-success rounded-circle plus-btn">+</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  renderPagination(products.length);
}

// ===============================
// 🔹 4. Renderizar paginación con puntos suspensivos
// ===============================
function renderPagination(totalItems) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Botón "Previous"
  const prevItem = document.createElement("li");
  prevItem.classList.add("page-item", currentPage === 1 ? "disabled" : "");
  prevItem.innerHTML = `<a class="page-link" href="#">Previous</a>`;
  prevItem.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderProducts(allProducts);
    }
  });
  paginationContainer.appendChild(prevItem);

  // Calcular páginas visibles
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    endPage = Math.min(totalPages, maxVisible);
  } else if (currentPage >= totalPages - 2) {
    startPage = Math.max(1, totalPages - (maxVisible - 1));
  }

  // Página 1 siempre
  if (startPage > 1) {
    addPageItem(1, paginationContainer);
    if (startPage > 2) {
      const dots = document.createElement("li");
      dots.classList.add("page-item", "disabled");
      dots.innerHTML = `<span class="page-link">...</span>`;
      paginationContainer.appendChild(dots);
    }
  }

  // Páginas dinámicas
  for (let i = startPage; i <= endPage; i++) {
    addPageItem(i, paginationContainer);
  }

  // Última página siempre
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("li");
      dots.classList.add("page-item", "disabled");
      dots.innerHTML = `<span class="page-link">...</span>`;
      paginationContainer.appendChild(dots);
    }
    addPageItem(totalPages, paginationContainer);
  }

  // Botón "Next"
  const nextItem = document.createElement("li");
  nextItem.classList.add("page-item", currentPage === totalPages ? "disabled" : "");
  nextItem.innerHTML = `<a class="page-link" href="#">Next</a>`;
  nextItem.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts(allProducts);
    }
  });
  paginationContainer.appendChild(nextItem);
}

// ===============================
// 🔹 5. Helper para crear un botón de página
// ===============================
function addPageItem(page, container) {
  const li = document.createElement("li");
  li.classList.add("page-item", page === currentPage ? "active" : "");
  li.innerHTML = `<a class="page-link" href="#">${page}</a>`;
  li.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = page;
    renderProducts(allProducts);
  });
  container.appendChild(li);
}

// ===============================
// 🔹 6. Inicializar
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(allProducts);
});
