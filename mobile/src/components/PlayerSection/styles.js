import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: '100%',
  },

  
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    zIndex: 0, //
  },
 

  contentContainer: {
    ...StyleSheet.absoluteFillObject, 
    zIndex: 1, // (Agora fica na frente)
  },
  inactiveContent: {
    opacity: 0.4, 
  },

  // --- SOLUÇÃO "ENCOLHIDA" ---
  playerContainer: {
    flex: 1, 
    paddingBottom: 70, // "Zona segura"
    justifyContent: 'center', 
  },
  
  // Layout com Flex Proporcional (Suas mudanças)
  timerWrapper: {
    flex: 1, 
    justifyContent: 'center', 
  },
  lifeWrapper: {
    flex: 4.5, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContentWrapper: {
    flex: 4, 
    justifyContent: 'center', 
  },
  
  mainContent: {
    paddingHorizontal: 0,
  },
  
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 22, 
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  
  plankBackground: {
    width: '100%',
    paddingVertical: 4, 
    marginVertical: 4, 
    overflow: 'hidden', 
    borderRadius: 8,
  },

  // --- Estilos dos Selos (Encolhidos) ---
  countersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sealButton: {
    width: 50, 
    height: 50, 
  },
  sealBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealValue: {
    color: 'white',
    fontSize: 18, 
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },

  // --- Estilos dos Stats (Encolhidos e SEM fundo) ---
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4, 
    marginVertical: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 35, 
    height: 35, 
    marginBottom: 0,
  },
  statValue: {
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },

  // --- Estilos do Botão de Passar a Vez ---
  turnButton: {
    position: 'absolute', 
    bottom: 16,           
    alignSelf: 'center',  
    backgroundColor: '#FFFFFF',
    paddingVertical: 10, 
    paddingHorizontal: 40, 
    borderRadius: 30,     
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  turnButtonText: {
    color: '#000000',
    fontSize: 16, 
    fontWeight: 'bold',
    textTransform: 'uppercase', 
  },
});