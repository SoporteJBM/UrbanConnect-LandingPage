/* Datos y funciones principales del módulo de pagos. */

var CLAVE_CUOTAS = "uc_pagos_cuotas";
var CLAVE_VOUCHERS = "uc_pagos_vouchers";

var cuotasIniciales = [
  { id: "C-2026-061", resident: "María Gómez", apartment: "Torre B · 210", concept: "Mantenimiento junio", amount: 1250, dueDate: "2026-06-20", status: "Pendiente", email: "maria.gomez@correo.pe" },
  { id: "C-2026-062", resident: "Carlos Rivas", apartment: "Torre A · 118", concept: "Fondo de reparación", amount: 850, dueDate: "2026-06-10", status: "Vencido", email: "carlos.rivas@correo.pe" },
  { id: "C-2026-063", resident: "Lucía Torres", apartment: "Torre C · 502", concept: "Mantenimiento junio", amount: 1250, dueDate: "2026-06-20", status: "Pagado", email: "lucia.torres@correo.pe", paidAt: "2026-06-08T17:18:00", receipt: "REC-202606-063" },
  { id: "C-2026-064", resident: "Andrés Molina", apartment: "Torre B · 407", concept: "Convenio de pago", amount: 1800, dueDate: "2026-06-25", status: "Pendiente", email: "andres.molina@correo.pe" },
  { id: "C-2026-065", resident: "Rosa Medina", apartment: "Torre A · 305", concept: "Mantenimiento mayo", amount: 1250, dueDate: "2026-05-20", status: "Vencido", email: "rosa.medina@correo.pe" }
];

var vouchersIniciales = [
  { id: "VCH-1042", feeId: "C-2026-061", resident: "María Gómez", apartment: "Torre B · 210", amount: 1250, date: "2026-06-18", bank: "Banco Continental", operation: "OP-882714", status: "Pendiente" },
  { id: "VCH-1041", feeId: null, resident: "Diego Salas", apartment: "Torre C · 401", amount: 1250, date: "2026-06-17", bank: "Interbank", operation: "OP-340091", status: "Aprobado" },
  { id: "VCH-1040", feeId: null, resident: "Ana Vera", apartment: "Torre A · 204", amount: 900, date: "2026-06-16", bank: "BCP", operation: "OP-771205", status: "Rechazado" }
];

var gastos = [
  { id: "GST-031", date: "2026-06-15", supplier: "Elevatec Perú", concept: "Mantenimiento preventivo de ascensores", amount: 2800, receipt: "FAC-E001-1842" },
  { id: "GST-030", date: "2026-06-11", supplier: "Limpio Hogar SAC", concept: "Servicio de limpieza de áreas comunes", amount: 1450, receipt: "FAC-F002-0918" },
  { id: "GST-029", date: "2026-06-06", supplier: "Luz Segura", concept: "Reemplazo de luminarias del estacionamiento", amount: 760, receipt: "BOL-B001-4420" }
];

var cuotas = cargarDatos(CLAVE_CUOTAS, cuotasIniciales);
var vouchers = cargarDatos(CLAVE_VOUCHERS, vouchersIniciales);
var ultimoBoton = null;
var temporizadorMensaje = null;

function cargarDatos(clave, datosIniciales) {
  var textoGuardado = localStorage.getItem(clave);

  if (textoGuardado !== null) {
    try {
      var datosGuardados = JSON.parse(textoGuardado);
      if (Array.isArray(datosGuardados)) {
        return datosGuardados;
      }
    } catch (error) {
      console.log("No fue posible leer " + clave);
    }
  }

  localStorage.setItem(clave, JSON.stringify(datosIniciales));
  return datosIniciales;
}

function guardarDatos() {
  localStorage.setItem(CLAVE_CUOTAS, JSON.stringify(cuotas));
  localStorage.setItem(CLAVE_VOUCHERS, JSON.stringify(vouchers));
}

function escaparTexto(texto) {
  var elemento = document.createElement("div");
  elemento.textContent = texto;
  return elemento.innerHTML;
}

function formatearMonto(monto) {
  return "S/ " + Number(monto).toFixed(2);
}

