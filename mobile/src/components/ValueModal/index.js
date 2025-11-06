import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';

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
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={[
          styles.modalContent,
          targetPlayer === 1 && { transform: [{ rotate: '180deg' }] }
        ]}>
          <Text style={styles.modalTitle}>Definir Novo Valor</Text>
          <TextInput
            style={styles.modalInput}
            keyboardType="number-pad"
            value={inputValue}
            onChangeText={onInputChange}
            autoFocus={true}
          />
          <View style={styles.modalAdjustRow}>
            <TouchableOpacity
              style={styles.modalAdjustButton}
              onPress={() => onAdjustValue(-5)}
            >
              <Text style={styles.modalAdjustText}>-5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalAdjustButton}
              onPress={() => onAdjustValue(-1)}
            >
              <Text style={styles.modalAdjustText}>-1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalAdjustButton}
              onPress={() => onAdjustValue(1)}
            >
              <Text style={styles.modalAdjustText}>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalAdjustButton}
              onPress={() => onAdjustValue(5)}
            >
              <Text style={styles.modalAdjustText}>+5</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalActionRow}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm]}
              onPress={onConfirm}
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