import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatTime } from '../../utils/helpers';
import { sealIcons } from '../../constants/gameData';
import styles from './styles'; // Importa estilos locais

// Este é o componente visual "burro"
const PlayerSection = ({
  gradientColors,
  playerNum,
  life,
  timer,
  stats,
  counters,
  isActive,
  onLifeChange,
  onPassTurn,
  onOpenModal,
  onOpenIconModal,
}) => {
  const currentSealIcons = playerNum === 1 ? sealIcons.redPlayer : sealIcons.bluePlayer;

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.section, !isActive && styles.inactiveSection]}
    >
      {/* 1. Header (Timer) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTime}>{formatTime(timer)}</Text>
      </View>

      {/* 2. Conteúdo Central */}
      <View style={styles.centerContent}>
        {/* Contador de Vida */}
        <View style={styles.scoreBox}>
          <TouchableOpacity
            style={styles.scoreButton}
            onPress={() => onLifeChange(1)}
            onLongPress={() => onLifeChange(5)}
          >
            <Text style={styles.scoreButtonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.scoreText}>{life}</Text>
          <TouchableOpacity
            style={styles.scoreButton}
            onPress={() => onLifeChange(-1)}
            onLongPress={() => onLifeChange(-5)}
          >
            <Text style={styles.scoreButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.scoreMaxSeparator}>/</Text>
          <Text style={styles.scoreMaxText}>30</Text>
          <Text style={styles.scoreMaxLabel}>MÁX</Text>
        </View>

        {/* Contadores de Selo (Imagens) */}
        <View style={styles.sealRow}>
          {counters.map((count, i) => (
            <TouchableOpacity
              key={i}
              style={styles.sealButton}
              onPress={() => onOpenModal('counter', i, count)}
            >
              <Image source={currentSealIcons[i]} style={styles.sealImage} />
              <Text style={styles.sealText}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contadores de Stats (Categorias) */}
        <View style={styles.statsRow}>
          {stats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onOpenModal('stat', index, stat.value)}
              onLongPress={() => onOpenIconModal(index)}
              style={styles.statBadge}
            >
              <View style={styles.statBadgeContent}>
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
        disabled={!isActive}
      >
        <Text style={styles.passButtonText}>
          PASSAR A VEZ
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default PlayerSection;