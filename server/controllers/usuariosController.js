import pool from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const inserirUsuario = async (req, res) => {
    const { nome, idade, email, senha } = req.body;
    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const [result] = await pool.query("INSERT INTO usuarios (nome, idade, email, senha) VALUES (?, ?, ?, ?)", [nome, idade, email, senhaHash]);
        res.status(201).json({ id: result.insertId, nome, idade, email });
    } catch (error) {
        console.error("Erro ao inserir usuário:", error);
        res.status(500).json({ error: "Erro ao inserir usuário" });
    }
};

export const logarUsuario = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (rows.length > 0) {
            const usuario = rows[0];
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (senhaValida) {
                const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ message: "Login bem-sucedido", usuario, token });
            } else {
                res.status(401).json({ message: "Email ou senha inválidos" });
            }
        } else {
            res.status(401).json({ message: "Email ou senha inválidos" });
        }
    } catch (error) {
        console.error("Erro ao logar usuário:", error);
        res.status(500).json({ error: "Erro ao logar usuário" });
    }
};