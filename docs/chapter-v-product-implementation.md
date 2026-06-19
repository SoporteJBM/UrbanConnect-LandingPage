# Capítulo V: Product Implementation

UrbanConnect es una aplicación web estática construida con HTML5, CSS3 y JavaScript nativo. Su punto de entrada es `index.html`, que presenta la Landing Page pública. Desde allí el usuario accede a `login.html` y, después de autenticarse, a `dashboard.html` y los módulos administrativos.

## 5.1 Software Configuration Management

El proyecto no requiere compilación, instalación de paquetes ni servidor. Los elementos bajo control de configuración son:

- páginas HTML en la raíz;
- hojas de estilo en `css/`;
- scripts en `js/`;
- imágenes locales en `img/`;
- escenarios Gherkin en `features/`;
- documentación técnica en `docs/`.

### 5.1.1 Software Development Environment Configuration

| Elemento | Configuración |
| --- | --- |
| Lenguajes | HTML5, CSS3 y JavaScript ECMAScript estándar |
| Navegadores objetivo | Chrome, Edge y Firefox actuales |
| Control de versiones | Git y GitHub |
| Despliegue | GitHub Pages desde la raíz del repositorio |
| Persistencia | `localStorage` del navegador |
| Dependencias externas | Ninguna |

Las rutas de CSS, JavaScript, imágenes y páginas son relativas. Esto permite abrir el prototipo localmente y publicarlo bajo el subdirectorio de GitHub Pages sin modificar rutas.

Credenciales de demostración:

```text
Usuario: admin
Contraseña: admin123
```

`js/login.js` valida las credenciales, guarda `usuarioActivo` y redirige a `dashboard.html`.

### 5.1.2 Source Code Management

El repositorio remoto es:

```text
https://github.com/SoporteJBM/UrbanConnect-LandingPage.git
```

Se recomienda trabajar con ramas `feature/*`, integrar los cambios revisados en la rama estable y usar mensajes Conventional Commits, por ejemplo `fix: correct GitHub Pages navigation` o `docs: update implementation chapter`.

### 5.1.3 Convenciones

HTML:

- un único `h1` por página y jerarquía semántica;
- labels asociados a formularios e imágenes con texto alternativo;
- nombres accesibles para botones de icono y `aria-live` para resultados;
- rutas internas relativas y nombres de archivo respetando mayúsculas y minúsculas.

CSS:

- variables compartidas en `css/global.css`;
- estructura administrativa compartida en `css/layout.css`;
- componentes y breakpoints propios en la hoja de cada página;
- Grid, Flexbox y media queries sin frameworks.

JavaScript:

- eventos con `addEventListener`, manipulación del DOM y validación nativa;
- comprobación de existencia de elementos antes de usarlos;
- `localStorage` solo para estado local del prototipo;
- sin `fetch`, APIs externas, librerías ni frameworks.

### 5.1.4 Software Deployment Configuration

Para publicar en GitHub Pages:

1. subir la versión estable a `main`;
2. seleccionar **Settings > Pages > Deploy from a branch**;
3. elegir la rama `main` y la carpeta `/ (root)`;
4. verificar `https://soportejbm.github.io/UrbanConnect-LandingPage/`.

`index.html` es la Landing Page pública; sus botones de acceso apuntan a `login.html`. No se usan rutas absolutas dependientes del dominio.

## 5.2 Product Implementation

### 5.2.1 Flujo y módulos

| Etapa | Archivo | Implementación |
| --- | --- | --- |
| Landing pública | `index.html` | Presentación, navegación responsive y acceso al login |
| Autenticación | `login.html` | Validación local y redirección al dashboard |
| Panel principal | `dashboard.html` | Indicadores y enlaces a todos los módulos |
| Comunicados | `comunicados.html` | Avisos, contactos, sugerencias e invitados |
| Reportes | `reportes.html` | Incidencias, responsables, evidencias, estados y urgencia |
| Servicios | `servicios.html` | Mantenimiento, emergencia, activos, proveedores y zonas |
| Encuestas | `encuestas.html` | Encuestas y votación comunitaria |
| Reservas | `reservas.html` | Reserva, cancelación, reglas, aforo e inspección |
| Pagos | `pagos.html` | Gastos, cuotas, morosos, recordatorios y vouchers |
| Documentos | `documentos.html` | Filtros, modal y confirmación de registro simulado |
| Usuarios | `usuarios.html` | Usuarios; accesos y operaciones como secciones internas |
| Configuración | `configuracion.html` | Preferencias visuales del prototipo |

Pagos, reservas, encuestas, servicios y documentos utilizan hojas y scripts propios. Ninguno de esos módulos depende visualmente de `css/pagos.css`.

### 5.2.2 Persistencia

| Clave | Responsabilidad |
| --- | --- |
| `usuarios`, `usuarioActivo` | Autenticación local |
| `uc_reportes_tickets` | Incidencias y seguimiento |
| `uc_pagos_cuotas`, `uc_pagos_vouchers` | Cuotas y vouchers |
| `uc_paquetes`, `uc_stock` | Operaciones y stock |
| `uc_qr_visitas`, `uc_personal`, `uc_mudanzas` | Accesos y mudanzas |
| `urbanConnect_mantenimientos` | Calendario preventivo |
| `urbanConnect_proveedores` | Proveedores externos |

La persistencia es local y no representa una base de datos ni autenticación productiva.

### 5.2.3 User Stories core y trazabilidad

Existen 30 HU core visibles y cubiertas por Gherkin:

| Área | Historias | Feature |
| --- | --- | --- |
| Reportes | `HU01`, `HU02`, `HU03`, `HU04`, `HU07` | `features/reportes.feature` |
| Servicios | `HU05`, `HU06`, `HU08`, `HU22`, `HU23` | `features/servicios.feature` |
| Pagos | `HU09`, `HU10`, `HU11`, `HU12`, `HU14` | `features/pagos.feature` |
| Comunidad | `HU15`, `HU17`, `HU18`, `HU19`, `HU20` | `features/comunidad.feature` |
| Reservas | `HU16`, `HU27`, `HU28`, `HU29`, `HU30` | `features/reservas.feature` |
| Usuarios y accesos | `HU21`, `HU31`, `HU32`, `HU33`, `HU34` | `features/accesos.feature` |

`features/login.feature` documenta además el flujo de autenticación y presentación responsive.

### 5.2.4 Responsive y accesibilidad

Las páginas usan Grid, Flexbox y breakpoints para escritorio, tablet y móvil. Los formularios reorganizan columnas en pantallas estrechas, la navegación pública se convierte en menú y los paneles administrativos reducen sus columnas progresivamente.

Se utilizan labels, texto alternativo, `aria-label`, `aria-current`, roles de diálogo y regiones `aria-live` en los principales resultados dinámicos.

### 5.2.5 Limitaciones conocidas

- La autenticación es local y no protege rutas mediante backend.
- Registro y algunas preferencias de configuración son demostraciones visuales.
- Los archivos se representan por nombre; no existe carga remota.
- Los escenarios Gherkin son especificaciones manuales y no tienen runner automatizado.

Estas limitaciones son adecuadas para el alcance de prototipo estático, pero deben resolverse antes de una versión productiva con datos reales.
