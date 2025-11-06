import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- Configurações Visuais ---
// Define os gradientes de fundo para cada jogador
const colors = {
  red: ['#b91c1c', '#dc2626', '#ef4444'],
  blue: ['#1d4ed8', '#2563eb', '#3b82f6'],
};

// Define as imagens dos 4 "selos" (contadores circulares)
// **ATENÇÃO:** Garanta que estes caminhos de imagem estejam corretos.
const sealIcons = {
  redPlayer: [
    require('../../assets/MarcadoresDeVida/TokenGelo.png'),
    require('../../assets/MarcadoresDeVida/TokenFogo.png'),
    require('../../assets/MarcadoresDeVida/TokenFuria.png'),
    require('../../assets/MarcadoresDeVida/TokenSilencio.png'),
  ],
  bluePlayer: [
    require('../../assets/MarcadoresDeVida/TokenGelo.png'),
    require('../../assets/MarcadoresDeVida/TokenFogo.png'),
    require('../../assets/MarcadoresDeVida/TokenFuria.png'),
    require('../../assets/MarcadoresDeVida/TokenSilencio.png'),
  ],
};

// 1. Sua "Biblioteca" de Ícones (Organizada por Categoria)
// Esta é a lista de todos os ícones disponíveis para os slots de stats.
const iconCategories = {
  'Ataque': [
    { name: 'Confuso', icon: require('../../assets/MarcadoresDeVida/TokenConfuso.png') },
    { name: 'Danificado', icon: require('../../assets/MarcadoresDeVida/TokenDanificado.png') },
    { name: 'Tesoura', icon: require('../../assets/MarcadoresDeVida/TokenFogo.png') }, 
  ],
  'Defesa': [
    { name: 'Fogo', icon: require('../../assets/MarcadoresDeVida/TokenFogo.png') },
    { name: 'Traço', icon: require('../../assets/MarcadoresDeVida/TokenFuria.png') },
  ],
  'Resistência': [
    { name: 'Estrela', icon: '⭐' },
    { name: 'Círculo', icon: require('../../assets/MarcadoresDeVida/TokenVeneno.png') },
  ],
};

// 2. Molde Inicial do Jogador (Automático)
// Esta função cria um "jogador" novo.
// Ela lê as 'iconCategories' e cria um slot de stat para cada categoria.
const getInitialPlayerState = () => {
  
  // Pega os nomes das categorias (ex: ['Ataque', 'Defesa', 'Resistência'])
  const categoryNames = Object.keys(iconCategories);

  // Cria o array 'stats' automaticamente
  const initialStats = categoryNames.map(categoryName => {
    
    // Pega o *primeiro* ícone daquela categoria
    const firstIcon = (iconCategories[categoryName] && iconCategories[categoryName][0]) 
                      ? iconCategories[categoryName][0].icon 
                      : '❓'; // Ícone de erro se a categoria estiver vazia

    // Retorna o objeto do slot
    return {
      icon: firstIcon,
      value: 0, // Valor inicial é 0 para todos
      category: categoryName // Vincula o slot à sua categoria
    };
  });

  // Retorna o estado completo do jogador
  return {
    life: 30,
    timer: 900,
    stats: initialStats, // Usa o array que acabamos de criar
    counters: [2, 2, 2, 2], // Valores iniciais dos 4 selos
  };
};

