import {Router} from 'express';
import resenaController from '../controllers/resenaController.js';

const router = Router();

// definimos los endpoints y los métodos del controlador
router.post('/crear', resenaController.crear);
router.post('/listar', resenaController.listar);
router.post('/actualizar', resenaController.actualizar);
router.post('/desactivar', resenaController.desactivar);
router.post('/puntuacionGeneral', resenaController.obtenerPuntuacionGeneral);

export default router;