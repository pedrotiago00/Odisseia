// src/components/Player.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ContadorDeVida from './ContadorDeVida'; // Importa o componente de contador
import { iconesVida } from '../constants/iconesVida'; // Importa os ícones

/**
 * Componente que renderiza a área de um único jogador.
 * Este é um componente "burro" (dumb component), pois recebe todos os dados
 * e funções de que precisa via props do 'GameScreen'.
 */
export default function Player({
    jogadorData,      // O objeto de estado completo para este jogador
    onAlterarVida,    // Função para +1 ou -1 na vida
    onDefinirVida,    // Função para definir a vida (via input)
    onOpenMarkerModal, // Função para abrir o modal de marcadores
    isFlipped         // Booleano que indica se o card deve ser rotacionado 180º
}) {
    
    // Busca a vida ATUAL com base no 'tipoAtual' (ex: 'vidatipo10' -> 40)
    const valorVidaAtual = jogadorData.vidas[jogadorData.tipoAtual];
    // Busca o ícone/imagem correspondente ao 'tipoAtual'
    const iconeAtual = iconesVida[jogadorData.tipoAtual];

    // Aplica o estilo de rotação se 'isFlipped' for verdadeiro
    const containerStyle = isFlipped ? [styles.container, styles.flipped] : styles.container;

    return (
        <View style={containerStyle}>
            {/* Botão superior para abrir o modal de marcadores */}
            <View style={styles.markerContainer}>
                <TouchableOpacity style={styles.markerButton} onPress={onOpenMarkerModal}>
                    {/* Lógica para renderizar Imagem (se for 'require') ou Texto (se for emoji) */}
                    {typeof iconeAtual === 'number' ? (
                        <Image source={iconeAtual} style={styles.markerIcon} />
                    ) : (
                        <Text style={styles.markerIcon}>{iconeAtual}</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Renderiza o componente 'ContadorDeVida', passando as props recebidas */}
            <ContadorDeVida
                vida={valorVidaAtual}
                aoAumentar={() => onAlterarVida(1)}
                aoDiminuir={() => onAlterarVida(-1)}
                aoDefinir={onDefinirVida}
            />
        </View>
    );
}

// Estilos do Componente Player
const styles = StyleSheet.create({
    container: {
        flex: 1, // Ocupa o espaço dividido pelo 'GameScreen'
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
        borderRadius: 10,
        backgroundColor: '#2a2a2a',
    },
    flipped: {
        transform: [{ rotate: '180deg' }], // Estilo de rotação
    },
    markerContainer: {
        position: 'absolute', // Flutua sobre o contador
        top: 10,
        flexDirection: 'row',
        backgroundColor: 'rgba(110, 33, 255, 0.5)', // Cor do seu app original
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 5,
        alignItems: 'center',
    },
    markerButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerIcon: {
        width: 25,
        height: 25,
        fontSize: 20, // Para o placeholder de emoji
        color: '#FFF', // Para o placeholder de emoji
    },
});