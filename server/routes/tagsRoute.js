import express from 'express';
import { listarTags } from '../controllers/tagsController.js';

const router = express.Router();

// GET /tags (Listar todas as tags)
router.get('/', listarTags);

export default router;