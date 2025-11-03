// src/screens/GameScreen.js
import React, { useState, useEffect } from 'react';
import useTelaCheia from '../../hooks/TelaCheia';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Text,
  Modal,
  Image
} from 'react-native';

import Player from '../../components/Player';
import DiceRoller from '../../components/RolagemDeDados';
import { iconesVida, TIPO_VIDA_PADRAO } from '../../constants/iconesVida'; 

// Cria estado inicial do jogador
const criarEstadoInicialJogador = (vidaInicial) => {
  const vidas = {};
  for (const tipo in iconesVida) vidas[tipo] = vidaInicial;
  return { tipoAtual: TIPO_VIDA_PADRAO, vidas };
};

export default function GameScreen({ route, navigation }) {
  const { playerCount: initialPlayerCount, startingLife } = route.params;

  const [playerCount, setPlayerCount] = useState(initialPlayerCount);
  const [jogadores, setJogadores] = useState([]);
  const [isDiceModalVisible, setDiceModalVisible] = useState(false);
  const [marcadorModalVisivel, setMarcadorModalVisivel] = useState(false);
  const [jogadorAtual, setJogadorAtual] = useState(null); 

  useTelaCheia(); // fullscreen + oculta botões Android

  // Atualiza jogadores quando muda playerCount ou startingLife
  useEffect(() => {
    setJogadores(current => {
      const newArray = Array(playerCount).fill(null).map((_, i) => current[i] || criarEstadoInicialJogador(startingLife));
      return newArray.slice(0, playerCount);
    });
  }, [playerCount, startingLife]);

  // Modais e vida
  const abrirMarcadorModal = (indice) => { setJogadorAtual(indice); setMarcadorModalVisivel(true); };
  const fecharMarcadorModal = () => { setMarcadorModalVisivel(false); setJogadorAtual(null); };
  const alterarTipoDeVida = (novoTipo) => { 
    if (jogadorAtual === null) return; 
    const novos = [...jogadores]; 
    novos[jogadorAtual].tipoAtual = novoTipo; 
    setJogadores(novos); 
    fecharMarcadorModal();
  };
  const alterarVida = (indice, valor) => {
    const novos = [...jogadores]; 
    const jogador = novos[indice]; 
    const tipo = jogador.tipoAtual; 
    jogador.vidas[tipo] = Math.max(0, Math.min(999, jogador.vidas[tipo] + valor)); 
    setJogadores(novos);
  };
  const definirVida = (indice, valorTexto) => {
    const novos = [...jogadores];
    const jogador = novos[indice]; 
    const tipo = jogador.tipoAtual;
    let val = parseInt(valorTexto, 10); 
    if (isNaN(val)) val = 0;
    jogador.vidas[tipo] = Math.max(0, Math.min(999, val));
    setJogadores(novos);
  };
  const reiniciarVidas = () => setJogadores(Array(playerCount).fill(null).map(() => criarEstadoInicialJogador(startingLife)));
  const adicionarJogador = () => setPlayerCount(c => Math.min(6, c + 1));
  const removerJogador = () => setPlayerCount(c => Math.max(1, c - 1));

  // Renderiza os players
  const renderPlayers = () => {
  if (!jogadores.length) return null;

  // Mapeia os jogadores para Player components
  const players = jogadores.map((j, i) => (
    <Player
      key={i}
      isFlipped={jogadores.length > 1 && i <= Math.ceil(jogadores.length / 2) - 1}
      jogadorData={j}
      onOpenMarkerModal={() => abrirMarcadorModal(i)}
      onAlterarVida={(val) => alterarVida(i, val)}
      onDefinirVida={(val) => definirVida(i, val)}
    />
  ));

  switch (jogadores.length) {
    case 1:
      return <View style={styles.row}>{players}</View>;
    case 2:
      return (
        <>
          <View style={styles.row}>{players.slice(0, 1)}</View>
          <View style={styles.row}>{players.slice(1, 2)}</View>
        </>
      );
    case 3:
      return (
        <>
          <View style={styles.row}>{players.slice(0, 2)}</View>
          <View style={styles.row}>{players.slice(2, 3)}</View>
        </>
      );
    case 4:
      return (
        <>
          <View style={styles.row}>{players.slice(0, 2)}</View>
          <View style={styles.row}>{players.slice(2, 4)}</View>
        </>
      );
    case 5:
      return (
        <>
          <View style={styles.row}>{players.slice(0, 3)}</View>
          <View style={styles.row}>{players.slice(3, 5)}</View>
        </>
      );
    case 6:
      return (
        <>
          <View style={styles.row}>{players.slice(0, 3)}</View>
          <View style={styles.row}>{players.slice(3, 6)}</View>
        </>
      );
    default:
      return null;
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <DiceRoller visible={isDiceModalVisible} onClose={() => setDiceModalVisible(false)} />

      <Modal animationType="slide" transparent visible={marcadorModalVisivel} onRequestClose={fecharMarcadorModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Escolha um Marcador</Text>
            <View style={styles.modalIconList}>
              {Object.keys(iconesVida).map(tipo => {
                const icone = iconesVida[tipo];
                return (
                  <TouchableOpacity key={tipo} style={styles.modalIconeContainer} onPress={() => alterarTipoDeVida(tipo)}>
                    {typeof icone === 'number' ? <Image source={icone} style={styles.modalIcone}/> : <Text style={styles.modalIcone}>{icone}</Text>}
                  </TouchableOpacity>
                )
              })}
            </View>
            <TouchableOpacity style={styles.modalBotaoFechar} onPress={fecharMarcadorModal}>
              <Text style={styles.modalBotaoFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.gameArea}>{renderPlayers()}</View>

      <View style={styles.menuBar}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}><Text style={styles.menuButtonText}>↩️</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={removerJogador}><Text style={styles.menuButtonText}>-</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => setDiceModalVisible(true)}><Text style={styles.menuButtonText}>🎲</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={adicionarJogador}><Text style={styles.menuButtonText}>+</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={reiniciarVidas}><Text style={styles.menuButtonText}>🔄</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  gameArea: { flex: 1 },
  row: { flex: 1, flexDirection: 'row' },
  menuBar: { position: 'absolute', bottom: 20, left:0, right:0, flexDirection: 'row', justifyContent:'center', alignItems:'center' },
  menuButton: { backgroundColor:'rgba(50,50,50,0.8)', padding:15, borderRadius:50, marginHorizontal:10 },
  menuButtonText: { fontSize:24 },
  modalOverlay: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.6)' },
  modalContainer: { width:'90%', backgroundColor:'white', borderRadius:15, padding:20, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4, elevation:5 },
  modalTitulo: { fontSize:22, fontWeight:'bold', marginBottom:20, color:'#000' },
  modalIconList: { flexDirection:'row', flexWrap:'wrap', justifyContent:'center', width:'100%' },
  modalIconeContainer: { margin:8, padding:10, backgroundColor:'#eee', borderRadius:10 },
  modalIcone: { width:40, height:40, fontSize:30 },
  modalBotaoFechar: { marginTop:20, backgroundColor:'#A73636', borderRadius:8, paddingVertical:10, paddingHorizontal:30 },
  modalBotaoFecharTexto: { color:'#fff', fontSize:16, fontWeight:'bold' },
});
