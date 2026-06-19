# UrbanConnect

UrbanConnect es un prototipo web para la gestión de comunidades residenciales. Incluye un inicio de sesión y módulos de administración para comunicados, reportes, servicios, encuestas, reservas, pagos, documentos y usuarios.

## Tecnologías

- HTML5 semántico
- CSS3 con variables y media queries
- JavaScript básico
- Git y GitHub
- GitHub Pages

No requiere frameworks, dependencias, instalación ni proceso de compilación.

## Ejecución local

1. Descarga o clona el repositorio.
2. Abre `index.html` en un navegador moderno.

Puedes iniciar la experiencia de prueba desde `index.html` con estas credenciales:

```text
Usuario: admin
Contraseña: admin123
```

Después del acceso, el usuario es dirigido a `dashboard.html`.

## Estructura principal

```text
UrbanConnect/
├── index.html                         # Inicio de sesión
├── dashboard.html                     # Panel administrativo
├── registro.html                      # Registro
├── css/
│   └── login.css                      # Estilos del inicio de sesión
├── js/
│   └── login.js                       # Validación y acceso
├── img/                               # Recursos gráficos locales
├── docs/
│   └── chapter-v-product-implementation.md
└── features/
    └── login.feature
```

## Responsive design

El inicio de sesión se adapta a:

- Desktop: ancho mayor a `1024px`.
- Tablet: entre `769px` y `1024px`.
- Móvil: `768px` o menos, con navegación desplegable.
- Móvil compacto: `520px` o menos.

## Convenciones

- Clases CSS en inglés y formato `kebab-case`.
- Variables CSS descriptivas dentro de `:root`.
- JavaScript con nombres claros, funciones pequeñas y eventos simples.
- Commits bajo Conventional Commits: `feat`, `fix`, `docs` y `style`.
- Versiones bajo Semantic Versioning.

## Documentación

La configuración de desarrollo, GitFlow, versionado, despliegue y criterios de aceptación están descritos en [docs/chapter-v-product-implementation.md](docs/chapter-v-product-implementation.md).

Los escenarios de aceptación del inicio de sesión se encuentran en [features/login.feature](features/login.feature).

## Despliegue

El proyecto puede publicarse directamente con GitHub Pages desde la rama `main` y la carpeta raíz `/`. No necesita variables de entorno ni secretos.
