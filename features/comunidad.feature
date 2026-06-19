# language: es
Característica: Participación y gestión de la comunidad
  Como residente o administrador de UrbanConnect
  Quiero usar herramientas digitales comunitarias
  Para mantener informados, seguros y participativos a los residentes

  @HU15
  Escenario: Publicar un aviso importante
    Dado que el administrador abre el formulario de avisos
    Cuando completa el título, categoría, fecha y contenido
    Y presiona "Publicar aviso"
    Entonces el aviso aparece en el listado como "Publicado"
    Y se muestra una confirmación visual

  @HU17
  Escenario: Votar digitalmente entre tres opciones
    Dado que la votación comunitaria muestra tres opciones
    Cuando el residente selecciona una opción y registra su voto
    Entonces el sistema incrementa el resultado de la opción elegida
    Y muestra los votos y porcentajes actualizados
    Y confirma visualmente que el voto fue registrado

  @HU18
  Escenario: Consultar un contacto de emergencia
    Dado que el directorio muestra Bomberos, Policía, SAMU y Seguridad
    Cuando el usuario presiona "Ver contacto" en un contacto
    Entonces el sistema muestra visualmente el nombre y teléfono seleccionado

  @HU19
  Escenario: Enviar una sugerencia anónima
    Dado que el residente completa la categoría y el mensaje de la sugerencia
    Y selecciona la opción de envío anónimo
    Cuando presiona "Enviar sugerencia"
    Entonces el sistema registra la sugerencia
    Y muestra un código de confirmación visual

  @HU20
  Escenario: Autorizar el ingreso de un invitado
    Dado que el residente registra nombre, documento, fecha y hora de la visita
    Cuando presiona "Autorizar ingreso"
    Entonces el invitado queda con estado "Autorizado"
    Y el sistema muestra un código de ingreso visual
