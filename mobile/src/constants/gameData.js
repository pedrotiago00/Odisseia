

// Gradientes de fundo
export const colors = {
  red: ['#b91c1c', '#dc2626', '#ef4444'],
  blue: ['#1d4ed8', '#2563eb', '#3b82f6'],
};

// Imagens dos Selos (Contadores Circulares)
export const sealIcons = {
  redPlayer: [
    require('../assets/MarcadoresDeVida/TokenGelo.png'),
    require('../assets/MarcadoresDeVida/TokenFogo.png'),
    require('../assets/MarcadoresDeVida/TokenFuria.png'),
    require('../assets/MarcadoresDeVida/TokenSilencio.png'),
  ],
  bluePlayer: [
    require('../assets/MarcadoresDeVida/TokenGelo.png'),
    require('../assets/MarcadoresDeVida/TokenFogo.png'),
    require('../assets/MarcadoresDeVida/TokenFuria.png'),
    require('../assets/MarcadoresDeVida/TokenSilencio.png'),
  ],
};

// Biblioteca de Ícones de Stats (Categorizada)
export const iconCategories = {
  'Ataque': [
    { name: 'Confuso', icon: require('../assets/MarcadoresDeVida/TokenConfuso.png') },
    { name: 'Danificado', icon: require('../assets/MarcadoresDeVida/TokenDanificado.png') },
    { name: 'Tesoura', icon: require('../assets/MarcadoresDeVida/TokenFogo.png') },
  ],
  'Defesa': [
    { name: 'Fogo', icon: require('../assets/MarcadoresDeVida/TokenFogo.png') },
    { name: 'Traço', icon: require('../assets/MarcadoresDeVida/TokenFuria.png') },
  ],
  'Resistência': [
    { name: 'Estrela', icon: '⭐' },
    { name: 'Círculo', icon: require('../assets/MarcadoresDeVida/TokenVeneno.png') },
  ],
};