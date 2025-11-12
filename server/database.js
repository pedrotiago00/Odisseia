import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { FILTROSTag } from "./tags.js";

dotenv.config();

// =================================================================
// 1. DEFINA A LISTA MESTRA DE TAGS AQUI
// (Note que removemos o 'Todos', pois ele é uma lógica do App,
// e não uma tag real do banco)
// =================================================================
const tagsParaSeed = FILTROSTag;

// =================================================================
// 2. FUNÇÃO PARA POPULAR AS TAGS (NOVO)
// =================================================================
// =================================================================
// 2. FUNÇÃO PARA POPULAR E SINCRONIZAR AS TAGS (ATUALIZADO)
// =================================================================
const seedTags = async (poolDeConexao) => {
  console.log("Sincronizando tags...");
  let connection;
  try {
    connection = await poolDeConexao.getConnection();
    
    // --- ETAPA 1: INSERIR/ATUALIZAR ---
    
    // 👇 MUDANÇA AQUI:
    // Este comando tenta inserir. Se a 'tag' (UNIQUE) já existir,
    // ele ATUALIZA o 'nome' para o novo valor.
    const query = `
      INSERT INTO tags (nome, tag) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE nome = VALUES(nome)
    `;
    
    for (const tagItem of tagsParaSeed) {
      if (tagItem.tag !== 'all') { 
        await connection.query(query, [tagItem.nome, tagItem.tag]);
      }
    }
    console.log("Tags do arquivo .js inseridas/atualizadas.");

    // --- ETAPA 2: LIMPAR (DELETE) ---
    // (Esta parte continua idêntica à anterior)
    const tagsValidas = tagsParaSeed
      .map(t => t.tag)
      .filter(t => t !== 'all');

    if (tagsValidas.length > 0) {
      const placeholders = tagsValidas.map(() => '?').join(',');
      const deleteQuery = `DELETE FROM tags WHERE tag NOT IN (${placeholders})`;
      
      const [deleteResult] = await connection.query(deleteQuery, tagsValidas);
      
      if (deleteResult.affectedRows > 0) {
        console.log(`${deleteResult.affectedRows} tags órfãs foram removidas do banco.`);
      } else {
        console.log("Nenhuma tag órfã encontrada para remover.");
      }
    } else {
      console.log("Lista de tags do .js está vazia, pulando a remoção.");
    }
    
    console.log("Sincronização de tags completa.");

  } catch (error) {
    console.error("Erro ao sincronizar tags:", error);
  } finally {
    if (connection) connection.release();
  }
};



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

    // 3. Cria a tabela 'tags'
    const createTagsTable = `
      CREATE TABLE IF NOT EXISTS tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        tag VARCHAR(100) NOT NULL UNIQUE
      );
    `;
    await connection.query(createTagsTable);
    console.log("Tabela 'tags' verificada/criada.");

    console.log("Verificação do banco de dados completa.");

   
    await seedTags(poolDeConexao);

  } catch (error) {
    console.error("Erro fatal ao inicializar tabelas:", error);
    process.exit(1); 
  } finally {
    if (connection) connection.release(); 
  }
};



const connectionString = process.env.MYSQL_URL;

if (!connectionString) {
  console.error("Erro fatal: A variável de ambiente MYSQL_URL não foi definida.");
  process.exit(1);
}

let pool;

try {
  pool = await mysql.createPool({
    uri: connectionString, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const connection = await pool.getConnection();
  console.log("Conexão com o banco (via MYSQL_URL) estabelecida com sucesso!");
  connection.release();

  
  await inicializarTabelas(pool); 

} catch (error) {
  console.error(`Erro fatal ao conectar ou inicializar:`, error);
  process.exit(1);
}



export default pool;