import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: '#000',
  },
  card: { 
    flex: 1, 
    width: '100%', 
    overflow: 'hidden' 
  },
  handleContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  resetButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 4,
  },
  resetButtonText: {
    color: '#555',
    fontSize: 24, 
    fontWeight: 'bold',
  },
});