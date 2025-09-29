import express from 'express';
import {
    inserirUsuario,
} from '../controllers/usuariosController.js';

const router = express.Router();

router.post('/', inserirUsuario);

export default router;