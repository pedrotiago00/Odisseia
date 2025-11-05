import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

// Importa os componentes visuais
import PlayerSection from '../../components/PlayerSection';
import ValueModal from '../../components/ValueModal';
import IconModal from '../../components/IconModal';

// Importa os dados e funções
import { colors } from '../../constants/gameData';
import { getInitialPlayerState } from '../../utils/helpers';
import styles from './styles'; // Importa estilos locais

// Este é o componente "Inteligente" (Controlador de Estado)
export default function GameScreen() {
  
  // --- Estados ---
  const [player1, setPlayer1] = useState(getInitialPlayerState());
  const [player2, setPlayer2] = useState(getInitialPlayerState());
  const [activePlayer, setActivePlayer] = useState(1);

  // Estados dos Modais
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalInputValue, setModalInputValue] = useState('');
  const [modalTarget, setModalTarget] = useState(null); 
  const [isIconModalVisible, setIconModalVisible] = useState(false);
  const [iconModalTarget, setIconModalTarget] = useState(null);

  // --- Efeito do Cronômetro ---
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (activePlayer === 1) {
        setPlayer1((p) => ({ ...p, timer: p.timer > 0 ? p.timer - 1 : 0 }));
      } else {
        setPlayer2((p) => ({ ...p, timer: p.timer > 0 ? p.timer - 1 : 0 }));
      }
    }, 1000);
    return () => {
      clearInterval(timerInterval);
    };
  }, [activePlayer]);

  // --- Funções de Jogo ---
  const handleLifeChange = (playerNum, amount) => {
    const setPlayer = playerNum === 1 ? setPlayer1 : setPlayer2;
    setPlayer((prev) => {
      const newLife = prev.life + amount;
      if (newLife > 99) return { ...prev, life: 99 };
      if (newLife < 0) return { ...prev, life: 0 };
      return { ...prev, life: newLife };
    });
  };

  const handlePassTurn = () => {
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
  };

  const handleReset = () => {
    setPlayer1(getInitialPlayerState());
    setPlayer2(getInitialPlayerState());
    setActivePlayer(1);
  };

  // --- Funções do Modal de VALOR ---
  const openModal = (playerNum, type, key, currentValue) => {
    setModalTarget({ player: playerNum, type: type, key: key });
    setModalInputValue(String(currentValue));
    setModalVisible(true);
  };

  const handleModalConfirm = () => {
    const { player, type, key } = modalTarget;
    let newValue = parseInt(modalInputValue, 10);
    if (isNaN(newValue)) newValue = 0;

    const setPlayer = player === 1 ? setPlayer1 : setPlayer2;

    if (type === 'stat') {
      setPlayer((prev) => {
        const newStats = prev.stats.map(s => ({ ...s }));
        newStats[key].value = newValue >= 0 ? newValue : 0;
        return { ...prev, stats: newStats };
      });
    } else if (type === 'counter') {
      setPlayer((prev) => {
        const newCounters = [...prev.counters];
        newCounters[key] = newValue >= 0 ? newValue : 0;
        return { ...prev, counters: newCounters };
      });
    }
    setModalVisible(false);
    setModalTarget(null);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setModalTarget(null);
  };

  const adjustModalValue = (amount) => {
    setModalInputValue((prev) => {
      const newValue = (parseInt(prev, 10) || 0) + amount;
      return String(newValue >= 0 ? newValue : 0);
    });
  };

  // --- Funções do Modal de ÍCONE ---
  const openIconModal = (playerNum, index, category) => {
    setIconModalTarget({ player: playerNum, index: index, category: category });
    setIconModalVisible(true);
  };

  const handleIconSelect = (selectedIconObject) => {
    if (!iconModalTarget) return;
    const { player, index } = iconModalTarget;
    const setPlayer = player === 1 ? setPlayer1 : setPlayer2;

    setPlayer((prev) => {
      const newStats = prev.stats.map(s => ({ ...s }));
      newStats[index].icon = selectedIconObject.icon || selectedIconObject;
      return { ...prev, stats: newStats };
    });

    setIconModalVisible(false);
    setIconModalTarget(null);
  };

  // --- Renderização Principal (JSX) ---
  // Note como esta parte agora está limpa e legível
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        
        {/* ---- JOGADOR 1 (VERMELHO) ---- */}
        <View style={{ flex: 1, transform: [{ rotate: '180deg' }] }}>
          <PlayerSection
            playerNum={1}
            gradientColors={colors.red}
            {...player1}
            isActive={activePlayer === 1}
            onLifeChange={(amount) => handleLifeChange(1, amount)}
            onPassTurn={handlePassTurn}
            onOpenModal={(type, key, val) => openModal(1, type, key, val)}
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
        <PlayerSection
          playerNum={2}
          gradientColors={colors.blue}
          {...player2}
          isActive={activePlayer === 2}
          onLifeChange={(amount) => handleLifeChange(2, amount)}
          onPassTurn={handlePassTurn}
          onOpenModal={(type, key, val) => openModal(2, type, key, val)}
          onOpenIconModal={(index) => openIconModal(2, index, player2.stats[index].category)}
        />
      </View>

      {/* --- Modais (agora são componentes separados) --- */}
      <ValueModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        targetPlayer={modalTarget?.player}
        inputValue={modalInputValue}
        onInputChange={setModalInputValue}
        onAdjustValue={adjustModalValue}
      />
      
      <IconModal
        visible={isIconModalVisible}
        onClose={() => setIconModalVisible(false)}
        onSelect={handleIconSelect}
        targetPlayer={iconModalTarget?.player}
        targetCategory={iconModalTarget?.category}
      />
    </SafeAreaView>
  );
}