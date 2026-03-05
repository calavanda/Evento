# Dashboard del Evento: "Sabores de la Francofonía" v1.1

![version](https://img.shields.io/badge/versión-1.1-brightgreen.svg)
![security](https://img.shields.io/badge/Seguridad-Blindada-red.svg)
![react](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF.svg)
![mongodb](https://img.shields.io/badge/DB-MongoDB_Atlas-47A248.svg?logo=mongodb)
![vercel](https://img.shields.io/badge/Despliegue-Vercel-000000.svg?logo=vercel)

---

## 📋 Descripción

Plataforma de gestión integral para el evento gastronómico "Sabores de la Francofonía". El sistema centraliza el control de participantes, estands, analíticas y comunicación, con un fuerte enfoque en la estética **Premium (Glassmorphism)**, la **Seguridad de Datos** y la **automatización de procesos**.

---

## ✨ Módulos del Sistema

| Módulo                               | Descripción                                                                                                                      | Roles con Acceso  |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :---------------- |
| **🏠 Dashboard Principal**           | Vista general con métricas clave del evento en tiempo real.                                                                      | Admin, Moderador  |
| **👤 Registro de Participantes**     | Alta individual con generación automática de QR y vista previa del gafete imprimible.                                            | Admin, Moderador  |
| **📥 Importación desde Excel**       | Carga masiva de participantes desde un archivo `.xlsx` / `.xls` con mapeo flexible de columnas.                                  | Admin, Moderador  |
| **📧 Envío Masivo de QR por Correo** | Selección de participantes y envío personalizado de su código QR por email (vía Resend API).                                     | Admin             |
| **🗂️ Gestión de Participantes**      | Tabla de todos los asistentes con búsqueda, filtros y acciones individuales.                                                     | Admin, Moderador  |
| **🏪 Gestión de Estands**            | CRUD completo de estands: alta, edición en línea, y eliminación con diálogo de confirmación.                                     | Admin, Moderador  |
| **📊 Analíticas de Impacto**         | Dashboard de 4 gráficas interactivas: visitas únicas vs totales, picos horarios por stand, picos generales y satisfacción media. | Admin, Moderador  |
| **❔ Encuestas**                     | Recolección de calificaciones de los visitantes por stand.                                                                       | Admin, Escaneador |
| **📷 Escáner QR Dual**               | Registro de visitas mediante cámara en vivo o subida de imagen.                                                                  | Admin, Escaneador |
| **🚨 Panel de Alertas**              | Monitoreo de intentos de acceso maliciosos e incidentes de seguridad.                                                            | Admin             |
| **👥 Gestión de Administradores**    | Control de usuarios con acceso al dashboard.                                                                                     | Admin             |

---

## 🆕 Nuevas Funcionalidades (v1.1)

### 📥 Importación Masiva desde Excel

- Sube un archivo `.xlsx` o `.xls` directamente desde el formulario de registro.
- El sistema mapea automáticamente columnas con nombres flexibles (ej. `Nombre`, `nombre`, `Apellido Paterno`, `paterno`, `Email`, `correo`...).
- Muestra un resumen con el número de registros exitosos y errores al finalizar.

### 📧 Envío de QR por Correo Electrónico

- Vista dedicada para la selección individual o masiva de participantes.
- Composición de correos con **asunto y mensaje personalizado** mediante modal.
- El código QR de cada participante se **incrusta automáticamente** en el cuerpo del email.
- Powered por **Nodemailer** con **Gmail SMTP** (App Password de Google).
- Los participantes sin correo registrado se muestran deshabilitados automáticamente.

### 🎨 Gafete Imprimible

- Tras cada registro exitoso, se genera una vista previa del gafete oficial del evento.
- El gafete incluye logos institucionales (Francofonía y UTGZ), nombre completo, municipio y código QR en color.
- Botón de **Imprimir** genera una ventana de impresión optimizada directamente en el navegador.

### 📊 Analíticas Avanzadas

- **Gráfica de barras**: Visitas totales vs. visitantes únicos por stand.
- **Gráfica de área por stand**: Picos de visitas hora a hora, comparativa de todos los estands en un solo gráfico.
- **Gráfica de área general**: Suma total de visitas del evento por hora.
- **Gráfica de satisfacción**: Calificación media (1-5 estrellas) por stand en gráfica de barras horizontales.
- Soporte de **zoom interactivo** y botón de reinicio en cada gráfica.

---

## 🔐 Medidas de Seguridad Implementadas

1. **Autenticación con Clerk**: Gestión de identidad robusta con soporte para OAuth (Google, etc.) y nonces de seguridad.
2. **Sanitización de Datos**: Limpieza automática de entradas que contengan caracteres sospechosos (`'`, `--`, `$`, etc.).
3. **Bloqueo Inteligente**: Detección de patrones de ataque con respuesta de error 403.
4. **Logging de Incidentes**: Cada intento de ataque se registra con IP, fecha, hora y payload para auditoría.
5. **CSP (Content Security Policy)**: Cabeceras estrictas configuradas en `public/index.html` para prevenir ejecución de scripts no autorizados.

---

## 🛠️ Tecnologías

| Capa              | Tecnología                                       |
| :---------------- | :----------------------------------------------- |
| **Frontend**      | React 18, Chakra UI, Framer Motion, ApexCharts   |
| **Backend**       | Node.js, Express                                 |
| **Base de Datos** | MongoDB Atlas                                    |
| **Autenticación** | Clerk                                            |
| **Email**         | Nodemailer + Gmail SMTP (App Password)           |
| **Despliegue**    | Vercel (Frontend + Backend, proyectos separados) |
| **Generación QR** | api.qrserver.com                                 |
| **Importación**   | SheetJS (xlsx)                                   |

---

## 🚀 Variables de Entorno

**Frontend (`.env`):**

```env
REACT_APP_API_URL=https://tu-backend.up.vercel.app
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_...
```

**Backend (`.env`):**

```env
MONGODB_URI=mongodb+srv://.../evento?retryWrites=true&w=majority
PORT=5001
EMAIL_USER=tu-correo@gmail.com
EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

---

## 👥 Equipo de Desarrollo

- **Alfredo Castillo Gerónimo**
- **Luis Sosa Vega**
- **Andrey Emilio Cabriales Ramirez**

---

<p align="center">
  <b>Sistema Fortificado v1.1</b> | 2026 | Hecho por estudiantes de la Universidad Tecnológica de Gutiérrez Zamora
</p>
