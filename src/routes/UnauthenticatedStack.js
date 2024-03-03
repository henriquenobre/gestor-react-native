import { createStackNavigator } from "@react-navigation/stack"

import LoginScreen from '../screens/LoginScreen';
import AuthScreen from '../screens/AuthScreen';
import PhoneVerifyScreen from '../screens/PhoneVerifyScreen';

const Stack = createStackNavigator()

export default function UnauthenticatedStack() {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
      />
      <Stack.Screen
        name="PhoneVerifyScreen"
        component={PhoneVerifyScreen}
      />
    </Stack.Navigator>
  )
}
