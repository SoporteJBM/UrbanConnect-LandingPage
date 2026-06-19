# language: es
Característica: Gestión operativa de servicios de UrbanConnect
  Como administrador de la comunidad
  Quiero gestionar mantenimientos, emergencias, activos, proveedores y zonas
  Para mantener el edificio seguro y operativo

  @HU05
  Escenario: Programar un mantenimiento preventivo
    Dado que el administrador está en la sección "Calendario preventivo"
    Cuando registra una actividad, una fecha futura y su frecuencia
    Y selecciona "Programar mantenimiento"
    Entonces visualiza la confirmación del mantenimiento programado

  @HU06
  Escenario: Activar el botón de pánico ante una emergencia
    Dado que el administrador identifica la ubicación de una emergencia
    Cuando selecciona "Activar alerta de emergencia"
    Entonces visualiza que la alerta fue enviada al personal de seguridad

  @HU08
  Escenario: Consultar el historial de un activo
    Dado que el administrador selecciona un activo registrado
    Cuando selecciona "Ver historial"
    Entonces visualiza sus intervenciones anteriores y el estado de cada una

  @HU22
  Escenario: Registrar un proveedor externo
    Dado que el administrador completa la razón social, el RUC y la especialidad
    Cuando selecciona "Registrar proveedor"
    Entonces visualiza la confirmación con los datos del proveedor registrado

  @HU22
  Escenario: Evitar el registro duplicado de un proveedor externo
    Dado que existe un proveedor registrado con el mismo RUC
    Cuando el administrador intenta registrarlo nuevamente
    Entonces visualiza un mensaje indicando que el proveedor ya existe

  @HU23
  Esquema del escenario: Verificar una zona reservada
    Dado que el administrador selecciona una zona y una fecha
    Cuando selecciona "Verificar disponibilidad"
    Entonces visualiza si la zona está <estado> en esa fecha

    Ejemplos:
      | estado     |
      | disponible |
      | reservada  |
