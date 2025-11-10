import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

// Componentes visuais "burros" (só exibem dados)
import PlayerSection from '../../components/PlayerSection';
import ValueModal from '../../components/ValueModal';
import IconModal from '../../components/IconModal';

// Constantes (cores) e Funções utilitárias (estado inicial)
import { colors } from '../../constants/gameData';
import { getInitialPlayerState } from '../../utils/helpers';
import styles from './styles'; // Estilos desta tela

// Este é o componente "Inteligente" (Controlador de Estado)
export default function GameScreen() {
  
  // --- Estados Principais ---
  // Armazena todos os dados do jogador 1 (vida, tempo, contadores)
  const [player1, setPlayer1] = useState(getInitialPlayerState());
  // Armazena todos os dados do jogador 2
  const [player2, setPlayer2] = useState(getInitialPlayerState());
  // Controla de quem é a vez (número 1 or 2)
  const [activePlayer, setActivePlayer] = useState(1);

  // --- Estados dos Modais ---
  // Controla a visibilidade do modal de NÚMERO
  const [isModalVisible, setModalVisible] = useState(false);
  // O valor (em texto) dentro do input do modal
  const [modalInputValue, setModalInputValue] = useState('');
  // O "alvo" do modal (ex: 'stat 0' do 'player 1')
  const [modalTarget, setModalTarget] = useState(null); 
  // Controla a visibilidade do modal de ÍCONE
  const [isIconModalVisible, setIconModalVisible] = useState(false);
  // O "alvo" do modal de ícone (ex: 'stat 1' do 'player 2')
  const [iconModalTarget, setIconModalTarget] = useState(null);

  // --- Efeito do Cronômetro (Timer) ---
  useEffect(() => {
    // A cada 1 segundo (1000ms), roda esta função
    const timerInterval = setInterval(() => {
      // Se for a vez do jogador 1...
      if (activePlayer === 1) {
        // ...diminui o tempo dele
        setPlayer1((p) => ({ ...p, timer: p.timer > 0 ? p.timer - 1 : 0 }));
      } else {
        // ...senão, diminui o tempo do jogador 2
        setPlayer2((p) => ({ ...p, timer: p.timer > 0 ? p.timer - 1 : 0 }));
      }
    }, 1000);
    
    // Função de "limpeza": para o intervalo quando o componente for desmontado
    return () => {
      clearInterval(timerInterval);
    };
  }, [activePlayer]); // Roda de novo sempre que o 'activePlayer' mudar

  // --- Funções de Jogo ---
  
  /** Altera a vida do jogador (ex: +1, -1, +5, -5) */
  const handleLifeChange = (playerNum, amount) => {
    const setPlayer = playerNum === 1 ? setPlayer1 : setPlayer2;
    setPlayer((prev) => {
      const newLife = prev.life + amount;
      // Impede a vida de passar de 99 ou ficar abaixo de 0
      if (newLife > 99) return { ...prev, life: 99 };
      if (newLife < 0) return { ...prev, life: 0 };
      return { ...prev, life: newLife };
    });
  };

  /** Passa o turno para o outro jogador */
  const handlePassTurn = () => {
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
  };

  /** Reseta o jogo para o estado inicial */
  const handleReset = () => {
    setPlayer1(getInitialPlayerState());
    setPlayer2(getInitialPlayerState());
    setActivePlayer(1);
  };

  // --- Funções do Modal de VALOR (Numérico) ---
  
  /** Abre o modal de valor, definindo o alvo e o valor inicial */
  const openModal = (playerNum, type, key, currentValue) => {
    // Salva quem está sendo editado (ex: player 1, tipo 'stat', índice 'key')
    setModalTarget({ player: playerNum, type: type, key: key });
    // Coloca o valor atual no input
    setModalInputValue(String(currentValue));
    setModalVisible(true);
  };

  /** Confirma o novo valor do modal */
  const handleModalConfirm = () => {
    if (!modalTarget) return; // Segurança
    const { player, type, key } = modalTarget;
    let newValue = parseInt(modalInputValue, 10); // Converte o texto para número
    if (isNaN(newValue) || newValue < 0) newValue = 0; // Garante que é um número válido

    const setPlayer = player === 1 ? setPlayer1 : setPlayer2;

    if (type === 'stat') {
      // Se for um 'stat' (ex: mana), atualiza o array de stats
      setPlayer((prev) => {
        const newStats = prev.stats.map(s => ({ ...s })); // Copia o array
        newStats[key].value = newValue; // Atualiza o valor
        return { ...prev, stats: newStats };
      });
    } else if (type === 'counter') {
      // Se for um 'counter' (selo), atualiza o array de contadores
      setPlayer((prev) => {
        const newCounters = [...prev.counters]; // Copia o array
        newCounters[key] = newValue; // Atualiza o valor
        return { ...prev, counters: newCounters };
      });
    }
    setModalVisible(false); // Fecha o modal
    setModalTarget(null); // Limpa o alvo
  };

  /** Fecha o modal de valor sem salvar */
  const handleModalClose = () => {
    setModalVisible(false);
    setModalTarget(null);
  };

  /** Ajusta o valor DENTRO do modal (+1, -1, +5...) */
  const adjustModalValue = (amount) => {
    setModalInputValue((prev) => {
      const newValue = (parseInt(prev, 10) || 0) + amount;
      return String(newValue >= 0 ? newValue : 0);
    });
  };

  // --- Funções do Modal de ÍCONE ---

  /** Abre o modal de ícones, definindo o alvo */
  const openIconModal = (playerNum, index, category) => {
    setIconModalTarget({ player: playerNum, index: index, category: category });
    setIconModalVisible(true);
  };

  /** Chamado quando um ícone é selecionado no modal */
  const handleIconSelect = (selectedIconObject) => {
    if (!iconModalTarget) return;
    const { player, index } = iconModalTarget;
    const setPlayer = player === 1 ? setPlayer1 : setPlayer2;

    // Atualiza o 'icon' no array de 'stats'
    setPlayer((prev) => {
      const newStats = prev.stats.map(s => ({ ...s }));
      // O 'selectedIconObject' pode ser o objeto {name, icon} ou só o ícone (string/require)
      newStats[index].icon = selectedIconObject.icon || selectedIconObject;
      return { ...prev, stats: newStats };
    });

    setIconModalVisible(false);
    setIconModalTarget(null);
  };

  // --- Renderização Principal (JSX) ---
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        
        {/* ---- JOGADOR 1 (VERMELHO / Oponente) ---- */}
        {/* Esta View gira toda a seção do oponente em 180 graus */}
        <View style={{ flex: 1, transform: [{ rotate: '180deg' }] }}>
          <PlayerSection
            playerNum={1}
            gradientColors={colors.red}
            {...player1} // Passa todos os dados do player 1 (vida, tempo, etc.)
            isActive={activePlayer === 1} // Informa se ele é o jogador ativo
            // Passa as FUNÇÕES de callback, "ligando" elas ao player 1
            onLifeChange={(amount) => handleLifeChange(1, amount)}
            onPassTurn={handlePassTurn}
            onOpenModal={(type, key, val) => openModal(1, type, key, val)}
            onOpenIconModal={(index) => openIconModal(1, index, player1.stats[index].category)}
          />
        </View>

        {/* ---- DIVISOR E BOTÃO DE RESET (Menu) ---- */}
        <View style={styles.handleContainer}>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* ---- JOGADOR 2 (AZUL / Você) ---- */}
        <PlayerSection
          playerNum={2}
          gradientColors={colors.blue}
          {...player2} // Passa todos os dados do player 2
          isActive={activePlayer === 2}
          // Passa as FUNÇÕES de callback, "ligando" elas ao player 2
          onLifeChange={(amount) => handleLifeChange(2, amount)}
          onPassTurn={handlePassTurn}
          onOpenModal={(type, key, val) => openModal(2, type, key, val)}
          onOpenIconModal={(index) => openIconModal(2, index, player2.stats[index].category)}
        />
      </View>

      {/* --- Modais --- */}
      {/* Os modais ficam "flutuando" no final. Eles só aparecem */}
      {/* quando 'visible' é verdadeiro. */}
      
      <ValueModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        targetPlayer={modalTarget?.player} // Passa o jogador (para girar o modal)
        inputValue={modalInputValue}
        onInputChange={setModalInputValue} // Passa as funções de controle
        onAdjustValue={adjustModalValue}
      />
      
      <IconModal
        visible={isIconModalVisible}
        onClose={() => setIconModalVisible(false)}
        onSelect={handleIconSelect}
        targetPlayer={iconModalTarget?.player} // Passa o jogador (para girar)
        targetCategory={iconModalTarget?.category} // Passa a categoria (para filtro)
      />
    </SafeAreaView>
  );
}