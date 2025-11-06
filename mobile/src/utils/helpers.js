import { iconCategories } from '../constants/gameData';

// Cria um "molde" de jogador novo, lendo as categorias de ícones
export const getInitialPlayerState = () => {
  
  const categoryNames = Object.keys(iconCategories);

  const initialStats = categoryNames.map(categoryName => {
    
    const firstIcon = (iconCategories[categoryName] && iconCategories[categoryName][0]) 
                      ? iconCategories[categoryName][0].icon 
                      : '❓'; 

    return {
      icon: firstIcon,
      value: 0, 
      category: categoryName 
    };
  });

  return {
    life: 30,
    timer: 900,
    stats: initialStats, 
    counters: [2, 2, 2, 2],
  };
};

// Formata segundos (ex: 900) para "15:00"
export const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};