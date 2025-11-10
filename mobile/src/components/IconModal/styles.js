import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Fundo escuro e semi-transparente que cobre a tela inteira
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // A "caixa" branca no centro que segura o conteúdo
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // O título, ex: "Escolha um Ícone"
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  // Estilo base para botões dentro do modal
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  // Estilo específico do botão "Cancelar" ou "Fechar"
  modalButtonCancel: {
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  // Texto dentro dos botões
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  // A área de rolagem onde os ícones aparecem
  iconModalScroll: {
    width: '100%',
    maxHeight: 300, // Limita a altura para não cobrir a tela
  },
  // Título de cada seção, ex: "Mana", "Venenos"
  iconCategoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  // O "grid" que segura os ícones e permite quebra de linha
  iconModalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que os ícones pulem para a próxima linha
    justifyContent: 'flex-start',
  },
  // O "quadradinho" cinza clicável que segura cada ícone
  iconButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    margin: 6,
  },
  // Estilo para ícones que são Emojis (texto)
  iconText: {
    fontSize: 30,
  },
  // Estilo para ícones que são Imagens (ex: .png)
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});