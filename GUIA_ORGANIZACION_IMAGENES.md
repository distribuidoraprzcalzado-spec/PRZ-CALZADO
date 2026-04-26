# 🖼️ Guía de Organización de Imágenes

## Estructura Actual

```
img/095/
├── imagen.jpg (principal)
├── 095_A.NG_5.PNG
├── 095_CH.BCO_5.PNG
├── 095_CH.D_5.PNG
├── 095_CH.NG_5.PNG
├── 095_CH.PTA_5.PNG
├── 095_CH.VNO_5.PNG
├── 095_N.BCO_5.PNG
├── 095_N.MQ_5.PNG
├── 095_N.NG_5.PNG
├── 095_N.PLM_5.PNG
├── 095_N.PTA_5.png
├── 095_P.D_5.PNG
├── 095_P.RSA_5.PNG
├── 095_S.NG_5.png
└── 095_S.RSA_5.PNG
```

## Análisis de Producto 095

### Información General
- **Modelo**: 095
- **Numeración**: 2 AL 5 (todas las variantes)
- **Numeración Especial (N/E)**: SI (todas las variantes)
- **Total de variantes**: 15

### Variantes Disponibles

| ID Completo | Nombre | Numeración | N/E |
|---|---|---|---|
| 095/P.D/5 | Zapatilla Persa Dorado Tacon 5 cm | 2 AL 5 | SI |
| 095/P.RSA/5 | Zapatilla Persa Rosa Tacon 5 cm | 2 AL 5 | SI |
| 095/P.PTA/5 | Zapatilla Persa Plata Tacon 5 cm | 2 AL 5 | SI |
| 095/N.NG/5 | Zapatilla Napa Negro Tacon 5 cm | 2 AL 5 | SI |
| 095/N.MQ/5 | Zapatilla Napa Maquillaje Tacon 5 cm | 2 AL 5 | SI |
| 095/N.PLM/5 | Zapatilla Napa Palomita Tacon 5 cm | 2 AL 5 | SI |
| 095/N.BCO/5 | Zapatilla Napa Blanco Tacon 5 cm | 2 AL 5 | SI |
| 095/N.PTA/5 | Zapatilla Napa Plata Tacon 5 cm | 2 AL 5 | SI |
| 095/CH.PTA/5 | Zapatilla Charol Plata Tacon 5 cm | 2 AL 5 | SI |
| 095/CH.D/5 | Zapatilla Charol Dorado Tacon 5 cm | 2 AL 5 | SI |
| 095/CH.VNO/5 | Zapatilla Charol Vino Tacon 5 cm | 2 AL 5 | SI |
| 095/CH.BCO/5 | Zapatilla Charol Blanco Tacon 5 cm | 2 AL 5 | SI |
| 095/CH.NG/5 | Zapatilla Charol Negro Tacon 5 cm | 2 AL 5 | SI |
| 095/S.NG/5 | Zapatilla Satin Negro Tacon 5 cm | 2 AL 5 | SI |
| 095/A.NG/5 | Zapatilla Ante Negro Tacon 5 cm | 2 AL 5 | SI |

---

## Opciones de Organización

### Opción 1: Estructura Simple (RECOMENDADA AHORA)
```
img/095/
├── imagen.jpg (principal)
└── [todas las imágenes individuales]
```

**Ventajas:**
- Simple de implementar
- Funciona bien para un solo modelo
- Fácil de mantener

**Desventajas:**
- No escalable para múltiples numeraciones
- Todas las imágenes en una carpeta

### Opción 2: Estructura por Numeración
```
img/095/
├── imagen.jpg (principal)
├── 2-AL-5/
│   ├── 095_A.NG_5.PNG
│   ├── 095_CH.BCO_5.PNG
│   └── ...
└── N-E/
    └── (imágenes especiales)
```

**Ventajas:**
- Escalable para múltiples numeraciones
- Organizado por tipo
- Fácil de agregar nuevas numeraciones

**Desventajas:**
- Más carpetas
- Requiere actualizar app.js

### Opción 3: Estructura por Variante
```
img/095/
├── imagen.jpg (principal)
├── P.D/
│   └── imagen.jpg
├── P.RSA/
│   └── imagen.jpg
└── ...
```

**Ventajas:**
- Máxima flexibilidad
- Cada variante tiene su propia imagen

