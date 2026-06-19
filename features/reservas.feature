# language: es
Característica: Gestión de reservas de áreas comunes
  Como residente o administrador de UrbanConnect
  Quiero gestionar el ciclo de una reserva
  Para usar y entregar las áreas comunes de manera responsable

  @HU16
  Escenario: Reservar un área común correctamente
    Dado que el residente abre el formulario de nueva reserva
    Cuando completa residente, espacio, fecha, hora y cantidad de asistentes
    Y acepta el reglamento del área común
    Entonces el sistema crea la reserva con estado "Confirmada"
    Y muestra el resultado visual con el código de la reserva

  @HU27
  Escenario: Cancelar una reserva activa
    Dado que existe una reserva activa en el listado
    Cuando el usuario presiona el botón "Cancelar"
    Entonces la reserva cambia al estado "Cancelada"
    Y el resultado visual de la tarjeta refleja la cancelación

  @HU28
  Escenario: Exigir la aceptación del reglamento
    Dado que el reglamento está visible en el formulario de reserva
    Cuando el residente intenta guardar sin aceptar el reglamento
    Entonces el sistema no crea la reserva
    Y solicita aceptar el reglamento

  @HU29
  Esquema del escenario: Validar el aforo máximo del espacio
    Dado que el residente selecciona "<espacio>" con aforo máximo de <aforo>
    Cuando indica <asistentes> asistentes
    Entonces el sistema muestra "<resultado>"

    Ejemplos:
      | espacio            | aforo | asistentes | resultado                              |
      | Salón de eventos   | 80    | 81         | se excede el aforo permitido           |
      | Zona de parrillas  | 25    | 20         | la cantidad está dentro del aforo      |
      | Cancha múltiple    | 30    | 30         | la cantidad está dentro del aforo      |
      | Gimnasio           | 15    | 16         | se excede el aforo permitido           |

  @HU30
  Escenario: Registrar la inspección posterior del área
    Dado que existe una reserva disponible para inspección
    Cuando el administrador selecciona el estado del área y una foto simulada
    Y presiona "Registrar inspección"
    Entonces el sistema guarda la inspección
    Y muestra un resultado visual con el estado y la evidencia seleccionada
