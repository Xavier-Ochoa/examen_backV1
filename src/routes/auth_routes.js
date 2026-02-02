// auth_routes.js
import { Router } from 'express';
import cors from 'cors';
import passport from 'passport';
import { 
  comprobarTokenPasword, 
  confirmarMail, 
  crearNuevoPassword, 
  recuperarPassword, 
  registro, 
  login, 
  perfil, 
  actualizarPerfil, 
  actualizarPassword,
  getUnsplashImage,
  fetchQuoteController
} from '../controllers/auth_controller.js';
import { verificarTokenJWT, crearTokenJWT } from '../middlewares/JWT.js';
import { validarRegistro } from '../validators/auth_validators.js';
import { manejarErroresValidacion } from '../middlewares/validaciones.js';

const router = Router();

// ===== CORS CONFIG - UNIVERSAL PARA RUTAS PÚBLICAS =====
const corsOptions = {
  origin: 'https://superlative-halva-ff0378.netlify.app', // frontend Netlify
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware para aplicar CORS a todas las rutas públicas
const corsMiddleware = (req, res, next) => cors(corsOptions)(req, res, next);

// ===== RUTAS PÚBLICAS - AUTENTICACIÓN TRADICIONAL =====

// Registro con validación
router.post(
  '/registro',
  corsMiddleware,
  validarRegistro,
  manejarErroresValidacion,
  registro
);

// Login
router.post('/login', corsMiddleware, login);

// Confirmación de mail
router.get('/confirm/:token', corsMiddleware, confirmarMail);

// Recuperar contraseña
router.post('/recuperarpassword', corsMiddleware, recuperarPassword);
router.get('/recuperarpassword/:token', corsMiddleware, comprobarTokenPasword);
router.post('/nuevopassword/:token', corsMiddleware, crearNuevoPassword);

// Servicios adicionales
router.get('/random-image', corsMiddleware, getUnsplashImage);
router.get('/frases', corsMiddleware, fetchQuoteController);

// ===== RUTAS OAUTH GOOGLE =====
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/google/failure',
    session: false,
  }),
  async (req, res) => {
    try {
      await req.user.updateLastLogin();
      const token = crearTokenJWT(req.user._id, req.user.rol);
      const { password, token: userToken, __v, ...userData } = req.user.toObject();

      res.status(200).json({
        success: true,
        message: 'Autenticación con Google exitosa',
        token,
        user: {
          _id: userData._id,
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
          carrera: userData.carrera,
          nivel: userData.nivel,
          cedula: userData.cedula,
          fotoPerfil: userData.fotoPerfil,
          rol: userData.rol,
          authProvider: 'google',
          googleId: userData.googleId,
          confirmEmail: userData.confirmEmail,
          lastLogin: userData.lastLogin,
        },
      });
    } catch (error) {
      console.error('Error en callback de Google:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el proceso de autenticación',
        error: error.message,
      });
    }
  }
);

router.get('/google/failure', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Autenticación con Google fallida',
    error: 'El usuario canceló la autenticación o hubo un error',
  });
});

// ===== RUTAS OAUTH FACEBOOK =====
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: '/api/auth/facebook/failure',
    session: false,
  }),
  async (req, res) => {
    try {
      await req.user.updateLastLogin();
      const token = crearTokenJWT(req.user._id, req.user.rol);
      const { password, token: userToken, __v, ...userData } = req.user.toObject();

      res.status(200).json({
        success: true,
        message: 'Autenticación con Facebook exitosa',
        token,
        user: {
          _id: userData._id,
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
          carrera: userData.carrera,
          nivel: userData.nivel,
          cedula: userData.cedula,
          fotoPerfil: userData.fotoPerfil,
          rol: userData.rol,
          authProvider: 'facebook',
          facebookId: userData.facebookId,
          confirmEmail: userData.confirmEmail,
          lastLogin: userData.lastLogin,
        },
      });
    } catch (error) {
      console.error('Error en callback de Facebook:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el proceso de autenticación',
        error: error.message,
      });
    }
  }
);

router.get('/facebook/failure', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Autenticación con Facebook fallida',
    error: 'El usuario canceló la autenticación o hubo un error',
  });
});

// ===== RUTAS PROTEGIDAS =====
router.get('/perfil', verificarTokenJWT, perfil);
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfil);
router.put('/password/:id', verificarTokenJWT, actualizarPassword);

export default router;
