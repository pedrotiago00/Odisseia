import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // A tela inteira (SafeAreaView)
  screen: { 
    flex: 1, 
    backgroundColor: '#000', // Fundo preto
  },
  // O "cartão" principal do jogo, que contém os dois jogadores
  card: { 
    flex: 1, 
    width: '100%', 
    overflow: 'hidden' // Garante que o conteúdo não vaze
  },
  // A barra branca no meio da tela
  handleContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Garante que fique por cima dos jogadores
  },
  // O botão de reset (que parece um ícone de menu)
  resetButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 4,
  },
  // O texto "☰" dentro do botão
  resetButtonText: {
    color: '#555',
    fontSize: 24, 
    fontWeight: 'bold',
  },
});