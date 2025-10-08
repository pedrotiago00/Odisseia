import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    BackHandler,
    Modal,
    FlatList,
    ImageBackground,
} from 'react-native';

const logoApp = require('../../assets/Logo.png');


const iconesVida = {
    vidatipo1: require('../../assets/MarcadoresDeVida/TokenConfuso.png'),
    vidatipo2: require('../../assets/MarcadoresDeVida/TokenDanificado.png'),
    vidatipo3: require('../../assets/MarcadoresDeVida/TokenFogo.png'),
    vidatipo4: require('../../assets/MarcadoresDeVida/TokenFuria.png'),
    vidatipo5: require('../../assets/MarcadoresDeVida/TokenGelo.png'),
    vidatipo6: require('../../assets/MarcadoresDeVida/TokenParalizado.png'),
    vidatipo7: require('../../assets/MarcadoresDeVida/TokenRegeneracao.png'),
    vidatipo8: require('../../assets/MarcadoresDeVida/TokenSangramento.png'),
    vidatipo9: require('../../assets/MarcadoresDeVida/TokenSilencio.png'),
    vidatipo10: require('../../assets/MarcadoresDeVida/TokenVeneno.png'),
};


const ContadorDeVida = ({ vida, aoAumentar, aoDiminuir, aoDefinir }) => {
    const [estaEditando, setEstaEditando] = useState(false);
    useEffect(() => {
        const lidarComBotaoVoltar = () => {
            if (estaEditando) { setEstaEditando(false); return true; } return false;
        };
        const inscricao = BackHandler.addEventListener('hardwareBackPress', lidarComBotaoVoltar);
        return () => inscricao.remove();
    }, [estaEditando]);

    if (estaEditando) {
        return (<TextInput style={styles.vidaTextInput} value={String(vida)} onChangeText={aoDefinir} keyboardType="numeric" autoFocus={true} onBlur={() => setEstaEditando(false)} maxLength={3} />);
    }

    return (
        <View style={styles.contadorVidaContainer}>
            <TouchableOpacity style={styles.botaoVida} onPress={aoDiminuir}><Text style={styles.botaoVidaTexto}>-</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setEstaEditando(true)}><Text style={styles.vidaTexto}>{vida}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.botaoVida} onPress={aoAumentar}><Text style={styles.botaoVidaTexto}>+</Text></TouchableOpacity>
        </View>
    );
};


