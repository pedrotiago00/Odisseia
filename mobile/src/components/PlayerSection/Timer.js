import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles'; // Importa do styles.js principal

// Função para formatar segundos para MM:SS
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function Timer({ time }) {
  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(time)}</Text>
    </View>
  );
}