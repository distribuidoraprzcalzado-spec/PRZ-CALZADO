
/* ============================================
   PRZ CALZADO MAYOREO - app.js
   LÃ³gica principal del sitio
   ============================================ */

'use strict';

// ============================================
// BASE DE DATOS DE PRODUCTOS
// ============================================
// Los productos se cargan desde Google Sheets en tiempo de ejecución
const PRODUCTOS = [];

// ============================================
// GOOGLE SHEETS INTEGRATION
// ============================================
// Google Sheets configuration
const GOOGLE_SHEETS_ID = '1-9lSJ2UdvV51nQYLoBv-w23clyoKYnR70j0_W18GeAQ';

/**
 * Fetch products from Google Sheets
 * Sheet columns expected: ID, MODELO, PRECIO, NOMBRE, N/E, 2 AL 5, 3 AL 6, 5 AL 8, 5 AL 7.5, 6 AL 8, 6 AL 9
 */
async function cargarProductosDesdeGoogleSheets() {
  const CACHE_KEY = 'prz_productos_cache';
  const CACHE_VERSION = 'v16';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  // Mostrar productos del caché inmediatamente si existen y son de la versión correcta
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && cached.version === CACHE_VERSION && cached.ts && (Date.now() - cached.ts) < CACHE_TTL && cached.data?.length > 0) {
      PRODUCTOS.length = 0;
      PRODUCTOS.push(...cached.data);
      _refrescarSheetEnBackground(CACHE_KEY, CACHE_VERSION);
      return PRODUCTOS;
    }
  } catch(e) {}

  return await _fetchSheet(CACHE_KEY, CACHE_VERSION);
}

async function _refrescarSheetEnBackground(CACHE_KEY, CACHE_VERSION) {
  try {
    await _fetchSheet(CACHE_KEY, CACHE_VERSION);
  } catch(e) {}
}

