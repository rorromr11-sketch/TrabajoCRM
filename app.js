'use strict';
/* =====================================================================
   CRM AutoSelect Vega · lógica de la aplicación
   ===================================================================== */

/* ---------- Persistencia ---------- */
const KEY = 'crm-autoselect-v7';
const DAY = 864e5;
let db = load();

function load() {
  let d = null;
  try { const raw = localStorage.getItem(KEY); if (raw) d = JSON.parse(raw); } catch (e) { /* sin almacenamiento */ }
  d = d || buildSeed();
  d.log = d.log || [];
  d.eventos = d.eventos || [];
  return d;
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* sin almacenamiento */ } }
function pref(k, v) {
  try { if (v === undefined) return localStorage.getItem(KEY + '-' + k); localStorage.setItem(KEY + '-' + k, v); } catch (e) { return null; }
}
const getSoy = () => pref('soy') || 'Todos';

/* ---------- Iconos (SVG propios, trazo 1.75) ---------- */
const ICONS = {
  panel: '<rect x="3.5" y="3.5" width="7" height="8.5"/><rect x="13.5" y="3.5" width="7" height="5"/><rect x="13.5" y="11.5" width="7" height="9"/><rect x="3.5" y="15" width="7" height="5.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.1.7 3.5 2.8 3.5 5.7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5"/>',
  car: '<path d="M5 17H3v-4l2.2-5.4A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.1L21 13v4h-2"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5M3.5 12.5h17"/>',
  euro: '<path d="M17.5 6.5A6.5 6.5 0 1 0 17.5 17.5"/><path d="M4 10.5h9M4 13.5h9"/>',
  tasks: '<rect x="4" y="3.5" width="16" height="17" rx="1"/><path d="M7.5 9l1.5 1.5L11.5 8M7.5 15l1.5 1.5 2.5-2.5M14 9.5h3M14 15.5h3"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
  chat: '<path d="M4 5h16v11H9.5L5 19.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  store: '<path d="M3.5 9.5l1.5-5h14l1.5 5M4.5 9.5V20h15V9.5M3.5 9.5h17"/><path d="M10 20v-5h4v5"/>',
  wheel: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2"/><path d="M12 14v6.5M10 12H3.5M14 12h6.5"/>',
  doc: '<path d="M6 3.5h8.5L18 7v13.5H6z"/><path d="M14 3.5V7h4M9 11h6M9 14h6M9 17h4"/>',
  bank: '<path d="M3.5 20.5h17M5.5 18v-7M9.8 18v-7M14.2 18v-7M18.5 18v-7M3 8.5L12 4l9 4.5z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M13.5 9.5l2 2"/>',
  wrench: '<path d="M15 4.5a4.5 4.5 0 0 0-4.3 5.8L4 17a2.1 2.1 0 0 0 3 3l6.7-6.7A4.5 4.5 0 0 0 19.5 9l-2.8 2.8-2.7-.6-.6-2.7z"/>',
  shield: '<path d="M12 3.5l7 2.5v5.5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
  trash: '<path d="M4.5 6.5h15M9.5 6.5V4h5v2.5M6.5 6.5l1 14h9l1-14M10 10.5v6M14 10.5v6"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  trend: '<path d="M3.5 17l5.5-5.5 4 4 7.5-7.5"/><path d="M15 8h5.5v5.5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  tag: '<path d="M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5z"/><circle cx="8" cy="8.5" r="1.5"/>',
  inbox: '<path d="M3.5 13.5l2.5-8h12l2.5 8v6h-17z"/><path d="M3.5 13.5h5l1 2.5h5l1-2.5h5"/>',
  alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5M12 17.5v.5"/>',
  list: '<path d="M8.5 6.5h12M8.5 12h12M8.5 17.5h12"/><path d="M3.5 6.5h1M3.5 12h1M3.5 17.5h1"/>',
  wallet: '<path d="M17 7.5V5.5a1 1 0 0 0-1-1H5.5A1.5 1.5 0 0 0 4 6v12.5A1.5 1.5 0 0 0 5.5 20H19a1 1 0 0 0 1-1v-10.5a1 1 0 0 0-1-1H5.5A1.5 1.5 0 0 1 4 6"/><path d="M15.5 13.5h1.5"/>',
  card: '<rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="M3 9.5h18M6.5 15h4"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5h4"/>',
  chart: '<path d="M3.5 20.5h17"/><rect x="5" y="11" width="3" height="7"/><rect x="10.5" y="6" width="3" height="12"/><rect x="16" y="13.5" width="3" height="4.5"/>',
  bulb: '<path d="M9 17.5h6M10 20.5h4"/><path d="M12 3.5a6 6 0 0 0-3.5 10.9V16h7v-1.6A6 6 0 0 0 12 3.5z"/>',
  print: '<path d="M7 8.5V3.5h10v5"/><rect x="3.5" y="8.5" width="17" height="8" rx="1"/><path d="M7 14h10v6.5H7z"/><path d="M17 11.5h.5"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4.5V8H7"/><path d="M12 7.5V12l3 2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2"/>',
  board: '<rect x="3.5" y="4" width="4.5" height="16"/><rect x="9.75" y="4" width="4.5" height="11"/><rect x="16" y="4" width="4.5" height="7"/>',
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const ICON_CONTACTO = { Llamada: 'phone', WhatsApp: 'chat', Mensaje: 'chat', Email: 'mail', Visita: 'store', 'Prueba de conducción': 'wheel' };

/* ---------- Utilidades ---------- */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eurF = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' });
const numF = new Intl.NumberFormat('es-ES', { useGrouping: 'always' });
const eur = (n) => eurF.format(n || 0);
const eurCF = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' });
const eurC = (n) => eurCF.format(n || 0);
const num = (n) => numF.format(n || 0);
const fecha = (iso) => iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
const fechaHora = (iso) => iso ? new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
function rel(iso, conHora = false) {
  if (!iso) return '—';
  const d = new Date(iso), h = new Date(); h.setHours(0, 0, 0, 0);
  const x = new Date(d); x.setHours(0, 0, 0, 0);
  const n = Math.round((x - h) / DAY);
  const hora = conHora ? ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '';
  let t;
  if (n === 0) t = 'hoy'; else if (n === -1) t = 'ayer'; else if (n === 1) t = 'mañana';
  else if (n < 0 && n > -7) t = `hace ${-n} días`; else if (n > 0 && n < 7) t = `en ${n} días`;
  else return `<span title="${fechaHora(iso)}">${fecha(iso)}</span>`;
  return `<span title="${fechaHora(iso)}">${t}${hora}</span>`;
}
const isoDate = (iso) => iso ? new Date(iso).toISOString().slice(0, 10) : '';
const now = () => Date.now();
const hoyISO = () => new Date().toISOString();
const dias = (a, b = now()) => Math.floor((new Date(b) - new Date(a)) / DAY);
const st = (s) => `<span class="st ${String(s).replace(/ /g, '-')}">${esc(s)}</span>`;
const nextId = (prefix, list) => prefix + String(list.reduce((m, x) => Math.max(m, parseInt(x.id.split('-').pop(), 10) || 0), 0) + 1).padStart(4, '0');

const cliente = (id) => db.clientes.find((c) => c.id === id);
const coche = (id) => db.coches.find((c) => c.id === id);
const venta = (id) => db.ventas.find((v) => v.id === id);
const nombreCoche = (v) => v ? `${v.marca} ${v.modelo}` : '—';
const extrasDe = (id) => (db.gastos || []).reduce((s, g) => (g.cocheId === id ? s + g.importe : s), 0);
const costeTotal = (v) => v.precioCompra + v.gastos + extrasDe(v.id);
const margen = (v) => v.precioVenta - costeTotal(v);
const ventasDe = (cid) => db.ventas.filter((v) => v.clienteId === cid);
const ultimoContacto = (c) => c.contactos.reduce((m, x) => (!m || x.fecha > m ? x.fecha : m), null);
const ABIERTAS = ['Lead', 'Reservado', 'Papeles'];
const CON_FACTURA = ['Reservado', 'Papeles', 'Entregado'];

function estadoCliente(c) {
  const vs = ventasDe(c.id);
  const ab = vs.filter((v) => ABIERTAS.includes(v.etapa)).sort((a, b) => b.inicio.localeCompare(a.inicio));
  if (ab.length) return ab[0].etapa;
  if (vs.some((v) => v.etapa === 'Entregado')) return 'Entregado';
  return vs.length ? 'Perdido' : 'Lead';
}

/* ---------- Validación y duplicados ---------- */
const normDni = (s) => String(s || '').toUpperCase().replace(/[\s.-]/g, '');
const normTel = (s) => String(s || '').replace(/\D/g, '').replace(/^34(?=\d{9}$)/, '');
const normMat = (s) => String(s || '').toUpperCase().replace(/[\s-]/g, '');
const fmtMat = (s) => { const m = normMat(s); return /^\d{4}[A-Z]{3}$/.test(m) ? m.slice(0, 4) + ' ' + m.slice(4) : m; };
const fmtTel = (s) => { const t = normTel(s); return t.length === 9 ? `${t.slice(0, 3)} ${t.slice(3, 6)} ${t.slice(6)}` : String(s || '').trim(); };
const LETRAS = 'TRWAGMYFPDXBNJZSQVHLCKE';
function dniValido(d) {
  if (/^\d{8}[A-Z]$/.test(d)) return LETRAS[+d.slice(0, 8) % 23] === d[8];
  if (/^[XYZ]\d{7}[A-Z]$/.test(d)) return LETRAS[+('XYZ'.indexOf(d[0]) + d.slice(1, 8)) % 23] === d[8];
  return /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(d); // CIF de empresa
}
const vinValido = (v) => /^[A-HJ-NPR-Z0-9]{17}$/.test(v);
const DOCS = [
  ['contrato', 'Contrato de compraventa firmado'],
  ['factura', 'Factura emitida y enviada al cliente'],
  ['transferencia', 'Transferencia de titularidad en la DGT'],
  ['fichaTecnica', 'Ficha técnica con ITV en vigor'],
  ['permiso', 'Permiso de circulación a nombre del cliente'],
];
const docsFaltan = (v) => DOCS.filter(([k]) => !v.docs[k]).map(([, l]) => l);
/* ---------- Historial de cambios ---------- */
function log(refs, texto) {
  db.log.unshift({ fecha: hoyISO(), usuario: getSoy() === 'Todos' ? 'Gerencia' : PUESTO[getSoy()], refs: refs.filter(Boolean), texto });
  if (db.log.length > 600) db.log.length = 600;
}
function cambios(obj, vals, nombres) {
  return Object.keys(nombres).filter((k) => String(obj[k] ?? '') !== String(vals[k] ?? '')).map((k) => nombres[k]).join(', ');
}
function historialHtml(ids, vacio = 'Sin cambios registrados desde la carga de datos.') {
  const l = db.log.filter((x) => x.refs.some((r) => ids.includes(r))).slice(0, 25);
  return l.length ? `<ul class="hist">${l.map((x) => `<li><span class="when">${rel(x.fecha, true)}</span><span class="who">${esc(x.usuario)}</span><span>${esc(x.texto)}</span></li>`).join('')}</ul>` : `<div class="empty small">${vacio}</div>`;
}

/* ---------- Cobros ---------- */
const SENAL = 300;          // señal que paga el cliente al reservar online
const PLAZO_PAGO = 3;       // días para pagar la factura
const cobrado = (v) => (v.pagos || []).reduce((s, p) => s + p.importe, 0);
const pendienteCobro = (v) => Math.max(0, v.precio - cobrado(v));
function estadoFin(v) {
  if (!['Reservado', 'Papeles', 'Entregado'].includes(v.etapa)) return null;
  if (!v.numFactura) return 'Pendiente de facturar';
  if (pendienteCobro(v) <= 0) return 'Cobrada';
  return now() > new Date(v.vencimiento) ? 'Vencida' : 'Pendiente de cobro';
}
function siguienteFactura() {
  const y = new Date().getFullYear();
  const n = db.ventas.filter((v) => v.numFactura && v.numFactura.startsWith(`F-${y}-`)).reduce((m, v) => Math.max(m, +v.numFactura.slice(-4)), 0);
  return `F-${y}-${String(n + 1).padStart(4, '0')}`;
}

/* ---------- Pendientes (se generan solos) ---------- */
function pendientes() {
  const t = now(), out = [];
  db.ventas.forEach((v) => {
    const c = cliente(v.clienteId), car = coche(v.cocheId);
    if (!c || !car) return;
    if (v.etapa === 'Lead' && t - new Date(v.inicio) > DAY && !c.contactos.some((x) => x.fecha >= v.inicio)) {
      out.push({ ico: 'inbox', who: 'Comercial', prio: 1, txt: `Responder a ${c.nombre}`,
        sub: `Solicitud por ${c.origen} sin respuesta desde hace ${Math.floor((t - new Date(v.inicio)) / 36e5)} h · ${nombreCoche(car)} ${car.id}`,
        act: 'contacto', id: c.id, btn: 'Registrar contacto' });
    }
    if (v.etapa === 'Reservado') {
      out.push({ ico: 'doc', who: 'Financiero', prio: 2, txt: `Emitir factura y contrato · ${v.id}`,
        sub: `${c.nombre} · ${nombreCoche(car)} ${car.matricula} · ${eur(v.precio)}`, act: 'facturar', id: v.id, btn: 'Emitir factura' });
    }
    if (estadoFin(v) === 'Vencida') {
      out.push({ ico: 'alert', who: 'Financiero', prio: 1, txt: `Factura vencida ${v.numFactura} · ${c.nombre}`,
        sub: `Pendiente ${eur(pendienteCobro(v))} · venció el ${fecha(v.vencimiento)}${v.recordatorio ? ' · recordatorio enviado ' + fecha(v.recordatorio) : ''}`,
        act: 'cobro', id: v.id, btn: 'Registrar cobro' });
    }
    if (v.etapa === 'Papeles' && docsFaltan(v).length) {
      out.push({ ico: 'bank', who: 'Financiero', prio: 2, txt: `Completar documentación · ${v.id}`,
        sub: `Falta: ${docsFaltan(v).join(', ')}`, act: 'venta', id: v.id, btn: 'Abrir operación' });
    }
    if (['Reservado', 'Papeles'].includes(v.etapa) && v.entregaPrevista && new Date(v.entregaPrevista) - t < 7 * DAY) {
      const d = Math.ceil((new Date(v.entregaPrevista) - t) / DAY);
      out.push({ ico: 'key', who: 'Comercial', prio: d <= 2 ? 1 : 3, txt: `Preparar entrega a ${c.nombre}`,
        sub: `${nombreCoche(car)} ${car.matricula} · ${d <= 0 ? 'prevista para hoy o atrasada' : 'en ' + d + ' días'} (${fecha(v.entregaPrevista)})`,
        act: 'venta', id: v.id, btn: 'Ver operación' });
    }
    if (v.etapa === 'Entregado' && v.garantiaHasta) {
      const fin = new Date(v.garantiaHasta), quedan = Math.ceil((fin - t) / DAY);
      const desde = new Date(fin - 60 * DAY).toISOString();
      if (quedan >= 0 && quedan <= 60 && !c.contactos.some((x) => x.fecha >= desde)) {
        out.push({ ico: 'shield', who: 'Comercial', prio: 3, txt: `Garantía a punto de vencer · ${c.nombre}`,
          sub: `${nombreCoche(car)} · vence en ${quedan} días. Llamar y ofrecer renovación del vehículo.`, act: 'contacto', id: c.id, btn: 'Registrar llamada' });
      }
    }
  });
  db.coches.forEach((car) => {
    const d = dias(car.fechaCompra);
    if (car.estado === 'En preparación' && d > 7) {
      out.push({ ico: 'wrench', who: 'Comprador', prio: 2, txt: `Terminar preparación · ${nombreCoche(car)} ${car.id}`,
        sub: `${car.matricula} · ${d} días desde la subasta (${car.subasta})`, act: 'publicar', id: car.id, btn: 'Publicar a la venta' });
    }
    if (car.estado === 'A la venta' && d > 45) {
      out.push({ ico: 'tag', who: 'Comprador', prio: 3, txt: `Revisar precio · ${nombreCoche(car)} ${car.id}`,
        sub: `${d} días en stock a ${eur(car.precioVenta)}. Margen actual ${eur(margen(car))}.`, act: 'editarCoche', id: car.id, btn: 'Editar vehículo' });
    }
  });
  (db.eventos || []).forEach((e) => {
    if (e.hecho) return;
    const f = new Date(e.fecha), finHoy = new Date(); finHoy.setHours(23, 59, 59, 999);
    if (f > finHoy) return;
    const atras = dias(e.fecha) >= 1;
    const who = e.puesto === 'Todos' ? 'Comercial' : e.puesto;
    out.push({ ico: 'calendar', who, prio: atras ? 1 : 2, txt: `${atras ? 'Atrasado: ' : 'Hoy ' + f.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' · '}${e.titulo}`,
      sub: `${e.tipo}${e.clienteId && cliente(e.clienteId) ? ' · ' + cliente(e.clienteId).nombre : ''}${atras ? ' · previsto ' + fecha(e.fecha) : ''}`, act: 'evHecho', id: e.id, btn: 'Marcar hecho' });
  });
  (db.gastos || []).forEach((g) => {
    const d = dias(g.fecha);
    if (g.estado === 'Pendiente' && d > 10) {
      out.push({ ico: 'wallet', who: 'Financiero', prio: d > 30 ? 1 : 2, txt: `Pagar factura de proveedor · ${g.proveedor}`,
        sub: `${g.numFactura || g.id} · ${g.concepto} · ${eurC(g.importe)} · recibida hace ${d} días`, act: 'pagarGasto', id: g.id, btn: 'Marcar pagada' });
    }
  });
  const soy = getSoy();
  return out.filter((p) => soy === 'Todos' || p.who === soy).sort((a, b) => a.prio - b.prio);
}

/* ---------- Indicadores ---------- */
function kpis() {
  const d = new Date();
  const entregadas = db.ventas.filter((v) => v.etapa === 'Entregado');
  const delMes = entregadas.filter((v) => { const e = new Date(v.entrega); return e.getMonth() === d.getMonth() && e.getFullYear() === d.getFullYear(); });
  const vendidos = db.coches.filter((c) => c.estado === 'Vendido');
  const dStock = vendidos.filter((c) => c.fechaVenta).map((c) => dias(c.fechaCompra, c.fechaVenta));
  const stock = db.coches.filter((c) => c.estado !== 'Vendido');
  return {
    ventasMes: delMes.length, ingresosMes: delMes.reduce((s, v) => s + v.precio, 0),
    margenMedio: vendidos.length ? vendidos.reduce((s, c) => s + margen(c), 0) / vendidos.length : 0,
    diasMedios: dStock.length ? Math.round(dStock.reduce((a, b) => a + b, 0) / dStock.length) : 0,
    stock: stock.length, valorStock: stock.reduce((s, c) => s + c.precioVenta, 0),
    leads: db.ventas.filter((v) => v.etapa === 'Lead').length,
    repiten: db.clientes.filter((c) => ventasDe(c.id).filter((v) => v.etapa === 'Entregado').length > 1).length,
  };
}

/* ---------- Navegación ---------- */
const NAV = [
  ['Principal', [['panel', 'Panel', 'panel'], ['pendientes', 'Pendientes', 'tasks'], ['calendario', 'Calendario', 'calendar']]],
  ['Gestión', [['clientes', 'Clientes', 'users', ['Comercial', 'Financiero']], ['coches', 'Vehículos', 'car', ['Comprador', 'Comercial']],
    ['ventas', 'Ventas', 'euro', ['Comercial', 'Financiero']], ['finanzas', 'Finanzas', 'wallet', ['Financiero']]]],
  ['Análisis', [['mercado', 'Mercado', 'chart', ['Comprador', 'Comercial']]]],
];
const TITLES = { panel: 'Panel de control', pendientes: 'Pendientes', clientes: 'Clientes', coches: 'Vehículos', ventas: 'Ventas', finanzas: 'Finanzas', mercado: 'Análisis de mercado', calendario: 'Calendario', ficha: 'Ficha de cliente' };
let filtros = { q: '', origen: '', estado: '', cq: '', cestado: '', vq: '', vetapa: '', fq2: '', gq: '', gcat: '', gest: '', gmes: '' };

function render() {
  const [view, param, param2] = (location.hash.slice(1) || 'panel').split('/');
  const sel = view === 'ficha' ? 'clientes' : view;
  const soy = getSoy();
  $('#nav').innerHTML = NAV.map(([g, all]) => [g, all.filter((it) => soy === 'Todos' || !it[3] || it[3].includes(soy))]).filter(([, it]) => it.length).map(([g, items]) => `<div class="label">${g}</div>` + items.map(([k, l, ic]) =>
    `<a href="#${k}" class="${k === sel ? 'active' : ''}">${icon(ic)}<span>${l}</span>${k === 'pendientes' ? '<span id="badge" class="badge"></span>' : ''}</a>`).join('')).join('');
  $('#title').textContent = TITLES[view] || TITLES.panel;
  $('#badge').textContent = pendientes().length || '';
  const fn = { panel: vPanel, pendientes: vPendientes, clientes: vClientes, coches: vCoches, ventas: () => vVentas(param), finanzas: () => vFinanzas(param, param2), mercado: () => vMercado(param), calendario: () => vCalendario(param), ficha: () => vFicha(param) }[view] || vPanel;
  $('#view').innerHTML = fn();
}

/* ---------- Vista: Panel ---------- */
function chartIngresos() {
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
    const vs = db.ventas.filter((v) => v.etapa === 'Entregado' && new Date(v.entrega).getMonth() === d.getMonth() && new Date(v.entrega).getFullYear() === d.getFullYear());
    meses.push({ l: d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''), t: vs.reduce((s, v) => s + v.precio, 0), n: vs.length, cur: i === 0 });
  }
  const W = 560, H = 230, L = 46, B = 26, T = 18;
  const raw = Math.max(...meses.map((m) => m.t)), step = raw > 80000 ? 25000 : raw > 40000 ? 20000 : 10000;
  const max = Math.max(step * 2, Math.ceil(raw / step) * step);
  const y = (v) => H - B - (v / max) * (H - B - T);
  const bw = (W - L - 10) / meses.length;
  let g = '';
  for (let v = 0; v <= max; v += step) g += `<line x1="${L}" x2="${W - 4}" y1="${y(v)}" y2="${y(v)}" stroke="${v ? '#e8ecf0' : '#c5cdd7'}"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v / 1000}k</text>`;
  meses.forEach((m, i) => {
    const x = L + i * bw + bw * 0.22, w = bw * 0.56;
    g += `<rect x="${x}" y="${y(m.t)}" width="${w}" height="${y(0) - y(m.t)}" fill="${m.cur ? '#d9902a' : 'url(#gb)'}"><title>${m.n} venta(s) · ${eur(m.t)}</title></rect>`;
    if (m.t) g += `<text class="val" x="${x + w / 2}" y="${y(m.t) - 5}" text-anchor="middle">${(m.t / 1000).toFixed(1).replace('.', ',')}k</text>`;
    g += `<text x="${x + w / 2}" y="${H - 8}" text-anchor="middle">${m.l}</text>`;
  });
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ingresos por mes"><defs><linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d6aa8"/><stop offset="1" stop-color="#1f3a5a"/></linearGradient></defs>${g}</svg></div>`;
}

function vPanel() {
  const k = kpis();
  const canales = {};
  db.clientes.forEach((c) => { canales[c.origen] = (canales[c.origen] || 0) + 1; });
  const ca = Object.entries(canales).sort((a, b) => b[1] - a[1]);
  const maxC = Math.max(1, ...ca.map((x) => x[1]));
  const pend = pendientes().slice(0, 6);
  const kpi = (cls, ic, label, value, sub) => `<div class="card kpi ${cls}"><div class="ico">${icon(ic)}</div><div><div class="label">${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></div></div>`;
  return `
  <div class="grid kpis">
    ${kpi('', 'key', 'Ventas del mes', k.ventasMes, 'vehículos entregados')}
    ${kpi('green', 'trend', 'Ingresos del mes', eur(k.ingresosMes), 'importe facturado')}
    ${kpi('green', 'tag', 'Margen medio', eur(k.margenMedio), 'por vehículo vendido')}
    ${kpi('amber', 'clock', 'Rotación', k.diasMedios + ' días', 'media de subasta a entrega')}
    ${kpi('', 'car', 'Stock', k.stock + ' uds.', 'valor ' + eur(k.valorStock))}
    ${kpi('amber', 'inbox', 'Leads abiertos', k.leads, k.repiten + ' cliente(s) recurrente(s)')}
  </div>
  <div class="grid two">
    <div class="card"><div class="card-head"><h3>${icon('trend')} Ingresos por mes</h3><span class="small muted">Últimos 6 meses</span></div><div class="card-body">${chartIngresos()}</div></div>
    <div class="card"><div class="card-head"><h3>${icon('users')} Clientes por canal</h3><span class="small muted">${db.clientes.length} clientes</span></div>
      <div class="card-body"><div class="hbars">${ca.map(([c, n]) => `<div class="hbar"><span>${esc(c)}</span><div class="track"><div class="fill" style="width:${(n / maxC) * 100}%"></div></div><span class="right num">${n}</span></div>`).join('')}</div></div>
    </div>
  </div>
  <div class="card mt"><div class="card-head"><h3>${icon('tasks')} Tareas prioritarias</h3><a href="#pendientes" class="btn ghost sm">Ver todas ${icon('right')}</a></div>
    ${pend.length ? pend.map(taskHtml).join('') : '<div class="empty">Sin tareas pendientes.</div>'}
  </div>
  <div class="card mt"><div class="card-head"><h3>${icon('history')} Actividad reciente</h3><span class="small muted">Últimos cambios registrados</span></div>
    ${db.log.length ? `<ul class="hist">${db.log.slice(0, 8).map((x) => `<li><span class="when">${rel(x.fecha, true)}</span><span class="who">${esc(x.usuario)}</span><span>${esc(x.texto)} <span class="id">${esc(x.refs[0] || '')}</span></span></li>`).join('')}</ul>` : '<div class="empty small">Aquí aparecerán los cambios que se hagan en clientes, vehículos, ventas y gastos.</div>'}
  </div>`;
}

const PUESTO = { Comercial: 'Comercial', Financiero: 'Administración', Comprador: 'Compras' };
function taskHtml(p) {
  return `<div class="task p${p.prio}"><div class="ico">${icon(p.ico)}</div><div class="who">${PUESTO[p.who]}</div>
    <div class="body"><div class="t">${esc(p.txt)}</div><div class="s">${esc(p.sub)}</div></div>
    <button type="button" class="btn ghost sm" data-act="${p.act}" data-id="${p.id}">${p.btn}</button></div>`;
}

/* ---------- Vista: Pendientes ---------- */
function vPendientes() {
  const ps = pendientes();
  if (!ps.length) return '<div class="card empty">No hay tareas pendientes para este puesto.</div>';
  const nombres = { Comercial: 'Comercial', Financiero: 'Administración / Legal', Comprador: 'Compras / Peritaje' };
  const ic = { Comercial: 'user', Financiero: 'doc', Comprador: 'wrench' };
  return ['Comercial', 'Financiero', 'Comprador'].map((w) => [w, ps.filter((p) => p.who === w)]).filter((g) => g[1].length)
    .map(([w, l]) => `<div class="card" style="margin-bottom:16px"><div class="card-head"><h3>${icon(ic[w])} ${nombres[w]}</h3><span class="small muted">${l.length} tarea(s)</span></div>${l.map(taskHtml).join('')}</div>`).join('');
}

/* ---------- Vista: Clientes ---------- */
function vClientes() {
  const q = filtros.q.toLowerCase().trim();
  const lista = db.clientes.filter((c) => {
    const cars = ventasDe(c.id).map((v) => coche(v.cocheId)).filter(Boolean);
    const txt = [c.id, c.nombre, c.dni, c.telefono, normTel(c.telefono), c.email, c.ciudad, ...cars.map((v) => `${v.id} ${v.marca} ${v.modelo} ${v.matricula} ${normMat(v.matricula)}`)].join(' ').toLowerCase();
    return (!q || txt.includes(q)) && (!filtros.origen || c.origen === filtros.origen) && (!filtros.estado || estadoCliente(c) === filtros.estado);
  }).sort((a, b) => (ultimoContacto(b) || '').localeCompare(ultimoContacto(a) || ''));
  const origenes = [...new Set(db.clientes.map((c) => c.origen))].sort();
  return `
  <div class="toolbar">
    <div class="search">${icon('search')}<input type="search" id="fq" placeholder="Buscar por ID, nombre, DNI, teléfono, email o matrícula" value="${esc(filtros.q)}"></div>
    <select id="forigen"><option value="">Todos los canales</option>${opt(origenes, filtros.origen)}</select>
    <select id="festado"><option value="">Todos los estados</option>${opt(['Lead', 'Reservado', 'Papeles', 'Entregado', 'Perdido'], filtros.estado)}</select>
    <button type="button" class="btn ghost" data-act="csv" data-id="clientes">${icon('download')} Exportar</button>
    <button type="button" class="btn" data-act="nuevoCliente">${icon('plus')} Nuevo cliente</button>
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>ID</th><th>Cliente</th><th class="hide-m">DNI/NIF</th><th class="hide-m">Teléfono</th><th class="hide-m">Canal</th><th>Estado</th><th class="hide-m">Último contacto</th></tr></thead>
    <tbody>${lista.map((c) => `<tr class="click" data-go="#ficha/${c.id}">
      <td class="id">${c.id}</td>
      <td><strong>${esc(c.nombre)}</strong><small>${esc(c.email) || '—'} · ${esc(c.ciudad)}</small></td>
      <td class="hide-m id">${esc(c.dni) || '<span class="muted">—</span>'}</td><td class="hide-m num">${esc(c.telefono)}</td><td class="hide-m">${esc(c.origen)}</td>
      <td>${st(estadoCliente(c))}</td><td class="hide-m num">${rel(ultimoContacto(c))}</td></tr>`).join('') || '<tr><td colspan="7" class="empty">Sin resultados</td></tr>'}</tbody>
  </table></div><div class="table-foot">${lista.length} de ${db.clientes.length} clientes</div></div>`;
}

/* ---------- Vista: Ficha de cliente ---------- */
function vFicha(id) {
  const c = cliente(id);
  if (!c) return '<div class="card empty">Cliente no encontrado. <a href="#clientes">Volver al listado</a></div>';
  const vs = ventasDe(c.id).sort((a, b) => b.inicio.localeCompare(a.inicio));
  const total = vs.filter((v) => v.etapa === 'Entregado').reduce((s, v) => s + v.precio, 0);
  const cs = [...c.contactos].sort((a, b) => b.fecha.localeCompare(a.fecha));
  return `
  <div class="ficha-head">
    <div><a href="#clientes" class="back">${icon('left')} Clientes</a><h2>${esc(c.nombre)}</h2>
      <span class="id">${c.id}</span> <span class="muted small">· Alta ${fecha(c.alta)} · ${st(estadoCliente(c))}</span></div>
    <div class="toolbar" style="margin:0">
      <button type="button" class="btn" data-act="contacto" data-id="${c.id}">${icon('phone')} Registrar contacto</button>
      <button type="button" class="btn ghost" data-act="nuevaVenta" data-id="${c.id}">${icon('car')} Nueva operación</button>
      <button type="button" class="btn ghost" data-act="editarCliente" data-id="${c.id}">${icon('edit')} Editar</button>
      <button type="button" class="btn danger" data-act="borrarCliente" data-id="${c.id}">${icon('trash')}</button>
    </div>
  </div>
  <div class="grid two">
    <div class="card"><div class="card-head"><h3>${icon('user')} Datos del cliente</h3></div><div class="card-body"><dl class="dl">
      <dt>ID de cliente</dt><dd class="id">${c.id}</dd>
      <dt>DNI / NIF</dt><dd class="id">${esc(c.dni) || '<span class="muted">Pendiente (obligatorio para reservar)</span>'}</dd>
      <dt>Teléfono</dt><dd class="num">${esc(c.telefono)}</dd><dt>Email</dt><dd>${esc(c.email) || '—'}</dd>
      <dt>Ciudad</dt><dd>${esc(c.ciudad) || '—'}</dd><dt>Canal de entrada</dt><dd>${esc(c.origen)}</dd>
      <dt>Total comprado</dt><dd><strong class="num">${eur(total)}</strong></dd><dt>Notas</dt><dd>${esc(c.notas) || '—'}</dd>
    </dl></div></div>
    <div class="card"><div class="card-head"><h3>${icon('euro')} Operaciones</h3><span class="small muted">${vs.length}</span></div>
      ${vs.length ? `<div class="table-wrap"><table><tbody>${vs.map((v) => { const car = coche(v.cocheId); return `<tr class="click" data-act="venta" data-id="${v.id}">
        <td><span class="id">${v.id}</span><small>${v.numFactura || 'Sin factura'}</small></td>
        <td><strong>${nombreCoche(car)}</strong><small>${esc(car?.matricula)} · ${car?.id || ''}</small></td>
        <td>${st(v.etapa)}<small>${v.etapa === 'Entregado' ? 'Garantía hasta ' + fecha(v.garantiaHasta) : v.etapa === 'Perdido' ? esc(v.motivoPerdida) : 'Desde ' + fecha(v.inicio)}</small></td>
        <td class="right num">${eur(v.precio)}</td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty">Sin operaciones</div>'}
    </div>
  </div>
  <div class="card mt"><div class="card-head"><h3>${icon('clock')} Historial de contactos</h3><span class="small muted">${cs.length}</span></div>
    ${cs.length ? `<ul class="timeline">${cs.map((x) => `<li><div class="ico">${icon(ICON_CONTACTO[x.tipo] || 'chat')}</div><div><strong>${esc(x.tipo)}</strong> · ${esc(x.nota)}<small>${rel(x.fecha, true)} · ${PUESTO[x.empleado] || esc(x.empleado)}</small></div></li>`).join('')}</ul>` : '<div class="empty">Todavía no hay contactos registrados.</div>'}
  </div>
  <div class="card mt"><div class="card-head"><h3>${icon('history')} Historial de cambios</h3></div>${historialHtml([c.id, ...vs.map((v) => v.id)])}</div>`;
}

/* ---------- Vista: Vehículos ---------- */
const ORDEN_EST = { 'En preparación': 0, 'A la venta': 1, Reservado: 2, Vendido: 3 };
function vCoches() {
  const q = filtros.cq.toLowerCase().trim();
  const lista = db.coches.filter((c) => {
    const t = `${c.id} ${c.marca} ${c.modelo} ${c.version} ${c.matricula} ${normMat(c.matricula)} ${c.bastidor} ${c.subasta} ${c.combustible}`.toLowerCase();
    return (!q || t.includes(q)) && (!filtros.cestado || c.estado === filtros.cestado);
  }).sort((a, b) => ORDEN_EST[a.estado] - ORDEN_EST[b.estado] || a.id.localeCompare(b.id));
  return `
  <div class="toolbar">
    <div class="search">${icon('search')}<input type="search" id="cq" placeholder="Buscar por nº catálogo, marca, modelo, matrícula o bastidor" value="${esc(filtros.cq)}"></div>
    <select id="cestado"><option value="">Todos los estados</option>${opt(Object.keys(ORDEN_EST), filtros.cestado)}</select>
    <button type="button" class="btn ghost" data-act="csv" data-id="coches">${icon('download')} Exportar</button>
    <button type="button" class="btn" data-act="nuevoCoche">${icon('plus')} Alta de vehículo</button>
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Nº catálogo</th><th>Vehículo</th><th class="hide-m">Matrícula / Bastidor</th><th class="hide-m">Año · Km</th><th class="hide-m">Origen</th><th class="right hide-m">Coste</th><th class="right">PVP</th><th class="right">Margen</th><th class="right hide-m">Días</th><th>Estado</th></tr></thead>
    <tbody>${lista.map((c) => `<tr class="click" data-act="editarCoche" data-id="${c.id}">
      <td class="id">${c.id}</td>
      <td><div class="veh">${silueta(c, 64)}<div><strong>${esc(c.marca)} ${esc(c.modelo)}</strong><small>${[c.version, c.combustible, c.cambio].filter(Boolean).map(esc).join(' · ')}</small></div></div></td>
      <td class="hide-m"><span class="id">${esc(c.matricula)}</span><small class="id">${esc(c.bastidor)}</small></td>
      <td class="hide-m num" style="white-space:nowrap">${c.anio}<small>${num(c.km)} km</small></td><td class="hide-m">${esc(c.subasta)}<small>${fecha(c.fechaCompra)}</small></td>
      <td class="right hide-m num">${eur(costeTotal(c))}</td><td class="right num"><strong>${eur(c.precioVenta)}</strong></td>
      <td class="right num" style="color:${margen(c) >= 0 ? 'var(--ok)' : 'var(--bad)'}">${eur(margen(c))}</td>
      <td class="right hide-m num">${c.estado === 'Vendido' && c.fechaVenta ? dias(c.fechaCompra, c.fechaVenta) : dias(c.fechaCompra)}</td>
      <td>${st(c.estado)}</td></tr>`).join('') || '<tr><td colspan="10" class="empty">Sin resultados</td></tr>'}</tbody>
  </table></div><div class="table-foot">${lista.length} vehículos · Coste = subasta + preparación + comisión, transporte y tasas · Margen = PVP − coste</div></div>`;
}

/* ---------- Vista: Ventas ---------- */
const ETAPAS = ['Lead', 'Reservado', 'Papeles', 'Entregado', 'Perdido'];
function vVentas(modo) {
  const listado = modo === 'listado';
  const head = `<div class="toolbar">
    <div class="seg"><a href="#ventas" class="${listado ? '' : 'on'}">Tablero</a><a href="#ventas/listado" class="${listado ? 'on' : ''}">Listado</a></div>
    ${listado ? `<div class="search">${icon('search')}<input type="search" id="vq" placeholder="Buscar por nº operación, factura, cliente o matrícula" value="${esc(filtros.vq)}"></div>
    <select id="vetapa"><option value="">Todas las etapas</option>${opt(ETAPAS, filtros.vetapa)}</select>` : `<span class="muted small" style="flex:1">${icon('right')} Arrastra las fichas entre columnas para cambiar de etapa. Entregadas y perdidas: últimos 60 días.</span>`}
    <button type="button" class="btn ghost" data-act="csv" data-id="ventas">${icon('download')} Exportar</button>
  </div>`;
  if (listado) {
    const q = filtros.vq.toLowerCase().trim();
    const lista = db.ventas.filter((v) => {
      const c = cliente(v.clienteId), car = coche(v.cocheId);
      const t = `${v.id} ${v.numFactura || ''} ${c?.nombre} ${c?.id} ${car?.id} ${car?.marca} ${car?.modelo} ${car?.matricula} ${normMat(car?.matricula)}`.toLowerCase();
      return (!q || t.includes(q)) && (!filtros.vetapa || v.etapa === filtros.vetapa);
    }).sort((a, b) => b.inicio.localeCompare(a.inicio));
    return head + `<div class="card"><div class="table-wrap"><table>
      <thead><tr><th>Nº operación</th><th class="hide-m">Factura</th><th>Cliente</th><th>Vehículo</th><th>Etapa</th><th class="hide-m">Inicio</th><th class="hide-m">Entrega</th><th class="right">Importe</th></tr></thead>
      <tbody>${lista.map((v) => { const c = cliente(v.clienteId), car = coche(v.cocheId); return `<tr class="click" data-act="venta" data-id="${v.id}">
        <td class="id">${v.id}</td><td class="hide-m id">${v.numFactura || '—'}</td>
        <td><strong>${esc(c?.nombre)}</strong><small class="id">${c?.id}</small></td>
        <td>${nombreCoche(car)}<small>${esc(car?.matricula)}</small></td><td>${st(v.etapa)}</td>
        <td class="hide-m num">${fecha(v.inicio)}</td><td class="hide-m num">${fecha(v.entrega || v.entregaPrevista)}</td><td class="right num">${eur(v.precio)}</td></tr>`; }).join('') || '<tr><td colspan="8" class="empty">Sin resultados</td></tr>'}</tbody>
    </table></div><div class="table-foot">${lista.length} operaciones · Total entregado: ${eur(lista.filter((v) => v.etapa === 'Entregado').reduce((s, v) => s + v.precio, 0))}</div></div>`;
  }
  const limite = new Date(now() - 60 * DAY).toISOString();
  return head + `<div class="kanban">${ETAPAS.map((e) => {
    let vs = db.ventas.filter((v) => v.etapa === e);
    const total = vs.length;
    if (e === 'Entregado' || e === 'Perdido') vs = vs.filter((v) => (v.entrega || v.inicio) >= limite);
    vs.sort((a, b) => (b.entrega || b.inicio).localeCompare(a.entrega || a.inicio));
    return `<div class="kcol" data-etapa="${e}"><h4>${e} <span class="count">${total}</span></h4><div class="list">${vs.map(ventaCard).join('') || '<div class="muted small" style="padding:4px">Sin operaciones</div>'}</div></div>`;
  }).join('')}</div>`;
}

function ventaCard(v) {
  const c = cliente(v.clienteId), car = coche(v.cocheId);
  let meta = '', acc = '';
  if (v.etapa === 'Lead') { meta = `Entrada ${rel(v.inicio, true)} · ${esc(c?.origen)}`; acc = `<button type="button" class="btn sm" data-act="reservar" data-id="${v.id}">Reservar ${icon('right')}</button>`; }
  if (v.etapa === 'Reservado') { meta = `Entrega prevista ${fecha(v.entregaPrevista)} · señal ${eur(cobrado(v))}`; acc = `<button type="button" class="btn sm" data-act="facturar" data-id="${v.id}">Emitir factura ${icon('right')}</button>`; }
  if (v.etapa === 'Papeles') {
    const ef = estadoFin(v);
    meta = `${v.numFactura} · entrega ${fecha(v.entregaPrevista)}<div style="margin-top:6px">${st(ef)} <span class="num">${eur(cobrado(v))} / ${eur(v.precio)}</span></div><div class="docs-mini" title="Documentación">${DOCS.map(([k]) => `<span class="${v.docs[k] ? 'on' : ''}"></span>`).join('')}</div>`;
    acc = pendienteCobro(v) > 0 ? `<button type="button" class="btn sm ${ef === 'Vencida' ? 'danger' : 'ghost'}" data-act="cobro" data-id="${v.id}">${icon('card')} Registrar cobro</button>`
      : docsFaltan(v).length ? `<button type="button" class="btn sm ghost" data-act="venta" data-id="${v.id}">Documentación</button>` : `<button type="button" class="btn sm" data-act="entregar" data-id="${v.id}">Entregar ${icon('right')}</button>`;
  }
  if (v.etapa === 'Entregado') meta = `${v.numFactura || ''} · entregado ${fecha(v.entrega)}`;
  if (v.etapa === 'Perdido') meta = esc(v.motivoPerdida);
  return `<div class="kcard" data-act="venta" data-id="${v.id}">
    <div class="top"><span class="name">${esc(c?.nombre)}</span><span class="id">${v.id}</span></div>
    <div class="car">${nombreCoche(car)} · <strong class="num">${eur(v.precio)}</strong></div>
    <div class="meta">${meta}</div>${acc ? `<div class="row">${acc}</div>` : ''}</div>`;
}

/* ---------- Acciones de venta ---------- */
function reservar(id) {
  const v = venta(id), car = coche(v.cocheId), c = cliente(v.clienteId);
  if (!c.dni) { toast('Falta el DNI/NIF del cliente. Complétalo en su ficha antes de reservar.'); return formCliente(c); }
  if (car.estado !== 'A la venta') return toast(`${car.id} no está disponible (${car.estado.toLowerCase()}).`);
  Object.assign(v, { etapa: 'Reservado', reserva: hoyISO(), entregaPrevista: new Date(now() + 7 * DAY).toISOString() });
  v.pagos.push({ fecha: hoyISO(), importe: SENAL, concepto: 'Señal de reserva', metodo: 'Tarjeta' });
  car.estado = 'Reservado';
  db.ventas.filter((o) => o !== v && o.cocheId === car.id && o.etapa === 'Lead').forEach((o) => { o.etapa = 'Perdido'; o.motivoPerdida = 'Vehículo reservado por otro cliente.'; });
  log([v.id, v.clienteId, v.cocheId], `Reserva online de ${v.id} (${nombreCoche(car)}). Señal de ${eur(SENAL)} cobrada.`);
  done(`${v.id} reservada. Señal de ${eur(SENAL)} cobrada.`);
}
function facturar(id) {
  const v = venta(id), c = cliente(v.clienteId);
  if (v.etapa !== 'Reservado') return;
  if (!c.dni) { toast('Falta el DNI/NIF del cliente para emitir la factura.'); return formCliente(c); }
  const ff = new Date();
  Object.assign(v, { etapa: 'Papeles', numFactura: siguienteFactura(), fechaFactura: ff.toISOString(), vencimiento: new Date(ff.getTime() + PLAZO_PAGO * DAY).toISOString() });
  v.docs.contrato = true; v.docs.factura = true;
  c.contactos.push({ fecha: hoyISO(), tipo: 'Email', nota: `Factura ${v.numFactura} (${eur(v.precio)}) y contrato enviados. Vence el ${fecha(v.vencimiento)}.`, empleado: 'Financiero' });
  log([v.id, v.clienteId, v.cocheId], `Factura ${v.numFactura} emitida por ${eur(v.precio)}, vence el ${fecha(v.vencimiento)}`);
  done(`Factura ${v.numFactura} emitida y enviada. Vence el ${fecha(v.vencimiento)}.`);
}
function entregar(id) {
  const v = venta(id), car = coche(v.cocheId);
  if (pendienteCobro(v) > 0) { toast(`No se puede entregar: quedan ${eur(pendienteCobro(v))} por cobrar.`); return formCobro(id); }
  const f = docsFaltan(v);
  if (f.length) { toast('No se puede entregar. Falta: ' + f.join(', ')); return formVenta(id); }
  const hoy = new Date(), g = new Date(hoy); g.setFullYear(g.getFullYear() + 1);
  Object.assign(v, { etapa: 'Entregado', entrega: hoy.toISOString(), garantiaHasta: g.toISOString() });
  car.estado = 'Vendido'; car.fechaVenta = hoy.toISOString();
  cliente(v.clienteId).contactos.push({ fecha: hoy.toISOString(), tipo: 'Visita', nota: 'Entrega del vehículo y explicación de la garantía (12 meses).', empleado: 'Comercial' });
  log([v.id, v.clienteId, v.cocheId], `Vehículo entregado. Garantía hasta ${fecha(v.garantiaHasta)}`);
  done(`${v.id} entregada. Garantía hasta ${fecha(v.garantiaHasta)}.`);
}
function liberarCoche(v) {
  const car = coche(v.cocheId);
  if (!car) return;
  if (['Reservado', 'Papeles'].includes(v.etapa) && car.estado === 'Reservado') car.estado = 'A la venta';
  if (v.etapa === 'Entregado') { car.estado = 'A la venta'; car.fechaVenta = null; }
}

/* ---------- Modal genérico ---------- */
function modal({ title, sub = '', body, submit = 'Guardar', onSubmit, extra = '' }) {
  const dlg = $('#modal'), form = $('#modalForm');
  form.innerHTML = `<div class="m-head"><div><h2>${title}</h2>${sub ? `<div class="small muted">${sub}</div>` : ''}</div>
    <button type="button" class="btn ghost sm" data-close aria-label="Cerrar">${icon('close')}</button></div>
    <div class="m-body"><div class="form-error" id="mErr"></div>${body}</div>
    <div class="m-foot">${extra}<span class="sp"></span><button type="button" class="btn ghost" data-close>Cancelar</button>${onSubmit ? `<button type="submit" class="btn">${submit}</button>` : ''}</div>`;
  form.querySelectorAll('[data-close]').forEach((b) => { b.onclick = () => dlg.close(); });
  form.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const err = onSubmit(data);
    if (typeof err === 'string') { const el = $('#mErr'); el.textContent = err; el.classList.add('show'); el.scrollIntoView({ block: 'nearest' }); return; }
    dlg.close(); save(); render(); offerUndo();
  };
  if (!dlg.open) dlg.showModal();
  form.querySelector('.m-body input:not([type=checkbox]), .m-body select, .m-body textarea')?.focus();
}
const opt = (list, sel) => list.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(l)}</option>`; }).join('');
const ORIGENES = ['coches.net', 'Web', 'Teléfono', 'WhatsApp', 'Email', 'Tienda'];
const disponibles = () => db.coches.filter((c) => c.estado === 'A la venta').map((c) => [c.id, `${c.id} · ${c.marca} ${c.modelo} · ${c.matricula} · ${eur(c.precioVenta)}`]);
function done(msg) { save(); render(); if (msg) toast(msg, true); }
let toastT;
let snap = null;   // copia de los datos antes de la última acción, para poder deshacer
function toast(msg, undo = false) {
  const t = $('#toast');
  t.innerHTML = `<span>${esc(msg)}</span>${undo && snap ? '<button type="button" id="undoBtn">Deshacer</button>' : ''}`;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), undo ? 6000 : 3600);
}
function offerUndo() { const t = $('#toast'); if (snap && t.classList.contains('show') && !$('#undoBtn')) { t.insertAdjacentHTML('beforeend', '<button type="button" id="undoBtn">Deshacer</button>'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 6000); } }
function deshacer() {
  if (!snap) return;
  db = JSON.parse(snap); snap = null;
  save(); render(); toast('Cambio deshecho.');
}
/* Ventana de confirmación propia (sustituye a confirm/prompt del navegador) */
function preguntar({ title, text = '', ok = 'Aceptar', danger = false, input = null, check = null }) {
  return new Promise((resolve) => {
    const dlg = $('#dlg2');
    dlg.innerHTML = `<form method="dialog" class="ask"><div class="m-head"><h2>${title}</h2></div>
      <div class="m-body">${text ? `<p style="margin:0">${text}</p>` : ''}
        ${input ? `<label>${input.label}<input name="v" value="${esc(input.value || '')}" ${input.list ? 'list="dl2"' : ''}></label>${input.list ? `<datalist id="dl2">${input.list.map((o) => `<option value="${esc(o)}">`).join('')}</datalist>` : ''}` : ''}
        ${check ? `<label class="chk"><input type="checkbox" name="c" ${check.checked ? 'checked' : ''}> ${check.label}</label>` : ''}</div>
      <div class="m-foot"><span class="sp"></span><button type="button" class="btn ghost" value="no">Cancelar</button><button type="submit" class="btn ${danger ? 'danger-solid' : ''}" value="ok">${ok}</button></div></form>`;
    const f = dlg.querySelector('form');
    f.querySelector('[value=no]').onclick = () => { dlg.close(); resolve(null); };
    f.onsubmit = (e) => { e.preventDefault(); const r = { v: f.v ? f.v.value : '', c: f.c ? f.c.checked : false }; dlg.close(); resolve(r); };
    dlg.oncancel = () => resolve(null);
    dlg.showModal();
    (f.v || f.querySelector('[type=submit]')).focus();
  });
}

