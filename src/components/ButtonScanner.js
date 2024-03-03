import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Image, View, StyleSheet,Text } from 'react-native';
import { TextComponent } from './TextComponent';
import { useNavigation } from "@react-navigation/native"
import { BarCodeScanner } from 'expo-barcode-scanner';
import qrCodeIcon from  '../assets/icons/qrCodeIcon.png'
import { Camera } from 'expo-camera';

export function ButtonScanner() {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation()


  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }

  useEffect(() => {
    askForCameraPermission()
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {

    const options = { quality: 0.5, base64: true };
    const base64 = await cameraRef.current.takePictureAsync(options);

    setScanned(true);
    console.log(`Type: ${type} Data: ${data} has been scanned!`);
    navigation.navigate('QrCodeInformationScreen',  { url: data, base64} )
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <TextComponent>Solicitando permissão de câmera!</TextComponent>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <TextComponent>Sem acesso de câmera!</TextComponent>
        <TouchableOpacity onPress={() => askForCameraPermission()}>
          <TextComponent>Permitir camera</TextComponent>
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <>
      <TouchableOpacity onPress={() =>navigation.navigate('ScannerPage')}>
        <Image
          source={qrCodeIcon}
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '140%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    flex: 2,
    backgroundColor: '#F1F1F1'
  },
  camera: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  containerActions: {
    width: '100%',
    height: 140,
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom: 24,
  },
  scanAgainButton: {
    padding: 10,
    backgroundColor: '#0CBC8B',
    borderRadius: 5,
  }
});
