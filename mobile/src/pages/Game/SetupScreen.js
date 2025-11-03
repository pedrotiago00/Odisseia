import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

/**
 * Componente reutilizável para selecionar uma opção (ex: Jogadores, Vida).
 * @param {string} title 
 * @param {Array<string|number>} options 
 * @param {string|number} selected - 
 * @param {Function} onSelect 
 */
const OptionSelector = ({ title, options, selected, onSelect }) => (
  <View style={styles.optionContainer}>
    <Text style={styles.optionTitle}>{title}</Text>
    <View style={styles.optionButtons}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.button, selected === option && styles.buttonSelected]}
          onPress={() => onSelect(option)}
        >
          <Text style={[styles.buttonText, selected === option && styles.buttonTextSelected]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

//Tela Principal de Configuração do Jogo
export default function SetupScreen({ navigation }) {
  // Estado para armazenar o número de jogadores selecionado
  const [playerCount, setPlayerCount] = useState(2);
  // Estado para armazenar a vida inicial selecionada
  const [startingLife, setStartingLife] = useState(40);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Configurar Jogo</Text>

      {/* Seletor para o número de jogadores */}
      <OptionSelector
        title="Jogadores"
        options={[1, 2, 3, 4, 5, 6]}
        selected={playerCount}
        onSelect={setPlayerCount}
      />

      {/* Seletor para a vida inicial */}
      <OptionSelector
        title="Vida Inicial"
        options={[20, 30, 40]}
        selected={startingLife}
        onSelect={setStartingLife}
      />

      {/* Botão para iniciar o jogo */}
      <TouchableOpacity
        style={styles.startButton}
        // Navega para a tela 'Game' e passa os estados como parâmetros de rota
        onPress={() => navigation.navigate('Game', { playerCount, startingLife })}
      >
        <Text style={styles.startButtonText}>Iniciar Jogo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Estilos da Tela de Configuração
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 60,
  },
  optionContainer: {
    width: '100%',
    marginBottom: 40,
  },
  optionTitle: {
    fontSize: 24,
    color: '#aaa',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap', // Permite que os botões quebrem a linha em telas menores
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#333',
    borderRadius: 10,
    margin: 5, // Espaçamento entre os botões
  },
  buttonSelected: {
    backgroundColor: '#6200ee', // Cor quando o botão está selecionado
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  buttonTextSelected: {
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#03dac6',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 15,
    marginTop: 40,
  },
  startButtonText: {
    fontSize: 22,
    color: '#000',
    fontWeight: 'bold',
  },
});