# 🎵 MyBandLab

Plataforma social para músicos. Conecta, crea y comparte música.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4)
![Tests](https://img.shields.io/badge/tests-42%20passing-brightgreen)

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Requisitos Previos](#requisitos-previos)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Comandos Disponibles](#comandos-disponibles)
- [Variables de Entorno](#variables-de-entorno)
- [Pruebas](#pruebas)
- [PWA](#pwa)
- [Estado del Proyecto](#estado-del-proyecto)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## 📝 Descripción

**MyBandLab** es una plataforma social diseñada para músicos donde pueden:

- 🎸 Crear perfiles de artista
- 👥 Formar y gestionar grupos musicales
- 🔍 Descubrir nuevos talentos
- 👑 Administrar la plataforma (moderadores)
- 📱 Instalar la app como PWA

### Backend

El proyecto está conectado a un backend Spring Boot en `http://localhost:9000` que provee:

- API GraphQL para consultas
- Endpoints REST para autenticación
- JWT para autenticación

---

## 📋 Requisitos Previos

| Herramienta       | Versión     |
| ----------------- | ----------- |
| Node.js           | 18+         |
| npm               | 9+          |
| Backend MyBandLab | Puerto 9000 |

---

## 🛠️ Tecnologías Utilizadas

| Tecnología           | Versión | Propósito            |
| -------------------- | ------- | -------------------- |
| **React**            | 18.x    | UI Framework         |
| **TypeScript**       | 5.x     | Tipado estático      |
| **Vite**             | 8.x     | Bundler y dev server |
| **TailwindCSS**      | 4.x     | Estilos y diseño     |
| **Apollo Client**    | 3.x     | Cliente GraphQL      |
| **React Router DOM** | 6.x     | Navegación           |
| **Vitest**           | 4.x     | Pruebas unitarias    |
| **ESLint**           | 9.x     | Linting              |
| **Prettier**         | 3.x     | Formateo             |
| **Lucide React**     | -       | Iconos               |
| **Vite PWA**         | -       | Progressive Web App  |

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd my-band-lab-frontend
2. Instalar dependencias
bash
npm install
3. Configurar variables de entorno
Crear archivo .env en la raíz:

env
VITE_API_URL=/graphql
VITE_WS_URL=ws://localhost:9000/subscriptions
4. Ejecutar en desarrollo
bash
npm run dev
La aplicación estará disponible en http://localhost:5173

5. Construir para producción
bash
npm run build
npm run preview
📁 Estructura del Proyecto
text
my-band-lab-frontend/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/              # Componentes UI básicos
│   │   │   ├── Button.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── Admin/           # Componentes de administración
│   │   │   ├── ArtistVerification.tsx
│   │   │   ├── GroupVerification.tsx
│   │   │   └── UserManagement.tsx
│   │   ├── ArtistCard.tsx
│   │   ├── ArtistList.tsx
│   │   ├── GroupCard.tsx
│   │   ├── GroupList.tsx
│   │   ├── SearchBar.tsx
│   │   ├── GenreFilter.tsx
│   │   ├── Layout.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── AdminRoute.tsx
│   │   └── ...
│   │
│   ├── pages/               # Páginas de la aplicación
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ArtistsPage.tsx
│   │   ├── ArtistDetailPage.tsx
│   │   ├── GroupsPage.tsx
│   │   ├── GroupDetailPage.tsx
│   │   ├── CreateGroupPage.tsx
│   │   ├── EditGroupPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   └── AdminLoginPage.tsx
│   │
│   ├── hooks/               # Hooks personalizados
│   │   ├── useAuth.ts
│   │   ├── useArtists.ts
│   │   ├── useGroups.ts
│   │   ├── useSearchArtists.ts
│   │   ├── useSearchGroups.ts
│   │   ├── useArtistsByGenre.ts
│   │   ├── useGroupsByGenre.ts
│   │   └── useNotification.ts
│   │
│   ├── services/            # Servicios
│   │   └── apollo.ts        # Configuración Apollo Client
│   │
│   ├── graphql/             # GraphQL
│   │   ├── queries/         # Queries
│   │   ├── mutations/       # Mutations
│   │   └── fragments/       # Fragments
│   │
│   ├── types/               # Definiciones TypeScript
│   │   ├── enums.ts
│   │   ├── user.types.ts
│   │   ├── artist.types.ts
│   │   ├── group.types.ts
│   │   └── ...
│   │
│   ├── context/             # Contextos React
│   │   └── NotificationContext.tsx
│   │
│   ├── constants/           # Constantes
│   │   └── index.ts
│   │
│   ├── utils/               # Utilidades
│   │   └── cn.ts
│   │
│   ├── test/                # Pruebas unitarias
│   │   ├── setup.ts
│   │   └── __tests__/
│   │       ├── basic.test.ts
│   │       ├── Button.test.tsx
│   │       ├── ArtistCard.test.tsx
│   │       ├── GroupCard.test.tsx
│   │       ├── SearchBar.test.tsx
│   │       ├── GenreFilter.test.tsx
│   │       ├── LoadingSpinner.test.tsx
│   │       ├── BottomNavigation.test.tsx
│   │       ├── ProtectedRoute.test.tsx
│   │       └── useAuth.test.ts
│   │
│   ├── assets/              # Imágenes y recursos
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
│
├── public/                  # Archivos públicos
│   └── icons/               # Iconos PWA
│
├── .env                     # Variables de entorno
├── .eslintrc.cjs            # Configuración ESLint
├── .prettierrc              # Configuración Prettier
├── vite.config.ts           # Configuración Vite
├── tsconfig.json            # Configuración TypeScript
├── package.json             # Dependencias
└── README.md                # Este archivo
✨ Funcionalidades
👤 Usuarios
Funcionalidad	Estado
Registro de usuarios	✅
Inicio de sesión con JWT	✅
Editar perfil	✅
Roles (USER / ARTIST / ADMIN)	✅
🎸 Artistas
Funcionalidad	Estado
Listado paginado	✅
Búsqueda por nombre	✅
Filtro por género	✅
Ver detalle completo	✅
Crear perfil de artista	✅
Verificar artistas (admin)	✅
👥 Grupos Musicales
Funcionalidad	Estado
Crear grupo	✅
Listado paginado	✅
Búsqueda por nombre	✅
Filtro por género	✅
Ver detalle completo	✅
Gestionar miembros (fundador)	✅
Editar grupo (fundador)	✅
Eliminar grupo (fundador)	✅
Verificar grupos (admin)	✅
👑 Administración
Funcionalidad	Estado
Dashboard admin	✅
Gestionar usuarios (cambiar rol/eliminar)	✅
Verificar artistas pendientes	✅
Verificar grupos pendientes	✅
⚡ Optimizaciones
Funcionalidad	Estado
Lazy loading (code splitting)	✅
React.memo en componentes	✅
useCallback/useMemo en hooks	✅
PWA (Progressive Web App)	✅
ESLint + Prettier	✅
Pruebas unitarias (42 tests)	✅
📦 Comandos Disponibles
Comando	Descripción
npm run dev	Inicia servidor de desarrollo
npm run build	Construye para producción
npm run preview	Vista previa de producción
npm run lint	Ejecuta ESLint
npm run lint:fix	Corrige errores de linting
npm run format	Formatea código con Prettier
npm run type-check	Verifica tipos TypeScript
npm run test	Ejecuta pruebas en modo watch
npm run test:run	Ejecuta pruebas una vez
npm run test:coverage	Muestra cobertura de pruebas
npm run test:ui	Interfaz UI de Vitest
🔧 Variables de Entorno
Variable	Descripción	Valor por defecto
VITE_API_URL	URL del GraphQL endpoint	/graphql
VITE_WS_URL	URL WebSocket para subscriptions	ws://localhost:9000/subscriptions
🧪 Pruebas
El proyecto tiene 42 pruebas unitarias que cubren:

Componentes UI (Button, LoadingSpinner)

Componentes de visualización (ArtistCard, GroupCard)

Componentes de interacción (SearchBar, GenreFilter)

Componentes de navegación (BottomNavigation, ProtectedRoute)

Hooks críticos (useAuth)

Ejecutar pruebas
bash
# Ejecutar todas las pruebas
npm run test:run

# Modo watch (se ejecutan automáticamente al cambiar código)
npm run test

# Ver cobertura de código
npm run test:coverage

# Interfaz UI interactiva
npm run test:ui
Resultado actual
text
✓ src/test/__tests__/basic.test.ts (1 test)
✓ src/test/__tests__/Button.test.tsx (6 tests)
✓ src/test/__tests__/ArtistCard.test.tsx (4 tests)
✓ src/test/__tests__/SearchBar.test.tsx (4 tests)
✓ src/test/__tests__/GenreFilter.test.tsx (5 tests)
✓ src/test/__tests__/GroupCard.test.tsx (8 tests)
✓ src/test/__tests__/LoadingSpinner.test.tsx (5 tests)
✓ src/test/__tests__/ProtectedRoute.test.tsx (2 tests)
✓ src/test/__tests__/BottomNavigation.test.tsx (3 tests)
✓ src/test/__tests__/useAuth.test.ts (4 tests)

Test Files  10 passed (10)
      Tests  42 passed (42)
📱 PWA (Progressive Web App)
La aplicación es instalable como PWA. Características:

✅ Service Worker registrado

✅ Manifest configurado

✅ Caché de recursos estáticos

✅ Funcionamiento offline básico

✅ Iconos en múltiples tamaños

Instalación
Construir la app: npm run build

Vista previa: npm run preview

En Chrome: Haz clic en el ícono de instalación en la barra de direcciones

En Android: "Añadir a pantalla de inicio"

En iOS: "Compartir" → "Añadir a pantalla de inicio"

📊 Estado del Proyecto
EPIC	Historias	Estado
EPIC 1: Configuración Inicial	HU-01 a HU-09	✅ Completado
EPIC 2: Autenticación	HU-10 a HU-15	✅ Completado
EPIC 3: Gestión de Artistas	HU-16 a HU-21	✅ Completado
EPIC 4: Gestión de Grupos	HU-23 a HU-32	✅ Completado
EPIC 5: Administración	HU-33 a HU-36	✅ Completado
EPIC 6: Testing y Optimización	HU-40 a HU-42	✅ Completado
Historias Completadas: 34 de 41
Tests: 42 pasando
🤝 Contribución
Fork el proyecto

Crea tu rama (git checkout -b feature/nueva-funcionalidad)

Commit tus cambios (git commit -m 'feat: agregar nueva funcionalidad')

Push a la rama (git push origin feature/nueva-funcionalidad)

Abre un Pull Request

Convenciones de código
ESLint: npm run lint

Prettier: npm run format

TypeScript: npm run type-check

📝 Licencia
MIT

👨‍💻 Autor
Desarrollado como parte del proyecto MyBandLab

🙏 Agradecimientos
React y la comunidad open source

TailwindCSS por el sistema de diseño

Vite por la velocidad de desarrollo

```