**Desventajas:**
- Muchas carpetas
- Difícil de mantener
- Requiere cambios significativos en app.js

---

## Recomendación

**Para ahora**: Mantener la Opción 1 (estructura simple)
- Las imágenes ya están en `img/095/`
- El sitio funciona correctamente
- Fácil de probar

**Para después**: Implementar Opción 2 (estructura por numeración)
- Cuando agregues más modelos con múltiples numeraciones
- Cuando necesites imágenes diferentes por numeración

---

## Cómo Implementar Opción 2 (Futuro)

### Paso 1: Crear carpetas
```powershell
New-Item -ItemType Directory -Path "img/095/2-AL-5" -Force
New-Item -ItemType Directory -Path "img/095/N-E" -Force
```

### Paso 2: Mover imágenes
```powershell
Move-Item -Path "img/095/095_*.PNG" -Destination "img/095/2-AL-5/" -Force
Move-Item -Path "img/095/095_*.png" -Destination "img/095/2-AL-5/" -Force
```

### Paso 3: Actualizar app.js
Cambiar en `parseCSVToProducts()`:
```javascript
// De:
imagen: `img/${baseId}/imagen.jpg`,

// A:
imagen: `img/${baseId}/${rango.replace(/\s/g, '-')}/imagen.jpg`,
```

### Paso 4: Probar
- Abrir catalogo.html
- Verificar que las imágenes se carguen
- Probar en móvil

---

## Compresión de Imágenes

### Herramienta Recomendada
- **Sitio**: https://squoosh.app
- **Objetivo**: 200-300KB por imagen
- **Calidad**: 70-80%

### Pasos
1. Ir a https://squoosh.app
2. Arrastrar imagen
3. Ajustar calidad a 75%
4. Descargar
5. Reemplazar imagen original

### Ejemplo
```
Antes: 095_CH.D_5.PNG (1.2 MB)
Después: 095_CH.D_5.PNG (250 KB)
Reducción: 79%
```

---

## Mapeo de Imágenes a Archivos

| Archivo | Variante | Descripción |
|---|---|---|
| 095_A.NG_5.PNG | Ante Negro | Zapatilla Ante Negro |
| 095_CH.BCO_5.PNG | Charol Blanco | Zapatilla Charol Blanco |
| 095_CH.D_5.PNG | Charol Dorado | Zapatilla Charol Dorado |
| 095_CH.NG_5.PNG | Charol Negro | Zapatilla Charol Negro |
| 095_CH.PTA_5.PNG | Charol Plata | Zapatilla Charol Plata |
| 095_CH.VNO_5.PNG | Charol Vino | Zapatilla Charol Vino |
| 095_N.BCO_5.PNG | Napa Blanco | Zapatilla Napa Blanco |
| 095_N.MQ_5.PNG | Napa Maquillaje | Zapatilla Napa Maquillaje |
| 095_N.NG_5.PNG | Napa Negro | Zapatilla Napa Negro |
| 095_N.PLM_5.PNG | Napa Palomita | Zapatilla Napa Palomita |
| 095_N.PTA_5.png | Napa Plata | Zapatilla Napa Plata |
| 095_P.D_5.PNG | Persa Dorado | Zapatilla Persa Dorado |
| 095_P.RSA_5.PNG | Persa Rosa | Zapatilla Persa Rosa |
| 095_S.NG_5.png | Satin Negro | Zapatilla Satin Negro |
| 095_S.RSA_5.PNG | Satin Rosa | Zapatilla Satin Rosa |

---

## Próximos Modelos

Cuando agregues más modelos, sigue el mismo patrón:

```
img/950/
├── imagen.jpg
├── [imágenes del modelo 950]

img/954/
├── imagen.jpg
├── [imágenes del modelo 954]

img/T90/
├── imagen.jpg
├── [imágenes del modelo T90]
```

---

## Checklist

- [ ] Imágenes de 095 están en `img/095/`
- [ ] Imagen principal es `img/095/imagen.jpg`
- [ ] Todas las imágenes están comprimidas (200-300KB)
- [ ] El sitio carga correctamente
- [ ] Las imágenes se ven bien en móvil
- [ ] Listo para agregar más modelos

---

**Última actualización**: 2026-04-25

