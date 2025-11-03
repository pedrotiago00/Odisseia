// src/components/ContadorDeVida.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    BackHandler,
} from 'react-native';

/**
 * Componente focado em exibir e editar um único contador de vida.
 * Controla a lógica de alternar entre 'Text' (exibição) e 'TextInput' (edição).
 */
export default function ContadorDeVida({ vida, aoAumentar, aoDiminuir, aoDefinir }) {
    // Estado para controlar se o usuário está digitando a vida (true) ou não (false)
    const [estaEditando, setEstaEditando] = useState(false);

    // Efeito para lidar com o botão "Voltar" do hardware (Android)
    useEffect(() => {
        const lidarComBotaoVoltar = () => {
            if (estaEditando) {
                setEstaEditando(false); // Se estiver editando, o botão "Voltar" apenas fecha o modo de edição
                return true; // Impede que o app volte a tela
            }
            return false; // Comportamento padrão (voltar a tela)
        };
        
        const inscricao = BackHandler.addEventListener('hardwareBackPress', lidarComBotaoVoltar);
        return () => inscricao.remove(); // Limpa o "listener" ao desmontar o componente
    }, [estaEditando]); // Roda o efeito novamente se 'estaEditando' mudar

    // Se estiver no modo de edição, renderiza um TextInput
    if (estaEditando) {
        return (
            <TextInput
                style={styles.vidaTextInput}
                value={String(vida)} // Converte o número para string
                onChangeText={aoDefinir} // Chama a função da Tela do Contador.
                keyboardType="numeric"
                autoFocus={true} // Foca automaticamente no input
                onBlur={() => setEstaEditando(false)} 
                maxLength={3} // Limite de 3 dígitos (999)
            />
        );
    }

    // Se não estiver editando, renderiza os botões de + e - e o texto da vida
    return (
        <View style={styles.contadorVidaContainer}>
            <TouchableOpacity style={styles.botaoVida} onPress={aoDiminuir}>
                <Text style={styles.botaoVidaTexto}>-</Text>
            </TouchableOpacity>
            
            {/* Clicar no número ativa o modo de edição */}
            <TouchableOpacity onPress={() => setEstaEditando(true)}>
                <Text style={styles.vidaTexto}>{vida}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.botaoVida} onPress={aoAumentar}>
                <Text style={styles.botaoVidaTexto}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

// Estilos do Componente Contador
const styles = StyleSheet.create({
    contadorVidaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 5,
        width: '100%',
        marginVertical: 10,
    },
    botaoVida: {
        backgroundColor: '#2E4C8A',
        borderRadius: 5,
        paddingHorizontal: 8,
    },
    botaoVidaTexto: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    vidaTexto: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
        minWidth: 50,
        textAlign: 'center',
    },
    // Estilo para o modo de edição (TextInput)
    vidaTextInput: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderColor: '#000000',
        minWidth: 50,
        color: '#000000',
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 5,
        width: '100%',
        marginVertical: 10,
    },
});