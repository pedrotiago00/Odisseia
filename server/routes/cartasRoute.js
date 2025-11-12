import express from 'express';
import {
    listarCartas,
    inserirCarta,
    buscarCartaPorId, 
    atualizarCarta,   
    deletarCarta      
} from '../controllers/cartasController.js';

const router = express.Router();

// --- Rotas CRUD para /cartas ---

// GET /cartas (Listar todas as cartas, com filtro opcional)
router.get('/', listarCartas);

// POST /cartas (Criar uma nova carta)
router.post('/', inserirCarta);

// GET /cartas/:id (Buscar uma carta específica pelo ID)
router.get('/:id', buscarCartaPorId);

// PUT /cartas/:id (Atualizar uma carta específica pelo ID)
router.put('/:id', atualizarCarta);

// DELETE /cartas/:id (Deletar uma carta específica pelo ID)
router.delete('/:id', deletarCarta);

export default router;