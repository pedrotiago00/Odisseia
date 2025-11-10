import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';

/**
 * Modal para definir um valor numérico.
 *
 * @param {boolean} visible - Controla se o modal está visível.
 * @param {function} onClose - Função para fechar (botão "Cancelar").
 * @param {function} onConfirm - Função para confirmar o valor.
 * @param {number} targetPlayer - O jogador alvo (usado para rotacionar o modal).
 * @param {string} inputValue - O valor atual no campo de texto (é uma string!).
 * @param {function} onInputChange - Função chamada ao digitar no campo.
 * @param {function} onAdjustValue - Função chamada pelos botões de atalho (ex: +5, -1).
 */
const ValueModal = ({
  visible,
  onClose,
  onConfirm,
  targetPlayer,
  inputValue,
  onInputChange,
  onAdjustValue,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose} // Permite fechar com o botão "Voltar" do Android
    >
      {/* Fundo escuro semi-transparente */}
      <View style={styles.modalBackdrop}>
        
        {/* Caixa branca central */}
        <View style={[
          styles.modalContent,
          // LÓGICA DE ROTAÇÃO: Se for o jogador 1 (oponente), gira o modal
          targetPlayer === 1 && { transform: [{ rotate: '180deg' }] }
        ]}>
          
          <Text style={styles.modalTitle}>Definir Novo Valor</Text>
          
          {/* Campo de entrada principal */}
          <TextInput
            style={styles.modalInput}
            keyboardType="number-pad" // Mostra o teclado numérico
            value={inputValue} // O valor exibido
            onChangeText={onInputChange} // Função chamada ao digitar
            autoFocus={true} // Foca automaticamente neste campo
          />
          
          {/* Linha de botões de ajuste rápido */}
          <View style={styles.modalAdjustRow}>
            <TouchableOpacity
              style={styles.modalAdjustButton}
              onPress={() => onAdjustValue(-5)} // Atalho -5
            >
              <Text style={styles.modalAdjustText}>-5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalAdjustButton}
              onPress={() => onAdjustValue(-1)} // Atalho -1
            >
              <Text style={styles.modalAdjustText}>-1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalAdjustButton}
              onPress={() => onAdjustValue(1)} // Atalho +1
            >
              <Text style={styles.modalAdjustText}>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalAdjustButton}
              onPress={() => onAdjustValue(5)} // Atalho +5
            >
              <Text style={styles.modalAdjustText}>+5</Text>
            </TouchableOpacity>
          </View>
          
          {/* Linha de botões de Ação (Cancelar/Confirmar) */}
          <View style={styles.modalActionRow}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={onClose} // Chama a função de fechar
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm]}
              onPress={onConfirm} // Chama a função de confirmar
            >
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default ValueModal;