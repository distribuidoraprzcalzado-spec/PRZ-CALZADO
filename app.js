
/* ============================================
   PRZ CALZADO MAYOREO - app.js
   Lógica principal del sitio
   ============================================ */

'use strict';

// ============================================
// BASE DE DATOS DE PRODUCTOS
// ============================================
const PRODUCTOS = [
  {
    id: 1,
    nombre: "Zapato Escolar Classic",
    categoria: "escolar",
    precio: 260,
    descripcion: "Zapato escolar de piel sintética de alta calidad. Suela antiderrapante, plantilla acolchada para mayor comodidad durante toda la jornada escolar. Ideal para niños de primaria.",
    tallas: [14, 15, 16, 17, 18, 19, 20],
    color: "Negro"
  },
  {
    id: 2,
    nombre: "Zapato Escolar Sport",
    categoria: "escolar",
    precio: 285,
    descripcion: "Zapato escolar con diseño deportivo. Material resistente, fácil de limpiar. Suela de hule con excelente agarre. Perfecto para niños activos.",
    tallas: [14, 15, 16, 17, 18, 19, 20, 21],
    color: "Negro/Blanco"
  },
  {
    id: 3,
    nombre: "Bota Vaquera Rodeo",
    categoria: "bota",
    precio: 580,
    descripcion: "Bota vaquera de cuero genuino con punta cuadrada. Tacón de 4cm, forro interior de tela suave. Diseño tradicional con costuras decorativas.",
    tallas: [25, 26, 27, 28, 29, 30],
    color: "Café"
  },
  {
    id: 4,
    nombre: "Bota Industrial Worker",
    categoria: "bota",
    precio: 650,
    descripcion: "Bota de trabajo con casquillo de acero. Material de cuero resistente, suela antiderrapante y antiestática. Certificada para uso industrial.",
    tallas: [25, 26, 27, 28, 29, 30],
    color: "Negro"
  },
  {
    id: 5,
    nombre: "Tenis Urban Runner",
    categoria: "tenis",
    precio: 320,
    descripcion: "Tenis casual con diseño urbano moderno. Upper de malla transpirable, suela de EVA ultraligera. Ideal para uso diario y actividades ligeras.",
    tallas: [22, 23, 24, 25, 26, 27, 28],
    color: "Blanco/Azul"
  },
  {
    id: 6,
    nombre: "Tenis Sport Pro",
    categoria: "tenis",
    precio: 380,
    descripcion: "Tenis deportivo de alto rendimiento. Tecnología de amortiguación avanzada, upper de malla reforzada. Perfecto para running y entrenamiento.",
    tallas: [24, 25, 26, 27, 28, 29, 30],
    color: "Negro/Rojo"
  },
  {
    id: 7,
    nombre: "Sandalia Dama Elegance",
    categoria: "dama",
    precio: 240,
    descripcion: "Sandalia de tacón bajo para dama. Diseño elegante con tiras ajustables, plantilla acolchada. Perfecta para uso casual y semi-formal.",
    tallas: [22, 23, 24, 25, 26],
    color: "Beige"
  },
  {
    id: 8,
    nombre: "Zapatilla Dama Comfort",
    categoria: "dama",
    precio: 295,
    descripcion: "Zapatilla cómoda para dama con plantilla memory foam. Material de piel sintética suave, suela flexible. Ideal para uso diario.",
    tallas: [22, 23, 24, 25, 26],
    color: "Negro"
  },
  {
    id: 9,
    nombre: "Zapato Caballero Formal",
    categoria: "caballero",
    precio: 420,
    descripcion: "Zapato de vestir para caballero en piel genuina. Diseño clásico Oxford, suela de cuero. Ideal para oficina y eventos formales.",
    tallas: [25, 26, 27, 28, 29, 30],
    color: "Negro"
  },
  {
    id: 10,
    nombre: "Mocasín Caballero Casual",
    categoria: "caballero",
    precio: 360,
    descripcion: "Mocasín casual para caballero. Piel sintética de alta calidad, suela de goma flexible. Cómodo para uso diario en oficina o salidas.",
    tallas: [25, 26, 27, 28, 29, 30],
    color: "Café"
  },
  {
    id: 11,
    nombre: "Zapato Vestir Clásico",
    categoria: "vestir",
    precio: 450,
    descripcion: "Zapato de vestir unisex de línea clásica. Piel genuina, suela de cuero cosida a mano. Acabado brillante de alta calidad.",
    tallas: [24, 25, 26, 27, 28, 29],
    color: "Negro"
  },
  {
    id: 12,
    nombre: "Tenis Multimarca Mix",
    categoria: "multimarca",
    precio: 310,
    descripcion: "Tenis de marcas variadas en excelente calidad. Surtido de estilos y colores. Ideal para revendedores que buscan variedad.",
    tallas: [22, 23, 24, 25, 26, 27, 28],
    color: "Varios"
  },
  {
    id: 13,
    nombre: "Calzado Escolar Niña",
    categoria: "escolar",
    precio: 245,
    descripcion: "Zapato escolar para niña con detalle de moño. Material resistente y fácil de limpiar. Suela antiderrapante para mayor seguridad.",
    tallas: [14, 15, 16, 17, 18, 19],
    color: "Negro"
  },
  {
    id: 14,
    nombre: "Bota Dama Fashion",
    categoria: "dama",
    precio: 520,
    descripcion: "Bota de moda para dama hasta la rodilla. Material sintético de alta calidad, tacón de 5cm. Diseño moderno y elegante.",
    tallas: [22, 23, 24, 25, 26],
    color: "Negro"
  },
  {
    id: 15,
    nombre: "Tenis Niño Escolar",
    categoria: "escolar",
    precio: 270,
    descripcion: "Tenis escolar para niño con velcro. Fácil de poner y quitar, material transpirable. Suela antiderrapante de alta durabilidad.",
    tallas: [14, 15, 16, 17, 18, 19, 20],
    color: "Azul/Blanco"
  },
  {
    id: 16,
    nombre: "Tenis Future Piel",
    categoria: "tenis",
    precio: 235,
    descripcion: "Tenis Future de piel genuina, color blanco. Diseño moderno y cómodo. Disponible en 3 rangos de numeración. Venta por mayoreo, mínimo media docena del mismo color y modelo.",
    tallas: [
      { rango: "2 al 5", precio: 235 },
      { rango: "3 al 6", precio: 235 },
      { rango: "5 al 8", precio: 255 }
    ],
    color: "Blanco",
    imagen: "img/Gemini_Generated_Image_2e30yk2e30yk2e30.png",
    imagenDetalle: "img/Gemini_Generated_Image_58i4p458i4p458i4.png"
  },
  {
    id: 17,
    nombre: "Nike Court Azul",
    categoria: "tenis",
    precio: 320,
    descripcion: "Nike Court en colorway azul/blanco. Piel de alta calidad, suela resistente. Diseño clásico con estilo urbano. Venta por mayoreo, mínimo media docena.",
    tallas: [
      { rango: "2 al 5", precio: 320 },
      { rango: "3 al 6", precio: 320 },
      { rango: "5 al 8", precio: 340 }
    ],
    color: "Azul/Blanco",
    imagen: "img/nike-court-azul.png",
    imagenDetalle: "img/nike-court-azul.png",
    especial: true,
    tallasEspecial: [3, 4, 5, 6, 7, 8]
  }
];