function formatearFecha(fecha) {
  var partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function crearEstado(estado) {
  return '<span class="status status-' + estado.toLowerCase() + '">' + escaparTexto(estado) + "</span>";
}

function buscarCuota(id) {
  for (var i = 0; i < cuotas.length; i++) {
    if (cuotas[i].id === id) {
      return cuotas[i];
    }
  }
  return null;
}

function buscarVoucher(id) {
  for (var i = 0; i < vouchers.length; i++) {
    if (vouchers[i].id === id) {
      return vouchers[i];
    }
  }
  return null;
}

function buscarGasto(id) {
  for (var i = 0; i < gastos.length; i++) {
    if (gastos[i].id === id) {
      return gastos[i];
    }
  }
  return null;
}

function mostrarResumen() {
  var pagadas = 0;
  var pendientes = 0;
  var vencidas = 0;
  var vouchersPendientes = 0;

  for (var i = 0; i < cuotas.length; i++) {
    if (cuotas[i].status === "Pagado") pagadas++;
    if (cuotas[i].status === "Pendiente") pendientes++;
    if (cuotas[i].status === "Vencido") vencidas++;
  }

  for (var j = 0; j < vouchers.length; j++) {
    if (vouchers[j].status === "Pendiente") vouchersPendientes++;
  }

  document.getElementById("statPaid").textContent = pagadas;
  document.getElementById("statPending").textContent = pendientes;
  document.getElementById("statOverdue").textContent = vencidas;
  document.getElementById("statVouchers").textContent = vouchersPendientes;
}

function mostrarCuotas() {
  var cuerpo = document.getElementById("feesBody");
  var filas = "";

  for (var i = 0; i < cuotas.length; i++) {
    var cuota = cuotas[i];
    var accion = "";

    if (cuota.status === "Pagado") {
      accion = '<button class="btn" data-receipt="' + cuota.id + '">Ver recibo</button>';
    } else {
      accion = '<button class="btn btn-primary" data-pay="' + cuota.id + '">Pagar cuota</button>';
    }

    filas += "<tr>";
    filas += "<td><strong>" + escaparTexto(cuota.resident) + "</strong><small>" + escaparTexto(cuota.id) + "</small></td>";
    filas += "<td>" + escaparTexto(cuota.apartment) + "</td>";
    filas += "<td>" + escaparTexto(cuota.concept) + "</td>";
    filas += "<td><strong>" + formatearMonto(cuota.amount) + "</strong></td>";
    filas += "<td>" + formatearFecha(cuota.dueDate) + "</td>";
    filas += "<td>" + crearEstado(cuota.status) + "</td>";
    filas += '<td><div class="actions">' + accion + "</div></td>";
    filas += "</tr>";
  }

  cuerpo.innerHTML = filas;
}

function mostrarMorosos() {
  var filtro = document.getElementById("debtorFilter").value;
  var cuerpo = document.getElementById("debtorsBody");
  var filas = "";
  var cantidad = 0;

  for (var i = 0; i < cuotas.length; i++) {
    var cuota = cuotas[i];
    var esMoroso = cuota.status !== "Pagado";
    var cumpleFiltro = filtro === "Todos" || cuota.status === filtro;

    if (esMoroso && cumpleFiltro) {
      filas += "<tr>";
      filas += "<td><strong>" + escaparTexto(cuota.resident) + "</strong><small>" + escaparTexto(cuota.id) + "</small></td>";
      filas += "<td>" + escaparTexto(cuota.apartment) + "</td>";
      filas += "<td><strong>" + formatearMonto(cuota.amount) + "</strong></td>";
      filas += "<td>" + crearEstado(cuota.status) + "</td>";
      filas += "<td>" + escaparTexto(cuota.email) + "</td>";
      filas += '<td><button class="btn btn-primary" data-remind="' + cuota.id + '">Enviar recordatorio</button></td>';
      filas += "</tr>";
      cantidad++;
    }
  }

  if (cantidad === 0) {
    filas = '<tr><td colspan="6" class="empty-state">No hay morosos con el estado seleccionado.</td></tr>';
  }

  cuerpo.innerHTML = filas;
}

function mostrarGastos() {
  var filas = "";

  for (var i = 0; i < gastos.length; i++) {
    var gasto = gastos[i];
    filas += "<tr>";
    filas += "<td>" + formatearFecha(gasto.date) + "</td>";
    filas += "<td><strong>" + escaparTexto(gasto.supplier) + "</strong></td>";
    filas += "<td>" + escaparTexto(gasto.concept) + "</td>";
    filas += "<td><strong>" + formatearMonto(gasto.amount) + "</strong></td>";
    filas += '<td><button class="btn" data-proof="' + gasto.id + '">Ver comprobante</button></td>';
    filas += "</tr>";
  }

  document.getElementById("expensesBody").innerHTML = filas;
}

function mostrarVouchers() {
  var filas = "";

  for (var i = 0; i < vouchers.length; i++) {
    var voucher = vouchers[i];
    var acciones = "Revisado";

    if (voucher.status === "Pendiente") {
      acciones = '<button class="btn btn-primary" data-voucher="' + voucher.id + '" data-decision="Aprobado">Aprobar</button>';
      acciones += '<button class="btn btn-danger" data-voucher="' + voucher.id + '" data-decision="Rechazado">Rechazar</button>';
    }

    filas += "<tr>";
    filas += "<td><strong>" + escaparTexto(voucher.id) + "</strong><small>" + escaparTexto(voucher.operation) + "</small></td>";
    filas += "<td>" + escaparTexto(voucher.resident) + "</td>";
    filas += "<td>" + escaparTexto(voucher.apartment) + "</td>";
    filas += "<td><strong>" + formatearMonto(voucher.amount) + "</strong></td>";
    filas += "<td>" + formatearFecha(voucher.date) + "</td>";
    filas += "<td>" + crearEstado(voucher.status) + "</td>";
    filas += '<td><div class="actions">' + acciones + "</div></td>";
    filas += "</tr>";
  }

  document.getElementById("vouchersBody").innerHTML = filas;
}

function actualizarPantalla() {
  mostrarResumen();
  mostrarCuotas();
  mostrarMorosos();
  mostrarGastos();
  mostrarVouchers();
}

function mostrarMensaje(texto) {
  var mensaje = document.getElementById("toast");
  mensaje.textContent = texto;
  mensaje.classList.add("show");

  clearTimeout(temporizadorMensaje);
  temporizadorMensaje = setTimeout(function () {
    mensaje.classList.remove("show");
  }, 3200);
}

function abrirModal(contenido, boton) {
  ultimoBoton = boton;
  document.getElementById("modalContent").innerHTML = contenido;
  document.getElementById("modal").hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector(".modal-close").focus();
}

function cerrarModal() {
  document.getElementById("modal").hidden = true;
  document.body.style.overflow = "";

  if (ultimoBoton !== null) {
    ultimoBoton.focus();
  }
}

function crearRecibo(cuota) {
  var fechaPago = "Registro histórico";

  if (cuota.paidAt) {
    fechaPago = new Date(cuota.paidAt).toLocaleString("es-PE");
  }

  var contenido = '<p class="eyebrow">Recibo digital</p>';
  contenido += '<h2 id="modalTitle">Pago confirmado</h2>';
  contenido += '<div class="receipt">';
  contenido += '<div class="receipt-brand">urbanConnect</div>';
  contenido += '<div class="receipt-row"><span>N.º de recibo</span><strong>' + escaparTexto(cuota.receipt || "REC-" + cuota.id) + "</strong></div>";
  contenido += '<div class="receipt-row"><span>Residente</span><strong>' + escaparTexto(cuota.resident) + "</strong></div>";
  contenido += '<div class="receipt-row"><span>Departamento</span><strong>' + escaparTexto(cuota.apartment) + "</strong></div>";
  contenido += '<div class="receipt-row"><span>Concepto</span><strong>' + escaparTexto(cuota.concept) + "</strong></div>";
  contenido += '<div class="receipt-row"><span>Fecha de pago</span><strong>' + escaparTexto(fechaPago) + "</strong></div>";
  contenido += '<div class="receipt-row receipt-total"><span>Total pagado</span><strong>' + formatearMonto(cuota.amount) + "</strong></div>";
  contenido += "</div>";
  contenido += '<div class="modal-actions"><button class="btn" data-close-modal>Cerrar</button><button class="btn btn-primary" data-print>Imprimir recibo</button></div>';
  return contenido;
}

function pagarCuota(id, boton) {
  var cuota = buscarCuota(id);

  if (cuota === null || cuota.status === "Pagado") return;

  cuota.status = "Pagado";
  cuota.paidAt = new Date().toISOString();
  cuota.receipt = "REC-" + new Date().getTime();

  guardarDatos();
  actualizarPantalla();
  abrirModal(crearRecibo(cuota), boton);
  mostrarMensaje("Cuota pagada y recibo digital generado.");
}

function mostrarComprobante(id, boton) {
  var gasto = buscarGasto(id);
  if (gasto === null) return;

  var contenido = '<div class="proof">';
  contenido += '<div class="proof-mark" aria-hidden="true">▤</div>';
  contenido += '<p class="eyebrow">Comprobante simulado</p>';
  contenido += '<h2 id="modalTitle">' + escaparTexto(gasto.receipt) + "</h2>";
  contenido += "<p><strong>" + escaparTexto(gasto.supplier) + "</strong></p>";
  contenido += "<p>" + escaparTexto(gasto.concept) + "</p>";
  contenido += '<p class="receipt-total">' + formatearMonto(gasto.amount) + "</p>";
  contenido += "<p>" + formatearFecha(gasto.date) + "</p>";
  contenido += '<div class="proof-code">Validación: UC-' + escaparTexto(gasto.id) + "-OK</div>";
  contenido += "</div>";
  contenido += '<div class="modal-actions"><button class="btn btn-primary" data-close-modal>Cerrar comprobante</button></div>';

  abrirModal(contenido, boton);
}

function revisarVoucher(id, decision) {
  var voucher = buscarVoucher(id);
  if (voucher === null || voucher.status !== "Pendiente") return;

  voucher.status = decision;
  voucher.reviewedAt = new Date().toISOString();

  if (decision === "Aprobado" && voucher.feeId !== null) {
    var cuota = buscarCuota(voucher.feeId);
    if (cuota !== null) {
      cuota.status = "Pagado";
      cuota.paidAt = voucher.reviewedAt;
      cuota.receipt = "REC-" + voucher.id;
    }
  }

  guardarDatos();
  actualizarPantalla();
  mostrarMensaje("Voucher " + decision.toLowerCase() + " correctamente.");
}

function cambiarSeccion(boton) {
  var botones = document.querySelectorAll(".section-tab");
  var secciones = document.querySelectorAll(".module-section");
  var destino = boton.getAttribute("data-target");

  for (var i = 0; i < botones.length; i++) {
    botones[i].classList.remove("active");
  }
  boton.classList.add("active");

  for (var j = 0; j < secciones.length; j++) {
    if (secciones[j].id === destino) {
      secciones[j].hidden = false;
      secciones[j].classList.add("active");
    } else {
      secciones[j].hidden = true;
      secciones[j].classList.remove("active");
    }
  }
}

document.addEventListener("click", function (evento) {
  var boton = evento.target.closest("button");
  if (boton === null) return;

  if (boton.hasAttribute("data-target")) {
    cambiarSeccion(boton);
  }

  if (boton.hasAttribute("data-pay")) {
    pagarCuota(boton.getAttribute("data-pay"), boton);
  }

  if (boton.hasAttribute("data-receipt")) {
    var cuota = buscarCuota(boton.getAttribute("data-receipt"));
    if (cuota !== null) abrirModal(crearRecibo(cuota), boton);
  }

  if (boton.hasAttribute("data-remind")) {
    var moroso = buscarCuota(boton.getAttribute("data-remind"));
    if (moroso !== null) {
      mostrarMensaje("Recordatorio enviado a " + moroso.resident + " (" + moroso.email + ").");
    }
  }

  if (boton.hasAttribute("data-proof")) {
    mostrarComprobante(boton.getAttribute("data-proof"), boton);
  }

  if (boton.hasAttribute("data-voucher")) {
    revisarVoucher(boton.getAttribute("data-voucher"), boton.getAttribute("data-decision"));
  }

  if (boton.hasAttribute("data-close-modal")) {
    cerrarModal();
  }

  if (boton.hasAttribute("data-print")) {
    window.print();
  }
});

document.getElementById("debtorFilter").addEventListener("change", function () {
  mostrarMorosos();
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && document.getElementById("modal").hidden === false) {
    cerrarModal();
  }
});

actualizarPantalla();
