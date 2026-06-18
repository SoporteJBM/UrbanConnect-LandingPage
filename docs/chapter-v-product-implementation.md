# Capítulo V: Product Implementation

UrbanConnect se implementa como una aplicación web estática construida con HTML5, CSS3 y JavaScript. El producto presenta un Landing Page público en `index.html` y conserva el prototipo funcional de administración en `dashboard.html` y sus módulos relacionados.

## 5.1 Software Configuration Management

La gestión de configuración de software define las herramientas, convenciones y procesos utilizados para mantener el producto reproducible y controlar sus cambios. UrbanConnect no requiere compilación ni instalación de dependencias: todos sus recursos se almacenan en el repositorio y el punto de entrada es `index.html`.

Los elementos bajo control de configuración son:

- Archivos HTML de la portada y módulos del prototipo.
- Hojas de estilo dentro de `css/`.
- Scripts básicos dentro de `js/`.
- Imágenes locales dentro de `img/`.
- Documentación técnica dentro de `docs/`.
- Pruebas de aceptación en formato Gherkin dentro de `features/`.

## 5.1.1 Software Development Environment Configuration

### Entorno de desarrollo

| Elemento | Configuración |
| --- | --- |
| Sistema operativo | Windows, macOS o Linux |
| Editor recomendado | Visual Studio Code |
| Navegadores objetivo | Chrome, Edge y Firefox en versiones actuales |
| Lenguajes | HTML5, CSS3 y JavaScript |
| Control de versiones | Git |
| Repositorio remoto | GitHub |
| Despliegue | GitHub Pages |

### Ejecución

El proyecto no utiliza React, Vue, Angular, Bootstrap, Tailwind ni un gestor de paquetes. Para ejecutarlo se abre `index.html` directamente en el navegador. Las rutas a CSS, JavaScript e imágenes son relativas para que funcionen tanto localmente como en GitHub Pages.

### Configuración responsive

El diseño se desarrolla con enfoque adaptable mediante CSS Grid, Flexbox y media queries:

- Desktop: distribución amplia y navegación horizontal.
- Tablet: reducción de columnas y espacios.
- Móvil: contenido en una columna y menú desplegable.
- Móvil compacto: botones a ancho completo y controles reorganizados.

## 5.1.2 Source Code Management

### GitHub como control de versiones

Git registra el historial local del proyecto y GitHub aloja el repositorio remoto, facilita la colaboración y permite publicar el producto con GitHub Pages. El repositorio remoto del proyecto es:

```text
https://github.com/SoporteJBM/UrbanConnect-LandingPage.git
```

Cada cambio debe revisarse antes de agregarse al historial. Los archivos generados por el sistema operativo o el editor no deben formar parte de los commits.

### Flujo GitFlow

UrbanConnect adopta una versión simplificada de GitFlow:

| Rama | Propósito |
| --- | --- |
| `main` | Código estable y listo para producción. |
| `develop` | Integración de funcionalidades terminadas. |
| `feature/*` | Desarrollo de una funcionalidad específica. |
| `release/*` | Preparación y estabilización de una versión. |
| `hotfix/*` | Correcciones urgentes sobre producción. |

Ejemplo de desarrollo de una funcionalidad:

```bash
git switch develop
git pull origin develop
git switch -c feature/responsive-landing-page
git add .
git commit -m "feat: implement responsive landing page"
git push -u origin feature/responsive-landing-page
```

Después de la revisión, la rama `feature/*` se integra en `develop`. Una rama `release/*` se utiliza para preparar la publicación y finalmente se integra en `main` y `develop`.

### Semantic Versioning

Las versiones siguen el formato `MAJOR.MINOR.PATCH`:

- `v1.0.0`: primera versión estable del Landing Page.
- `v1.1.0`: nueva funcionalidad compatible con la versión anterior.
- `v1.0.1`: corrección compatible sin nuevas funcionalidades.

La versión `MAJOR` aumenta cuando existen cambios incompatibles, `MINOR` cuando se agregan funcionalidades compatibles y `PATCH` cuando se corrigen errores.

## 5.1.3 Source Code Style Guide & Conventions

### HTML

- Utilizar elementos semánticos como `header`, `nav`, `main`, `section`, `article` y `footer`.
- Mantener un único `h1` y una jerarquía ordenada de encabezados.
- Incluir textos alternativos en imágenes informativas.
- Utilizar atributos ARIA solo cuando el elemento nativo no comunica todo el estado.
- Mantener rutas relativas para recursos internos.

### CSS

- Escribir nombres de clases en inglés y `kebab-case`, por ejemplo `.hero-section`.
- Declarar colores, tamaños y sombras reutilizables como variables en `:root`.
- Organizar estilos desde reglas generales hacia componentes y media queries.
- Evitar estilos en línea y selectores excesivamente específicos.
- Diseñar desde tamaños flexibles y verificar desktop, tablet y móvil.

### JavaScript

- Usar JavaScript solo para interacciones necesarias.
- Mantener funciones pequeñas y nombres descriptivos.
- Usar `addEventListener` para gestionar eventos.
- Comprobar que un elemento exista antes de utilizarlo.
- No introducir dependencias para comportamientos simples.

### Conventional Commits

Los mensajes de commit siguen el formato `tipo: descripción`:

- `feat: add mobile navigation`
- `fix: preserve dashboard routes`
- `docs: document GitHub Pages deployment`
- `style: improve landing page spacing`

Los tipos principales son:

| Tipo | Uso |
| --- | --- |
| `feat` | Nueva funcionalidad. |
| `fix` | Corrección de un defecto. |
| `docs` | Cambios únicamente en documentación. |
| `style` | Formato o estilos sin alterar la lógica. |

## 5.1.4 Software Deployment Configuration

### Despliegue en GitHub Pages

UrbanConnect puede desplegarse sin proceso de construcción porque `index.html` está ubicado en la raíz del repositorio.

Procedimiento:

1. Integrar y subir la versión estable a la rama `main`.
2. Abrir el repositorio en GitHub.
3. Ingresar a **Settings > Pages**.
4. En **Build and deployment**, seleccionar **Deploy from a branch**.
5. Seleccionar la rama `main` y la carpeta `/ (root)`.
6. Guardar la configuración y esperar a que GitHub publique el sitio.

La URL esperada es:

```text
https://soportejbm.github.io/UrbanConnect-LandingPage/
```

Antes de una publicación se debe comprobar que:

- `index.html` abre sin servidor local.
- No existen rutas absolutas hacia archivos del equipo de desarrollo.
- Las imágenes, hojas de estilo y scripts cargan correctamente.
- La navegación funciona con teclado y pantalla táctil.
- El contenido no se desborda en desktop, tablet o móvil.

## Pruebas de aceptación del Landing Page

Las pruebas de aceptación se expresan en Gherkin para describir el comportamiento desde la perspectiva del visitante. Los escenarios se encuentran en `features/landing-page.feature` y cubren:

- Visualización del contenido principal.
- Navegación hacia secciones internas.
- Acceso al login y registro.
- Apertura y cierre del menú móvil.
- Conservación de contenido en diferentes tamaños de pantalla.

Estas pruebas pueden ejecutarse manualmente durante el prototipo. En una etapa posterior pueden automatizarse con una herramienta compatible con Gherkin, manteniendo los mismos criterios funcionales.