// ============================================
// CARRITO - FUNCIONES PRINCIPALES
// ============================================
const CART_KEY = 'prz_cart';
const WHATSAPP_NUMBER = '522213408041';
const MINIMO_PARES = 6;

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCounter();
}

function addToCart(item) {
  const cart = getCart();
  // item: { productId, nombre, categoria, precio, tallas: [{talla, cantidad}], color }
  cart.push({ ...item, cartId: Date.now() });
  saveCart(cart);
  showToast('¡Producto agregado al carrito!', 'success');
}

function removeFromCart(cartId) {
  const cart = getCart().filter(item => item.cartId !== cartId);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCounter();
}

function getCartTotal() {
  return getCart().reduce((total, item) => {
    return total + item.tallas.reduce((s, t) => {
      const precio = t.precio || item.precio;
      return s + (precio * t.cantidad);
    }, 0);
  }, 0);
}

function getCartItemCount() {
  return getCart().reduce((total, item) => {
    return total + item.tallas.reduce((s, t) => s + t.cantidad, 0);
  }, 0);
}

function updateCartCounter() {
  const count = getCartItemCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('hidden', count === 0);
  });
}

// ============================================
// CÁLCULO DE MAYOREO
// ============================================
function calcularMayoreo(precioPieza, cantidad) {
  const total = precioPieza * cantidad;
  const mediaDocenas = Math.floor(cantidad / 6);
  const docenas = Math.floor(cantidad / 12);
  const residuo = cantidad % 6;
  return { total, mediaDocenas, docenas, residuo };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0
  }).format(amount);
}

