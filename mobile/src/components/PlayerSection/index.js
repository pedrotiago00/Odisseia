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
  onOpenModal, // <--- Esta função é passada pelo GameScreen
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
        
          <View style={styles.timerWrapper}>
            <Timer time={timer} />
          </View>

          <View style={styles.lifeWrapper}>
            <LifeDisplay
              life={life}
              lifeIcon={lifeIcon}
              onLifeChange={onLifeChange}
              onOpenModal={() => onOpenModal('life', null, life)} // <--- Esta chamada está correta (3 args)
              onOpenLifeIconModal={onOpenLifeIconModal} 
              playerNum={playerNum}
            />
          </View>

          <View style={styles.mainContentWrapper}>
            <View style={styles.mainContent}>
            
              <ImageBackground 
                source={woodPlank} 
                style={styles.plankBackground}
                resizeMode="stretch"
              >
                <View style={styles.countersRow}>
                  <CircularCounters
                    counters={counters}
                    icons={sealIcons}
                    // --- CORREÇÃO AQUI ---
                    // Removemos o 'playerNum' do início
                    onOpenModal={(index, value) => onOpenModal('counter', index, value)}
                  />
                </View>
              </ImageBackground>

              <View style={styles.statsRow}>
                <StatCounters
                  stats={stats}
                  // --- CORREÇÃO AQUI ---
                  // Removemos o 'playerNum' do início
                  onOpenModal={(index, value) => onOpenModal('stat', index, value)}
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