# 📋 Instrucciones Paso a Paso - Google Sheets Integration

## Paso 1: Preparar tu Google Sheet

### 1.1 Abre tu Google Sheet
- Ve a: https://docs.google.com/spreadsheets/d/1-9lSJ2UdvV51nQYLoBv-w23clyoKYnR70j0_W18GeAQ/edit

### 1.2 Verifica las columnas
Asegúrate de que tu sheet tenga exactamente estas columnas en este orden:

| Columna | Nombre | Tipo | Ejemplo |
|---------|--------|------|---------|
| A | ID | Texto/Número | 095 |
| B | MODELO | Texto | Future Piel |
| C | PRECIO | Número | 235 |
| D | NOMBRE | Texto | Tenis Future |
| E | N/E | SI/NO | SI |
| F | 2 AL 5 | SI/NO | SI |
| G | 3 AL 6 | SI/NO | SI |
| H | 5 AL 8 | SI/NO | SI |
| I | 5 AL 7.5 | SI/NO | NO |
| J | 6 AL 8 | SI/NO | NO |
| K | 6 AL 9 | SI/NO | NO |

### 1.3 Completa los datos
Ejemplo de 3 productos:

```
ID      | MODELO        | PRECIO | NOMBRE           | N/E | 2 AL 5 | 3 AL 6 | 5 AL 8 | 5 AL 7.5 | 6 AL 8 | 6 AL 9
--------|---------------|--------|------------------|-----|--------|--------|--------|----------|--------|--------
095     | Future Piel   | 235    | Tenis Future     | SI  | SI     | SI     | SI     | NO       | NO     | NO
096     | Nike Court    | 320    | Nike Court Azul  | NO  | SI     | SI     | SI     | NO       | NO     | NO
097     | Escolar Basic | 260    | Zapato Escolar   | NO  | NO     | NO     | NO     | SI       | SI     | SI
```

### 1.4 Haz el sheet público
1. Click en "Compartir" (arriba a la derecha)
2. Selecciona "Cambiar a cualquiera con el enlace"
3. Elige "Visualizador"
4. Click en "Compartir"

---

## Paso 2: Organizar las Imágenes

### 2.1 Crea la estructura de carpetas
En tu carpeta `img/`, crea subcarpetas con el ID de cada producto:

```
img/
├── 095/
│   └── imagen.jpg
├── 096/
│   └── imagen.jpg
└── 097/
    └── imagen.jpg
```

### 2.2 Comprime las imágenes
- Usa: https://squoosh.app
- Tamaño máximo: 200-300 KB
- Formato: JPG o PNG

### 2.3 Sube las imágenes
1. Crea la carpeta `img/095/`
2. Sube la imagen como `imagen.jpg`
3. Repite para cada producto

---

## Paso 3: Prueba el Sitio

### 3.1 Abre el sitio
- Ve a: https://distribuidoraprzcalzado-spec.github.io/PRZ-CALZADO/

### 3.2 Abre la consola
- Presiona: **F12** (o Ctrl+Shift+I)
- Ve a la pestaña "Consola"

### 3.3 Busca el mensaje de éxito
Deberías ver:
```
✅ Cargados 100 productos desde Google Sheets
```

### 3.4 Verifica el catálogo
- Ve a "Catálogo"
- Deberías ver tus productos
- Haz click en uno para ver los detalles

---

## Paso 4: Soluciona Problemas

### Problema: "No aparecen productos"

**Solución 1: Verifica que el sheet sea público**
1. Abre tu Google Sheet
2. Click en "Compartir"
3. Verifica que diga "Cualquiera con el enlace"

**Solución 2: Verifica las columnas**
1. Abre tu Google Sheet
2. Verifica que las columnas sean exactamente:
   - ID, MODELO, PRECIO, NOMBRE, N/E, 2 AL 5, 3 AL 6, 5 AL 8, 5 AL 7.5, 6 AL 8, 6 AL 9
3. Sin espacios extras, sin mayúsculas/minúsculas diferentes

**Solución 3: Verifica los datos**
1. Asegúrate de que PRECIO sea un número (no texto)
2. Asegúrate de que N/E sea "SI" o "NO" (no "Sí" o "si")
3. Asegúrate de que no haya filas vacías

