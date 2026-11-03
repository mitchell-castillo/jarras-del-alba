# Verificación · 3 noviembre 2026

## Ejecutado

- `npm run check` en Node 24: sintaxis correcta y **28/28 pruebas** aprobadas.
- 15 pruebas de motor/estructura, 12 de interfaz simulada y 1 contrato con el normalizador real del catálogo.
- Seis soluciones mínimas obtenidas por BFS independiente del motor: **4, 7, 10, 11, 12 y 12 movimientos**. Cada ruta se ejecuta con las reglas reales, registra victoria y sobrevive a serialización/recarga.
- 12.400 combinaciones estado/origen/destino comparadas contra un oráculo que trasvasa unidad a unidad, incluyendo casos inválidos; se comprueban conservación, capacidad y condición de parada.
- Datos corruptos, índices no enteros, acciones sin efecto, inmutabilidad, deshacer, mejores marcas, límite de historial y prueba legal de logros.
- DOM simulado: seis victorias, recarga, selección, acciones imposibles, reinicio y borrado cancelados/confirmados, sincronización y diálogos obsoletos, teclado, protección de ayuda/diálogo, foco simulado y almacenamiento bloqueado tanto por lectura como por escritura/cuota.
- Contrato del catálogo contra `assets/progress.js`, blob `e85c9033d5a532833c0953e3a0abb4c9aa616f25`, leído el 3 de noviembre. La copia exacta está en tests/catalogue-progress.fixture.js. No se alteró el catálogo.

## Navegador real · 19:06–19:11 UTC

- Chrome de escritorio, preview privado servido mediante la ruta interna admitida. Seis retos jugados mediante sus controles reales, sin inyectar estados: **6/6 victorias en 4, 7, 10, 11, 12 y 12 movimientos**.
- Recarga: conservó 6/6 logros y el sexto reto resuelto en 12 movimientos. Z deshizo hasta 11 movimientos; un trasvase legal devolvió la victoria en 12 sin perder logros.
- Enter y Espacio activaron botones; 1 y 2 seleccionaron jarras. Escape canceló la selección. Los atajos 1 y Z no modificaron el juego mientras la ayuda tenía el foco.
- Seleccionar una jarra vacía y verter hacia una llena mostraron el aviso correspondiente sin aumentar movimientos.
- Cancelar el reinicio y cerrar con Escape el diálogo de borrado conservaron el progreso. El botón Cancelar recibió el foco al abrir; al cerrar, el foco volvió al botón de origen.
- En una segunda pestaña propia, cambiar al cuarto reto actualizó la primera, conservó 6/6 y cerró su diálogo obsoleto de reinicio.
- Revisión visual de escritorio a 1180 × 757 px, con anchura cliente y de contenido de 1165 px: sin desbordamiento horizontal.
- Revisión adaptable con el juego sin modificar en iframes de escritorio de **320 y 390 px**. Anchuras cliente/contenido: 305/305 y 390/390 px respectivamente, sin desbordamiento horizontal. Las tres jarras, sus cifras y botones permanecieron legibles. Llenar A y verter A→C funcionó a 320 px; la otra vista recibió el progreso.
- Las pestañas de prueba se cerraron y el preview privado se detuvo. No se modificó el código de ejecución después de esta QA.

## Límites de la verificación

- **Los iframes estrechos no son dispositivos móviles ni emulación táctil.** No se probaron móvil físico, táctil, zoom, lectores de pantalla, Safari/Firefox ni red de producción. No se afirma una certificación de accesibilidad.
- Reinicio y borrado confirmados, errores de almacenamiento y cuota solo se probaron con datos sintéticos en DOM simulado. En navegador real se probaron las cancelaciones, no la eliminación del progreso.
- Estado a las 19:11 UTC: todavía sin publicación. Actualización 20:19 UTC: repositorio público creado; Validate 41710969847 y Pages 41711163478 completados con éxito para 3f6e72d281176d35512b19aaa094fe157ede6af5. Integración en catálogo y smoke visual de producción todavía pendientes en esta actualización.
- Un primer intento local a las 18:07 UTC falló por conexión rechazada antes de jugar; quedó superado por el preview privado verificado arriba, sin cambiar seguridad ni usar entrada global.

## Recorrido de QA reproducible

Las letras corresponden a las jarras de izquierda a derecha. Llenar y vaciar usan su botón; A→B significa seleccionar A y después B. Cada reto empieza vacío.

### 1. La primera gota

Capacidades: [2, 3]. Objetivo: [1, 0]. Mínimo: 4.

Llenar B; B→A; Vaciar A; B→A.

### 2. Luz en el patio

Capacidades: [3, 5]. Objetivo: [0, 4]. Mínimo: 7.

Llenar B; B→A; Vaciar A; B→A; Llenar B; B→A; Vaciar A.

### 3. El pozo tranquilo

Capacidades: [4, 7]. Objetivo: [2, 7]. Mínimo: 10.

Llenar A; A→B; Llenar A; A→B; Vaciar B; A→B; Llenar A; A→B; Llenar A; A→B.

### 4. Tres reflejos

Capacidades: [3, 5, 8]. Objetivo: [2, 5, 7]. Mínimo: 11.

Llenar A; A→B; Llenar A; A→B; A→C; Llenar A; A→C; B→A; A→C; B→A; Llenar B.

### 5. Antes del sol

Capacidades: [5, 7, 9]. Objetivo: [0, 1, 3]. Mínimo: 12.

Llenar A; A→C; Llenar A; A→C; Llenar B; Vaciar C; B→C; A→B; Llenar A; A→C; Vaciar C; A→C.

### 6. El alba completa

Capacidades: [5, 8, 11]. Objetivo: [1, 8, 9]. Mínimo: 12.

Llenar A; A→B; Llenar A; A→B; A→C; B→A; A→C; B→A; Llenar B; B→A; A→C; C→B.

Después de resolver: recargar y comprobar el logro. Probar un trasvase imposible sin cambio de contador; deshacer; cancelar selección con Escape; cancelar reinicio; confirmar reinicio conservando logros; cambiar de reto y volver. Verificar otro tab actualizando el progreso mientras hay una confirmación abierta. No ejecutar el borrado total en navegador sin el permiso aplicable.

## Reproducibilidad y privacidad

MANIFEST.sha256 identifica cada archivo del paquete. El ZIP contiene solo código, pruebas, documentación y SVG originales; no incluye sesiones, datos personales, capturas de navegador, credenciales ni registros privados. El juego no envía datos ni tiene receptor de feedback o contador global.
