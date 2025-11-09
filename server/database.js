import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- INÍCIO DA ATUALIZAÇÃO ---
// Função para criar as tabelas se elas não existirem
const inicializarTabelas = async () => {
  console.log("Verificando estrutura do banco de dados...");
  try {
    const connection = await pool.getConnection();

    // 1. Cria a tabela 'Usuarios' (necessária para suas rotas /usuarios)
    const createUsuariosTable = `
      CREATE TABLE IF NOT EXISTS Usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        idade INT,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createUsuariosTable);
    console.log("Tabela 'Usuarios' verificada/criada.");

    // 2. Cria a tabela 'cartas' (necessária para suas rotas /cartas)
    const createCartasTable = `
      CREATE TABLE IF NOT EXISTS cartas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        descricao TEXT,
        imagem_url VARCHAR(255),
        tipo VARCHAR(50),
        tags VARCHAR(255)
      );
    `;
    await connection.query(createCartasTable);
    console.log("Tabela 'cartas' verificada/criada.");

    // Libera a conexão
    connection.release();
    console.log("Verificação do banco de dados completa.");

  } catch (error) {
    console.error("Erro fatal ao inicializar tabelas:", error);
    // Encerra a aplicação se não conseguir criar as tabelas
    process.exit(1);
  }
};

// Roda a função de inicialização
await inicializarTabelas();
// --- FIM DA ATUALIZAÇÃO ---

export default pool;