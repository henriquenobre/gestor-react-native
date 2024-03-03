import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'
import iconBack from '../assets/icons/iconBack.png'
import iconReload from '../assets/icons/iconReload.png'
import okIcon from '../assets/icons/okIcon.png';
import splash from '../../assets/splash.png'
import errorIcon from '../assets/icons/errorIcon.png';
import { SafeAreaView, Image, FlatList, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { TextComponent } from "../components/TextComponent";
import { ButtonScanner } from '../components/ButtonScanner'
import CircularProgress from '../components/CircularProgress';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown'
import useAuth from '../hooks/useAuth';
import { ActivityIndicator } from 'react-native';
import TableValidity from '../services/sqlite/TableValidity';
import TableCompany from '../services/sqlite/TableCompany';
import TableUnits from '../services/sqlite/TableUnits';

export default function UnitsScreen({
  navigation,
  route,
}) {
  const { selectedCondominium } = route.params
  const [units, setUnits] = useState([])
  const [filteredUnits, setFilteredUnits] = useState([])
  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState()
  const [selectedCompanyName, setSelectedCompanyName] = useState('')
  const [selectedValidity, setSelectedValidity] = useState()
  const { selectedValidityName, setSelectedValidityName } = useAuth()
  const [sincyng, setSincyng] = useState(false)
  const [loading, setLoading] = useState(false)
  const [percentage, setPercentage] = useState()
  const dropdownRef = useRef({});

  const getValidity = async () => {
    TableValidity.find(selectedCondominium?.id, selectedCompany?.id).then(data => {
      if (data) {
        setSelectedValidity(data[0])
        setSelectedValidityName(data[0].name)
      }
    })

    dropdownRef.current.reset()
  }

  const getUnits = async () => {
    setLoading(true)
    TableUnits.find(selectedValidity.id).then(data => {
      setUnits(data)
      setFilteredUnits(data)
      setLoading(false)
      const registerStatusPercentage = data.filter(registro => registro.status === 1);
      setPercentage((registerStatusPercentage.length / data.length) * 100)
    })
  }

  useEffect(() => {
    TableCompany.find(selectedCondominium.id).then(data => {
      setCompanies(data)
      if (data) {
        setSelectedCompany(data[0])
        setSelectedCompanyName(data[0].company_name)
      }
    })
    setPercentage(0)
  }, [])

  useEffect(() => {
    if (selectedCompany) {
      getValidity()
    }
  }, [selectedCompany])

  useEffect(() => {
    if (selectedValidity) {
      getUnits()
    } else {
      setUnits([])
      setFilteredUnits([])
    }
  }, [selectedValidity])

  const onPressSync = () => {
    setSincyng(true)
    setTimeout(() => {
      setSincyng(false);
    }, 2000);
  }

  onSelectFilter = (item) => {
    if (item === 'Lidas') {
      setFilteredUnits(units.filter(objeto => objeto.status === 1))
    }
    if (item === 'Pendentes') {
      setFilteredUnits(units.filter(objeto => objeto.status === 0))
    }
    if (item === 'Todas') {
      setFilteredUnits(units)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHeader}>
        <TextComponent weight='700' size={28} style={{ fontFamily: 'NunitoSans-Bold' }}>
          {selectedCondominium.corporate_name}
        </TextComponent>
        <View style={styles.containerRow}>
          <Text style={{ width: '80%' }}>
            {`${selectedCondominium?.address},${selectedCondominium?.number}
${selectedCondominium?.city} - ${selectedCondominium?.uf}`}
          </Text>
          <View>
            <CircularProgress progress={percentage ? Math.ceil(percentage) : 0} />
          </View>
        </View>
        <View style={styles.containerRow}>
          <View style={{ width: '80%' }}>
            <SelectDropdown
              data={companies.map(item => item.company_name)}
              defaultValue={selectedCompanyName}
              onSelect={(item) => {
                setSelectedCompanyName(item)
                setSelectedCompany(companies.find(company => company.company_name === item))
              }}
              buttonStyle={styles.select}
              buttonTextStyle={{ textAlign: 'left', marginHorizontal: 0, fontSize: 14 }}
              defaultButtonText={'Prestadores de Serviços'}
              renderDropdownIcon={isOpened => {
                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'black'} size={14} />;
              }}
            />
          </View>
          <Text style={{ fontSize: 18 }}>
            {selectedValidityName}
          </Text>
        </View>
        <View style={{ display: 'flex', width: '95%' }}>
          <SelectDropdown
            data={['Todas', 'Pendentes', 'Lidas']}
            defaultValue={'Todas'}
            ref={dropdownRef}
            onSelect={(item) => {
              onSelectFilter(item)
            }}
            buttonStyle={styles.selectStatus}
            buttonTextStyle={{ textAlign: 'left', marginHorizontal: 0, fontSize: 14, width: '100%' }}
            defaultButtonText={'Selecione o Status'}
            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'black'} size={14} />;
            }}
          />
        </View>
      </View>
      {loading ?
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredUnits}
          contentContainerStyle={{ paddingVertical: 12 }}
          style={{ marginVertical: 1, width: '100%' }}
          keyExtractor={unit => unit.unit}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item: unit }) => (
            <TouchableOpacity
              style={styles.filterCard}
              onPress={() => navigation.navigate('SelectedUnit', {
                condominium: selectedCondominium,
                selectedUnit: unit,
                selectedCompany: selectedCompany
              })}
            >
              <ActivityIndicator size="large" color="gray" />

            </TouchableOpacity>
          )}
        />
        :
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredUnits}
          contentContainerStyle={{ paddingVertical: 12 }}
          style={{ marginVertical: 1, width: '100%' }}
          keyExtractor={unit => unit.unit}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item: unit }) => (
            <TouchableOpacity
              style={styles.filterCard}
              onPress={() => navigation.navigate('SelectedUnit', {
                condominium: selectedCondominium,
                selectedUnit: unit,
                selectedCompany: selectedCompany
              })}
            >
              {unit.status === 1 ? (
                <Image
                  source={okIcon}
                />
              ) : (
                <Image
                  source={errorIcon}
                />
              )}
              <View style={styles.filterCardInfo}>
                <TextComponent weight='700' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                  Unidade: {unit?.name}
                </TextComponent>
                <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold' }}>
                  Leitura: {unit?.reading}
                </TextComponent>
              </View>

            </TouchableOpacity>
          )}
        />
      }
      <View style={styles.qrCodeButton}>
        <ButtonScanner />
      </View>
      <View style={styles.containerActions}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={iconBack} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressSync()} style={{ display: 'none' }}>
          <Image source={iconReload} />
        </TouchableOpacity>
      </View>
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
  containerHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '110%',
    paddingTop: 30,
    borderBottomWidth: 2,
    borderColor: '#DCDEE8',
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 16,

  },
  containerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '95%'
  },
  headerCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1'
  },
  filterCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterCardInfo: {
    gap: 6
  },
  separator: {
    width: '100%',
    height: 1.5,
    backgroundColor: 'gray',
    opacity: 0.2,
    marginVertical: 24
  },
  qrCodeButton: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#0CBC8B',
    borderRadius: 100,
    padding: 20,
    borderWidth: 10,
    borderColor: '#fff',
    marginTop: -20,
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
    marginTop: 100,
    marginLeft: -50,
  },
  select: {
    backgroundColor: 'white',
    marginTop: 8,
    marginBottom: 8,
    height: 45,
    width: '80%',
    justifyContent: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: 'black',
  },
  selectStatus: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    marginTop: 8,
    marginBottom: 8,
    height: 45,
    width: '80%',
    justifyContent: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: 'black',
  }
})
