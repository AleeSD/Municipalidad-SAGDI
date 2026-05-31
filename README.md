# SAGDI React App — Refactor de Estructura y Páginas

Este repositorio contiene el proyecto `sagdi-app`, una aplicación React/Vite reorganizada para una arquitectura mejorada de pestañas y páginas.

## Cambios principales realizados

1. Reorganización de la estructura del proyecto
   - `sagdi-app/src/components/` para componentes reutilizables.
   - `sagdi-app/src/pages/` para cada pestaña/página del sistema.
   - `sagdi-app/src/data/` para datos mock y constantes.
   - `sagdi-app/src/utils/` para lógica ML y helpers.
   - `sagdi-app/src/styles/` para definición de tema y colores.
   - `sagdi-app/src/App.jsx` como shell principal con header, navegación y estado global.

2. Separación de responsabilidades
   - Extraído todo el bloque de `dashboard` a `sagdi-app/src/pages/Dashboard.jsx`.
   - Extraído todo el bloque de `mesapartes` a `sagdi-app/src/pages/MesaDePartes.jsx`.
   - Extraído todo el bloque de `tramites` a `sagdi-app/src/pages/Tramites.jsx`.
   - Extraído todo el bloque de `arquitectura` a `sagdi-app/src/pages/Arquitectura.jsx`.

3. Componentes reutilizables
   - `sagdi-app/src/components/Badge.jsx` para etiquetas de prioridad/estado.
   - `sagdi-app/src/components/Notification.jsx` para avisos emergentes.
   - `sagdi-app/src/components/StatCard.jsx` para tarjetas estadísticas del dashboard.

4. Datos y lógica compartida
   - `sagdi-app/src/data/mockData.js` exporta constantes como:
     - `TRAMITES_TIPOS`
     - `AREAS`
     - `ESTADOS`
     - `initialTramites`
   - `sagdi-app/src/utils/mlUtils.js` exporta funciones como:
     - `nlpClassify()`
     - `predictPriority()`
     - `generateId()`

5. Tema y estilo compartido
   - `sagdi-app/src/styles/theme.js` exporta el objeto `COLORS` utilizado por toda la app.

6. Correcciones adicionales
   - Actualizadas rutas de importación a la carpeta `components`.
   - Corregido el linting en `Badge.jsx`.
   - Verificado que `npm run build` y `npm run lint` se ejecuten correctamente dentro de `sagdi-app`.

## Archivos que contienen el diseño de la página

Los siguientes archivos contienen el diseño y la estructura visual de las vistas del sistema:

- `sagdi-app/src/App.jsx`
  - Header, navegación de pestañas y lógica global de estado.
  - Renderiza cada página según la pestaña activa.

- `sagdi-app/src/pages/Dashboard.jsx`
  - Diseño del panel de control.
  - Estadísticas, gráficos de prioridad/área y tarjetas de actividad.

- `sagdi-app/src/pages/MesaDePartes.jsx`
  - Diseño del formulario de ingreso de trámite.
  - Presentación del pipeline ML y resultado de procesamiento.

- `sagdi-app/src/pages/Tramites.jsx`
  - Tabla de trámites, filtros y vista de detalles.
  - Interfaz de actualización de estado.

- `sagdi-app/src/pages/Arquitectura.jsx`
  - Diseño de la sección de arquitectura técnica.
  - Tarjetas de módulos, stack técnico y cumplimiento.

- `sagdi-app/src/components/StatCard.jsx`
  - Componente de diseño de tarjeta estadística reutilizable.

- `sagdi-app/src/components/Badge.jsx`
  - Estilo de etiquetas para prioridades y estados.

- `sagdi-app/src/components/Notification.jsx`
  - Diseño de notificaciones emergentes.

- `sagdi-app/src/styles/theme.js`
  - Variables de color y tema usadas en todo el diseño.

## Cómo ejecutar el sistema

Desde `sagdi-app`:

```powershell
cd .\sagdi-app
npm install
npm run dev
```

Para validar producción:

```powershell
npm run build
npm run preview
```

Para ejecutar lint:

```powershell
npm run lint
```

---

Este README resume la refactorización completa y lista los archivos clave que tienes que dar a la I.A. de Stitch para que genere un nuevo diseño del sistema.
