import 'dotenv/config';
import mysql from 'mysql2/promise';

const test = async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log("✅ Conectado com sucesso!");
    await conn.end();
  } catch (err) {
    console.error("❌ Falha ao conectar:", err.message);
  }
};
test();
