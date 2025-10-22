// src/screens/GameScreen.js
import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    Text,
    Modal,
    FlatList,
    Image 
} from 'react-native';

// Importação dos componentes filhos
import Player from '../../components/Player';
import DiceRoller from '../../components/RolagemDeDados';
// Importação dos ícones e do tipo de vida padrão
import { iconesVida, TIPO_VIDA_PADRAO } from '../../constants/iconesVida'; 

/**
 * Função helper para criar o estado inicial de um novo jogador.
 * @param {number} vidaInicial - A vida inicial definida na tela de Setup.
 * @returns {object} Um objeto de estado para um jogador.
 */
const criarEstadoInicialJogador = (vidaInicial) => {
    // Cria um objeto de vidas, onde cada tipo (fogo, veneno, etc.) começa com a vida inicial
    const vidas = {};
    for (const tipo in iconesVida) {
        vidas[tipo] = vidaInicial;
    }
    
    return {
        tipoAtual: TIPO_VIDA_PADRAO, // Define o marcador padrão (o primeiro da lista)
        vidas: vidas, // O objeto com todas as vidas
    };
};

/**
 * Tela principal do Jogo, onde os contadores de vida são exibidos.
 */
export default function GameScreen({ route, navigation }) {
  // Pega os parâmetros passados da tela de Setup
  const { playerCount: initialPlayerCount, startingLife } = route.params;

  // Estado para controlar o número de jogadores (pode mudar durante o jogo)
  const [playerCount, setPlayerCount] = useState(initialPlayerCount);

  // Estado principal: um array contendo os objetos de estado de todos os jogadores
  const [jogadores, setJogadores] = useState([]);
  
  // Estado para controlar a visibilidade do modal de rolagem de dados
  const [isDiceModalVisible, setDiceModalVisible] = useState(false);
  
  // Estado para controlar a visibilidade do modal de marcadores
  const [marcadorModalVisivel, setMarcadorModalVisivel] = useState(false);
  // Estado para saber qual jogador está trocando o marcador (armazena o índice)
  const [jogadorAtual, setJogadorAtual] = useState(null); 

  // Efeito que roda quando 'playerCount' ou 'startingLife' mudam
  // Ele ajusta o array 'jogadores' para o novo número de jogadores
  useEffect(() => {
    setJogadores(currentJogadores => {
        const newArray = Array(playerCount).fill(null);
        for (let i = 0; i < playerCount; i++) {
            // Se um jogador já existe nessa posição, o mantém. Senão, cria um novo.
            newArray[i] = currentJogadores[i] || criarEstadoInicialJogador(startingLife);
        }
        // Retorna o novo array (pode ser maior ou menor que o anterior)
        return newArray.slice(0, playerCount); 
    });
  }, [playerCount, startingLife]);


  // --- Funções de Lógica do Jogo ---

  // Abre o modal de marcadores para um jogador específico
  const abrirMarcadorModal = (indice) => {
    setJogadorAtual(indice); // Define qual jogador está ativo
    setMarcadorModalVisivel(true);
  };

  // Fecha o modal de marcadores
  const fecharMarcadorModal = () => {
    setMarcadorModalVisivel(false);
    setJogadorAtual(null); // Limpa o jogador ativo
  };

  // Altera o tipo de marcador de vida (fogo, veneno, etc.) do jogador ativo
  const alterarTipoDeVida = (novoTipo) => {
    if (jogadorAtual === null) return; // Checagem de segurança

    const novosJogadores = [...jogadores]; // Cria cópia do array de estado
    novosJogadores[jogadorAtual].tipoAtual = novoTipo; // Atualiza o tipo
    setJogadores(novosJogadores); // Define o novo estado
    fecharMarcadorModal(); // Fecha o modal
  };

  // Altera a vida (+1 ou -1) do jogador no índice X
  const alterarVida = (indice, valor) => {
    const novosJogadores = [...jogadores];
    const jogador = novosJogadores[indice];
    const tipo = jogador.tipoAtual; // Pega o marcador ativo (ex: 'vidatipo10')
    const vidaAtual = jogador.vidas[tipo]; // Pega a vida desse marcador
    
    // Atualiza a vida, com limite entre 0 e 999
    jogador.vidas[tipo] = Math.max(0, Math.min(999, vidaAtual + valor));
    setJogadores(novosJogadores);
  };

  // Define um valor de vida específico (pelo input) do jogador no índice X
  const definirVida = (indice, valorTexto) => {
    const novosJogadores = [...jogadores];
    const jogador = novosJogadores[indice];
    const tipo = jogador.tipoAtual;

    let valorNumerico = parseInt(valorTexto, 10);
    if (isNaN(valorNumerico)) {
        valorNumerico = 0; // Se o texto for inválido (ex: "abc" ou ""), vira 0
    }

    jogador.vidas[tipo] = Math.max(0, Math.min(999, valorNumerico));
    setJogadores(novosJogadores);
  };
  
  // Reinicia as vidas de todos os jogadores para o valor inicial
  const reiniciarVidas = () => {
    setJogadores(
        Array(playerCount).fill(null).map(() => criarEstadoInicialJogador(startingLife))
    );
  };

  // Adiciona um jogador, até o limite de 6
  const adicionarJogador = () => {
    setPlayerCount(count => Math.min(6, count + 1));
  };

  // Remove um jogador, até o limite de 1
  const removerJogador = () => {
    setPlayerCount(count => Math.max(1, count - 1));
  };


  // --- Função de Renderização ---

  /**
   * Renderiza os componentes 'Player' com base no layout (número de jogadores).
   * Esta é a lógica principal para dividir a tela.
   */
  const renderPlayers = () => {
    // Não renderiza nada se o array de jogadores ainda não foi inicializado
    if (jogadores.length === 0) return null; 

    const players = [];
    
    // Itera sobre o array 'jogadores' (usa .length para segurança)
    for (let i = 0; i < jogadores.length; i++) {
      
      // Lógica para girar os jogadores de cima (metade superior)
      const isFlipped = jogadores.length > 1 && i <= Math.ceil(jogadores.length / 2) - 1; 
      
      players.push(
        <Player 
            key={i} 
            isFlipped={isFlipped}
            jogadorData={jogadores[i]} // Passa o objeto de dados do jogador
            onOpenMarkerModal={() => abrirMarcadorModal(i)} // Passa a função para abrir o modal
            onAlterarVida={(valor) => alterarVida(i, valor)} // Passa a função para alterar vida
            onDefinirVida={(valorTexto) => definirVida(i, valorTexto)} // Passa a função para definir vida
        />
      );
    }

    // Lógica de Layout: divide os jogadores em fileiras (View style={styles.row})
    // com base no 'jogadores.length'
    if (jogadores.length === 1) {
      return <View style={styles.row}>{players}</View>;
    }
    if (jogadores.length === 2) {
      return (
        <>
          <View style={styles.row}>{players.slice(0, 1)}</View>
          <View style={styles.row}>{players.slice(1, 2)}</View>
        </>
      );
    }
    if (jogadores.length === 3) {
      return (
        <>
          <View style={styles.row}>{players.slice(0, 2)}</View>
          <View style={styles.row}>{players.slice(2, 3)}</View>
        </>
      );
    }
    if (jogadores.length === 4) {
      return (
        <>
          <View style={styles.row}>{players.slice(0, 2)}</View>
          <View style={styles.row}>{players.slice(2, 4)}</View>
        </>
      );
    }
     if (jogadores.length === 5) {
      return (
        <>
          <View style={styles.row}>{players.slice(0, 3)}</View>
          <View style={styles.row}>{players.slice(3, 5)}</View>
        </>
      );
    }
    if (jogadores.length === 6) {
      return (
        <>
          <View style={styles.row}>{players.slice(0, 3)}</View>
          <View style={styles.row}>{players.slice(3, 6)}</View>
        </>
      );
    }
  };

  // Renderização principal da tela
  return (
    <SafeAreaView style={styles.container}>
      {/* Modal de Rolagem de Dados */}
      <DiceRoller visible={isDiceModalVisible} onClose={() => setDiceModalVisible(false)} />
      
      {/* Modal de Seleção de Marcadores */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={marcadorModalVisivel}
        onRequestClose={fecharMarcadorModal}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitulo}>Escolha um Marcador</Text>
                
                {/* Lista de ícones com quebra de linha (flexWrap) */}
                <View style={styles.modalIconList}>
                  {Object.keys(iconesVida).map((tipo) => {
                      const icone = iconesVida[tipo];
                      return (
                            <TouchableOpacity key={tipo} style={styles.modalIconeContainer} onPress={() => alterarTipoDeVida(tipo)}>
                              {/* Renderiza 'Image' se for um 'require', ou 'Text' se for um emoji (placeholder) */}
                              {typeof icone === 'number' ? (
                                  <Image source={icone} style={styles.modalIcone} />
                              ) : (
                                  <Text style={styles.modalIcone}>{icone}</Text>
                              )}
                          </TouchableOpacity>
                      )
                  })}
                </View>

                {/* Botão de Fechar o Modal */}
                <TouchableOpacity style={styles.modalBotaoFechar} onPress={fecharMarcadorModal}>
                    <Text style={styles.modalBotaoFecharTexto}>Fechar</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* Área principal onde os jogadores são renderizados */}
      <View style={styles.gameArea}>
        {renderPlayers()}
      </View>

      {/* Barra de Menu inferior */}
      <View style={styles.menuBar}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
            <Text style={styles.menuButtonText}>↩️</Text>
        </TouchableOpacity>

        {/* Botão de Remover Jogador */}
        <TouchableOpacity style={styles.menuButton} onPress={removerJogador}>
            <Text style={styles.menuButtonText}>-</Text>
        </TouchableOpacity>

        {/* Botão de Rolar Dados */}
        <TouchableOpacity style={styles.menuButton} onPress={() => setDiceModalVisible(true)}>
            <Text style={styles.menuButtonText}>🎲</Text>
        </TouchableOpacity>
        
        {/* Botão de Adicionar Jogador */}
        <TouchableOpacity style={styles.menuButton} onPress={adicionarJogador}>
            <Text style={styles.menuButtonText}>+</Text>
        </TouchableOpacity>

        {/* Botão de Reiniciar a Partida */}
        <TouchableOpacity style={styles.menuButton} onPress={reiniciarVidas}>
            <Text style={styles.menuButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Estilos da Tela de Jogo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameArea: {
      flex: 1, // Ocupa todo o espaço disponível
  },
  row: {
    flex: 1, // Cada fileira ocupa espaço igual
    flexDirection: 'row',
  },
  menuBar: {
    position: 'absolute', // Flutua sobre a tela
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    padding: 15,
    borderRadius: 50, // Botões redondos
    marginHorizontal: 10,
  },
  menuButtonText: {
    fontSize: 24,
  },

  // Estilos do Modal de Marcadores
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
  },
  modalContainer: { 
    width: '90%', 
    backgroundColor: 'white', 
    borderRadius: 15, 
    padding: 20, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5, 
  },
  modalTitulo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#000',
  },
  modalIconList: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite quebrar a linha
    justifyContent: 'center',
    width: '100%',
  },
  modalIconeContainer: { 
    margin: 8, 
    padding: 10, 
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  modalIcone: { 
    width: 40, 
    height: 40, 
    fontSize: 30, // Para emojis (se usados como placeholder)
  },
  modalBotaoFechar: { 
    marginTop: 20, 
    backgroundColor: '#A73636', 
    borderRadius: 8, 
    paddingVertical: 10, 
    paddingHorizontal: 30, 
  },
  modalBotaoFecharTexto: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold', 
  }
});