// ============================================
// GENERADOR DE MENSAJE WHATSAPP
// ============================================
function generarMensajeWhatsApp(cart, cliente) {
  const nombre = cliente.nombre || 'Sin nombre';
  const telefono = cliente.telefono || 'No proporcionado';

  let mensaje = `🥿 *PEDIDO - Distribuidora PRZ*\n\n`;
  mensaje += `👤 Cliente: ${nombre}\n`;
  mensaje += `📱 Tel: ${telefono}\n\n`;
  mensaje += `📦 *Productos:*\n`;

  cart.forEach(item => {
    const totalItem = item.tallas.reduce((s, t) => s + t.cantidad, 0);
    const subtotalItem = item.tallas.reduce((s, t) => {
      const precio = t.precio || item.precio;
      return s + (precio * t.cantidad);
    }, 0);
    mensaje += `\n• *${item.nombre}*\n`;
    mensaje += `  Color: ${item.color || 'N/A'}\n`;
    item.tallas.forEach(t => {
      const precio = t.precio || item.precio;
      mensaje += `  Numeración/Talla ${t.talla}: ${t.cantidad} pares × $${precio} = $${precio * t.cantidad}\n`;
    });
    mensaje += `  Subtotal: ${formatCurrency(subtotalItem)}\n`;
  });

  const total = getCartTotal();
  mensaje += `\n💰 *TOTAL: ${formatCurrency(total)}*\n`;
  mensaje += `\n_Pedido generado desde PRZ Calzado Mayoreo_`;

  return mensaje;
}

function enviarPorWhatsApp(cart, cliente) {
  const mensaje = generarMensajeWhatsApp(cart, cliente);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3200);
}

// ============================================
// NAVBAR - SCROLL & HAMBURGER
// ============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });
  }

  updateCartCounter();
}

// ============================================
// SVG SHOE ICON (placeholder)
// ============================================
const SHOE_SVG = `<svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 45 C5 45 15 20 35 18 C45 17 55 22 65 25 C75 28 85 30 90 28 L95 45 C95 45 80 52 60 50 C40 48 20 50 10 48 Z" stroke="white" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
  <path d="M35 18 C35 18 38 10 45 8 C52 6 58 10 60 15" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M10 48 L5 45" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M40 25 L42 18" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
  <path d="M55 27 L57 20" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
</svg>`;

// ============================================
// PÁGINA: INDEX
// ============================================
function initIndex() {
  // Render featured products (first 6)
  const featuredContainer = document.getElementById('featured-products');
  if (featuredContainer) {
    const featured = PRODUCTOS.slice(0, 6);
    featuredContainer.innerHTML = featured.map(p => renderProductCard(p)).join('');
  }
}

