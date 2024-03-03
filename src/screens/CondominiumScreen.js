import { useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
import alertIcon from '../assets/icons/alertIcon.png'
import locationIcon from '../assets/icons/locationIcon.png'
import searchIcon from '../assets/icons/searchIcon.png'
import { SafeAreaView, ActivityIndicator, Image, FlatList, StyleSheet, View, TouchableOpacity, Platform, StatusBar, TextInput } from "react-native";
import { TextComponent } from "../components/TextComponent";
import { ButtonScanner } from '../components/ButtonScanner'
import iconBack from '../assets/icons/iconBack.png'
import iconReload from '../assets/icons/iconReload.png'
import CustomModal from '../components/CustomModal'
import splash from '../../assets/splash.png'
import useAuth from '../hooks/useAuth'
import TableCondominium from '../services/sqlite/TableCondominium'
import TableCompany from '../services/sqlite/TableCompany'
import TableValidity from '../services/sqlite/TableValidity'
import TableUnits from '../services/sqlite/TableUnits'
import TableQrcode from '../services/sqlite/TableQrcode'
import TableReadQrcode from '../services/sqlite/TableReadQrcode'
import moment from 'moment'

const isAndroid = Platform.OS === 'android'

export default function CondominiumScreen({ navigation }) {
  const [condominium, setCondominium] = useState([])
  const [searchCondominium, setSearchCondominium] = useState('')
  const [filterInputIsVisible, setFilterInputIsVisible] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalSyncIsOpen, setModalSyncIsOpen] = useState(false)
  const [sincyng, setSincyng] = useState(false)
  const { logout } = useAuth()


  const filteredCondominium = useMemo(() => {
    return condominium.filter((condominium) => condominium.corporate_name.toLowerCase().includes(searchCondominium.toLowerCase()))
  }, [condominium, searchCondominium])

  useEffect(() => {
    const getData = async () => {
      await TableCondominium.all()
        .then(
          condominiuns => {
            setCondominium(condominiuns)
            condominiuns.length === 0 && setModalSyncIsOpen(true)
          }
        )
    }
    getData()
    //Expira dados do banco de dados 24 horas
    TableCondominium.all().then(data=>{
      const dateLast = data[0].date
      const diff = moment().diff(dateLast)
      const diffHours = moment.duration(diff).asHours();
      if (diffHours > 24) {
        TableCondominium.deleteTable()
        getData()
      }
    })
  }, [])



  const onPressSync = async () => {
    setSincyng(true)
    setModalSyncIsOpen(false)

    TableReadQrcode.deleteSend()
    await TableReadQrcode.find(0).then(data => {
      data.forEach(async (item) => {
        try {
          await api.put(`/hydrometer_reading/unit/${item.validity_id}`, {
            unit_id: item.unit_id,
            reading: item.reading,
            image_filename: item.image_filename,
            image: item.image
          }).then((res) => {
            TableReadQrcode.update(1, item.unit_id, item.validity_id)
          })
        } catch (error) {
          console.log(error);
        }
      })
    }).catch((error) => {
      setTimeout(() => {
        setSincyng(false);
      }, 6000)
    })

    TableCondominium.deleteTable()
    const resCondominium = await api.get('sync/condominium')
    const dateMoment = moment().format('YYYY-MM-DD HH:mm:ss')
    resCondominium.data.map(item => {
      TableCondominium.create({
        id: item.id,
        corporate_name: item.corporate_name,
        unit_size: item.unit_size,
        block_size: item.block_size,
        address: item.address.address,
        number: item.address.number,
        city: item.address.city,
        uf: item.address.UF,
        date: dateMoment
      })
    })

    TableCompany.deleteTable()
    const resCompany = await api.get('sync/company')
    resCompany.data.map(item => {
      TableCompany.create({
        id: item.company_id,
        company_name: item.company_name,
        condominium_id: item.condominium_id,
      })
    })

    TableValidity.deleteTable()
    const resValidity = await api.get('sync/validity')
    resValidity.data.map(item => {
      TableValidity.create({
        id: item.id,
        name: item.name,
        company_id: item.company_id,
        condominium_id: item.condominium_id,
        percentage: item.percentage
      })
    })

    TableUnits.deleteTable()
    const resUnity = await api.get('sync/unit')
    resUnity.data.map(item => {
      TableUnits.create({
        id: item.unit_id,
        name: item.unit,
        block: item.block,
        status: item.status,
        reading: item.reading,
        validity_id: item.validity_id,
        image_url: item.image_url
      })
    })

    TableQrcode.deleteTable()
    const resQrcode = await api.get('sync/qrcode')
    resQrcode.data.map(item => {
      TableQrcode.create({
        unit_id: item.unit_id,
        qrcode: item.qrcode,
        condominium_id: item.condominium_id,
        company_id: item.company_id,
        company_type: item.company_type,
        validity_id: item.validity_id,
        read: item.read
      })
    })

    await TableCondominium.all().then(condominiuns => setCondominium(condominiuns))


    setTimeout(() => {
      setSincyng(false);
    }, 6000)
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.header}>
        <TextComponent weight='700' size={28} style={{ fontFamily: 'NunitoSans-Bold' }}>
          Condomínios
        </TextComponent>
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterInputIsVisible((prevState) => !prevState)}
          >
            <Image source={searchIcon} />
            <TextComponent color="#0CBC8B" weight='700' size={13} style={{ fontFamily: 'NunitoSans-Bold' }}>
              Filtrar
            </TextComponent>


          </TouchableOpacity>
        </View>
      </View>

      {filterInputIsVisible && (
        <TextInput
          value={searchCondominium}
          onChangeText={(value) => setSearchCondominium(value)}
          placeholder="Procurar condominio"
          placeholderTextColor="#000"
          style={styles.filteredInputContainer}
        />
      )}

      {filteredCondominium.length <= 0 && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: 200, gap: 10 }}>
          <Image
            style={{ width: 50, height: 50 }}
            source={alertIcon}
            resizeMode='contain'
          />
          <TextComponent weight='500' size={16}>
            Nenhum condomínio foi encontrado!
          </TextComponent>
        </View>
      )}

      {filteredCondominium.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredCondominium}
          contentContainerStyle={{ paddingVertical: 12 }}
          style={{ marginVertical: 10, width: '100%' }}
          keyExtractor={condominium => condominium.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item: condominium }) => (
            <TouchableOpacity
              style={styles.cardCondominium}
              onPress={() => navigation.navigate('UnitsScreen', { selectedCondominium: condominium })}
            >
              <View style={styles.cardInfo}>
                <Image style={styles.cardCondominiumImage} />
                <View
                  style={styles.cardCondominiumInfo}
                >
                  <TextComponent weight='700' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                    {condominium.corporate_name}
                  </TextComponent>
                  <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                    Unidades: {condominium.unit_size}    Blocos: {condominium.block_size}
                  </TextComponent>
                  <View style={styles.cardCondominiumInfoDetails}>
                    <Image
                      source={locationIcon}
                      style={{ marginRight: 6 }}
                    />
                    <TextComponent color="#6F6F6F" weight='400' size={13} style={{ fontFamily: 'NunitoSans-Bold' }}>
                      {condominium.address} {condominium.number} - {condominium.city} - {condominium.uf}
                    </TextComponent>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={styles.qrCodeButton}>
        <ButtonScanner />
      </View>
      <View style={styles.containerActions}>
        <TouchableOpacity onPress={() => setModalIsOpen(true)}>
          <Image source={iconBack} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressSync()}>
          <Image source={iconReload} />
        </TouchableOpacity>
      </View>
      <CustomModal visible={modalIsOpen} onClose={() => setModalIsOpen(false)} onConfirm={() => logout()} />
      <CustomModal
        visible={modalSyncIsOpen}
        onClose={() => setModalSyncIsOpen(false)}
        onConfirm={() => onPressSync()}
        text='Sua carga de dados está expirada, favor sincronizar os seus dados. Deseja executar agora?'
      />
      {sincyng && (
        <View style={styles.containerLoading}>
          <Image
            source={splash}
            style={styles.image}
          />
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color="gray" />
            <TextComponent>Sincronizando...</TextComponent>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 1.5,
    backgroundColor: 'gray',
    opacity: 0.2,
    marginVertical: 24
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  header: {
    marginTop: isAndroid ? StatusBar.currentHeight : 0,
    width: '110%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 2,
    borderColor: '#DCDEE8',
  },
  filteredInputContainer: {
    width: '100%',
    height: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#EDEDED',
    paddingHorizontal: 16
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderColor: '#DCDEE8',
  },
  cardCondominium: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'flex-start',
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 16
  },
  cardCondominiumImage: {
    width: 64,
    height: 64,
    borderRadius: 100,
    backgroundColor: '#D9D9D9'
  },
  cardCondominiumInfo: {
    gap: 8
  },
  cardCondominiumInfoDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 200
  },
  qrCodeButton: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#0CBC8B',
    borderRadius: 100,
    padding: 20,
    borderWidth: 10,
    borderColor: '#fff',
    marginBottom: -40
  },
  containerActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0CBC8B',
    height: 61,
    width: '120%',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 15
  },
  containerLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: 100, // Ajuste o valor para centralizar verticalmente
    marginLeft: -50, // Ajuste o valor para centralizar horizontalmente
  },
})
