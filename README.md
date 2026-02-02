🚀 API Proyectos ESFOT

API REST para la gestión y publicación de proyectos académicos y extracurriculares de estudiantes ESFOT – EPN. Permite autenticación, gestión de perfiles, creación de proyectos, interacción social (likes y comentarios) y administración completa por parte de usuarios con rol admin.

🧩 Características Principales

🔐 Autenticación completa (registro, login, confirmación por email, recuperación de contraseña)

👤 Gestión de perfiles de estudiantes

📂 Gestión de proyectos (crear, editar, eliminar)

🌍 Visualización pública de proyectos publicados

❤️ Interacción social (likes y comentarios)

👑 Panel de administración para proyectos y estudiantes

🖼️ Carga de imágenes para proyectos

📊 Estadísticas para dashboards administrativos

🏗️ Tecnologías Usadas

Node.js

Express.js

MongoDB + Mongoose

JWT (JSON Web Tokens)

Express Validator

Multer (subida de imágenes)

Cloudinary (almacenamiento de imágenes)

Nodemailer (emails de confirmación y recuperación)

Passport.js (Google y Facebook OAuth)

⚙️ Instalación y Configuración
1️⃣ Clonar el repositorio
git clone https://github.com/tu-usuario/api-proyectos-esfot.git
cd api-proyectos-esfot
2️⃣ Instalar dependencias
npm install
3️⃣ Variables de entorno

Crear un archivo .env en la raíz del proyecto:

PORT=3000
MONGO_URI=mongodb://localhost:27017/proyectos_esfot
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=24h


EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_password


CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx


GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
FACEBOOK_CLIENT_ID=xxxxx
FACEBOOK_CLIENT_SECRET=xxxxx
4️⃣ Ejecutar el proyecto
npm run dev

Servidor disponible en:

http://localhost:3000
🔑 Autenticación

La API utiliza JWT.

Hacer login en /api/auth/login

Copiar el token devuelto

Enviar en los headers:

Authorization: Bearer TU_TOKEN_AQUI
📚 Documentación de Endpoints

Toda la documentación detallada (35 endpoints) se encuentra aquí:

📖 Guía completa de endpoints:

DOCUMENTACION_API_FRONTEND_COMPLETA.md

GUIA_ENDPOINTS_POSTMAN_COMPLETA.md

Incluye:

Ejemplos de requests y responses

Validaciones

Roles y permisos

Checklist de pruebas

Uso recomendado en Postman

👥 Roles del Sistema
Rol	Descripción
estudiante	Crea y gestiona sus propios proyectos
admin	Gestiona todos los proyectos y estudiantes
📂 Estructura del Proyecto
src/
│── controllers/
│── models/
│── routes/
│── middlewares/
│── helpers/
│── config/
│── index.js
🧪 Testing

Recomendado usar Postman:

Crear variables de entorno:

base_url

user_token

admin_token

Importar colección organizada por módulos

🚀 Despliegue

Antes de desplegar:

Configurar variables de entorno en el servidor

Asegurar conexión a MongoDB Atlas

Configurar dominios OAuth (Google/Facebook)

👨‍💻 Autor

Proyecto desarrollado para uso académico – ESFOT / EPN

📄 Licencia

Este proyecto es de uso académico y educativo.

✨ API lista para integrarse con frontend web o móvil

🔌 Endpoints de la API (35 en total)

Esta sección resume todos los endpoints disponibles, indicando su propósito, método HTTP y nivel de acceso. Para ver ejemplos detallados de request/response, revisa el archivo GUIA_ENDPOINTS_POSTMAN_COMPLETA.md.

🔑 Autenticación (13 endpoints)
#	Método	Endpoint	Acceso	Descripción
1	POST	/api/auth/registro	Público	Registra un nuevo estudiante y envía correo de confirmación
2	POST	/api/auth/login	Público	Inicia sesión y devuelve token JWT
3	GET	/api/auth/confirm/:token	Público	Confirma la cuenta mediante token enviado por email
4	POST	/api/auth/recuperarpassword	Público	Envía email para recuperación de contraseña
5	GET	/api/auth/recuperarpassword/:token	Público	Verifica token de recuperación
6	POST	/api/auth/nuevopassword/:token	Público	Establece una nueva contraseña
7	GET	/api/auth/perfil	Autenticado	Obtiene el perfil del usuario autenticado
8	PUT	/api/auth/perfil/:id	Autenticado	Actualiza los datos del perfil del usuario
9	PUT	/api/auth/password/:id	Autenticado	Cambia la contraseña del usuario
10	GET	/api/auth/google	Público	Login usando Google OAuth
11	GET	/api/auth/facebook	Público	Login usando Facebook OAuth
12	GET	/api/auth/random-image	Público	Devuelve una imagen aleatoria (Unsplash)
13	GET	/api/auth/frases	Público	Devuelve una frase motivacional
🌍 Proyectos Públicos (7 endpoints)
#	Método	Endpoint	Acceso	Descripción
14	GET	/api/proyectos	Público	Lista proyectos publicados (con filtros y paginación)
15	GET	/api/proyectos/:id	Público	Muestra el detalle de un proyecto específico
16	GET	/api/proyectos/buscar	Público	Busca proyectos por texto
17	GET	/api/proyectos/categoria/:tipo	Público	Lista proyectos por categoría
18	GET	/api/proyectos/carrera/:carrera	Público	Lista proyectos por carrera
19	GET	/api/proyectos/estudiante/:id	Público	Lista proyectos publicados de un estudiante
20	GET	/api/proyectos/destacados	Público	Obtiene los proyectos con más vistas
🔒 Proyectos Autenticados (7 endpoints)
#	Método	Endpoint	Acceso	Descripción
21	POST	/api/proyectos	Estudiante/Admin	Crea un nuevo proyecto (estado inicial: en_progreso)
22	PUT	/api/proyectos/:id	Autor	Actualiza un proyecto propio
23	DELETE	/api/proyectos/:id	Autor	Elimina un proyecto propio
24	POST	/api/proyectos/:id/like	Autenticado	Da like a un proyecto
25	DELETE	/api/proyectos/:id/like	Autenticado	Quita el like de un proyecto
26	POST	/api/proyectos/:id/comentarios	Autenticado	Agrega un comentario a un proyecto
27	DELETE	/api/proyectos/:id/comentarios/:comentarioId	Autor/Admin	Elimina un comentario
👑 Admin – Proyectos (5 endpoints)
#	Método	Endpoint	Acceso	Descripción
28	GET	/api/admin/proyectos	Admin	Lista todos los proyectos (publicados y en_progreso)
29	PUT	/api/admin/proyectos/:id	Admin	Actualiza cualquier proyecto
30	DELETE	/api/admin/proyectos/:id	Admin	Elimina cualquier proyecto
31	PUT	/api/admin/proyectos/:id/publicar	Admin	Publica un proyecto
32	PUT	/api/admin/proyectos/:id/despublicar	Admin	Despublica un proyecto
👑 Admin – Estudiantes (3 endpoints)
#	Método	Endpoint	Acceso	Descripción
33	GET	/api/admin/estudiantes	Admin	Lista estudiantes con filtros
34	GET	/api/admin/estudiantes/:id	Admin	Obtiene información completa de un estudiante
35	GET	/api/admin/estudiantes/estadisticas	Admin	Obtiene estadísticas generales de estudiantes

📌 Nota: Todos los endpoints protegidos requieren el header:

Authorization: Bearer <token_jwt>

