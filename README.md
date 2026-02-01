Markdown
# 🚀 Backend - Plataforma de Gestión de Proyectos ESFOT

> **Trabajo de Integración Curricular**
> Tecnología Superior en Desarrollo de Software

Este repositorio contiene el código fuente del **Backend (API RESTful)** desarrollado para la gestión, publicación y administración de proyectos académicos y extracurriculares.

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
3. [Instalación y Configuración](#-instalación-y-configuración)
4. [Variables de Entorno](#-variables-de-entorno)
5. [Documentación de la API (Endpoints)](#-documentación-de-la-api-endpoints)
    - [Autenticación](#1-autenticación)
    - [Proyectos Públicos](#2-proyectos-públicos)
    - [Gestión de Proyectos (Privado)](#3-gestión-de-proyectos-privado)
    - [Administración](#4-administración)
6. [Estructura del Proyecto](#-estructura-del-proyecto)
7. [Autores](#-autores)

---

## 📖 Descripción del Proyecto

Este sistema permite a los estudiantes de la **ESFOT** publicar sus proyectos académicos, generando un portafolio digital visible para la comunidad. El backend gestiona la autenticación segura, la subida de imágenes a la nube (Cloudinary), la interacción social (likes/comentarios) y un panel administrativo para moderar contenidos antes de su publicación.

---

## 🛠 Tecnologías Utilizadas

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Base de Datos:** [MongoDB](https://www.mongodb.com/) + Mongoose
* **Seguridad:** JWT (JSON Web Tokens) & Bcrypt
* **Almacenamiento:** [Cloudinary](https://cloudinary.com/)
* **Emails:** Nodemailer

---

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/nombre-repo-backend.git](https://github.com/tu-usuario/nombre-repo-backend.git)
   cd nombre-repo-backend
Instalar dependencias:

Bash
npm install
Configurar Variables de Entorno: Crea un archivo .env en la raíz (ver sección de variables).

Ejecutar el servidor:

Bash
npm run dev  # Modo desarrollo
🔑 Variables de Entorno
Crea un archivo .env con las siguientes claves:

Fragmento de código
PORT=3000
MONGO_URI=tu_string_de_conexion_mongodb
JWT_SECRET=palabra_secreta_jwt
CLIENT_URL=http://localhost:5173

# Cloudinary (Imágenes)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email & OAuth (Opcional para pruebas locales básicas)
EMAIL_USER=...
EMAIL_PASS=...
GOOGLE_CLIENT_ID=...
📚 Documentación de la API (Endpoints)
A continuación se detallan los endpoints principales, qué datos enviar y qué respuesta esperar.

1. Autenticación
🔐 Registro de Usuario
Crea una nueva cuenta de estudiante.

Método: POST

URL: /api/auth/registro

Body (JSON):

JSON
{
  "nombre": "Luis",
  "apellido": "Ochoa",
  "cedula": "1234567890",
  "email": "luis.ochoa@epn.edu.ec",
  "password": "password123",
  "carrera": "Desarrollo de Software",
  "nivel": 5
}
Respuesta (200 OK):

JSON
{
  "success": true,
  "msg": "Revisa tu correo electrónico para confirmar tu cuenta"
}
🔐 Iniciar Sesión (Login)
Autentica al usuario y devuelve un token JWT.

Método: POST

URL: /api/auth/login

Body (JSON):

JSON
{
  "email": "luis.ochoa@epn.edu.ec",
  "password": "password123"
}
Respuesta (200 OK):

JSON
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "rol": "estudiante",
  "nombre": "Luis",
  "apellido": "Ochoa",
  "_id": "65d8e3b7a1c9d2f4e8b6c1d3"
}
2. Proyectos Públicos
🌍 Listar Proyectos
Obtiene todos los proyectos con estado publicado.

Método: GET

URL: /api/proyectos

Query Params (Opcional): ?page=1, ?limit=10, ?carrera=Software

Respuesta (200 OK):

JSON
{
  "success": true,
  "data": [
    {
      "_id": "65d8f7a9...",
      "titulo": "Sistema de Gestión",
      "descripcion": "Plataforma web para...",
      "imagenes": ["[https://res.cloudinary.com/](https://res.cloudinary.com/)..."],
      "autor": { "nombre": "Luis", "apellido": "Ochoa" },
      "vistas": 150,
      "likes": ["id_usuario1", "id_usuario2"]
    }
  ],
  "pagination": { "total": 10, "pages": 1 }
}
🌍 Ver Proyecto por ID
Obtiene el detalle completo de un proyecto.

Método: GET

URL: /api/proyectos/:id

Respuesta (200 OK):

JSON
{
  "success": true,
  "data": {
    "_id": "65d8f7a9...",
    "titulo": "Sistema de Gestión",
    "tecnologias": ["React", "Node.js"],
    "comentarios": [
        { "texto": "Buen proyecto", "estudiante": "Maria" }
    ]
  }
}
3. Gestión de Proyectos (Privado)
Nota: Estos endpoints requieren el header Authorization: Bearer <TOKEN>

📂 Crear Proyecto
Sube un nuevo proyecto (inicialmente en estado en_progreso).

Método: POST

URL: /api/proyectos

Body (Multipart/Form-Data):

titulo: "Mi Proyecto Final"

descripcion: "Descripción detallada..."

categoria: "academico"

carrera: "Desarrollo de Software"

fechaInicio: "2024-01-15"

imagen: (Archivo de imagen)

Respuesta (201 Created):

JSON
{
  "success": true,
  "message": "Proyecto creado exitosamente. Está en estado 'en_progreso'...",
  "data": {
    "_id": "...",
    "titulo": "Mi Proyecto Final",
    "estado": "en_progreso"
  }
}
❤️ Dar Like / Quitar Like
Método: POST / DELETE

URL: /api/proyectos/:id/like

Respuesta:

JSON
{
  "success": true,
  "message": "Like agregado",
  "likes": 5
}
4. Administración
Nota: Requiere token de usuario con rol admin.

👑 Publicar Proyecto
Cambia el estado de un proyecto de en_progreso a publicado.

Método: PUT

URL: /api/admin/proyectos/:id/publicar

Respuesta:

JSON
{
  "success": true,
  "message": "Proyecto publicado exitosamente",
  "data": { "estado": "publicado" }
}
👑 Listar Estudiantes
Obtiene lista de usuarios registrados para gestión.

Método: GET

URL: /api/admin/estudiantes

Respuesta:

JSON
{
  "success": true,
  "total": 45,
  "data": [
    { "nombre": "Juan", "email": "juan@epn.edu.ec", "carrera": "Software" }
  ]
}
📂 Estructura del Proyecto
Plaintext
src/
├── config/         # Conexión DB y Cloudinary
├── controllers/    # Lógica de los endpoints (Auth, Proyectos, Admin)
├── helpers/        # Generadores de JWT y Emails
├── middleware/     # Protección de rutas (checkAuth, checkAdmin)
├── models/         # Esquemas Mongoose (Usuario, Proyecto)
├── routes/         # Definición de rutas de la API
└── index.js        # Archivo principal
👨‍💻 Autores
Trabajo de Integración Curricular - ESFOT

Luis Xavier Ochoa Calle - Desarrollo Backend & API

© 2026 ESFOT - Todos los derechos reservados.
