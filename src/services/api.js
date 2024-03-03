import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const URL_PROD = 'https://api.gestor.eco.br'

export const api = axios.create({
  baseURL: URL_PROD,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json'
  }
})

const userStorage = "@lq_user_token"

const getStorageToken = async () => {
  const token = await AsyncStorage.getItem(userStorage)
  if (token) {
    return token
  }
}

export const applyToken = async () => {
  const token = await getStorageToken()
  api.defaults.headers.Authorization = `${token}`
}
