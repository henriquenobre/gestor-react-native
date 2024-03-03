import React, { useState, useEffect, useRef } from 'react';
import { Camera } from "expo-camera"
import { TouchableOpacity, View, StyleSheet, Dimensions, Image, Text } from 'react-native';
import { TextComponent } from "../components/TextComponent"
import { useNavigation } from "@react-navigation/native"
import { BarCodeScanner } from 'expo-barcode-scanner';
import useAuth from '../hooks/useAuth';

export const ScannerPage = () => {
  const navigation = useNavigation()
  const [hasPermission, setHasPermission] = useState(null);
  const {scanned, setScanned, setImageBase64, setLoadingImage} = useAuth()
  const [cameraKey, setCameraKey] = useState();
  const cameraRef = useRef(null);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }

  useEffect(() => {
    askForCameraPermission()
    setCameraKey(Date.now())
    setScanned(false);
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setLoadingImage(true)
    navigation.navigate('QrCodeInformationScreen', { url: data })
    const options = { quality: 0.2, base64: true };
    const base64 = await cameraRef.current.takePictureAsync(options);
    setScanned(true);
    setImageBase64(base64);
    setCameraKey(Date.now())
    setLoadingImage(false)
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
      <View style={styles.container}>
        <Camera
          key={cameraKey}
          ref={cameraRef}
          style={styles.camera}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      </View>
      <View style={styles.rectangleContainer}>
        <View style={styles.rectangle}>
          <View style={styles.rectangleColor} />
          <View style={styles.topLeft} />
          <View style={styles.topRight} />
          <View style={styles.bottomLeft} />
          <View style={styles.bottomRight} />
        </View>
      </View>
      <View style={styles.containerActions}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%'
          }}
        >
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => {
            setScanned(false)
          }}>
            <TextComponent color='#fff' weight='bold' size={16}>
              Escanear Novamente
            </TextComponent>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => navigation.navigate('CondominiumScreen')}>
            <TextComponent color='#fff' weight='bold' size={16}>
              Cancelar
            </TextComponent>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const deviceHeight = Dimensions.get("window").height;

const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    position: 'absolute',
    backgroundColor: '#F1F1F1'
  },
  camera: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  containerSquare: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top: '25%'
  },
  containerActions: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10
  },
  scanAgainButton: {
    padding: 10,
    backgroundColor: '#0CBC8B',
    borderRadius: 5,
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: '100%',
  },
  rectangle: {
    borderLeftColor: 'rgba(0, 0, 0, .6)',
    borderRightColor: 'rgba(0, 0, 0, .6)',
    borderTopColor: 'rgba(0, 0, 0, .6)',
    borderBottomColor: 'rgba(0, 0, 0, .6)',
    borderLeftWidth: deviceWidth / 5,
    borderRightWidth: deviceWidth / 5,
    borderTopWidth: deviceHeight / 3,
    borderBottomWidth: deviceHeight / 2
  },
  rectangleColor: {
    height: 250,
    width: 250,
    backgroundColor: 'transparent',
  },
  topLeft: {
    width: 50,
    height: 50,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    position: 'absolute',
    left: -1,
    top: -1,
    borderLeftColor: 'white',
    borderTopColor: 'white'
  },
  topRight: {
    width: 50,
    height: 50,
    borderTopWidth: 2,
    borderRightWidth: 2,
    position: 'absolute',
    right: -1,
    top: -1,
    borderRightColor: 'white',
    borderTopColor: 'white'
  },
  bottomLeft: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    position: 'absolute',
    left: -1,
    bottom: -1,
    borderLeftColor: 'white',
    borderBottomColor: 'white'
  },
  bottomRight: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    position: 'absolute',
    right: -1,
    bottom: -1,
    borderRightColor: 'white',
    borderBottomColor: 'white'
  }
});
