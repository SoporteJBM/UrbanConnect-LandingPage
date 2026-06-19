var CLAVE_REPORTES = "uc_reportes_tickets";
var tickets = [];

document.addEventListener("DOMContentLoaded", iniciarReportes);

function iniciarReportes() {
  tickets = cargarTickets();

  prepararModal();
  prepararFiltrosDeReportes();
  prepararAccionesDeTickets();
  mostrarTickets();
}

function cargarTickets() {
  var guardados = localStorage.getItem(CLAVE_REPORTES);

  if (guardados !== null) {
    try {
      var datos = JSON.parse(guardados);

      if (Array.isArray(datos)) {
        return datos;
      }
    } catch (error) {
      // Si los datos están dañados, se restauran los tickets de ejemplo.
    }

    localStorage.removeItem(CLAVE_REPORTES);
  }

  var iniciales = crearTicketsIniciales();
  localStorage.setItem(CLAVE_REPORTES, JSON.stringify(iniciales));
  return iniciales;
}

function crearTicketsIniciales() {
  return [
    {
      id: "R-2026-045",
      title: "Falla en el elevador principal",
      category: "Mantenimiento",
      description: "El elevador se detiene entre pisos y tarda en responder.",
      location: "Torre A - Piso 3",
      urgency: "Alta",
      photo: "elevador.jpg",
      assignedTo: "Carlos Mena",
      evidenceBefore: "revision-inicial.jpg",
      evidenceAfter: "",
      status: "En proceso",
      createdAt: "2026-06-18T10:30:00"
    },
    {
      id: "R-2026-044",
      title: "Luminaria del estacionamiento apagada",
      category: "Alumbrado",
      description: "La lámpara del poste no enciende desde hace tres días.",
      location: "Estacionamiento",
      urgency: "Media",
      photo: "luminaria.jpg",
      assignedTo: "",
      evidenceBefore: "",
      evidenceAfter: "",
      status: "Pendiente",
      createdAt: "2026-06-17T20:15:00"
    },
    {
      id: "R-2026-043",
      title: "Fuga de agua en área común",
      category: "Plomería",
      description: "Hay una fuga de agua cerca de la entrada principal.",
      location: "Jardín principal",
      urgency: "Alta",
      photo: "fuga.jpg",
      assignedTo: "María López",
      evidenceBefore: "fuga-antes.jpg",
      evidenceAfter: "fuga-despues.jpg",
      status: "Resuelto",
      createdAt: "2026-06-16T16:40:00"
    }
  ];
}

function guardarTickets() {
  localStorage.setItem(CLAVE_REPORTES, JSON.stringify(tickets));
}

function prepararModal() {
  var modal = document.getElementById("reportModal");
  var formulario = document.getElementById("newReportForm");
  var botonesAbrir = document.querySelectorAll(
    ".open-report-modal, #openReportModalQuick"
  );

  for (var i = 0; i < botonesAbrir.length; i++) {
    botonesAbrir[i].addEventListener("click", function () {
      abrirModal(modal);
    });
  }

  document.getElementById("closeReportModal").addEventListener("click", function () {
    cerrarModal(modal, formulario);
  });

  document.getElementById("cancelReportModal").addEventListener("click", function () {
    cerrarModal(modal, formulario);
  });

  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
      cerrarModal(modal, formulario);
    }
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && modal.classList.contains("active")) {
      cerrarModal(modal, formulario);
    }
  });

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    crearTicket();
    cerrarModal(modal, formulario);
  });
}

function abrirModal(modal) {
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.getElementById("reportTitle").focus();
}

function cerrarModal(modal, formulario) {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  formulario.reset();
}

function crearTicket() {
  var foto = document.getElementById("reportImage");
  var nombreFoto = foto.files.length > 0 ? foto.files[0].name : "foto-simulada.jpg";

  var ticket = {
    id: "R-" + Date.now(),
    title: document.getElementById("reportTitle").value.trim(),
    category: document.getElementById("reportCategory").value,
    description: document.getElementById("reportDescription").value.trim(),
    location: document.getElementById("reportLocation").value.trim() || "Sin ubicación",
    urgency: document.getElementById("reportPriority").value,
    photo: nombreFoto,
    assignedTo: "",
    evidenceBefore: "",
    evidenceAfter: "",
    status: "Pendiente",
    createdAt: new Date().toISOString()
  };

  tickets.unshift(ticket);
  guardarTickets();
  mostrarTickets();
  mostrarMensaje("Ticket " + ticket.id + " creado correctamente.", false);
}

