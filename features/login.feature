# language: es
Característica: Inicio de sesión de UrbanConnect
  Como usuario de una comunidad residencial
  Quiero ingresar a UrbanConnect desde la página principal
  Para acceder al panel de administración

  Antecedentes:
    Dado que el usuario abre el archivo "index.html"

  Escenario: Visualizar el formulario de acceso
    Entonces debe visualizar el nombre "UrbanConnect"
    Y debe visualizar los campos "Usuario" y "Contraseña"
    Y debe visualizar la acción "Iniciar sesión"

  Escenario: Acceder con credenciales válidas
    Cuando el usuario ingresa credenciales válidas
    Y selecciona "Iniciar sesión"
    Entonces debe abrirse la página "dashboard.html"

  Escenario: Rechazar credenciales inválidas
    Cuando el usuario ingresa credenciales inválidas
    Y selecciona "Iniciar sesión"
    Entonces debe mostrarse un mensaje de credenciales incorrectas

  Escenario: Acceder al registro
    Cuando el usuario selecciona "Regístrate"
    Entonces debe abrirse la página "registro.html"

  Esquema del escenario: Adaptar el formulario al tamaño de pantalla
    Dado que el usuario utiliza una pantalla de <dispositivo>
    Cuando visualiza el inicio de sesión
    Entonces el formulario debe mantenerse legible
    Y no debe existir desplazamiento horizontal

    Ejemplos:
      | dispositivo |
      | desktop     |
      | tablet      |
      | móvil       |
