import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from '../pages/Welcome'
import login from '../pages/SignIn/login';
import cadastro from '../pages/SignIn/cadastro';
import Jogo from '../pages/Game/Index';



const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={login} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={cadastro} options={{ headerShown: false }} />
      <Stack.Screen name="Jogo" component={Jogo} options={{ headerShown: false , statusBarHidden: true } } /> 
    </Stack.Navigator>
  );
}