function prepararFiltrosDeReportes() {
  var pestanas = document.querySelectorAll(".reports-panel .tab");

  for (var i = 0; i < pestanas.length; i++) {
    pestanas[i].addEventListener("click", mostrarTickets);
  }

  document.getElementById("reportSearch").addEventListener("input", mostrarTickets);
  document.getElementById("categoryFilter").addEventListener("change", mostrarTickets);
  document.getElementById("statusFilter").addEventListener("change", mostrarTickets);
  document.getElementById("ticketSort").addEventListener("change", mostrarTickets);
}

function prepararAccionesDeTickets() {
  document.getElementById("reportList").addEventListener("click", function (evento) {
    var accion = evento.target.getAttribute("data-action");

    if (accion === null) {
      return;
    }

    var id = evento.target.getAttribute("data-ticket-id");

    if (accion === "assign") {
      asignarTicket(id);
    }

    if (accion === "evidence") {
      guardarEvidencias(id);
    }

    if (accion === "status") {
      cambiarEstado(id);
    }
  });
}

function asignarTicket(id) {
  var ticket = buscarTicket(id);
  var selector = document.getElementById("assign-" + id);
  ticket.assignedTo = selector.value;
  guardarTickets();
  mostrarTickets();

  if (ticket.assignedTo === "") {
    mostrarMensaje("Se retiró la asignación del ticket " + id + ".", false);
  } else {
    mostrarMensaje("Ticket " + id + " asignado a " + ticket.assignedTo + ".", false);
  }
}

function guardarEvidencias(id) {
  var ticket = buscarTicket(id);
  var campoAntes = document.getElementById("before-" + id);
  var campoDespues = document.getElementById("after-" + id);

  if (campoAntes.files.length === 0 && campoDespues.files.length === 0) {
    mostrarMensaje("Selecciona al menos una evidencia para el ticket " + id + ".", true);
    return;
  }

  if (campoAntes.files.length > 0) {
    ticket.evidenceBefore = campoAntes.files[0].name;
  }

  if (campoDespues.files.length > 0) {
    ticket.evidenceAfter = campoDespues.files[0].name;
  }

  guardarTickets();
  mostrarTickets();
  mostrarMensaje("Evidencias del ticket " + id + " guardadas.", false);
}

function cambiarEstado(id) {
  var ticket = buscarTicket(id);
  ticket.status = document.getElementById("state-" + id).value;
  guardarTickets();
  mostrarTickets();
  mostrarMensaje("El ticket " + id + " cambió a " + ticket.status + ".", false);
}

function buscarTicket(id) {
  for (var i = 0; i < tickets.length; i++) {
    if (tickets[i].id === id) {
      return tickets[i];
    }
  }

  return null;
}

function mostrarTickets() {
  var lista = document.getElementById("reportList");
  var ticketsVisibles = obtenerTicketsVisibles();
  var contenido = "";

  for (var i = 0; i < ticketsVisibles.length; i++) {
    contenido += crearTarjeta(ticketsVisibles[i]);
  }

  if (ticketsVisibles.length === 0) {
    contenido = '<div class="empty-state">No hay tickets con los filtros seleccionados.</div>';
  }

  lista.innerHTML = contenido;
  document.getElementById("reportsCount").textContent =
    "Mostrando " + ticketsVisibles.length + " de " + tickets.length + " reportes";

  actualizarResumen();
}

