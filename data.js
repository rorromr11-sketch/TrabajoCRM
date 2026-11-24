// Datos de ejemplo 100 % ficticios. Las fechas se calculan respecto a "hoy"
// para que el panel y los pendientes siempre tengan contenido.
function buildSeed() {
  const DAY = 864e5;
  const base = new Date(); base.setHours(10, 0, 0, 0);
  const d = (days, hours = 0) => new Date(base.getTime() + days * DAY + hours * 36e5).toISOString();

  // [marca, modelo, versión, año, km, combustible, cambio, color, matrícula, subasta, díasDesdeCompra, precioCompra, gastos, precioVenta, estado]
  const C = [
    ['Seat', 'León', 'FR 1.5 TSI', 2021, 48210, 'Gasolina', 'Manual', 'Blanco', '4821 LKM', 'Autorola', 430, 11200, 650, 15490, 'Vendido'],
    ['Volkswagen', 'Golf', 'Life 2.0 TDI', 2020, 72400, 'Diésel', 'Manual', 'Gris', '3392 LBC', 'Auto1', 372, 12800, 720, 16900, 'Vendido'],
    ['Toyota', 'C-HR', '125H Advance', 2020, 61000, 'Híbrido', 'Automático', 'Rojo', '7710 LDF', 'BCA', 360, 15900, 540, 20500, 'Vendido'],
    ['Peugeot', '3008', 'Allure 1.5 BlueHDi', 2021, 55300, 'Diésel', 'Automático', 'Negro', '2156 LHP', 'Arval', 318, 17400, 890, 22300, 'Vendido'],
    ['Renault', 'Clio', 'Zen TCe 90', 2022, 31200, 'Gasolina', 'Manual', 'Azul', '9043 LRT', 'Ayvens', 271, 9600, 480, 13200, 'Vendido'],
    ['Kia', 'Sportage', 'Drive 1.6 CRDi', 2021, 64800, 'Diésel', 'Manual', 'Blanco', '5587 LKZ', 'Leasys', 228, 16100, 760, 20900, 'Vendido'],
    ['Hyundai', 'Tucson', 'Tecno 1.6 HEV', 2022, 38900, 'Híbrido', 'Automático', 'Gris', '1129 LSV', 'Autorola', 181, 21500, 600, 26900, 'Vendido'],
    ['BMW', 'Serie 1', '118d', 2020, 81500, 'Diésel', 'Automático', 'Negro', '6634 LCX', 'BCA', 146, 15200, 1100, 19800, 'Vendido'],
    ['Audi', 'A3 Sportback', '30 TFSI', 2021, 52700, 'Gasolina', 'Manual', 'Blanco', '8820 LMB', 'Auto1', 117, 17900, 950, 23400, 'Vendido'],
    ['Dacia', 'Sandero', 'Stepway TCe 90', 2022, 27400, 'Gasolina', 'Manual', 'Naranja', '3301 LTD', 'Ayvens', 79, 9800, 390, 13500, 'Vendido'],
    ['Ford', 'Kuga', 'ST-Line 2.5 PHEV', 2021, 59100, 'Híbrido enchufable', 'Automático', 'Gris', '4417 LNF', 'Arval', 66, 19900, 820, 25400, 'Vendido'],
    ['Mercedes-Benz', 'Clase A', '180d Progressive', 2020, 77300, 'Diésel', 'Automático', 'Plata', '2290 LBW', 'Leasys', 47, 17600, 1200, 22900, 'Vendido'],
    ['Opel', 'Corsa', 'Edition 1.2', 2022, 29800, 'Gasolina', 'Manual', 'Rojo', '6015 LTP', 'Autorola', 31, 8900, 420, 12400, 'Vendido'],
    ['Skoda', 'Octavia Combi', 'Style 2.0 TDI', 2021, 89200, 'Diésel', 'Automático', 'Azul', '7782 LJC', 'BCA', 26, 14300, 680, 18700, 'Vendido'],
    ['Volkswagen', 'T-Roc', 'Life 1.0 TSI', 2022, 34100, 'Gasolina', 'Manual', 'Blanco', '1876 LVB', 'Auto1', 22, 17200, 590, 22400, 'Reservado'],
    ['Toyota', 'Corolla', '140H Active Tech', 2022, 41500, 'Híbrido', 'Automático', 'Gris', '5543 LSK', 'Ayvens', 30, 18100, 450, 22900, 'Reservado'],
    ['Cupra', 'Formentor', '1.5 TSI', 2021, 46200, 'Gasolina', 'Manual', 'Gris', '9921 LPZ', 'Arval', 35, 21000, 780, 26500, 'Reservado'],
    ['Nissan', 'Qashqai', 'N-Connecta 1.3 DIG-T', 2021, 58400, 'Gasolina', 'Manual', 'Negro', '3348 LNJ', 'Leasys', 40, 15800, 700, 20400, 'A la venta'],
    ['MG', 'ZS EV', 'Comfort', 2022, 22300, 'Eléctrico', 'Automático', 'Blanco', '0167 LWK', 'Autorola', 55, 16200, 350, 21500, 'A la venta'],
    ['Citroën', 'C4', 'Shine BlueHDi 130', 2021, 63900, 'Diésel', 'Automático', 'Azul', '4472 LMR', 'BCA', 18, 13900, 620, 18300, 'A la venta'],
    ['Seat', 'Arona', 'Xperience 1.0 TSI', 2022, 25600, 'Gasolina', 'Manual', 'Verde', '8135 LVF', 'Auto1', 14, 14200, 480, 18600, 'A la venta'],
    ['Tesla', 'Model 3', 'Standard Range Plus', 2021, 69800, 'Eléctrico', 'Automático', 'Blanco', '2289 LLS', 'Ayvens', 62, 23900, 400, 29900, 'A la venta'],
    ['Fiat', '500', 'Hybrid Dolcevita', 2022, 19700, 'Híbrido', 'Manual', 'Beige', '5506 LTW', 'Leasys', 9, 9400, 300, 12900, 'A la venta'],
    ['Volvo', 'XC40', 'B3 Core', 2022, 44100, 'Gasolina', 'Automático', 'Gris', '7724 LSD', 'Arval', 47, 24800, 900, 31200, 'A la venta'],
    ['Hyundai', 'i20', 'Klass 1.0 TGDI', 2021, 51800, 'Gasolina', 'Manual', 'Rojo', '6698 LKR', 'Autorola', 25, 10200, 520, 14200, 'A la venta'],
    ['Mazda', 'CX-30', 'Zenith 2.0 e-Skyactiv G', 2021, 47600, 'Gasolina', 'Automático', 'Rojo', '3017 LNX', 'BCA', 33, 18400, 640, 23500, 'A la venta'],
    ['Renault', 'Captur', 'Techno E-Tech', 2022, 35200, 'Híbrido', 'Automático', 'Naranja', '1450 LWB', 'Ayvens', 12, 16700, 550, 21300, 'En preparación'],
    ['Kia', 'Niro', 'Drive HEV', 2021, 60300, 'Híbrido', 'Automático', 'Gris', '8869 LRP', 'Leasys', 9, 17300, 500, 21900, 'En preparación'],
    ['Peugeot', '208', 'Active 1.2 PureTech', 2022, 28900, 'Gasolina', 'Manual', 'Amarillo', '2203 LXC', 'Auto1', 4, 10900, 450, 14800, 'En preparación'],
    ['BMW', 'X1', 'sDrive18d', 2020, 84600, 'Diésel', 'Automático', 'Azul', '5571 LFM', 'BCA', 2, 18900, 950, 24500, 'En preparación'],
  ];
  // Generador pseudoaleatorio fijo: los datos salen siempre iguales
  let seed = 20261124;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const WMI = { Seat: 'VSS', Cupra: 'VSS', Volkswagen: 'WVW', Toyota: 'SB1', Peugeot: 'VF3', Renault: 'VF1', Kia: 'KNA', Hyundai: 'KMH', BMW: 'WBA',
    Audi: 'WAU', Dacia: 'UU1', Ford: 'WF0', 'Mercedes-Benz': 'WDD', Opel: 'W0L', Skoda: 'TMB', Nissan: 'SJN', MG: 'LSJ', 'Citroën': 'VF7',
    Tesla: '5YJ', Fiat: 'ZFA', Volvo: 'YV1', Mazda: 'JMZ' };
  const VINCH = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  const vin = (marca) => (WMI[marca] || 'VXX') + Array.from({ length: 14 }, () => VINCH[Math.floor(rnd() * VINCH.length)]).join('');
  const dni = () => { const n = 10000000 + Math.floor(rnd() * 89999999); return n + 'TRWAGMYFPDXBNJZSQVHLCKE'[n % 23]; };

  const coches = C.map((c, i) => ({
    id: 'VH-' + String(i + 1).padStart(4, '0'),
    marca: c[0], modelo: c[1], version: c[2], anio: c[3], km: c[4], combustible: c[5], cambio: c[6], color: c[7],
    matricula: c[8], bastidor: vin(c[0]), subasta: c[9], fechaCompra: d(-c[10]), precioCompra: c[11], gastos: c[12], precioVenta: c[13],
    estado: c[14], fechaVenta: null,
  }));

  // [nombre, teléfono, ciudad, origen, notas]
  const P = [
    ['Javier Morales Ruiz', '611 234 871', 'Getafe', 'Tienda', 'Cliente fiel. Segundo coche con nosotros.'],
    ['Laura Fernández Gil', '622 918 304', 'Leganés', 'coches.net', ''],
    ['Andrés Navarro Pérez', '633 402 115', 'Toledo', 'Web', 'Prefiere contacto por WhatsApp.'],
    ['Marta Sánchez Ortega', '644 551 920', 'Alcorcón', 'coches.net', ''],
    ['Pablo Romero Díaz', '655 120 448', 'Parla', 'Teléfono', 'Primer coche. Muy contento con la entrega.'],
    ['Lucía Martín Castro', '666 873 502', 'Fuenlabrada', 'Web', ''],
    ['Sergio Iglesias Vidal', '677 304 219', 'Madrid', 'coches.net', 'Familia con 2 niños, buscaba SUV.'],
    ['Elena Rubio Herrera', '688 712 036', 'Móstoles', 'WhatsApp', ''],
    ['David Molina Serrano', '699 245 781', 'Illescas', 'Web', ''],
    ['Carmen Delgado Ramos', '612 590 334', 'Getafe', 'Tienda', 'Vino por recomendación de Javier Morales.'],
    ['Raúl Ortiz Medina', '623 017 662', 'Pinto', 'coches.net', 'Interesado en etiqueta CERO.'],
    ['Patricia Gómez León', '634 886 105', 'Valdemoro', 'Email', ''],
    ['Alberto Vázquez Cano', '645 330 978', 'Aranjuez', 'Web', 'Hace muchos km, quería diésel.'],
    ['Cristina Prieto Marín', '656 471 293', 'Leganés', 'Web', 'Reservó online. Recoge el sábado.'],
    ['Óscar Cabrera Núñez', '667 108 540', 'Madrid', 'coches.net', ''],
    ['Natalia Suárez Pascual', '678 925 617', 'Alcorcón', 'WhatsApp', ''],
    ['Iván Reyes Fuentes', '689 362 014', 'Getafe', 'coches.net', 'Pregunta por autonomía real del Tesla.'],
    ['Beatriz Campos Santos', '613 748 251', 'Toledo', 'Web', ''],
    ['Héctor Lozano Calvo', '624 203 886', 'Parla', 'Teléfono', 'Quiere probarlo antes de reservar.'],
    ['Silvia Domínguez Aguilar', '635 619 470', 'Fuenlabrada', 'Email', ''],
    ['Rubén Garrido Benítez', '646 054 327', 'Pinto', 'Tienda', 'Viene a verlo con su pareja.'],
    ['Irene Méndez Flores', '657 482 193', 'Móstoles', 'WhatsApp', ''],
    ['Tomás Herrero Bravo', '668 817 045', 'Madrid', 'coches.net', ''],
    ['Noelia Pastor Moreno', '679 260 518', 'Valdemoro', 'Web', ''],
    ['Gonzalo Peña Rivas', '690 593 762', 'Illescas', 'Tienda', ''],
  ];
  const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(' ').slice(0, 2).join('.');
  const clientes = P.map((p, i) => ({
    id: 'CLI-' + String(i + 1).padStart(4, '0'),
    nombre: p[0], dni: dni(), telefono: p[1], email: slug(p[0]) + '@example.com', ciudad: p[2], origen: p[3], notas: p[4],
    alta: null, contactos: [],
  }));

  const via = { 'coches.net': 'Mensaje', Web: 'Email', Teléfono: 'Llamada', WhatsApp: 'WhatsApp', Email: 'Email', Tienda: 'Visita' };
  const ventas = [];
  const addContacto = (cl, fecha, tipo, nota, empleado = 'Comercial') => cl.contactos.push({ fecha, tipo, nota, empleado });
  const coche = (n) => coches[n - 1];
  const cliente = (n) => clientes[n - 1];

  // Ventas entregadas: [cliente, coche, díasDesdeEntrega]
  [[1, 1, 400], [2, 2, 350], [3, 3, 330], [4, 4, 300], [5, 5, 250], [6, 6, 200], [7, 7, 160],
   [8, 8, 120], [9, 9, 90], [10, 10, 60], [11, 11, 40], [12, 12, 25], [1, 13, 12], [13, 14, 5]].forEach(([cn, vn, ago]) => {
    const cl = cliente(cn), v = coche(vn);
    const inicio = d(-ago - 9), reserva = d(-ago - 6), entrega = d(-ago);
    const g = new Date(entrega); g.setFullYear(g.getFullYear() + 1);
    v.fechaVenta = entrega;
    if (!cl.alta) cl.alta = inicio;
    addContacto(cl, inicio, via[cl.origen], `Pregunta por el ${v.marca} ${v.modelo}.`);
    addContacto(cl, d(-ago - 8), 'Llamada', 'Resuelvo dudas y envío fotos e informe de peritaje.');
    addContacto(cl, reserva, 'Email', 'Reserva online confirmada.', 'Financiero');
    addContacto(cl, entrega, 'Visita', 'Entrega del vehículo, firma y explicación de la garantía.');
    ventas.push({ clienteId: cl.id, cocheId: v.id, etapa: 'Entregado', inicio, reserva, entregaPrevista: entrega, entrega,
      factura: true, transferencia: true, garantiaHasta: g.toISOString(), precio: v.precioVenta, motivoPerdida: '',
      fechaFactura: d(-ago - 5), pagos: [
        { fecha: reserva, importe: 300, concepto: 'Señal de reserva', metodo: 'Tarjeta' },
        { fecha: d(-ago - 3 + (vn % 2)), importe: v.precioVenta - 300, concepto: 'Pago final', metodo: vn % 3 ? 'Transferencia' : 'Tarjeta' }] });
  });

  // Ventas en curso: [cliente, coche, etapa, díasDesdeInicio, díasHastaEntrega, factura, transferencia]
  [[14, 15, 'Reservado', 6, 3, false, false], [15, 16, 'Papeles', 9, 5, true, false], [16, 17, 'Papeles', 4, 10, true, false]]
    .forEach(([cn, vn, etapa, ago, ent, fac, tr]) => {
      const cl = cliente(cn), v = coche(vn);
      cl.alta = d(-ago);
      addContacto(cl, d(-ago), via[cl.origen], `Interesado en el ${v.marca} ${v.modelo}.`);
      addContacto(cl, d(-ago + 2), 'Email', 'Reserva online recibida.', 'Financiero');
      if (fac) addContacto(cl, d(-ago + 4), 'Email', 'Factura y contrato enviados por email.', 'Financiero');
      ventas.push({ clienteId: cl.id, cocheId: v.id, etapa, inicio: d(-ago), reserva: d(-ago + 2), entregaPrevista: d(ent), entrega: null,
        factura: fac, transferencia: tr, garantiaHasta: null, precio: v.precioVenta, motivoPerdida: '',
        fechaFactura: fac ? d(-ago + 4) : null, pagos: [{ fecha: d(-ago + 2), importe: 300, concepto: 'Señal de reserva', metodo: 'Tarjeta' }] });
    });

  // Leads abiertos: [cliente, coche, horasDesdeEntrada, contactado]
  [[17, 22, 72, false], [18, 24, 50, false], [19, 18, 120, true], [20, 19, 6, false], [21, 26, 192, true], [22, 21, 36, false]]
    .forEach(([cn, vn, h, contactado]) => {
      const cl = cliente(cn), v = coche(vn);
      const inicio = d(0, -h);
      cl.alta = inicio;
      if (contactado) {
        addContacto(cl, d(0, -h + 20), 'Llamada', 'Le cuento estado del coche. Quiere verlo en persona.');
        if (cn === 21) addContacto(cl, d(-3), 'Visita', 'Viene a la tienda. Prueba de conducción hecha, se lo piensa.');
      }
      ventas.push({ clienteId: cl.id, cocheId: v.id, etapa: 'Lead', inicio, reserva: null, entregaPrevista: null, entrega: null,
        factura: false, transferencia: false, garantiaHasta: null, precio: v.precioVenta, motivoPerdida: '' });
    });

  // Perdidos: [cliente, coche, díasDesdeInicio, motivo]
  [[23, 20, 15, 'Compró en otro concesionario.'], [24, 25, 22, 'Le pareció caro.'], [25, 22, 50, 'Buscaba financiación.']]
    .forEach(([cn, vn, ago, motivo]) => {
      const cl = cliente(cn), v = coche(vn);
      cl.alta = d(-ago);
      addContacto(cl, d(-ago), via[cl.origen], `Pregunta por el ${v.marca} ${v.modelo}.`);
      addContacto(cl, d(-ago + 3), 'Llamada', 'Descarta la compra: ' + motivo.toLowerCase());
      ventas.push({ clienteId: cl.id, cocheId: v.id, etapa: 'Perdido', inicio: d(-ago), reserva: null, entregaPrevista: null, entrega: null,
        factura: false, transferencia: false, garantiaHasta: null, precio: v.precioVenta, motivoPerdida: motivo });
    });


  // ---------- Histórico adicional: 3-5 ventas más al mes en los últimos 14 meses ----------
  const NOMBRES = ['Alejandro', 'María', 'Daniel', 'Ana', 'Adrián', 'Sara', 'Jorge', 'Paula', 'Miguel', 'Marina', 'Álvaro', 'Clara', 'Diego', 'Alba', 'Fernando',
    'Rocío', 'Hugo', 'Eva', 'Manuel', 'Julia', 'Rafael', 'Lorena', 'Iker', 'Nerea', 'Víctor', 'Sonia', 'Mario', 'Inés', 'Jaime', 'Teresa', 'Antonio', 'Pilar'];
  const APELLIDOS = ['García', 'López', 'Martínez', 'González', 'Rodríguez', 'Hernández', 'Jiménez', 'Moreno', 'Álvarez', 'Muñoz', 'Romero', 'Alonso',
    'Gutiérrez', 'Torres', 'Ruiz', 'Ramírez', 'Gil', 'Serrano', 'Blanco', 'Castillo', 'Cortés', 'Santos', 'Marín', 'Cano', 'Vega', 'Crespo', 'Soto', 'Sáez', 'Ibáñez', 'Vidal'];
  const CIUDADES = ['Madrid', 'Getafe', 'Leganés', 'Fuenlabrada', 'Alcorcón', 'Móstoles', 'Parla', 'Pinto', 'Valdemoro', 'Toledo', 'Illescas', 'Aranjuez', 'Seseña'];
  const ORIG = ['coches.net', 'coches.net', 'coches.net', 'Web', 'Web', 'Tienda', 'Teléfono', 'WhatsApp', 'Email'];
  const COLORES = ['Blanco', 'Gris', 'Negro', 'Azul', 'Rojo', 'Plata'];
  const SUBASTAS = ['Autorola', 'Auto1', 'BCA', 'Leasys', 'Ayvens', 'Arval'];
  // [marca, modelo, versión, combustible, cambio, precio base de subasta para un 2023]
  const MODELOS = [
    ['Seat', 'Ibiza', 'Style 1.0 TSI', 'Gasolina', 'Manual', 12500], ['Seat', 'Ateca', 'Style 1.5 TSI', 'Gasolina', 'Manual', 19500],
    ['Volkswagen', 'Polo', 'Life 1.0 TSI', 'Gasolina', 'Manual', 13500], ['Volkswagen', 'Tiguan', 'Life 2.0 TDI', 'Diésel', 'Automático', 25000],
    ['Toyota', 'Yaris', '120H Active', 'Híbrido', 'Automático', 14500], ['Toyota', 'RAV4', '220H Advance', 'Híbrido', 'Automático', 27500],
    ['Renault', 'Mégane', 'Intens TCe 140', 'Gasolina', 'Manual', 14000], ['Renault', 'Arkana', 'Techno E-Tech', 'Híbrido', 'Automático', 21000],
    ['Peugeot', '2008', 'Allure 1.2 PureTech', 'Gasolina', 'Manual', 16000], ['Peugeot', '308', 'Allure 1.5 BlueHDi', 'Diésel', 'Manual', 16500],
    ['Kia', 'Ceed', 'Drive 1.0 T-GDi', 'Gasolina', 'Manual', 14000], ['Kia', 'Stonic', 'Drive 1.0 T-GDi MHEV', 'Híbrido', 'Manual', 14500],
    ['Hyundai', 'Kona', 'Maxx 1.0 TGDI', 'Gasolina', 'Manual', 15500], ['Ford', 'Puma', 'ST-Line 1.0 EcoBoost MHEV', 'Híbrido', 'Manual', 17000],
    ['Ford', 'Focus', 'Trend+ 1.5 EcoBlue', 'Diésel', 'Manual', 14000], ['Opel', 'Mokka', 'GS Line 1.2T', 'Gasolina', 'Automático', 17500],
    ['Skoda', 'Kamiq', 'Ambition 1.0 TSI', 'Gasolina', 'Manual', 16500], ['Citroën', 'C3 Aircross', 'Shine PureTech 110', 'Gasolina', 'Manual', 13500],
    ['Nissan', 'Juke', 'N-Connecta DIG-T 114', 'Gasolina', 'Manual', 15500], ['Dacia', 'Duster', 'Prestige TCe 130', 'Gasolina', 'Manual', 14000],
    ['BMW', 'Serie 3', '318d', 'Diésel', 'Automático', 24000], ['Audi', 'Q3', '35 TFSI S tronic', 'Gasolina', 'Automático', 28000],
    ['Mercedes-Benz', 'GLA', '200 Progressive', 'Gasolina', 'Automático', 27000], ['Mazda', 'CX-5', 'Zenith 2.0 e-Skyactiv G', 'Gasolina', 'Automático', 22000],
  ];
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const LET = 'BCDFGHJKLMNPRSTVWXYZ', LET_ANIO = { 2019: 'K', 2020: 'L', 2021: 'L', 2022: 'M', 2023: 'M' };
  const mats = new Set(coches.map((c) => c.matricula));
  const tels = new Set(clientes.map((c) => c.telefono.replace(/\D/g, '')));
  const mails = new Set(clientes.map((c) => c.email));
  const nombresUsados = new Set(clientes.map((c) => c.nombre));
  const nuevaMatricula = (anio) => { let m; do { m = String(Math.floor(rnd() * 10000)).padStart(4, '0') + ' ' + LET_ANIO[anio] + pick(LET) + pick(LET); } while (mats.has(m)); mats.add(m); return m; };
  const nuevoTel = () => { let t; do { t = '6' + String(Math.floor(rnd() * 1e8)).padStart(8, '0'); } while (tels.has(t)); tels.add(t); return `${t.slice(0, 3)} ${t.slice(3, 6)} ${t.slice(6)}`; };
  let tmp = 0;
  for (let m = 13; m >= 0; m--) {
    const n = 3 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      const ref = new Date(base.getFullYear(), base.getMonth() - m, 1);
      const dim = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
      const ent = new Date(ref.getFullYear(), ref.getMonth(), 1 + Math.floor(rnd() * dim), 10);
      const ago = Math.round((base - ent) / DAY);
      if (ago < 3) continue;
      // Vehículo
      const md = pick(MODELOS), anio = 2019 + Math.floor(rnd() * 5);
      const km = Math.min(140000, Math.max(15000, Math.round((18000 + rnd() * 22000) * (2025 - anio) / 100) * 100));
      const compra = Math.round(md[5] * (1 - 0.07 * (2023 - anio)) * (1 - km / 500000) / 100) * 100;
      const prep = 300 + Math.floor(rnd() * 8) * 100;
      // Patrones de mercado: rapidez de venta y margen según tipo de coche
      const premium = ['BMW', 'Audi', 'Mercedes-Benz'].includes(md[0]);
      let vel = 1, extra = 0;
      if (md[3] === 'Híbrido') { vel *= 0.65; extra += 300; }
      if (md[3] === 'Diésel') vel *= 1.2;
      if (md[4] === 'Automático') vel *= 0.9;
      if (premium) { vel *= 1.35; extra += 1300; }
      if (['Toyota', 'Dacia', 'Kia'].includes(md[0])) vel *= 0.75;
      if (md[0] === 'Dacia') extra -= 700;
      if (['Toyota', 'Mazda'].includes(md[0])) extra += 450;
      if (['Citroën', 'Opel', 'Ford'].includes(md[1] === 'Focus' ? 'Ford' : md[0])) { vel *= 1.25; extra -= 400; }
      const diasStock = Math.max(6, Math.round((10 + rnd() * 34) * vel));
      const pvp = Math.round((compra + prep + 2300 + extra + rnd() * 2000) / 100) * 100 - 10;
      const car = { id: 'TMPV' + (++tmp), marca: md[0], modelo: md[1], version: md[2], anio, km, combustible: md[3], cambio: md[4], color: pick(COLORES),
        matricula: nuevaMatricula(anio), bastidor: vin(md[0]), subasta: pick(SUBASTAS), fechaCompra: d(-ago - diasStock),
        precioCompra: compra, gastos: prep, precioVenta: pvp, estado: 'Vendido', fechaVenta: d(-ago) };
      coches.push(car);
      // Cliente
      let nombre;
      do { nombre = `${pick(NOMBRES)} ${pick(APELLIDOS)} ${pick(APELLIDOS)}`; } while (nombresUsados.has(nombre) || nombre.split(' ')[1] === nombre.split(' ')[2]);
      nombresUsados.add(nombre);
      let email = slug(nombre) + '@example.com', i2 = 2;
      while (mails.has(email)) email = slug(nombre) + (i2++) + '@example.com';
      mails.add(email);
      const inicio = d(-ago - 9 - Math.floor(rnd() * 8)), reserva = d(-ago - 6), entrega = d(-ago);
      const cl = { id: 'TMPC' + tmp, nombre, dni: dni(), telefono: nuevoTel(), email, ciudad: pick(CIUDADES), origen: pick(ORIG), notas: '', alta: inicio, contactos: [] };
      clientes.push(cl);
      const g = new Date(entrega); g.setFullYear(g.getFullYear() + 1);
      addContacto(cl, inicio, via[cl.origen], `Pregunta por el ${car.marca} ${car.modelo}.`);
      addContacto(cl, d(-ago - 8), 'Llamada', 'Resuelvo dudas y envío fotos e informe de peritaje.');
      addContacto(cl, reserva, 'Email', 'Reserva online confirmada.', 'Financiero');
      addContacto(cl, entrega, 'Visita', 'Entrega del vehículo, firma y explicación de la garantía.');
      const seg = g.getTime() - 55 * DAY;
      if (seg < base.getTime()) addContacto(cl, new Date(seg).toISOString(), 'Llamada', 'Seguimiento antes de fin de garantía. Contento con el coche.');
      ventas.push({ clienteId: cl.id, cocheId: car.id, etapa: 'Entregado', inicio, reserva, entregaPrevista: entrega, entrega,
        factura: true, transferencia: true, garantiaHasta: g.toISOString(), precio: pvp, motivoPerdida: '', fechaFactura: d(-ago - 5), pagos: [
          { fecha: reserva, importe: 300, concepto: 'Señal de reserva', metodo: 'Tarjeta' },
          { fecha: d(-ago - 3), importe: pvp - 300, concepto: 'Pago final', metodo: rnd() < 0.7 ? 'Transferencia' : 'Tarjeta' }] });
    }
  }

  // ---------- Códigos de control ordenados por fecha de alta ----------
  coches.sort((a, b) => a.fechaCompra.localeCompare(b.fechaCompra));
  const mapV = {}; coches.forEach((c, i) => { mapV[c.id] = 'VH-' + String(i + 1).padStart(4, '0'); });
  coches.forEach((c) => { c.id = mapV[c.id]; });
  clientes.sort((a, b) => a.alta.localeCompare(b.alta));
  const mapC = {}; clientes.forEach((c, i) => { mapC[c.id] = 'CLI-' + String(i + 1).padStart(4, '0'); });
  clientes.forEach((c) => { c.id = mapC[c.id]; });
  ventas.forEach((v) => { v.cocheId = mapV[v.cocheId]; v.clienteId = mapC[v.clienteId]; });

  // Nº de operación, documentación y nº de factura correlativo por año
  ventas.sort((a, b) => a.inicio.localeCompare(b.inicio));
  const contador = {};
  ventas.forEach((v, i) => {
    v.id = 'OP-' + String(i + 1).padStart(4, '0');
    const entregado = v.etapa === 'Entregado';
    v.docs = { contrato: v.factura, factura: v.factura, transferencia: v.transferencia, fichaTecnica: entregado, permiso: entregado };
    v.numFactura = null;
    v.fechaFactura = v.fechaFactura || null;
    v.vencimiento = v.fechaFactura ? new Date(new Date(v.fechaFactura).getTime() + 3 * DAY).toISOString() : null;
    v.pagos = v.pagos || [];
    v.recordatorio = null;
  });
  ventas.filter((v) => v.factura).sort((a, b) => a.fechaFactura.localeCompare(b.fechaFactura)).forEach((v) => {
    const y = new Date(v.fechaFactura).getFullYear();
    contador[y] = (contador[y] || 0) + 1;
    v.numFactura = `F-${y}-${String(contador[y]).padStart(4, '0')}`;
  });
  ventas.forEach((v) => { delete v.factura; delete v.transferencia; });

  // ---------- Gastos ----------
  const gastos = [];
  const G = (fecha, categoria, concepto, proveedor, importe, numFactura, cocheId = null) => gastos.push({ fecha, categoria, concepto, proveedor, importe, numFactura, cocheId });
  // [día, categoría, concepto, proveedor, importe, prefijo factura]
  const FIJOS = [
    [1, 'Alquiler', 'Alquiler nave y exposición', 'Naves Polígono Sur, S.L.', 2400, 'NPS'],
    [2, 'Marketing', 'Cuota profesional coches.net', 'coches.net', 450, 'CN'],
    [3, 'Software', 'Hosting web, dominio y software de gestión', 'Hosting y software', 49, 'HST'],
    [5, 'Seguros', 'Seguro de responsabilidad civil y vehículos en stock', 'Mutua Castellana de Seguros', 290, 'MCS'],
    [10, 'Suministros', 'Luz, agua e internet', 'Suministros varios', 380, 'SUM'],
    [15, 'Gestoría', 'Asesoría fiscal, laboral y contable', 'Gestoría Ruiz y Asociados', 180, 'GRA'],
    [20, 'Marketing', 'Campañas en redes sociales', 'Publicidad online', 280, 'ADS'],
    [28, 'Personal', 'Nóminas (3 empleados)', 'Plantilla', 5850, null],
    [30, 'Personal', 'Seguridad Social a cargo de la empresa', 'Tesorería General de la Seguridad Social', 1890, null],
  ];
  for (let m = 13; m >= 0; m--) {
    const y = base.getFullYear(), mo = base.getMonth() - m;
    const ref = new Date(y, mo, 1), dim = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
    FIJOS.forEach(([dia, cat, concepto, prov, imp, pre]) => {
      const f = new Date(ref.getFullYear(), ref.getMonth(), Math.min(dia, dim), 9);
      if (f > base) return;
      let importe = imp;
      if (cat === 'Suministros') importe = Math.round(imp * (0.85 + rnd() * 0.3));
      if (concepto.startsWith('Campañas')) importe = 180 + Math.round(rnd() * 17) * 10;
      G(f.toISOString(), cat, concepto, prov, importe, pre ? `${pre}-${ref.getFullYear()}${String(ref.getMonth() + 1).padStart(2, '0')}` : null);
    });
  }
  const nf = (pre) => `${pre}-${String(10000 + Math.floor(rnd() * 89999))}`;
  coches.forEach((c) => {
    const f = new Date(c.fechaCompra);
    G(c.fechaCompra, 'Costes por vehículo', `Comisión de subasta · ${c.marca} ${c.modelo}`, c.subasta, Math.round(c.precioCompra * 0.025 + 90), nf(c.subasta.slice(0, 3).toUpperCase()), c.id);
    const ft = new Date(f.getTime() + 2 * DAY);
    if (ft <= base) G(ft.toISOString(), 'Costes por vehículo', `Transporte desde subasta · ${c.marca} ${c.modelo}`, 'Transportes Hermanos Gil', 180 + Math.floor(rnd() * 18) * 10, nf('THG'), c.id);
    if (c.fechaVenta) G(new Date(new Date(c.fechaVenta).getTime() - DAY).toISOString(), 'Costes por vehículo', `Tasa DGT cambio de titularidad · ${c.matricula}`, 'Dirección General de Tráfico', 55.7, null, c.id);
  });
  gastos.sort((a, b) => a.fecha.localeCompare(b.fecha));
  const mesPasado = new Date(base.getFullYear(), base.getMonth() - 1, 1);
  gastos.forEach((g, i) => {
    g.id = 'GS-' + String(i + 1).padStart(4, '0');
    const f = new Date(g.fecha);
    g.estado = g.categoria !== 'Personal' && base - f < 5 * DAY ? 'Pendiente' : 'Pagado';
    if (g.categoria === 'Gestoría' && f.getMonth() === mesPasado.getMonth() && f.getFullYear() === mesPasado.getFullYear()) g.estado = 'Pendiente';
    g.fechaPago = g.estado === 'Pagado' ? g.fecha : null;
  });
  // ---------- Agenda: eventos manuales de ejemplo ----------
  const cid = (nombre) => (clientes.find((c) => c.nombre === nombre) || {}).id || null;
  const vid = (mat) => (coches.find((c) => c.matricula === mat) || {}).id || null;
  const at = (dias, hora) => { const f = new Date(base.getTime() + dias * DAY); const [h, m] = hora.split(':'); f.setHours(+h, +m, 0, 0); return f.toISOString(); };
  // [días desde hoy, hora, título, tipo, puesto, cliente, matrícula, hecho]
  const EV = [
    [-3, '10:00', 'Prueba de conducción Mazda CX-30', 'Prueba de conducción', 'Comercial', 'Rubén Garrido Benítez', '3017 LNX', true],
    [-2, '12:30', 'Peritaje vehículos lote Leasys', 'Peritaje', 'Comprador', null, '8869 LRP', true],
    [-1, '16:00', 'Revisar documentación transferencia Corolla', 'Gestión', 'Financiero', 'Óscar Cabrera Núñez', '5543 LSK', true],
    [0, '09:30', 'Llevar Renault Captur a ITV', 'Taller / ITV', 'Comprador', null, '1450 LWB', false],
    [0, '11:00', 'Llamar a Iván Reyes: dudas autonomía Tesla', 'Llamada', 'Comercial', 'Iván Reyes Fuentes', '2289 LLS', false],
    [0, '17:30', 'Visita en tienda: Héctor Lozano', 'Cita', 'Comercial', 'Héctor Lozano Calvo', '3348 LNJ', false],
    [1, '10:00', 'Subasta online BCA (lote semanal)', 'Subasta', 'Comprador', null, null, false],
    [1, '13:00', 'Reclamar pago factura vencida', 'Llamada', 'Financiero', 'Óscar Cabrera Núñez', null, false],
    [1, '18:00', 'Prueba de conducción Volvo XC40', 'Prueba de conducción', 'Comercial', 'Beatriz Campos Santos', '7724 LSD', false],
    [2, '09:00', 'Kia Niro: recoger del taller', 'Taller / ITV', 'Comprador', null, '8869 LRP', false],
    [2, '12:00', 'Sesión de fotos del stock nuevo', 'Tarea', 'Comercial', null, null, false],
    [3, '10:30', 'Recogida vehículos Autorola', 'Recogida', 'Comprador', null, null, false],
    [3, '16:00', 'Conciliación bancaria mensual', 'Gestión', 'Financiero', null, null, false],
    [6, '11:00', 'Subasta Auto1: SUV híbridos', 'Subasta', 'Comprador', null, null, false],
    [7, '17:00', 'Cita: Silvia Domínguez (MG ZS EV)', 'Cita', 'Comercial', 'Silvia Domínguez Aguilar', '0167 LWK', false],
    [9, '10:00', 'Renovación póliza de seguro del stock', 'Gestión', 'Financiero', null, null, false],
    [13, '10:00', 'Subasta Arval: renting fin de contrato', 'Subasta', 'Comprador', null, null, false],
    [15, '12:00', 'Campaña de diciembre en redes', 'Tarea', 'Comercial', null, null, false],
  ];
  const eventos = EV.map(([dd, h, titulo, tipo, puesto, cl, mat, hecho], i) => ({
    id: 'EV-' + String(i + 1).padStart(4, '0'), fecha: at(dd, h), titulo, tipo, puesto, clienteId: cl ? cid(cl) : null, cocheId: mat ? vid(mat) : null, notas: '', hecho,
  }));
  return { clientes, coches, ventas, gastos, eventos };
}