### Problema: "Las imágenes no se ven"

**Solución 1: Verifica la ruta**
- Las imágenes deben estar en: `img/{ID}/imagen.jpg`
- Ejemplo: `img/095/imagen.jpg`

**Solución 2: Verifica que existan**
1. Abre tu carpeta `img/`
2. Verifica que exista la carpeta `095/`
3. Verifica que dentro esté `imagen.jpg`

**Solución 3: Comprime las imágenes**
- Usa: https://squoosh.app
- Tamaño máximo: 300 KB

### Problema: "Las numeraciones no aparecen"

**Solución: Verifica el sheet**
1. Abre tu Google Sheet
2. Verifica que hayas puesto "SI" en las columnas de numeración
3. Ejemplo: Si quieres "2 AL 5", pon "SI" en la columna "2 AL 5"

---

## Paso 5: Actualizar Productos

### Para agregar un nuevo producto:
1. Abre tu Google Sheet
2. Agrega una nueva fila con:
   - ID: 098 (o el siguiente)
   - MODELO: Nombre del modelo
   - PRECIO: Precio por pieza
   - NOMBRE: Nombre completo
   - N/E: SI o NO
   - Numeraciones: SI o NO para cada una
3. Crea la carpeta `img/098/`
4. Sube la imagen como `imagen.jpg`
5. Abre el sitio (se cargará automáticamente)

### Para cambiar un precio:
1. Abre tu Google Sheet
2. Cambia el PRECIO
3. Abre el sitio (se actualizará automáticamente)

### Para cambiar una numeración:
1. Abre tu Google Sheet
2. Cambia SI/NO en la columna de numeración
3. Abre el sitio (se actualizará automáticamente)

---

## Paso 6: Características Especiales

### Numeración Especial (N/E)
Si pones "SI" en la columna N/E:
- El producto tendrá un botón "Surtido Especial"
- Los clientes pueden seleccionar tallas individuales
- Deben sumar exactamente 6 pares

Ejemplo:
- 2 pares talla 5
- 2 pares talla 6
- 2 pares talla 7
- Total: 6 pares ✅

### Precios por Numeración
Cada numeración puede tener precio diferente:
- 2 AL 5: $235
- 3 AL 6: $235
- 5 AL 8: $255 (más caro)

El sistema calcula automáticamente el total.

---

## Paso 7: Verificación Final

### Checklist:
- ✅ Google Sheet es público
- ✅ Columnas son exactas: ID, MODELO, PRECIO, NOMBRE, N/E, 2 AL 5, 3 AL 6, 5 AL 8, 5 AL 7.5, 6 AL 8, 6 AL 9
- ✅ PRECIO es número
- ✅ N/E es SI o NO
- ✅ Numeraciones son SI o NO
- ✅ Imágenes están en `img/{ID}/imagen.jpg`
- ✅ Imágenes están comprimidas (200-300 KB)
- ✅ Consola muestra: `✅ Cargados X productos desde Google Sheets`
- ✅ Productos aparecen en el catálogo
- ✅ Las imágenes se ven

---

## 🎉 ¡Listo!

Tu sitio ahora carga productos dinámicamente desde Google Sheets.

Cada vez que alguien abre el sitio:
1. Se descargan los datos del Google Sheet
2. Se actualizan automáticamente
3. Se muestran en el catálogo

**No necesitas actualizar el código manualmente.**

---

## 📞 Ayuda Rápida

| Problema | Solución |
|----------|----------|
| No aparecen productos | Verifica que el sheet sea público |
| Las imágenes no se ven | Verifica que estén en `img/{ID}/imagen.jpg` |
| Las numeraciones no aparecen | Verifica que hayas puesto "SI" en el sheet |
| El sitio es lento | Comprime las imágenes más |
| Aparecen productos viejos | Limpia el caché del navegador (Ctrl+Shift+Del) |

---

## 📚 Documentación Completa

Para más detalles, lee: `GOOGLE_SHEETS_SETUP.md`

¡Éxito! 🚀
