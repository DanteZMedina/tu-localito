// === Constantes y helpers de almacenamiento ===
const CART_KEY = 'tl_cart_v1';

function getStoredItems() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function setStoredItems(arr) {
  localStorage.setItem(CART_KEY, JSON.stringify(arr));
}

function currency(n) {
  return Number(n || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

// === Badges del navbar (si existen en esta página) ===
function updateCartBadges() {
  const items = getStoredItems();
  const total = items.reduce((acc, p) => acc + Number(p.cantidadSeleccionada || 0), 0);
  const display = total > 9 ? '9+' : String(total);

  ['carrito-count-mobile', 'carrito-count-desktop'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = display;
  });
}

// === Render principal de la página ===
function renderCartPage() {
  const list = document.getElementById('productos-lista');
  if (!list) return;

  const items = getStoredItems();
  list.innerHTML = '';

  if (!items.length) {
    list.innerHTML = `
      <p class="text-center text-muted p-5">Tu carrito está vacío.</p>
    `;
    updateResumen(0, 0);
    updateCartBadges();
    return;
  }

  let subtotal = 0;

  items.forEach(item => {
    const qty   = Number(item.cantidadSeleccionada || 0);
    const price = Number(item.precio || 0);
    const sub   = qty * price;
    subtotal   += sub;

    const card = document.createElement('section');
    card.className = 'producto-card shadow-sm';
    card.dataset.id = item.id;

    card.innerHTML = `
      <button class="btn-eliminar" data-action="remove" data-id="${item.id}" title="Eliminar">
        <i class="bi bi-trash"></i>
      </button>

      <div class="producto-detalles">
        <img class="producto-imagen"
             src="${item.imagen || '../img/Catalogo/default.jpg'}"></img>

        <div class="producto-info-wrapper">
          <p class="producto-nombre">${item.nombre || ''}</p>
          <p class="producto-precio">
            Precio: ${currency(price)} / ${item.unidad || ''}
            ${item.sku ? ` · <span class="text-muted">SKU: ${item.sku}</span>` : ''}
          </p>

          <div class="controles-cantidad">
            <button class="btn btn-sm btn-outline-danger rounded-circle minus-btn-carrito-page" data-action="minus" data-id="${item.id}">−</button>
            <span class="cantidad-display" id="qty-${item.id}">${qty}</span>
            <button class="btn btn-sm btn-outline-success rounded-circle plus-btn-carrito-page" data-action="plus" data-id="${item.id}">+</button>
          </div>
        </div>

        <div class="ms-auto text-end carrito-card-subtotal">
          <div class="small text-muted">Subtotal</div>
          <div class="fw-bold" id="subtotal-${item.id}">${currency(sub)}</div>
        </div>
      </div>
    `;

    list.appendChild(card);
  });

  const envio = items.length ? 50 : 0; // Envío fijo si hay productos
  updateResumen(subtotal, envio);
  updateCartBadges();
}

// === Resumen (subtotal / envío / total) ===
function updateResumen(subtotal, envio) {
  const subEl = document.getElementById('subtotal-valor');
  const envEl = document.getElementById('envio-valor');
  const totEl = document.getElementById('total-valor');

  if (subEl) subEl.textContent = currency(subtotal);
  if (envEl) envEl.textContent = currency(envio);
  if (totEl) totEl.textContent = currency(subtotal + envio);
}

// === Delegación de eventos para +/- y eliminar ===
function setupEvents() {
  const list = document.getElementById('productos-lista');
  if (!list) return;

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (!id || !action) return;

    const items = getStoredItems();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return;

    if (action === 'plus') {
      items[idx].cantidadSeleccionada = Number(items[idx].cantidadSeleccionada || 0) + 1;
    } else if (action === 'minus') {
      const newQty = Number(items[idx].cantidadSeleccionada || 0) - 1;
      if (newQty <= 0) {
        items.splice(idx, 1); // eliminar si llega a 0
      } else {
        items[idx].cantidadSeleccionada = newQty;
      }
    } else if (action === 'remove') {
      items.splice(idx, 1);
    }

    setStoredItems(items);
    renderCartPage(); // re-pinta todo (cantidades, subtotales y resumen)
  });
}

// === Acciones de botones del layout ===
function finalizarCompra() {
  const items = getStoredItems();
  if (!items.length) { alert('Tu carrito está vacío.'); return; }
  // Aquí podrías redirigir a checkout real
  alert('¡Gracias por tu compra! (demo)');
}

function seguirComprando() {
  window.location.href = './catalogo.html';
}

function cerrarCarrito() {
  // Si agregas el botón de cerrar otra vez, esto funciona:
  if (history.length > 1) history.back();
  else window.location.href = './catalogo.html';
}

// Exponer funciones globales (tu HTML las llama con onclick)
window.finalizarCompra = finalizarCompra;
window.seguirComprando = seguirComprando;
window.cerrarCarrito = cerrarCarrito;

// === Inicio ===
document.addEventListener('DOMContentLoaded', () => {
  setupEvents();
  renderCartPage();
});
