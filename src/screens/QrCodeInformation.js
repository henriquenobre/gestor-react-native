import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import closeIcon from '../assets/icons/closeIcon.png'
import { StyleSheet, Platform, StatusBar, View, KeyboardAvoidingView, TouchableOpacity, Image, TextInput } from "react-native";
import { TextComponent } from "../components/TextComponent";
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { ScrollView } from 'react-native';
import CustomModalValidity from '../components/CustomModalValidity';
import TableQrcode from '../services/sqlite/TableQrcode';
import TableUnits from '../services/sqlite/TableUnits';
import TableCondominium from '../services/sqlite/TableCondominium';
import TableValidity from '../services/sqlite/TableValidity';
import TableCompany from '../services/sqlite/TableCompany';
import TableReadQrcode from '../services/sqlite/TableReadQrcode';
import useAuth from '../hooks/useAuth';
import { ActivityIndicator } from 'react-native';

const isAndroid = Platform.OS === "Android"

export default function QrCodeInformation({ route }) {
  const navigation = useNavigation()
  const { setScanned, imageBase64, loadingImage } = useAuth()
  const { url } = route.params;
  const [unit, setUnit] = useState();
  const [condominium, setCondominium] = useState();
  const [validity, setValidity] = useState()
  const [company, setCompany] = useState()
  const [register, setRegister] = useState()
  const [isValid, setIsValid] = useState(false)
  const [isSend, setIsSend] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    TableQrcode.find(url).then((data) => {
      if (data.read === '1') {
        setIsSend(true)
      }
      TableUnits.findByQrCode(data.unit_id, data.validity_id).then(unit => {
        setUnit(unit);
      })
      TableCondominium.find(data.condominium_id).then(cond => {
        setCondominium(cond)
      })
      TableValidity.findById(data.validity_id).then(val => {
        setValidity(val)
      })
      TableCompany.findById(data.company_id).then(comp => {
        setCompany(comp.company_name)
      })
    }).catch(() => setIsValid(true))

  }, [])

  const sendRegister = async () => {
    if (register && !loadingImage) {
      setLoading(true)
      await TableUnits.update({
        status: 1,
        reading: Number(register),
        id: Number(unit?.id),
        validity_id: validity.id
      })
      await TableReadQrcode.create({
        unit_id: Number(unit?.id),
        reading: Number(register),
        image_filename: "file.png",
        image: imageBase64.base64,
        send: 0,
        validity_id: validity.id
      }).then(() => {
        setLoading(false)
        setScanned(false)
        navigation.navigate('ScannerPage')
      })
    }
  }

  return (
    <View style={{ backgroundColor: '#FFFFFF', height: '100%' }}>
      <KeyboardAvoidingView behavior="height">
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerCloseButton}
                onPress={() => navigation.navigate('CondominiumScreen')}
              >
                <Image
                  source={closeIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              {
                imageBase64 && !loadingImage ?
                  <Image style={{ width: 330, height: 220 }} source={{ uri: imageBase64.uri }} />
                  :
                  <View style={{ display: 'flex', alignItems: 'center', width: 330, height: 220 }}>
                    <ActivityIndicator size='large' style={{ width: 180, height: 180 }} />
                  </View>
              }

              <View style={styles.filterCard}>
                <View style={styles.filterCardInfo}>
                  <TextComponent weight='700' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                    {condominium?.corporate_name}
                  </TextComponent>

                  <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                    Unidade: {unit?.name}  Bloco: {unit?.block}
                  </TextComponent>
                  <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                    Vigência: {validity?.name}
                  </TextComponent>
                  <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                    {company}
                  </TextComponent>
                  <KeyboardAvoidingView style={{ display: 'flex', flexDirection: 'row', gap: 10 }} behavior="padding">
                    <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                      Registro:
                    </TextComponent>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: register ? 'black' : 'red',
                        width: '75%'
                      }}
                      keyboardType='numeric'
                      onChangeText={item => setRegister(item)}
                      value={register}
                    />
                  </KeyboardAvoidingView>
                </View>
              </View>
              <View style={{ width: '100%', marginTop: 80 }}>
                <Button disabled={loading} onClick={sendRegister}>
                  <TextComponent color="#FFF" weight='600' size={14} style={{ fontFamily: 'Inter-SemiBold' }}>
                    Registrar Leitura
                  </TextComponent>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomModalValidity text='A unidade informada, via QrCode, não consta na sua base de dados, entre em contato com a Área administrativa.' visible={isValid} onConfirm={() => navigation.navigate('CondominiumScreen')} />
      <CustomModalValidity text='A unidade informada já foi lida previamente e enviada, não é possível uma nova leitura.' visible={isSend} onConfirm={() => navigation.navigate('CondominiumScreen')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isAndroid ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 24
  },
  headerCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    width: '100%',
  },
  cameraStyle: {
    backgroundColor: '#D9D9D9',
    width: 330,
    height: 220,
  },
  filterCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  filterCardInfo: {
    gap: 6
  },
  nextButton: {
    marginBottom: 50,
    padding: 10,
    backgroundColor: '#0CBC8B',
    borderRadius: 5,
  }
})
