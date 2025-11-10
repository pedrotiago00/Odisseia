import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Para o fundo em degradê
import { formatTime } from '../../utils/helpers'; // Função para formatar "segundos" em "MM:SS"
import { sealIcons } from '../../constants/gameData'; // Dados das imagens dos selos
import styles from './styles'; // Importa os estilos do arquivo anterior

/**
 * Componente de Apresentação (Dumb Component) para a seção de um jogador.
 * Recebe todos os dados e funções de um componente "pai" via props.
 *
 * @param {string[]} gradientColors - Cores para o degradê de fundo.
 * @param {number} playerNum - O número do jogador (1 ou 2), usado para pegar os ícones corretos.
 * @param {number} life - Vida atual.
 * @param {number} timer - Tempo restante em segundos.
 * @param {object[]} stats - Array de contadores de status (ex: { icon: '💧', value: 2 }).
 * @param {number[]} counters - Array de contadores de selo (ex: [0, 0, 0]).
 * @param {boolean} isActive - Se este jogador é o jogador ativo (para opacidade e botão).
 * @param {function} onLifeChange - Função chamada ao clicar em +/- (ex: onLifeChange(1) ou onLifeChange(-1)).
 * @param {function} onPassTurn - Função chamada ao clicar em "Passar a Vez".
 * @param {function} onOpenModal - Função para abrir o modal numérico (clique curto).
 * @param {function} onOpenIconModal - Função para abrir o modal de ícones (clique longo).
 */
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
  // Define quais imagens de selo usar com base no número do jogador
  const currentSealIcons = playerNum === 1 ? sealIcons.redPlayer : sealIcons.bluePlayer;

  return (
    // Container principal com fundo em degradê
    <LinearGradient
      colors={gradientColors}
      // Aplica o estilo 'inactiveSection' se o jogador não estiver ativo
      style={[styles.section, !isActive && styles.inactiveSection]}
    >
      {/* 1. Header (Timer) */}
      <View style={styles.sectionHeader}>
        {/* Formata o tempo (ex: 300 segundos -> "05:00") */}
        <Text style={styles.sectionTime}>{formatTime(timer)}</Text>
      </View>

      {/* 2. Conteúdo Central (Vida e Contadores) */}
      <View style={styles.centerContent}>
        
        {/* Caixa de Vida (ScoreBox) */}
        <View style={styles.scoreBox}>
          <TouchableOpacity
            style={styles.scoreButton}
            onPress={() => onLifeChange(1)} // Clique curto: +1
            onLongPress={() => onLifeChange(5)} // Clique longo: +5
          >
            <Text style={styles.scoreButtonText}>+</Text>
          </TouchableOpacity>
          
          <Text style={styles.scoreText}>{life}</Text> {/* Vida atual */}
          
          <TouchableOpacity
            style={styles.scoreButton}
            onPress={() => onLifeChange(-1)} // Clique curto: -1
            onLongPress={() => onLifeChange(-5)} // Clique longo: -5
          >
            <Text style={styles.scoreButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.scoreMaxSeparator}>/</Text>
          <Text style={styles.scoreMaxText}>30</Text> {/* Vida Máxima (fixa) */}
          <Text style={styles.scoreMaxLabel}>MÁX</Text>
        </View>

        {/* Contadores de Selo (Imagens) */}
        <View style={styles.sealRow}>
          {/* Mapeia o array `counters` para criar os botões de selo */}
          {counters.map((count, i) => (
            <TouchableOpacity
              key={i}
              style={styles.sealButton}
              // Abre o modal numérico para este selo
              onPress={() => onOpenModal('counter', i, count)}
            >
              <Image source={currentSealIcons[i]} style={styles.sealImage} />
              <Text style={styles.sealText}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contadores de Stats (Mana, Veneno, etc.) */}
        <View style={styles.statsRow}>
          {/* Mapeia o array `stats` para criar os emblemas */}
          {stats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              // Clique curto: Abre modal numérico
              onPress={() => onOpenModal('stat', index, stat.value)}
              // Clique longo: Abre modal para trocar o ÍCONE
              onLongPress={() => onOpenIconModal(index)}
              style={styles.statBadge}
            >
              <View style={styles.statBadgeContent}>
                {/* Verifica se o ícone é um emoji (string) ou uma imagem */}
                {typeof stat.icon === 'string' ? (
                  <Text style={styles.statBadgeTextIcon}>{stat.icon}</Text>
                ) : (
                  <Image source={stat.icon} style={styles.statBadgeImage} />
                )}
                {/* Valor do stat */}
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
        disabled={!isActive} // Desabilita o botão se não for a vez do jogador
      >
        <Text style={styles.passButtonText}>
          PASSAR A VEZ
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default PlayerSection;