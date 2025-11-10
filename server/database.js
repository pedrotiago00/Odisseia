import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// =================================================================
// 1. DEFINA A FUNÇÃO PRIMEIRO
// =================================================================
const inicializarTabelas = async (poolDeConexao) => {
  console.log("Verificando estrutura do banco de dados...");
  let connection;
  try {
    connection = await poolDeConexao.getConnection();

    // 1. Cria a tabela 'Usuarios'
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

    // 2. Cria a tabela 'cartas'
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

    console.log("Verificação do banco de dados completa.");

  } catch (error) {
    console.error("Erro fatal ao inicializar tabelas:", error);
    process.exit(1); // Encerra a aplicação se não conseguir criar as tabelas
  } finally {
    if (connection) connection.release(); // Garante que a conexão será liberada
  }
};


// =================================================================
// 2. AGORA, CONECTE-SE E CHAME A FUNÇÃO
// =================================================================

const connectionString = process.env.MYSQL_URL;

if (!connectionString) {
  console.error("Erro fatal: A variável de ambiente MYSQL_URL não foi definida.");
  process.exit(1);
}

let pool;

try {
  // Cria o pool
  pool = await mysql.createPool({
    uri: connectionString, // A única fonte de conexão
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Testa a conexão
  const connection = await pool.getConnection();
  console.log("Conexão com o banco (via MYSQL_URL) estabelecida com sucesso!");
  connection.release();

  // CHAMA A FUNÇÃO (que agora já existe)
  await inicializarTabelas(pool); 

} catch (error) {
  console.error(`Erro fatal ao conectar ou inicializar:`, error);
  process.exit(1);
}

// 3. EXPORTA O POOL NO FINAL
export default pool;