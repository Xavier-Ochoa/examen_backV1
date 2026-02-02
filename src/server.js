// server.js
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth_routes.js";
import proyectoRoutes from "./routes/proyecto_routes.js";
import proyectoAdminRoutes from "./routes/proyectoadmin_routes.js";
import estudianteRoutes from "./routes/estudiante_routes.js";
import donacionRoutes from "./routes/donacion_routes.js";
import dashboardRoutes from "./routes/dashboard_routes.js";
import iaRoutes from "./routes/ia_routes.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';

// ===== CONFIGURACIÓN DE CLOUDINARY =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// ===== MIDDLEWARES =====

// Body parser
app.use(express.json());

// ===== CORS - CORREGIDO =====
app.use(cors({
  origin: [
    'https://superlative-halva-ff0378.netlify.app', // tu frontend Netlify
    'http://localhost:5173', // para desarrollo local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // permite enviar cookies/headers de autenticación si los usas
}));

// Manejar preflight OPTIONS para todos los endpoints
app.options('*', cors());

// ===== FILE UPLOAD =====
const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp' : './uploads';
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: uploadDir,
  debug: false,
}));

// ===== CONFIGURACIÓN DE SESIONES =====
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_temporal',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ===== INICIALIZAR PASSPORT =====
app.use(passport.initialize());
app.use(passport.session());

// ===== RUTAS =====
app.get("/", (req, res) => {
  res.send("API de Proyectos ESFOT - EPN");
});

// Autenticación (incluye OAuth)
app.use("/api/auth", authRoutes);

// Proyectos (usuarios normales)
app.use("/api/proyectos", proyectoRoutes);

// Proyectos (administradores)
app.use("/api/admin/proyectos", proyectoAdminRoutes);

// Estudiantes (administradores)
app.use("/api/admin/estudiantes", estudianteRoutes);

// Donaciones
app.use("/api/donaciones", donacionRoutes);

// Dashboard (estadísticas)
app.use("/api/dashboard", dashboardRoutes);

// IA (sugerencias de títulos con Hugging Face)
app.use("/api/ia", iaRoutes);

// ===== MANEJO DE ERRORES =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado - 404"
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