/* ---------- Formularios: cliente ---------- */
function formCliente(c) {
  const nuevo = !c;
  const d0 = c || { nombre: '', dni: '', telefono: '', email: '', ciudad: '', origen: 'Web', notas: '' };
  modal({
    title: nuevo ? 'Nuevo cliente' : 'Editar cliente', sub: nuevo ? `Se asignará el ID ${nextId('CLI-', db.clientes)}` : `ID ${c.id}`,
    body: `<div class="fields">
      <label class="full">Nombre y apellidos *<input name="nombre" required value="${esc(d0.nombre)}"></label>
      <label>DNI / NIE / CIF<input name="dni" value="${esc(d0.dni)}" placeholder="Obligatorio para reservar"></label>
      <label>Teléfono *<input name="telefono" required value="${esc(d0.telefono)}" inputmode="tel"></label>
      <label>Email<input name="email" type="email" value="${esc(d0.email)}"></label>
      <label>Ciudad<input name="ciudad" value="${esc(d0.ciudad)}"></label>
      <label>Canal de entrada<select name="origen">${opt(ORIGENES, d0.origen)}</select></label>
      ${nuevo ? `<label>Vehículo de interés<select name="coche"><option value="">Ninguno por ahora</option>${opt(disponibles())}</select></label>` : ''}
      <label class="full">Notas<textarea name="notas">${esc(d0.notas)}</textarea></label></div>`,
    onSubmit: (d) => {
      const nombre = d.nombre.trim(), dni = normDni(d.dni), tel = normTel(d.telefono), email = d.email.trim().toLowerCase();
      if (!nombre) return 'El nombre es obligatorio.';
      if (tel.length < 9) return 'Introduce un teléfono válido (9 dígitos).';
      if (dni && !dniValido(dni)) return `El DNI/NIE/CIF "${dni}" no es válido. Revisa el número y la letra.`;
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'El email no tiene un formato válido.';
      const otros = db.clientes.filter((x) => x !== c);
      const dup = (campo, f) => { const o = otros.find(f); return o ? `Ya existe un cliente con ese ${campo}: ${o.id} · ${o.nombre}.` : null; };
      const e = (dni && dup('DNI/NIF', (x) => normDni(x.dni) === dni)) || dup('teléfono', (x) => normTel(x.telefono) === tel) || (email && dup('email', (x) => (x.email || '').toLowerCase() === email));
      if (e) return e;
      const vals = { nombre, dni, telefono: fmtTel(d.telefono), email, ciudad: d.ciudad.trim(), origen: d.origen, notas: d.notas.trim() };
      if (nuevo) {
        const id = nextId('CLI-', db.clientes);
        db.clientes.push({ id, ...vals, alta: hoyISO(), contactos: [] });
        if (d.coche) crearOperacion(id, d.coche);
        location.hash = '#ficha/' + id;
        log([id], `Alta de cliente: ${vals.nombre}`);
        toast(`Cliente ${id} creado.`);
      } else {
        const cc = cambios(c, vals, { nombre: 'nombre', dni: 'DNI', telefono: 'teléfono', email: 'email', ciudad: 'ciudad', origen: 'canal', notas: 'notas' });
        if (cc) log([c.id], `Datos modificados: ${cc}`);
        Object.assign(c, vals); toast('Datos guardados.');
      }
    },
  });
}
async function borrarCliente(id) {
  const c = cliente(id);
  const bloq = ventasDe(id).filter((v) => CON_FACTURA.includes(v.etapa));
  if (bloq.length) return toast(`No se puede eliminar ${id}: tiene operaciones reservadas o facturadas (${bloq.map((v) => v.id).join(', ')}).`);
  if (!await preguntar({ title: `Eliminar cliente ${id}`, text: `Se eliminará a <strong>${esc(c.nombre)}</strong> junto con sus leads y su historial de contactos.`, ok: 'Eliminar', danger: true })) return;
  log([id], `Cliente eliminado: ${c.nombre}`);
  db.ventas = db.ventas.filter((v) => v.clienteId !== id);
  db.clientes = db.clientes.filter((x) => x.id !== id);
  location.hash = '#clientes';
  done(`Cliente ${id} eliminado.`);
}

