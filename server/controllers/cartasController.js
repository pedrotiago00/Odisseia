import pool from '../database.js';

// Função para LISTAR todas as cartas (com filtro de tag)
export const listarCartas = async (req, res) => {
    const { tag } = req.query; // Pega a tag da URL (ex: /cartas?tag=magia)

    try {
        let query = "SELECT * FROM cartas";
        const params = [];

        if (tag) {
            query += " WHERE tags LIKE ?";
            params.push(`%${tag}%`);
        }

        const [rows] = await pool.query(query, params);
        res.status(200).json(rows);

    } catch (error) {
        console.error("Erro ao listar cartas:", error);
        res.status(500).json({ error: "Erro ao buscar cartas no banco de dados." });
    }
};

// Função para BUSCAR UMA CARTA por ID
export const buscarCartaPorId = async (req, res) => {
    const { id } = req.params; // Pega o ID da URL

    try {
        const [rows] = await pool.query("SELECT * FROM cartas WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Carta não encontrada." });
        }
        
        res.status(200).json(rows[0]); // Retorna o primeiro (e único) resultado

    } catch (error) {
        console.error("Erro ao buscar carta por ID:", error);
        res.status(500).json({ error: "Erro ao buscar carta no banco de dados." });
    }
};

// Função para ADICIONAR uma nova carta
export const inserirCarta = async (req, res) => {
    const { nome, descricao, imagem_url, tipo, tags } = req.body;

    if (!nome || !tipo) {
        return res.status(400).json({ error: "Nome e Tipo são obrigatórios." });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO cartas (nome, descricao, imagem_url, tipo, tags) VALUES (?, ?, ?, ?, ?)",
            [nome, descricao, imagem_url, tipo, tags || null]
        );
        res.status(201).json({ id: result.insertId, nome, tipo });
    } catch (error) {
        console.error("Erro ao inserir carta:", error);
        res.status(500).json({ error: "Erro ao inserir carta no banco de dados." });
    }
};

// Função para ATUALIZAR uma carta existente
export const atualizarCarta = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, imagem_url, tipo, tags } = req.body;

    if (!nome || !tipo) {
        return res.status(400).json({ error: "Nome e Tipo são obrigatórios." });
    }

    try {
        const [result] = await pool.query(
            "UPDATE cartas SET nome = ?, descricao = ?, imagem_url = ?, tipo = ?, tags = ? WHERE id = ?",
            [nome, descricao, imagem_url, tipo, tags || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Carta não encontrada." });
        }

        res.status(200).json({ message: "Carta atualizada com sucesso." });

    } catch (error) {
        console.error("Erro ao atualizar carta:", error);
        res.status(500).json({ error: "Erro ao atualizar carta no banco de dados." });
    }
};

// Função para DELETAR uma carta
export const deletarCarta = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query("DELETE FROM cartas WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Carta não encontrada." });
        }

        res.status(200).json({ message: "Carta deletada com sucesso." });

    } catch (error) {
        console.error("Erro ao deletar carta:", error);
        res.status(500).json({ error: "Erro ao deletar carta no banco de dados." });
    }
};