# 🚀 Backend - Plataforma de Gestión de Proyectos ESFOT

> **Trabajo de Integración Curricular**
> Tecnología Superior en Desarrollo de Software

Este repositorio contiene el código fuente del **Backend (API RESTful)** desarrollado para la gestión, publicación y administración de proyectos académicos y extracurriculares.

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
3. [Características Principales](#-características-principales)
4. [Instalación y Configuración](#-instalación-y-configuración)
5. [Variables de Entorno](#-variables-de-entorno)
6. [Documentación de la API](#-documentación-de-la-api)
7. [Roles y Permisos](#-roles-y-permisos)
8. [Autores](#-autores)

---

## 📖 Descripción del Proyecto

Este sistema permite a los estudiantes de la **ESFOT** publicar sus proyectos académicos, generando un portafolio digital visible para la comunidad. El backend gestiona la autenticación segura, la subida de imágenes a la nube, la interacción social (likes/comentarios) y un panel administrativo para la gestión de usuarios y aprobación de contenidos.

---

## 🛠 Tecnologías Utilizadas

* **Entorno:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Base de Datos:** [MongoDB](https://www.mongodb.com/) (con Mongoose)
* **Autenticación:** JWT (JSON Web Tokens) y OAuth (Google/Facebook)
* **Almacenamiento de Imágenes:** [Cloudinary](https://cloudinary.com/)
* **Emails:** Nodemailer (Confirmación de cuenta y recuperación de contraseña)

---

## ✨ Características Principales

### 🔐 Seguridad y Autenticación
* Registro y Login de usuarios (Estudiantes y Administradores).
* Confirmación de cuenta vía correo electrónico.
* Recuperación de contraseña mediante token seguro.
* Login social con **Google** y **Facebook**.

### 📂 Gestión de Proyectos
* **CRUD Completo:** Crear, Leer, Actualizar y Eliminar proyectos.
* **Estados:** Los proyectos inician en `en_progreso` y requieren aprobación (`publicado`).
* **Multimedia:** Carga de imágenes optimizadas a Cloudinary.
* **Filtros:** Búsqueda por carrera, categoría (académico/extracurricular) y etiquetas.

### 💬 Interacción Social
* Sistema de **Likes**.
* Sistema de **Comentarios** en los proyectos.
* Contador de vistas.

### 👑 Panel de Administración
* Dashboard con estadísticas (Estudiantes por nivel/carrera).
* Aprobación y publicación de proyectos.
* Gestión y listado de estudiantes registrados.

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/nombre-repo-backend.git](https://github.com/tu-usuario/nombre-repo-backend.git)
    cd nombre-repo-backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto y completa las variables (ver sección de abajo).

4.  **Ejecutar el servidor:**
    ```bash
    # Modo desarrollo (con nodemon)
    npm run dev

    # Modo producción
    npm start
    ```

El servidor iniciará en: `http://localhost:3000`

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz y configura las siguientes claves:

```env
PORT=3000
MONGO_URI=tu_string_de_conexion_mongodb
JWT_SECRET=tu_secreto_para_jwt
CLIENT_URL=http://localhost:5173  # URL de tu Frontend

# Cloudinary (Imágenes)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email (Nodemailer)
EMAIL_USER=...
EMAIL_PASS=...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Facebook OAuth
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
