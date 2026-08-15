
import { Router } from 'express';
import resenaController from '../controllers/resenaController.js';
import { verificarTokenAdmin } from '../middleware/authMiddleware.js';

const router = Router();

const marcarComoDashboard = (req, res, next) => {
    req.esDashboard = true;
    next();
};

// Públicas
router.post('/crear', resenaController.crear);
router.post('/listar', resenaController.listar);
router.post('/puntuacionGeneral', resenaController.obtenerPuntuacionGeneral);

// Solo administración
router.post(
    '/dashboard/listar',
    verificarTokenAdmin,
    marcarComoDashboard,
    resenaController.listar
);
router.post('/actualizar', verificarTokenAdmin, resenaController.actualizar);
router.post('/desactivar', verificarTokenAdmin, resenaController.desactivar);

export default router;