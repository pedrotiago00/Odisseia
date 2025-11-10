import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // A seção principal do jogador, ocupa metade da tela (flex: 1)
  section: {
    flex: 1, // Faz a seção preencher o espaço disponível
    justifyContent: 'space-between', // Alinha itens (header/footer) nas pontas
    position: 'relative', // Necessário para 'position: absolute' funcionar
    paddingTop: 40, // Espaço para o header
    paddingBottom: 40, // Espaço para o footer
  },
  // Estilo para o jogador que NÃO está na vez (fica levemente apagado)
  inactiveSection: { 
    opacity: 0.6,
  },
  // Header da seção (onde fica o timer)
  sectionHeader: {
    position: 'absolute', // Flutua sobre o conteúdo
    top: 40,
    right: 20,
    zIndex: 10, // Garante que fique na frente
  },
  // Texto do timer
  sectionTime: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Sombra para legibilidade
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Container que centraliza o conteúdo principal (vida, contadores)
  centerContent: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
    paddingHorizontal: 16,
  },
  // A "caixa" branca que segura a vida e os botões +/-
  scoreBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row', // Alinha botões e texto lado a lado
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    shadowColor: '#000', // Sombra (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Sombra (Android)
    marginBottom: 24, // Espaço antes dos próximos contadores
  },
  // Botões de "+" e "-"
  scoreButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Texto dentro dos botões ("+", "-")
  scoreButtonText: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // O número da vida (ex: "20")
  scoreText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#333',
    flex: 1, // Ocupa o espaço central
    textAlign: 'center', // Centraliza o texto
  },
  // A barra "/" entre a vida atual e a máxima
  scoreMaxSeparator: {
    fontSize: 32,
    color: '#a0a0a0',
    fontWeight: '300',
    marginRight: 8,
  },
  // O número da vida máxima (ex: "30")
  scoreMaxText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  // O rótulo "MÁX"
  scoreMaxLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    writingDirection: 'rtl', // Direção da escrita (raro, mas usado aqui)
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  // Linha que segura os "Selos" (ex: contadores de imagem)
  sealRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribui os selos igualmente
    width: '100%',
    marginBottom: 24,
  },
  // Botão clicável para cada Selo
  sealButton: {
    position: 'relative', // Permite que a imagem e o texto se sobreponham
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  // A imagem do Selo
  sealImage: {
    position: 'absolute', // Cobre o botão
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  // O número do contador em cima do Selo
  sealText: {
    color: 'white', 
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Sombra para legibilidade
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Linha que segura os "Stats" (ex: Mana, Veneno)
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fundo semi-transparente
    borderRadius: 12,
    padding: 8,
  },
  // "Emblema" clicável para cada stat
  statBadge: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    paddingVertical: 8,
    minWidth: 70, // Largura mínima
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Conteúdo dentro do emblema (ícone + valor)
  statBadgeContent: {
    flexDirection: 'column', // Alinha ícone e valor verticalmente
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // Espaço entre o ícone e o valor
  },
  // Ícone de Stat (se for um Emoji/Texto)
  statBadgeTextIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  // Ícone de Stat (se for uma Imagem)
  statBadgeImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  // O número/valor do Stat
  statBadgeTextValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Container do botão "Passar a Vez" no rodapé
  passButtonContainer: {
    position: 'absolute', // Flutua no rodapé
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16, // Área de clique
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Texto "PASSAR A VEZ"
  passButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.4)', // Sombra para legibilidade
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // Estilo para desabilitar botões
  disabledButton: { 
    opacity: 0.5,
  },
});