// --- Função Auxiliar ---
// Formata segundos (ex: 900) para o formato de relógio "15:00"
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// --- Componente Visual: PlayerSection ---
// Este componente é "burro". Ele apenas exibe os dados (props)
// que recebe do componente 'Frente'.
const PlayerSection = ({
  // Dados
  gradientColors,
  playerNum, 
  life,
  timer,
  stats,
  counters,
  isActive,
  // Funções (são "disparadas" para o componente pai)
  onLifeChange,
  onPassTurn,
  onOpenModal,
  onOpenIconModal,
}) => {
  // Escolhe o conjunto de selos correto (vermelho ou azul)
  const currentSealIcons = playerNum === 1 ? sealIcons.redPlayer : sealIcons.bluePlayer;

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.section, !isActive && styles.inactiveSection]} // Fica opaco se inativo
    >
      {/* 1. Header (Timer) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTime}>{formatTime(timer)}</Text>
      </View>

      {/* 2. Conteúdo Central (Vida, Selos, Stats) */}
      <View style={styles.centerContent}>

        {/* Contador de Vida (Layout: + 30 - / 30 MÁX) */}
        <View style={styles.scoreBox}>
          <TouchableOpacity
            style={styles.scoreButton}
            onPress={() => onLifeChange(1)} // Tocar = +1
            onLongPress={() => onLifeChange(5)} // Segurar = +5
          >
            <Text style={styles.scoreButtonText}>+</Text>
          </TouchableOpacity>

          <Text style={styles.scoreText}>{life}</Text>

          <TouchableOpacity
            style={styles.scoreButton}
            onPress={() => onLifeChange(-1)} // Tocar = -1
            onLongPress={() => onLifeChange(-5)} // Segurar = -5
          >
            <Text style={styles.scoreButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.scoreMaxSeparator}>/</Text>
          <Text style={styles.scoreMaxText}>30</Text>
          <Text style={styles.scoreMaxLabel}>MÁX</Text>
        </View>

        {/* Contadores de Selo (4 Imagens de Selo) */}
        <View style={styles.sealRow}>
          {counters.map((count, i) => (
            <TouchableOpacity
              key={i}
              style={styles.sealButton}
              onPress={() => onOpenModal('counter', i, count)} // Tocar = Abrir modal de valor
            >
              <Image source={currentSealIcons[i]} style={styles.sealImage} />
              <Text style={styles.sealText}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contadores de Stats (Ícones de Categoria) */}
        <View style={styles.statsRow}>
          {stats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onOpenModal('stat', index, stat.value)} // Tocar = Abrir modal de valor
              onLongPress={() => onOpenIconModal(index)} // Segurar = Abrir modal de ícone
              style={styles.statBadge}
            >
              <View style={styles.statBadgeContent}>
                {/* Renderiza <Text> se for emoji, <Image> se for 'require()' */}
                {typeof stat.icon === 'string' ? (
                  <Text style={styles.statBadgeTextIcon}>{stat.icon}</Text>
                ) : (
                  <Image source={stat.icon} style={styles.statBadgeImage} />
                )}
                <Text style={styles.statBadgeTextValue}>{stat.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 3. Rodapé (Botão "Passar a Vez") */}
      <TouchableOpacity
        style={styles.passButtonContainer}
        onPress={onPassTurn}
        disabled={!isActive} // Desabilita o botão se não for o turno do jogador
      >
        <Text style={styles.passButtonText}>
          PASSAR A VEZ
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

// --- Componente Principal (O "Cérebro" do App) ---
// O 'Frente' guarda todos os dados e lida com toda a lógica.
export default function Frente() {
  
  // --- Estados ---
  // Guarda os dados dos jogadores. Usar a função 'getInitialPlayerState()'
  // garante que P1 e P2 sejam cópias independentes (corrige o bug de estado).
  const [player1, setPlayer1] = useState(getInitialPlayerState());
  const [player2, setPlayer2] = useState(getInitialPlayerState());
  const [activePlayer, setActivePlayer] = useState(1); // Controla quem está jogando

  // Controla o modal de MUDAR VALOR
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalInputValue, setModalInputValue] = useState('');
  const [modalTarget, setModalTarget] = useState(null); // Guarda quem estamos editando

  // Controla o modal de MUDAR ÍCONE
  const [isIconModalVisible, setIconModalVisible] = useState(false);
  const [iconModalTarget, setIconModalTarget] = useState(null); // Guarda quem estamos editando

  // --- Efeito do Cronômetro ---
  useEffect(() => {
    // A cada 1 segundo...
    const timerInterval = setInterval(() => {
      if (activePlayer === 1) {
        // ...diminui o tempo do Jogador 1
        setPlayer1((p) => ({ ...p, timer: p.timer > 0 ? p.timer - 1 : 0 }));
      } else {
        // ...diminui o tempo do Jogador 2
        setPlayer2((p) => ({ ...p, timer: p.timer > 0 ? p.timer - 1 : 0 }));
      }
    }, 1000);

    // Limpa o intervalo se o 'activePlayer' mudar (para e reinicia o timer)
    return () => {
      clearInterval(timerInterval);
    };
  }, [activePlayer]); // Dependência: Roda de novo sempre que 'activePlayer' mudar

  // --- Funções de Jogo ---

  // Altera a vida do jogador, com limites
  const handleLifeChange = (playerNum, amount) => {
    const setPlayer = playerNum === 1 ? setPlayer1 : setPlayer2;
    setPlayer((prev) => {
      const newLife = prev.life + amount;
      if (newLife > 99) return { ...prev, life: 99 }; // Limite máx
      if (newLife < 0) return { ...prev, life: 0 };  // Limite mín
      return { ...prev, life: newLife };
    });
  };

  // Troca o turno do jogador
  const handlePassTurn = () => {
    setActivePlayer((prev) => (prev === 1 ? 2 : 1)); // Se era 1 vira 2, se era 2 vira 1
  };

  // Reseta o jogo para o estado inicial
  const handleReset = () => {
    setPlayer1(getInitialPlayerState());
    setPlayer2(getInitialPlayerState());
    setActivePlayer(1);
  };

  // --- Funções do Modal de VALOR ---
  
  // Abre o modal de valor e define qual item estamos editando
  const openModal = (playerNum, type, key, currentValue) => {
    // 'key' pode ser o índice do 'stat' (0, 1, 2) ou do 'counter' (0, 1, 2, 3)
    setModalTarget({ player: playerNum, type: type, key: key });
    setModalInputValue(String(currentValue)); // Define o valor atual no input
    setModalVisible(true);
  };

  // Confirma a mudança de valor do modal
  const handleModalConfirm = () => {
    const { player, type, key } = modalTarget;
    let newValue = parseInt(modalInputValue, 10); // Converte o texto do input para número
    if (isNaN(newValue)) newValue = 0; // Se for inválido, vira 0

    const setPlayer = player === 1 ? setPlayer1 : setPlayer2;

    // Lógica para atualizar o array 'stats'
    if (type === 'stat') {
      setPlayer((prev) => {
        const newStats = prev.stats.map(s => ({ ...s })); // Cria cópia segura
        newStats[key].value = newValue >= 0 ? newValue : 0; // Define o novo valor
        return { ...prev, stats: newStats };
      });
    // Lógica para atualizar o array 'counters' (selos)
    } else if (type === 'counter') {
      setPlayer((prev) => {
        const newCounters = [...prev.counters];
        newCounters[key] = newValue >= 0 ? newValue : 0;
        return { ...prev, counters: newCounters };
      });
    }
    setModalVisible(false); // Fecha o modal
    setModalTarget(null);
  };

  // Fecha o modal de valor sem salvar
  const handleModalClose = () => {
    setModalVisible(false);
    setModalTarget(null);
  };

  // Funções dos botões +1, -1, +5, -5 de dentro do modal de valor
  const adjustModalValue = (amount) => {
    setModalInputValue((prev) => {
      const newValue = (parseInt(prev, 10) || 0) + amount;
      return String(newValue >= 0 ? newValue : 0); // Não deixa ficar negativo
    });
  };

  // --- Funções do Modal de ÍCONE ---

  // Abre o modal de ícone e define qual slot (e sua categoria) estamos editando
  const openIconModal = (playerNum, index, category) => {
    setIconModalTarget({ player: playerNum, index: index, category: category });
    setIconModalVisible(true);
  };

  // Atualiza o ícone do slot quando um é selecionado no modal
  const handleIconSelect = (selectedIconObject) => {
    if (!iconModalTarget) return;
    const { player, index } = iconModalTarget;
    const setPlayer = player === 1 ? setPlayer1 : setPlayer2;

    setPlayer((prev) => {
      const newStats = prev.stats.map(s => ({ ...s })); // Cópia segura
      newStats[index].icon = selectedIconObject.icon || selectedIconObject; // Define o novo ícone
      return { ...prev, stats: newStats };
    });

    setIconModalVisible(false); // Fecha o modal
    setIconModalTarget(null);
  };

  // Função inteligente que decide o que mostrar no modal de ícone
  const renderIconCategories = () => {
    const targetCategory = iconModalTarget?.category; // A categoria do slot que foi clicado

    // 1. Se o slot tem uma categoria definida (ex: 'Ataque')...
    if (targetCategory && iconCategories[targetCategory]) {
      // ...mostra APENAS os ícones daquela categoria.
      return (
        <View>
          <Text style={styles.iconCategoryTitle}>{targetCategory}</Text>
          <View style={styles.iconModalGrid}>
            {iconCategories[targetCategory].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.iconButton}
                onPress={() => handleIconSelect(item)}
              >
                {typeof item.icon === 'string' ? (
                  <Text style={styles.iconText}>{item.icon}</Text>
                ) : (
                  <Image source={item.icon} style={styles.iconImage} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    // 2. Se o slot NÃO tem categoria definida...
    // ...mostra TODAS as categorias (comportamento padrão).
    return Object.keys(iconCategories).map(categoryName => (
      <View key={categoryName}>
        <Text style={styles.iconCategoryTitle}>{categoryName}</Text>
        <View style={styles.iconModalGrid}>
          {iconCategories[categoryName].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconButton}
              onPress={() => handleIconSelect(item)}
            >
              {typeof item.icon === 'string' ? (
                <Text style={styles.iconText}>{item.icon}</Text>
              ) : (
                <Image source={item.icon} style={styles.iconImage} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ));
  };


  // --- Renderização Principal (JSX) ---
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        
        {/* ---- JOGADOR 1 (VERMELHO) ---- */}
        {/* Esta View gira todo o conteúdo do Jogador 1 em 180 graus */}
        <View style={{ flex: 1, transform: [{ rotate: '180deg' }] }}>
          <PlayerSection
            playerNum={1} // Identifica como Jogador 1
            gradientColors={colors.red}
            {...player1} // Passa todos os dados do player 1 (life, timer, etc)
            isActive={activePlayer === 1} // Está ativo?
            // Passa as funções de "callback"
            onLifeChange={(amount) => handleLifeChange(1, amount)}
            onPassTurn={handlePassTurn}
            onOpenModal={(type, key, val) => openModal(1, type, key, val)}
            // Passa a categoria do slot que foi clicado
            onOpenIconModal={(index) => openIconModal(1, index, player1.stats[index].category)}
          />
        </View>

        {/* ---- DIVISOR E ÍCONE DE MENU ---- */}
        <View style={styles.handleContainer}>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* ---- JOGADOR 2 (AZUL) ---- */}
        {/* Conteúdo normal, sem rotação */}
        <PlayerSection
          playerNum={2} // Identifica como Jogador 2
          gradientColors={colors.blue}
          {...player2}
          isActive={activePlayer === 2}
          onLifeChange={(amount) => handleLifeChange(2, amount)}
          onPassTurn={handlePassTurn}
          onOpenModal={(type, key, val) => openModal(2, type, key, val)}
          onOpenIconModal={(index) => openIconModal(2, index, player2.stats[index].category)}
        />
      </View>

      {/* --- Modal de VALOR --- */}
      {/* Este modal flutua sobre todo o app, e só aparece quando 'isModalVisible' é true */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalBackdrop}>
          {/* Gira o conteúdo do modal se for o Jogador 1 */}
          <View style={[
            styles.modalContent,
            modalTarget?.player === 1 && { transform: [{ rotate: '180deg' }] }
          ]}>
            <Text style={styles.modalTitle}>Definir Novo Valor</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="number-pad"
              value={modalInputValue}
              onChangeText={setModalInputValue}
              autoFocus={true}
            />
            {/* Botões de ajuste rápido */}
            <View style={styles.modalAdjustRow}>
              <TouchableOpacity
                style={styles.modalAdjustButton}
                onPress={() => adjustModalValue(-5)}
              >
                <Text style={styles.modalAdjustText}>-5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAdjustButton}
                onPress={() => adjustModalValue(-1)}
              >
                <Text style={styles.modalAdjustText}>-1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAdjustButton}
                onPress={() => adjustModalValue(1)}
              >
                <Text style={styles.modalAdjustText}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAdjustButton}
                onPress={() => adjustModalValue(5)}
              >
                <Text style={styles.modalAdjustText}>+5</Text>
              </TouchableOpacity>
            </View>
            {/* Botões de ação */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleModalClose}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleModalConfirm}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL DE ÍCONE --- */}
      {/* Este modal também flutua, e só aparece quando 'isIconModalVisible' é true */}
      <Modal
        visible={isIconModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIconModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          {/* Gira o conteúdo do modal se for o Jogador 1 */}
          <View style={[
            styles.modalContent,
            iconModalTarget?.player === 1 && { transform: [{ rotate: '180deg' }] }
          ]}>
            <Text style={styles.modalTitle}>Escolha um Ícone</Text>
            {/* O ScrollView mostra a lista de ícones filtrada */}
            <ScrollView style={styles.iconModalScroll}>
              {renderIconCategories()}
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalButtonCancel,
                { marginTop: 16, width: '100%' },
              ]}
              onPress={() => setIconModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- Folha de Estilos (StyleSheet) ---
const styles = StyleSheet.create({
  // --- Estilos Globais ---
  screen: { 
    flex: 1, // Garante que o app ocupe a tela inteira
    backgroundColor: '#000', // Fundo preto para áreas do Safe Area (ex: notch)
  },
  card: { 
    flex: 1, // O container principal dos jogadores
    width: '100%', 
    overflow: 'hidden' 
  },
  
  // --- Estilos da Seção do Jogador ---
  section: {
    flex: 1, // Garante que cada jogador ocupe metade da tela
    justifyContent: 'space-between', // Empurra o conteúdo (Header, Center, Footer)
    position: 'relative',
    paddingTop: 40, // Espaço para o header flutuante
    paddingBottom: 40, // Espaço para o footer flutuante
  },
  inactiveSection: { 
    opacity: 0.6, // Deixa o jogador inativo mais escuro
  },

  // Header (Timer)
  sectionHeader: {
    position: 'absolute', // Flutua sobre o conteúdo
    top: 40,
    right: 20,
    zIndex: 10,
  },
  sectionTime: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Conteúdo Central (Onde ficam os contadores)
  centerContent: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  // Contador de Vida (Layout: + 30 - / 30 MÁX)
  scoreBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 24,
  },
  scoreButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreButtonText: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  scoreMaxSeparator: {
    fontSize: 32,
    color: '#a0a0a0',
    fontWeight: '300',
    marginRight: 8,
  },
  scoreMaxText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  scoreMaxLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    writingDirection: 'rtl', // Escreve o texto verticalmente
    textTransform: 'uppercase',
    marginLeft: 4,
  },

  // Contadores de Selo (Imagens de Cera)
  sealRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  sealButton: { // O botão clicável que contém a imagem e o texto
    position: 'relative', 
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  sealImage: { // A imagem do selo
    position: 'absolute', 
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  sealText: { // O número sobre o selo
    color: 'white', 
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)', 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Contadores de Stats (Ícone EM CIMA do valor)
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fundo translúcido
    borderRadius: 12,
    padding: 8,
  },
  statBadge: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    paddingVertical: 8,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadgeContent: {
    flexDirection: 'column', // Ícone em cima, texto embaixo
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  statBadgeTextIcon: { // Estilo para ícones de EMOJI
    fontSize: 24,
    color: '#ffffff',
  },
  statBadgeImage: { // Estilo para ícones de IMAGEM
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  statBadgeTextValue: { // O número
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Rodapé (Botão "Passar a Vez")
  passButtonContainer: {
    position: 'absolute', // Flutua sobre o conteúdo
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  disabledButton: { 
    opacity: 0.5, // Estilo para o botão "Passar a Vez" desabilitado
  },

  // Divisor Central (Ícone de Menu/Reset)
  handleContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  resetButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 4,
  },
  resetButtonText: {
    color: '#555',
    fontSize: 24, // Tamanho do ícone '☰'
    fontWeight: 'bold',
  },

  // --- Estilos do Modal de VALOR ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escuro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalInput: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1d4ed8',
    borderBottomWidth: 2,
    borderColor: '#d1d5db',
    width: '80%',
    marginBottom: 20,
    paddingVertical: 8,
  },
  modalAdjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  modalAdjustButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  modalAdjustText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  modalButtonConfirm: {
    backgroundColor: '#1d4ed8',
    marginLeft: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // --- ESTILOS DO MODAL DE ÍCONE ---
  iconModalScroll: {
    width: '100%',
    maxHeight: 300,
  },
  iconCategoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  iconModalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  iconButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    margin: 6,
  },
  iconText: {
    fontSize: 30,
  },
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});