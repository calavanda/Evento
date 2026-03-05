# Dashboard del Evento: "Sabores de la Francofonía" v4.0.0

![version](https://img.shields.io/badge/versión-4.0.0-brightgreen.svg)
![security](https://img.shields.io/badge/Seguridad-Blindada-red.svg)
![react](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![vercel](https://img.shields.io/badge/Despliegue-Vercel-000000.svg?logo=vercel)

---

## 📋 Descripción

Plataforma de gestión integral para el evento gastronómico "Sabores de la Francofonía". El sistema centraliza el control de asistentes, estands y analíticas con un fuerte enfoque en la estética **Premium (Glassmorphism)** y la **Seguridad de Datos**.

La versión **4.0.0** marca un hito en la robustez del sistema, implementando un escudo contra ataques de inyección y un panel de monitoreo de seguridad en tiempo real.

---

## ✨ Características Principales

| Módulo                        | Descripción                                                           | Roles con Acceso     |
| :---------------------------- | :-------------------------------------------------------------------- | :------------------- |
| **🛡️ Blindaje de Seguridad**  | Protección activa contra inyecciones SQL/NoSQL en toda la plataforma. | Sistema (Automático) |
| **🚨 Panel de Alertas**       | Nueva vista exclusiva para monitorear intentos de acceso maliciosos.  | Admin                |
| **Control de Acceso (RBAC)**  | Sistema de roles jerárquicos (Admin, Moderador, Escaneador).          | Todos                |
| **Registro de Participantes** | Alta de asistentes con generación automática de código QR.            | Admin, Moderador     |
| **Escáner QR Dual**           | Registro de visitas mediante cámara en vivo o subida de imágenes.     | Admin, Escaneador    |
| **Analíticas de Impacto**     | Dashboard dinámico con métricas de afluencia y satisfacción.          | Admin, Moderador     |

---

## 🔐 Medidas de Seguridad Implementadas

1. **Sanitización de Datos**: Limpieza automática de cualquier entrada que contenga caracteres sospechosos (`'`, `--`, `$`, etc.).
2. **Bloqueo Inteligente**: El sistema detecta patrones de ataque y bloquea la IP del atacante con un error 403 instantly.
3. **Logging de Incidentes**: Cada intento de ataque se guarda con la IP, fecha, hora y el contenido malicioso para auditoría.
4. **CSP (Content Security Policy)**: Reglas estrictas para evitar que el navegador ejecute scripts no autorizados.

---

## 🛠️ Tecnologías y Despliegue

- **Frontend:** React 18, Chakra UI, Framer Motion, ApexCharts (Desplegado en **Vercel**).
- **Backend:** Node.js, Express (Desplegado en **Vercel Serverless**).
- **Base de Datos:** **MongoDB Atlas** (Cloud Dedicado).
- **Autenticación:** Clerk (Seguridad de identidad).

---

## 🚀 Configuración de Variables de Entorno

Para que el sistema funcione correctamente, se deben configurar las siguientes variables en Vercel:

**Frontend:**

```env
REACT_APP_API_URL=https://tu-backend.vercel.app  # Sin barra al final
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_...
```

**Backend:**

```env
MONGODB_URI=mongodb+srv://.../evento?retryWrites=true&w=majority
PORT=5001
```

---

## 👥 Equipo de Desarrollo (UTGZ)

- **Alfredo Castillo Gerónimo**
- **Luis Sosa Vega**
- **Andrey Emilio Cabriales Ramirez**

---

<p align="center">
  <b>Sistema Fortificado v1.0.5</b> | 2026 | Universidad Tecnológica de Gutiérrez Zamora
</p>
