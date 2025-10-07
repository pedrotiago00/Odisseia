import express from 'express';
import {
    inserirUsuario,
    logarUsuario
} from '../controllers/usuariosController.js';

const router = express.Router();

router.post('/', inserirUsuario);
router.post('/', logarUsuario);

export default router;