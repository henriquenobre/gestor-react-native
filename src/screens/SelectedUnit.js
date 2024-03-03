import closeIcon from '../assets/icons/closeIcon.png'
import { StyleSheet, Platform, StatusBar, View, SafeAreaView, TouchableOpacity, Image, TextInput } from "react-native";
import { TextComponent } from "../components/TextComponent";
import { Button } from '../components/Button';
import { KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native';
import icomCamera from '../assets/icons/iconCamera.png'
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import TableReadQrcode from '../services/sqlite/TableReadQrcode';

const isAndroid = Platform.OS === "Android"

export default function SelectedUnit({
  navigation,
  route
}) {
  const { condominium, selectedUnit, selectedCompany } = route.params
  const { selectedValidityName } = useAuth()
  const [register, setRegister] = useState()
  const [imageDataBase, setImageDataBase] = useState()

  useEffect(() => {
    console.log(selectedCompany);

    TableReadQrcode.findById(selectedUnit.id, selectedUnit.validity_id).then(data => {
      setImageDataBase(data.image)
    })
  }, [])


  return (
    <View style={{ backgroundColor: '#FFFFFF', height: '100%' }}>
      <KeyboardAvoidingView behavior="height">
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerCloseButton}
                onPress={() => navigation.goBack()}
              >
                <Image
                  source={closeIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <TouchableOpacity onPress={() => navigation.navigate('ScannerPhoto', { selectedUnit })}>
                <View style={styles.cameraStyle}>
                  {imageDataBase ?
                    <Image style={{ width: 330, height: 220, }} source={{ uri: `data:image/jpeg;base64,${imageDataBase}` }} />
                    :
                    selectedUnit.image_url ?
                      <Image style={{ width: 330, height: 220, }} source={{ uri: `${selectedUnit.image_url}` }} />
                      :
                      <Image source={icomCamera} />
                  }
                </View>
              </TouchableOpacity>

              <View style={styles.filterCard}>
                <View style={styles.filterCardInfo}>
                  <TextComponent weight='700' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                    {condominium.fantasy_name}
                  </TextComponent>

                  <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                    Unidade: {selectedUnit.name}  Bloco: {selectedUnit.block}
                  </TextComponent>

                  <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                    Vigência: {selectedValidityName}
                  </TextComponent>

                  <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                    {selectedCompany.company_name}
                  </TextComponent>
                  <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }} behavior="padding">
                    <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                      Registro:
                    </TextComponent>
                    {selectedUnit.reading ?
                      <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                        {selectedUnit.reading}
                      </TextComponent>
                      :
                      <TextInput
                        style={{
                          borderWidth: 1,
                          width: '75%'
                        }}
                        keyboardType='numeric'
                        onChangeText={item => setRegister(item)}
                        value={register}
                      />
                    }
                  </View>
                </View>
              </View>
              <View style={{ width: '100%', marginTop: 80 }}>
                <Button onClick={() => navigation.navigate('ScannerPhoto', { selectedUnit })}>
                  <TextComponent color="#FFF" weight='600' size={14} style={{ fontFamily: 'Inter-SemiBold' }}>
                    Registrar Leitura
                  </TextComponent>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    height: '100%',
  },
  cameraStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