/* ---------- Formularios: contacto ---------- */
function formContacto(cid) {
  const c = cliente(cid), soy = getSoy();
  modal({
    title: 'Registrar contacto', sub: `${c.id} · ${esc(c.nombre)}`,
    body: `<div class="fields">
      <label>Tipo<select name="tipo">${opt(['Llamada', 'WhatsApp', 'Email', 'Visita', 'Prueba de conducción'])}</select></label>
      <label>Puesto<select name="empleado">${opt([['Comercial', 'Comercial'], ['Financiero', 'Administración'], ['Comprador', 'Compras']], soy === 'Todos' ? 'Comercial' : soy)}</select></label>
      <label class="full">Resumen *<textarea name="nota" required placeholder="Ej.: envío fotos e informe; viene el sábado a verlo"></textarea></label></div>`,
    onSubmit: (d) => {
      if (!d.nota.trim()) return 'Escribe un resumen del contacto.';
      c.contactos.push({ fecha: hoyISO(), tipo: d.tipo, nota: d.nota.trim(), empleado: d.empleado });
      log([c.id], `Contacto registrado: ${d.tipo.toLowerCase()}`);
      toast('Contacto registrado.');
    },
  });
}

/* ---------- Formularios: operación ---------- */
function crearOperacion(clienteId, cocheId) {
  const car = coche(cocheId);
  const id = nextId('OP-', db.ventas);
  db.ventas.push({ id, clienteId, cocheId, etapa: 'Lead', inicio: hoyISO(), reserva: null, entregaPrevista: null, entrega: null,
    garantiaHasta: null, precio: car.precioVenta, motivoPerdida: '', numFactura: null, fechaFactura: null, vencimiento: null, pagos: [], recordatorio: null,
    docs: { contrato: false, factura: false, transferencia: false, fichaTecnica: false, permiso: false } });
  log([id, clienteId, cocheId], `Nueva operación ${id}: interés en ${nombreCoche(car)}`);
  return id;
}
function formNuevaVenta(cid) {
  const disp = disponibles();
  if (!disp.length) return toast('No hay vehículos a la venta en este momento.');
  modal({
    title: 'Nueva operación', sub: `Se asignará el nº ${nextId('OP-', db.ventas)} · ${esc(cliente(cid).nombre)}`,
    body: `<label>Vehículo<select name="coche" required>${opt(disp)}</select></label>`,
    onSubmit: (d) => {
      const rep = db.ventas.find((v) => v.clienteId === cid && v.cocheId === d.coche && ABIERTAS.includes(v.etapa));
      if (rep) return `Este cliente ya tiene abierta la operación ${rep.id} con ese vehículo.`;
      toast(`Operación ${crearOperacion(cid, d.coche)} creada.`);
    },
  });
}
function formVenta(id) {
  const v = venta(id), c = cliente(v.clienteId), car = coche(v.cocheId);
  const abierta = ABIERTAS.includes(v.etapa);
  const docsOn = ['Papeles', 'Entregado'].includes(v.etapa);
  modal({
    title: `Operación ${v.id}`, sub: `${st(v.etapa)} &nbsp;${v.numFactura ? 'Factura ' + v.numFactura : 'Sin factura'}`,
    body: `<div class="info-row">
        <div><span>Cliente</span><a href="#ficha/${c.id}" data-close-go>${esc(c.nombre)}</a><div class="id">${c.id}</div></div>
        <div><span>Vehículo</span>${nombreCoche(car)}<div class="id">${car.id} · ${esc(car.matricula)}</div></div>
        <div><span>${v.etapa === 'Entregado' ? 'Garantía hasta' : 'Inicio'}</span>${fecha(v.etapa === 'Entregado' ? v.garantiaHasta : v.inicio)}<div class="small muted">${v.etapa === 'Entregado' ? 'Entregado ' + fecha(v.entrega) : esc(c.origen)}</div></div>
      </div>
      <div class="fields">
        <label>Importe (€)<input name="precio" type="number" min="0" step="1" value="${v.precio}" ${v.etapa === 'Entregado' ? 'readonly' : ''}></label>
        <label>${v.etapa === 'Entregado' ? 'Fecha de entrega' : 'Entrega prevista'}<input name="entregaPrevista" type="date" value="${isoDate(v.entrega || v.entregaPrevista)}" ${abierta && v.etapa !== 'Lead' ? '' : 'disabled'}></label>
        ${v.etapa === 'Perdido' ? `<label class="full">Motivo de pérdida<input name="motivoPerdida" value="${esc(v.motivoPerdida)}"></label>` : ''}
      </div>
      <div><div class="small" style="font-weight:600;color:var(--text-2);margin-bottom:4px">Documentación ${docsOn ? '' : '(disponible tras emitir la factura)'}</div>
      <div class="checklist">${DOCS.map(([k, l]) => `<label><input type="checkbox" name="doc_${k}" ${v.docs[k] ? 'checked' : ''} ${docsOn && v.etapa !== 'Entregado' && k !== 'factura' && k !== 'contrato' ? '' : 'disabled'}>${l}</label>`).join('')}</div></div>
      <div><div class="small" style="font-weight:600;color:var(--text-2);margin-bottom:4px;display:flex;justify-content:space-between;align-items:center">
        <span>Cobros · ${eur(cobrado(v))} de ${eur(v.precio)}${estadoFin(v) ? ' · ' + st(estadoFin(v)) : ''}</span>
        ${v.numFactura && pendienteCobro(v) > 0 ? `<button type="button" class="btn sm" data-act="cobro" data-id="${v.id}">${icon('card')} Registrar cobro</button>` : ''}</div>
      ${v.pagos.length ? `<div class="checklist">${v.pagos.map((p) => `<label style="justify-content:space-between;cursor:default"><span>${fecha(p.fecha)} · ${esc(p.concepto)} <span class="muted small">(${esc(p.metodo)})</span></span><strong class="num" style="color:${p.importe < 0 ? 'var(--bad)' : 'var(--text)'}">${eur(p.importe)}</strong></label>`).join('')}</div>` : '<div class="muted small">Sin cobros registrados.</div>'}
      ${v.vencimiento ? `<div class="muted small" style="margin-top:4px">Factura ${v.numFactura} emitida el ${fecha(v.fechaFactura)} · vence el ${fecha(v.vencimiento)}</div>` : ''}</div>
      <div><div class="small" style="font-weight:600;color:var(--text-2);margin-bottom:4px">Historial de cambios</div><div class="checklist">${historialHtml([v.id])}</div></div>`,
    extra: `<button type="button" class="btn danger" data-act="borrarVenta" data-id="${v.id}" title="Eliminar">${icon('trash')}</button>
      ${v.numFactura ? `<button type="button" class="btn ghost" data-act="factura" data-id="${v.id}">${icon('print')} Factura</button>` : ''}
      ${abierta ? `<button type="button" class="btn ghost" data-act="perder" data-id="${v.id}">Marcar perdida</button>` : ''}`,
    onSubmit: (d) => {
      const precio = Math.round(+d.precio);
      if (!(precio > 0)) return 'El importe debe ser mayor que 0.';
      if (v.etapa !== 'Entregado') v.precio = precio;
      if (d.entregaPrevista) v.entregaPrevista = new Date(d.entregaPrevista + 'T10:00:00').toISOString();
      if (v.etapa === 'Perdido') v.motivoPerdida = (d.motivoPerdida || '').trim();
      if (v.etapa === 'Papeles') ['transferencia', 'fichaTecnica', 'permiso'].forEach((k) => {
        const on = d['doc_' + k] === 'on';
        if (on && !v.docs[k]) c.contactos.push({ fecha: hoyISO(), tipo: 'Email', nota: `${DOCS.find((x) => x[0] === k)[1]}: completado (${v.id}).`, empleado: 'Financiero' });
        v.docs[k] = on;
      });
      log([v.id], 'Operación modificada (importe, entrega o documentación)');
      toast(`${v.id} actualizada.`);
    },
  });
}
async function perder(id) {
  const v = venta(id);
  const c0 = cobrado(v);
  const r = await preguntar({ title: `Marcar ${v.id} como perdida`, text: `${esc(cliente(v.clienteId)?.nombre)} · ${nombreCoche(coche(v.cocheId))}`, ok: 'Marcar perdida', danger: true,
    input: { label: 'Motivo', value: 'Compra en otro concesionario.', list: ['Compra en otro concesionario.', 'Le pareció caro.', 'Buscaba financiación.', 'No responde.', 'Cambia de idea, no compra.'] },
    check: c0 > 0 ? { label: `Registrar la devolución de ${eur(c0)} cobrados`, checked: true } : null });
  if (!r) return;
  if (c0 > 0 && r.c) v.pagos.push({ fecha: hoyISO(), importe: -c0, concepto: 'Devolución', metodo: 'Transferencia' });
  liberarCoche(v);
  Object.assign(v, { etapa: 'Perdido', motivoPerdida: r.v.trim() || 'Sin motivo indicado.' });
  log([v.id, v.clienteId, v.cocheId], `Operación ${v.id} marcada como perdida: ${v.motivoPerdida}`);
  $('#modal').close();
  done(`${v.id} marcada como perdida.`);
}
async function borrarVenta(id) {
  const v = venta(id);
  const aviso = (v.numFactura ? ` Tiene la factura ${v.numFactura} emitida.` : '') + (cobrado(v) ? ` Constan ${eur(cobrado(v))} cobrados.` : '');
  if (!await preguntar({ title: `Eliminar operación ${v.id}`, text: `${aviso.trim()} El vehículo volverá a estar a la venta si estaba reservado o vendido por esta operación.`, ok: 'Eliminar', danger: true })) return;
  log([v.id, v.clienteId, v.cocheId], `Operación ${v.id} eliminada`);
  liberarCoche(v);
  db.ventas = db.ventas.filter((x) => x !== v);
  $('#modal').close();
  done(`Operación ${id} eliminada.`);
}

