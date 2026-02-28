# 🇫🇷 Francophonie — Sistema de Gestión de Eventos Gastronómicos

![version](https://img.shields.io/badge/versión-2.0.0-brightgreen.svg)
![license](https://img.shields.io/badge/licencia-MIT-blue.svg)
![react](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![node](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=node.js)

---

## 📋 Descripción

Ésta es una plataforma web integral diseñada para la gestión del evento gastronómico de la Francofonía. El sistema permite administrar de forma eficiente todo el ciclo del evento: desde el registro de participantes y la generación de gafetes QR, hasta el seguimiento de visitas a estands y la recolección de encuestas de satisfacción.

El proyecto fue desarrollado por estudiantes del área de **Ingeniería en Gestión y Desarrollo de Software** de la **Universidad Tecnológica de Gutiérrez Zamora (UTGZ)**.

---

## ✨ Características Principales

| Módulo                        | Descripción                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------- |
| **Panel Principal**           | Dashboard con métricas del evento en tiempo real.                                 |
| **Registro de Participantes** | Alta de asistentes con generación automática de código QR para gafete.            |
| **Gestión de Usuarios**       | Administración y consulta de todos los participantes registrados.                 |
| **Gestión de Estands**        | Creación y control de estands (mesas) con responsables asignados.                 |
| **Escáner QR**                | Escaneo de códigos QR por cámara o imagen para registrar visitas a estands.       |
| **Encuesta de Satisfacción**  | Recolección de opiniones de los participantes sobre el evento.                    |
| **Gráficas de Información**   | Analíticas interactivas con gráficas sobre participación, visitas y satisfacción. |

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18, Chakra UI, Framer Motion, ApexCharts
- **Backend:** Node.js, Express
- **Base de Datos:** MongoDB (Mongoose)
- **Otras:** html5-qrcode, qrcode, react-router-dom, axios

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- [MongoDB](https://www.mongodb.com/) (local o en la nube)

### Pasos

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/francophonie.git
   cd francophonie
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**

   Crear un archivo `.env` en la raíz del proyecto con las variables necesarias (conexión a MongoDB, puerto del servidor, etc.).

4. **Iniciar el servidor backend:**

   ```bash
   node server/server.js
   ```

5. **Iniciar la aplicación frontend:**

   ```bash
   npm start
   ```

   La aplicación estará disponible en `http://localhost:3000`.

---

## 👥 Integrantes del Equipo

| Nombre                        | Institución | Área                                           |
| ----------------------------- | ----------- | ---------------------------------------------- |
| **Alfredo Castillo Gerónimo** | UTGZ        | Ingeniería en Gestión y Desarrollo de Software |
| **Luis Sosa Vega**            | UTGZ        | Ingeniería en Gestión y Desarrollo de Software |
| **Andrey Emilio**             | UTGZ        | Ingeniería en Gestión y Desarrollo de Software |

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

<p align="center">
  Desarrollado con ❤️ en la <strong>Universidad Tecnológica de Gutiérrez Zamora</strong>
</p>
