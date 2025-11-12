// src/pages/Game/GameScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import PlayerSection from '../../components/PlayerSection';
import ValueModal from '../../components/ValueModal';
import IconModal from '../../components/IconModal';

import { colors, iconCategories } from '../../constants/gameData';
import { iconesVida } from '../../constants/iconesVida';
import { getInitialPlayerState } from '../../utils/helpers';
import styles from './styles';
import * as NavigationBar from 'expo-navigation-bar';

export default function GameScreen({ navigation }) {
  
  const [player1, setPlayer1] = useState(getInitialPlayerState());
  // --- CORREÇÃO AQUI ---
  const [player2, setPlayer2] = useState(getInitialPlayerState()); 
  // ---------------------
  const [activePlayer, setActivePlayer] = useState(2);

  // Estados dos Modais
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalInputValue, setModalInputValue] = useState('');
  const [modalTarget, setModalTarget] = useState(null); 
  const [isStatIconModalVisible, setStatIconModalVisible] = useState(false);
  const [statIconModalTarget, setStatIconModalTarget] = useState(null);
  const [statIconData, setStatIconData] = useState([]); 
  const [isLifeIconModalVisible, setLifeIconModalVisible] = useState(false);
  const [lifeIconModalTarget, setLifeIconModalTarget] = useState(null);
  const [lifeIconData, setLifeIconData] = useState([]);

  useEffect(() => {
    // Função para esconder a barra
    const hideNavigationBar = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("inset-swipe");
    };

    hideNavigationBar();

    // Função de "limpeza" que roda quando a tela é desmontada
    return () => {
      // Mostra a barra de navegação novamente
      NavigationBar.setVisibilityAsync("visible");
    };
  }, [])

  // --- Efeito do Cronômetro (Timer) ---
  useEffect(() => {
    let timerInterval; 

    if (activePlayer === 1 && player1.timer > 0) {
      timerInterval = setInterval(() => {
        setPlayer1((p) => ({ ...p, timer: p.timer > 0 ? p.timer - 1 : 0 }));
      }, 1000);
    } 
    else if (activePlayer === 2 && player2.timer > 0) {
      timerInterval = setInterval(() => {
        setPlayer2((p) => ({ ...p, timer: p.timer > 0 ? p.timer - 1 : 0 }));
      }, 1000);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [activePlayer, player1.timer, player2.timer]); 

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
    setActivePlayer(2);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // --- Funções do Modal de VALOR (Numérico) ---
  
  const openModal = (playerNum, type, key, currentValue) => {
    setModalTarget({ player: playerNum, type: type, key: key });
    setModalInputValue(String(currentValue));
    setModalVisible(true);
  };

  const handleModalConfirm = () => {
    if (!modalTarget) return; 
    const { player, type, key } = modalTarget;
    let newValue = parseInt(modalInputValue, 10); 
    if (isNaN(newValue) || newValue < 0) newValue = 0; 

    const setPlayer = player === 1 ? setPlayer1 : setPlayer2;

    if (type === 'life') {
      setPlayer((prev) => ({ ...prev, life: newValue > 99 ? 99 : newValue }));
    } else if (type === 'stat') {
      setPlayer((prev) => {
        const newStats = prev.stats.map(s => ({ ...s })); 
        newStats[key].value = newValue; 
        return { ...prev, stats: newStats };
      });
    } else if (type === 'counter') {
      setPlayer((prev) => {
        const newCounters = [...prev.counters]; 
        newCounters[key] = newValue; 
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

  // --- Funções do Modal de ÍCONE DE STAT ---

  const openStatIconModal = (playerNum, index, category) => {
    setStatIconModalTarget({ player: playerNum, index: index });
    setStatIconData(iconCategories[category] || []);
    setStatIconModalVisible(true);
  };

  const handleStatIconSelect = (selectedIconObject) => {
    if (!statIconModalTarget) return;
    const { player, index } = statIconModalTarget;
    const setPlayer = player === 1 ? setPlayer1 : setPlayer2;

    setPlayer((prev) => {
      const newStats = prev.stats.map(s => ({ ...s }));
      newStats[index].icon = selectedIconObject.icon;
      return { ...prev, stats: newStats };
    });

    setStatIconModalVisible(false);
    setStatIconModalTarget(null);
  };

  // --- Funções do Modal de ÍCONE DE VIDA ---

  const openLifeIconModal = (playerNum) => {
    setLifeIconModalTarget({ player: playerNum });
    const lifeIconArray = Object.keys(iconesVida).map(key => ({
      name: key,
      icon: iconesVida[key],
    }));
    setLifeIconData(lifeIconArray);
    setLifeIconModalVisible(true);
  };

  const handleLifeIconSelect = (selectedIconObject) => {
    if (!lifeIconModalTarget) return;
    const { player } = lifeIconModalTarget;
    const setPlayer = player === 1 ? setPlayer1 : setPlayer2;

    setPlayer((prev) => ({ ...prev, lifeIcon: selectedIconObject.name }));

    setLifeIconModalVisible(false);
    setLifeIconModalTarget(null);
  };


  // --- Renderização Principal (JSX) ---
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        
        <View style={{ flex: 1, transform: [{ rotate: '180deg' }] }}>
          <PlayerSection
            playerNum={1}
            gradientColors={colors.red}
            {...player1} 
            lifeIcon={player1.lifeIcon} 
            isActive={activePlayer === 1}
            onLifeChange={(amount) => handleLifeChange(1, amount)}
            onPassTurn={handlePassTurn}
            onOpenModal={(type, key, val) => openModal(1, type, key, val)}
            onOpenStatIconModal={(index) => openStatIconModal(1, index, player1.stats[index].category)}
            onOpenLifeIconModal={() => openLifeIconModal(1)} 
          />
        </View>

        <View style={styles.handleContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>↻</Text>
          </TouchableOpacity>
        </View>

        <PlayerSection
          playerNum={2}
          gradientColors={colors.blue}
          {...player2} 
          lifeIcon={player2.lifeIcon} 
          isActive={activePlayer === 2}
          onLifeChange={(amount) => handleLifeChange(2, amount)}
          onPassTurn={handlePassTurn}
          onOpenModal={(type, key, val) => openModal(2, type, key, val)}
          onOpenStatIconModal={(index) => openStatIconModal(2, index, player2.stats[index].category)}
          onOpenLifeIconModal={() => openLifeIconModal(2)} 
        />
      </View>

      {/* --- Modais --- */}
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
        visible={isStatIconModalVisible}
        onClose={() => setStatIconModalVisible(false)}
        onSelect={handleStatIconSelect}
        targetPlayer={statIconModalTarget?.player}
        iconData={statIconData} 
      />

      <IconModal
        visible={isLifeIconModalVisible}
        onClose={() => setLifeIconModalVisible(false)}
        onSelect={handleLifeIconSelect}
        targetPlayer={lifeIconModalTarget?.player}
        iconData={lifeIconData} 
      />
    </SafeAreaView>
  );
}