// ============================================
// PÁGINA: CATÁLOGO
// ============================================
function initCatalogo() {
  const container = document.getElementById('products-container');
  const tabs = document.querySelectorAll('.filter-tab');
  const resultsInfo = document.getElementById('results-info');

  let currentFilter = 'todos';

  function renderProducts(filter) {
    const filtered = filter === 'todos'
      ? PRODUCTOS
      : PRODUCTOS.filter(p => p.categoria === filter);

    if (resultsInfo) {
      resultsInfo.innerHTML = `Mostrando <span>${filtered.length}</span> producto${filtered.length !== 1 ? 's' : ''}`;
    }

    if (container) {
      if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--white-60)">
          <p style="font-size:1.1rem">No hay productos en esta categoría.</p>
        </div>`;
      } else {
        container.innerHTML = filtered.map(p => renderProductCard(p)).join('');
      }
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderProducts(currentFilter);
    });
  });

  // Check URL param for category
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('categoria');
  if (catParam) {
    const matchTab = [...tabs].find(t => t.dataset.filter === catParam);
    if (matchTab) {
      tabs.forEach(t => t.classList.remove('active'));
      matchTab.classList.add('active');
      currentFilter = catParam;
    }
  }

  renderProducts(currentFilter);
}

function renderProductCard(producto) {
  const tieneImagen = !!producto.imagen;
  const imagenHTML = tieneImagen
    ? `<img src="${producto.imagen}" alt="${producto.nombre}" style="width:100%;height:100%;object-fit:contain;position:absolute;inset:0;border-radius:inherit;padding:0.5rem;">`
    : SHOE_SVG;
  const claseImagen = tieneImagen ? 'product-image-placeholder has-image' : 'product-image-placeholder';
  return `
    <a href="producto.html?id=${producto.id}" class="product-card">
      <div class="${claseImagen}" style="position:relative;">
        ${imagenHTML}
        <span class="product-badge" style="position:absolute;top:12px;left:12px;z-index:2;">${producto.categoria}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${producto.categoria}</span>
        <h3 class="product-name">${producto.nombre}</h3>
        <p style="font-size:0.8rem;color:var(--white-60);margin-top:0.25rem">Color: ${producto.color}</p>
        <div class="product-price-row">
          <span class="product-price">${formatCurrency(producto.precio)}</span>
          <span class="product-price-label">/ pieza</span>
        </div>
      </div>
      <div class="product-card-footer">
        <div class="btn btn-primary btn-sm btn-full" style="pointer-events:none">Ver Detalles</div>
      </div>
    </a>`;
}

// ============================================
// PÁGINA: PRODUCTO DETALLE
// ============================================
function initProducto() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  const producto = PRODUCTOS.find(p => p.id === id);

  if (!producto) {
    document.getElementById('product-detail-content').innerHTML = `
      <div style="text-align:center;padding:5rem 2rem;grid-column:1/-1">
        <h2 style="font-size:2rem;margin-bottom:1rem">Producto no encontrado</h2>
        <a href="catalogo.html" class="btn btn-primary">Ver Catálogo</a>
      </div>`;
    return;
  }

  // Breadcrumb
  const breadcrumb = document.getElementById('breadcrumb-product');
  if (breadcrumb) breadcrumb.textContent = producto.nombre;

  // Breadcrumb category link
  const breadcrumbCat = document.getElementById('breadcrumb-cat');
  if (breadcrumbCat) {
    breadcrumbCat.textContent = producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1);
    breadcrumbCat.href = `catalogo.html?categoria=${producto.categoria}`;
  }

  // Fill product info
  document.getElementById('product-name').textContent = producto.nombre;
  document.getElementById('product-category').textContent = producto.categoria;
  document.getElementById('product-desc').textContent = producto.descripcion;
  document.getElementById('product-price').textContent = formatCurrency(producto.precio);
  document.getElementById('product-color').textContent = producto.color;

  // Imagen real si existe
  const imgContainer = document.getElementById('product-detail-image');
  if (imgContainer && (producto.imagenDetalle || producto.imagen)) {
    const src = producto.imagenDetalle || producto.imagen;
    imgContainer.classList.add('has-image');
    imgContainer.innerHTML = `<img src="${src}" alt="${producto.nombre}">`;
  }

  // Tallas
  const tallasContainer = document.getElementById('tallas-container');
  const usaNumeracion = producto.nombre && producto.nombre.includes('Future');
  // Detectar si las tallas tienen precio propio
  const tallasConPrecio = producto.tallas.length > 0 && typeof producto.tallas[0] === 'object' && producto.tallas[0].rango;

  tallasContainer.innerHTML = producto.tallas.map(talla => {
    const esObjeto = typeof talla === 'object' && talla.rango;
    const tallaId = esObjeto
      ? String(talla.rango).replace(/\s/g, '_')
      : String(talla).replace(/\s/g, '_');
    const etiqueta = esObjeto
      ? `Numeración ${talla.rango}`
      : (usaNumeracion ? `Numeración ${talla}` : `Talla ${talla}`);
    const subtitulo = esObjeto
      ? `$${talla.precio} c/u · media doc. $${talla.precio * 6}`
      : (usaNumeracion ? '' : (producto.categoria === 'escolar' ? 'Infantil' : 'Adulto'));
    return `
    <div class="talla-row" id="talla-row-${tallaId}" data-talla="${esObjeto ? talla.rango : talla}" data-precio="${esObjeto ? talla.precio : producto.precio}">
      <div class="talla-label">
        ${etiqueta}
        <span style="color:var(--accent);font-weight:600;">${subtitulo}</span>
      </div>
      <div class="quantity-control">
        <button class="qty-btn" onclick="changeQty('${tallaId}', -6)" title="Restar media docena">−</button>
        <input type="number" class="qty-input" id="qty-${tallaId}" value="0" min="0" step="6"
          onchange="onQtyChange('${tallaId}', this.value)" oninput="onQtyChange('${tallaId}', this.value)">
        <button class="qty-btn" onclick="changeQty('${tallaId}', 6)" title="Agregar media docena">+</button>
      </div>
    </div>`;
  }).join('');

  // Botón surtido especial si aplica
  if (producto.especial && producto.tallasEspecial) {
    const btnEspecial = document.createElement('button');
    btnEspecial.className = 'btn btn-outline btn-full';
    btnEspecial.style.marginTop = '0.5rem';
    btnEspecial.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      Armar Surtido Especial (6 tallas a elegir)`;
    btnEspecial.onclick = () => abrirSurtidoEspecial(producto.id);
    tallasContainer.appendChild(btnEspecial);
  }

  // Init calculator
  updateCalculator(producto);

  // Add to cart button
  const addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const tallasSeleccionadas = getTallasSeleccionadas(producto.tallas);
      const totalPares = tallasSeleccionadas.reduce((s, t) => s + t.cantidad, 0);

      if (totalPares < MINIMO_PARES) {
        showToast(`Mínimo ${MINIMO_PARES} pares para agregar al carrito`, 'error');
        return;
      }

      addToCart({
        productId: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        color: producto.color,
        tallas: tallasSeleccionadas
      });

      // Reset quantities
      producto.tallas.forEach(t => {
        const tallaId = String(t).replace(/\s/g, '_');
        const input = document.getElementById(`qty-${tallaId}`);
        if (input) input.value = 0;
        const row = document.getElementById(`talla-row-${tallaId}`);
        if (row) row.classList.remove('has-quantity');
      });
      updateCalculator(producto);
    });
  }
}

