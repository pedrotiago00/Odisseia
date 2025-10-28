import pool from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const inserirUsuario = async (req, res) => {
    const { nome, idade, email, senha } = req.body;

    console.log("Recebendo dados do cliente:", { nome, idade, email, senha });

    // Verificação rápida de valores
    if (!nome || !idade || !email || !senha) {
        console.warn("Algum campo obrigatório está vazio!");
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    try {
        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);
        console.log("Senha criptografada:", senhaHash);

        // Inserção no banco
        const [result] = await pool.query(
            "INSERT INTO Usuarios (nome, idade, email, senha) VALUES (?, ?, ?, ?)",
            [nome, idade, email, senhaHash]
        );

        console.log("Usuário inserido com sucesso! ID:", result.insertId);
        res.status(201).json({ id: result.insertId, nome, idade, email });

    } catch (error) {
        // Log detalhado do erro
        console.error("Erro ao inserir usuário:", error);

        // Resposta detalhada apenas para desenvolvimento
        res.status(500).json({
            error: "Erro ao inserir usuário",
            details: error.message,
            code: error.code
        });
    }
};

export const logarUsuario = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM Usuarios WHERE email = ?", [email]);
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