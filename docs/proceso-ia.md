# Cómo se ha dirigido a la IA

Herramienta: **Claude** (Claude Code). El CRM se construyó en 8 iteraciones. En cada una se le pidió algo concreto, se probó el resultado y se pidieron cambios. La IA hacía preguntas antes de construir para adaptar el CRM al negocio en vez de dar una solución genérica.

## 1. Diseño: discutir el negocio antes de programar

- **Petición:** un CRM para un compraventa de coches local con 3 empleados, siguiendo el enunciado de la práctica.
- **Preguntas que hizo la IA y respuestas:**
  - ¿De dónde salen los coches? → Solo de subastas (Autorola, Auto1, BCA, Leasys, Ayvens, Arval).
  - ¿Cómo llegan los compradores? → coches.net, la web y la tienda.
  - ¿Qué hace cada empleado? → Comercial, compras/peritaje y financiero/legal.
  - ¿Cómo pagan? → Al contado, con factura. Sin financiación.
- **Lo que cambió gracias a esa discusión:** el CRM no gira solo en torno a clientes, también lleva un **stock de coches** con su coste y su margen, porque cada coche es único. Como no hay coches entregados como parte del pago, los clientes son solo compradores.
- **Tecnología:** la IA propuso 3 enfoques (HTML estático, React, HTML + Supabase) y se eligió HTML estático por ser lo más fácil de publicar en Vercel y de explicar.

## 2. Primera versión

- **Petición:** construir el CRM con clientes, contactos, ventas, pendientes, indicadores y más de 20 clientes ficticios **en el código** (el enunciado avisa de que el profesor no ve lo que se mete desde el navegador).
- **Qué falló y cómo se corrigió:**
  - En el móvil la página se salía de ancho por el menú lateral → la IA lo detectó al probar con un navegador automático y lo corrigió.
  - Los importes salían como "9600 €" sin punto de miles (es lo que hace el navegador en español con números de 4 cifras) → se forzó el separador.
  - Con las ventas repartidas en solo 6 meses, el pendiente "garantía a punto de vencer" salía siempre vacío → se repartieron en 14 meses.

## 3. Aspecto profesional y control

- **Petición:** quitar los emojis y "lo que se note que es IA", bordes menos redondos, todo cuadrado y legible, algo de profundidad, un ID para cada cliente y un número de catálogo para cada coche, y evitar repetidos.
- **Preguntas de la IA:** formato de los códigos (se eligió `CLI-0001` / `VH-0001`) y qué añadir para que fuera completo (se eligió DNI y bastidor, número de factura y documentación, exportar a Excel, editar y borrar).
- **Resultado:** iconos dibujados en SVG, validación de DNI, matrícula y bastidor únicos, factura correlativa y checklist de documentación.

## 4. Tablero arrastrable y finanzas

- **Petición:** poder arrastrar las fichas entre etapas y un panel de finanzas con pagos, facturas pendientes, enviadas e impagadas.
- **Decisiones que pidió la IA:** señal de reserva (**300 €**), plazo de pago (**3 días**) y métodos de pago (**transferencia y tarjeta**; la IA advirtió de que en España una empresa no puede cobrar más de 1.000 € en efectivo).
- **Qué falló y cómo se corrigió:** al arrastrar se seleccionaba el texto de la página en vez de mover la ficha → se bloqueó la selección de texto al empezar a arrastrar. Además, el CRM no deja saltarse etapas ni entregar un coche sin cobrar o sin papeles.

## 5. Gastos y gráficos

- **Petición:** que aparezcan los gastos y gráficos de ingresos y gastos.
- **Problema de realismo detectado por la IA:** con solo 14 ventas en 14 meses y 3 sueldos, la empresa perdía dinero todos los meses → se amplió el histórico a unas 5 ventas al mes para que la cuenta de resultados fuera creíble.
- **Qué falló y cómo se corrigió:** en el gráfico de ingresos y gastos la línea de resultado quedaba aplastada contra el cero → se sacó a un gráfico propio con su escala. La tabla de la cuenta de resultados no cabía al lado de otra → se apilaron.

## 6. Análisis de mercado

- **Petición:** qué coches se venden más rápido, cuáles dejan más beneficio, cuáles se atascan y qué marcas y modelos son más rentables.
- **Qué falló y cómo se corrigió:** los datos ficticios eran aleatorios y el análisis no mostraba ninguna conclusión → se generaron con patrones creíbles (los híbridos rotan rápido, los premium dejan más margen pero tardan más, algunos modelos se atascan). También salió el texto "Los híbrido son los que más rotan" → se corrigieron los plurales.
- **Métrica propuesta por la IA:** **€ por día en stock** (margen ÷ días), para comparar un coche rápido con poco margen con uno lento con mucho margen.

## 7. Pulido profesional

- **Petición:** cómo hacerlo más profesional sin que deje de ser simple. La IA propuso 9 mejoras y se eligieron 8.
- **Cambios:**
  - Ventanas propias en lugar de las del navegador, que eran lo que más "olía" a prototipo, con botón **Deshacer**.
  - Factura y ficha de escaparate imprimibles.
  - Buscador global.
  - Fechas tipo "hace 2 días".
  - Menú adaptado a cada puesto.
  - Silueta de cada coche en su color.
  - Historial de cambios.
- **Qué falló y cómo se corrigió:** un cambio grande fue bloqueado por la herramienta → se dividió en partes más pequeñas. Las facturas impresas se marcaron como "documento de demostración, sin validez fiscal" para que nadie pueda confundirlas con reales.

## 8. Calendario

- **Petición:** un calendario de eventos para cada persona, con qué tiene que hacer y para cuándo.
- **Qué falló y cómo se corrigió:** en la agenda, el día de hoy aparecía como "Mañana" por un error de redondeo de fechas → corregido. El mes salía como "Noviembre De 2026" → corregido.

## Cómo se comprobó cada versión

Después de cada iteración la IA abrió el CRM en un navegador automático (ordenador y móvil), recorrió los flujos principales (alta de cliente, duplicados, reservar, facturar, cobrar, entregar, arrastrar fichas, exportar, buscar, deshacer) y revisó que no hubiera errores ni desbordamientos antes de entregarlo.

## Lo aprendido

- La IA funciona mejor si se le explica el negocio real y se le deja preguntar.
- Hay que revisar lo que entrega: los fallos más importantes (pérdidas irreales, análisis sin conclusiones) eran de **datos y de negocio**, no de código.
- Pedir cambios concretos ("bordes menos redondos", "señal de 300 €", "3 días de plazo") da mejores resultados que pedir "que quede bien".
