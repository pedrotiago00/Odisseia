// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import usuariosRoutes from "./routes/usuariosRoutes.js";
import cartasRoutes from "./routes/cartasRoute.js"; 
import tagsRoutes from "./routes/tagsRoute.js";
import db from "./database.js"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;

// 🔹 Cria o servidor HTTP compartilhado com Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// 🔹 Importa as rotas MVC normais
app.use("/usuarios", usuariosRoutes);
app.use("/cartas", cartasRoutes); 
app.use("/tags", tagsRoutes);

// ===================================================================
// 🎮 MULTIPLAYER — Socket.IO (modo Among Us / RPG online)
// ===================================================================
const rooms = {};

io.use((socket, next) => {
  // ... (o resto do seu código de socket.io continua aqui) ...
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.log("❌ Conexão rejeitada: token ausente");
    return next(new Error("Token ausente"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; 
    next();
  } catch (err) {
    console.log("❌ Token inválido");
    return next(new Error("Token inválido"));
  }
});

io.on("connection", (socket) => {
  console.log(`🟢 Novo jogador conectado: ${socket.id}`);

  // Criar sala
  socket.on("createRoom", ({ roomCode, playerName, startingLife }) => {
    if (rooms[roomCode]) {
      socket.emit("errorMessage", "Sala já existe!");
      return;
    }

    rooms[roomCode] = {
      players: [{ id: socket.id, name: playerName, life: startingLife }],
      life: startingLife,
    };

    socket.join(roomCode);
    console.log(`📦 Sala criada: ${roomCode}`);
    io.to(roomCode).emit("roomUpdated", rooms[roomCode]);
  });

  // Entrar na sala
  socket.on("joinRoom", ({ roomCode, playerName }) => {
    const room = rooms[roomCode];
    if (!room) {
      socket.emit("errorMessage", "Sala não encontrada");
      return;
    }

    room.players.push({ id: socket.id, name: playerName, life: room.life });
    socket.join(roomCode);
    console.log(`👥 ${playerName} entrou na sala ${roomCode}`);
    io.to(roomCode).emit("roomUpdated", room);
  });

  // Atualizar vida
  socket.on("updateLife", ({ roomCode, playerId, newLife }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const player = room.players.find((p) => p.id === playerId);
    if (player) player.life = newLife;
    io.to(roomCode).emit("roomUpdated", room);
  });

  // Sair / desconectar
  socket.on("disconnect", () => {
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      room.players = room.players.filter((p) => p.id !== socket.id);
      io.to(roomCode).emit("roomUpdated", room);
      if (room.players.length === 0) {
        delete rooms[roomCode];
        console.log(`🗑️ Sala vazia ${roomCode} removida.`);
      }
    }
    console.log(`🔴 Jogador desconectado: ${socket.id}`);
  });
});

// ===================================================================

// 🔹 Inicializa servidor (Express + Socket.IO)
server.listen(PORT, () => {
  console.log(`🚀 Servidor Odisseia rodando na porta ${PORT}`);
});