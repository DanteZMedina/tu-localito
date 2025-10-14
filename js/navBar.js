const navbar = document.getElementById("navbar");

// Detectar automáticamente si el archivo está dentro de /html o en la raíz
const currentPath = window.location.pathname;
const isInHtmlFolder = currentPath.includes("/html/");
const basePath = isInHtmlFolder ? "../" : "./";

navbar.innerHTML = `
  <div class="container-fluid d-flex align-items-center justify-content-between">
    <!-- Contenedor logo mobile -->
    <div class="d-flex d-lg-none flex-grow-1 justify-content-center">
      <a class="navbar-brand m-0" href="${basePath}index.html">
        <img src="${basePath}img/logo-nav-bar.png" alt="Logo oficial de Tu localito" height="50" />
      </a>
    </div>

    <!-- Logo desktop -->
    <a class="navbar-brand d-none d-lg-block me-auto" href="${basePath}index.html">
      <img src="${basePath}img/logo-nav-bar.png" alt="Logo" height="50" />
    </a>

    <!-- Botón toggler mobile -->
    <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
      <span class="navbar-toggler-icon">.</span>
    </button>

    <!-- Menú -->
    <div class="collapse navbar-collapse" id="navbarMenu">
      <div
        class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center w-100 justify-content-lg-center gap-3 menu">
        <a href="${basePath}index.html">Inicio</a>
        <a href="${basePath}html/catalogo.html">Catálogo</a>
        <a href="${basePath}html/sobre_nosotros.html">Sobre Nosotros</a>
        <a href="${basePath}html/contacto.html">Contacto</a>
      </div>

      <!-- Acciones mobile -->
      <div class="d-lg-none d-flex justify-content-center w-100">
        <div class="acciones mt-3 d-flex gap-3">
          <a id="carrito-btn-mobile" class="carrito btn position-relative d-inline-flex align-items-center"
            data-bs-toggle="modal" data-bs-target="#carritoModal">
            <i class="bi bi-cart3 me-2" aria-hidden="true"></i>
            Carrito
            <!-- 🟡 Badge contador con color de la página -->
            <span id="carrito-count-mobile"
              class="carrito-count position-absolute top-0 start-0 translate-middle badge rounded-pill">
              0
            </span>
          </a>
          <a href="${basePath}html/ingresar.html" class="ingresar btn">Mi perfil</a>
        </div>
      </div>

      <!-- Acciones desktop -->
      <div class="d-none d-lg-flex acciones ms-lg-3 mt-lg-0 gap-3">
        <a id="carrito-btn-desktop" class="carrito btn position-relative d-inline-flex align-items-center"
          data-bs-toggle="modal" data-bs-target="#carritoModal">
          <i class="bi bi-cart3 me-2" aria-hidden="true"></i>
          Carrito
          <!-- 🟡 Badge contador con color de la página -->
          <span id="carrito-count-desktop"
            class="carrito-count position-absolute top-0 start-0 translate-middle badge rounded-pill">
            0
          </span>
        </a>
        <a href="${basePath}html/ingresar.html" class="ingresar btn">Mi perfil</a>
      </div>
    </div>
  </div>
`;

// === Detectar y marcar página activa ===
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("#navbar a").forEach(link => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#")) return; // Evita error si no hay href o es un anchor interno

  const linkPage = href.split("/").pop();
  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});