async function _fetchSheet(CACHE_KEY, CACHE_VERSION) {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/export?format=csv&gid=0`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(csvUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Error al cargar Google Sheets');
    const csv = await response.text();
    const productos = parseCSVToProducts(csv);
    if (productos.length > 0) {
      PRODUCTOS.length = 0;
      PRODUCTOS.push(...productos);
      // Guardar en caché
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ version: CACHE_VERSION, ts: Date.now(), data: productos }));
      } catch(e) {}
    }
    return PRODUCTOS;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error cargando Google Sheets:', error.message);
    }
    return PRODUCTOS;
  }
}

/**
 * Parse CSV data from Google Sheets into product objects
 * Expected columns: ID, MODELO, PRECIO, NOMBRE, N/E, 2 AL 5, 3 AL 6, 5 AL 8, 5 AL 7.5, 6 AL 8, 6 AL 9
 */
function parseCSVToProducts(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  
  // Helper function to parse CSV line with quoted fields
  function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }
  
  // Parse header
  const header = parseCSVLine(lines[0]).map(h => h.toUpperCase());
  const idIdx = header.indexOf('ID');
  const modeloIdx = header.indexOf('MODELO');
  const precioIdx = header.indexOf('PRECIO');
  const nombreIdx = header.indexOf('NOMBRE');
  const neIdx = header.indexOf('N/E');
  
  // Columnas de numeración
  const numeracionCols = {
    '2 AL 5':  header.indexOf('2 AL 5'),
    '3 AL 6':  header.indexOf('3 AL 6'),
    '18 AL 21': header.indexOf('18 AL 21'),
    '5 AL 8':  header.indexOf('5 AL 8'),
    '5 AL 7.5': header.indexOf('5 AL 7.5'),
    '6 AL 8':  header.indexOf('6 AL 8'),
    '6 AL 9':  header.indexOf('6 AL 9')
  };
  
  const productos = [];
  let productId = 1;
  
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    
    // Skip empty rows
    if (!cells[0]) continue;
    
    const fullId = cells[idIdx] || productId;
    const modelo = cells[modeloIdx] || '';
    const precio = parseInt(cells[precioIdx]) || 0;
    const nombreRaw = (cells[nombreIdx] || modelo).trim();
    const nombre = nombreRaw
      .replace(/\s+tac[oó]n\s+[\d.]+\s*cm/gi, '')
      .replace(/\s+[\d.]+\s*cm/gi, '')
      .replace(/\s+tac[oó]n\b/gi, '')
      .replace(/\s+suela\s+\w+/gi, '')
      .replace(/\s+cocido\b/gi, '')
      .replace(/\s+goma\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Extraer especificaciones del nombre original para la descripción
    const specs = [];
    const taconMatch = nombreRaw.match(/tac[oó]n\s+([\d.]+)\s*cm/i);
    if (taconMatch) specs.push('Tacón de ' + taconMatch[1] + ' cm');
    else { const cmMatch = nombreRaw.match(/([\d.]+)\s*cm/i); if (cmMatch) specs.push('Altura ' + cmMatch[1] + ' cm'); }
    const suelaMatch = nombreRaw.match(/suela\s+(\w+)/i);
    if (suelaMatch) specs.push('Suela ' + suelaMatch[1]);
    if (/cocido/i.test(nombreRaw)) specs.push('Costura cocida');
    const descripcionBase = (specs.length ? specs.join('. ') + '. ' : '') + 'Venta por mayoreo, mínimo media docena del mismo color y modelo.';
    
    if (!nombre || precio === 0) continue;
    
    // Determine available numeraciones
    const tallas = [];
    const tallasEspecial = [];
    let tieneEspecial = false;
    
    // Check N/E (special numeraciÃ³n)
    if (cells[neIdx] && cells[neIdx].toUpperCase() === 'SI') {
      tieneEspecial = true;
      tallasEspecial.push(3, 4, 5, 6, 7, 8); // Default special sizes
    }
    
    // Check standard numeraciones — guardar stock real (número de pares)
    Object.entries(numeracionCols).forEach(([rango, colIdx]) => {
      if (colIdx !== -1 && cells[colIdx]) {
        const value = cells[colIdx].toUpperCase().trim();
        let stock = 0;
        if (value === 'SI') {
          stock = 999; // SI sin número = disponible sin límite conocido
        } else if (value && value !== 'NO' && !isNaN(value)) {
          stock = parseInt(value) || 0;
        }
        // Agregar la numeración siempre (con stock 0 = sobre pedido)
        if (value && value !== 'NO') {
          tallas.push({ rango, precio, stock });
        }
      }
    });
    
    // If no tallas defined, use default
    if (tallas.length === 0) {
      tallas.push({ rango: '2 AL 5', precio });
    }
    
    // Extract base ID (e.g., "095" from "095/P.D/5")
    const baseId = String(fullId).split('/')[0];
    
    // Extract variant code (e.g., "P.D" from "095/P.D/5")
    const variantCode = String(fullId).split('/')[1];
    
    // Generar ID único que funcione con baseIds alfanuméricos (095, BCÑ, CÑ, MÑ, etc.)
    // Usar hash simple del fullId para garantizar unicidad
    let hash = 0;
    const idStr = String(fullId);
    for (let c = 0; c < idStr.length; c++) {
      hash = ((hash << 5) - hash) + idStr.charCodeAt(c);
      hash |= 0;
    }
    const uniqueId = Math.abs(hash);
    
    // Mapa de baseId a carpeta y prefijo
    const carpetaMap = { 'BCÑ': 'BCN', 'CÑ': 'CNA', 'MÑ': 'MNO', '950': 'NK950', '954': 'NK954' };
    const prefijoMap = { 'BCÑ': 'BCN', 'CÑ': 'CNA', 'MÑ': 'MNO' };
    const carpeta = carpetaMap[baseId] || baseId;
    const prefijo = prefijoMap[baseId] || baseId;
    const altura = String(fullId).split('/')[2] || '5';

    const MODELOS_MM_IDS = ['T90', '950', '954'];
    const MODELOS_MM_MODELO = ['EC', 'MJR', 'PRM', 'PLTF'];
    const esModeloMM = MODELOS_MM_IDS.includes(baseId) || MODELOS_MM_MODELO.includes(modelo);

    // Para modelos sin slash en el ID, el fullId ES el nombre del archivo
    const esIdSimple = !String(fullId).includes('/');

    let imagePath;
    if (esIdSimple) {
      // ID simple: el fullId es el nombre del archivo de imagen
      // Buscar en la carpeta del modelo
      const carpetaModelo = modelo === 'EC' ? 'DUNKE' : modelo;
      imagePath = 'img/' + carpetaModelo + '/' + String(fullId) + '.png';
    } else if (baseId === '954') {
      imagePath = 'img/954/954_' + variantCode + '_' + altura + '.png';
    } else if (baseId === '950') {
      imagePath = 'img/950/950_' + variantCode + '_' + altura + '.png';
    } else if (baseId === 'T90') {
      imagePath = 'img/T90/T90_' + variantCode + '_' + altura + '.png';
    } else {
      imagePath = 'img/' + carpeta + '/' + prefijo + '_' + variantCode + '_' + altura + '.jpg';
    }
    const fallbackImage = imagePath;

    // Modelos multimarca fijos: T90, NK950, NK954, EC, MJR, PRM, PLTF

    // Para modelos multimarca: bloques fijos de numeracion con precios por modelo
    let tallasFinales = tallas;
    if (esModeloMM) {
      const modeloKey = MODELOS_MM_IDS.includes(baseId) ? baseId : modelo;
      if (modeloKey === '950' || modeloKey === '954') {
        tallasFinales = [
          { rango: '2 AL 5',   precio: 200, stock: 999 },
          { rango: '3 AL 6',   precio: 200, stock: 999 },
          { rango: '5 AL 7.5', precio: 205, stock: 999 },
          { rango: '5 AL 8',   precio: 205, stock: 999 }
        ];
      } else if (modeloKey === 'T90') {
        tallasFinales = [
          { rango: '2 AL 5',   precio: 315, stock: 999 },
          { rango: '3 AL 6',   precio: 315, stock: 999 },
          { rango: '5 AL 7.5', precio: 320, stock: 999 },
          { rango: '5 AL 8',   precio: 320, stock: 999 }
        ];
      } else if (modeloKey === 'EC') {
        // DUNKE: incluir 18 AL 21 solo si la columna 18 AL 21 en el sheet dice SI
        const tiene18al21 = cells[numeracionCols['18 AL 21']] &&
          cells[numeracionCols['18 AL 21']].toUpperCase().trim() === 'SI';
        tallasFinales = [];
        if (tiene18al21) tallasFinales.push({ rango: '18 AL 21', precio: 175, stock: 999 });
        tallasFinales.push(
          { rango: '2 AL 5',   precio: 200, stock: 999 },
          { rango: '3 AL 6',   precio: 200, stock: 999 },
          { rango: '5 AL 7.5', precio: 205, stock: 999 },
          { rango: '5 AL 8',   precio: 205, stock: 999 }
        );
      } else if (modeloKey === 'MJR') {
        tallasFinales = [
          { rango: '5 AL 7.5', precio: 330, stock: 999 },
          { rango: '5 AL 8',   precio: 330, stock: 999 }
        ];
      } else if (modeloKey === 'PRM') {
        tallasFinales = [
          { rango: '5 AL 7.5', precio: 350, stock: 999 },
          { rango: '5 AL 8',   precio: 350, stock: 999 }
        ];
      } else if (modeloKey === 'PLTF') {
        tallasFinales = [
          { rango: '2 AL 5', precio: 240, stock: 999 },
          { rango: '3 AL 6', precio: 240, stock: 999 }
        ];
      }
    }

    const producto = {
      id: uniqueId,
      fullId: fullId,
      baseId: baseId,
      variantCode: variantCode,
      nombre,
      modelo,
      categoria: esModeloMM ? 'multimarca' : determinateCategory(nombre, modelo),
      precio,
      descripcion: descripcionBase,
      tallas: tallasFinales,
      color: 'Varios',
      imagen: imagePath,
      imagenDetalle: imagePath,
      imagenFallback: fallbackImage,
      sinSurtidoEspecial: esModeloMM
    };
    
    if (tieneEspecial) {
      producto.especial = true;
      producto.tallasEspecial = tallasEspecial;
    }
    
    productos.push(producto);
    productId++;
  }
  
  return productos;
}

/**
 * Determine product category based on name or model
 */
function determinateCategory(nombre, modelo) {
  const text = (nombre + ' ' + modelo).toLowerCase();

  const MODELOS_MM_CAT = ['T90', '950', '954', 'EC', 'MJR', 'PRM', 'PLTF'];
  if (MODELOS_MM_CAT.includes(modelo)) return 'multimarca';

  if (text.includes('escolar')) return 'escolar';
  if (text.includes('bota')) return 'bota';
  if (text.includes('tenis') || text.includes('tennis')) return 'tenis';
  if (text.includes('zapatilla') || text.includes('dama') || text.includes('mujer')
      || text.includes('caña') || text.includes('moño') || text.includes('sandalia')
      || text.includes('cana') || text.includes('mono')
      || text.includes('mule') || text.includes('stiletto') || text.includes('pump')) return 'dama';
  if (text.includes('caballero') || text.includes('hombre')) return 'caballero';
  if (text.includes('vestir') || text.includes('formal')) return 'vestir';
  if (text.includes('multimarca')) return 'multimarca';

  return 'multimarca';
}

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
  showToast('Â¡Producto agregado al carrito!', 'success');
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

  let mensaje = '*PEDIDO - Distribuidora PRZ*\n\n';
  mensaje += 'Cliente: ' + nombre + '\n';
  mensaje += 'Tel: ' + telefono + '\n\n';
  mensaje += '*Productos:*\n';

  let hayEntregaInmediata = false;
  let haySobrePedido = false;

  cart.forEach(item => {
    const subtotalItem = item.tallas.reduce((s, t) => {
      const precio = t.precio || item.precio;
      return s + (precio * t.cantidad);
    }, 0);

    mensaje += '\n- *' + item.nombre + '*\n';

    item.tallas.forEach(t => {
      const precio = t.precio || item.precio;
      if (item.sobrePedido) { haySobrePedido = true; }
      else { hayEntregaInmediata = true; }
      const entrega = item.sobrePedido ? '[Sobre pedido ~20 dias]' : '[Entrega inmediata]';
      mensaje += '  Numeracion ' + t.talla + ': ' + t.cantidad + ' pares x $' + precio + ' = $' + (precio * t.cantidad) + ' ' + entrega + '\n';
    });

    mensaje += '  Subtotal: ' + formatCurrency(subtotalItem) + '\n';
  });

  const total = getCartTotal();
  mensaje += '\n*TOTAL: ' + formatCurrency(total) + '*\n';

  if (hayEntregaInmediata && haySobrePedido) {
    mensaje += '\nATENCION: Este pedido tiene productos de entrega inmediata y productos sobre pedido (~20 dias habiles). Se requiere anticipo para los productos sobre pedido.\n';
  } else if (haySobrePedido) {
    mensaje += '\nPedido sobre pedido - entrega aprox. 20 dias habiles. Se requiere anticipo.\n';
  } else {
    mensaje += '\nTodos los productos estan disponibles para entrega inmediata.\n';
  }

  mensaje += '\n_Pedido generado desde PRZ Calzado Mayoreo_';
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
// PÃGINA: INDEX
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
// PÃGINA: CATÃLOGO
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
          <p style="font-size:1.1rem">No hay productos en esta categorÃ­a.</p>
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

function _labelCategoria(cat) {
  return cat === 'dama' ? 'Zapatilla' : cat.charAt(0).toUpperCase() + cat.slice(1);
}

function renderProductCard(producto) {
  const tieneImagen = !!producto.imagen;
  const imagenHTML = tieneImagen
    ? `<img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" onerror="this.src='${producto.imagenFallback || 'img/095/095_P.D_5.PNG'}'" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">`
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
// PÃGINA: PRODUCTO DETALLE
// ============================================
function initProducto() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  const producto = PRODUCTOS.find(p => p.id === id);

  if (!producto) {
    document.getElementById('product-detail-content').innerHTML = `
      <div style="text-align:center;padding:5rem 2rem;grid-column:1/-1">
        <h2 style="font-size:2rem;margin-bottom:1rem">Producto no encontrado</h2>
        <a href="catalogo.html" class="btn btn-primary">Ver CatÃ¡logo</a>
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

  // Imagen real si existe
  const imgContainer = document.getElementById('product-detail-image');
  if (imgContainer && (producto.imagenDetalle || producto.imagen)) {
    const src = producto.imagenDetalle || producto.imagen;
    imgContainer.classList.add('has-image');
    const fallback = producto.imagenFallback || 'img/095/095_P.D_5.PNG';
    imgContainer.innerHTML = `<img src="${src}" alt="${producto.nombre}" onerror="this.src='${fallback}'">`;
  }

  // Esferitas de color — todos los productos con el mismo baseId
  const coloresDelModelo = PRODUCTOS.filter(p => p.baseId === producto.baseId);
  if (coloresDelModelo.length > 1) {
    const colorMap = {
      // Neutros
      'negro':      '#111111',
      'blanco':     '#f5f5f0',
      'hueso':      '#e8dcc8',
      'nude':       '#d4a882',
      'beige':      '#c9a87a',
      'natural':    '#c8a87a',
      'crema':      '#f0e6cc',
      // Metálicos
      'dorado':     '#c9a030',
      'oro':        '#c9a030',
      'plateado':   '#b0b0b8',
      'plata':      '#b0b0b8',
      'bronce':     '#a0724a',
      'cobre':      '#b87040',
      // Rosas y rojos
      'rosa':       '#e8829a',
      'palo de rosa':'#d4a0a8',
      'fucsia':     '#d42080',
      'rojo':       '#cc2020',
      'vino':       '#7a1a2e',
      'guinda':     '#8b1a2e',
      'coral':      '#e06050',
      // Azules y morados
      'azul':       '#1a4fcc',
      'marino':     '#0a1a5c',
      'turquesa':   '#20a0a0',
      'morado':     '#6b3fa0',
      'lila':       '#a080c0',
      'lavanda':    '#b090d0',
      // Verdes
      'verde':      '#2d7a3a',
      'menta':      '#80c0a0',
      'olivo':      '#6b7a30',
      // Cafés y tierras
      'cafe':       '#7b4f2e',
      'café':       '#7b4f2e',
      'camel':      '#c09050',
      'miel':       '#c4882a',
      'tabaco':     '#8b5a2a',
      'chocolate':  '#4a2a1a',
      'tan':        '#c8a060',
      // Grises
      'gris':       '#808080',
      'plomo':      '#909090',
      'perla':      '#e0d8d0',
      // Naranja y amarillo
      'naranja':    '#e06020',
      'mostaza':    '#c8a020',
      'amarillo':   '#e0c020',
      // Multicolor
      'multicolor': 'linear-gradient(135deg,#e8829a 0%,#c9a030 50%,#1a4fcc 100%)',
      'varios':     'linear-gradient(135deg,#e8829a 0%,#c9a030 50%,#1a4fcc 100%)',
    };

    function getColorBg(p) {
      const texto = ((p.color || '') + ' ' + (p.nombre || '')).toLowerCase();
      for (const [key, val] of Object.entries(colorMap)) {
        if (texto.includes(key)) return val;
      }
      return 'rgba(255,255,255,0.25)';
    }

    const esferitasWrap = document.createElement('div');
    esferitasWrap.style.cssText = 'margin-top:0.75rem;display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;';
    esferitasWrap.innerHTML =
      '<span style="font-size:0.75rem;color:var(--white-60);">Colores:</span>' +
      coloresDelModelo.map(p => {
        const esActual = p.id === producto.id;
        const bg = getColorBg(p);
        const border = esActual ? '2px solid var(--blue-bright)' : '2px solid rgba(255,255,255,0.2)';
        const shadow = esActual ? '0 0 0 3px rgba(0,102,255,0.4)' : 'none';
        const title = p.nombre + (p.color && p.color !== 'Varios' ? ' — ' + p.color : '');
        return `<a href="producto.html?id=${p.id}" title="${title}"
          style="width:26px;height:26px;border-radius:50%;
                 background:url('${p.imagen}') center/cover no-repeat, rgba(255,255,255,0.1);
                 border:${border};display:inline-block;flex-shrink:0;
                 box-shadow:${shadow};transition:transform 0.15s;overflow:hidden;"
          onmouseover="this.style.transform='scale(1.25)'"
          onmouseout="this.style.transform='scale(1)'"></a>`;
      }).join('');
    imgContainer.parentElement.appendChild(esferitasWrap);
  }

  // Tallas - Mostrar numeraciones con controles +/−
  const tallasContainer = document.getElementById('tallas-container');
  if (tallasContainer) {
    // Normalizar tallas: pueden ser objetos {rango, precio} o números simples
    const tallasNormalizadas = producto.tallas.map(t => {
      if (typeof t === 'object' && t.rango) {
        return { rango: t.rango, precio: t.precio || producto.precio, stock: t.stock !== undefined ? t.stock : 999 };
      }
      return { rango: String(t), precio: producto.precio, stock: 999 };
    });

    // Asegurar que siempre aparezcan 3 AL 6 y 18 AL 21 aunque no estén en el sheet
    // 18 AL 21 solo aplica para modelo 095 (zapatillas infantiles)
    const con18al21 = producto.baseId === '095';
    const rangosExistentes = tallasNormalizadas.map(t => t.rango);
    const esMMProd = ['T90', '950', '954', 'EC', 'MJR', 'PRM', 'PLTF'].includes(producto.baseId) ||
                     ['T90', '950', '954', 'EC', 'MJR', 'PRM', 'PLTF'].includes(producto.modelo);
    if (!esMMProd && !rangosExistentes.includes('3 AL 6')) {
      tallasNormalizadas.push({ rango: '3 AL 6', precio: producto.precio, stock: 0 });
    }
    if (con18al21 && !rangosExistentes.includes('18 AL 21')) {
      tallasNormalizadas.push({ rango: '18 AL 21', precio: 200, stock: 0, especial: true });
    }
    // Marcar 18 AL 21 como especial si ya existe y ajustar precio
    tallasNormalizadas.forEach(t => {
      if (t.rango === '18 AL 21') { t.especial = true; t.precio = 200; }
    });
    // Si no aplica 18 AL 21, quitarlo aunque venga del sheet
    if (!con18al21) {
      const idx = tallasNormalizadas.findIndex(t => t.rango === '18 AL 21');
      if (idx !== -1) tallasNormalizadas.splice(idx, 1);
    }

    // Ordenar: 18 AL 21 siempre primero, el resto de menor a mayor
    tallasNormalizadas.sort((a, b) => {
      if (a.rango === '18 AL 21') return -1;
      if (b.rango === '18 AL 21') return 1;
      const numA = parseFloat(a.rango.split(' ')[0]) || 0;
      const numB = parseFloat(b.rango.split(' ')[0]) || 0;
      return numA - numB;
    });

    tallasContainer.innerHTML = tallasNormalizadas.map(t => {
      const tallaId = String(t.rango).replace(/\s/g, '_');
      const precioNumeracion = t.precio || producto.precio;
      const mediaDoc = formatCurrency(precioNumeracion * 6);
      const stock = t.stock !== undefined ? t.stock : 999;
      const disponible = stock > 0;

      const semaforo = disponible
        ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:0.72rem;font-weight:600;color:#00cc66;">
            <span style="width:8px;height:8px;border-radius:50%;background:#00cc66;display:inline-block;flex-shrink:0;"></span>
            ${stock >= 999 ? 'Disponible' : stock + ' pares disponibles'}
           </span>`
        : `<span style="display:inline-flex;align-items:center;gap:4px;font-size:0.72rem;font-weight:600;color:#ffaa00;">
            <span style="width:8px;height:8px;border-radius:50%;background:#ffaa00;display:inline-block;flex-shrink:0;"></span>
            Disponible sobre pedido
           </span>`;

      return `
        <div class="talla-row" id="talla-row-${tallaId}" data-precio="${precioNumeracion}">
          <div class="talla-info">
            <div class="talla-label">Numeración ${t.rango}</div>
            <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;margin-top:0.15rem;">
              <span class="talla-price">${formatCurrency(precioNumeracion)} c/u · media doc. ${mediaDoc}</span>
              ${semaforo}
            </div>
          </div>
          <div class="talla-controls">
            <button class="qty-btn" onclick="changeQty('${tallaId}', -6)" title="Restar">−</button>
            <input type="number" id="qty-${tallaId}" class="qty-input" value="0" min="0" step="6" onchange="onQtyChange('${tallaId}', this.value)">
            <button class="qty-btn" onclick="changeQty('${tallaId}', 6)" title="Sumar">+</button>
          </div>
        </div>
      `;
    }).join('');

    // Botón "Armar Surtido Especial" con leyenda de tiempo
    if (!producto.sinSurtidoEspecial) {
      const armarWrap = document.createElement('div');
      armarWrap.style.marginTop = '1rem';
      armarWrap.innerHTML = `
        <button class="btn btn-secondary btn-full" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;flex-wrap:wrap;" onclick="abrirSurtidoEspecial(${producto.id})">
          <span style="white-space:nowrap;">Armar Surtido Especial</span>
          <span style="font-size:0.75rem;opacity:0.7;font-weight:400;white-space:nowrap;">(6 tallas a elegir)</span>
        </button>
        <p style="font-size:0.72rem;color:var(--white-40);text-align:center;margin-top:0.5rem;line-height:1.4;">
          ⏱ Los surtidos especiales tardan aprox. 20 días hábiles y requieren anticipo
        </p>
      `;
      tallasContainer.parentElement.appendChild(armarWrap);
    }
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
        showToast('Mínimo ' + MINIMO_PARES + ' pares para agregar al carrito', 'error');
        return;
      }

      // Verificar si alguna numeración seleccionada tiene stock 0
      const tallasNormalizadas = producto.tallas.map(t =>
        typeof t === 'object' && t.rango ? t : { rango: String(t), stock: 999 }
      );
      const tieneSobrePedido = tallasSeleccionadas.some(sel => {
        const info = tallasNormalizadas.find(t => t.rango === sel.talla);
        return info && info.stock === 0;
      });

      addToCart({
        productId: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        color: producto.color,
        tallas: tallasSeleccionadas,
        sobrePedido: tieneSobrePedido
      });

      if (tieneSobrePedido) {
        showToast('⏱ Una o más numeraciones están disponibles sobre pedido — entrega aprox. 20 días hábiles', 'info');
      } else {
        showToast('¡Producto agregado al carrito!', 'success');
      }

      // Reset quantities
      producto.tallas.forEach(t => {
        const tallaId = String(t.rango).replace(/\s/g, '_');
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
  // Normalizar tallas: pueden ser objetos {rango, precio} o números simples
  const tallasNormalizadas = (tallas || []).map(t => {
    if (typeof t === 'object' && t.rango) return t;
    return { rango: String(t), precio: null };
  });

  return tallasNormalizadas
    .map(t => {
      const tallaId = String(t.rango).replace(/\s/g, '_');
      const row = document.getElementById(`talla-row-${tallaId}`);
      const precioPorFila = row ? parseInt(row.dataset.precio) : null;
      return {
        talla: t.rango,
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
      statusEl.innerHTML = `<div class="minimum-warning">&#9888;&#65039; Selecciona al menos 6 pares (media docena) del mismo modelo</div>`;
    } else if (!meetsMinimum) {
      statusEl.innerHTML = `<div class="minimum-warning">&#9888;&#65039; Necesitas ${MINIMO_PARES - totalPares} par(es) mas para el minimo</div>`;
    } else {
      statusEl.innerHTML = `<div class="minimum-ok">&#9989; Listo! ${totalPares} pares seleccionados - ${formatCurrency(total)}</div>`;
    }
  }

  if (addBtn) addBtn.disabled = !meetsMinimum;

  // Barra flotante
  _actualizarBarraFlotante(producto, totalPares, total, meetsMinimum);
}

// ============================================
// PÃGINA: CARRITO
// ============================================
function initCarrito() {
  renderCart();

  const sendBtn = document.getElementById('send-whatsapp-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast('El carrito estÃ¡ vacÃ­o', 'error');
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
      if (confirm('Â¿Vaciar el carrito?')) {
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
          ${item.sobrePedido ? `<div style="display:inline-flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:600;color:#ffaa00;margin-bottom:0.3rem;"><span style="width:7px;height:7px;border-radius:50%;background:#ffaa00;display:inline-block;"></span>Disponible sobre pedido · ~20 días hábiles</div>` : ''}
          <div style="font-size:0.8rem;color:var(--white-60);margin-bottom:0.4rem">Color: ${item.color || 'N/A'}</div>
          <div class="cart-item-tallas">${tallasChips}</div>
          <div class="cart-item-price">${totalItem} pares Ã— ${formatCurrency(item.precio)}/pieza</div>
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
// ARMAR SURTIDO ESPECIAL - MODAL
// ============================================
function abrirSurtidoEspecial(productoId) {
  const producto = PRODUCTOS.find(p => p.id === productoId);
  if (!producto) return;

  const con18al21 = producto.baseId === '095';
  const grupo1 = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
  const grupo2 = [18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5];

  function col(grupo, gid) {
    return grupo.map(function(t) {
      var id = gid + '_' + String(t).replace('.', '_');
      return '<div style="display:flex;align-items:center;justify-content:space-between;background:var(--white-10);border:1px solid var(--white-20);border-radius:var(--radius-md);padding:0.35rem 0.5rem;" id="row-' + id + '">'
        + '<span style="font-weight:700;font-size:0.85rem;">' + t + '</span>'
        + '<div style="display:flex;align-items:center;gap:0.25rem;">'
        + '<button onclick="cambiarSurtido(\'' + id + '\',-1,\'' + gid + '\')" style="width:22px;height:22px;border-radius:50%;background:var(--white-20);border:none;color:var(--white);font-size:0.9rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;">-</button>'
        + '<span id="qty-' + id + '" style="font-weight:800;font-size:0.85rem;min-width:14px;text-align:center;">0</span>'
        + '<button onclick="cambiarSurtido(\'' + id + '\',1,\'' + gid + '\')" style="width:22px;height:22px;border-radius:50%;background:var(--white-20);border:none;color:var(--white);font-size:0.9rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;">+</button>'
        + '</div></div>';
    }).join('');
  }

  var gridCols = con18al21 ? '1fr 1fr' : '1fr';
  var col2HTML = con18al21
    ? '<div id="se-g2-wrap"><div style="font-size:0.65rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--blue-light);margin-bottom:0.4rem;text-align:center;">18 al 21.5</div><div style="display:flex;flex-direction:column;gap:0.25rem;">' + col(grupo2, 'g2') + '</div></div>'
    : '';

  var modal = document.createElement('div');
  modal.id = 'modal-surtido-especial';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:1rem;';

  modal.innerHTML = ''
    + '<div style="background:var(--bg-mid);border:1px solid rgba(0,102,255,0.3);border-radius:var(--radius-xl);padding:1.5rem;max-width:560px;width:100%;box-shadow:var(--shadow-glow);">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">'
    + '<div><h3 style="font-size:1.1rem;font-weight:800;">Armar Surtido Especial</h3>'
    + '<p style="font-size:0.75rem;color:var(--white-60);margin-top:0.15rem;">Elige tallas - deben sumar 6 pares</p></div>'
    + '<button onclick="cerrarSurtidoEspecial()" style="background:var(--white-10);border:none;color:var(--white);width:30px;height:30px;border-radius:50%;font-size:1rem;cursor:pointer;flex-shrink:0;">&#x2715;</button>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:' + gridCols + ';gap:0.75rem;margin-bottom:1rem;">'
    + '<div id="se-g1-wrap"><div style="font-size:0.65rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--blue-light);margin-bottom:0.4rem;text-align:center;">2 al 6</div><div style="display:flex;flex-direction:column;gap:0.25rem;">' + col(grupo1, 'g1') + '</div></div>'
    + col2HTML
    + '</div>'
    + '<div style="background:rgba(0,102,255,0.1);border:1px solid rgba(0,102,255,0.2);border-radius:var(--radius-md);padding:0.7rem 1rem;margin-bottom:0.75rem;display:flex;justify-content:space-between;align-items:center;">'
    + '<span style="font-size:0.85rem;color:var(--white-80);">Total de pares</span>'
    + '<span id="se-total" style="font-size:1.4rem;font-weight:900;color:var(--accent);">0 / 6</span>'
    + '</div>'
    + '<div id="se-status" style="margin-bottom:0.6rem;"></div>'
    + '<p style="font-size:0.72rem;color:var(--white-40);text-align:center;margin-bottom:0.6rem;">Los surtidos especiales tardan aprox. 20 dias habiles y requieren anticipo</p>'
    + '<button id="se-btn-agregar" onclick="agregarSurtidoEspecial(' + productoId + ')" class="btn btn-primary btn-full" disabled>Agregar al Carrito</button>'
    + '</div>';

  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) { if (e.target === modal) cerrarSurtidoEspecial(); });
  window._surtidoEspecial = { productoId: productoId, cantidades: {}, grupoActivo: null };
}

function cerrarSurtidoEspecial() {
  const modal = document.getElementById('modal-surtido-especial');
  if (modal) modal.remove();
  window._surtidoEspecial = null;
}

function cambiarSurtido(id, delta, grupo) {
  const data = window._surtidoEspecial;
  if (!data) return;

  if (data.grupoActivo && data.grupoActivo !== grupo) return;

  const totalActual = Object.values(data.cantidades).reduce((s, v) => s + v, 0);
  const actual = data.cantidades[id] || 0;
  const nuevo = Math.max(0, actual + delta);

  if (delta > 0 && totalActual >= 6) return;

  data.cantidades[id] = nuevo;

  const qtyEl = document.getElementById('qty-' + id);
  if (qtyEl) qtyEl.textContent = nuevo;

  const rowEl = document.getElementById('row-' + id);
  if (rowEl) {
    rowEl.style.borderColor = nuevo > 0 ? 'rgba(0,102,255,0.6)' : 'var(--white-20)';
    rowEl.style.background   = nuevo > 0 ? 'rgba(0,102,255,0.15)' : 'var(--white-10)';
  }

  const nuevoTotal = Object.values(data.cantidades).reduce((s, v) => s + v, 0);

  if (nuevoTotal === 0) {
    data.grupoActivo = null;
    _surtidoSetGrupo(null);
  } else if (!data.grupoActivo) {
    data.grupoActivo = grupo;
    _surtidoSetGrupo(grupo);
  }

  _surtidoActualizarUI(nuevoTotal);
}

function _surtidoSetGrupo(grupoActivo) {
  ['g1', 'g2'].forEach(g => {
    const wrap = document.getElementById('se-' + g + '-wrap');
    if (!wrap) return;
    if (grupoActivo === null || grupoActivo === g) {
      wrap.style.opacity = '1';
      wrap.style.pointerEvents = '';
    } else {
      wrap.style.opacity = '0.3';
      wrap.style.pointerEvents = 'none';
    }
  });
}

function _surtidoActualizarUI(total) {
  const totalEl = document.getElementById('se-total');
  const statusEl = document.getElementById('se-status');
  const addBtn   = document.getElementById('se-btn-agregar');

  if (totalEl) {
    totalEl.textContent = total + ' / 6';
    totalEl.style.color = total === 6 ? 'var(--success)' : 'var(--accent)';
  }
  if (statusEl) {
    if (total === 0)     statusEl.innerHTML = '';
    else if (total < 6) statusEl.innerHTML = '<div class="minimum-warning">Faltan ' + (6 - total) + ' par(es)</div>';
    else                statusEl.innerHTML = '<div class="minimum-ok">&#9989; ¡Listo! Media docena completa</div>';
  }
  if (addBtn) addBtn.disabled = total !== 6;
}

function agregarSurtidoEspecial(productoId) {
  const data = window._surtidoEspecial;
  const producto = PRODUCTOS.find(p => p.id === productoId);
  if (!data || !producto) return;

  const total = Object.values(data.cantidades).reduce((s, v) => s + v, 0);
  if (total !== 6) return;

  const tallasArray = [];
  Object.entries(data.cantidades).forEach(([id, qty]) => {
    if (qty > 0) {
      const tallaStr = id.replace(/^g[12]_/, '').replace('_', '.');
      tallasArray.push({ talla: 'Talla ' + tallaStr, cantidad: qty, precio: producto.precio });
    }
  });

  addToCart({
    productId: producto.id,
    nombre: producto.nombre + ' (Surtido Especial)',
    categoria: producto.categoria,
    precio: producto.precio,
    color: producto.color,
    tallas: tallasArray
  });

  cerrarSurtidoEspecial();
}

// ============================================
// BARRA FLOTANTE DE ACCION
// ============================================
function _actualizarBarraFlotante(producto, totalPares, total, meetsMinimum) {
  let barra = document.getElementById('barra-flotante');

  if (!meetsMinimum) {
    if (barra) barra.style.transform = 'translateY(100%)';
    return;
  }

  // Crear barra si no existe
  if (!barra) {
    barra = document.createElement('div');
    barra.id = 'barra-flotante';
    barra.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:999',
      'background:var(--bg-mid)',
      'border-top:1px solid rgba(0,102,255,0.3)',
      'padding:1rem 1.5rem',
      'display:flex', 'align-items:center', 'justify-content:space-between', 'gap:1rem',
      'box-shadow:0 -4px 24px rgba(0,0,0,0.4)',
      'transform:translateY(100%)',
      'transition:transform 0.3s ease',
      'flex-wrap:wrap'
    ].join(';');
    document.body.appendChild(barra);
  }

  barra.innerHTML = `
    <div style="flex:1;min-width:160px;">
      <div style="font-size:0.8rem;color:var(--white-60);">Resumen del pedido</div>
      <div style="font-weight:800;font-size:1rem;">${totalPares} pares &mdash; ${formatCurrency(total)}</div>
    </div>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
      <button
        onclick="_hacerPedidoDirecto()"
        style="padding:0.75rem 1.25rem;background:transparent;border:2px solid var(--blue-bright);
               color:var(--blue-bright);border-radius:var(--radius-lg);font-weight:700;
               font-size:0.9rem;cursor:pointer;white-space:nowrap;">
        Hacer Pedido
      </button>
      <button
        onclick="_agregarAlCarritoDesdeFlotante()"
        style="padding:0.75rem 1.25rem;background:var(--blue-bright);border:none;
               color:var(--white);border-radius:var(--radius-lg);font-weight:700;
               font-size:0.9rem;cursor:pointer;white-space:nowrap;">
        Agregar al Carrito
      </button>
    </div>
  `;

  // Guardar referencia al producto actual
  barra._productoId = producto.id;

  // Mostrar con animación
  requestAnimationFrame(() => { barra.style.transform = 'translateY(0)'; });

  // Ocultar barra cuando los botones fijos son visibles
  if (!barra._observer) {
    const btnFijo = document.getElementById('add-to-cart-btn');
    if (btnFijo) {
      barra._observer = new IntersectionObserver(entries => {
        const visible = entries[0].isIntersecting;
        barra.style.transform = visible ? 'translateY(100%)' : 'translateY(0)';
      }, { threshold: 0.5 });
      barra._observer.observe(btnFijo);
    }
  }
}

function _hacerPedidoDirecto() {
  const barra = document.getElementById('barra-flotante');
  if (!barra) return;
  const producto = PRODUCTOS.find(p => p.id === barra._productoId);
  if (!producto) return;

  const tallasSeleccionadas = getTallasSeleccionadas(producto.tallas);
  const totalPares = tallasSeleccionadas.reduce((s, t) => s + t.cantidad, 0);
  if (totalPares < MINIMO_PARES) return;

  // Detectar cuáles numeraciones tienen stock 0
  const tallasNormalizadas = producto.tallas.map(t =>
    typeof t === 'object' && t.rango ? t : { rango: String(t), stock: 999 }
  );

  let hayEntregaInmediata = false;
  let haySobrePedido = false;
  const lineasTallas = [];

  tallasSeleccionadas.forEach(t => {
    const info = tallasNormalizadas.find(n => n.rango === t.talla);
    const esSobrePedido = info && info.stock === 0;
    if (esSobrePedido) haySobrePedido = true;
    else hayEntregaInmediata = true;

    const precio = t.precio || producto.precio;
    const etiqueta = esSobrePedido ? '[Sobre pedido ~20 dias]' : '[Entrega inmediata]';
    lineasTallas.push('  Numeracion ' + t.talla + ': ' + t.cantidad + ' pares x $' + precio + ' ' + etiqueta);
  });

  const total = tallasSeleccionadas.reduce((s, t) => s + ((t.precio || producto.precio) * t.cantidad), 0);

  let msg = 'Hola, quiero hacer un pedido:\n\n';
  msg += '*' + producto.nombre + '*\n';
  msg += lineasTallas.join('\n') + '\n';
  msg += '\nTotal: ' + formatCurrency(total) + '\n';

  // Aviso de disponibilidad
  if (hayEntregaInmediata && haySobrePedido) {
    msg += '\nATENCION: El modelo *' + producto.nombre + '* tiene numeraciones de entrega inmediata y otras sobre pedido (~20 dias habiles). Se requiere anticipo para las numeraciones sobre pedido.';
  } else if (haySobrePedido) {
    msg += '\nATENCION: El modelo *' + producto.nombre + '* esta disponible sobre pedido (~20 dias habiles). Se requiere anticipo.';
  } else {
    msg += '\nTodas las numeraciones de *' + producto.nombre + '* estan disponibles para entrega inmediata.';
  }

  // Mostrar toast si hay sobre pedido
  if (haySobrePedido) {
    showToast('⏱ Una o más numeraciones están disponibles sobre pedido — ~20 días hábiles', 'info');
  }

  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
}

function _agregarAlCarritoDesdeFlotante() {
  document.getElementById('add-to-cart-btn')?.click();
}

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  const page = document.body.dataset.page;

  // Render inicial para páginas que no necesitan datos del sheet
  if (page === 'index') initIndex();
  else if (page === 'catalogo') initCatalogo();
  else if (page === 'carrito') initCarrito();

  // Cargar desde Google Sheets
  try {
    await cargarProductosDesdeGoogleSheets();

    // En página de producto: verificar que el producto existe
    // Si no existe en caché, forzar recarga del sheet
    if (page === 'producto') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = parseInt(urlParams.get('id'));
      const existe = PRODUCTOS.find(p => p.id === id);

      if (!existe) {
        // Producto no encontrado en caché — limpiar y recargar del sheet
        localStorage.removeItem('prz_productos_cache');
        await cargarProductosDesdeGoogleSheets();
      }

      initProducto();
    } else {
      // Re-renderizar catálogo/index con datos frescos
      if (page === 'index') initIndex();
      else if (page === 'catalogo') initCatalogo();
    }
  } catch(e) {
    console.error('Error cargando productos:', e);
    if (page === 'producto') initProducto();
  }
});