function getTallasSeleccionadas(tallas) {
  return tallas
    .map(t => {
      const esObjeto = typeof t === 'object' && t.rango;
      const tallaId = esObjeto
        ? String(t.rango).replace(/\s/g, '_')
        : String(t).replace(/\s/g, '_');
      const row = document.getElementById(`talla-row-${tallaId}`);
      const precioPorFila = row ? parseInt(row.dataset.precio) : null;
      return {
        talla: esObjeto ? t.rango : t,
        cantidad: parseInt(document.getElementById(`qty-${tallaId}`)?.value || 0),
        precio: precioPorFila
      };
    })
    .filter(t => t.cantidad > 0);
}

function changeQty(tallaId, delta) {
  const input = document.getElementById(`qty-${tallaId}`);
  if (!input) return;
  const current = parseInt(input.value) || 0;
  const newVal = Math.max(0, current + delta);
  input.value = newVal;
  onQtyChange(tallaId, newVal);
}

function onQtyChange(tallaId, value) {
  let val = Math.max(0, parseInt(value) || 0);
  // Redondear al múltiplo de 6 más cercano
  if (val > 0 && val % 6 !== 0) {
    val = Math.round(val / 6) * 6;
    if (val === 0) val = 6;
  }
  const input = document.getElementById(`qty-${tallaId}`);
  if (input) input.value = val;

  const row = document.getElementById(`talla-row-${tallaId}`);
  if (row) row.classList.toggle('has-quantity', val > 0);

  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  const producto = PRODUCTOS.find(p => p.id === id);
  if (producto) updateCalculator(producto);
}

