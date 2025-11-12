// src/pages/Game/styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: '#000', 
  },
  card: { 
    flex: 1, 
    width: '100%', 
    overflow: 'hidden' 
  },
  // Barra central atualizada
  handleContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'space-between', // Espaço entre os botões
    flexDirection: 'row', // Alinha botões horizontalmente
    paddingHorizontal: 24, // Espaço nas laterais
    zIndex: 10, 
  },
  resetButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 0,
  },
  resetButtonText: {
    color: '#555',
    fontSize: 24, 
    fontWeight: 'bold',
  },
});