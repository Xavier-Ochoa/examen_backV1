Entendido, **Luis Xavier**. Aquí tienes el contenido completo y detallado del `README.md`. He consolidado la descripción del proyecto, la guía técnica y los ejemplos detallados de **Request/Response** basados en tus archivos de documentación para que cualquier persona que entre a tu repositorio entienda exactamente cómo funciona tu Backend.

---

# 🚀 Backend - Plataforma de Gestión de Proyectos ESFOT

> **Trabajo de Integración Curricular** > **Autor:** Luis Xavier Ochoa Calle
> **Título:** Tecnólogo Superior en Desarrollo de Software

Este repositorio contiene la **API RESTful** diseñada para gestionar el ecosistema de proyectos académicos y extracurriculares de la ESFOT. Permite a los estudiantes dar visibilidad a su trabajo y a los administradores moderar el contenido de calidad.

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](https://www.google.com/search?q=%23-descripci%C3%B3n-del-proyecto)
2. [Tecnologías Utilizadas](https://www.google.com/search?q=%23-tecnolog%C3%ADas-utilizadas)
3. [Instalación y Configuración](https://www.google.com/search?q=%23-instalaci%C3%B3n-y-configuraci%C3%B3n)
4. [Documentación Técnica de Endpoints](https://www.google.com/search?q=%23-documentaci%C3%B3n-t%C3%A9cnica-de-endpoints)
* [Módulo de Autenticación](https://www.google.com/search?q=%231-autenticaci%C3%B3n)
* [Módulo de Proyectos (Estudiantes)](https://www.google.com/search?q=%232-proyectos-estudiante)
* [Módulo de Interacción](https://www.google.com/search?q=%233-interacci%C3%B3n-social)
* [Módulo Administrativo](https://www.google.com/search?q=%234-administraci%C3%B3n-y-moderaci%C3%B3n)


5. [Estructura de Datos](https://www.google.com/search?q=%23-estructura-de-datos)
6. [Flujo de Seguridad](https://www.google.com/search?q=%23-flujo-de-seguridad)

---

## 📖 Descripción del Proyecto

El backend actúa como el núcleo del sistema, gestionando:

* **Autenticación Robusta:** Registro, validación de correo y login social.
* **Gestión Multimedia:** Integración con Cloudinary para el manejo de evidencias visuales.
* **Moderación:** Sistema de estados (`en_progreso`, `publicado`) para control de calidad.
* **Interacción:** Sistema de feedback mediante likes y comentarios.

---

## 🛠 Tecnologías Utilizadas

* **Motor:** Node.js v20+
* **Framework:** Express.js
* **Base de Datos:** MongoDB (Mongoose ODM)
* **Seguridad:** JWT (JSON Web Tokens), Bcrypt (Hash de contraseñas)
* **Servicios Externos:** Cloudinary (Imágenes) y Nodemailer (Correos)

---

## ⚙️ Instalación y Configuración

1. **Clonación:**
```bash
git clone https://github.com/tu-usuario/backend-proyectos-esfot.git
cd backend-proyectos-esfot

```


2. **Dependencias:**
```bash
npm install

```


3. **Variables de Entorno (.env):**
```env
PORT=3000
MONGO_URI=tu_conexion_mongodb
JWT_SECRET=clave_secreta_jwt
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_app_password

```



---

## 📚 Documentación Técnica de Endpoints

### 1. Autenticación

#### **Registro de Usuario**

* **Endpoint:** `POST /api/auth/registro`
* **Descripción:** Crea un nuevo usuario. El campo `rol` por defecto es `estudiante`.
* **Request Body:**
```json
{
  "nombre": "Luis Xavier",
  "apellido": "Ochoa Calle",
  "cedula": "1234567890",
  "email": "luis.ochoa@epn.edu.ec",
  "password": "miPasswordSeguro",
  "carrera": "Desarrollo de Software",
  "nivel": 5
}

```


* **Response (200):**
```json
{
  "success": true,
  "message": "Revisa tu correo para confirmar tu cuenta"
}

```



#### **Login de Usuario**

* **Endpoint:** `POST /api/auth/login`
* **Request Body:**
```json
{
  "email": "luis.ochoa@epn.edu.ec",
  "password": "miPasswordSeguro"
}

```


* **Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1Ni...",
  "rol": "estudiante",
  "nombre": "Luis Xavier"
}

```



---

### 2. Proyectos (Estudiante)

#### **Crear Proyecto (Con Imagen)**

* **Endpoint:** `POST /api/proyectos`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Request (Multipart/Form-Data):**
* `titulo`: "App de Delivery"
* `descripcion`: "Proyecto final de semestre..."
* `categoria`: "academico"
* `carrera`: "Desarrollo de Software"
* `imagen`: (Archivo de imagen)


* **Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65f123...",
    "titulo": "App de Delivery",
    "estado": "en_progreso",
    "imagenes": ["https://res.cloudinary.com/..."]
  }
}

```



#### **Obtener Mis Proyectos**

* **Endpoint:** `GET /api/proyectos/estudiante/me`
* **Descripción:** Permite al estudiante ver sus proyectos publicados y pendientes.

---

### 3. Interacción Social

#### **Dar/Quitar Like**

* **Endpoint:** `POST /api/proyectos/:id/like`
* **Response (200):**
```json
{
  "success": true,
  "message": "Like actualizado",
  "totalLikes": 15
}

```



#### **Comentar Proyecto**

* **Endpoint:** `POST /api/proyectos/:id/comentarios`
* **Request Body:**
```json
{ "texto": "Excelente implementación de patrones de diseño." }

```



---

### 4. Administración y Moderación

#### **Listar Proyectos Pendientes**

* **Endpoint:** `GET /api/admin/proyectos?estado=en_progreso`
* **Acceso:** Solo Admin.

#### **Publicar Proyecto**

* **Endpoint:** `PUT /api/admin/proyectos/:id/publicar`
* **Descripción:** Aprueba el proyecto para que sea visible públicamente.
* **Response (200):**
```json
{
  "success": true,
  "message": "El proyecto ahora es visible para toda la comunidad",
  "estado": "publicado"
}

```



#### **Estadísticas del Sistema**

* **Endpoint:** `GET /api/admin/estudiantes/estadisticas`
* **Response (200):**
```json
{
  "totalEstudiantes": 120,
  "porCarrera": { "Software": 80, "Redes": 40 }
}

```



---

## 📂 Estructura de Datos (Modelos)

### Proyecto

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `titulo` | String | Nombre del proyecto |
| `autor` | ObjectId | Referencia al modelo Usuario |
| `estado` | String | `en_progreso` o `publicado` |
| `vistas` | Number | Contador incremental |
| `likes` | Array | IDs de usuarios que dieron like |

---

## 🛡 Flujo de Seguridad

1. **Middleware `checkAuth`:** Valida que el token JWT enviado en los headers sea vigente.
2. **Middleware `checkAdmin`:** Verifica que el rol del usuario decodificado sea `admin` para rutas críticas.
3. **CORS:** Configurado para aceptar peticiones únicamente desde el dominio del Frontend.

---

## 👨‍💻 Autores

* **Luis Xavier Ochoa Calle** - *Desarrollador Fullstack & Investigador*

---

© 2026 **ESFOT - Escuela de Formación de Tecnólogos** *Quito, Ecuador*
