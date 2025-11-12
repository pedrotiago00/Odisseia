// src/components/PlayerSection/TurnButton.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles';

// 1. Não precisa mais de 'isActive' para o estilo
export default function TurnButton({ onPress, disabled }) { 
  return (
    <TouchableOpacity 
      style={styles.turnButton} //  Estilo simples, sem lógica
      onPress={onPress}
      disabled={disabled} // Recebe o 'disabled'
    >
      <Text style={styles.turnButtonText}>PASSAR A VEZ</Text>
    </TouchableOpacity>
  );
}