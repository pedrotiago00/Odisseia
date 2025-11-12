import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // O fundo escuro (overlay)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // O conteúdo (caixa branca)
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#0d2731ff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  // O campo de input do número
  input: {
    width: '100%',
    backgroundColor: '#b9e4f1ff',
    borderBottomWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  // Container para os botões +1, +5, etc.
  shortcutContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shortcutButton: {
    backgroundColor: '#b9e4f1ff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 4,
  },
  shortcutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  // Container para os botões Cancelar/Confirmar
  actionContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1b9beff',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButtonText: {
    color: '#555',
  },
});