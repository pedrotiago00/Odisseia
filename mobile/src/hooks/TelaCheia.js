import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export default function useTelaCheia() {
  useEffect(() => {
    // Oculta a status bar em ambos
    StatusBar.setHidden(true, 'fade');

    if (Platform.OS === 'android') {
      // Android: oculta os botoes de ação.
      NavigationBar.setVisibilityAsync('hidden');
      
    }

    return () => {
      // Restaura quando sair da tela
      StatusBar.setHidden(false, 'fade');

      if (Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('visible');
        
      }
    };
  }, []);
}
