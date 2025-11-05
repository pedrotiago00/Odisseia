import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

export default function MultiplayerScreen({ navigation }) {
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [startingLife, setStartingLife] = useState(40);
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("menu"); // "menu" | "waiting" | "playing"

  // 🔹 Conecta ao servidor Socket.IO
  useEffect(() => {
    const connectSocket = async () => {
      const token = await SecureStore.getItemAsync("token");

      const newSocket = io("http://192.168.1.115:3000", {
        transports: ["websocket"],
        auth: { token },
      });

      newSocket.on("connect", () => console.log("✅ Conectado ao servidor multiplayer"));
      newSocket.on("connect_error", (err) => console.log("❌ Erro de conexão:", err.message));

      // Atualização da sala (ex: novos jogadores, vidas atualizadas)
      newSocket.on("roomUpdated", (room) => {
        setPlayers(room.players);
      });

      // Mensagens de erro do servidor
      newSocket.on("errorMessage", (msg) => alert(msg));

      setSocket(newSocket);
      return () => newSocket.disconnect();
    };

    connectSocket();
  }, []);

  // 🔹 Cria uma nova sala
  const handleCreateRoom = () => {
    if (!roomCode.trim()) return alert("Digite um código para a sala!");
    socket.emit("createRoom", { roomCode, startingLife });
    setStatus("waiting");
  };

  // 🔹 Entra em uma sala existente
  const handleJoinRoom = () => {
    if (!roomCode.trim()) return alert("Digite o código da sala!");
    socket.emit("joinRoom", { roomCode });
    setStatus("waiting");
  };

  // 🔹 Inicia o jogo (apenas simulação por enquanto)
  const handleStartGame = () => {
    if (players.length < 2) return alert("Precisa de pelo menos 2 jogadores!");
    setStatus("playing");
  };

  return (
    <SafeAreaView style={styles.container}>
      {status === "menu" && (
        <View style={styles.menuContainer}>
          <Text style={styles.title}>Jogar com Amigos</Text>

          <TextInput
            style={styles.input}
            placeholder="Código da Sala"
            placeholderTextColor="#aaa"
            value={roomCode}
            onChangeText={setRoomCode}
          />

          <TextInput
            style={styles.input}
            placeholder="Vida inicial"
            placeholderTextColor="#aaa"
            value={String(startingLife)}
            onChangeText={(val) => setStartingLife(Number(val))}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
            <Text style={styles.buttonText}>Criar Sala</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#03dac6" }]}
            onPress={handleJoinRoom}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>Entrar na Sala</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === "waiting" && (
        <View style={styles.waitingContainer}>
          <Text style={styles.subtitle}>Sala: {roomCode}</Text>
          <Text style={styles.subtitle}>Aguardando jogadores...</Text>

          <FlatList
            data={players}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item }) => (
              <View style={styles.playerCard}>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.playerLife}>❤️ {item.life}</Text>
              </View>
            )}
          />

          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <Text style={styles.startButtonText}>Iniciar Jogo</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === "playing" && (
        <View style={styles.playingContainer}>
          <Text style={styles.subtitle}>Partida em andamento ⚔️</Text>

          <FlatList
            data={players}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item }) => (
              <View style={styles.playerCard}>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.playerLife}>❤️ {item.life}</Text>
              </View>
            )}
          />

          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => setStatus("menu")}
          >
            <Text style={styles.exitButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    alignItems: "center",
    justifyContent: "center",
  },
  menuContainer: {
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 22,
    color: "#fff",
    marginVertical: 10,
    textAlign: "center",
  },
  input: {
    width: "80%",
    backgroundColor: "#333",
    color: "#fff",
    fontSize: 18,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  waitingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#333",
    width: "80%",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  playerName: {
    color: "#fff",
    fontSize: 18,
  },
  playerLife: {
    color: "#03dac6",
    fontSize: 18,
  },
  startButton: {
    backgroundColor: "#03dac6",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  startButtonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  exitButton: {
    backgroundColor: "#e53935",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  exitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