function updateCalculator(producto) {
  const tallasSeleccionadas = getTallasSeleccionadas(producto.tallas);
  const totalPares = tallasSeleccionadas.reduce((s, t) => s + t.cantidad, 0);
  // Calcular total respetando precio por fila si existe
  const total = tallasSeleccionadas.reduce((s, t) => {
    const precio = t.precio || producto.precio;
    return s + (precio * t.cantidad);
  }, 0);

  const calcPares = document.getElementById('calc-pares');
  const calcTotal = document.getElementById('calc-total');
  const calcMediaDoc = document.getElementById('calc-media-doc');
  const calcDocenas = document.getElementById('calc-docenas');
  const statusEl = document.getElementById('minimum-status');
  const addBtn = document.getElementById('add-to-cart-btn');

  if (calcPares) calcPares.textContent = totalPares;
  if (calcTotal) calcTotal.textContent = formatCurrency(total);
  if (calcMediaDoc) calcMediaDoc.textContent = Math.floor(totalPares / 6);
  if (calcDocenas) calcDocenas.textContent = Math.floor(totalPares / 12);

  const meetsMinimum = totalPares >= MINIMO_PARES;

  if (statusEl) {
    if (totalPares === 0) {
      statusEl.innerHTML = `<div class="minimum-warning">⚠️ Selecciona al menos 6 pares (media docena) del mismo modelo</div>`;
    } else if (!meetsMinimum) {
      statusEl.innerHTML = `<div class="minimum-warning">⚠️ Necesitas ${MINIMO_PARES - totalPares} par(es) más para el mínimo</div>`;
    } else {
      statusEl.innerHTML = `<div class="minimum-ok">✅ ¡Listo! ${totalPares} pares seleccionados — ${formatCurrency(total)}</div>`;
    }
  }

  if (addBtn) addBtn.disabled = !meetsMinimum;
}

