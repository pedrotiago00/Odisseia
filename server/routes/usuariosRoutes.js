import express from 'express';
import {
    inserirUsuario,
    logarUsuario
} from '../controllers/usuariosController.js';

const router = express.Router();

router.post('/cadastrar', inserirUsuario);
router.post('/login', logarUsuario);

export default router;