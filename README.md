# UrbanConnect

UrbanConnect es un prototipo web estático para la gestión de comunidades residenciales. Centraliza la comunicación y las tareas cotidianas de residentes y administradores en una experiencia accesible desde cualquier dispositivo. No necesita servidor, dependencias ni proceso de compilación.

## Autores

- Cristhina LLuen
- Frank02-01
- lizaguero-0202-coder
- SoporteJBM
- U202519746@upc.edu.pe

Los nombres se mantienen de acuerdo con la autoría registrada en el historial Git del proyecto.

## Segmento objetivo

UrbanConnect está dirigido a residentes, juntas de propietarios y administradores de condominios, edificios y comunidades residenciales que necesitan organizar información, servicios y participación comunitaria desde un único lugar.

## Principales características

- Landing Page pública, registro e inicio de sesión de demostración.
- Panel administrativo con resumen de la comunidad.
- Gestión de comunicados, reportes e incidencias.
- Encuestas y participación digital.
- Reservas de espacios e inspecciones.
- Seguimiento de pagos, cuotas y vouchers.
- Gestión de documentos, usuarios, accesos, servicios y configuración.
- Persistencia local mediante `localStorage` para las funciones interactivas del prototipo.
- Diseño adaptable y controles con consideraciones de accesibilidad.

## Tecnologías usadas

- HTML5
- CSS3
- JavaScript
- Git
- GitHub

## Ejecución local

Abre `public/index.html` en un navegador moderno. La aplicación utiliza rutas relativas y no requiere instalación.

Credenciales de demostración:

```text
Usuario: admin
Contraseña: admin123
```

El login valida las credenciales en el navegador, guarda el usuario activo en `localStorage` y redirige a `dashboard.html`.

## Estructura

```text
UrbanConnect-LandingPage/
├── README.md
├── public/
│   ├── index.html
│   ├── landing.html
│   ├── login.html
│   ├── registro.html
│   ├── dashboard.html
│   ├── comunicados.html
│   ├── reportes.html
│   ├── servicios.html
│   ├── encuestas.html
│   ├── reservas.html
│   ├── pagos.html
│   ├── documentos.html
│   ├── usuarios.html
│   ├── configuracion.html
│   ├── favicon.ico
│   └── assets/
│       ├── styles/
│       │   ├── styles.css
│       │   ├── global.css
│       │   ├── layout.css
│       │   └── hojas propias de cada módulo
│       ├── scripts/
│       │   ├── main.js
│       │   └── scripts propios de cada módulo
│       └── images/
│           └── imágenes del proyecto
├── features/
└── docs/
```

## Documentación y alcance

Los escenarios Gherkin están en `features/` y la documentación de implementación y trazabilidad se encuentra en [docs/chapter-v-product-implementation.md](docs/chapter-v-product-implementation.md).

Este es un prototipo estático: la autenticación es local, no existe backend y los archivos seleccionados no se cargan a un servidor.