function obtenerTicketsVisibles() {
  var resultado = tickets.slice();
  var busqueda = normalizarTexto(document.getElementById("reportSearch").value);
  var categoria = document.getElementById("categoryFilter");
  var estado = document.getElementById("statusFilter");
  var pestana = document.querySelector(".reports-panel .tab.active");
  var estadoPestana = obtenerEstadoDePestana(pestana.textContent.trim());

  resultado = ordenarTickets(resultado);

  return resultado.filter(function (ticket) {
    var texto = normalizarTexto(
      ticket.title + " " + ticket.category + " " + ticket.description + " " + ticket.id
    );
    var coincideBusqueda = texto.indexOf(busqueda) !== -1;
    var coincideCategoria = categoria.selectedIndex === 0 || ticket.category === categoria.value;
    var coincideEstado = estado.selectedIndex === 0 || ticket.status === estado.value;
    var coincidePestana = estadoPestana === "" || ticket.status === estadoPestana;

    return coincideBusqueda && coincideCategoria && coincideEstado && coincidePestana;
  });
}

function obtenerEstadoDePestana(texto) {
  if (texto === "Pendientes") return "Pendiente";
  if (texto === "En proceso") return "En proceso";
  if (texto === "Resueltos") return "Resuelto";
  if (texto === "Cerrados") return "Cerrado";
  return "";
}

