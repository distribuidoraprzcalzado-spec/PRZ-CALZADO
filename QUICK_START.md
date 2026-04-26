# ⚡ Quick Start - PRZ Calzado

## 🚀 Empezar en 5 Minutos

### 1. Abrir el Sitio
```
Opción A: Doble click en index.html
Opción B: Abrir en navegador: file:///C:/Users/Juan Carlos/prz-calzado/index.html
```

### 2. Probar Google Sheets
```
1. Abre: test-sheets.html
2. Espera a que cargue
3. Verifica: "✅ Éxito! Se cargaron 96 productos"
```

### 3. Navegar por el Sitio
```
1. Inicio → Ver Catálogo
2. Catálogo → Filtrar por categoría
3. Producto → Agregar al carrito
4. Carrito → Enviar por WhatsApp
```

---

## 📋 Checklist Rápido

- [ ] ¿Se abre index.html sin errores?
- [ ] ¿Aparece el logo en la navbar?
- [ ] ¿test-sheets.html muestra "✅ Éxito"?
- [ ] ¿Aparecen productos en catalogo.html?
- [ ] ¿Se puede agregar producto al carrito?
- [ ] ¿Se abre WhatsApp al enviar pedido?

---

## 🔧 Solución de Problemas

### "No aparecen productos"
```
1. Abre: test-sheets.html
2. Verifica: ¿Dice "✅ Éxito"?
3. Si NO: Google Sheets no está accesible
   - Verifica conexión a internet
   - Verifica que el sheet sea público
4. Si SÍ: Problema en app.js
   - Abre consola (F12)
   - Busca errores
```

### "Las imágenes no se ven"
```
1. Verifica: ¿Existen los archivos?
   - img/095/imagen.jpg
   - img/095/095_*.PNG
2. Si NO: Copiar imágenes a img/095/
3. Si SÍ: Problema de ruta
   - Abre consola (F12)
   - Busca errores 404
```

### "El carrito no funciona"
```
1. Abre consola (F12)
2. Busca errores
3. Verifica: localStorage está habilitado
   - Algunos navegadores lo deshabilitan
4. Prueba: Incógnito/Privado
```

### "WhatsApp no se abre"
```
1. Verifica: ¿Tienes WhatsApp instalado?
2. Verifica: ¿El número es correcto?
   - +52 2213408041
3. Prueba: Copiar URL manualmente
   - https://wa.me/522213408041
```

---

## 📱 Probar en Móvil

### Opción 1: Mismo WiFi
```
1. Obtener IP de la computadora
   - Windows: ipconfig (buscar IPv4)
   - Ejemplo: 192.168.1.100
2. En móvil: http://192.168.1.100:8000/index.html
3. Nota: Requiere servidor local
```

### Opción 2: GitHub Pages
```
1. Subir a GitHub
2. Activar GitHub Pages
3. Abrir URL en móvil
4. Ejemplo: https://distribuidoraprzcalzado-spec.github.io/PRZ-CALZADO
```

### Opción 3: DevTools
```
1. Abre: index.html en navegador
2. Presiona: F12
3. Click: Icono de móvil (esquina superior izquierda)
4. Selecciona: Dispositivo móvil
```

---

## 🎯 Próximas Acciones

### Hoy
- [ ] Probar que todo funcione
- [ ] Verificar Google Sheets
- [ ] Probar en móvil

### Esta Semana
- [ ] Comprimir imágenes
- [ ] Agregar más modelos
- [ ] Desplegar a GitHub Pages

### Este Mes
- [ ] Organizar imágenes por numeración
- [ ] Agregar más productos
- [ ] Feedback del cliente

---

## 📞 Ayuda

### Preguntas Frecuentes

**¿Cómo agregar más productos?**
- Agregar filas al Google Sheet
- El sitio se actualiza automáticamente

**¿Cómo cambiar el número de WhatsApp?**
- Editar app.js
- Buscar: `const WHATSAPP_NUMBER = '522213408041'`
- Cambiar número

**¿Cómo cambiar colores?**
- Editar style.css
- Buscar: `--primary: #0066FF`
- Cambiar color

**¿Cómo agregar más categorías?**
- Editar app.js
- Función: `determinateCategory()`
- Agregar palabras clave

---

## 🔗 Enlaces Útiles

- **Google Sheet**: https://docs.google.com/spreadsheets/d/1-9lSJ2UdvV51nQYLoBv-w23clyoKYnR70j0_W18GeAQ
- **GitHub**: https://github.com/distribuidoraprzcalzado-spec/PRZ-CALZADO
- **GitHub Pages**: https://distribuidoraprzcalzado-spec.github.io/PRZ-CALZADO
- **Squoosh (Comprimir imágenes)**: https://squoosh.app
- **WhatsApp**: https://wa.me/522213408041

---

## 📚 Documentación Completa

- **README_IMPLEMENTACION.md** - Documentación completa
- **GOOGLE_SHEETS_SETUP.md** - Cómo configurar Google Sheets
- **GUIA_ORGANIZACION_IMAGENES.md** - Cómo organizar imágenes
- **CHECKLIST_PROXIMOS_PASOS.md** - Checklist de tareas
- **ESTADO_ACTUAL.md** - Estado del proyecto

---

## ✨ Tips

1. **Limpiar caché**: Presiona Ctrl+F5 para limpiar caché del navegador
2. **Consola**: Presiona F12 para abrir consola y ver errores
3. **Responsive**: Presiona F12 y click en icono de móvil para probar responsive
4. **Localhost**: Usa `python -m http.server 8000` para servidor local
5. **GitHub**: Usa `git push` para actualizar el sitio en GitHub Pages

---

**¡Listo para empezar!** 🎉

