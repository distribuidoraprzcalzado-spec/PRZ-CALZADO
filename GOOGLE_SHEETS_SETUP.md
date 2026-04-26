# Integración Google Sheets - PRZ Calzado

## ✅ Cambios Realizados

### 1. **Productos de Prueba Eliminados**
Se han removido los siguientes productos de prueba del código:
- ID 16: Tenis Future Piel
- ID 17: Nike Court Azul
- ID 18: Zapatilla Prueba
- ID 19: Calzado Prueba 2

Ahora el sitio solo contiene 15 productos base que sirven como fallback si Google Sheets no está disponible.

### 2. **Google Sheets Integration Agregada**
Se han añadido tres funciones principales en `app.js`:

#### `cargarProductosDesdeGoogleSheets()`
- Descarga automáticamente los datos de tu Google Sheet
- Convierte el CSV a objetos de producto
- Reemplaza el array PRODUCTOS con los datos del sheet
- Se ejecuta automáticamente cuando la página carga

#### `parseCSVToProducts(csv)`
- Parsea el CSV del Google Sheet
- Mapea las columnas: ID, MODELO, PRECIO, NOMBRE, N/E, 2 AL 5, 3 AL 6, 5 AL 8, 5 AL 7.5, 6 AL 8, 6 AL 9
- Detecta automáticamente:
  - Numeraciones disponibles (SI/NO en cada columna)
  - Numeración especial (N/E)
  - Categoría del producto (basada en nombre/modelo)

#### `determinateCategory(nombre, modelo)`
- Clasifica automáticamente los productos en categorías
- Busca palabras clave: escolar, bota, tenis, dama, caballero, vestir, multimarca

### 3. **Carga Automática en Página**
El evento `DOMContentLoaded` ahora:
1. Carga productos desde Google Sheets
2. Inicializa la navbar
3. Renderiza la página según el tipo (index, catalogo, producto, carrito)

---

## 📋 Estructura Esperada del Google Sheet

Tu Google Sheet debe tener estas columnas (en este orden):

| ID | MODELO | PRECIO | NOMBRE | N/E | 2 AL 5 | 3 AL 6 | 5 AL 8 | 5 AL 7.5 | 6 AL 8 | 6 AL 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| 095 | Future Piel | 235 | Tenis Future | SI | SI | SI | SI | NO | NO | NO |
| 096 | Nike Court | 320 | Nike Court Azul | NO | SI | SI | SI | NO | NO | NO |
| 097 | Escolar Basic | 260 | Zapato Escolar | NO | NO | NO | NO | SI | SI | SI |

### Explicación de Columnas:

- **ID**: Identificador único del producto (ej: 095, 096)
- **MODELO**: Nombre del modelo (ej: Future Piel, Nike Court)
- **PRECIO**: Precio por pieza en pesos (ej: 235, 320)
- **NOMBRE**: Nombre completo del producto (ej: Tenis Future, Nike Court Azul)
- **N/E**: "SI" si tiene numeración especial (permite seleccionar tallas individuales), "NO" si no
- **2 AL 5, 3 AL 6, 5 AL 8, etc.**: "SI" si esa numeración está disponible, "NO" si no

---

## 🖼️ Estructura de Carpetas de Imágenes

Las imágenes deben organizarse así:

```
img/
├── 095/
│   ├── 18-21/
│   │   └── imagen.jpg
│   ├── 22-25/
│   │   └── imagen.jpg
│   └── N-E/
│       └── imagen.jpg
├── 096/
│   ├── 18-21/
│   │   └── imagen.jpg
│   └── 22-25/
│       └── imagen.jpg
└── 097/
    ├── 22-25/
    │   └── imagen.jpg
    └── 25-28/
        └── imagen.jpg
```

**Nota**: Actualmente el código busca `img/{ID}/imagen.jpg`. Puedes actualizar la ruta en la función `parseCSVToProducts()` si necesitas una estructura diferente.

---

## 🔧 Cómo Funciona

### Flujo de Carga:

1. **Usuario abre el sitio** → Se dispara `DOMContentLoaded`
2. **Se llama `cargarProductosDesdeGoogleSheets()`** → Descarga CSV del Google Sheet
3. **Se parsea el CSV** → Se convierten filas a objetos de producto
4. **Se reemplaza PRODUCTOS** → El array global se actualiza con datos del sheet
5. **Se renderiza la página** → Catálogo, índice, etc. usan los nuevos productos

### Si Google Sheets no está disponible:
- El sitio sigue funcionando con los 15 productos base
- Se muestra un mensaje en la consola: `❌ Error cargando Google Sheets`

---

## 📝 Próximos Pasos

### 1. **Organiza tus imágenes**
- Crea carpetas en `img/` con el ID de cada producto
- Dentro, crea subcarpetas por numeración (18-21, 22-25, N-E, etc.)
- Coloca las imágenes comprimidas (200-300KB máximo)

### 2. **Actualiza tu Google Sheet**
- Asegúrate de que el sheet sea público (compartido)
- Completa todas las columnas requeridas
- Usa "SI" o "NO" en las columnas de numeración

### 3. **Prueba el sitio**
- Abre el sitio en el navegador
- Abre la consola (F12) para ver si se cargaron los productos
- Verifica que los productos aparezcan en el catálogo

### 4. **Personaliza categorías (opcional)**
Si tus productos no se clasifican correctamente, edita la función `determinateCategory()` en `app.js` para añadir más palabras clave.

---

## 🐛 Troubleshooting

### "No aparecen productos"
- Verifica que el Google Sheet sea público
- Abre la consola (F12) y busca mensajes de error
- Comprueba que las columnas tengan exactamente estos nombres: ID, MODELO, PRECIO, NOMBRE, N/E, 2 AL 5, 3 AL 6, 5 AL 8, 5 AL 7.5, 6 AL 8, 6 AL 9

### "Las imágenes no se ven"
- Verifica que las rutas sean correctas: `img/{ID}/imagen.jpg`
- Comprueba que los archivos existan en esas carpetas
- Asegúrate de que las imágenes estén comprimidas

### "Las numeraciones no aparecen"
- Verifica que en el Google Sheet hayas puesto "SI" en las columnas de numeración
- Comprueba que el PRECIO sea un número válido (no texto)

---

## 💡 Notas Importantes

- **Cambios en tiempo real**: Cada vez que alguien abre el sitio, se cargan los datos más recientes del Google Sheet
- **Fallback**: Si Google Sheets no está disponible, el sitio sigue funcionando con los 15 productos base
- **Categorías automáticas**: El sistema detecta la categoría basándose en palabras clave en el nombre/modelo
- **Numeración especial**: Si pones "SI" en N/E, el producto tendrá un botón para "Surtido Especial" que permite seleccionar tallas individuales

---

## 📞 Soporte

Si tienes problemas:
1. Abre la consola del navegador (F12)
2. Busca mensajes de error
3. Verifica la estructura del Google Sheet
4. Comprueba que el sheet sea público

¡Listo! Tu sitio ahora carga productos dinámicamente desde Google Sheets. 🎉
