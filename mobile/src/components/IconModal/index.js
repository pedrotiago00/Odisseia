import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { iconCategories } from '../../constants/gameData';
import styles from './styles';

const IconModal = ({
  visible,
  onClose,
  onSelect,
  targetPlayer,
  targetCategory,
}) => {
  
  // Lógica de renderização de ícones, agora local
  const renderIconCategories = () => {
    // 1. Se um slot tem categoria, mostra SÓ ela
    if (targetCategory && iconCategories[targetCategory]) {
      return (
        <View>
          <Text style={styles.iconCategoryTitle}>{targetCategory}</Text>
          <View style={styles.iconModalGrid}>
            {iconCategories[targetCategory].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.iconButton}
                onPress={() => onSelect(item)}
              >
                {typeof item.icon === 'string' ? (
                  <Text style={styles.iconText}>{item.icon}</Text>
                ) : (
                  <Image source={item.icon} style={styles.iconImage} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    // 2. Se o slot não tem categoria, mostra TODAS
    return Object.keys(iconCategories).map(categoryName => (
      <View key={categoryName}>
        <Text style={styles.iconCategoryTitle}>{categoryName}</Text>
        <View style={styles.iconModalGrid}>
          {iconCategories[categoryName].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconButton}
              onPress={() => onSelect(item)}
            >
              {typeof item.icon === 'string' ? (
                <Text style={styles.iconText}>{item.icon}</Text>
              ) : (
                <Image source={item.icon} style={styles.iconImage} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ));
  };

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
          <Text style={styles.modalTitle}>Escolha um Ícone</Text>
          <ScrollView style={styles.iconModalScroll}>
            {renderIconCategories()}
          </ScrollView>
          <TouchableOpacity
            style={[
              styles.modalButton,
              styles.modalButtonCancel,
              { marginTop: 16, width: '100%' },
            ]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default IconModal;