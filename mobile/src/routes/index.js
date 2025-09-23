import { createNaviteStackNavigator } from '@react-navigation/native-stack';

import Welcome from '../pages/Welcome';
import SingIn from '../pages/SignIn';

const Stack = createNaviteStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SingIn} />
    </Stack.Navigator>
  );
}