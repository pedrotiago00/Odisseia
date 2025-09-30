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

export const logarUsuario = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, senha]);
        if (rows.length > 0) {
            res.status(200).json({ message: "Login bem-sucedido", usuario: rows[0] });
        } else {
            res.status(401).json({ message: "Email ou senha inválidos" });
        }
    } catch (error) {
        console.error("Erro ao logar usuário:", error);
        res.status(500).json({ error: "Erro ao logar usuário" });
    }
};