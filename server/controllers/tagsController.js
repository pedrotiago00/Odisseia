import pool from '../database.js';

// Função para LISTAR todas as tags
export const listarTags = async (req, res) => {
    try {
        // Ordena por 'nome' para vir em ordem alfabética
        const [rows] = await pool.query("SELECT * FROM tags ORDER BY nome ASC");
        res.status(200).json(rows);

    } catch (error) {
        console.error("Erro ao listar tags:", error);
        res.status(500).json({ error: "Erro ao buscar tags no banco de dados." });
    }
};