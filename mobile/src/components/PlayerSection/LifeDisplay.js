import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { iconesVida } from '../../constants/iconesVida';

export default function LifeDisplay({ 
  life, 
  lifeIcon, 
  onLifeChange, 
  onOpenModal, 
  onOpenLifeIconModal,
  playerNum
}) {
  return (
    <View style={styles.lifeContainer}>
      {/* Botão de -1 */}
      <TouchableOpacity onPress={() => onLifeChange(-1)} style={styles.lifeButton}>
        <Text style={styles.lifeButtonText}>-</Text>
      </TouchableOpacity>

      {/* Imagem de Fundo (Coração/Ícone) */}
      <ImageBackground 
        source={iconesVida[lifeIcon]} 
        style={styles.lifeIconBackground} // <-- Estilo alterado
        resizeMode="contain"
      >
        <TouchableOpacity 
          onPress={onOpenModal} 
          
          style={styles.lifeValueWrapper}
        >
          <Text style={styles.lifeText}>{life}</Text>
        </TouchableOpacity>
      </ImageBackground>

      {/* Botão de +1 */}
      <TouchableOpacity onPress={() => onLifeChange(1)} style={styles.lifeButton}>
        <Text style={styles.lifeButtonText}>+</Text>
      </TouchableOpacity>

      {/* O "MAX" */}
      <View style={[
        styles.maxContainer,
        playerNum === 1 && { transform: [{ rotate: '180deg' }] }
      ]}>
        <Text style={styles.maxText}>30</Text>
        <Text style={styles.maxLabel}>MAX</Text>
      </View>
    </View>
  );
}

// --- ESTILOS "ENCOLHIDOS" ---
const styles = StyleSheet.create({
  lifeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16, 
  },
  lifeButton: {
    paddingHorizontal: 14, // <-- Diminuído
    paddingVertical: 10,
    
  },
  lifeButtonText: {
    fontSize: 28, // <-- Diminuído de 32
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  lifeIconBackground: {
    width: 90, // <-- Diminuído de 120
    height: 90, // <-- Diminuído de 120
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5, // <-- Adicionado para dar espaço
  },
  lifeValueWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lifeText: {
    fontSize: 40, // <-- Diminuído de 48
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6
  },
  maxContainer: {
    marginLeft: 8, // <-- Diminuído de 10
    alignItems: 'center',
  },
  maxText: {
    fontSize: 14, // <-- Diminuído de 16
    color: 'white',
    fontWeight: 'bold',
  },
  maxLabel: {
    fontSize: 10, // <-- Diminuído de 12
    color: 'white',
  }
});