import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ImageBackground,
  Dimensions // API para pegar o tamanho da tela
} from "react-native";

// --- PONTO DE ATENÇÃO MUITO IMPORTANTE ---
// Você mudou o Login para usar o 'storage.js' universal.
// Mas este arquivo de Logout ainda está usando o 'SecureStore' direto!
// Isso está inconsistente e vai falhar no modo Web.
import * as SecureStore from 'expo-secure-store';
// Você deveria REMOVER a linha acima e importar seu 'storage'
// import storage from '../../servicers/storage'; 

import * as Animatable from "react-native-animatable"; // Para animações
import { useNavigation } from "@react-navigation/native"; // Para navegação

// Pega a largura da tela (embora não esteja sendo usada no código)
const { width } = Dimensions.get("window"); 

/**
 * Tela de Menu Principal.
 * É a tela "hub" que o usuário vê após fazer o login.
 * Usa animações e um fundo para dar uma aparência de "menu de jogo".
 */
export default function Menu() {
  const navigation = useNavigation();

  /**
   * Função para deslogar o usuário.
   */
  const handleLogout = async () => {
    try {
      // --- CORREÇÃO NECESSÁRIA AQUI ---
      // 1. Apaga os dados salvos.
      // Você deve substituir as duas linhas abaixo por:
      // await storage.deleteItem('token');
      // await storage.deleteItem('usuario');
      await SecureStore.deleteItemAsync('token'); // <-- Mudar
      await SecureStore.deleteItemAsync('usuario'); // <-- Mudar
      
      // 2. Manda o usuário de volta para o Login.
      // 'replace' é o método correto, pois impede o usuário
      // de "voltar" para o menu após deslogar.
      navigation.replace('SignIn'); 
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Define os botões do menu em um array
  // Isso torna o código JSX mais limpo
  const botoes = [
    { label: "Marcador de Vida", route: "Game" }, // Rota para o contador
    { label: "Deck", route: "Deck" }, // Rota para a lista de cartas
    { label: "Editor de Cartas", route: "Editor" }, // Rota para o CRUD de Admin
    { label: "Jogar com os amigos", route: "Multiplayer" }, // Rota futura
  ];

  return (
    // Imagem de fundo que cobre a tela inteira
    <ImageBackground 
      source={require("../../assets/BackgroundMenu.png")} 
      style={styles.container}
      blurRadius={2} // Aplica um leve desfoque na imagem
    >
      {/* Camada de overlay para escurecer o fundo */}
      {/* Isso melhora a legibilidade do texto branco */}
      <View style={styles.overlay} />
      
      {/* Cabeçalho "ODISSEIA" animado (entra de cima) */}
      <Animatable.View 
        animation="fadeInDown" // Animação
        duration={1200} // Duração
        style={styles.header}
      >
        <Text style={styles.title}>ODISSEIA</Text>
        <Text style={styles.subtitle}>Escolha seu modo de jogo</Text>
      </Animatable.View>

      {/* Container dos botões animado (entra de baixo) */}
      <Animatable.View 
      animation="fadeInUp" // Animação
      duration={1200}
      delay={400} // Atraso para começar depois do título
      style={styles.buttonContainer}
    >
      {/* * Renderiza a lista de botões usando o array 'botoes'.
        * Isso é muito mais limpo do que escrever cada botão manualmente.
        */}
      {botoes.map((btn, index) => (
        <TouchableOpacity 
          key={index} // Chave única para cada item
          style={[styles.button, { marginBottom: 15 }]} // Estilo do botão
          activeOpacity={0.8} // Efeito de clique
          onPress={() => navigation.navigate(btn.route)} // Navega para a rota
        >
          <View>
            <Text style={styles.buttonText}>{btn.label}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Botão "Sair" (Logout) */}
      {/* Fica separado do .map() por ter estilo e função diferentes */}
      <TouchableOpacity 
        style={[styles.button, styles.logoutButton, { marginBottom: 0 }]} // Estilo base + estilo de logout
        activeOpacity={0.8}
        onPress={handleLogout} // Chama a função de deslogar
      >
        <Text style={[styles.buttonText, styles.logoutButtonText]}>Sair</Text>
      </TouchableOpacity>
    </Animatable.View>

    </ImageBackground>
  );
}

// Estilos
const styles = StyleSheet.create({
  // Container principal (imagem de fundo)
  container: { 
    flex: 1, // Ocupa a tela toda
    resizeMode: "cover",
    justifyContent: "center", // Centraliza o conteúdo (header, botões) na vertical
    alignItems: "center", // Centraliza na horizontal
  },
  // Camada de escurecimento
  overlay: { 
    ...StyleSheet.absoluteFillObject, // Truque para cobrir 100% do pai
    backgroundColor: "rgba(0,0,0,0.4)", // Preto com 40% de opacidade
  },
  // Container do título "ODISSEIA"
  header: { 
    alignItems: "center",
    marginBottom: 40, // Espaço entre o título e os botões
  },
  // Texto "ODISSEIA"
  title: { 
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 3, // Espaçamento entre letras
    textShadowColor: "#000", // Sombra no texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  // Texto "Escolha seu modo..."
  subtitle: { 
    fontSize: 16,
    color: "#ccc",
    marginTop: 8,
  },
  // Caixa que segura todos os botões
  buttonContainer: { 
    width: "80%", // Ocupa 80% da largura da tela
    alignItems: "center",
    gap: 15, // Espaçamento entre os botões (adicionado no seu código original)
  },
  // Estilo padrão de um botão de navegação
  button: { 
    width: "100%",
    backgroundColor: "rgba(36,58,115,0.9)", // Azul com 90% de opacidade
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000", // Sombra
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5, // Sombra (Android)
    borderWidth: 1,
    borderColor: "#4A69BD", // Borda sutil
  },
  // Texto padrão de um botão de navegação
  buttonText: { 
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  /* --- ESTILOS ESPECÍFICOS PARA O BOTÃO "SAIR" --- */
  // Sobrescreve o 'button' padrão
  logoutButton: {
    backgroundColor: "rgba(161, 161, 161, 0.7)", // Cinza transparente
    borderColor: "#a1a1a1", // Borda cinza
    marginTop: 10, // Espaço extra acima dele
  },
  // Sobrescreve o 'buttonText' padrão
  logoutButtonText: {
    color: "#e0e0e0", // Texto cinza claro
    fontSize: 16, // Fonte menor
    fontWeight: "normal", // Sem negrito
  }
});