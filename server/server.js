import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import mysql from "mysql2/promise";
import usuariosRoutes from "./routes/usuariosRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const SECRET_KEY = process.env.SECRET;
const PORT = process.env.PORT;

// Conexão com o banco 
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000 // tempo máximo de conexão (10s)
});

// Testa a conexão antes de iniciar o servidor
try {
  await db.connect();
  console.log("✅ Conectado com sucesso ao banco!");
} catch (error) {
  console.error("❌ Erro ao conectar ao banco:", error.message);
  process.exit(1); // encerra o app se falhar
}

// 🔹 Rotas
app.use("/usuarios", usuariosRoutes);

// 🔹 Inicia o servidor somente se conectou
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
