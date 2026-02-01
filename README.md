

# 🚀 Backend - Plataforma de Gestión de Proyectos ESFOT

> **Trabajo de Integración Curricular** > **Autor:** Luis Xavier Ochoa Calle


## 📌 Descripción general del proyecto

Este repositorio contiene el **backend** del sistema web informativo desarrollado para la **ESFOT**, cuyo objetivo es **gestionar, organizar y publicar proyectos académicos y extracurriculares** realizados por estudiantes.

El backend expone una **API REST** que permite:

* Registrar y administrar proyectos
* Gestionar usuarios y autenticación
* Manejar categorías, carreras y asignaturas
* Subir y asociar imágenes a proyectos
* Registrar vistas y estadísticas
* Facilitar la conexión con un frontend web

Este sistema está diseñado para ser **escalable, mantenible y fácil de integrar** con aplicaciones frontend modernas.

---

## 🎯 Objetivo del Backend

El backend tiene como objetivo principal:

* Centralizar la información de los proyectos de la ESFOT
* Proveer endpoints claros y seguros para el consumo desde el frontend
* Facilitar la administración de contenidos académicos
* Servir como base para futuros módulos (reportes, filtros avanzados, roles, etc.)

---

## 🛠️ Tecnologías utilizadas

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT (JSON Web Tokens)**
* **Multer** (gestión de imágenes)
* **Postman** (pruebas de endpoints)

---

## 🧱 Arquitectura general

El backend sigue una arquitectura basada en:

* **Rutas (Routes):** Definen los endpoints de la API
* **Controladores (Controllers):** Contienen la lógica de negocio
* **Modelos (Models):** Definen los esquemas de MongoDB
* **Middlewares:** Autenticación, validaciones y manejo de errores

---

## ▶️ Cómo ejecutar el proyecto

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio-backend.git
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar variables de entorno (`.env`):

   ```env
   PORT=3000
   MONGO_URI=tu_conexion_mongodb
   JWT_SECRET=tu_clave_secreta
   ```

4. Ejecutar el servidor:

   ```bash
   npm run dev
   ```

---

## 🔐 Autenticación

La API utiliza **JWT** para proteger ciertos endpoints.
Al iniciar sesión, el backend devuelve un **token**, el cual debe enviarse en los headers:

```
Authorization: Bearer TOKEN
```

---

## 📡 Endpoints disponibles (35 endpoints)

A continuación se describe **qué hace cada grupo de endpoints**, **qué se envía** y **qué devuelve**, de forma clara y entendible.

---

### 👤 Usuarios

#### 1. Crear usuario

**POST** `/api/usuarios`

**Envía:**

* nombre
* email
* contraseña
* rol

**Devuelve:**

* Usuario creado
* Mensaje de confirmación

---

#### 2. Iniciar sesión

**POST** `/api/usuarios/login`

**Envía:**

* email
* contraseña

**Devuelve:**

* Token JWT
* Datos básicos del usuario

---

#### 3. Obtener perfil

**GET** `/api/usuarios/perfil`

**Envía:**

* Token en headers

**Devuelve:**

* Información del usuario autenticado

---

### 📂 Proyectos

#### 4. Crear proyecto

**POST** `/api/proyectos`

**Envía:**

* título
* descripción
* categoría
* carrera
* fechas
* tecnologías
* tags

**Devuelve:**

* Proyecto creado

---

#### 5. Obtener todos los proyectos

**GET** `/api/proyectos`

**Devuelve:**

* Lista de proyectos publicados

---

#### 6. Obtener proyecto por ID

**GET** `/api/proyectos/:id`

**Devuelve:**

* Información completa del proyecto

---

#### 7. Actualizar proyecto

**PUT** `/api/proyectos/:id`

**Envía:**

* Campos a actualizar

**Devuelve:**

* Proyecto actualizado

---

#### 8. Eliminar proyecto

**DELETE** `/api/proyectos/:id`

**Devuelve:**

* Confirmación de eliminación

---

### 🏷️ Categorías

#### 9. Crear categoría

**POST** `/api/categorias`

**Envía:**

* nombre

**Devuelve:**

* Categoría creada

---

#### 10. Listar categorías

**GET** `/api/categorias`

**Devuelve:**

* Lista de categorías

---

### 🎓 Carreras

#### 11. Crear carrera

**POST** `/api/carreras`

**Envía:**

* nombre

**Devuelve:**

* Carrera registrada

---

#### 12. Listar carreras

**GET** `/api/carreras`

**Devuelve:**

* Lista de carreras

---

### 📘 Asignaturas

#### 13. Crear asignatura

**POST** `/api/asignaturas`

**Envía:**

* nombre
* carrera

**Devuelve:**

* Asignatura creada

---

#### 14. Listar asignaturas

**GET** `/api/asignaturas`

**Devuelve:**

* Lista de asignaturas

---

### 🖼️ Imágenes

#### 15. Subir imagen de proyecto

**POST** `/api/imagenes`

**Envía:**

* archivo de imagen (form-data)

**Devuelve:**

* URL de la imagen
* ID de almacenamiento

---

#### 16. Asociar imagen a proyecto

**PUT** `/api/proyectos/:id/imagen`

**Envía:**

* URL o ID de imagen

**Devuelve:**

* Proyecto actualizado

---

### 👁️ Estadísticas

#### 17. Registrar vista

**POST** `/api/proyectos/:id/vista`

**Devuelve:**

* Contador de vistas actualizado

---

#### 18. Obtener proyectos más vistos

**GET** `/api/proyectos/populares`

**Devuelve:**

* Ranking de proyectos

---

### 🔍 Filtros y búsqueda

#### 19. Filtrar por categoría

**GET** `/api/proyectos/categoria/:nombre`

#### 20. Filtrar por carrera

**GET** `/api/proyectos/carrera/:nombre`

#### 21. Buscar por texto

**GET** `/api/proyectos/buscar?q=texto`

---

### 🔒 Administración

#### 22–35. Endpoints administrativos

Incluyen:

* Publicar / despublicar proyectos
* Cambiar estado
* Control de visibilidad
* Gestión avanzada de usuarios
* Eliminación lógica
* Auditoría básica

**Todos requieren autenticación y rol administrador.**

---

## 🧪 Pruebas

Los endpoints fueron probados usando **Postman**.
Se incluye una guía de pruebas para facilitar la validación del backend.

-
