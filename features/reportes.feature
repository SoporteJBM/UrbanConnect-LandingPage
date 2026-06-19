# language: es
Característica: Gestión de incidencias de UrbanConnect
  Como administrador de una comunidad
  Quiero registrar y gestionar tickets de incidencias
  Para dar seguimiento a los problemas hasta su cierre

  Antecedentes:
    Dado que el usuario se encuentra en el módulo de reportes
    Y los tickets se almacenan con la clave "uc_reportes_tickets"

  @HU01
  Escenario: Reportar una incidencia con foto simulada
    Cuando el usuario registra título, categoría, descripción, urgencia y una foto
    Entonces el sistema crea un ticket con estado "Pendiente"
    Y guarda el nombre de la foto en el ticket
    Y muestra un mensaje de confirmación accesible

  @HU02
  Escenario: Asignar un ticket a personal
    Dado que existe un ticket sin asignar
    Cuando el usuario selecciona un responsable y guarda la asignación
    Entonces el responsable queda asociado al ticket
    Y la asignación permanece al recargar la página

  @HU03
  Escenario: Subir evidencias antes y después
    Dado que existe un ticket registrado
    Cuando el usuario selecciona una evidencia antes y una evidencia después
    Entonces el sistema guarda los nombres de ambos archivos
    Y muestra las evidencias actuales en la gestión del ticket

  @HU04
  Esquema del escenario: Cambiar el estado de un ticket
    Dado que existe un ticket registrado
    Cuando el usuario cambia su estado a "<estado>"
    Entonces el ticket muestra el estado "<estado>"
    Y el nuevo estado permanece al recargar la página

    Ejemplos:
      | estado     |
      | Pendiente  |
      | En proceso |
      | Resuelto   |
      | Cerrado    |

  @HU07
  Esquema del escenario: Ordenar tickets por urgencia
    Dado que existen tickets con urgencia Alta, Media y Baja
    Cuando el usuario selecciona el orden "<orden>"
    Entonces los tickets se muestran desde la urgencia "<primera>"

    Ejemplos:
      | orden          | primera |
      | Mayor urgencia | Alta    |
      | Menor urgencia | Baja    |
