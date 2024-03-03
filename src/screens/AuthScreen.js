import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import googleIcon from '../assets/icons/googleIcon.png'
import brasilIcon from '../assets/icons/brazilIcon.png'
import emailIcon from '../assets/icons/emailIcon.png'
import passwordIcon from '../assets/icons/passwordIcon.png'
import { StyleSheet, Platform, KeyboardAvoidingView, View, TextInput, Image, TouchableOpacity } from "react-native"
import { TextComponent } from '../components/TextComponent'
import { TextInputMask } from 'react-native-masked-text'
import { Button } from '../components/Button'

export default function AuthScreen({ navigation }) {
  const { signIn } = useAuth()
  const [loginType, setLoginType] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorEmail, setErrorEmail] = useState(false)
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  const handleLoginType = () => {
    setLoginType((prevState) => !prevState)
  }

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 1000));

      let credentials = {
        mail,
        password
      };

      await signIn(credentials);
    } catch (error) {
      console.log(error)
      setErrorEmail(true)
    } finally {
      setIsLoading(false)
      setMail('')
      setPassword('')
      setTimeout(() => {
        setErrorEmail(false)
      }, 5000)
    }
  };

  const handleLoginWithPhone = async () => {
    try {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 1000));

      let credentials = {
        phone
      };

      alert('Funcionalidade em manutenção!')
      // alert(JSON.stringify(credentials));


      // navigation.navigate('PhoneVerifyScreen', { phoneNumber: phone });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setPhone('')
    }
  }

  const handleGoogleLogin = () => {
    alert('Funcionalidade em manutenção!')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      keyboardVerticalOffset={-200}
    >
      <View style={{ marginTop: 50, gap: 10 }}>
        <TextComponent weight='600' size={20} style={{ fontFamily: 'Inter-SemiBold'}}>
          Login
        </TextComponent>
        <TextComponent weight='600' size={14} style={{ fontFamily: 'Inter-SemiBold'}}>
          Olá, bem vindo(a) de volta a sua conta
        </TextComponent>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLoginType}
          style={[
            styles.buttonStyle,
            !loginType && styles.selectedButtonStyle
          ]}
        >
          <TextComponent weight='600' size={14} style={{ fontFamily: 'Inter-SemiBold'}}>
            Número de telefone
          </TextComponent>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLoginType}
          style={[
            styles.buttonStyle,
            loginType && styles.selectedButtonStyle
          ]}
        >
          <TextComponent weight='600' size={14} style={{ fontFamily: 'Inter-SemiBold'}}>
            Email
          </TextComponent>
        </TouchableOpacity>
      </View>

      {loginType && (
        <View style={styles.inputsLogin}>
          <View style={styles.inputContainer}>
            <Image
              source={emailIcon}
              style={{ marginRight: 36 }}
            />
            <TextInput
              value={mail}
              onChangeText={(value) => setMail(value)}
              placeholder="Email"
              placeholderTextColor="#000"
              keyboardType='email-address'
              style={{ width: '80%', padding: 5 }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Image
              source={passwordIcon}
              style={{ marginRight: 36 }}
            />
            <TextInput
              value={password}
              onChangeText={(value) => setPassword(value)}
              placeholder="Senha"
              placeholderTextColor="#000"
              secureTextEntry
              style={{ width: '80%', padding: 5 }}
            />
          </View>
          {errorEmail && (
            <TextComponent color='#D70000' style={{ fontFamily: 'Inter-SemiBold'}}>
              Usuário ou Email inválido. Tente novamente!
            </TextComponent>
          )}

          <Button
            onClick={handleLogin}
            isLoading={isLoading}
            disabled={mail.length === 0 || password.length === 0 || isLoading}
          >
            <TextComponent color="#FFF" weight='600' size={14} style={{ fontFamily: 'Inter-SemiBold'}}>
              Login
            </TextComponent>
          </Button>
        </View>
      )}

      {!loginType && (
        <View style={styles.inputsLogin}>
          <View style={styles.inputContainer}>
            <Image
              source={brasilIcon}
              style={{ marginRight: 36 }}
            />
            <TextInputMask
              type={'custom'}
              options={{
                mask: '(99) 99999-9999'
              }}
              value={phone}
              onChangeText={(value) => setPhone(value)}
              maxLength={15}
              placeholder="Número de Telefone"
              placeholderTextColor="#000"
              keyboardType='number-pad'
              style={{ width: '80%', padding: 5 }}
            />
          </View>

          <Button
            onClick={handleLoginWithPhone}
            isLoading={isLoading}
            disabled={phone.length <= 14 || isLoading}
          >
            <TextComponent color="#FFF" weight='600' size={14} style={{ fontFamily: 'Inter-SemiBold'}}>
              Entrar
            </TextComponent>
          </Button>
        </View>
      )}

      <View style={styles.footerDivider}>
        <View style={styles.separator} />
        <TextComponent weight='600' size={14} style={{ fontFamily: 'Inter-SemiBold'}}>
          ou
        </TextComponent>
        <View style={styles.separator} />
      </View>

      <TouchableOpacity
        onPress={handleGoogleLogin}
        style={styles.googleButton}
      >
        <Image
          source={googleIcon}
          style={{ position: 'absolute', left: 35 }}
        />
        <TextComponent
          weight='600'
          size={14}
          style={{ fontFamily: 'Inter-SemiBold'}}
        >
          Login com google
        </TextComponent>
      </TouchableOpacity>

      <View style={styles.createAccount}>
        <TextComponent color='#979797' size={14} style={{ fontFamily: 'Inter-SemiBold'}}>Não é registrado ainda?</TextComponent>
        <TouchableOpacity>
          <TextComponent color='#0CBC8B'>Crie uma conta</TextComponent>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 15,
    padding: 6.5
  },
  buttonStyle: {
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 15,
  },
  selectedButtonStyle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    elevation: 5,
  },
  inputsLogin: {
    flex: 1,
    marginTop: 30,
    gap: 15
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#979797',
  },
  footerDivider: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
    gap: 20
  },
  separator: {
    width: '40%',
    height: 1,
    backgroundColor: '#979797',
  },
  googleButton: {
    marginTop: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    elevation: 5,
    paddingHorizontal: 35,
    paddingVertical: 20
  },
  createAccount: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    gap: 5
  }
});