function ordenarTickets(lista) {
  var orden = document.getElementById("ticketSort").value;
  var pesoUrgencia = { Alta: 3, Media: 2, Baja: 1 };

  lista.sort(function (a, b) {
    if (orden === "urgency-desc") {
      return pesoUrgencia[b.urgency] - pesoUrgencia[a.urgency];
    }

    if (orden === "urgency-asc") {
      return pesoUrgencia[a.urgency] - pesoUrgencia[b.urgency];
    }

    if (orden === "Más antiguos") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return lista;
}

function crearTarjeta(ticket) {
  var datosCategoria = obtenerDatosCategoria(ticket.category);
  var claseUrgencia = ticket.urgency.toLowerCase();
  var claseEstado = obtenerClaseEstado(ticket.status);
  var fecha = new Date(ticket.createdAt).toLocaleString("es-PE", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  var contenido = '<article class="report-card ticket-card" data-id="' + escaparHTML(ticket.id) + '">';
  contenido += '<div class="report-thumb ' + datosCategoria.className + '">' + datosCategoria.icon + '</div>';
  contenido += '<div class="report-info">';
  contenido += '<span class="priority ' + claseUrgencia + '">Urgencia ' + escaparHTML(ticket.urgency) + '</span>';
  contenido += '<h3>' + escaparHTML(ticket.title) + '</h3>';
  contenido += '<p>' + escaparHTML(ticket.description) + '</p>';
  contenido += '<div class="report-tags">';
  contenido += '<span class="tag ' + datosCategoria.color + '">' + escaparHTML(ticket.category) + '</span>';
  contenido += '<span class="location">📍 ' + escaparHTML(ticket.location) + '</span>';
  contenido += '</div>';
  contenido += '<p class="ticket-photo">📷 Foto: ' + escaparHTML(ticket.photo) + '</p>';
  contenido += '<p class="ticket-assignee">👤 Asignado a: ' + escaparHTML(ticket.assignedTo || "Sin asignar") + '</p>';
  contenido += '</div>';
  contenido += '<div class="report-meta">';
  contenido += '<span class="status ' + claseEstado + '">' + escaparHTML(ticket.status) + '</span>';
  contenido += '<h4>#' + escaparHTML(ticket.id) + '</h4>';
  contenido += '<p>' + escaparHTML(fecha) + '</p>';
  contenido += '<small>Urgencia: ' + escaparHTML(ticket.urgency) + '</small>';
  contenido += '</div>';
  contenido += crearGestionTicket(ticket);
  contenido += '</article>';

  return contenido;
}

function crearGestionTicket(ticket) {
  var id = escaparHTML(ticket.id);
  var contenido = '<details class="ticket-management">';
  contenido += '<summary>Gestionar ticket</summary>';
  contenido += '<div class="management-grid">';

  contenido += '<section class="management-block"><h4>Asignación</h4>';
  contenido += '<label for="assign-' + id + '">Personal responsable</label>';
  contenido += '<select id="assign-' + id + '">';
  contenido += crearOpcionAsignado("", "Sin asignar", ticket.assignedTo);
  contenido += crearOpcionAsignado("Carlos Mena", "Carlos Mena · Mantenimiento", ticket.assignedTo);
  contenido += crearOpcionAsignado("María López", "María López · Operaciones", ticket.assignedTo);
  contenido += crearOpcionAsignado("José Torres", "José Torres · Seguridad", ticket.assignedTo);
  contenido += '</select>';
  contenido += '<button type="button" data-action="assign" data-ticket-id="' + id + '">Guardar asignación</button></section>';

  contenido += '<section class="management-block"><h4>Evidencias</h4>';
  contenido += '<label for="before-' + id + '">Evidencia antes</label>';
  contenido += '<input type="file" id="before-' + id + '" accept="image/*">';
  contenido += '<small>Actual: ' + escaparHTML(ticket.evidenceBefore || "Sin evidencia") + '</small>';
  contenido += '<label for="after-' + id + '">Evidencia después</label>';
  contenido += '<input type="file" id="after-' + id + '" accept="image/*">';
  contenido += '<small>Actual: ' + escaparHTML(ticket.evidenceAfter || "Sin evidencia") + '</small>';
  contenido += '<button type="button" data-action="evidence" data-ticket-id="' + id + '">Guardar evidencias</button></section>';

  contenido += '<section class="management-block"><h4>Estado</h4>';
  contenido += '<label for="state-' + id + '">Estado del ticket</label>';
  contenido += '<select id="state-' + id + '">';
  contenido += crearOpcionEstado("Pendiente", ticket.status);
  contenido += crearOpcionEstado("En proceso", ticket.status);
  contenido += crearOpcionEstado("Resuelto", ticket.status);
  contenido += crearOpcionEstado("Cerrado", ticket.status);
  contenido += '</select>';
  contenido += '<button type="button" data-action="status" data-ticket-id="' + id + '">Guardar estado</button></section>';

  contenido += '</div></details>';
  return contenido;
}

function crearOpcionAsignado(valor, texto, seleccionado) {
  var activo = valor === seleccionado ? " selected" : "";
  return '<option value="' + escaparHTML(valor) + '"' + activo + '>' + escaparHTML(texto) + '</option>';
}

function crearOpcionEstado(estado, seleccionado) {
  var activo = estado === seleccionado ? " selected" : "";
  return '<option value="' + estado + '"' + activo + '>' + estado + '</option>';
}

function obtenerDatosCategoria(categoria) {
  if (categoria === "Mantenimiento") return { icon: "🏢", className: "elevator", color: "blue" };
  if (categoria === "Alumbrado") return { icon: "💡", className: "light", color: "green" };
  if (categoria === "Plomería") return { icon: "💧", className: "water", color: "purple" };
  if (categoria === "Áreas comunes") return { icon: "🌳", className: "park", color: "orange" };
  return { icon: "📷", className: "camera", color: "red" };
}

function obtenerClaseEstado(estado) {
  if (estado === "Pendiente") return "pending";
  if (estado === "En proceso") return "process";
  if (estado === "Resuelto") return "solved";
  return "closed";
}

function actualizarResumen() {
  document.getElementById("totalReports").textContent = tickets.length;
  document.getElementById("pendingReports").textContent = contarEstado("Pendiente");
  document.getElementById("processReports").textContent = contarEstado("En proceso");
  document.getElementById("resolvedReports").textContent = contarEstado("Resuelto");
  document.getElementById("closedReports").textContent = contarEstado("Cerrado");
  document.getElementById("donutTotal").textContent = tickets.length;
}

function contarEstado(estado) {
  var total = 0;

  for (var i = 0; i < tickets.length; i++) {
    if (tickets[i].status === estado) {
      total++;
    }
  }

  return total;
}

function mostrarMensaje(texto, esError) {
  var mensaje = document.getElementById("reportsMessage");
  mensaje.textContent = texto;
  mensaje.className = esError ? "reports-message error" : "reports-message success";
}

function escaparHTML(texto) {
  var elemento = document.createElement("div");
  elemento.textContent = texto;
  return elemento.innerHTML;
}
