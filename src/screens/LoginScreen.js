import { SafeAreaView, View, StyleSheet, Image } from "react-native";
import { TextComponent } from "../components/TextComponent";
import { Button } from '../components/Button';
import Swiper from 'react-native-swiper'

import loginScreenPass1 from '../assets/loginScreenPass1.png'
import loginScreenPass2 from '../assets/loginScreenPass2.png'
import loginScreenPass3 from '../assets/loginScreenPass3.png'
import logoSmallGestor from '../assets/logoSmallGestor.png'

export default function LoginScreen({ navigation }) {
  const handleLogin = () => {
    navigation.navigate('AuthScreen')
  }

  const handleRegister = () => {
    alert('Funcionalidade em manutenção!')
  }

  return (
    <>
      <Swiper
        showsPagination
        dotStyle={styles.paginationDot}
        activeDotStyle={styles.activePaginationDot}
        loop={false}
      >
        <SafeAreaView style={styles.container}>
          <Image
            style={{ height: 250, width: 250, overflow: 'hidden' }}
            source={loginScreenPass1}
            resizeMode='contain'
          />

          <View style={{ marginBottom: 50, paddingHorizontal: 47 }}>
            <TextComponent weight='bold' size={28} style={{ fontFamily: 'Montserrat-Regular'}}>
              OLA!
            </TextComponent>
            <TextComponent weight='400' size={15} style={{ fontFamily: 'Montserrat-Regular'}}>
              Seja bem vindo ao Gestor, uma forma simples de executar a gestão do seu condomínio
            </TextComponent>
          </View>
        </SafeAreaView>

        <SafeAreaView style={styles.container}>
          <Image
            style={{ height: 230, width: 250, overflow: 'hidden' }}
            source={loginScreenPass2}
            resizeMode='contain'
          />

          <View style={{ marginTop: 10, paddingHorizontal: 47 }}>
            <TextComponent weight='400' size={15} style={{ fontFamily: 'Montserrat-Regular'}}>
              Aqui você facilmente poderá fazer sua leitura de registros de água, luz e gás e trazer resultados de uma forma simples e rápida
            </TextComponent>
          </View>
        </SafeAreaView>

        <SafeAreaView style={styles.container}>
          <Image
            style={{ height: 250, width: 250, overflow: 'hidden' }}
            source={loginScreenPass3}
            resizeMode='contain'
          />

          <View style={{ marginTop: 10, paddingHorizontal: 47 }}>
            <TextComponent weight='400' size={15} style={{ fontFamily: 'Montserrat-Regular'}}>
              Alias não esqueça de nos avaliar na sua loja de aplicativos.
            </TextComponent>
          </View>
        </SafeAreaView>
      </Swiper>

      <SafeAreaView style={styles.content}>
        <Button
          onClick={handleLogin}
          isLogin
        >
          <TextComponent
            color='#000000'
          >
            Login
          </TextComponent>
        </Button>

        <Button
          onClick={handleRegister}
          isRegister
        >
          <TextComponent
            color='#DEE8F5'
          >
            Criar uma conta
          </TextComponent>
        </Button>

        <Image
          style={{ height: 45, width: 45, overflow: 'hidden' }}
          source={logoSmallGestor}
          resizeMode='contain'
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0CBC8B',
    paddingHorizontal: 34,
    paddingVertical: 34,
    gap: 20
  },
  paginationDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activePaginationDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
})