// ============================================
// PÁGINA: CARRITO
// ============================================
function initCarrito() {
  renderCart();

  const sendBtn = document.getElementById('send-whatsapp-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast('El carrito está vacío', 'error');
        return;
      }
      const nombre = document.getElementById('cliente-nombre')?.value?.trim() || '';
      const telefono = document.getElementById('cliente-telefono')?.value?.trim() || '';

      if (!nombre) {
        showToast('Por favor ingresa tu nombre', 'error');
        document.getElementById('cliente-nombre')?.focus();
        return;
      }

      enviarPorWhatsApp(cart, { nombre, telefono });
    });
  }

  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('¿Vaciar el carrito?')) {
        clearCart();
        renderCart();
        showToast('Carrito vaciado', 'info');
      }
    });
  }
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-items-container');
  const summarySection = document.getElementById('cart-summary-section');
  const emptySection = document.getElementById('cart-empty');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '';
    if (summarySection) summarySection.style.display = 'none';
    if (emptySection) emptySection.style.display = 'block';
    return;
  }

  if (summarySection) summarySection.style.display = 'block';
  if (emptySection) emptySection.style.display = 'none';

  container.innerHTML = cart.map(item => {
    const totalItem = item.tallas.reduce((s, t) => s + t.cantidad, 0);
    const subtotal = item.precio * totalItem;
    const tallasChips = item.tallas.map(t =>
      `<span class="talla-chip">T${t.talla}: ${t.cantidad}p</span>`
    ).join('');

    return `
      <div class="cart-item" id="cart-item-${item.cartId}">
        <div class="cart-item-image">${SHOE_SVG}</div>
        <div class="cart-item-details">
          <div class="cart-item-category">${item.categoria}</div>
          <div class="cart-item-name">${item.nombre}</div>
          <div style="font-size:0.8rem;color:var(--white-60);margin-bottom:0.4rem">Color: ${item.color || 'N/A'}</div>
          <div class="cart-item-tallas">${tallasChips}</div>
          <div class="cart-item-price">${totalItem} pares × ${formatCurrency(item.precio)}/pieza</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem">
          <div class="cart-item-subtotal">${formatCurrency(subtotal)}</div>
          <button class="cart-item-remove" onclick="removeItem(${item.cartId})" title="Eliminar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>`;
  }).join('');

  updateSummary(cart);
}

function removeItem(cartId) {
  removeFromCart(cartId);
  renderCart();
  showToast('Producto eliminado', 'info');
}

function updateSummary(cart) {
  const totalPares = cart.reduce((s, item) => s + item.tallas.reduce((ss, t) => ss + t.cantidad, 0), 0);
  const totalProductos = cart.length;
  const total = getCartTotal();

  const elPares = document.getElementById('summary-pares');
  const elProductos = document.getElementById('summary-productos');
  const elTotal = document.getElementById('summary-total');

  if (elPares) elPares.textContent = totalPares;
  if (elProductos) elProductos.textContent = totalProductos;
  if (elTotal) elTotal.textContent = formatCurrency(total);
}

// ============================================
// SURTIDO ESPECIAL - MODAL
// ============================================
function abrirSurtidoEspecial(productoId) {
  const producto = PRODUCTOS.find(p => p.id === productoId);
  if (!producto || !producto.tallasEspecial) return;

  // Crear modal
  const modal = document.createElement('div');
  modal.id = 'modal-especial';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;padding:1rem;
  `;

  modal.innerHTML = `
    <div style="background:var(--bg-mid);border:1px solid rgba(0,102,255,0.3);border-radius:var(--radius-xl);padding:2rem;max-width:480px;width:100%;box-shadow:var(--shadow-glow);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <div>
          <h3 style="font-size:1.25rem;font-weight:800;">Surtido Especial</h3>
          <p style="font-size:0.8rem;color:var(--white-60);margin-top:0.25rem;">Selecciona tallas individuales — deben sumar exactamente 6 pares</p>
        </div>
        <button onclick="cerrarSurtidoEspecial()" style="background:var(--white-10);border:none;color:var(--white);width:36px;height:36px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
      </div>

      <div id="especial-tallas" style="display:flex;flex-direction:column;gap:0.6rem;margin-bottom:1.5rem;">
        ${producto.tallasEspecial.map(t => `
          <div style="display:flex;align-items:center;justify-content:space-between;background:var(--white-10);border:1px solid var(--white-20);border-radius:var(--radius-md);padding:0.75rem 1rem;" id="especial-row-${t}">
            <span style="font-weight:700;">Talla ${t}</span>
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <button onclick="cambiarEspecial(${t},-1)" style="width:30px;height:30px;border-radius:50%;background:var(--white-20);border:none;color:var(--white);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">−</button>
              <span id="especial-qty-${t}" style="font-weight:800;font-size:1.1rem;min-width:24px;text-align:center;">0</span>
              <button onclick="cambiarEspecial(${t},1)" style="width:30px;height:30px;border-radius:50%;background:var(--white-20);border:none;color:var(--white);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">+</button>
            </div>
          </div>`).join('')}
      </div>

      <div style="background:rgba(0,102,255,0.1);border:1px solid rgba(0,102,255,0.2);border-radius:var(--radius-md);padding:1rem;margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.9rem;color:var(--white-80);">Total seleccionado</span>
        <span id="especial-total-pares" style="font-size:1.5rem;font-weight:900;color:var(--accent);">0 / 6</span>
      </div>

      <div id="especial-status" style="margin-bottom:1rem;"></div>

      <button id="btn-agregar-especial" onclick="agregarSurtidoEspecial(${productoId})" class="btn btn-primary btn-full" disabled>
        Agregar Surtido al Carrito
      </button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) cerrarSurtidoEspecial(); });
}

