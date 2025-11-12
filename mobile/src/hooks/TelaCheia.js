import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export default function useTelaCheia() {
  useEffect(() => {
    // Função para esconder a barra
    const hideNavigationBar = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("inset-swipe");
    };

    hideNavigationBar();

    // Função de "limpeza" que roda quando a tela é desmontada
    return () => {
      // Mostra a barra de navegação novamente
      NavigationBar.setVisibilityAsync("visible");
    };
  }, [])
}
