# language: es
Característica: Landing Page de UrbanConnect
  Como visitante interesado en mejorar la gestión de una comunidad residencial
  Quiero conocer las funciones principales de UrbanConnect
  Para decidir si ingreso o creo una cuenta

  Antecedentes:
    Dado que el visitante abre el archivo "index.html"

  Escenario: Visualizar la propuesta principal de UrbanConnect
    Entonces debe visualizar el nombre "UrbanConnect"
    Y debe visualizar una descripción de la plataforma
    Y debe visualizar las opciones "Crear una cuenta" e "Ingresar a la plataforma"

  Escenario: Consultar los beneficios de la plataforma
    Cuando el visitante selecciona "Beneficios" en la navegación
    Entonces la página debe mostrar la sección "Todo lo importante, siempre cerca"
    Y debe mostrar beneficios de comunicación, participación y gestión

  Escenario: Consultar las funciones disponibles
    Cuando el visitante selecciona "Funciones" en la navegación
    Entonces la página debe mostrar la sección de herramientas esenciales
    Y debe incluir comunicados, pagos, reportes, reservas, documentos y usuarios

  Escenario: Acceder al inicio de sesión
    Cuando el visitante selecciona "Iniciar sesión"
    Entonces debe abrirse la página "Login.html"

  Escenario: Acceder al registro
    Cuando el visitante selecciona "Registrarse"
    Entonces debe abrirse la página "registro.html"

  Escenario: Utilizar la navegación en un dispositivo móvil
    Dado que el ancho de la pantalla es menor o igual a 768 píxeles
    Cuando el visitante selecciona el botón de menú
    Entonces deben mostrarse los enlaces de navegación
    Y el botón debe indicar que el menú está abierto

  Escenario: Cerrar la navegación móvil con el teclado
    Dado que el menú móvil está abierto
    Cuando el visitante presiona la tecla Escape
    Entonces los enlaces del menú deben ocultarse
    Y el botón debe indicar que el menú está cerrado

  Esquema del escenario: Adaptar el contenido al tamaño de pantalla
    Dado que el visitante utiliza una pantalla de <dispositivo>
    Cuando visualiza el Landing Page
    Entonces el contenido debe mantenerse legible
    Y no debe existir desplazamiento horizontal

    Ejemplos:
      | dispositivo |
      | desktop     |
      | tablet      |
      | móvil       |
