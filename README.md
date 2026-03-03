# Dashboard del Evento: "Sabores de la Francofonía"

![version](https://img.shields.io/badge/versión-3.0.0-brightgreen.svg)
![license](https://img.shields.io/badge/licencia-MIT-blue.svg)
![react](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![node](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=node.js)
![clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF.svg?logo=clerk)

---

## 📋 Descripción

Ésta es una plataforma web integral diseñada para la gestión del evento gastronómico "Sabores de la Francofonía". El sistema permite administrar de forma eficiente todo el ciclo del evento: desde el registro de participantes y la generación de gafetes QR, hasta la gestión de estands y el seguimiento de analíticas en tiempo real.

Esta versión **3.0.0** introduce un sistema robusto de **Control de Acceso Basado en Roles (RBAC)**, autenticación segura mediante **Clerk**, y una estructura de código optimizada y limpia (sin componentes redundantes).

El proyecto fue desarrollado por estudiantes de la **Universidad Tecnológica de Gutiérrez Zamora (UTGZ)**.

---

## ✨ Características Principales

| Módulo                        | Descripción                                                               | Roles con Acceso                      |
| :---------------------------- | :------------------------------------------------------------------------ | :------------------------------------ |
| **Control de Acceso (RBAC)**  | Sistema de roles jerárquicos para proteger la información.                | Todos                                 |
| **Gestión de Admins**         | CRUD para gestionar personal con roles: admin, moderador o escaneador.    | Admin                                 |
| **Registro de Participantes** | Alta de asistentes con generación automática de código QR (API goQR.me).  | Admin, Moderador                      |
| **Gestión de Participantes**  | Control total (Ver, Editar, Eliminar) de la base de datos de asistentes.  | Admin, Moderador                      |
| **Gestión de Estands**        | Administración de los puestos del evento, responsables y ubicación.       | Admin, Moderador                      |
| **Escáner QR Dual**           | Registro de visitas mediante cámara en vivo o subida de imágenes.         | Admin, Escaneador                     |
| **Analíticas e Informes**     | Gráficas dinámicas de visitas y satisfacción en tiempo real (ApexCharts). | Admin, Moderador, Escaneador, Público |
| **Landing Page Premium**      | Página de inicio moderna con diseño Glassmorphism altamente optimizada.   | Todos                                 |

---

## 🔐 Sistema de Roles

- **Admin**: Acceso total a todas las secciones, incluyendo la gestión de otros administradores y configuración del sistema.
- **Moderador**: Puede gestionar participantes y estands, y ver estadísticas. No tiene acceso a la gestión de otros administradores.
- **Escaneador**: Acceso exclusivo al escáner de QR y registro de encuestas/visitas.
- **Público**: Acceso limitado únicamente a la visualización de analíticas generales de forma anónima.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18, Chakra UI, Framer Motion, ApexCharts, Clerk React.
- **Backend:** Node.js, Express, Mongoose.
- **Base de Datos:** MongoDB.
- **Despliegue:** Railway (Backend y DB).

---

## 🚀 Instalación y Ejecución

El proyecto está optimizado para funcionar en un entorno de dos capas (Frontend/Backend).

### Variables de Entorno (.env)

**Frontend:**

```env
REACT_APP_API_URL=https://tu-api-en-railway.app
REACT_APP_API_URL_LOCAL=http://localhost:5001
REACT_APP_CLERK_PUBLISHABLE_KEY=tu_public_key_clerk
```

**Backend:**

```env
PORT=5001
MONGODB_URI=tu_url_de_mongodb
```

### Ejecución Local

1. Instalar dependencias en ambas carpetas: `npm install`
2. Ejecutar backend: `npm run dev`
3. Ejecutar frontend: `npm start`

---

## 👥 Integrantes del Equipo (UTGZ)

| Nombre                              | Institución | Área                                           |
| :---------------------------------- | :---------- | :--------------------------------------------- |
| **Alfredo Castillo Gerónimo**       | UTGZ        | Ingeniería en Gestión y Desarrollo de Software |
| **Luis Sosa Vega**                  | UTGZ        | Ingeniería en Gestión y Desarrollo de Software |
| **Andrey Emilio Cabriales Ramirez** | UTGZ        | Ingeniería en Gestión y Desarrollo de Software |

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**.

---

<p align="center">
  Optimizado y Refactorizado con ❤️ | 2026
</p>
