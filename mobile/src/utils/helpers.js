// src/utils/helpers.js
import { TIPO_VIDA_PADRAO } from '../constants/iconesVida';

// Imagens dos Selos (Contadores Circulares)
const sealIcons = [
  require('../assets/Icones/ICONE_FORCA.png'),
  require('../assets/Icones/ICONE_DESTREZA.png'),
  require('../assets/Icones/ICONE_INTELIGENCIA.png'),
  require('../assets/Icones/ICONE_ARCANO.png'),
];

// Biblioteca de Ícones de Stats (Categorizada)
const iconCategories = {
  'Ataque': [
    { name: 'Físico', icon: require('../assets/Icones/ICONE_ATK_FISICO_B.png') },
    { name: 'híbrido', icon: require('../assets/Icones/ICONE_ATK_HIBRIDO_B.png') },
    { name: 'Mágico', icon: require('../assets/Icones/ICONE_ATK_MAGICO_B.png') },
  ],
  'Dano': [
    { name: 'Dano', icon: require('../assets/Icones/ICONE_DANO_B.png') },
  ],
  'Defesa': [
    { name: 'Defesa', icon: require('../assets/Icones/ICONE_DEFESA_B.png') },
  ],
};

/**
 * Gera o objeto de estado inicial para um jogador.
 */
export const getInitialPlayerState = () => ({
  life: 30,
  timer: 900, 
  lifeIcon: TIPO_VIDA_PADRAO, 
  stats: [
    { value: 5, category: 'Ataque', icon: iconCategories['Ataque'][0].icon },
    { value: 5, category: 'Dano', icon: iconCategories['Dano'][0].icon },
    { value: 5, category: 'Defesa', icon: iconCategories['Defesa'][0].icon },
  ],
  counters: [0, 0, 0, 0],
  sealIcons: sealIcons, 
});