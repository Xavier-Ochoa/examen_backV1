import { Router } from 'express';
import { generarTitulosProyecto } from '../controllers/ia_controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = Router();

// Endpoint para generar imagen de proyecto con IA
// POST /api/ia/generar-imagen
// Body: { descripcion: string }
// Retorna: { success: boolean, data: { imagen: string (base64), prompt: string, modelo: string } }
router.post('/generar-titulo', verificarTokenJWT, generarTitulosProyecto);

export default router;
