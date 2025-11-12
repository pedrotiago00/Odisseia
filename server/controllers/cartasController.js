import pool from '../database.js';

// Função para LISTAR todas as cartas (COM FILTRO MÚLTIPLO)
export const listarCartas = async (req, res) => {
    // 1. MUDANÇA: de 'tag' (singular) para 'tags' (plural)
    const { tags } = req.query; // Pega as tags (ex: /cartas?tags=elfa,guerreira)

    try {
        let query = "SELECT * FROM cartas";
        const params = [];

        // 2. MUDANÇA: Lógica para filtros múltiplos
        if (tags && tags.trim() !== '') {
            // 3. Divide a string "elfa,guerreira" em um array ['elfa', 'guerreira']
            const listaDeTags = tags.split(',');

            if (listaDeTags.length > 0) {
                // 4. Cria uma condição "LIKE" para CADA tag no array
                //    (ex: ["tags LIKE ?", "tags LIKE ?"])
                const condicoes = listaDeTags.map(tag => "tags LIKE ?");
                
                // 5. Junta todas as condições com "AND"
                //    (ex: "WHERE (tags LIKE ? AND tags LIKE ?)")
                query += ` WHERE (${condicoes.join(' OR ')})`;
                
                // 6. Adiciona cada tag (com '%') aos parâmetros
                listaDeTags.forEach(tag => {
                    params.push(`%${tag.trim()}%`); // .trim() para limpar espaços
                });
            }
        }
        // Se 'tags' não for fornecido, a query continua "SELECT * FROM cartas"

        const [rows] = await pool.query(query, params);
        res.status(200).json(rows);

    } catch (error) {
        console.error("Erro ao listar cartas:", error);
        res.status(500).json({ error: "Erro ao buscar cartas no banco de dados." });
    }
};

// Função para BUSCAR UMA CARTA por ID (Sem alterações)
export const buscarCartaPorId = async (req, res) => {
    const { id } = req.params; 

    try {
        const [rows] = await pool.query("SELECT * FROM cartas WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Carta não encontrada." });
        }
        
        res.status(200).json(rows[0]); 

    } catch (error) {
        console.error("Erro ao buscar carta por ID:", error);
        res.status(500).json({ error: "Erro ao buscar carta no banco de dados." });
    }
};

// Função para ADICIONAR uma nova carta (Sem alterações)
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

// Função para ATUALIZAR uma carta existente (Sem alterações)
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

// Função para DELETAR uma carta (Sem alterações)
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