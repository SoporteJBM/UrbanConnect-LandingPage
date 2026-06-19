(function () {
  "use strict";

  var STORAGE_RESERVAS = "urbanConnect_reservas";
  var STORAGE_INSPECCIONES = "urbanConnect_inspecciones";
  var aforos = {
    "Salón de eventos": 80,
    "Zona de parrillas": 25,
    "Cancha múltiple": 30,
    "Gimnasio": 15
  };

  document.addEventListener("DOMContentLoaded", function () {
    var estado = iniciarFiltros();
    var modal = iniciarFormularioModal();
    cargarReservas(estado);
    iniciarCancelaciones(estado);
    iniciarReserva(estado, modal);
    iniciarInspeccion();
  });

  function iniciarFiltros() {
    var panel = document.querySelector(".payments-panel");
    var lista = document.querySelector(".payment-list");
    if (!panel || !lista) return null;

    var pestanas = Array.prototype.slice.call(panel.querySelectorAll(".tab"));
    var buscador = panel.querySelector(".search-box input");
    var selectores = Array.prototype.slice.call(panel.querySelectorAll(".filters select"));
    var vacio = document.createElement("div");
    vacio.className = "empty-state";
    vacio.textContent = "No hay resultados con los filtros seleccionados.";
    vacio.hidden = true;
    vacio.setAttribute("role", "status");
    lista.appendChild(vacio);

    function actualizar() {
      var tarjetas = Array.prototype.slice.call(lista.querySelectorAll(".payment-card"));
      var activa = panel.querySelector(".tab.active");
      var estadoActivo = activa ? normalizar(activa.textContent) : "todas";
      var busqueda = buscador ? normalizar(buscador.value) : "";
      var visibles = 0;

      tarjetas.forEach(function (tarjeta) {
        var texto = normalizar(tarjeta.textContent);
        var coincide = texto.indexOf(busqueda) !== -1;
        if (estadoActivo !== "todos" && estadoActivo !== "todas") {
          var singular = estadoActivo.endsWith("s") ? estadoActivo.slice(0, -1) : estadoActivo;
          coincide = coincide && texto.indexOf(singular) !== -1;
        }
        selectores.forEach(function (selector) {
          var valor = normalizar(selector.value);
          var general = valor.indexOf("todos") === 0 || valor.indexOf("todas") === 0 || valor === "esta semana" || valor === "este mes";
          if (!general && texto.indexOf(valor) === -1) coincide = false;
        });
        tarjeta.hidden = !coincide;
        if (coincide) visibles++;
      });
      vacio.hidden = visibles !== 0;
    }

    pestanas.forEach(function (pestana) {
      pestana.addEventListener("click", function () {
        pestanas.forEach(function (item) { item.classList.remove("active"); });
        pestana.classList.add("active");
        actualizar();
      });
    });
    if (buscador) buscador.addEventListener("input", actualizar);
    selectores.forEach(function (selector) { selector.addEventListener("change", actualizar); });
    actualizar();
    return { lista: lista, actualizar: actualizar };
  }

  function iniciarFormularioModal() {
    var formulario = document.getElementById("reservationForm");
    if (!formulario) return null;
    var encabezado = formulario.querySelector("h3");
    var titulo = encabezado ? encabezado.textContent : "Nueva reserva";
    var guardar = formulario.querySelector('button[type="submit"]');
    var modal = document.createElement("div");
    modal.className = "module-modal-overlay";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = '<section class="module-modal-card" role="dialog" aria-modal="true" aria-labelledby="reservasModalTitle"><header class="module-modal-header"><div><h2 id="reservasModalTitle"></h2><p>Completa los datos y acepta el reglamento.</p></div><button class="module-modal-close" type="button" aria-label="Cerrar modal">×</button></header><div class="module-modal-slot"></div></section>';
    modal.querySelector("h2").textContent = titulo;
    if (encabezado) encabezado.remove();

    var acciones = document.createElement("div");
    acciones.className = "module-modal-actions";
    acciones.innerHTML = '<button class="module-modal-cancel" type="button">Cerrar</button>';
    if (guardar) { guardar.className = "module-modal-submit"; acciones.appendChild(guardar); }
    formulario.appendChild(acciones);
    modal.querySelector(".module-modal-slot").appendChild(formulario);
    document.body.appendChild(modal);

    document.querySelectorAll(".create-btn, .quick-actions button:first-child").forEach(function (boton) {
      boton.addEventListener("click", function () { abrirModal(modal, formulario); });
    });
    modal.querySelector(".module-modal-close").addEventListener("click", function () { cerrarModal(modal); });
    modal.querySelector(".module-modal-cancel").addEventListener("click", function () { cerrarModal(modal); });
    modal.addEventListener("click", function (evento) { if (evento.target === modal) cerrarModal(modal); });
    document.addEventListener("keydown", function (evento) { if (evento.key === "Escape") cerrarModal(modal); });
    return modal;
  }

  function iniciarReserva(estado, modal) {
    var formulario = document.getElementById("reservationForm");
    if (!formulario || !estado) return;
    var espacio = document.getElementById("reservationSpace");
    var asistentes = document.getElementById("reservationCapacity");
    var ayuda = document.getElementById("capacityHelp");
    var resultado = document.getElementById("reservationResult");

    function validarAforo() {
      var maximo = aforos[espacio.value];
      ayuda.classList.remove("error");
      if (!maximo) {
        ayuda.textContent = "HU-29 · Selecciona un espacio para conocer su aforo máximo.";
        asistentes.removeAttribute("max");
        return true;
      }
      asistentes.max = maximo;
      ayuda.textContent = "HU-29 · Aforo máximo: " + maximo + " personas.";
      if (Number(asistentes.value) > maximo) {
        ayuda.textContent = "HU-29 · El aforo máximo de este espacio es " + maximo + ". Reduce los asistentes.";
        ayuda.classList.add("error");
        return false;
      }
      return true;
    }

    espacio.addEventListener("change", validarAforo);
    asistentes.addEventListener("input", validarAforo);
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!validarAforo()) { mostrarResultado(resultado, "No se pudo reservar: se excede el aforo permitido.", "error"); return; }
      if (!formulario.checkValidity()) { formulario.reportValidity(); return; }

      var reserva = {
        id: "RV-" + Date.now().toString().slice(-6),
        residente: document.getElementById("reservationResident").value.trim(),
        espacio: espacio.value,
        fecha: document.getElementById("reservationDate").value,
        hora: document.getElementById("reservationTime").value,
        asistentes: Number(asistentes.value),
        notas: document.getElementById("reservationNotes").value.trim(),
        estado: "Confirmada"
      };
      var reservas = leer(STORAGE_RESERVAS);
      reservas.push(reserva);
      guardar(STORAGE_RESERVAS, reservas);
      estado.lista.insertBefore(crearTarjeta(reserva), estado.lista.querySelector(".empty-state"));
      agregarOpcionInspeccion(reserva);
      iniciarCancelaciones(estado);
      estado.actualizar();
      formulario.reset();
      validarAforo();
      mostrarResultado(resultado, "Reserva #" + reserva.id + " creada y confirmada correctamente.", "success");
      setTimeout(function () { cerrarModal(modal); }, 1100);
    });
  }

  function crearTarjeta(reserva) {
    var tarjeta = document.createElement("article");
    tarjeta.className = "payment-card" + (reserva.estado === "Cancelada" ? " is-cancelled" : "");
    tarjeta.dataset.reservationId = reserva.id;
    var estadoClase = reserva.estado === "Cancelada" ? "overdue" : "paid";
    tarjeta.innerHTML = '<div class="payment-icon ' + estadoClase + '">' + (reserva.estado === "Cancelada" ? "×" : "✓") + '</div><div class="payment-info"><span class="folio">#' + escapar(reserva.id) + '</span><h3>' + escapar(reserva.espacio) + '</h3><p>' + escapar(reserva.residente) + ' · ' + reserva.asistentes + ' asistentes' + (reserva.notas ? ' · ' + escapar(reserva.notas) : '') + '.</p><div class="payment-tags"><span class="tag ' + (reserva.estado === "Cancelada" ? "red" : "green") + '">' + reserva.estado + '</span><span class="method">📅 ' + escapar(reserva.fecha) + ' · ' + escapar(reserva.hora) + '</span></div></div><div class="payment-meta"><span class="status ' + estadoClase + '">' + reserva.estado + '</span><h4>Aforo ' + reserva.asistentes + '</h4><p>Reglamento aceptado</p></div><div class="reservation-actions"><button type="button" class="cancel-reservation" ' + (reserva.estado === "Cancelada" ? "disabled" : "") + '>Cancelar</button></div>';
    return tarjeta;
  }

  function cargarReservas(estado) {
    if (!estado) return;
    leer(STORAGE_RESERVAS).forEach(function (reserva) {
      estado.lista.insertBefore(crearTarjeta(reserva), estado.lista.querySelector(".empty-state"));
      if (reserva.estado !== "Cancelada") agregarOpcionInspeccion(reserva);
    });
    estado.actualizar();
  }

  function iniciarCancelaciones(estado) {
    if (!estado) return;
    var tarjetas = Array.prototype.slice.call(estado.lista.querySelectorAll(".payment-card"));
    tarjetas.forEach(function (tarjeta, indice) {
      if (!tarjeta.dataset.reservationId) tarjeta.dataset.reservationId = "base-" + indice;
      if (tarjeta.querySelector(".cancel-reservation")) return;
      var contenedor = tarjeta.querySelector(".more-btn");
      if (!contenedor) return;
      contenedor.className = "cancel-reservation";
      contenedor.textContent = "Cancelar";
      contenedor.setAttribute("aria-label", "Cancelar reserva");
    });
    estado.lista.onclick = function (evento) {
      var boton = evento.target.closest(".cancel-reservation");
      if (!boton || boton.disabled) return;
      var tarjeta = boton.closest(".payment-card");
      cancelarTarjeta(tarjeta, boton);
      var id = tarjeta.dataset.reservationId;
      var reservas = leer(STORAGE_RESERVAS);
      reservas.forEach(function (reserva) { if (reserva.id === id) reserva.estado = "Cancelada"; });
      guardar(STORAGE_RESERVAS, reservas);
      eliminarOpcionInspeccion(id);
      estado.actualizar();
    };
  }

  function cancelarTarjeta(tarjeta, boton) {
    tarjeta.classList.add("is-cancelled");
    boton.disabled = true;
    var etiquetas = tarjeta.querySelectorAll(".tag, .status");
    etiquetas.forEach(function (etiqueta) { etiqueta.className = etiqueta.classList.contains("tag") ? "tag red" : "status overdue"; etiqueta.textContent = "Cancelada"; });
    var icono = tarjeta.querySelector(".payment-icon");
    if (icono) { icono.className = "payment-icon overdue"; icono.textContent = "×"; }
    boton.textContent = "Cancelada";
  }

  function iniciarInspeccion() {
    var formulario = document.getElementById("inspectionForm");
    var resultado = document.getElementById("inspectionResult");
    if (!formulario || !resultado) return;
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!formulario.checkValidity()) { formulario.reportValidity(); return; }
      var inspeccion = {
        reserva: document.getElementById("inspectionReservation").value,
        estado: document.getElementById("inspectionStatus").value,
        foto: document.getElementById("inspectionPhoto").value,
        fecha: new Date().toISOString()
      };
      var inspecciones = leer(STORAGE_INSPECCIONES);
      inspecciones.push(inspeccion);
      guardar(STORAGE_INSPECCIONES, inspecciones);
      resultado.innerHTML = "✓ Inspección registrada: <strong>" + escapar(inspeccion.estado) + "</strong> · Evidencia 📷 " + escapar(inspeccion.foto);
      resultado.classList.add("visible");
      formulario.reset();
    });
  }

  function agregarOpcionInspeccion(reserva) {
    var selector = document.getElementById("inspectionReservation");
    if (!selector || selector.querySelector('option[value="' + reserva.id + '"]')) return;
    var opcion = document.createElement("option");
    opcion.value = reserva.id;
    opcion.textContent = "#" + reserva.id + " · " + reserva.espacio;
    selector.appendChild(opcion);
  }

  function eliminarOpcionInspeccion(id) {
    var opcion = document.querySelector('#inspectionReservation option[value="' + id + '"]');
    if (opcion) opcion.remove();
  }

  function mostrarResultado(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = "action-result visible " + tipo;
  }

  function abrirModal(modal, formulario) {
    modal.classList.add("active"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("module-modal-open");
    var campo = formulario.querySelector("input, select, textarea"); if (campo) campo.focus();
  }
  function cerrarModal(modal) {
    if (!modal) return;
    modal.classList.remove("active"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("module-modal-open");
  }
  function leer(clave) { try { return JSON.parse(localStorage.getItem(clave)) || []; } catch (error) { return []; } }
  function guardar(clave, valor) { localStorage.setItem(clave, JSON.stringify(valor)); }
  function normalizar(texto) { return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim(); }
  function escapar(texto) { var div = document.createElement("div"); div.textContent = String(texto); return div.innerHTML; }
})();
