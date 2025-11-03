
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ContadorDeVida from './ContadorDeVida'; 
import { iconesVida } from '../constants/iconesVida'; 


export default function Player({
    jogadorData,      
    onAlterarVida,    
    onDefinirVida,    
    onOpenMarkerModal, 
    isFlipped         
}) {
    
    
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