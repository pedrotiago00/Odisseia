import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import styles from './styles'; // Importa os estilos

export default function IconModal({
  visible,
  onClose,
  onSelect,
  targetPlayer,
  iconData, // Recebe os dados (ex: icones de vida)
}) {
  
  // Gira o modal para o jogador 1
  const modalRotation = targetPlayer === 1 ? { transform: [{ rotate: '180deg' }] } : {};

  const renderIcon = ({ item }) => (
    <TouchableOpacity 
      style={styles.iconButton} 
      // Passa o objeto 'item' inteiro (ex: {name: 'vidatipo1', icon: ...})
      onPress={() => {
        onSelect(item);
        onClose(); // Fecha o modal ao selecionar
      }}
    >
      <Image source={item.icon} style={styles.iconImage} resizeMode="contain" />
      {/* <Text style={styles.iconName}>{item.name}</Text> */}
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Overlay escuro */}
      <View style={styles.modalOverlay}>
        {/* Conteúdo do Modal (com fundo) */}
        <SafeAreaView style={[styles.modalContent, modalRotation]}>
          <Text style={styles.modalTitle}>Selecione um Ícone</Text>
          
          <FlatList
            data={iconData}
            renderItem={renderIcon}
            keyExtractor={(item, index) => item.name + index}
            numColumns={4} // 4 colunas
            contentContainerStyle={styles.iconList}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}