function cerrarSurtidoEspecial() {
  const modal = document.getElementById('modal-especial');
  if (modal) modal.remove();
}

function cambiarEspecial(talla, delta) {
  const el = document.getElementById(`especial-qty-${talla}`);
  if (!el) return;
  const current = parseInt(el.textContent) || 0;
  const newVal = Math.max(0, current + delta);
  el.textContent = newVal;

  // Highlight row
  const row = document.getElementById(`especial-row-${talla}`);
  if (row) row.style.borderColor = newVal > 0 ? 'rgba(0,102,255,0.5)' : 'var(--white-20)';

  actualizarTotalEspecial();
}

function actualizarTotalEspecial() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  const producto = PRODUCTOS.find(p => p.id === id);
  if (!producto) return;

  const total = producto.tallasEspecial.reduce((s, t) => {
    return s + (parseInt(document.getElementById(`especial-qty-${t}`)?.textContent) || 0);
  }, 0);

  const totalEl = document.getElementById('especial-total-pares');
  const statusEl = document.getElementById('especial-status');
  const btnEl = document.getElementById('btn-agregar-especial');

  if (totalEl) {
    totalEl.textContent = `${total} / 6`;
    totalEl.style.color = total === 6 ? 'var(--success)' : total > 6 ? '#ff4444' : 'var(--accent)';
  }

  if (statusEl) {
    if (total === 0) statusEl.innerHTML = '';
    else if (total < 6) statusEl.innerHTML = `<div class="minimum-warning">⚠️ Faltan ${6 - total} par(es) para completar la media docena</div>`;
    else if (total > 6) statusEl.innerHTML = `<div class="minimum-warning">⚠️ Tienes ${total - 6} par(es) de más — el máximo es 6</div>`;
    else statusEl.innerHTML = `<div class="minimum-ok">✅ ¡Perfecto! Media docena completa</div>`;
  }

  if (btnEl) btnEl.disabled = total !== 6;
}

function agregarSurtidoEspecial(productoId) {
  const producto = PRODUCTOS.find(p => p.id === productoId);
  if (!producto) return;

  const tallasSeleccionadas = producto.tallasEspecial
    .map(t => ({
      talla: `Talla ${t}`,
      cantidad: parseInt(document.getElementById(`especial-qty-${t}`)?.textContent) || 0,
      precio: producto.precio
    }))
    .filter(t => t.cantidad > 0);

  addToCart({
    productId: producto.id,
    nombre: `${producto.nombre} (Surtido Especial)`,
    categoria: producto.categoria,
    precio: producto.precio,
    color: producto.color,
    tallas: tallasSeleccionadas
  });

  cerrarSurtidoEspecial();
}
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();

  const page = document.body.dataset.page;
  if (page === 'index') initIndex();
  else if (page === 'catalogo') initCatalogo();
  else if (page === 'producto') initProducto();
  else if (page === 'carrito') initCarrito();
});
