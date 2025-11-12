import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity, // 1. Importado
  SafeAreaView,
} from 'react-native';
import styles from './styles';

export default function ValueModal({
  visible,
  onClose,
  onConfirm,
  targetPlayer,
  inputValue,
  onInputChange,
  onAdjustValue,
}) {
  // Gira o modal para o Jogador 1 (vermelho)
  const modalRotation = targetPlayer === 1 ? { transform: [{ rotate: '180deg' }] } : {};

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true} 
    >
      {}
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose} // Clicar no fundo escuro fecha
      >
        {/* Wrapper que "para" o clique e impede de fechar */}
        <View
          style={[styles.modalContent, modalRotation]}
          onStartShouldSetResponder={() => true} 
        >
          <Text style={styles.modalTitle}>Alterar Valor</Text>
          
          <TextInput
            style={styles.input}
            onChangeText={onInputChange}
            value={inputValue}
            keyboardType="number-pad"
            maxLength={2} // Limita a 2 dígitos (ex: 99)
            autoFocus={true} // Abre o teclado automaticamente
            selectTextOnFocus={false} // Seleciona o texto ao focar
          />

          {/* Botões de Atalho */}
          <View style={styles.shortcutContainer}>
            <TouchableOpacity onPress={() => onAdjustValue(1)} style={styles.shortcutButton}><Text style={styles.shortcutText}>+1</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => onAdjustValue(-1)} style={styles.shortcutButton}><Text style={styles.shortcutText}>-1</Text></TouchableOpacity>
           
            <TouchableOpacity onPress={() => onAdjustValue(-5)} style={styles.shortcutButton}><Text style={styles.shortcutText}>-5</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => onAdjustValue(5)} style={styles.shortcutButton}><Text style={styles.shortcutText}>+5</Text></TouchableOpacity>
            
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.confirmButton]} 
              onPress={onConfirm}
            >
              <Text style={styles.actionButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
