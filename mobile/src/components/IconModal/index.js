import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { iconCategories } from '../../constants/gameData'; // Dados dos ícones
import styles from './styles'; // Estilos do arquivo anterior

/**
 * Modal para seleção de ícones.
 *
 * @param {boolean} visible - Controla se o modal está visível.
 * @param {function} onClose - Função para fechar o modal.
 * @param {function} onSelect - Função chamada ao selecionar um ícone.
 * @param {number} targetPlayer - O jogador alvo (usado para rotacionar o modal).
 * @param {string} targetCategory - A categoria de ícone a ser mostrada.
 */
const IconModal = ({
  visible,
  onClose,
  onSelect,
  targetPlayer,
  targetCategory, // Se esta prop for passada, o modal SÓ mostra essa categoria
}) => {
  
  // Função interna que decide o que renderizar
  const renderIconCategories = () => {
    
    // LÓGICA 1: Se uma 'targetCategory' foi especificada (ex: 'Mana'),
    // o modal entra em modo "restrito" e mostra APENAS os ícones dela.
    if (targetCategory && iconCategories[targetCategory]) {
      return (
        <View>
          <Text style={styles.iconCategoryTitle}>{targetCategory}</Text>
          <View style={styles.iconModalGrid}>
            {iconCategories[targetCategory].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.iconButton}
                onPress={() => onSelect(item)} // Envia o ícone selecionado
              >
                {/* Verifica se o ícone é um emoji (string) ou imagem (require) */}
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

    // LÓGICA 2: Se NENHUMA 'targetCategory' foi passada,
    // o modal mostra TODAS as categorias (Mana, Veneno, etc.)
    return Object.keys(iconCategories).map(categoryName => (
      <View key={categoryName}>
        <Text style={styles.iconCategoryTitle}>{categoryName}</Text>
        <View style={styles.iconModalGrid}>
          {iconCategories[categoryName].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconButton}
              onPress={() => onSelect(item)} // Envia o ícone selecionado
            >
              {/* Mesma lógica de renderização (emoji vs imagem) */}
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
          
          <Text style={styles.modalTitle}>Escolha um Ícone</Text>
          
          {/* Área de rolagem para os ícones */}
          <ScrollView style={styles.iconModalScroll}>
            {renderIconCategories()}
          </ScrollView>

          {/* Botão de Fechar */}
          <TouchableOpacity
            style={[
              styles.modalButton,
              styles.modalButtonCancel,
              { marginTop: 16, width: '100%' }, // Estilo extra local
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