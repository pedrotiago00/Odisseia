// Arquivo de configuração das rotas de navegação da aplicação
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa todas as telas (pages) da aplicação
import Welcome from '../pages/Welcome';
import login from '../pages/SignIn/login';
import cadastro from '../pages/SignIn/cadastro';
import game from '../pages/Game/GameScreen';
import setup from '../pages/Game/SetupScreen';

// Cria a instância do navegador Stack (navegação em pilha)
const Stack = createNativeStackNavigator();

// Componente principal que define a estrutura de navegação
export default function Routes() {
  return (
    <Stack.Navigator>
      {/* Tela de Boas-Vindas (a tela inicial) */}
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      
      {/* Tela de Login */}
      <Stack.Screen name="SignIn" component={login} options={{ headerShown: false }} />
      
      {/* Tela de Cadastro */}
      <Stack.Screen name="Cadastro" component={cadastro} options={{ headerShown: false }} />
      
      {/* Tela Principal do Jogo */}
      <Stack.Screen 
        name="Game" 
        component={game} 
        options={{ headerShown: false , statusBarHidden: true } } // Esconde o cabeçalho e a barra de status
      />
      
      {/* Tela de Configuração do Jogo */}
      <Stack.Screen 
        name="Setup" 
        component={setup} 
        options={{ headerShown: false , statusBarHidden: true } } // Esconde o cabeçalho e a barra de status
      />  
    </Stack.Navigator>
  );
}