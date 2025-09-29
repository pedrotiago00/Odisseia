import db from '../database/db.js';

export function cadastrarUsuario(req, res) {
    const { nome, idade, email, senha } = req.body;
    const query = 'INSERT INTO USUARIOS (nome, idade, email, senha) VALUES (?, ?, ?, ?)';
    db.get((err, connection) => {
        if (err) {
            console.error('Erro ao conectar ao Firebird:', err);
            return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
        }

        connection.query(query, [nome, idade, email, senha], (err, result) => {
            if (err) {
                console.error('Erro na query:', err);
                return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
            }

            console.log('Usuário cadastrado com sucesso:', result);
            res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
        });
    });
}