/* ---------- Cobros ---------- */
function formCobro(id) {
  const v = venta(id), c = cliente(v.clienteId), pend = pendienteCobro(v);
  if (!v.numFactura) return toast('Primero hay que emitir la factura.');
  if (pend <= 0) return toast(`${v.numFactura} ya está cobrada.`);
  modal({
    title: 'Registrar cobro', sub: `Factura ${v.numFactura} · ${esc(c.nombre)} · pendiente ${eur(pend)}`,
    body: `<div class="fields">
      <label>Importe (€) *<input name="importe" type="number" min="1" step="1" max="${pend}" value="${pend}" required></label>
      <label>Fecha de cobro<input name="fecha" type="date" value="${isoDate(hoyISO())}" max="${isoDate(hoyISO())}"></label>
      <label>Método<select name="metodo">${opt(['Transferencia', 'Tarjeta'])}</select></label>
      <label>Concepto<input name="concepto" value="Pago final"></label></div>`,
    submit: 'Registrar cobro',
    onSubmit: (d) => {
      const imp = Math.round(+d.importe);
      if (!(imp > 0)) return 'El importe debe ser mayor que 0.';
      if (imp > pend) return `El importe supera lo pendiente (${eur(pend)}).`;
      const f = d.fecha ? new Date(d.fecha + 'T12:00:00') : new Date();
      if (f > new Date()) return 'La fecha de cobro no puede ser futura.';
      v.pagos.push({ fecha: f.toISOString(), importe: imp, concepto: d.concepto.trim() || 'Pago', metodo: d.metodo });
      log([v.id, v.clienteId], `Cobro de ${eur(imp)} por ${d.metodo.toLowerCase()} (${v.numFactura})`);
      c.contactos.push({ fecha: hoyISO(), tipo: 'Email', nota: `Cobro de ${eur(imp)} por ${d.metodo.toLowerCase()} (${v.numFactura}).`, empleado: 'Financiero' });
      toast(pendienteCobro(v) ? `Cobro registrado. Quedan ${eur(pendienteCobro(v))}.` : `${v.numFactura} cobrada por completo.`);
    },
  });
}
function recordatorio(id) {
  const v = venta(id), c = cliente(v.clienteId);
  v.recordatorio = hoyISO();
  c.contactos.push({ fecha: hoyISO(), tipo: 'Email', nota: `Recordatorio de pago de la factura ${v.numFactura}: pendiente ${eur(pendienteCobro(v))}.`, empleado: 'Financiero' });
  log([v.id, v.clienteId], `Recordatorio de pago enviado (${v.numFactura})`);
  done(`Recordatorio enviado a ${c.nombre}.`);
}

