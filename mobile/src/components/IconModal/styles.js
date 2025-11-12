import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#333333', // Fundo escuro
    borderRadius: 12,
    padding: 24,
    borderWidth: 2,
    borderColor: '#555',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  iconList: {
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
    margin: 8,
    backgroundColor: '#444',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666',
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  iconName: {
    color: '#FFF',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});