import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './src/context/userAuth';

import Routes from './src/routes';

export default function App() {
  const [isFontsLoaded] = useFonts({
    'Montserrat-Regular': require('./src/assets/fonts/Montserrat-Regular.otf'),
    'Inter-SemiBold': require('./src/assets/fonts/Inter-SemiBold.otf'),
    'NunitoSans-Bold': require('./src/assets/fonts/NunitoSans-Bold.otf')
  })

  if (!isFontsLoaded) {
    return null
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar translucent backgroundColor='transparent' />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