/* ---------- Vista: Finanzas ---------- */
const FIN_TABS = [['', 'Todas'], ['facturar', 'Pendiente de facturar'], ['cobro', 'Pendiente de cobro'], ['vencidas', 'Vencidas'], ['cobradas', 'Cobradas']];
const FIN_MAP = { facturar: 'Pendiente de facturar', cobro: 'Pendiente de cobro', vencidas: 'Vencida', cobradas: 'Cobrada' };
function vFinCobros(tab = '') {
  const ops = db.ventas.filter((v) => estadoFin(v));
  const sum = (l, f) => l.reduce((s, v) => s + f(v), 0);
  const by = (e) => ops.filter((v) => estadoFin(v) === e);
  const d = new Date();
  const movs = db.ventas.flatMap((v) => (v.pagos || []).map((p) => ({ ...p, v }))).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const mesMovs = movs.filter((m) => { const f = new Date(m.fecha); return f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear(); });
  const q = filtros.fq2.toLowerCase().trim();
  const lista = ops.filter((v) => !tab || estadoFin(v) === FIN_MAP[tab]).filter((v) => {
    const c = cliente(v.clienteId), car = coche(v.cocheId);
    return !q || `${v.id} ${v.numFactura || ''} ${c?.nombre} ${c?.id} ${car?.matricula}`.toLowerCase().includes(q);
  }).sort((a, b) => ({ Vencida: 0, 'Pendiente de cobro': 1, 'Pendiente de facturar': 2, Cobrada: 3 }[estadoFin(a)] - { Vencida: 0, 'Pendiente de cobro': 1, 'Pendiente de facturar': 2, Cobrada: 3 }[estadoFin(b)]) || (b.fechaFactura || b.reserva || '').localeCompare(a.fechaFactura || a.reserva || ''));
  const kpi = (cls, ic, label, value, sub) => `<div class="card kpi ${cls}"><div class="ico">${icon(ic)}</div><div><div class="label">${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></div></div>`;
  const pf = by('Pendiente de facturar'), pc = by('Pendiente de cobro'), ve = by('Vencida');
  return `
  <div class="grid kpis">
    ${kpi('', 'doc', 'Pendiente de facturar', eur(sum(pf, (v) => v.precio)), `${pf.length} operación(es) reservada(s)`)}
    ${kpi('amber', 'clock', 'Pendiente de cobro', eur(sum(pc, pendienteCobro)), `${pc.length} factura(s) en plazo`)}
    ${kpi('red', 'alert', 'Vencido', eur(sum(ve, pendienteCobro)), `${ve.length} factura(s) impagada(s)`)}
    ${kpi('green', 'wallet', 'Cobrado este mes', eur(sum(mesMovs, (m) => m.importe)), `${mesMovs.length} movimiento(s)`)}
  </div>
  <div class="toolbar">
    <div class="seg">${FIN_TABS.map(([k, l]) => `<a href="#finanzas/cobros${k ? '/' + k : ''}" class="${k === tab ? 'on' : ''}">${l}</a>`).join('')}</div>
    <div class="search">${icon('search')}<input type="search" id="fq2" placeholder="Buscar factura, operación, cliente o matrícula" value="${esc(filtros.fq2)}"></div>
    <button type="button" class="btn ghost" data-act="csv" data-id="finanzas">${icon('download')} Exportar</button>
  </div>
  <div class="card"><div class="card-head"><h3>${icon('doc')} Facturas y cobros</h3><span class="small muted">Plazo de pago: ${PLAZO_PAGO} días · Señal de reserva: ${eur(SENAL)}</span></div>
    <div class="table-wrap"><table>
    <thead><tr><th>Estado</th><th>Factura</th><th class="hide-m">Emisión</th><th>Vencimiento</th><th>Cliente</th><th class="hide-m">Operación</th><th class="right">Importe</th><th class="right hide-m">Cobrado</th><th class="right">Pendiente</th><th></th></tr></thead>
    <tbody>${lista.map((v) => { const c = cliente(v.clienteId), car = coche(v.cocheId), ef = estadoFin(v);
      const diasV = v.vencimiento ? Math.ceil((new Date(v.vencimiento) - now()) / DAY) : null;
      const accion = ef === 'Pendiente de facturar' ? `<button type="button" class="btn sm" data-act="facturar" data-id="${v.id}">Emitir factura</button>`
        : ef === 'Cobrada' ? `<button type="button" class="btn sm ghost" data-act="factura" data-id="${v.id}" title="Imprimir factura">${icon('print')}</button>` : `<button type="button" class="btn sm ghost" data-act="factura" data-id="${v.id}" title="Imprimir factura">${icon('print')}</button> <button type="button" class="btn sm" data-act="cobro" data-id="${v.id}">Cobro</button>${ef === 'Vencida' ? ` <button type="button" class="btn sm ghost" data-act="recordatorio" data-id="${v.id}" title="Enviar recordatorio de pago">${icon('bell')}</button>` : ''}`;
      return `<tr class="click" data-act="venta" data-id="${v.id}">
      <td>${st(ef)}</td><td class="id">${v.numFactura || '—'}</td><td class="hide-m num">${fecha(v.fechaFactura)}</td>
      <td class="num">${fecha(v.vencimiento)}${ef === 'Vencida' ? `<small style="color:var(--bad)">hace ${-diasV} día(s)${v.recordatorio ? ' · avisado ' + fecha(v.recordatorio) : ''}</small>` : ef === 'Pendiente de cobro' ? `<small>en ${diasV} día(s)</small>` : ''}</td>
      <td><strong>${esc(c?.nombre)}</strong><small class="id">${c?.id}</small></td>
      <td class="hide-m"><span class="id">${v.id}</span><small>${nombreCoche(car)} · ${esc(car?.matricula)}</small></td>
      <td class="right num">${eur(v.precio)}</td><td class="right num hide-m">${eur(cobrado(v))}</td>
      <td class="right num" style="font-weight:600;color:${pendienteCobro(v) ? (ef === 'Vencida' ? 'var(--bad)' : 'var(--text)') : 'var(--ok)'}">${eur(pendienteCobro(v))}</td>
      <td class="right" style="white-space:nowrap">${accion}</td></tr>`; }).join('') || '<tr><td colspan="10" class="empty">Sin facturas en este estado</td></tr>'}</tbody>
    </table></div><div class="table-foot">${lista.length} registro(s) · Importe ${eur(sum(lista, (v) => v.precio))} · Pendiente ${eur(sum(lista, pendienteCobro))} · Facturas en régimen especial de bienes usados (REBU)</div></div>
  <div class="card mt"><div class="card-head"><h3>${icon('card')} Movimientos de caja</h3><span class="small muted">Últimos 15</span></div>
    <div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Concepto</th><th class="hide-m">Factura / Op.</th><th>Cliente</th><th class="hide-m">Método</th><th class="right">Importe</th></tr></thead>
    <tbody>${movs.slice(0, 15).map((m) => `<tr class="click" data-act="venta" data-id="${m.v.id}"><td class="num">${fecha(m.fecha)}</td><td>${esc(m.concepto)}</td>
      <td class="hide-m id">${m.v.numFactura || m.v.id}</td><td>${esc(cliente(m.v.clienteId)?.nombre)}</td><td class="hide-m">${esc(m.metodo)}</td>
      <td class="right num" style="font-weight:600;color:${m.importe < 0 ? 'var(--bad)' : 'var(--ok)'}">${m.importe > 0 ? '+' : ''}${eur(m.importe)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Sin movimientos</td></tr>'}</tbody></table></div></div>`;
}

/* ---------- Gastos ---------- */
const CAT_GASTO = ['Alquiler', 'Personal', 'Marketing', 'Suministros', 'Seguros', 'Gestoría', 'Software', 'Costes por vehículo', 'Otros'];
const CAT_VIRTUAL = ['Compra de vehículos', 'Preparación'];
const gastoById = (id) => db.gastos.find((g) => g.id === id);
const mesKey = (iso) => { const d = new Date(iso); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
const mesLabel = (k, largo) => new Date(+k.slice(0, 4), +k.slice(5) - 1, 1).toLocaleDateString('es-ES', largo ? { month: 'long', year: 'numeric' } : { month: 'short' }).replace('.', '');
function ultimosMeses(n) {
  const out = [], d = new Date();
  for (let i = n - 1; i >= 0; i--) { const x = new Date(d.getFullYear(), d.getMonth() - i, 1); out.push(`${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}`); }
  return out;
}
// Todos los pagos a terceros: gastos registrados + compras y preparación de cada vehículo
function listaGastos() {
  const virt = db.coches.flatMap((c) => [
    { id: c.id, virtual: true, fecha: c.fechaCompra, categoria: 'Compra de vehículos', concepto: `${c.marca} ${c.modelo} · ${c.matricula}`, proveedor: c.subasta, numFactura: null, cocheId: c.id, importe: c.precioCompra, estado: 'Pagado', fechaPago: c.fechaCompra },
    { id: c.id, virtual: true, fecha: new Date(new Date(c.fechaCompra).getTime() + 3 * DAY).toISOString(), categoria: 'Preparación', concepto: `Taller, limpieza y fotos · ${c.marca} ${c.modelo}`, proveedor: 'Taller y preparación', numFactura: null, cocheId: c.id, importe: c.gastos, estado: 'Pagado', fechaPago: c.fechaCompra },
  ]).filter((g) => g.importe > 0 && new Date(g.fecha) <= new Date());
  return [...db.gastos, ...virt].sort((a, b) => b.fecha.localeCompare(a.fecha));
}
// Cuenta de resultados de un mes: ingresos por ventas entregadas, coste de esos vehículos y gastos de estructura
function pyg(k) {
  const vs = db.ventas.filter((v) => v.etapa === 'Entregado' && mesKey(v.entrega) === k);
  const ingresos = vs.reduce((s, v) => s + v.precio, 0);
  const costeVentas = vs.reduce((s, v) => { const c = coche(v.cocheId); return s + (c ? costeTotal(c) : 0); }, 0);
  const estructura = db.gastos.filter((g) => !g.cocheId && mesKey(g.fecha) === k).reduce((s, g) => s + g.importe, 0);
  return { k, n: vs.length, ingresos, costeVentas, bruto: ingresos - costeVentas, estructura, gastos: costeVentas + estructura, resultado: ingresos - costeVentas - estructura };
}

function chartIngGas(datos) {
  const W = 1100, H = 280, L = 56, B = 28, T = 14;
  const max = Math.ceil(Math.max(10000, ...datos.map((d) => Math.max(d.ingresos, d.gastos))) / 20000) * 20000;
  const y = (v) => T + (max - v) / max * (H - B - T);
  const gw = (W - L - 8) / datos.length, bw = gw * 0.32;
  let g = '';
  for (let v = 0; v <= max; v += 20000) g += `<line x1="${L}" x2="${W - 4}" y1="${y(v)}" y2="${y(v)}" stroke="${v ? '#e8ecf0' : '#9aa6b5'}"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v / 1000}k</text>`;
  datos.forEach((d, i) => {
    const x0 = L + i * gw + gw * 0.17;
    g += `<rect x="${x0}" y="${y(d.ingresos)}" width="${bw}" height="${y(0) - y(d.ingresos)}" fill="url(#gIng)"><title>${mesLabel(d.k, 1)} · Ingresos ${eur(d.ingresos)} (${d.n} ventas)</title></rect>`;
    g += `<rect x="${x0 + bw + 3}" y="${y(d.gastos)}" width="${bw}" height="${y(0) - y(d.gastos)}" fill="url(#gGas)"><title>${mesLabel(d.k, 1)} · Gastos ${eur(d.gastos)}</title></rect>`;
    g += `<text x="${L + i * gw + gw / 2}" y="${H - 8}" text-anchor="middle">${mesLabel(d.k)}</text>`;
  });
  // Resultado mensual (escala propia para que se lea bien)
  const H2 = 150, T2 = 22, B2 = 24;
  const rMax = Math.max(1000, ...datos.map((d) => d.resultado)), rMin = Math.min(0, ...datos.map((d) => d.resultado));
  const stp = rMax - rMin > 20000 ? 5000 : 2500;
  const top = Math.ceil(rMax / stp) * stp, bot = Math.floor(rMin / stp) * stp;
  const y2 = (v) => T2 + (top - v) / (top - bot) * (H2 - B2 - T2);
  let r = '';
  for (let v = bot; v <= top; v += stp) r += `<line x1="${L}" x2="${W - 4}" y1="${y2(v)}" y2="${y2(v)}" stroke="${v ? '#eef1f4' : '#9aa6b5'}"/><text x="${L - 8}" y="${y2(v) + 4}" text-anchor="end">${(v / 1000).toLocaleString('es-ES')}k</text>`;
  datos.forEach((d, i) => {
    const x = L + i * gw + gw * 0.3, w = gw * 0.4, pos = d.resultado >= 0;
    r += `<rect x="${x}" y="${pos ? y2(d.resultado) : y2(0)}" width="${w}" height="${Math.abs(y2(d.resultado) - y2(0))}" fill="${pos ? '#2f8a5a' : '#c0392b'}"><title>${mesLabel(d.k, 1)} · Resultado ${eur(d.resultado)}</title></rect>`;
    r += `<text class="val" x="${x + w / 2}" y="${pos ? y2(d.resultado) - 5 : y2(d.resultado) + 13}" text-anchor="middle">${(d.resultado / 1000).toFixed(1).replace('.', ',')}k</text>`;
    r += `<text x="${x + w / 2}" y="${H2 - 6}" text-anchor="middle">${mesLabel(d.k)}</text>`;
  });
  return `<div class="legend"><span><i style="background:#245b94"></i>Ingresos por ventas</span><span><i style="background:#c27a1a"></i>Gastos (coste de vehículos vendidos + estructura)</span></div>
  <div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ingresos y gastos por mes"><defs>
    <linearGradient id="gIng" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d6aa8"/><stop offset="1" stop-color="#1f3a5a"/></linearGradient>
    <linearGradient id="gGas" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3a347"/><stop offset="1" stop-color="#b06c12"/></linearGradient></defs>${g}</svg></div>
  <div class="legend" style="margin-top:14px;border-top:1px solid var(--line-2);padding-top:12px"><span><i style="background:#2f8a5a"></i>Resultado mensual (beneficio)</span><span><i style="background:#c0392b"></i>Pérdida</span></div>
  <div class="chart"><svg viewBox="0 0 ${W} ${H2}" role="img" aria-label="Resultado por mes">${r}</svg></div>`;
}

function vFinanzas(sec = '', tab = '') {
  const nav = `<div class="toolbar"><div class="seg">
    <a href="#finanzas" class="${!sec ? 'on' : ''}">Resumen</a><a href="#finanzas/cobros" class="${sec === 'cobros' ? 'on' : ''}">Facturas y cobros</a><a href="#finanzas/gastos" class="${sec === 'gastos' ? 'on' : ''}">Gastos</a></div></div>`;
  if (sec === 'cobros') return nav + vFinCobros(tab || '');
  if (sec === 'gastos') return nav + vFinGastos();
  return nav + vFinResumen();
}

function vFinResumen() {
  const meses = ultimosMeses(12).map(pyg);
  const act = meses[meses.length - 1], ant = meses[meses.length - 2];
  const anio = new Date().getFullYear();
  const ytd = meses.filter((m) => m.k.startsWith(String(anio)));
  const tot = (l, k) => l.reduce((s, m) => s + m[k], 0);
  const delta = (a, b) => (b ? `${a >= b ? '▲' : '▼'} ${Math.abs(Math.round((a - b) / Math.abs(b) * 100))}% vs ${mesLabel(ant.k)}` : '');
  const kpi = (cls, ic, label, value, sub) => `<div class="card kpi ${cls}"><div class="ico">${icon(ic)}</div><div><div class="label">${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></div></div>`;
  // Gastos por categoría (12 meses, sin compras de vehículos)
  const desde = meses[0].k;
  const porCat = {};
  listaGastos().filter((g) => mesKey(g.fecha) >= desde && g.categoria !== 'Compra de vehículos').forEach((g) => { porCat[g.categoria] = (porCat[g.categoria] || 0) + g.importe; });
  const cats = Object.entries(porCat).sort((a, b) => b[1] - a[1]);
  const totCat = cats.reduce((s, c) => s + c[1], 0), maxCat = Math.max(1, ...cats.map((c) => c[1]));
  const ult6 = meses.slice(-6);
  const fila = (label, k, cls = '') => `<tr class="${cls}"><td>${label}</td>${ult6.map((m) => `<td class="right num" style="${k === 'resultado' ? `color:${m[k] >= 0 ? 'var(--ok)' : 'var(--bad)'}` : ''}">${k === 'n' ? m[k] : eur(k === 'costeVentas' || k === 'estructura' ? -m[k] : m[k])}</td>`).join('')}<td class="right num" style="font-weight:700;${k === 'resultado' ? `color:${tot(ult6, k) >= 0 ? 'var(--ok)' : 'var(--bad)'}` : ''}">${k === 'n' ? tot(ult6, k) : eur(k === 'costeVentas' || k === 'estructura' ? -tot(ult6, k) : tot(ult6, k))}</td></tr>`;
  return `
  <div class="grid kpis">
    ${kpi('', 'trend', `Ingresos · ${mesLabel(act.k)}`, eur(act.ingresos), delta(act.ingresos, ant.ingresos))}
    ${kpi('amber', 'wallet', `Gastos · ${mesLabel(act.k)}`, eur(act.gastos), `${eur(act.costeVentas)} vehículos · ${eur(act.estructura)} estructura`)}
    ${kpi(act.resultado >= 0 ? 'green' : 'red', 'euro', `Resultado · ${mesLabel(act.k)}`, eur(act.resultado), `Margen bruto ${eur(act.bruto)}`)}
    ${kpi(tot(ytd, 'resultado') >= 0 ? 'green' : 'red', 'panel', `Resultado ${anio}`, eur(tot(ytd, 'resultado')), `${tot(ytd, 'n')} vehículos vendidos · ${eur(tot(ytd, 'ingresos'))} facturados`)}
  </div>
  <div class="card"><div class="card-head"><h3>${icon('trend')} Ingresos, gastos y resultado</h3><span class="small muted">Últimos 12 meses</span></div><div class="card-body">${chartIngGas(meses)}</div></div>
  <div class="grid mt">
    <div class="card"><div class="card-head"><h3>${icon('doc')} Cuenta de resultados</h3><span class="small muted">Últimos 6 meses</span></div>
      <div class="table-wrap"><table class="pyg"><thead><tr><th></th>${ult6.map((m) => `<th class="right">${mesLabel(m.k)}</th>`).join('')}<th class="right">Total</th></tr></thead><tbody>
        ${fila('Vehículos vendidos', 'n')}${fila('Ventas', 'ingresos')}${fila('Coste de los vehículos', 'costeVentas')}${fila('Margen bruto', 'bruto', 'sub')}${fila('Gastos de estructura', 'estructura')}${fila('Resultado', 'resultado', 'tot')}
      </tbody></table></div>
      <div class="table-foot">Coste de los vehículos = subasta + preparación + comisión, transporte y tasas de los coches vendidos en el mes.</div></div>
    <div class="card"><div class="card-head"><h3>${icon('wallet')} Gastos por categoría</h3><span class="small muted">12 meses · sin compras de vehículos</span></div>
      <div class="card-body"><div class="hbars">${cats.map(([c, n]) => `<div class="hbar wide"><span>${esc(c)}</span><div class="track"><div class="fill" style="width:${(n / maxCat) * 100}%"></div></div><span class="right num">${eur(n)}</span><span class="right num muted">${Math.round(n / totCat * 100)}%</span></div>`).join('')}</div>
      <div class="small muted" style="margin-top:12px">Total ${eur(totCat)} · Compras de vehículos en el mismo periodo: ${eur(listaGastos().filter((g) => g.categoria === 'Compra de vehículos' && mesKey(g.fecha) >= desde).reduce((s, g) => s + g.importe, 0))}</div></div></div>
  </div>`;
}

function vFinGastos() {
  const todos = listaGastos();
  const k = mesKey(hoyISO());
  const mes = todos.filter((g) => mesKey(g.fecha) === k);
  const pend = db.gastos.filter((g) => g.estado === 'Pendiente');
  const sum = (l) => l.reduce((s, g) => s + g.importe, 0);
  const q = filtros.gq.toLowerCase().trim();
  const lista = todos.filter((g) => (!filtros.gcat || g.categoria === filtros.gcat) && (!filtros.gest || g.estado === filtros.gest) && (!filtros.gmes || mesKey(g.fecha) === filtros.gmes)
    && (!q || `${g.virtual ? '' : g.id} ${g.concepto} ${g.proveedor} ${g.numFactura || ''} ${g.cocheId || ''}`.toLowerCase().includes(q)));
  const vista = lista.slice(0, 150);
  const kpi = (cls, ic, label, value, sub) => `<div class="card kpi ${cls}"><div class="ico">${icon(ic)}</div><div><div class="label">${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></div></div>`;
  const fijosMes = ultimosMeses(4).slice(0, 3).map((m) => db.gastos.filter((g) => !g.cocheId && mesKey(g.fecha) === m).reduce((s, g) => s + g.importe, 0));
  return `
  <div class="grid kpis">
    ${kpi('amber', 'wallet', `Pagos · ${mesLabel(k)}`, eur(sum(mes)), `${mes.length} apuntes`)}
    ${kpi('', 'car', 'Compra de vehículos', eur(sum(mes.filter((g) => g.categoria === 'Compra de vehículos'))), `${mes.filter((g) => g.categoria === 'Compra de vehículos').length} vehículos este mes`)}
    ${kpi('', 'store', 'Estructura media', eur(fijosMes.reduce((a, b) => a + b, 0) / 3), 'al mes (últimos 3 meses)')}
    ${kpi(pend.length ? 'red' : 'green', 'alert', 'Pendiente de pago', eur(sum(pend)), `${pend.length} factura(s) de proveedor`)}
  </div>
  <div class="toolbar">
    <div class="search">${icon('search')}<input type="search" id="gq" placeholder="Buscar concepto, proveedor, nº factura o vehículo" value="${esc(filtros.gq)}"></div>
    <select id="gcat"><option value="">Todas las categorías</option>${opt([...CAT_VIRTUAL, ...CAT_GASTO], filtros.gcat)}</select>
    <select id="gmes"><option value="">Todos los meses</option>${opt(ultimosMeses(14).reverse().map((m) => [m, mesLabel(m, 1)]), filtros.gmes)}</select>
    <select id="gest"><option value="">Pagados y pendientes</option>${opt(['Pagado', 'Pendiente'], filtros.gest)}</select>
    <button type="button" class="btn ghost" data-act="csv" data-id="gastos">${icon('download')} Exportar</button>
    <button type="button" class="btn" data-act="nuevoGasto">${icon('plus')} Nuevo gasto</button>
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Nº</th><th>Fecha</th><th>Categoría</th><th>Concepto</th><th class="hide-m">Proveedor</th><th class="hide-m">Nº factura</th><th class="right">Importe</th><th>Estado</th><th></th></tr></thead>
    <tbody>${vista.map((g) => `<tr class="click" data-act="${g.virtual ? 'editarCoche' : 'gasto'}" data-id="${g.id}">
      <td class="id">${g.virtual ? '<span class="muted">auto</span>' : g.id}</td><td class="num">${fecha(g.fecha)}</td>
      <td><span class="cat">${esc(g.categoria)}</span></td>
      <td>${esc(g.concepto)}${g.cocheId ? `<small class="id">${g.cocheId}</small>` : ''}</td>
      <td class="hide-m">${esc(g.proveedor)}</td><td class="hide-m id">${esc(g.numFactura) || '—'}</td>
      <td class="right num" style="font-weight:600">${eurC(g.importe)}</td>
      <td><span class="st ${g.estado === 'Pagado' ? 'Cobrada' : 'Vencida'}">${g.estado}</span></td>
      <td class="right">${g.estado === 'Pendiente' ? `<button type="button" class="btn sm ghost" data-act="pagarGasto" data-id="${g.id}">Pagar</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="9" class="empty">Sin gastos con estos filtros</td></tr>'}</tbody>
  </table></div><div class="table-foot">${lista.length} apuntes${lista.length > vista.length ? ` (se muestran los ${vista.length} más recientes; usa los filtros)` : ''} · Total ${eurC(sum(lista))} · Las compras y la preparación de vehículos se generan desde cada ficha de vehículo (auto).</div></div>`;
}

function formGasto(g) {
  const nuevo = !g;
  const d0 = g || { fecha: hoyISO(), categoria: 'Otros', concepto: '', proveedor: '', numFactura: '', importe: '', cocheId: '', estado: 'Pendiente' };
  modal({
    title: nuevo ? 'Nuevo gasto' : `Gasto ${g.id}`, sub: nuevo ? `Se asignará el nº ${nextId('GS-', db.gastos)}` : `${esc(g.categoria)} · ${g.estado}${g.fechaPago ? ' el ' + fecha(g.fechaPago) : ''}`,
    body: `<div class="fields">
      <label>Fecha *<input name="fecha" type="date" required value="${isoDate(d0.fecha)}"></label>
      <label>Categoría<select name="categoria">${opt(CAT_GASTO, d0.categoria)}</select></label>
      <label class="full">Concepto *<input name="concepto" required value="${esc(d0.concepto)}" placeholder="Ej.: Cambio de neumáticos"></label>
      <label>Proveedor *<input name="proveedor" required value="${esc(d0.proveedor)}"></label>
      <label>Nº factura del proveedor<input name="numFactura" value="${esc(d0.numFactura)}"></label>
      <label>Importe (€) *<input name="importe" type="number" min="0.01" step="0.01" required value="${d0.importe}"></label>
      <label>Estado<select name="estado">${opt(['Pendiente', 'Pagado'], d0.estado)}</select></label>
      <label class="full">Vehículo asociado (opcional, suma al coste del coche)<select name="cocheId"><option value="">Ninguno · gasto general</option>${opt(db.coches.slice().reverse().map((c) => [c.id, `${c.id} · ${c.marca} ${c.modelo} · ${c.matricula} · ${c.estado}`]), d0.cocheId)}</select></label></div>`,
    extra: nuevo ? '' : `<button type="button" class="btn danger" data-act="borrarGasto" data-id="${g.id}">${icon('trash')} Eliminar</button>`,
    onSubmit: (d) => {
      const importe = Math.round(+d.importe * 100) / 100;
      if (!d.fecha) return 'Indica la fecha.';
      if (!d.concepto.trim() || !d.proveedor.trim()) return 'Concepto y proveedor son obligatorios.';
      if (!(importe > 0)) return 'El importe debe ser mayor que 0.';
      const nfac = d.numFactura.trim().toUpperCase();
      const dup = nfac && db.gastos.find((x) => x !== g && x.numFactura && x.numFactura.toUpperCase() === nfac && x.proveedor.toLowerCase() === d.proveedor.trim().toLowerCase());
      if (dup) return `Esa factura de ${dup.proveedor} ya está registrada como ${dup.id} (${fecha(dup.fecha)}, ${eurC(dup.importe)}).`;
      const vals = { fecha: new Date(d.fecha + 'T09:00:00').toISOString(), categoria: d.categoria, concepto: d.concepto.trim(), proveedor: d.proveedor.trim(), numFactura: nfac || null,
        importe, cocheId: d.cocheId || null, estado: d.estado };
      vals.fechaPago = d.estado === 'Pagado' ? (g && g.fechaPago) || hoyISO() : null;
      if (nuevo) { const id = nextId('GS-', db.gastos); db.gastos.push({ id, ...vals }); log([id, vals.cocheId], `Gasto ${id} registrado: ${vals.concepto} (${eurC(vals.importe)})`); toast(`Gasto ${id} registrado.`); }
      else { log([g.id, vals.cocheId], `Gasto ${g.id} modificado`); Object.assign(g, vals); toast(`${g.id} actualizado.`); }
    },
  });
}
function pagarGasto(id) {
  const g = gastoById(id);
  if (!g) return;
  Object.assign(g, { estado: 'Pagado', fechaPago: hoyISO() });
  log([g.id, g.cocheId], `Factura de proveedor pagada (${eurC(g.importe)})`);
  done(`${g.id} marcado como pagado.`);
}
async function borrarGasto(id) {
  const g = gastoById(id);
  if (!await preguntar({ title: `Eliminar gasto ${id}`, text: `${esc(g.concepto)} · ${esc(g.proveedor)} · ${eurC(g.importe)}`, ok: 'Eliminar', danger: true })) return;
  log([id, g.cocheId].filter(Boolean), `Gasto ${id} eliminado (${eurC(g.importe)})`);
  db.gastos = db.gastos.filter((x) => x.id !== id);
  $('#modal').close();
  done(`Gasto ${id} eliminado.`);
}

/* ---------- Vista: Análisis de mercado ---------- */
let mSort = {};   // orden elegido en cada tabla
const COLOR_COMB = { Gasolina: '#245b94', 'Diésel': '#4a5666', 'Híbrido': '#2f8a5a', 'Híbrido enchufable': '#6aa84f', 'Eléctrico': '#d9902a' };
function vendidosPeriodo(meses) {
  const desde = meses ? now() - meses * 30.4 * DAY : 0;
  return db.coches.filter((c) => c.estado === 'Vendido' && c.fechaVenta && new Date(c.fechaVenta) >= desde)
    .map((c) => { const coste = costeTotal(c), m = c.precioVenta - coste, d = Math.max(1, dias(c.fechaCompra, c.fechaVenta)); return { c, coste, margen: m, dias: d, roi: m / coste, eurDia: m / d }; });
}
function agrupar(lista, keyFn) {
  const g = {};
  lista.forEach((x) => { const k = keyFn(x.c); (g[k] = g[k] || []).push(x); });
  return Object.entries(g).map(([k, l]) => {
    const n = l.length, mt = l.reduce((s, x) => s + x.margen, 0), dt = l.reduce((s, x) => s + x.dias, 0), ct = l.reduce((s, x) => s + x.coste, 0);
    return { k, n, dias: dt / n, margen: mt / n, margenTotal: mt, roi: mt / ct, eurDia: mt / dt, rapidos: l.filter((x) => x.dias <= 30).length / n };
  });
}
function tablaRanking(id, titulo, ic, filas, nombreCol, minN = 1, nota = '') {
  const s = mSort[id] || { k: 'eurDia', dir: -1 };
  const lista = filas.filter((f) => f.n >= minN).sort((a, b) => (a[s.k] > b[s.k] ? 1 : a[s.k] < b[s.k] ? -1 : 0) * s.dir);
  const base = lista.filter((f) => f.n >= 2).length > 2 ? lista.filter((f) => f.n >= 2) : lista;
  const best = Math.max(...base.map((f) => f.eurDia)), worst = Math.min(...base.map((f) => f.eurDia));
  const vis = mSort[id + '_all'] ? lista : lista.slice(0, 12);
  const th = (k, l, right = true) => `<th class="${right ? 'right' : ''} sortable" data-act="msort" data-id="${id}:${k}">${l}${s.k === k ? (s.dir < 0 ? ' ▼' : ' ▲') : ''}</th>`;
  return `<div class="card"><div class="card-head"><h3>${icon(ic)} ${titulo}</h3><span class="small muted">${nota || 'Pulsa una columna para ordenar'}</span></div>
    <div class="table-wrap"><table><thead><tr>${th('k', nombreCol, false)}${th('n', 'Vendidos')}${th('dias', 'Días medios')}${th('rapidos', '≤30 días', true)}${th('margen', 'Margen medio')}${th('roi', 'Rentab.')}${th('margenTotal', 'Beneficio total')}${th('eurDia', '€ / día')}</tr></thead>
    <tbody>${vis.map((f) => `<tr><td><strong>${esc(f.k)}</strong>${f.n >= (base === lista ? 1 : 2) && f.eurDia === best && lista.length > 2 ? ' <span class="st Cobrada">Mejor</span>' : f.n >= (base === lista ? 1 : 2) && f.eurDia === worst && lista.length > 2 ? ' <span class="st Vencida">Peor</span>' : ''}</td>
      <td class="right num">${f.n}</td>
      <td class="right num"><span class="meter"><span style="width:${Math.min(100, f.dias / 60 * 100)}%;background:${f.dias <= 25 ? 'var(--ok)' : f.dias <= 40 ? 'var(--amber)' : 'var(--bad)'}"></span></span>${Math.round(f.dias)}</td>
      <td class="right num">${Math.round(f.rapidos * 100)}%</td>
      <td class="right num">${eur(f.margen)}</td><td class="right num">${(f.roi * 100).toFixed(1).replace('.', ',')}%</td>
      <td class="right num">${eur(f.margenTotal)}</td><td class="right num" style="font-weight:700;color:${f.eurDia >= best * 0.75 ? 'var(--ok)' : f.eurDia <= worst * 1.25 ? 'var(--bad)' : 'var(--text)'}">${eur(f.eurDia)}</td></tr>`).join('') || `<tr><td colspan="8" class="empty">Sin datos suficientes</td></tr>`}</tbody></table></div>${lista.length > 12 ? `<div class="table-foot" style="display:flex;justify-content:space-between;align-items:center"><span>${vis.length} de ${lista.length} · Mejor/Peor se calcula con 2 o más ventas</span><button type="button" class="btn ghost sm" data-act="mall" data-id="${id}">${mSort[id + '_all'] ? 'Ver menos' : 'Ver todos'}</button></div>` : ''}</div>`;
}
function scatter(lista) {
  const W = 1100, H = 330, L = 60, B = 36, T = 14, R = 12;
  const maxD = Math.ceil(Math.max(60, ...lista.map((x) => x.dias)) / 10) * 10;
  const maxM = Math.ceil(Math.max(...lista.map((x) => x.margen)) / 1000) * 1000, minM = Math.min(0, Math.floor(Math.min(...lista.map((x) => x.margen)) / 1000) * 1000);
  const X = (d) => L + d / maxD * (W - L - R), Y = (m) => T + (maxM - m) / (maxM - minM) * (H - B - T);
  const avgD = lista.reduce((s, x) => s + x.dias, 0) / lista.length, avgM = lista.reduce((s, x) => s + x.margen, 0) / lista.length;
  let g = '';
  for (let m = minM; m <= maxM; m += 1000) g += `<line x1="${L}" x2="${W - R}" y1="${Y(m)}" y2="${Y(m)}" stroke="#eef1f4"/><text x="${L - 8}" y="${Y(m) + 4}" text-anchor="end">${(m / 1000).toLocaleString('es-ES')}k €</text>`;
  for (let d = 0; d <= maxD; d += 10) g += `<text x="${X(d)}" y="${H - B + 18}" text-anchor="middle">${d}</text>`;
  g += `<text x="${(L + W) / 2}" y="${H - 4}" text-anchor="middle">Días en stock hasta la venta</text>`;
  g += `<rect x="${L}" y="${T}" width="${X(avgD) - L}" height="${Y(avgM) - T}" fill="#e6f2eb" opacity=".6"/><rect x="${X(avgD)}" y="${Y(avgM)}" width="${W - R - X(avgD)}" height="${H - B - Y(avgM)}" fill="#f9e7e6" opacity=".6"/>`;
  g += `<line x1="${X(avgD)}" x2="${X(avgD)}" y1="${T}" y2="${H - B}" stroke="#9aa6b5" stroke-dasharray="4 4"/><line x1="${L}" x2="${W - R}" y1="${Y(avgM)}" y2="${Y(avgM)}" stroke="#9aa6b5" stroke-dasharray="4 4"/>`;
  g += `<text class="val" x="${L + 8}" y="${T + 16}" style="fill:#23774a">Rápidos y rentables</text><text class="val" x="${W - R - 8}" y="${T + 16}" text-anchor="end">Lentos pero rentables</text>`;
  g += `<text class="val" x="${L + 8}" y="${H - B - 8}">Rápidos, poco margen</text><text class="val" x="${W - R - 8}" y="${H - B - 8}" text-anchor="end" style="fill:#b3261e">Lentos y poco margen</text>`;
  g += `<line x1="${L}" x2="${L}" y1="${T}" y2="${H - B}" stroke="#9aa6b5"/><line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" stroke="#9aa6b5"/>`;
  lista.forEach((x) => { g += `<rect class="pt" data-act="editarCoche" data-id="${x.c.id}" x="${X(x.dias) - 5}" y="${Y(x.margen) - 5}" width="10" height="10" fill="${COLOR_COMB[x.c.combustible] || '#777'}" stroke="#fff" stroke-width="1.5"><title>${x.c.id} · ${x.c.marca} ${x.c.modelo} (${x.c.anio}) · ${x.dias} días · margen ${eur(x.margen)}</title></rect>`; });
  const comb = [...new Set(lista.map((x) => x.c.combustible))];
  return `<div class="legend">${comb.map((c) => `<span><i style="background:${COLOR_COMB[c]}"></i>${c}</span>`).join('')}<span class="muted">Líneas discontinuas: media (${Math.round(avgD)} días · ${eur(avgM)})</span></div>
    <div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Días en stock frente a margen">${g}</svg></div>`;
}
function vMercado(periodo = '12') {
  const meses = periodo === 'todo' ? 0 : +periodo || 12;
  const vend = vendidosPeriodo(meses);
  const nav = `<div class="toolbar"><div class="seg">${[['6', 'Últimos 6 meses'], ['12', 'Últimos 12 meses'], ['todo', 'Todo el histórico']].map(([k, l]) => `<a href="#mercado/${k}" class="${String(periodo || '12') === k ? 'on' : ''}">${l}</a>`).join('')}</div>
    <span class="muted small" style="flex:1">€ / día = margen ÷ días en stock: lo que gana cada coche por cada día que ocupa sitio en la exposición.</span></div>`;
  if (vend.length < 3) return nav + '<div class="card empty">No hay ventas suficientes en este periodo.</div>';
  const n = vend.length, avg = (k) => vend.reduce((s, x) => s + x[k], 0) / n;
  const stock = db.coches.filter((c) => c.estado === 'A la venta' || c.estado === 'En preparación');
  const atasc = db.coches.filter((c) => c.estado === 'A la venta' && dias(c.fechaCompra) > 45);
  const capital = stock.reduce((s, c) => s + costeTotal(c), 0);
  const kpi = (cls, ic, label, value, sub) => `<div class="card kpi ${cls}"><div class="ico">${icon(ic)}</div><div><div class="label">${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></div></div>`;
  const modelos = agrupar(vend, (c) => `${c.marca} ${c.modelo}`), marcas = agrupar(vend, (c) => c.marca);
  const comb = agrupar(vend, (c) => c.combustible), cambio = agrupar(vend, (c) => c.cambio), subastas = agrupar(vend, (c) => c.subasta);
  const precio = agrupar(vend, (c) => (c.precioVenta < 15000 ? '1 · Menos de 15.000 €' : c.precioVenta < 20000 ? '2 · 15.000 – 20.000 €' : c.precioVenta < 25000 ? '3 · 20.000 – 25.000 €' : '4 · Más de 25.000 €'));
  const km = agrupar(vend, (c) => (c.km < 40000 ? '1 · Menos de 40.000 km' : c.km < 70000 ? '2 · 40.000 – 70.000 km' : '3 · Más de 70.000 km'));
  // Conclusiones automáticas
  const m2 = modelos.filter((m) => m.n >= 2).sort((a, b) => b.eurDia - a.eurDia);
  const cRap = comb.slice().sort((a, b) => a.dias - b.dias), sMar = subastas.slice().sort((a, b) => b.margen - a.margen);
  const mMar = marcas.filter((m) => m.n >= 2).sort((a, b) => b.margen - a.margen);
  const ideas = [];
  if (m2.length) ideas.push(['trend', 'ok', `Comprar más <strong>${esc(m2[0].k)}</strong>`, `El mejor €/día del periodo: ${eur(m2[0].eurDia)} al día, se vende en ${Math.round(m2[0].dias)} días con ${eur(m2[0].margen)} de margen.`]);
  if (m2.length > 2) ideas.push(['alert', 'bad', `Evitar o pujar más bajo por <strong>${esc(m2[m2.length - 1].k)}</strong>`, `El peor €/día: ${eur(m2[m2.length - 1].eurDia)} al día (${Math.round(m2[m2.length - 1].dias)} días, ${eur(m2[m2.length - 1].margen)} de margen).`]);
  if (cRap.length > 1) { const PL = { Gasolina: 'de gasolina', 'Diésel': 'diésel', 'Híbrido': 'híbridos', 'Híbrido enchufable': 'híbridos enchufables', 'Eléctrico': 'eléctricos' };
    ideas.push(['clock', '', `Los coches <strong>${PL[cRap[0].k] || esc(cRap[0].k)}</strong> son los que más rotan`, `${Math.round(cRap[0].dias)} días de media frente a ${Math.round(cRap[cRap.length - 1].dias)} de los ${PL[cRap[cRap.length - 1].k] || esc(cRap[cRap.length - 1].k)}.`]); }
  if (mMar.length) ideas.push(['tag', '', `<strong>${esc(mMar[0].k)}</strong> deja el mayor margen por coche`, `${eur(mMar[0].margen)} de media${mMar[0].dias > avg('dias') ? `, aunque tarda más en venderse (${Math.round(mMar[0].dias)} días)` : ''}.`]);
  if (sMar.length > 1) ideas.push(['store', '', `Mejor origen de compra: <strong>${esc(sMar[0].k)}</strong>`, `Margen medio de ${eur(sMar[0].margen)} frente a ${eur(sMar[sMar.length - 1].margen)} en ${esc(sMar[sMar.length - 1].k)}.`]);
  if (atasc.length) ideas.push(['alert', 'bad', `${atasc.length} vehículo(s) atascado(s) en stock`, `Más de 45 días a la venta. Inmovilizan ${eur(atasc.reduce((s, c) => s + costeTotal(c), 0))}. Revisar precio (ver tabla inferior).`]);
  const COSTE_DIA = 0.06 / 365; // coste financiero del dinero parado: 6 % anual
  return nav + `
  <div class="grid kpis">
    ${kpi('', 'clock', 'Rotación media', Math.round(avg('dias')) + ' días', `${Math.round(vend.filter((x) => x.dias <= 30).length / n * 100)}% vendidos en ≤30 días`)}
    ${kpi('green', 'tag', 'Margen medio', eur(avg('margen')), `rentabilidad ${(vend.reduce((s, x) => s + x.margen, 0) / vend.reduce((s, x) => s + x.coste, 0) * 100).toFixed(1).replace('.', ',')}% sobre coste`)}
    ${kpi('green', 'trend', '€ por día en stock', eur(vend.reduce((s, x) => s + x.margen, 0) / vend.reduce((s, x) => s + x.dias, 0)), `${n} vehículos vendidos`)}
    ${kpi(atasc.length ? 'red' : 'green', 'alert', 'Atascados', atasc.length, `> 45 días · stock total ${stock.length} uds.`)}
    ${kpi('amber', 'wallet', 'Capital en stock', eur(capital), `coste financiero ≈ ${eur(capital * COSTE_DIA * 30)}/mes`)}
  </div>
  <div class="card"><div class="card-head"><h3>${icon('bulb')} Conclusiones para compras</h3><span class="small muted">Calculadas con las ventas del periodo</span></div>
    <div class="ideas">${ideas.map(([ic, cls, t, sub]) => `<div class="idea ${cls}"><div class="ico">${icon(ic)}</div><div><div class="t">${t}</div><div class="s">${sub}</div></div></div>`).join('')}</div></div>
  <div class="card mt"><div class="card-head"><h3>${icon('chart')} Velocidad de venta frente a margen</h3><span class="small muted">Cada cuadro es un vehículo vendido · pulsa para ver su ficha</span></div><div class="card-body">${scatter(vend)}</div></div>
  <div class="mt">${tablaRanking('modelos', 'Rentabilidad por modelo', 'car', modelos, 'Modelo', 1, 'Ordenado por € / día · pulsa una columna para cambiar')}</div>
  <div class="mt">${tablaRanking('marcas', 'Rentabilidad por marca', 'tag', marcas, 'Marca')}</div>
  <div class="grid two mt">
    ${tablaMini('Por combustible', 'trend', comb)}
    ${tablaMini('Por subasta de origen', 'store', subastas)}
    ${tablaMini('Por precio de venta', 'euro', precio.sort((a, b) => a.k.localeCompare(b.k)), (k) => k.slice(4))}
    ${tablaMini('Por kilometraje', 'clock', km.sort((a, b) => a.k.localeCompare(b.k)), (k) => k.slice(4))}
    ${tablaMini('Por tipo de cambio', 'wheel', cambio)}
  </div>
  <div class="card mt"><div class="card-head"><h3>${icon('alert')} Stock actual · riesgo de atasco</h3><span class="small muted">Vehículos a la venta, de más a menos días</span></div>
    <div class="table-wrap"><table><thead><tr><th>Nº catálogo</th><th>Vehículo</th><th class="right">Días</th><th class="right hide-m">Interesados</th><th class="right">PVP</th><th class="right">Margen</th><th class="right hide-m">Coste parado</th><th>Recomendación</th></tr></thead>
    <tbody>${db.coches.filter((c) => c.estado === 'A la venta').sort((a, b) => a.fechaCompra.localeCompare(b.fechaCompra)).map((c) => {
      const d = dias(c.fechaCompra), mg = margen(c), lead = db.ventas.filter((v) => v.cocheId === c.id && v.etapa === 'Lead').length;
      const ref = modelos.find((m) => m.k === `${c.marca} ${c.modelo}`) || comb.find((m) => m.k === c.combustible);
      let rec = '<span class="st Cobrada">Mantener</span>';
      if (d > 60) rec = `<span class="st Vencida">Rebajar ${eur(Math.min(Math.round(c.precioVenta * 0.07 / 100) * 100, Math.max(0, mg - 800)))}</span>`;
      else if (d > 45) rec = `<span class="st Vencida">Rebajar ${eur(Math.min(Math.round(c.precioVenta * 0.04 / 100) * 100, Math.max(0, mg - 800)))}</span>`;
      else if (ref && d > ref.dias) rec = '<span class="st Pendiente-de-cobro">Vigilar: más lento que la media</span>';
      return `<tr class="click" data-act="editarCoche" data-id="${c.id}"><td class="id">${c.id}</td><td><strong>${esc(c.marca)} ${esc(c.modelo)}</strong><small>${c.anio} · ${num(c.km)} km · ${esc(c.combustible)}${ref ? ` · media de venta ${Math.round(ref.dias)} días` : ''}</small></td>
        <td class="right num" style="font-weight:700;color:${d > 45 ? 'var(--bad)' : d > 30 ? 'var(--warn)' : 'var(--text)'}">${d}</td><td class="right num hide-m">${lead}</td>
        <td class="right num">${eur(c.precioVenta)}</td><td class="right num">${eur(mg)}</td><td class="right num hide-m">${eur(costeTotal(c) * COSTE_DIA * d)}</td><td>${rec}</td></tr>`;
    }).join('')}</tbody></table></div>
    <div class="table-foot">Coste parado = coste del vehículo × 6 % anual × días en stock. La rebaja sugerida nunca deja el margen por debajo de 800 €.</div></div>`;
}
function tablaMini(titulo, ic, filas, label = (k) => k) {
  const best = Math.max(...filas.map((f) => f.eurDia));
  return `<div class="card"><div class="card-head"><h3>${icon(ic)} ${titulo}</h3></div><div class="table-wrap"><table>
    <thead><tr><th></th><th class="right">Uds.</th><th class="right">Días</th><th class="right">Margen</th><th class="right">€ / día</th></tr></thead>
    <tbody>${filas.map((f) => `<tr><td>${esc(label(f.k))}</td><td class="right num">${f.n}</td><td class="right num">${Math.round(f.dias)}</td><td class="right num">${eur(f.margen)}</td>
      <td class="right num"><span class="meter"><span style="width:${f.eurDia / best * 100}%"></span></span><strong>${eur(f.eurDia)}</strong></td></tr>`).join('')}</tbody></table></div></div>`;
}

/* ---------- Mover operaciones (arrastrar) ---------- */
const ORDEN = ['Lead', 'Reservado', 'Papeles', 'Entregado'];
function puedeMover(v, destino) {
  if (v.etapa === destino) return false;
  if (v.etapa === 'Entregado') return false;
  if (destino === 'Perdido') return true;
  if (v.etapa === 'Perdido') return destino === 'Lead';
  if (v.etapa === 'Reservado' && destino === 'Lead') return true;
  return ORDEN.indexOf(destino) === ORDEN.indexOf(v.etapa) + 1;
}
async function moverA(id, destino) {
  const v = venta(id);
  if (!v || v.etapa === destino) return;
  if (!puedeMover(v, destino)) {
    if (v.etapa === 'Entregado') return toast('Una operación entregada no se puede mover.');
    if (v.etapa === 'Papeles' && destino !== 'Entregado') return toast(`La factura ${v.numFactura} ya está emitida. Para anularla, marca la operación como perdida.`);
    return toast('Sigue el orden: Lead → Reservado → Papeles → Entregado.');
  }
  if (destino === 'Perdido') return perder(id);
  if (v.etapa === 'Perdido') {
    Object.assign(v, { etapa: 'Lead', motivoPerdida: '', inicio: hoyISO() });
    log([v.id, v.clienteId, v.cocheId], `Operación ${v.id} reabierta como lead`);
    return done(`${v.id} reabierta como lead.`);
  }
  if (v.etapa === 'Reservado' && destino === 'Lead') {
    if (!await preguntar({ title: `Anular la reserva de ${v.id}`, text: 'Se devolverá la señal al cliente y el vehículo vuelve a estar a la venta.', ok: 'Anular reserva', danger: true })) return;
    log([v.id, v.clienteId, v.cocheId], `Reserva de ${v.id} anulada y señal devuelta`);
    const c0 = cobrado(v);
    if (c0 > 0) v.pagos.push({ fecha: hoyISO(), importe: -c0, concepto: 'Devolución de señal', metodo: 'Tarjeta' });
    liberarCoche(v);
    Object.assign(v, { etapa: 'Lead', reserva: null, entregaPrevista: null });
    return done(`Reserva de ${v.id} anulada.`);
  }
  ({ Reservado: reservar, Papeles: facturar, Entregado: entregar })[destino](id);
}
let drag = null, ignoreClick = false;
function endDrag() {
  if (!drag) return;
  drag.ghost?.remove();
  drag.card.classList.remove('dragging');
  document.body.classList.remove('is-dragging');
  document.querySelectorAll('.kcol').forEach((k) => k.classList.remove('drop-ok', 'drop-no'));
  clearTimeout(drag.timer);
  drag = null;
}
function startDrag() {
  const r = drag.card.getBoundingClientRect();
  drag.ox = drag.x - r.left; drag.oy = drag.y - r.top;
  drag.ghost = drag.card.cloneNode(true);
  drag.ghost.classList.add('kghost');
  drag.ghost.style.width = r.width + 'px';
  document.body.appendChild(drag.ghost);
  drag.card.classList.add('dragging');
  document.body.classList.add('is-dragging');
  drag.started = true;
  moveGhost(drag.x, drag.y);
}
function moveGhost(x, y) {
  drag.ghost.style.left = (x - drag.ox) + 'px';
  drag.ghost.style.top = (y - drag.oy) + 'px';
  const col = document.elementFromPoint(x, y)?.closest('.kcol');
  document.querySelectorAll('.kcol').forEach((k) => k.classList.remove('drop-ok', 'drop-no'));
  if (col && col.dataset.etapa !== venta(drag.id).etapa) col.classList.add(puedeMover(venta(drag.id), col.dataset.etapa) ? 'drop-ok' : 'drop-no');
  drag.col = col;
}
document.addEventListener('pointerdown', (e) => {
  const card = e.target.closest('.kcard');
  if (!card || e.target.closest('button') || e.button !== 0) return;
  drag = { card, id: card.dataset.id, x: e.clientX, y: e.clientY, started: false, touch: e.pointerType !== 'mouse' };
  if (drag.touch) drag.timer = setTimeout(() => { if (drag && !drag.started) startDrag(); }, 350);
});
document.addEventListener('pointermove', (e) => {
  if (!drag) return;
  if (!drag.started) {
    const dist = Math.hypot(e.clientX - drag.x, e.clientY - drag.y);
    if (drag.touch) { if (dist > 8) endDrag(); return; }
    if (dist < 6) return;
    startDrag();
  }
  e.preventDefault();
  moveGhost(e.clientX, e.clientY);
});
document.addEventListener('mousedown', (e) => { if (e.target.closest('.kcard') && !e.target.closest('button')) e.preventDefault(); });
document.addEventListener('touchmove', (e) => { if (drag?.started) e.preventDefault(); }, { passive: false });
document.addEventListener('pointerup', () => {
  if (!drag) return;
  if (drag.started) {
    const { id, col } = drag;
    ignoreClick = true; setTimeout(() => { ignoreClick = false; }, 50);
    endDrag();
    if (col && col.dataset.etapa) moverA(id, col.dataset.etapa);
  } else endDrag();
});
document.addEventListener('pointercancel', endDrag);

/* ---------- Formularios: vehículo ---------- */
function formCoche(car) {
  const nuevo = !car;
  const d0 = car || { marca: '', modelo: '', version: '', anio: new Date().getFullYear() - 3, km: '', combustible: 'Gasolina', cambio: 'Manual', color: '', matricula: '', bastidor: '', subasta: 'Autorola', precioCompra: '', gastos: 0, precioVenta: '', estado: 'En preparación' };
  const estados = ['Vendido', 'Reservado'].includes(d0.estado) ? [d0.estado] : ['En preparación', 'A la venta'];
  const ops = nuevo ? [] : db.ventas.filter((v) => v.cocheId === car.id);
  modal({
    title: nuevo ? 'Alta de vehículo' : `${esc(car.marca)} ${esc(car.modelo)}`, sub: nuevo ? `Se asignará el nº de catálogo ${nextId('VH-', db.coches)}` : `Nº catálogo ${car.id} · ${st(car.estado)}`,
    body: `${nuevo ? '' : `<div class="car-hero">${silueta(car, 220)}<div><div class="id">${car.id} · ${esc(car.matricula)}</div><div style="font-size:18px;font-weight:700">${esc(car.marca)} ${esc(car.modelo)}</div><div class="muted small">${esc(car.version)} · ${car.anio} · ${num(car.km)} km · ${esc(car.combustible)} · ${esc(car.cambio)}</div><div style="font-size:20px;font-weight:700;margin-top:4px;color:var(--navy-800)">${eur(car.precioVenta)}</div></div></div>`}
      ${nuevo ? '' : `<div class="info-row"><div><span>Coste total</span><span class="num" style="text-transform:none;font-size:14px;color:var(--text)">${eur(costeTotal(car))}</span></div>
        <div><span>Margen</span><span class="num" style="text-transform:none;font-size:14px;color:${margen(car) >= 0 ? 'var(--ok)' : 'var(--bad)'}">${eur(margen(car))}</span></div>
        <div><span>Días en stock</span><span class="num" style="text-transform:none;font-size:14px;color:var(--text)">${car.fechaVenta ? dias(car.fechaCompra, car.fechaVenta) : dias(car.fechaCompra)}</span></div></div>`}
      <div class="fields">
      <label>Marca *<input name="marca" required value="${esc(d0.marca)}"></label>
      <label>Modelo *<input name="modelo" required value="${esc(d0.modelo)}"></label>
      <label>Versión<input name="version" value="${esc(d0.version)}"></label>
      <label>Color<input name="color" value="${esc(d0.color)}"></label>
      <label>Matrícula *<input name="matricula" required value="${esc(d0.matricula)}" placeholder="0000 AAA"></label>
      <label>Nº de bastidor (VIN) *<input name="bastidor" required maxlength="17" value="${esc(d0.bastidor)}" placeholder="17 caracteres"></label>
      <label>Año<input name="anio" type="number" min="1990" max="${new Date().getFullYear() + 1}" value="${esc(d0.anio)}"></label>
      <label>Kilómetros *<input name="km" type="number" min="0" required value="${esc(d0.km)}"></label>
      <label>Combustible<select name="combustible">${opt(['Gasolina', 'Diésel', 'Híbrido', 'Híbrido enchufable', 'Eléctrico'], d0.combustible)}</select></label>
      <label>Cambio<select name="cambio">${opt(['Manual', 'Automático'], d0.cambio)}</select></label>
      <label>Subasta de origen<select name="subasta">${opt(['Autorola', 'Auto1', 'BCA', 'Leasys', 'Ayvens', 'Arval'], d0.subasta)}</select></label>
      <label>Estado<select name="estado">${opt(estados, d0.estado)}</select></label>
      <label>Precio de subasta (€) *<input name="precioCompra" type="number" min="0" required value="${esc(d0.precioCompra)}"></label>
      <label>Gastos de preparación (€)<input name="gastos" type="number" min="0" value="${esc(d0.gastos)}"></label>
      <label>PVP (€) *<input name="precioVenta" type="number" min="0" required value="${esc(d0.precioVenta)}"></label></div>
      ${nuevo ? '' : `<div><div class="small" style="font-weight:600;color:var(--text-2);margin-bottom:4px">Desglose de costes</div><div class="checklist">
        <label style="justify-content:space-between;cursor:default"><span>${fecha(car.fechaCompra)} · Compra en subasta (${esc(car.subasta)})</span><strong class="num">${eurC(car.precioCompra)}</strong></label>
        <label style="justify-content:space-between;cursor:default"><span>Preparación (taller, limpieza, fotos)</span><strong class="num">${eurC(car.gastos)}</strong></label>
        ${db.gastos.filter((g) => g.cocheId === car.id).map((g) => `<label style="justify-content:space-between;cursor:default"><span>${fecha(g.fecha)} · ${esc(g.concepto.split(' · ')[0])} <span class="muted small">${esc(g.id)}</span></span><strong class="num">${eurC(g.importe)}</strong></label>`).join('')}
        <label style="justify-content:space-between;cursor:default;background:var(--surface-2)"><span><strong>Coste total</strong></span><strong class="num">${eurC(costeTotal(car))}</strong></label></div></div>`}
      ${nuevo ? '' : `<div><div class="small" style="font-weight:600;color:var(--text-2);margin-bottom:4px">Historial de cambios</div><div class="checklist">${historialHtml([car.id])}</div></div>`}
      ${ops.length ? `<div><div class="small" style="font-weight:600;color:var(--text-2);margin-bottom:4px">Operaciones con este vehículo</div><div class="checklist">${ops.map((v) => `<label style="justify-content:space-between"><span><span class="id">${v.id}</span> ${esc(cliente(v.clienteId)?.nombre)}</span>${st(v.etapa)}</label>`).join('')}</div></div>` : ''}`,
    extra: nuevo ? '' : `<button type="button" class="btn danger" data-act="borrarCoche" data-id="${car.id}" title="Eliminar">${icon('trash')}</button><button type="button" class="btn ghost" data-act="escaparate" data-id="${car.id}">${icon('print')} Ficha escaparate</button>`,
    onSubmit: (d) => {
      const mat = normMat(d.matricula), vin = d.bastidor.toUpperCase().replace(/\s/g, '');
      if (!d.marca.trim() || !d.modelo.trim()) return 'Marca y modelo son obligatorios.';
      if (mat.length < 5) return 'Introduce una matrícula válida.';
      if (!vinValido(vin)) return 'El nº de bastidor debe tener 17 caracteres (letras y números, sin I, O ni Q).';
      if (d.km === '' || +d.km < 0) return 'Indica los kilómetros.';
      if (!(+d.precioCompra > 0) || !(+d.precioVenta > 0)) return 'Indica el precio de subasta y el PVP.';
      const otros = db.coches.filter((x) => x !== car);
      const m = otros.find((x) => normMat(x.matricula) === mat);
      if (m) return `La matrícula ${fmtMat(mat)} ya está registrada en ${m.id} (${nombreCoche(m)}).`;
      const b = otros.find((x) => x.bastidor === vin);
      if (b) return `Ese nº de bastidor ya está registrado en ${b.id} (${nombreCoche(b)}).`;
      const vals = { marca: d.marca.trim(), modelo: d.modelo.trim(), version: d.version.trim(), color: d.color.trim(), matricula: fmtMat(mat), bastidor: vin,
        anio: +d.anio || '', km: +d.km, combustible: d.combustible, cambio: d.cambio, subasta: d.subasta, estado: d.estado,
        precioCompra: Math.round(+d.precioCompra), gastos: Math.round(+d.gastos) || 0, precioVenta: Math.round(+d.precioVenta) };
      if (nuevo) { const id = nextId('VH-', db.coches); db.coches.push({ id, ...vals, fechaCompra: hoyISO(), fechaVenta: null }); log([id], `Alta de vehículo: ${vals.marca} ${vals.modelo} ${vals.matricula}`); toast(`Vehículo ${id} dado de alta.`); }
      else {
        const cc = cambios(car, vals, { precioVenta: 'PVP', precioCompra: 'precio de subasta', gastos: 'preparación', km: 'km', estado: 'estado', matricula: 'matrícula', bastidor: 'bastidor', color: 'color', version: 'versión' });
        if (cc) log([car.id], `Vehículo modificado: ${cc}${vals.precioVenta !== car.precioVenta ? ` (PVP ${eur(car.precioVenta)} → ${eur(vals.precioVenta)})` : ''}`);
        Object.assign(car, vals);
        db.ventas.filter((v) => v.cocheId === car.id && v.etapa === 'Lead').forEach((v) => { v.precio = car.precioVenta; });
        toast(`${car.id} actualizado.`);
      }
    },
  });
}
async function borrarCoche(id) {
  const car = coche(id);
  const bloq = db.ventas.filter((v) => v.cocheId === id && CON_FACTURA.includes(v.etapa));
  if (bloq.length) return toast(`No se puede eliminar ${id}: está en operaciones reservadas o vendidas (${bloq.map((v) => v.id).join(', ')}).`);
  if (!await preguntar({ title: `Eliminar vehículo ${id}`, text: `<strong>${nombreCoche(car)} ${esc(car.matricula)}</strong>. Se borrarán también sus leads y gastos asociados.`, ok: 'Eliminar', danger: true })) return;
  log([id], `Vehículo eliminado: ${nombreCoche(car)} ${car.matricula}`);
  db.ventas = db.ventas.filter((v) => v.cocheId !== id);
  db.gastos = db.gastos.filter((g) => g.cocheId !== id);
  db.coches = db.coches.filter((x) => x.id !== id);
  $('#modal').close();
  done(`Vehículo ${id} eliminado.`);
}

/* ---------- Exportar CSV (compatible con Excel) ---------- */
function exportar(tipo) {
  const f = (iso) => (iso ? isoDate(iso) : '');
  let head, rows;
  if (tipo === 'clientes') {
    head = ['ID', 'Nombre', 'DNI/NIF', 'Teléfono', 'Email', 'Ciudad', 'Canal', 'Estado', 'Alta', 'Total comprado (€)'];
    rows = db.clientes.map((c) => [c.id, c.nombre, c.dni, c.telefono, c.email, c.ciudad, c.origen, estadoCliente(c), f(c.alta),
      ventasDe(c.id).filter((v) => v.etapa === 'Entregado').reduce((s, v) => s + v.precio, 0)]);
  } else if (tipo === 'coches') {
    head = ['Nº catálogo', 'Marca', 'Modelo', 'Versión', 'Matrícula', 'Bastidor', 'Año', 'Km', 'Combustible', 'Cambio', 'Color', 'Subasta', 'Fecha compra', 'Precio subasta (€)', 'Gastos (€)', 'PVP (€)', 'Margen (€)', 'Estado', 'Fecha venta'];
    rows = db.coches.map((c) => [c.id, c.marca, c.modelo, c.version, c.matricula, c.bastidor, c.anio, c.km, c.combustible, c.cambio, c.color, c.subasta, f(c.fechaCompra), c.precioCompra, c.gastos, c.precioVenta, margen(c), c.estado, f(c.fechaVenta)]);
  } else if (tipo === 'gastos') {
    head = ['Nº gasto', 'Fecha', 'Categoría', 'Concepto', 'Proveedor', 'Nº factura proveedor', 'Nº catálogo', 'Importe (€)', 'Estado', 'Fecha de pago'];
    rows = listaGastos().map((g) => [g.id, f(g.fecha), g.categoria, g.concepto, g.proveedor, g.numFactura, g.cocheId, String(g.importe).replace('.', ','), g.estado, f(g.fechaPago)]);
  } else if (tipo === 'finanzas') {
    head = ['Nº factura', 'Estado', 'Fecha emisión', 'Vencimiento', 'Nº operación', 'ID cliente', 'Cliente', 'DNI/NIF', 'Vehículo', 'Matrícula', 'Importe (€)', 'Cobrado (€)', 'Pendiente (€)', 'Último cobro'];
    rows = db.ventas.filter((v) => estadoFin(v)).map((v) => { const c = cliente(v.clienteId), car = coche(v.cocheId); const ult = (v.pagos || []).map((p) => p.fecha).sort().pop();
      return [v.numFactura, estadoFin(v), f(v.fechaFactura), f(v.vencimiento), v.id, c?.id, c?.nombre, c?.dni, nombreCoche(car), car?.matricula, v.precio, cobrado(v), pendienteCobro(v), f(ult)]; });
  } else {
    head = ['Nº operación', 'Etapa', 'ID cliente', 'Cliente', 'Nº catálogo', 'Vehículo', 'Matrícula', 'Inicio', 'Reserva', 'Entrega', 'Nº factura', 'Importe (€)', 'Garantía hasta', 'Docs completos', 'Motivo pérdida'];
    rows = db.ventas.map((v) => { const c = cliente(v.clienteId), car = coche(v.cocheId); return [v.id, v.etapa, c?.id, c?.nombre, car?.id, nombreCoche(car), car?.matricula, f(v.inicio), f(v.reserva), f(v.entrega), v.numFactura, v.precio, f(v.garantiaHasta), docsFaltan(v).length ? 'No' : 'Sí', v.motivoPerdida]; });
  }
  const cell = (x) => `"${String(x ?? '').replace(/"/g, '""')}"`;
  const csv = '﻿' + [head, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = `autoselect-${tipo}-${isoDate(hoyISO())}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  toast(`Exportado: ${rows.length} registros.`);
}

/* ---------- Siluetas de vehículo (dibujo propio) ---------- */
const SUV = ['C-HR', '3008', 'Sportage', 'Tucson', 'Kuga', 'T-Roc', 'Formentor', 'Qashqai', 'ZS EV', 'XC40', 'CX-30', 'Captur', 'Niro', 'X1', 'Ateca', 'Tiguan', 'RAV4',
  'Arkana', '2008', 'Stonic', 'Kona', 'Puma', 'Mokka', 'Kamiq', 'C3 Aircross', 'Juke', 'Duster', 'Q3', 'GLA', 'CX-5', 'Arona'];
const BERLINA = ['Model 3', 'Serie 3'], FAMILIAR = ['Octavia Combi'];
const COLOR_HEX = { Blanco: '#f3f4f2', Gris: '#8b929b', Negro: '#2b2e34', Azul: '#2f5d8f', Rojo: '#b8322a', Plata: '#c4c9cf', Naranja: '#e07b28', Verde: '#4f7d52', Beige: '#d7c8a6', Amarillo: '#e6c240' };
const CARROCERIA = {
  suv: { body: 'M7 35 L8 25 Q9 20 16 19 L30 18 L40 9 Q43 7 48 7 L84 7 Q90 7 93 11 L101 18 L109 20 Q114 21 114 27 L114 35 Z', win: ['M33 18 L42 10 Q44 9 48 9 L62 9 L62 18 Z', 'M65 9 L84 9 Q88 9 90 12 L96 18 L65 18 Z'], w: [[28, 35, 8], [93, 35, 8]] },
  compacto: { body: 'M8 35 L9 27 Q11 22 18 21 L34 20 L46 12 Q50 10 56 10 L82 10 Q88 10 92 14 L101 21 L108 23 Q113 24 113 29 L113 35 Z', win: ['M38 20 L48 13 Q51 12 56 12 L66 12 L66 20 Z', 'M69 12 L82 12 Q86 12 89 15 L95 20 L69 20 Z'], w: [[28, 35, 7], [94, 35, 7]] },
  berlina: { body: 'M5 35 L6 28 Q7 24 15 23 L32 21 L45 12 Q49 10 55 10 L74 10 Q80 10 85 14 L95 21 L109 23 Q115 24 115 29 L115 35 Z', win: ['M37 21 L47 13 Q50 12 55 12 L64 12 L64 21 Z', 'M67 12 L74 12 Q79 12 83 15 L91 21 L67 21 Z'], w: [[27, 35, 7], [94, 35, 7]] },
  familiar: { body: 'M5 35 L6 28 Q7 24 15 23 L32 21 L45 12 Q49 10 55 10 L99 10 Q103 10 105 14 L109 22 Q115 24 115 29 L115 35 Z', win: ['M37 21 L47 13 Q50 12 55 12 L64 12 L64 21 Z', 'M67 12 L85 12 L85 21 L67 21 Z', 'M88 12 L99 12 Q102 12 103 15 L106 21 L88 21 Z'], w: [[27, 35, 7], [96, 35, 7]] },
};
function silueta(c, w = 64) {
  const t = SUV.includes(c.modelo) ? 'suv' : BERLINA.includes(c.modelo) ? 'berlina' : FAMILIAR.includes(c.modelo) ? 'familiar' : 'compacto';
  const s = CARROCERIA[t], col = COLOR_HEX[c.color] || '#9aa3ad';
  return `<svg class="sil" viewBox="0 0 120 46" width="${w}" height="${Math.round(w * 46 / 120)}" aria-hidden="true">
    <ellipse cx="60" cy="42" rx="54" ry="3" fill="#000" opacity=".12"/>
    <path d="${s.body}" fill="${col}" stroke="#1f2a37" stroke-opacity=".55" stroke-width="1.2" stroke-linejoin="round"/>
    ${s.win.map((p) => `<path d="${p}" fill="#c9dbea" stroke="#1f2a37" stroke-opacity=".4" stroke-width=".8"/>`).join('')}
    <path d="M10 30 h6 M106 28 h5" stroke="${col === '#2b2e34' ? '#ddd' : '#fff'}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
    ${s.w.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#23262b"/><circle cx="${x}" cy="${y}" r="${r * 0.45}" fill="#b9c0c8"/>`).join('')}
  </svg>`;
}

/* ---------- Buscador global ---------- */
let gsSel = 0;
function buscarGlobal(q) {
  q = q.toLowerCase().trim();
  if (q.length < 2) return [];
  const qn = q.replace(/[\s.-]/g, ''), out = { Clientes: [], 'Vehículos': [], Operaciones: [], Gastos: [] };
  const hit = (t) => t.toLowerCase().includes(q) || (qn.length > 2 && t.toLowerCase().replace(/[\s.-]/g, '').includes(qn));
  db.clientes.forEach((c) => { if (hit(`${c.id} ${c.nombre} ${c.dni} ${c.telefono} ${c.email}`)) out.Clientes.push({ ic: 'user', t: c.nombre, s: `${c.id} · ${c.telefono} · ${estadoCliente(c)}`, go: '#ficha/' + c.id }); });
  db.coches.forEach((c) => { if (hit(`${c.id} ${c.marca} ${c.modelo} ${c.matricula} ${c.bastidor}`)) out['Vehículos'].push({ ic: 'car', t: `${c.marca} ${c.modelo}`, s: `${c.id} · ${c.matricula} · ${c.estado}`, act: 'editarCoche', id: c.id }); });
  db.ventas.forEach((v) => { if (hit(`${v.id} ${v.numFactura || ''}`)) out.Operaciones.push({ ic: 'euro', t: v.id + (v.numFactura ? ' · ' + v.numFactura : ''), s: `${cliente(v.clienteId)?.nombre} · ${v.etapa}`, act: 'venta', id: v.id }); });
  db.gastos.forEach((g) => { if (hit(`${g.id} ${g.numFactura || ''} ${g.proveedor}`)) out.Gastos.push({ ic: 'wallet', t: `${g.id} · ${g.concepto}`, s: `${g.proveedor} · ${eurC(g.importe)}`, act: 'gasto', id: g.id }); });
  return Object.entries(out).filter(([, l]) => l.length).map(([g, l]) => [g, l.slice(0, 5), l.length]);
}
function pintarBusqueda() {
  const q = $('#gs').value, box = $('#gsr'), res = buscarGlobal(q);
  if (q.trim().length < 2) { box.classList.remove('open'); return; }
  let i = 0;
  box.innerHTML = res.length ? res.map(([g, l, n]) => `<div class="gs-g">${g}<span>${n > 5 ? `5 de ${n}` : n}</span></div>` + l.map((r) =>
    `<button type="button" class="gs-i ${i++ === gsSel ? 'sel' : ''}" ${r.go ? `data-go="${r.go}"` : `data-act="${r.act}" data-id="${r.id}"`}>${icon(r.ic)}<span><b>${esc(r.t)}</b><small>${esc(r.s)}</small></span></button>`).join('')).join('')
    : '<div class="empty small">Sin resultados</div>';
  box.classList.add('open');
}
$('#gs').addEventListener('input', () => { gsSel = 0; pintarBusqueda(); });
$('#gs').addEventListener('focus', pintarBusqueda);
$('#gs').addEventListener('keydown', (e) => {
  const items = [...document.querySelectorAll('#gsr .gs-i')];
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); gsSel = (gsSel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % Math.max(1, items.length); pintarBusqueda(); }
  else if (e.key === 'Enter' && items[gsSel]) { e.preventDefault(); items[gsSel].click(); }
  else if (e.key === 'Escape') { $('#gs').blur(); $('#gsr').classList.remove('open'); }
});
$('#gsr').addEventListener('click', () => setTimeout(() => { $('#gsr').classList.remove('open'); $('#gs').value = ''; $('#gs').blur(); }, 0));
document.addEventListener('mousedown', (e) => { if (!e.target.closest('.gsearch')) $('#gsr').classList.remove('open'); });
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#gs').focus(); $('#gs').select(); }
});

/* ---------- Documentos imprimibles (demostración, sin validez fiscal) ---------- */
const EMPRESA = { nombre: 'AutoSelect Vega', cif: 'B-00000000 (ejemplo)', dir: 'Dirección de ejemplo · Madrid', tel: '900 000 000', email: 'ventas@autoselectvega.example', iban: 'ES00 0000 0000 0000 0000 0000 (ejemplo)' };
const PRINT_CSS = `@page { size: A4; margin: 16mm; } * { box-sizing: border-box; } body { font-family: "Segoe UI", Arial, sans-serif; color: #17202b; font-size: 12px; margin: 0; }
  .demo { text-align: center; font-size: 10px; letter-spacing: .12em; color: #b3261e; border: 1px dashed #b3261e; padding: 4px; margin-bottom: 10px; font-weight: 700; }
  .top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1f3a5a; padding-bottom: 12px; }
  .brand { display: flex; gap: 10px; align-items: center; } .logo { width: 44px; height: 44px; background: #d9902a; color: #0f1f33; font-weight: 800; display: grid; place-items: center; font-size: 17px; border-radius: 4px; }
  h1 { font-size: 24px; margin: 0; color: #1f3a5a; letter-spacing: .04em; } .muted { color: #6b7686; } .r { text-align: right; } .mono { font-family: Consolas, monospace; }
  .boxes { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 18px 0; } .box { border: 1px solid #d9dfe6; border-radius: 4px; padding: 10px 12px; line-height: 1.55; } .box h4 { margin: 0 0 6px; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #6b7686; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; } th { background: #f1f4f7; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: .05em; padding: 7px 8px; border-bottom: 1px solid #c9d1da; } td { padding: 8px; border-bottom: 1px solid #e3e8ee; vertical-align: top; }
  .tot { margin-left: auto; width: 300px; margin-top: 10px; } .tot td { border: 0; padding: 4px 8px; } .tot .big td { font-size: 16px; font-weight: 700; border-top: 2px solid #1f3a5a; padding-top: 8px; }
  .legal { margin-top: 22px; font-size: 10px; color: #4a5666; border-top: 1px solid #d9dfe6; padding-top: 10px; line-height: 1.6; }
  .ficha h1 { font-size: 40px; margin-top: 18px; } .ficha .ver { font-size: 16px; color: #4a5666; } .precio { font-size: 54px; font-weight: 800; color: #1f3a5a; margin: 10px 0 4px; }
  .specs { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid #d9dfe6; border-radius: 4px; margin-top: 20px; } .specs div { padding: 14px; border-right: 1px solid #d9dfe6; border-bottom: 1px solid #d9dfe6; } .specs div:nth-child(3n) { border-right: 0; }
  .specs span { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #6b7686; } .specs b { font-size: 18px; }
  .sello { display: inline-block; border: 2px solid #23774a; color: #23774a; font-weight: 700; padding: 6px 12px; border-radius: 4px; margin-top: 18px; font-size: 14px; }
  .pie { margin-top: 30px; font-size: 10px; color: #6b7686; border-top: 1px solid #d9dfe6; padding-top: 6px; display: flex; justify-content: space-between; }`;
function imprimir(titulo, body) {
  const fr = document.createElement('iframe');
  fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(fr);
  const d = fr.contentDocument;
  d.open();
  d.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${titulo}</title><style>${PRINT_CSS}</style></head><body><div class="demo">DOCUMENTO DE DEMOSTRACIÓN · DATOS FICTICIOS · SIN VALIDEZ FISCAL</div>${body}</body></html>`);
  d.close();
  setTimeout(() => { fr.contentWindow.focus(); fr.contentWindow.print(); setTimeout(() => fr.remove(), 2000); }, 300);
}
const cabecera = (der) => `<div class="top"><div class="brand"><div class="logo">AV</div><div><b style="font-size:15px">${EMPRESA.nombre}</b><div class="muted">CIF ${EMPRESA.cif} · ${EMPRESA.dir}</div><div class="muted">${EMPRESA.tel} · ${EMPRESA.email}</div></div></div><div class="r">${der}</div></div>`;
function imprimirFactura(id) {
  const v = venta(id), c = cliente(v.clienteId), car = coche(v.cocheId);
  if (!v.numFactura) return toast('Esta operación todavía no tiene factura.');
  imprimir(`Factura ${v.numFactura}`, `${cabecera(`<h1>FACTURA</h1><div class="mono" style="font-size:14px;margin-top:4px">${v.numFactura}</div><div class="muted">Fecha: ${fecha(v.fechaFactura)} · Vencimiento: ${fecha(v.vencimiento)}</div><div class="muted">Operación ${v.id}</div>`)}
    <div class="boxes"><div class="box"><h4>Cliente</h4><b>${esc(c.nombre)}</b><br>DNI/NIF: ${esc(c.dni)}<br>${esc(c.ciudad)}<br>${esc(c.telefono)} · ${esc(c.email)}<br><span class="muted mono">${c.id}</span></div>
      <div class="box"><h4>Vehículo</h4><b>${esc(car.marca)} ${esc(car.modelo)}</b> ${esc(car.version)}<br>Matrícula: <b>${esc(car.matricula)}</b> · Año ${car.anio}<br>Bastidor: <span class="mono">${esc(car.bastidor)}</span><br>${num(car.km)} km · ${esc(car.combustible)} · ${esc(car.cambio)} · ${esc(car.color)}<br><span class="muted mono">${car.id}</span></div></div>
    <table><thead><tr><th>Concepto</th><th class="r">Importe</th></tr></thead><tbody>
      <tr><td>Venta de vehículo de ocasión ${esc(car.marca)} ${esc(car.modelo)} ${esc(car.version)}, matrícula ${esc(car.matricula)}, con garantía de 12 meses.</td><td class="r">${eurC(v.precio)}</td></tr>
      <tr><td>Gestión de la transferencia de titularidad ante la DGT</td><td class="r">Incluida</td></tr></tbody></table>
    <table class="tot"><tbody><tr class="big"><td>Total factura</td><td class="r">${eurC(v.precio)}</td></tr>
      ${v.pagos.map((p) => `<tr><td class="muted">${esc(p.concepto)} · ${fecha(p.fecha)} · ${esc(p.metodo)}</td><td class="r muted">${p.importe > 0 ? '−' : '+'}${eurC(Math.abs(p.importe))}</td></tr>`).join('')}
      <tr><td><b>Pendiente de pago</b></td><td class="r"><b>${eurC(pendienteCobro(v))}</b></td></tr></tbody></table>
    <div class="legal"><b>Régimen especial de los bienes usados (REBU).</b> El IVA no se desglosa en la factura.<br>
      Forma de pago: transferencia bancaria a ${EMPRESA.iban} o tarjeta en tienda. Plazo de pago: ${PLAZO_PAGO} días desde la emisión.<br>
      El vehículo se entrega con garantía de 12 meses desde la fecha de entrega.</div>`);
}
function imprimirFicha(id) {
  const c = coche(id);
  const etiqueta = c.combustible === 'Eléctrico' || c.combustible === 'Híbrido enchufable' ? 'CERO' : c.combustible === 'Híbrido' ? 'ECO' : 'C';
  imprimir(`Ficha ${c.id}`, `<div class="ficha">${cabecera(`<div class="mono" style="font-size:14px">${c.id}</div><div class="muted">${esc(c.matricula)}</div>`)}
    <div style="text-align:center;margin-top:24px">${silueta(c, 520)}</div>
    <h1>${esc(c.marca)} ${esc(c.modelo)}</h1><div class="ver">${esc(c.version)}</div>
    <div class="precio">${eur(c.precioVenta)}</div><div class="muted">Precio final · Transferencia incluida · Pago por transferencia o tarjeta</div>
    <div class="specs"><div><span>Año</span><b>${c.anio}</b></div><div><span>Kilómetros</span><b>${num(c.km)} km</b></div><div><span>Combustible</span><b>${esc(c.combustible)}</b></div>
      <div><span>Cambio</span><b>${esc(c.cambio)}</b></div><div><span>Color</span><b>${esc(c.color)}</b></div><div><span>Etiqueta DGT</span><b>${etiqueta}</b></div></div>
    <div class="sello">Garantía 12 meses · Revisado y peritado</div>
    <div class="pie"><span>${EMPRESA.nombre} · ${EMPRESA.tel} · ${EMPRESA.email}</span><span>Reserva online con señal de ${eur(SENAL)}</span></div></div>`);
}

/* ---------- Calendario ---------- */
const TIPOS_EV = ['Cita', 'Prueba de conducción', 'Llamada', 'Entrega', 'Subasta', 'Recogida', 'Peritaje', 'Taller / ITV', 'Gestión', 'Reunión', 'Tarea'];
const PUESTOS_EV = [['Comercial', 'Comercial'], ['Comprador', 'Compras'], ['Financiero', 'Administración'], ['Todos', 'Todo el equipo']];
const NOMBRE_PUESTO = { Comercial: 'Comercial', Comprador: 'Compras', Financiero: 'Administración', Todos: 'Equipo' };
// Pagos y reuniones que se repiten: [día del mes, hora, título, puesto]
const RECURRENTES = [[1, '09:00', 'Pago alquiler de la nave', 'Financiero'], [2, '09:00', 'Cuota coches.net', 'Financiero'], [15, '12:00', 'Reunión con la gestoría', 'Financiero'],
  [28, '09:00', 'Pago de nóminas', 'Financiero'], [30, '09:00', 'Pago de seguros sociales', 'Financiero']];
let calFiltro = null;   // null = el del selector "Usuario"
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const atHora = (iso, h, m = 0) => { const d = new Date(iso); d.setHours(h, m, 0, 0); return d.toISOString(); };

function eventosRango(desde, hasta) {
  const out = [], inR = (iso) => { const t = new Date(iso); return t >= desde && t < hasta; };
  (db.eventos || []).forEach((e) => { if (inR(e.fecha)) out.push({ ...e, manual: true }); });
  db.ventas.forEach((v) => {
    const c = cliente(v.clienteId), car = coche(v.cocheId);
    if (!c || !car) return;
    if (['Reservado', 'Papeles'].includes(v.etapa) && v.entregaPrevista && inR(v.entregaPrevista))
      out.push({ auto: true, fecha: atHora(v.entregaPrevista, 12), titulo: `Entrega ${nombreCoche(car)} a ${c.nombre}`, tipo: 'Entrega', puesto: 'Comercial', act: 'venta', id: v.id });
    if (v.vencimiento && ['Pendiente de cobro', 'Vencida'].includes(estadoFin(v)) && inR(v.vencimiento))
      out.push({ auto: true, fecha: atHora(v.vencimiento, 9), titulo: `Vence factura ${v.numFactura} (${eur(pendienteCobro(v))})`, tipo: 'Gestión', puesto: 'Financiero', act: 'venta', id: v.id });
    if (v.etapa === 'Entregado' && v.garantiaHasta && inR(v.garantiaHasta))
      out.push({ auto: true, fecha: atHora(v.garantiaHasta, 10), titulo: `Fin de garantía: ${c.nombre} (${nombreCoche(car)})`, tipo: 'Llamada', puesto: 'Comercial', go: '#ficha/' + c.id });
  });
  db.coches.forEach((car) => {
    const f = new Date(car.fechaCompra);
    if (car.estado === 'En preparación') { const o = new Date(f.getTime() + 7 * DAY).toISOString(); if (inR(o)) out.push({ auto: true, fecha: atHora(o, 9), titulo: `Publicar ${nombreCoche(car)} (fin de preparación)`, tipo: 'Tarea', puesto: 'Comprador', act: 'editarCoche', id: car.id }); }
    if (car.estado === 'A la venta') { const o = new Date(f.getTime() + 45 * DAY).toISOString(); if (inR(o)) out.push({ auto: true, fecha: atHora(o, 9), titulo: `Revisar precio ${nombreCoche(car)} (45 días en stock)`, tipo: 'Tarea', puesto: 'Comprador', act: 'editarCoche', id: car.id }); }
  });
  db.gastos.filter((g) => g.estado === 'Pendiente').forEach((g) => {
    const o = new Date(new Date(g.fecha).getTime() + 10 * DAY).toISOString();
    if (inR(o)) out.push({ auto: true, fecha: atHora(o, 10), titulo: `Pagar a ${g.proveedor} (${eurC(g.importe)})`, tipo: 'Gestión', puesto: 'Financiero', act: 'gasto', id: g.id });
  });
  for (let d = new Date(desde); d < hasta; d = new Date(d.getTime() + DAY)) {
    const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    RECURRENTES.forEach(([dia, h, t, p]) => { if (d.getDate() === Math.min(dia, dim)) { const [hh, mm] = h.split(':'); const x = new Date(d); x.setHours(+hh, +mm, 0, 0); out.push({ auto: true, fecha: x.toISOString(), titulo: t, tipo: 'Gestión', puesto: p, info: true }); } });
    if (d.getDay() === 1) { const x = new Date(d); x.setHours(9, 0, 0, 0); out.push({ auto: true, fecha: x.toISOString(), titulo: 'Reunión semanal de equipo', tipo: 'Reunión', puesto: 'Todos', info: true }); }
  }
  const f = calFiltro || getSoy();
  return out.filter((e) => f === 'Todos' || e.puesto === f || e.puesto === 'Todos').sort((a, b) => a.fecha.localeCompare(b.fecha));
}
const evAttrs = (e) => e.manual ? `data-act="evento" data-id="${e.id}"` : e.go ? `data-go="${e.go}"` : e.act ? `data-act="${e.act}" data-id="${e.id}"` : `data-act="evInfo" data-id="${esc(e.titulo)}"`;
const hora = (iso) => new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

function vCalendario(param = '') {
  const agenda = param === 'agenda';
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const ref = /^\d{4}-\d{2}$/.test(param) ? new Date(+param.slice(0, 4), +param.slice(5) - 1, 1) : new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const mk = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const prev = mk(new Date(ref.getFullYear(), ref.getMonth() - 1, 1)), next = mk(new Date(ref.getFullYear(), ref.getMonth() + 1, 1));
  const f = calFiltro || getSoy();
  const head = `<div class="toolbar">
    <div class="seg"><a href="#calendario/${agenda ? '' : mk(ref)}" class="${agenda ? '' : 'on'}">Mes</a><a href="#calendario/agenda" class="${agenda ? 'on' : ''}">Agenda</a></div>
    ${agenda ? '' : `<div class="seg"><a href="#calendario/${prev}" title="Mes anterior">${icon('left')}</a><a href="#calendario/${mk(hoy)}">Hoy</a><a href="#calendario/${next}" title="Mes siguiente">${icon('right')}</a></div>
    <strong style="font-size:16px;min-width:150px">${(() => { const t = ref.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }); return t[0].toUpperCase() + t.slice(1); })()}</strong>`}
    <div class="chips">${[['Todos', 'Todos'], ...PUESTOS_EV.slice(0, 3)].map(([k, l]) => `<button type="button" class="chip ${f === k ? 'on' : ''} p-${k}" data-act="calFiltro" data-id="${k}">${l}</button>`).join('')}</div>
    <span style="flex:1"></span>
    <button type="button" class="btn" data-act="nuevoEvento" data-id="${dayKey(hoy)}">${icon('plus')} Nuevo evento</button>
  </div>`;
  if (agenda) {
    const evs = eventosRango(new Date(hoy.getTime() - 7 * DAY), new Date(hoy.getTime() + 21 * DAY));
    const atras = evs.filter((e) => e.manual && !e.hecho && new Date(e.fecha) < hoy);
    const futuros = evs.filter((e) => new Date(e.fecha) >= hoy);
    const dias = {};
    futuros.forEach((e) => { const k = dayKey(new Date(e.fecha)); (dias[k] = dias[k] || []).push(e); });
    const fila = (e) => `<div class="ag-ev p-${e.puesto} ${e.hecho ? 'done' : ''}">
      ${e.manual ? `<input type="checkbox" ${e.hecho ? 'checked' : ''} data-act="evHecho" data-id="${e.id}" title="Marcar como hecho">` : `<span class="auto" title="Generado automáticamente">auto</span>`}
      <span class="h num">${hora(e.fecha)}</span><button type="button" class="ag-t" ${evAttrs(e)}><b>${esc(e.titulo)}</b><small>${esc(e.tipo)}${e.clienteId ? ' · ' + esc(cliente(e.clienteId)?.nombre || '') : ''}${e.cocheId ? ' · ' + esc(coche(e.cocheId)?.matricula || '') : ''}</small></button>
      <span class="who-b p-${e.puesto}">${NOMBRE_PUESTO[e.puesto]}</span></div>`;
    return head + (atras.length ? `<div class="card" style="margin-bottom:16px;border-left:3px solid var(--bad)"><div class="card-head"><h3>${icon('alert')} Atrasados sin hacer</h3><span class="small muted">${atras.length}</span></div>${atras.map((e) => `<div class="ag-day-row">${fila(e).replace('<span class="h num">', `<span class="h num" style="color:var(--bad)">${fecha(e.fecha)} `)}</div>`).join('')}</div>` : '')
      + `<div class="card">${Object.entries(dias).map(([k, l]) => { const d = new Date(k + 'T12:00:00'); const n = Math.floor((d - hoy) / DAY);
        return `<div class="ag-day"><div class="ag-date ${n === 0 ? 'today' : ''}"><b>${d.getDate()}</b><span>${d.toLocaleDateString('es-ES', { weekday: 'long' })} · ${d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')}</span><small>${n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : ''}</small></div><div class="ag-list">${l.map(fila).join('')}</div></div>`; }).join('') || '<div class="empty">Sin eventos en las próximas 3 semanas.</div>'}</div>`;
  }
  const ini = new Date(ref); ini.setDate(1 - ((ref.getDay() + 6) % 7));
  const fin = new Date(ini.getTime() + 42 * DAY);
  const evs = eventosRango(ini, fin), porDia = {};
  evs.forEach((e) => { const k = dayKey(new Date(e.fecha)); (porDia[k] = porDia[k] || []).push(e); });
  let cells = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(ini.getFullYear(), ini.getMonth(), ini.getDate() + i), k = dayKey(d), l = porDia[k] || [];
    cells += `<div class="cal-d ${d.getMonth() !== ref.getMonth() ? 'out' : ''} ${k === dayKey(hoy) ? 'today' : ''} ${d.getDay() % 6 === 0 ? 'we' : ''}" data-act="nuevoEvento" data-id="${k}">
      <div class="cal-n">${d.getDate()}</div>
      ${l.slice(0, 3).map((e) => `<button type="button" class="cal-e p-${e.puesto} ${e.hecho ? 'done' : ''} ${e.auto ? 'is-auto' : ''}" ${evAttrs(e)} title="${hora(e.fecha)} · ${esc(e.titulo)} · ${NOMBRE_PUESTO[e.puesto]}"><span class="num">${hora(e.fecha)}</span> ${esc(e.titulo)}</button>`).join('')}
      ${l.length > 3 ? `<button type="button" class="cal-more" data-act="calDia" data-id="${k}">+${l.length - 3} más</button>` : ''}</div>`;
  }
  return head + `<div class="card cal"><div class="cal-h">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => `<div>${d}</div>`).join('')}</div><div class="cal-g">${cells}</div></div>
    <div class="legend" style="margin-top:10px">${PUESTOS_EV.map(([k, l]) => `<span><i class="p-${k}"></i>${l}</span>`).join('')}<span class="muted">Borde discontinuo: generado automáticamente desde ventas, facturas, stock y pagos · Pulsa un día para crear un evento</span></div>`;
}
function calDia(k) {
  const d = new Date(k + 'T00:00:00'), l = eventosRango(d, new Date(d.getTime() + DAY));
  modal({ title: d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }), sub: `${l.length} evento(s)`,
    body: `<div class="checklist">${l.map((e) => `<label style="justify-content:space-between"><span><span class="num">${hora(e.fecha)}</span> · <button type="button" class="linkbtn" ${evAttrs(e)}>${esc(e.titulo)}</button></span><span class="who-b p-${e.puesto}">${NOMBRE_PUESTO[e.puesto]}</span></label>`).join('')}</div>`,
    extra: `<button type="button" class="btn ghost" data-act="nuevoEvento" data-id="${k}">${icon('plus')} Nuevo evento</button>` });
}
function formEvento(e, diaK) {
  const nuevo = !e, soy = getSoy();
  const d0 = e || { titulo: '', tipo: 'Cita', puesto: soy === 'Todos' ? 'Comercial' : soy, fecha: new Date((diaK || dayKey(new Date())) + 'T10:00:00').toISOString(), clienteId: '', cocheId: '', notas: '', hecho: false };
  const clientesOpt = db.clientes.slice().sort((a, b) => a.nombre.localeCompare(b.nombre)).map((c) => [c.id, `${c.nombre} · ${c.id}`]);
  const cochesOpt = db.coches.filter((c) => c.estado !== 'Vendido' || c.id === d0.cocheId).map((c) => [c.id, `${c.id} · ${c.marca} ${c.modelo} · ${c.matricula}`]);
  modal({
    title: nuevo ? 'Nuevo evento' : `Evento ${e.id}`, sub: nuevo ? `Se asignará el nº ${nextId('EV-', db.eventos)}` : (e.hecho ? 'Hecho' : 'Pendiente'),
    body: `<div class="fields">
      <label class="full">Qué hay que hacer *<input name="titulo" required value="${esc(d0.titulo)}" placeholder="Ej.: Prueba de conducción con el cliente"></label>
      <label>Tipo<select name="tipo">${opt(TIPOS_EV, d0.tipo)}</select></label>
      <label>Responsable<select name="puesto">${opt(PUESTOS_EV, d0.puesto)}</select></label>
      <label>Fecha *<input name="fecha" type="date" required value="${dayKey(new Date(d0.fecha))}"></label>
      <label>Hora<input name="hora" type="time" value="${hora(d0.fecha)}" step="900"></label>
      <label>Cliente<select name="clienteId"><option value="">Ninguno</option>${opt(clientesOpt, d0.clienteId)}</select></label>
      <label>Vehículo<select name="cocheId"><option value="">Ninguno</option>${opt(cochesOpt, d0.cocheId)}</select></label>
      <label class="full">Notas<textarea name="notas">${esc(d0.notas)}</textarea></label>
      ${nuevo ? '' : `<label class="full" style="flex-direction:row;align-items:center;gap:8px;font-weight:500;color:var(--text);font-size:14px"><input type="checkbox" name="hecho" ${d0.hecho ? 'checked' : ''} style="width:16px;height:16px;box-shadow:none"> Hecho</label>`}</div>`,
    extra: nuevo ? '' : `<button type="button" class="btn danger" data-act="borrarEvento" data-id="${e.id}" title="Eliminar">${icon('trash')}</button>`,
    onSubmit: (d) => {
      if (!d.titulo.trim()) return 'Indica qué hay que hacer.';
      if (!d.fecha) return 'Indica la fecha.';
      const fe = new Date(`${d.fecha}T${d.hora || '10:00'}:00`).toISOString();
      const choque = db.eventos.find((x) => x !== e && !x.hecho && x.fecha === fe && (x.puesto === d.puesto || x.puesto === 'Todos' || d.puesto === 'Todos'));
      if (choque) return `${NOMBRE_PUESTO[d.puesto]} ya tiene "${choque.titulo}" (${choque.id}) a esa hora.`;
      const vals = { titulo: d.titulo.trim(), tipo: d.tipo, puesto: d.puesto, fecha: fe, clienteId: d.clienteId || null, cocheId: d.cocheId || null, notas: d.notas.trim(), hecho: nuevo ? false : d.hecho === 'on' };
      if (nuevo) { const id = nextId('EV-', db.eventos); db.eventos.push({ id, ...vals }); log([id, vals.clienteId, vals.cocheId], `Evento programado: ${vals.titulo} (${fecha(fe)} ${hora(fe)}, ${NOMBRE_PUESTO[vals.puesto]})`); toast(`Evento ${id} creado.`); }
      else { log([e.id, vals.clienteId, vals.cocheId], `Evento modificado: ${vals.titulo}`); Object.assign(e, vals); toast(`${e.id} actualizado.`); }
    },
  });
}
async function borrarEvento(id) {
  const e = db.eventos.find((x) => x.id === id);
  if (!await preguntar({ title: `Eliminar evento ${id}`, text: `${esc(e.titulo)} · ${fecha(e.fecha)} ${hora(e.fecha)}`, ok: 'Eliminar', danger: true })) return;
  db.eventos = db.eventos.filter((x) => x.id !== id);
  log([id], `Evento eliminado: ${e.titulo}`);
  $('#modal').close();
  done(`Evento ${id} eliminado.`);
}
function evHecho(id) {
  const e = db.eventos.find((x) => x.id === id);
  e.hecho = !e.hecho;
  log([id, e.clienteId, e.cocheId], `${e.hecho ? 'Hecho' : 'Reabierto'}: ${e.titulo}`);
  done(e.hecho ? `Hecho: ${e.titulo}` : `Reabierto: ${e.titulo}`);
}

/* ---------- Eventos ---------- */
document.addEventListener('click', (e) => {
  if (ignoreClick) { e.stopPropagation(); return; }
  if (e.target.closest('#undoBtn')) { deshacer(); return; }
  if (e.target.closest('[data-close-go]')) { $('#modal').close(); return; }
  const act = e.target.closest('[data-act]');
  if (act) {
    e.stopPropagation();
    const id = act.dataset.id;
    if (!['msort', 'mall', 'csv', 'calFiltro', 'calDia', 'evInfo'].includes(act.dataset.act)) snap = JSON.stringify(db);
    const A = {
      factura: () => imprimirFactura(id), escaparate: () => imprimirFicha(id),
      evento: () => formEvento(db.eventos.find((x) => x.id === id)), nuevoEvento: () => formEvento(null, id), borrarEvento: () => borrarEvento(id), evHecho: () => evHecho(id),
      calDia: () => calDia(id), calFiltro: () => { calFiltro = id; render(); }, evInfo: () => toast(`${id}: evento periódico del calendario.`),
      contacto: () => formContacto(id), venta: () => formVenta(id), reservar: () => reservar(id), facturar: () => facturar(id), entregar: () => entregar(id),
      perder: () => perder(id), borrarVenta: () => borrarVenta(id), publicar: () => { coche(id).estado = 'A la venta'; log([id], 'Publicado a la venta'); done(`${id} publicado a la venta.`); },
      nuevoCliente: () => formCliente(), editarCliente: () => formCliente(cliente(id)), borrarCliente: () => borrarCliente(id), nuevaVenta: () => formNuevaVenta(id),
      nuevoCoche: () => formCoche(), editarCoche: () => formCoche(coche(id)), borrarCoche: () => borrarCoche(id), csv: () => exportar(id), cobro: () => formCobro(id), recordatorio: () => recordatorio(id),
      mall: () => { mSort[id + '_all'] = !mSort[id + '_all']; render(); },
      msort: () => { const [t, k] = id.split(':'); const cur = mSort[t] || { k: 'eurDia', dir: -1 }; mSort[t] = { k, dir: cur.k === k ? -cur.dir : (k === 'k' || k === 'dias' ? 1 : -1) }; render(); },
      gasto: () => formGasto(gastoById(id)), nuevoGasto: () => formGasto(), pagarGasto: () => pagarGasto(id), borrarGasto: () => borrarGasto(id),
    };
    return A[act.dataset.act]?.();
  }
  const go = e.target.closest('[data-go]');
  if (go) location.hash = go.dataset.go;
});

document.addEventListener('input', (e) => {
  const k = { fq: 'q', forigen: 'origen', festado: 'estado', cq: 'cq', cestado: 'cestado', vq: 'vq', vetapa: 'vetapa', fq2: 'fq2', gq: 'gq', gcat: 'gcat', gest: 'gest', gmes: 'gmes' }[e.target.id];
  if (!k) return;
  filtros[k] = e.target.value;
  const pos = e.target.selectionStart;
  render();
  const el = document.getElementById(e.target.id);
  el.focus();
  if (el.type === 'search' && pos != null) el.setSelectionRange(pos, pos);
});

$('#today').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
$('#btnReset').innerHTML = `${icon('reset')} Restaurar datos de ejemplo`;
$('#soy').value = getSoy();
$('#soy').addEventListener('change', (e) => { pref('soy', e.target.value); calFiltro = null; render(); });
$('#btnReset').addEventListener('click', async () => {
  snap = JSON.stringify(db);
  if (!await preguntar({ title: 'Restaurar datos de ejemplo', text: 'Se perderán los cambios hechos en este navegador.', ok: 'Restaurar', danger: true })) return;
  db = buildSeed(); location.hash = '#panel'; done('Datos de ejemplo restaurados.');
});
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
render();
