// src/components/DiceRoller.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

/**
 * Componente que renderiza um Modal para rolagem de dados (D6, D20, D100).
 */
export default function DiceRoller({ visible, onClose }) {
  // Estado para armazenar o texto do resultado (ex: "D20: 15")
  const [result, setResult] = useState(null);

  // Função que calcula um resultado aleatório com base no número de lados
  const rollDice = (sides) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    setResult(`D${sides}: ${roll}`); // Atualiza o texto do resultado
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible} // O Modal só é visível se a prop 'visible' for true
      onRequestClose={onClose} // Permite fechar com o botão "Voltar" do Android
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Exibe o resultado ou um texto padrão */}
          <Text style={styles.resultText}>{result || 'Role um dado!'}</Text>
          
          {/* Botões de Rolagem */}
          <View style={styles.diceButtons}>
            <TouchableOpacity style={styles.button} onPress={() => rollDice(6)}>
              <Text style={styles.buttonText}>D6</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => rollDice(20)}>
              <Text style={styles.buttonText}>D20</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => rollDice(100)}>
              <Text style={styles.buttonText}>D100</Text>
            </TouchableOpacity>
          </View>
          
          {/* Botão de Fechar */}
          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Estilos do Modal de Dados
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', // Fundo escurecido
  },
  modalView: {
    margin: 20,
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  resultText: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  diceButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#444', // Cor diferente para o botão de fechar
  },
});