export default function Jogo() {
    

    const criarEstadoInicialJogador = () => ({
        tipoAtual: 'vidatipo1',
        vidas: {
            vidatipo1: 100, vidatipo2: 100, vidatipo3: 100, vidatipo4: 100, vidatipo5: 100,
            vidatipo6: 100, vidatipo7: 100, vidatipo8: 100, vidatipo9: 100, vidatipo10: 100,
        },
    });

    const [jogadores, setJogadores] = useState(() => Array(6).fill(null).map(() => criarEstadoInicialJogador()));
    const [quantidadeJogadores, setQuantidadeJogadores] = useState(2);
    const [resultadosDados, setResultadosDados] = useState([]);
    const [marcadorModalVisivel, setMarcadorModalVisivel] = useState(false);
    const [menuModalVisivel, setMenuModalVisivel] = useState(false); 
    const [jogadorAtual, setJogadorAtual] = useState(null);

    const abrirMarcadorModal = (indice) => { setJogadorAtual(indice); setMarcadorModalVisivel(true); };
    const fecharMarcadorModal = () => { setMarcadorModalVisivel(false); setJogadorAtual(null); };

    const alterarVida = (indice, valor) => {
        const novosJogadores = [...jogadores];
        const jogador = novosJogadores[indice];
        const vidaAtual = jogador.vidas[jogador.tipoAtual];
        jogador.vidas[jogador.tipoAtual] = Math.max(0, Math.min(100, vidaAtual + valor));
        setJogadores(novosJogadores);
    };

    const definirVida = (indice, valor) => {
        const novosJogadores = [...jogadores];
        const jogador = novosJogadores[indice];
        let valorNumerico = parseInt(valor, 10);
        if (isNaN(valorNumerico)) { valorNumerico = 0; }
        jogador.vidas[jogador.tipoAtual] = Math.max(0, Math.min(100, valorNumerico));
        setJogadores(novosJogadores);
    };

    const alterarTipoDeVida = (indice, novoTipo) => {
        const novosJogadores = [...jogadores];
        novosJogadores[indice].tipoAtual = novoTipo;
        setJogadores(novosJogadores);
        fecharMarcadorModal();
    };

    const adicionarJogador = () => setQuantidadeJogadores(contagemAtual => Math.min(6, contagemAtual + 1));
    const removerJogador = () => setQuantidadeJogadores(contagemAtual => Math.max(1, contagemAtual - 1));

    const rolarDados = () => {
        const resultados = Array.from({ length: quantidadeJogadores }, () => Math.floor(Math.random() * 6) + 1);
        setResultadosDados(resultados);
        setMenuModalVisivel(false); 
    };

    const reiniciarVidas = () => {
        setJogadores(jogadores.map(jogador => {
            const vidasReiniciadas = { ...jogador.vidas };
            for (const tipo in vidasReiniciadas) { vidasReiniciadas[tipo] = 100; }
            return { ...jogador, vidas: vidasReiniciadas };
        }));
        setResultadosDados([]);
        setMenuModalVisivel(false); 
    };

    return (
        <ImageBackground source={require("../../assets/Background.jpeg")} style={styles.container} resizeMode="cover">
            <Image source={logoApp} style={styles.logo} resizeMode="contain" />

            <View style={styles.quantidadeJogadoresContainer}>
                <TouchableOpacity style={styles.quantidadeJogadoresBotao} onPress={removerJogador}><Text style={styles.quantidadeJogadoresBotaoTexto}>-</Text></TouchableOpacity>
                <Text style={styles.quantidadeJogadoresTexto}>{quantidadeJogadores} Jogador(es)</Text>
                <TouchableOpacity style={styles.quantidadeJogadoresBotao} onPress={adicionarJogador}><Text style={styles.quantidadeJogadoresBotaoTexto}>+</Text></TouchableOpacity>
            </View>

            {}
            <View style={styles.areaJogo}>
                {jogadores.slice(0, quantidadeJogadores).map((jogador, indice) => {
                    const valorVidaAtual = jogador.vidas[jogador.tipoAtual];
                    
                    const estiloRotacao = quantidadeJogadores === 2 && indice === 0 ? styles.jogadorRotacionado : {};

                    return (
                        <View key={indice} style={[styles.jogadorContainer, estiloRotacao]}>
                            <Text style={styles.jogadorTexto}>Jogador {indice + 1}</Text>
                            {resultadosDados[indice] && (
                                <View style={styles.resultadoDadoContainer}><Text style={styles.resultadoDadoTexto}>Dado: {resultadosDados[indice]}</Text></View>
                            )}
                            <ContadorDeVida vida={valorVidaAtual} aoAumentar={() => alterarVida(indice, 1)} aoDiminuir={() => alterarVida(indice, -1)} aoDefinir={(valor) => definirVida(indice, valor)} />
                            <View style={styles.tipoVidaContainer}>
                                <TouchableOpacity style={styles.marcadorAtualBotao} onPress={() => abrirMarcadorModal(indice)}>
                                    <Image source={iconesVida[jogador.tipoAtual]} style={styles.marcadorAtualIcone} />
                                    <Text style={styles.marcadorAtualTexto}>Marcador</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>

            {}
            <Modal
                animationType="slide"
                transparent={true}
                visible={marcadorModalVisivel}
                onRequestClose={fecharMarcadorModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitulo}>Escolha um Marcador</Text>
                        <FlatList
                            data={Object.keys(iconesVida)}
                            key={'colunas-4'}
                            keyExtractor={(item) => item}
                            numColumns={4}
                            columnWrapperStyle={{ justifyContent: 'center' }}
                            renderItem={({ item: tipo }) => (
                                <TouchableOpacity style={styles.modalIconeContainer} onPress={() => alterarTipoDeVida(jogadorAtual, tipo)}>
                                    <Image source={iconesVida[tipo]} style={styles.modalIcone} />
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.modalBotaoFechar} onPress={fecharMarcadorModal}>
                            <Text style={styles.modalBotaoFecharTexto}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {}
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuBotao} onPress={() => setMenuModalVisivel(true)}>
                    <Text style={styles.menuBotaoTexto}>Ações</Text>
                </TouchableOpacity>
            </View>
            
            {}
            <Modal
                animationType="fade"
                transparent={true}
                visible={menuModalVisivel}
                onRequestClose={() => setMenuModalVisivel(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setMenuModalVisivel(false)}>
                    <View style={styles.menuModalContainer}>
                        <TouchableOpacity style={styles.menuModalBotao} onPress={rolarDados}>
                            <Text style={styles.menuModalBotaoTexto}>Rolar Dados</Text>
                        </TouchableOpacity>
                        <View style={styles.menuModalSeparador} />
                        <TouchableOpacity style={[styles.menuModalBotao, { backgroundColor: '#A73636' }]} onPress={reiniciarVidas}>
                            <Text style={styles.menuModalBotaoTexto}>Reiniciar Jogo</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ImageBackground>
    );
}



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#243A73', padding: 10, },
    logo: { width: '80%', height: 50, alignSelf: 'center', marginBottom: 5, },
    quantidadeJogadoresContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, marginBottom: 10, },
    quantidadeJogadoresBotao: { backgroundColor: '#2E4C8A', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 5, zIndex: 10 },
    quantidadeJogadoresBotaoTexto: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', },
    quantidadeJogadoresTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginHorizontal: 10 },
    
    
    areaJogo: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
    },
    jogadorContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 8,
        borderRadius: 10,
        width: '45%', 
        minHeight: 150, 
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10, 
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    jogadorRotacionado: {
        transform: [{ rotate: '180deg' }], 
    },
    jogadorTexto: { fontSize: 16, color: '#FFFFFF', marginBottom: 5, fontWeight: 'bold', },
    contadorVidaContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderRadius: 8, padding: 5, width: '100%', },
    botaoVida: { backgroundColor: '#2E4C8A', borderRadius: 5, },
    botaoVidaTexto: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', paddingHorizontal: 8, },
    vidaTexto: { fontSize: 22, fontWeight: 'bold', color: '#000000', },
    vidaTextInput: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', borderBottomWidth: 1, borderColor: '#FFFFFF', minWidth: 50, color: '#FFFFFF', },
    resultadoDadoContainer: { backgroundColor: '#FFFFFF', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 5, },
    resultadoDadoTexto: { color: '#243A73', fontSize: 14, fontWeight: 'bold', },
    tipoVidaContainer: { alignItems: 'center', marginTop: 10, width: '100%', },
    marcadorAtualBotao: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 8, padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', },
    marcadorAtualIcone: { width: 25, height: 25, marginRight: 8, },
    marcadorAtualTexto: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', },
    
  
    menuContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    menuBotao: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    menuBotaoTexto: {
        color: '#243A73',
        fontSize: 18,
        fontWeight: 'bold',
    },
    menuModalContainer: {
        position: 'absolute',
        bottom: 90,
        width: '60%',
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 10,
        alignSelf: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    menuModalBotao: {
        backgroundColor: '#2E4C8A',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    menuModalBotaoTexto: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    menuModalSeparador: {
        height: 1,
        backgroundColor: '#DDD',
        marginVertical: 5,
    },

    
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', },
    modalContainer: { width: '90%', backgroundColor: 'white', borderRadius: 15, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, },
    modalTitulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, },
    modalIconeContainer: { margin: 8, },
    modalIcone: { width: 50, height: 50, },
    modalBotaoFechar: { marginTop: 20, backgroundColor: '#A73636', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 30, },
    modalBotaoFecharTexto: { color: 'white', fontSize: 16, fontWeight: 'bold', }
});