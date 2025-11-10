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
  // A "caixa" branca central que segura o conteúdo
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
  // O título, ex: "Definir Novo Valor"
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  // O campo de entrada de texto para o número (ex: "20")
  modalInput: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1d4ed8', // Cor azul
    borderBottomWidth: 2,
    borderColor: '#d1d5db', // Borda cinza
    width: '80%',
    marginBottom: 20,
    paddingVertical: 8,
  },
  // A linha que segura os botões de ajuste rápido (-5, -1, +1, +5)
  modalAdjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  // Estilo para um botão de ajuste rápido
  modalAdjustButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6', // Cinza claro
    borderRadius: 8,
  },
  // Texto dentro do botão de ajuste (ex: "-5")
  modalAdjustText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  // A linha que segura os botões "Cancelar" e "Confirmar"
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  // Estilo base para os botões de ação
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  // Estilo específico do botão "Cancelar"
  modalButtonCancel: {
    backgroundColor: '#f3f4f6', // Cinza claro
    marginRight: 8,
  },
  // Estilo específico do botão "Confirmar"
  modalButtonConfirm: {
    backgroundColor: '#1d4ed8', // Azul
    marginLeft: 8,
  },
  // Texto dos botões de ação ("Cancelar", "Confirmar")
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});