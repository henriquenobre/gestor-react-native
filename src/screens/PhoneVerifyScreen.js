import { useState } from 'react';

import backIcon from '../assets/icons/backIcon.png'
import verifyPhone from '../assets/verifyPhone.png'
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableOpacity, Image, TextInput } from "react-native";
import { TextComponent } from "../components/TextComponent";
import { Button } from "../components/Button";

export default function PhoneVerifyScreen({ route, navigation }) {
  const { phoneNumber } = route.params;
  const [pin, setPin] = useState([])
  const [currentInputIndex, setCurrentInputIndex] = useState(0)
  const [isVerifyError, setIsVerifyError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      if (pin.length < 4 || pin.length === 0) {
        alert('O PIN deve ter no mínimo 4 caracteres')
        return
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      alert(
        `CODIGO PIN: ${pin}`
      )
    } catch (error) {
      console.log(error)
      setIsVerifyError(true)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setIsVerifyError(false)
      }, 5000)
    }
  }

  const handleTextChange = (value, index) => {
    setPin(prevPin => {
      const updatedPin = [...prevPin]
      updatedPin[index] = value
      return updatedPin
    })
  }

  const handleBackspacePress = (event, index) => {
    if (event.key === 'Backspace') {
      setPin(prevPin => {
        const updatedPin = [...prevPin]
        updatedPin[index] = ''
        return updatedPin
      })

      if (index > 0) {
        setCurrentInputIndex(index - 1)
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      keyboardVerticalOffset={-200}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('AuthScreen')}>
          <Image
            source={backIcon}
          />
        </TouchableOpacity>
        <TextComponent weight='600' size={20} style={{ fontFamily: 'Inter-SemiBold'}}>
          Verificação
        </TextComponent>
      </View>

      <Image
        style={{ height: 180, width: 200, overflow: 'hidden', marginTop: 36 }}
        source={verifyPhone}
        resizeMode='contain'
      />

      <View style={styles.loginPhone}>
        <TextComponent weight='600' size={20} style={{ fontFamily: 'Inter-SemiBold'}}>
          Login por telefone
        </TextComponent>
        <TextComponent>
          Um código de 4 digitos foi enviado para o telefone:
          {phoneNumber}
        </TextComponent>
      </View>

      <View style={styles.alignPin}>
        <View style={styles.pinContainer}>
          <TextInput
            maxLength={1}
            keyboardType='number-pad'
            style={[
              styles.pinInputStyles,
              isVerifyError && styles.pinInputErrorStyle
            ]}
            onChangeText={value => handleTextChange(value, 0)}
            onKeyPress={event => handleBackspacePress(event, 0)}
            autoFocus={currentInputIndex === 0}
          />
          <TextInput
            maxLength={1}
            keyboardType='number-pad'
            style={[
              styles.pinInputStyles,
              isVerifyError && styles.pinInputErrorStyle
            ]}
            onChangeText={value => handleTextChange(value, 1)}
            onKeyPress={event => handleBackspacePress(event, 1)}
            autoFocus={currentInputIndex === 1}
          />
          <TextInput
            maxLength={1}
            keyboardType='number-pad'
            style={[
              styles.pinInputStyles,
              isVerifyError && styles.pinInputErrorStyle
            ]}
            onChangeText={value => handleTextChange(value, 2)}
            onKeyPress={event => handleBackspacePress(event, 2)}
            autoFocus={currentInputIndex === 2}
          />
          <TextInput
            maxLength={1}
            keyboardType='number-pad'
            style={[
              styles.pinInputStyles,
              isVerifyError && styles.pinInputErrorStyle
            ]}
            onChangeText={value => handleTextChange(value, 3)}
            onKeyPress={event => handleBackspacePress(event, 3)}
            autoFocus={currentInputIndex === 3}
          />
        </View>
        {isVerifyError && (
          <TextComponent color='#D70000' style={{ fontFamily: 'Inter-SemiBold'}}>
            Código inválido. Tente novamente!
          </TextComponent>
        )}
      </View>

      <Button
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={pin.length === 0 || isLoading}
      >
        <TextComponent color='#FFF'>
          Verificar
        </TextComponent>
      </Button>

      <TouchableOpacity style={{ marginTop: 36 }}>
        <TextComponent color='#000'>
        Reenviar Código
        </TextComponent>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    backgroundColor: '#FFFFFF'
  },
  header: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 96
  },
  loginPhone: {
    marginVertical: 36,
    width: '100%',
    gap: 6
  },
  alignPin: {
    flexDirection: "column",
    marginBottom: 36
  },
  pinContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'flex-start',
  },
  pinInputStyles: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#EDEDED",
    fontSize: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  pinInputErrorStyle: {
    backgroundColor: '#E5C0C0'
  }
})
