import express from "express";
import usuariosRoutes from "./routes/usuariosRoutes.js";

const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/cadastrar", usuariosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});