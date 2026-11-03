# Jarras del Alba

Juego diario preparado para el **3 de noviembre de 2026**, America/Santo_Domingo. Seis retos elegidos para la mecánica clásica de medir agua con jarras de capacidades distintas. No se afirma inventar esta mecánica ni que las soluciones sean únicas.

## Jugar

Lleva todas las jarras a sus cantidades objetivo al mismo tiempo. Llenar añade agua hasta la capacidad máxima; vaciar la retira por completo; verter mueve agua hasta que el origen se vacía o el destino se llena. La fuente es ilimitada. No se permite detener un trasvase a mitad. No hay reloj ni penalización por reintentar.

Pulsa una jarra con agua y después otra para verter. Los botones Llenar y Vaciar son individuales. Tab y Enter/Espacio activan controles; 1–3 seleccionan jarras, Z deshace y Escape cancela la selección. Los atajos se suspenden en la ayuda y los diálogos. Todas las etapas están disponibles. Cambiar de reto reinicia su intento y conserva logros.

## Ejecutar y comprobar

- Node 22 o posterior: `npm run check`. No hay dependencias que instalar.
- Python 3: `npm start`. Abrir `http://127.0.0.1:8771` en un navegador del mismo equipo. Los módulos ES necesitan HTTP, no se garantiza el funcionamiento con `file:`.
- HTML/CSS/JavaScript y SVG propios. Sin build, backend, cuentas, telemetría, cookies, fuentes remotas ni credenciales.

## Estado de entrega

**Publicado en GitHub Pages.** Repositorio independiente: https://github.com/mitchell-castillo/jarras-del-alba . Juego: https://mitchell-castillo.github.io/jarras-del-alba/ . Validación CI y primer despliegue completados correctamente. Pasaron 28 pruebas locales y seis retos en Chrome de escritorio antes de publicar. Las anchuras de 320/390 px se revisaron en iframe, no en móvil físico. Alcance detallado en QA.md.

## Persistencia

El progreso vive solo en localStorage bajo `daily-games:jarras-del-alba:v1`. La secuencia de acciones se vuelve a ejecutar al cargar; los logros incluyen una ruta legal y el mejor número de movimientos. Los datos siguen siendo locales y manipulables, no una métrica global ni un sistema antifraude. Deshacer conserva los logros. Reiniciar un reto y borrar todo requieren confirmación. El intento admite hasta 1000 movimientos; al alcanzar ese límite, se puede deshacer o reiniciar.

Una actualización de otra pestaña cancela el diálogo y selección obsoletos antes de cargar los datos. También se revisa el almacenamiento antes de cada cambio. La última escritura prevalece: no se promete colaboración simultánea ni sincronización entre dispositivos. Si leer o escribir localStorage falla, se sigue jugando en memoria y se avisa de la falta de guardado.

El contrato de resumen de progreso fue probado contra el normalizador real del catálogo, blob `e85c9033d5a532833c0953e3a0abb4c9aa616f25`. Esto no equivale a integración publicada.

## Diferenciación

Contrastado con las 16 entregas anteriores: inercia espacial, faro arcade, huerto por turnos, vías de tren, memoria de señales, equilibrio de pesos, poliminós, claves de símbolos, Lights Out, nonogramas, clasificación de colores, solitario de saltos, Sokoban, puzle deslizante, Hanói y recorridos hamiltonianos.

Aquí la regla central es la aritmética de capacidades mediante llenado, vaciado y trasvase automático. A diferencia de Estación de Colores, no se clasifican fichas ni colores y el volumen total puede cambiar por la fuente y el vaciado. No se modifica ningún juego anterior, el buzón de sugerencias ni el ranking.
