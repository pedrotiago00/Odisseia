import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient';

import Timer from './Timer';
import LifeDisplay from './LifeDisplay';
import StatCounters from './StatCounters';
import CircularCounters from './CircularCounters';
import TurnButton from './TurnButton';
import styles from './styles';

const backgroundRed = require('../../assets/Backgrounds/backgroundRed.png');
const backgroundBlue = require('../../assets/Backgrounds/backgroundBlue.png');
const woodPlank = require('../../assets/Icones/ICONE6.png');

export default function PlayerSection({
  playerNum,
  gradientColors,
  life,
  lifeIcon,
  timer,
  stats,
  counters,
  sealIcons,
  isActive, 
  onLifeChange,
  onPassTurn,
  onOpenModal,
  onOpenStatIconModal, 
  onOpenLifeIconModal, 
}) {

  const backgroundSource = playerNum === 1 ? backgroundRed : backgroundBlue;

  return (
    <ImageBackground 
      source={backgroundSource} 
      style={styles.backgroundContainer} 
      resizeMode="cover"
    >
      <LinearGradient 
        colors={gradientColors} 
        style={styles.gradientOverlay} 
      />

      <View 
        style={[
          styles.contentContainer, 
          !isActive && styles.inactiveContent
        ]}
      >
        <View style={styles.playerContainer}>
        
          {/* Wrappers com Flex Proporcional */}
          <View style={styles.timerWrapper}>
            <Timer time={timer} />
          </View>

          <View style={styles.lifeWrapper}>
            <LifeDisplay
              life={life}
              lifeIcon={lifeIcon}
              onLifeChange={onLifeChange}
              onOpenModal={() => onOpenModal('life', null, life)}
              onOpenLifeIconModal={onOpenLifeIconModal} 
              playerNum={playerNum}
            />
          </View>

          <View style={styles.mainContentWrapper}>
            <View style={styles.mainContent}>
            
              {/* FUNDO DE MADEIRA PARA OS SELOS (Mantido) */}
              <ImageBackground 
                source={woodPlank} 
                style={styles.plankBackground}
                resizeMode="stretch"
              >
                <View style={styles.countersRow}>
                  <CircularCounters
                    counters={counters}
                    icons={sealIcons}
                    onOpenModal={(index, value) => onOpenModal(playerNum, 'counter', index, value)}
                  />
                </View>
              </ImageBackground>

              {/* FUNDO DE MADEIRA REMOVIDO DOS STATS */}
              <View style={styles.statsRow}>
                <StatCounters
                  stats={stats}
                  onOpenModal={(index, value) => onOpenModal(playerNum, 'stat', index, value)}
                  onOpenIconModal={onOpenStatIconModal}
                />
              </View>

            </View>
          </View>
        </View>

        <TurnButton 
          onPress={onPassTurn} 
          disabled={!isActive} 
        />
      </View>
    </ImageBackground>
  );
}