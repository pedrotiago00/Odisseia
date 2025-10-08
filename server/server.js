import express from "express";
import dotenv from "dotenv";
import usuariosRoutes from "./routes/usuariosRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.use("/cadastrar", usuariosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});