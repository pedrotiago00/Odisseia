import pool from '../database.js';

export const inserirUsuario = async (req, res) => {
    const { nome, idade, email, senha } = req.body;
    try {
        const [result] = await pool.query("INSERT INTO usuarios (nome, idade, email, senha) VALUES (?, ?, ?, ?)", [nome, idade, email, senha]);
        res.status(201).json({ id: result.insertId, nome, idade, email });
    } catch (error) {
        console.error("Erro ao inserir usuário:", error);
        res.status(500).json({ error: "Erro ao inserir usuário" });
    }
};