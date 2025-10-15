import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import usuariosRoutes from "./routes/usuariosRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
const SECRET_KEY = process.env.SECRET;

const PORT = process.env.PORT;

app.use("/cadastrar", usuariosRoutes);
app.use("/login", usuariosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});