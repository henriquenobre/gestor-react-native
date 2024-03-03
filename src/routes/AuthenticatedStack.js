import { createStackNavigator } from '@react-navigation/stack';

import CondominiumScreen from '../screens/CondominiumScreen'
import UnitsScreen from '../screens/UnitsScreen';
import SelectedUnit from '../screens/SelectedUnit';
import QrCodeInformation from '../screens/QrCodeInformation';
import { ScannerPage } from '../screens/ScannerPage';
import { ScannerPhoto } from '../screens/ScannerPhoto';

const Stack = createStackNavigator()

export default function AuthenticatedStack() {
  return (
    <Stack.Navigator
      initialRouteName='CondominiumScreen'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="CondominiumScreen"
        component={CondominiumScreen}
      />
      <Stack.Screen
        name="UnitsScreen"
        component={UnitsScreen}
      />
      <Stack.Screen
        name="SelectedUnit"
        component={SelectedUnit}
      />
       <Stack.Screen
        name="QrCodeInformationScreen"
        component={QrCodeInformation}
      />
      <Stack.Screen
        name="ScannerPage"
        component={ScannerPage}
        options={{unmountOnBlur: true}}
      />
      <Stack.Screen
        name="ScannerPhoto"
        component={ScannerPhoto}
        options={{unmountOnBlur: true}}
      />
    </Stack.Navigator>
  )
}
