// src/constants/iconesVida.js

// Arquivo central para exportar os ícones de marcadores de vida.
// Objeto que mapeia um ID (ex: 'vidatipo1') para a imagem correspondente.
export const iconesVida = {
    coracao: require('../assets/Icones/ICONE_VIDA.png'),
    vidatipo1: require('../assets/MarcadoresDeVida/TokenConfuso.png'),
    vidatipo2: require('../assets/MarcadoresDeVida/TokenDanificado.png'),
    vidatipo3: require('../assets/MarcadoresDeVida/TokenFogo.png'),
    vidatipo4: require('../assets/MarcadoresDeVida/TokenFuria.png'),
    vidatipo5: require('../assets/MarcadoresDeVida/TokenGelo.png'),
    vidatipo6: require('../assets/MarcadoresDeVida/TokenParalizado.png'),
    vidatipo7: require('../assets/MarcadoresDeVida/TokenRegeneracao.png'),
    vidatipo8: require('../assets/MarcadoresDeVida/TokenSangramento.png'),
    vidatipo9: require('../assets/MarcadoresDeVida/TokenSilencio.png'),
    vidatipo10: require('../assets/MarcadoresDeVida/TokenVeneno.png'),
};

// Exporta o ID do primeiro ícone da lista ('vidatipo1') como o marcador padrão
export const TIPO_VIDA_PADRAO = Object.keys(iconesVida)[0];