(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    iniciarFiltros();
    iniciarFormularioModal();
    iniciarRegistroServicio();
    iniciarCalendarioPreventivo();
    iniciarBotonPanico();
    iniciarHistorialActivos();
    iniciarProveedores();
    iniciarVerificacionZona();
  });

  function iniciarFiltros() {
    var panel = document.querySelector(".payments-panel");
    var lista = document.querySelector(".payment-list");
    if (!panel || !lista) return;

    var tarjetas = Array.prototype.slice.call(lista.querySelectorAll(".payment-card"));
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
      var activa = panel.querySelector(".tab.active");
      var estado = activa ? normalizar(activa.textContent) : "todos";
      var busqueda = buscador ? normalizar(buscador.value) : "";
      var visibles = 0;

      tarjetas.forEach(function (tarjeta) {
        var texto = normalizar(tarjeta.textContent);
        var coincide = texto.indexOf(busqueda) !== -1;

        if (estado !== "todos" && estado !== "todas") {
          var singular = estado.endsWith("s") ? estado.slice(0, -1) : estado;
          coincide = coincide && texto.indexOf(singular) !== -1;
        }

        selectores.forEach(function (selector) {
          var primera = normalizar(selector.options[0].textContent);
          var valor = normalizar(selector.value);
          var esFiltro = primera.indexOf("todos") === 0 || primera.indexOf("todas") === 0;
          var esGeneral = valor.indexOf("todos") === 0 || valor.indexOf("todas") === 0;
          if (esFiltro && !esGeneral && texto.indexOf(valor) === -1) coincide = false;
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
    selectores.forEach(function (selector) {
      selector.addEventListener("change", actualizar);
    });
    actualizar();
  }

  function iniciarFormularioModal() {
    var formulario = document.querySelector(".module-form");
    if (!formulario) return;

    var encabezado = formulario.querySelector("h3");
    var titulo = encabezado ? encabezado.textContent : "Nuevo registro";
    var guardar = formulario.querySelector("button");
    var modal = document.createElement("div");

    modal.className = "module-modal-overlay";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<section class="module-modal-card" role="dialog" aria-modal="true" aria-labelledby="serviciosModalTitle">' +
        '<header class="module-modal-header">' +
          '<div><h2 id="serviciosModalTitle"></h2><p>Completa los datos del registro.</p></div>' +
          '<button class="module-modal-close" type="button" aria-label="Cerrar modal">×</button>' +
        '</header>' +
        '<div class="module-modal-slot"></div>' +
      '</section>';

    modal.querySelector("h2").textContent = titulo;
    if (encabezado) encabezado.remove();

    var acciones = document.createElement("div");
    acciones.className = "module-modal-actions";
    acciones.innerHTML = '<button class="module-modal-cancel" type="button">Cancelar</button>';
    if (guardar) {
      guardar.className = "module-modal-submit";
      acciones.appendChild(guardar);
    }
    formulario.appendChild(acciones);
    modal.querySelector(".module-modal-slot").appendChild(formulario);
    document.body.appendChild(modal);

    document.querySelectorAll(".create-btn, .quick-actions button:first-child").forEach(function (boton) {
      boton.addEventListener("click", function () { abrirModal(modal, formulario); });
    });
    modal.querySelector(".module-modal-close").addEventListener("click", function () { cerrarModal(modal); });
    modal.querySelector(".module-modal-cancel").addEventListener("click", function () { cerrarModal(modal); });
    modal.addEventListener("click", function (evento) {
      if (evento.target === modal) cerrarModal(modal);
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") cerrarModal(modal);
    });
  }

  function abrirModal(modal, formulario) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("module-modal-open");
    var campo = formulario.querySelector("input, select, textarea");
    if (campo) campo.focus();
  }

  function cerrarModal(modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("module-modal-open");
  }

  function iniciarRegistroServicio() {
    var formulario = document.getElementById("serviceForm");
    if (!formulario) return;
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!formulario.checkValidity()) { formulario.reportValidity(); return; }
      var titulo = document.getElementById("serviceTitle").value.trim();
      mostrarConfirmacion(formulario, "Servicio ‘" + titulo + "’ guardado correctamente.");
      formulario.reset();
    });
  }

  function mostrarConfirmacion(formulario, texto) {
    var mensaje = formulario.querySelector(".module-feedback");
    if (!mensaje) {
      mensaje = document.createElement("p");
      mensaje.className = "module-feedback";
      mensaje.setAttribute("role", "status");
      mensaje.setAttribute("aria-live", "polite");
      formulario.insertBefore(mensaje, formulario.querySelector(".module-modal-actions"));
    }
    mensaje.textContent = texto;
  }

  function iniciarCalendarioPreventivo() {
    var formulario = document.getElementById("maintenanceForm");
    var resultado = document.getElementById("maintenanceResult");
    if (!formulario || !resultado) return;
    limitarFechasFuturas("maintenanceDate");
    var registros = leerAlmacen("urbanConnect_mantenimientos");
    if (registros.length) mostrarMantenimiento(registros[registros.length - 1], resultado);

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!formulario.checkValidity()) { formulario.reportValidity(); return; }
      var registro = {
        actividad: document.getElementById("maintenanceTask").value.trim(),
        fecha: document.getElementById("maintenanceDate").value,
        frecuencia: document.getElementById("maintenanceFrequency").value
      };
      registros.push(registro);
      guardarAlmacen("urbanConnect_mantenimientos", registros);
      mostrarMantenimiento(registro, resultado);
      formulario.reset();
      limitarFechasFuturas("maintenanceDate");
    });
  }

  function mostrarMantenimiento(registro, resultado) {
    resultado.className = "operation-result success";
    resultado.textContent = "Mantenimiento programado: " + registro.actividad + " · " + formatearFecha(registro.fecha) + " · " + registro.frecuencia + ".";
  }

  function iniciarBotonPanico() {
    var boton = document.getElementById("panicButton");
    var ubicacion = document.getElementById("emergencyLocation");
    var resultado = document.getElementById("panicResult");
    if (!boton || !ubicacion || !resultado) return;
    boton.addEventListener("click", function () {
      var ahora = new Date();
      var alerta = { ubicacion: ubicacion.value, fecha: ahora.toISOString() };
      guardarAlmacen("urbanConnect_ultimaEmergencia", alerta);
      resultado.className = "operation-result warning";
      resultado.textContent = "Alerta activada en " + ubicacion.value + ". Seguridad fue notificada a las " + ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) + ".";
      boton.textContent = "✓ Alerta enviada a seguridad";
    });
  }

  function iniciarHistorialActivos() {
    var selector = document.getElementById("assetSelect");
    var boton = document.getElementById("assetHistoryButton");
    var resultado = document.getElementById("assetHistoryResult");
    if (!selector || !boton || !resultado) return;
    var historiales = {
      "ascensor-a": [["12 Jun 2026", "Inspección preventiva", "Operativo"], ["08 Mar 2026", "Cambio de sensores", "Completado"]],
      "bomba-agua": [["15 Jun 2026", "Revisión de presión", "En seguimiento"], ["20 Feb 2026", "Cambio de válvula", "Completado"]],
      "generador": [["02 Jun 2026", "Prueba de arranque", "Operativo"], ["10 Ene 2026", "Cambio de aceite", "Completado"]]
    };
    boton.addEventListener("click", function () {
      if (!selector.value) {
        resultado.className = "operation-result warning";
        resultado.textContent = "Selecciona un activo antes de consultar.";
        return;
      }
      resultado.className = "operation-result success";
      resultado.innerHTML = '<ul class="history-list">' + historiales[selector.value].map(function (item) {
        return "<li><strong>" + item[0] + " · " + item[1] + "</strong>Estado: " + item[2] + "</li>";
      }).join("") + "</ul>";
    });
  }

  function iniciarProveedores() {
    var formulario = document.getElementById("providerForm");
    var resultado = document.getElementById("providerResult");
    if (!formulario || !resultado) return;
    var proveedores = leerAlmacen("urbanConnect_proveedores");
    if (proveedores.length) mostrarProveedor(proveedores[proveedores.length - 1], resultado);
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!formulario.checkValidity()) { formulario.reportValidity(); return; }
      var ruc = document.getElementById("providerRuc").value.trim();
      var repetido = proveedores.some(function (item) { return item.ruc === ruc; });
      if (repetido) {
        resultado.className = "operation-result warning";
        resultado.textContent = "El proveedor con RUC " + ruc + " ya está registrado.";
        return;
      }
      var proveedor = { nombre: document.getElementById("providerName").value.trim(), ruc: ruc, especialidad: document.getElementById("providerSpecialty").value };
      proveedores.push(proveedor);
      guardarAlmacen("urbanConnect_proveedores", proveedores);
      mostrarProveedor(proveedor, resultado);
      formulario.reset();
    });
  }

  function mostrarProveedor(proveedor, resultado) {
    resultado.className = "operation-result success";
    resultado.textContent = "Proveedor registrado: " + proveedor.nombre + " · RUC " + proveedor.ruc + " · " + proveedor.especialidad + ".";
  }

  function iniciarVerificacionZona() {
    var zona = document.getElementById("reservedZone");
    var fecha = document.getElementById("zoneDate");
    var boton = document.getElementById("verifyZoneButton");
    var resultado = document.getElementById("zoneResult");
    if (!zona || !fecha || !boton || !resultado) return;
    limitarFechasFuturas("zoneDate");
    boton.addEventListener("click", function () {
      if (!zona.value || !fecha.value) {
        resultado.className = "operation-result warning";
        resultado.textContent = "Selecciona una zona y una fecha para verificar.";
        return;
      }
      var dia = new Date(fecha.value + "T12:00:00").getDay();
      var ocupada = (zona.value === "parrilla" && dia === 0) || (zona.value === "sum" && dia === 6);
      resultado.className = "operation-result " + (ocupada ? "warning" : "success");
      resultado.textContent = zona.options[zona.selectedIndex].text + (ocupada ? " ya está reservada el " : " está disponible el ") + formatearFecha(fecha.value) + ".";
    });
  }

  function limitarFechasFuturas(id) {
    var campo = document.getElementById(id);
    if (!campo) return;
    var hoy = new Date();
    var local = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    campo.min = local;
  }

  function formatearFecha(fecha) {
    return new Date(fecha + "T12:00:00").toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
  }

  function leerAlmacen(clave) {
    try {
      var valor = JSON.parse(localStorage.getItem(clave));
      return Array.isArray(valor) ? valor : [];
    } catch (error) { return []; }
  }

  function guardarAlmacen(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (error) { /* La interfaz sigue operativa sin almacenamiento. */ }
  }

  function normalizar(texto) {
    return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }
})();
