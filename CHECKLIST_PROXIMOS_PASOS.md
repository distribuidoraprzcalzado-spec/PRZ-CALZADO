# ✅ Checklist - Próximos Pasos

## 🎯 Objetivo
Completar la integración del sitio web con Google Sheets y prepararlo para producción.

---

## 📋 Tareas Pendientes

### FASE 1: Verificación y Pruebas (AHORA)

- [ ] **Abrir test-sheets.html en navegador**
  - URL: `file:///C:/Users/Juan Carlos/prz-calzado/test-sheets.html`
  - Verificar que aparezca: "✅ Éxito! Se cargaron 96 productos"
  - Revisar la tabla de primeros 15 productos
  - Verificar que aparezcan las numeraciones correctas

- [ ] **Abrir index.html en navegador**
  - Verificar que cargue correctamente
  - Revisar que aparezca el logo
  - Verificar que se vea bien en móvil

- [ ] **Abrir catalogo.html en navegador**
  - Verificar que aparezcan productos del Google Sheet
  - Probar filtros por categoría
  - Verificar que las imágenes se carguen (si existen)

- [ ] **Abrir producto.html con un producto**
  - URL: `producto.html?id=95001` (o el ID de un producto)
  - Verificar que cargue el producto
  - Verificar que aparezcan las numeraciones
  - Probar agregar al carrito

- [ ] **Abrir carrito.html**
  - Agregar un producto desde producto.html
  - Verificar que aparezca en el carrito
  - Probar enviar pedido por WhatsApp

---

### FASE 2: Organización de Imágenes (PRÓXIMA)

- [ ] **Crear carpetas por numeración en img/095/**
  ```
  img/095/
  ├── 18-21/
  ├── 22-25/
  ├── 23-26/
  └── N-E/
  ```

- [ ] **Mover imágenes a carpetas correspondientes**
  - Revisar qué numeraciones tiene el producto 095
  - Mover imágenes a las carpetas correctas
  - Ejemplo: `095_CH.D_5.PNG` → `img/095/22-25/`

- [ ] **Comprimir imágenes**
  - Usar: https://squoosh.app
  - Objetivo: 200-300KB por imagen
  - Mantener calidad visual

- [ ] **Actualizar app.js para cargar imágenes por numeración**
  - Modificar la función `renderProductCard()`
  - Cambiar ruta de: `img/{baseId}/imagen.jpg`
  - A: `img/{baseId}/{numeracion}/imagen.jpg`

---

### FASE 3: Agregar Más Productos (DESPUÉS)

- [ ] **Extraer imágenes de otros modelos**
  - Revisar qué otros modelos hay en Google Sheet
  - Crear carpetas: `img/950/`, `img/954/`, `img/T90/`, etc.
  - Copiar imágenes correspondientes

- [ ] **Crear imagen principal para cada modelo**
  - Copiar una imagen representativa como `imagen.jpg`
  - Ejemplo: `img/950/imagen.jpg`

- [ ] **Verificar que todas las imágenes estén comprimidas**
  - Máximo 300KB por imagen
  - Mínimo 200KB para buena calidad

---

### FASE 4: Despliegue (FINAL)

- [ ] **Actualizar GitHub Pages**
  - Hacer commit de los cambios
  - Push a la rama main
  - Verificar en: https://distribuidoraprzcalzado-spec.github.io/PRZ-CALZADO

- [ ] **Pruebas en producción**
  - Abrir el sitio en navegador
  - Probar en móvil
  - Verificar que los productos carguen
  - Probar agregar al carrito
  - Probar enviar pedido por WhatsApp

- [ ] **Compartir con cliente**
  - Enviar URL del sitio
  - Pedir feedback
  - Hacer ajustes si es necesario

---

## 🔍 Cómo Verificar que Todo Funciona

### Test 1: Google Sheets
```
1. Abre: test-sheets.html
2. Verifica: "✅ Éxito! Se cargaron 96 productos"
3. Revisa: Tabla de primeros 15 productos
4. Verifica: Base IDs únicos (095, 950, 954, T90, etc.)
```

### Test 2: Catálogo
```
1. Abre: catalogo.html
2. Verifica: Aparezcan productos
3. Prueba: Filtros por categoría
4. Verifica: Imágenes se carguen (si existen)
```

### Test 3: Producto
```
1. Abre: producto.html?id=95001
2. Verifica: Nombre, descripción, precio
3. Verifica: Numeraciones disponibles
4. Prueba: Agregar al carrito
```

### Test 4: Carrito
```
1. Abre: carrito.html
2. Verifica: Producto agregado
3. Prueba: Enviar por WhatsApp
4. Verifica: Mensaje correcto
```

---

## 📊 Estructura de Datos Actual

### Google Sheet
- **URL**: https://docs.google.com/spreadsheets/d/1-9lSJ2UdvV51nQYLoBv-w23clyoKYnR70j0_W18GeAQ
- **Productos**: 96 (filas 2-97)
- **Columnas**: ID, MODELO, PRECIO, NOMBRE, N/E, 2 AL 5, 3 AL 6, 5 AL 8, 5 AL 7.5, 6 AL 8, 6 AL 9

### Carpetas de Imágenes
```
img/
├── 095/          ✅ Creada (15 imágenes)
├── 950/          ⏳ Pendiente
├── 954/          ⏳ Pendiente
├── T90/          ⏳ Pendiente
└── ...
```

---

## 🚀 Comandos Útiles

### Comprimir imágenes (en línea)
1. Ir a: https://squoosh.app
2. Arrastrar imagen
3. Ajustar calidad a 70-80%
4. Descargar

### Crear carpetas en Windows
```powershell
New-Item -ItemType Directory -Path "img/095/18-21" -Force
New-Item -ItemType Directory -Path "img/095/22-25" -Force
New-Item -ItemType Directory -Path "img/095/23-26" -Force
New-Item -ItemType Directory -Path "img/095/N-E" -Force
```

### Copiar archivos en Windows
```powershell
Copy-Item -Path "img/095/095_CH.D_5.PNG" -Destination "img/095/22-25/" -Force
```

---

## 📞 Contacto

**WhatsApp**: +52 2213408041

**Email**: (No configurado)

---

## 📝 Notas Importantes

1. **Fallback**: Si Google Sheets no funciona, el sitio usa 15 productos base
2. **Actualización**: Los productos se cargan cada vez que alguien abre el sitio
3. **Caché**: Los navegadores pueden cachear las imágenes (Ctrl+F5 para limpiar)
4. **Móvil**: Probar siempre en dispositivos móviles
5. **WhatsApp**: El número debe estar en formato internacional (+52...)

---

**Última actualización**: 2026-04-25

