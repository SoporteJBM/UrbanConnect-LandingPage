# language: es
Característica: Gestión central de pagos de UrbanConnect
  Como administrador de la comunidad
  Quiero consultar y gestionar sus movimientos financieros
  Para mantener las cuotas y comprobantes al día

  Antecedentes:
    Dado que el administrador se encuentra en la página de pagos

  @HU09
  Escenario: Visualizar el comprobante simulado de un gasto
    Cuando el administrador abre la sección "Gastos"
    Y selecciona "Ver comprobante" en un gasto
    Entonces se muestra el proveedor, concepto, monto y fecha del gasto
    Y se muestra un código de validación simulado

  @HU10
  Escenario: Pagar una cuota pendiente y generar su recibo digital
    Dado que existe una cuota con estado "Pendiente"
    Cuando el administrador selecciona "Pagar cuota"
    Entonces la cuota cambia al estado "Pagado"
    Y se genera un recibo digital con número, residente, concepto y total
    Y los cambios se guardan en "uc_pagos_cuotas"

  @HU11
  Escenario: Filtrar la lista de morosos por estado Pendiente
    Cuando el administrador abre la sección "Morosos"
    Y selecciona el filtro "Pendiente"
    Entonces la tabla muestra únicamente residentes con cuotas pendientes

  @HU12
  Escenario: Enviar un recordatorio de pago a un moroso
    Dado que se muestra un residente con una cuota pendiente o vencida
    Cuando el administrador selecciona "Enviar recordatorio"
    Entonces el sistema confirma el envío al residente y su correo registrado

  @HU14
  Esquema del escenario: Revisar un voucher de transferencia
    Dado que existe un voucher con estado "Pendiente"
    Cuando el administrador decide "<decisión>" el voucher
    Entonces el voucher cambia al estado "<estado>"
    Y los cambios se guardan en "uc_pagos_vouchers"

    Ejemplos:
      | decisión | estado    |
      | Aprobar  | Aprobado  |
      | Rechazar | Rechazado |
