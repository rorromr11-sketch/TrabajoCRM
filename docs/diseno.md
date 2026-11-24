# Diseño del CRM · AutoSelect Vega

## El negocio

AutoSelect Vega es un compraventa de coches de ocasión con **3 empleados**:

| Puesto | Qué hace | Qué usa del CRM |
|---|---|---|
| Compras / Peritaje | Compra en subastas, perita y prepara los coches | Vehículos, Mercado, Calendario |
| Comercial | Atiende a los compradores, pruebas, entregas | Clientes, Vehículos, Ventas, Calendario |
| Administración / Legal | Facturas, cobros, transferencia DGT, pagos | Clientes, Ventas, Finanzas, Calendario |

- **De dónde salen los coches:** solo de subastas profesionales (Autorola, Auto1, BCA, Leasys, Ayvens, Arval).
- **De dónde salen los clientes:** coches.net, la web de la empresa, la tienda, teléfono, WhatsApp y email.
- **Cómo se vende:** el cliente ve el stock, reserva online pagando una **señal de 300 €** con tarjeta, recibe la factura y paga el resto por **transferencia o tarjeta** en un **plazo de 3 días** (sin efectivo: en España una empresa no puede cobrar más de 1.000 € en efectivo). Recoge el coche con **garantía de 12 meses** y la empresa hace la **transferencia de titularidad en la DGT**.

## Por qué necesita un CRM

- Sin un CRM los leads de coches.net, la web y WhatsApp se pierden o se contestan tarde.
- Cada coche es un producto único con su propio coste (subasta, preparación, comisión, transporte, tasas): hace falta saber cuánto deja cada uno.
- Una venta pasa por tres personas (comercial → administración → entrega) y hay papeles que no pueden olvidarse.
- Hay que saber qué coches comprar en la próxima subasta: los que se venden rápido y dejan margen.

## Qué datos guarda

- **Cliente** (`CLI-0001`): nombre, DNI/NIE/CIF validado, teléfono, email, ciudad, canal de entrada, notas, contactos e historial.
- **Vehículo** (`VH-0001`): marca, modelo, versión, año, km, combustible, cambio, color, matrícula y bastidor (únicos), subasta, fecha y precio de compra, preparación, PVP y estado (En preparación → A la venta → Reservado → Vendido).
- **Operación** (`OP-0001`): cliente, vehículo, etapa (Lead → Reservado → Papeles → Entregado / Perdido), factura correlativa (`F-2026-0001`), fechas de emisión y vencimiento, cobros, documentación (contrato, factura, transferencia DGT, ficha técnica con ITV, permiso de circulación) y garantía.
- **Gasto** (`GS-0001`): fecha, categoría, concepto, proveedor, nº de factura del proveedor (sin duplicados), importe, vehículo asociado y estado de pago.
- **Evento** (`EV-0001`): qué hay que hacer, tipo, responsable, fecha y hora, cliente y vehículo.

## Indicadores

- Ventas e ingresos del mes (€), margen medio por coche, días medios en stock, coches en stock y leads abiertos.
- Finanzas: pendiente de facturar, pendiente de cobro, vencido, cobrado del mes, resultado mensual y anual.
- Mercado: rotación, rentabilidad sobre coste, **€ por día en stock** (margen ÷ días que tarda en venderse) y coches atascados.

## Enfoques considerados

| Enfoque | Ventaja | Inconveniente | Decisión |
|---|---|---|---|
| **A) Página estática HTML + CSS + JS** | Se publica en Vercel sin configurar nada, fácil de explicar, datos en el código | Los cambios de la demo solo se guardan en ese navegador | **Elegido** |
| B) App en React + Vite | Estructura "profesional" por dentro | Paso de compilación, más cosas que pueden fallar al publicar, sin ventaja para el usuario | Descartado |
| C) HTML + base de datos (Supabase) | Los 3 empleados verían los mismos datos en tiempo real | Cuentas y claves, la URL deja de funcionar si la base de datos falla | Siguiente paso posible |

## Decisiones tomadas durante el diseño

- Códigos de control `CLI-0001`, `VH-0001`, `OP-0001`, `GS-0001`, `EV-0001` y bloqueo de duplicados.
- Señal de 300 €, plazo de pago de 3 días, cobro por transferencia o tarjeta.
- Sin financiación ni coches entregados como parte del pago (el negocio solo compra en subastas).
- Facturas en régimen especial de bienes usados (REBU).
- Datos ficticios con patrones realistas: ~5 ventas al mes, híbridos y Toyota rotan rápido, premium con más margen, eléctricos y algunos modelos se atascan.
