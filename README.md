# UrbanConnect

UrbanConnect es un prototipo web estático para la gestión de comunidades residenciales. Está construido con HTML5, CSS3 y JavaScript nativo; no necesita servidor, dependencias ni proceso de compilación.

## Flujo de navegación

1. `index.html`: Landing Page pública y punto de entrada de GitHub Pages.
2. `login.html`: inicio de sesión.
3. `dashboard.html`: panel administrativo.
4. Módulos: comunicados, reportes, servicios, encuestas, reservas, pagos, documentos, usuarios y configuración.

Credenciales de demostración:

```text
Usuario: admin
Contraseña: admin123
```

El login valida las credenciales en el navegador, guarda el usuario activo en `localStorage` y redirige a `dashboard.html`.

## Ejecución y despliegue

Para una prueba local, abre `index.html` en un navegador moderno. Para GitHub Pages, publica la rama estable desde la carpeta raíz `/`; todas las rutas del proyecto son relativas y compatibles con una publicación bajo un subdirectorio.

URL prevista:

```text
https://soportejbm.github.io/UrbanConnect-LandingPage/
```

## Módulos

| Página | Propósito | Recursos principales |
| --- | --- | --- |
| `index.html` | Landing Page pública | `css/landing.css`, `js/landing.js` |
| `login.html` | Autenticación local | `css/login.css`, `js/login.js` |
| `registro.html` | Registro visual | `css/registro.css` |
| `dashboard.html` | Resumen y navegación administrativa | `css/index.css` |
| `comunicados.html` | Avisos y participación comunitaria | `css/comunicados.css`, `js/filters.js`, `js/comunidad.js` |
| `reportes.html` | Incidencias y seguimiento | `css/reportes.css`, `js/reportes.js` |
| `servicios.html` | Mantenimiento, emergencias, activos y proveedores | `css/servicios.css`, `js/servicios.js` |
| `encuestas.html` | Encuestas y votación digital | `css/encuestas.css`, `js/encuestas.js` |
| `reservas.html` | Reservas e inspecciones | `css/reservas.css`, `js/reservas.js` |
| `pagos.html` | Cuotas, gastos, morosos y vouchers | `css/pagos.css`, `js/pagos.js` |
| `documentos.html` | Archivo documental | `css/documentos.css`, `js/documentos.js` |
| `usuarios.html` | Usuarios, accesos y operaciones | `css/usuarios.css`, `js/usuarios.js` |
| `configuracion.html` | Preferencias administrativas | `css/configuracion.css` |

Las páginas administrativas cargan `css/global.css`, `css/layout.css` cuando usan el layout compartido y una hoja propia. Pagos, reservas, encuestas, servicios y documentos no dependen de `css/pagos.css` para su presentación.

## User Stories core

El prototipo contiene 30 HU core visibles y documentadas:

- Reportes: `HU01`, `HU02`, `HU03`, `HU04`, `HU07`.
- Servicios: `HU05`, `HU06`, `HU08`, `HU22`, `HU23`.
- Pagos: `HU09`, `HU10`, `HU11`, `HU12`, `HU14`.
- Comunidad: `HU15`, `HU17`, `HU18`, `HU19`, `HU20`.
- Reservas: `HU16`, `HU27`, `HU28`, `HU29`, `HU30`.
- Usuarios y accesos: `HU21`, `HU31`, `HU32`, `HU33`, `HU34`.

Los escenarios Gherkin están en `features/` y se ejecutan manualmente en esta versión.

## Persistencia local

El prototipo usa `localStorage` para autenticación y funcionalidades que necesitan conservar estado. Entre sus claves se encuentran `usuarios`, `usuarioActivo`, `uc_reportes_tickets`, `uc_pagos_cuotas`, `uc_pagos_vouchers`, `uc_paquetes`, `uc_stock`, `uc_qr_visitas`, `uc_personal`, `uc_mudanzas`, `urbanConnect_mantenimientos` y `urbanConnect_proveedores`.

Los datos permanecen únicamente en el navegador; no existe backend ni sincronización remota.

## Estructura

```text
UrbanConnect-LandingPage/
├── index.html
├── login.html
├── registro.html
├── dashboard.html
├── comunicados.html
├── reportes.html
├── servicios.html
├── encuestas.html
├── reservas.html
├── pagos.html
├── documentos.html
├── usuarios.html
├── configuracion.html
├── css/
│   ├── global.css
│   ├── layout.css
│   └── hojas propias de cada página
├── js/
│   ├── landing.js
│   ├── login.js
│   ├── filters.js
│   └── scripts propios de módulos interactivos
├── img/
├── features/
└── docs/
```

## Accesibilidad y responsive

El proyecto utiliza HTML semántico, labels asociados, nombres accesibles para controles de icono, regiones `aria-live` para resultados dinámicos y media queries para escritorio, tablet y móvil.

## Limitaciones del prototipo

- La autenticación es una simulación local y no protege rutas mediante un servidor.
- Registro y algunas opciones de configuración son demostraciones visuales.
- Los archivos seleccionados no se cargan a un servidor; se conserva únicamente información simulada.
- Los escenarios Gherkin no cuentan con runner automatizado.

Consulta [docs/chapter-v-product-implementation.md](docs/chapter-v-product-implementation.md) para la configuración técnica y trazabilidad.
