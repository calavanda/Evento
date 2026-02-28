# Dashboard del Evento: "Sabores de la Francofonía"

![version](https://img.shields.io/badge/versión-2.1.0-brightgreen.svg)
![license](https://img.shields.io/badge/licencia-MIT-blue.svg)
![react](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![node](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=node.js)
![clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF.svg?logo=clerk)

---

## 📋 Descripción

Ésta es una plataforma web integral diseñada para la gestión del evento gastronómico "Sabores de la Francofonía". El sistema permite administrar de forma eficiente todo el ciclo del evento: desde el registro de participantes y la generación de gafetes QR, hasta la gestión de estands y el seguimiento de analíticas en tiempo real.

Esta versión ha sido actualizada con una interfaz más moderna, autenticación segura mediante **Clerk** y capacidades completas de administración (CRUD) para todos los módulos.

El proyecto fue desarrollado por estudiantes del área de **Ingeniería en Gestión y Desarrollo de Software** de la **Universidad Tecnológica de Gutiérrez Zamora (UTGZ)**.

---

## ✨ Características Principales

| Módulo                        | Descripción                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| **Dashboard Rebrandeado**     | Interfaz moderna con branding personalizado ("Dashboard" con gradientes).           |
| **Autenticación con Clerk**   | Acceso seguro para administradores con bienvenida personalizada.                    |
| **Registro de Participantes** | Alta de asistentes con generación automática de código QR para gafete.              |
| **Gestión de Participantes**  | CRUD completo (Ver, Editar, Eliminar) de todos los asistentes.                      |
| **Gestión de Estands**        | CRUD completo (Alta, Edición, Eliminación) de estands con responsables y ubicación. |
| **Escáner QR**                | Registro de visitas mediante escaneo de códigos QR (cámara o imagen).               |
| **Analíticas e Informes**     | Gráficas interactivas y estadísticas generales del evento en tiempo real.           |

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18, Chakra UI, Framer Motion, ApexCharts, Clerk React.
- **Backend:** Node.js, Express (Repositorio independiente: `EventoBackend`).
- **Base de Datos:** MongoDB (Mongoose).
- **Despliegue:** Railway (Backend) y Vercel (Frontend).

---

## 🚀 Instalación y Ejecución

El proyecto está dividido en dos repositorios para facilitar el despliegue y escalabilidad.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), Railway o local.
- Cuenta de [Clerk](https://clerk.com/) para la autenticación.

### Configuración del Frontend

1. **Instalar dependencias:** `npm install`
2. **Variables de Entorno:** Configura el archivo `.env`:
   ```env
   REACT_APP_API_URL=https://tu-backend.railway.app
   REACT_APP_API_URL_LOCAL=http://localhost:5001
   REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```
3. **Ejecutar:** `npm start` (o `npm run dev`)

### Configuración del Backend

1. Navega al repositorio `EventoBackend`. Enlace: https://github.com/calavanda/EventoBackend
2. **Instalar dependencias:** `npm install`
3. **Variables de Entorno:** Configura el archivo `.env`:
   ```env
   PORT=5001
   MONGODB_URI=mongodb+srv://...
   ```
4. **Ejecutar:** `npm run dev`


## Despliegue del Backend en Railway

1. Ve a [Railway](https://railway.app/) y crea un nuevo proyecto.
2. Importa el repositorio `EventoBackend`.
3. Configura las variables de entorno:
   ```env
   PORT=8080
   MONGODB_URI=mongodb+srv://...
   ```
4. Agrega una base de datos de MongoDB.
5. Despliega el proyecto.
6. Copia MONGODB_URI y pégala en la variable de entorno `MONGODB_URI` del frontend y tambien en el backend.
7. Copia la URL del despliegue y pégala en la variable de entorno `REACT_APP_API_URL` del frontend.

---

## 👥 Integrantes del Equipo

| Nombre                        | Institución | Área                                           |
| ----------------------------- | ----------- | ---------------------------------------------- |
| **Alfredo Castillo Gerónimo** | UTGZ        | Ingeniería en Gestión y Desarrollo de Software |
| **Luis Sosa Vega**            | UTGZ        | Ingeniería en Gestión y Desarrollo de Software |
| **Andrey Emilio Cabriales Ramirez** | UTGZ        | Ingeniería en Gestión y Desarrollo de Software |

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

<p align="center">
  Desarrollado con ❤️ en la <strong>Universidad Tecnológica de Gutiérrez Zamora</strong>
</p>
