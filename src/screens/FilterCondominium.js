import { useMemo, useState } from 'react';

import okIcon from '../assets/icons/okIcon.png';
import errorIcon from '../assets/icons/errorIcon.png';
import closeIcon from '../assets/icons/closeIcon.png'
import { StyleSheet, View, TouchableOpacity, Image, Platform, TextInput, KeyboardAvoidingView, FlatList } from "react-native";
import { TextComponent } from "../components/TextComponent";
import { TextInputMask } from 'react-native-masked-text';
import { Button } from '../components/Button'
import { ButtonScanner } from '../components/ButtonScanner';

const isAndroid = Platform.OS === "Android"

export default function FilterCondominium({
  navigation,
  route
}) {
  const { condominium } = route.params
  const [name, setName] = useState('')
  const [vigencia, setVigencia] = useState('')
  const [leitura, setLeitura] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasFilter, setHasFilter] = useState(false)
  const [filteredCondominium, setFilteredCondominium] = useState()

  const CondominiumFiltered = useMemo(() => {
    return condominium.filter((condominium) => condominium.fantasy_name.toLowerCase().includes(name.toLowerCase())
    );
  }, [condominium, name]);

  // alert(JSON.stringify(CondominiumFiltered))

  const handleFilter = async () => {
    try {
      setIsLoading(true)

      await new Promise(resolve => setTimeout(resolve, 1000))

      setFilteredCondominium(CondominiumFiltered)
      setHasFilter(true)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      keyboardVerticalOffset={-200}
    >
      <View style={styles.header}>
        <TextComponent weight='700' size={28} style={{ fontFamily: 'NunitoSans-Bold'}}>
          Filtrar
        </TextComponent>

        <TouchableOpacity
          style={styles.headerCloseButton}
          onPress={() => navigation.navigate('CondominiumScreen')}
        >
          <Image
            source={closeIcon}
          />
        </TouchableOpacity>
      </View>

      {!hasFilter && (
        <View
          style={styles.filterInputs}
        >
          <View style={{ width: '100%' }}>
            <TextComponent weight='700' size={16} style={{ fontFamily: 'NunitoSans-Bold'}}>
              Nome do condomínio
            </TextComponent>
            <TextInput
              value={name}
              onChangeText={(value) => setName(value)}
              placeholder="Procurar"
              placeholderTextColor="#A6AAC5"
              keyboardType='email-address'
              style={styles.inputStyled}
            />
          </View>

          <View style={{ width: '100%' }}>
            <TextComponent weight='700' size={16} style={{ fontFamily: 'NunitoSans-Bold'}}>
              Vigência
            </TextComponent>
            <TextInputMask
              type={'custom'}
              options={{
                mask: '99/9999'
              }}
              value={vigencia}
              onChangeText={(value) => setVigencia(value)}
              maxLength={7}
              placeholder="MM/YYYY"
              placeholderTextColor="#A6AAC5"
              keyboardType='number-pad'
              style={styles.inputStyled}
            />
          </View>

          <View style={{ width: '100%' }}>
            <TextComponent weight='700' size={16} style={{ fontFamily: 'NunitoSans-Bold'}}>
              Leitura
            </TextComponent>
            <TextInput
              value={leitura}
              onChangeText={(value) => setLeitura(value)}
              placeholder="00000"
              maxLength={5}
              placeholderTextColor="#A6AAC5"
              keyboardType='number-pad'
              style={styles.inputStyled}
            />
          </View>

          <View style={styles.containerButton}>
            <Button onClick={handleFilter} isLoading={isLoading}>
              <TextComponent color='#FFFFFF' weight='700' size={16} style={{ fontFamily: 'NunitoSans-Bold'}}>
                Filtrar
              </TextComponent>
            </Button>
          </View>
        </View>
      )}

      {hasFilter && (
        <View style={{ flex: 1 }}>
          <View style={styles.vigenciaContainer}>
            <TextComponent weight='700' size={16} style={{ fontFamily: 'NunitoSans-Bold'}}>
              Vigência
            </TextComponent>
            <View style={{ marginVertical: 16, marginLeft: 18 }}>
              <TextComponent color='#A6AAC5'>
                MM/YYYY
              </TextComponent>
            </View>
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredCondominium}
            style={{ marginTop: 30 }}
            contentContainerStyle={{ paddingVertical: 12 }}
            keyExtractor={filteredCondominium => filteredCondominium.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item: filteredCondominium }) => (
              <TouchableOpacity
                style={styles.filterCard}
                onPress={() => navigation.navigate('SelectedCondominium', { condominiumId: filteredCondominium.id })}
              >
                <View style={styles.filterCardInfo}>
                  <TextComponent weight='700' size={16} style={{ fontFamily: 'NunitoSans-Bold'}}>
                    {filteredCondominium.fantasy_name}
                  </TextComponent>

                  <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold'}}>
                    Unidade: {filteredCondominium.unit_size} Bloco: {filteredCondominium.unit_size}
                  </TextComponent>

                  <TextComponent color="#6F6F6F" weight='400' size={16} style={{ fontFamily: 'NunitoSans-Bold'}}>
                    Leitura:
                  </TextComponent>
                </View>

                {filteredCondominium.state_registration === 'ISENTO' ? (
                  <Image
                    source={okIcon}
                  />
                ) : (
                  <Image
                    source={errorIcon}
                  />
                )}
              </TouchableOpacity>
            )}
          />

        </View>
      )}

      <ButtonScanner />
    </KeyboardAvoidingView>
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
    justifyContent:'space-between',
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
  filterInputs: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 42,
    gap: 19,
    width: '100%'
  },
  inputStyled: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  containerButton: {
    width: 154,
    marginTop: 73
  },
  vigenciaContainer: {
    width: 230,
    justifyContent:'center',
    alignItems: 'flex-start',
    borderBottomWidth: 1
  },
  filterCard: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
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
})
