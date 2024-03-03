import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { api, applyToken } from '../services/api'
import { userService } from '../services/userService'
import { createContext, useState, useEffect } from "react"
import TableLogin from '../services/sqlite/TableLogin.js'
import moment from "moment"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedValidityName, setSelectedValidityName] = useState()
  const [scanned, setScanned] = useState(false);
  const [imageBase64, setImageBase64] = useState()
  const [loadingImage, setLoadingImage] = useState(false)

  const navigation = useNavigation()

  const userStorage = "@lq_user_token"

  useEffect(() => {
    const loadStorageData = async () => {
      const storageData = await AsyncStorage.getItem(userStorage)
      if (storageData) {
        await applyToken()
        await me()
      }
    }
    loadStorageData()
  }, [])

  useEffect(() => {
    if (user) {
      TableLogin.create({
        user:user.mail,
        dateLogin: moment().format('DD/MM/YYYY')
      })
      TableLogin.all().then(d=>console.log(d))
      setIsAuthenticated(true)
      setIsLoading(false)
    } else {
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }, [user])

  const me = async () => {
    setIsLoading(true)
    const user = await userService.getMe()
    if (user) {
      setUser(user)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }

  const signIn = async (data) => {
    try {
      const response = await api.post('/login', data)
      setToken(response.data.token)
      await applyToken()
      if (response.data.is_first_login) {
        navigation.navigate('LoginScreen')
      } else {
        await me()
      }
      return true
    } catch (error) {
      return false
    }
  }

  const updatePassword = async (data) => {
    try {
      const response = await api.post('/login/update_password', data)
      if (response) {
        setToken(response.data.token)
        await applyToken()
        await me()
      }
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const recoverPassword = async (data) => {
    try {
      const response = await api.post('/login/recover_password', data)
      if (!response) {
        return false
      }
      if (response) {
        navigation.navigate('ResetPassword')
        setToken(response.data.recovery_token)
        await applyToken()
      }
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem(userStorage)
    } catch (error) {
      return null
    }
  }

  const setToken = async (token) => {
    try {
      await AsyncStorage.setItem(userStorage, token)
      return token
    } catch (error) {
      return null
    }
  }

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem(userStorage)
      setIsAuthenticated(false)
      setUser(null)
      return true
    } catch (_e) {
      return false
    }
  }

  const logout = async () => {
    try {
      await api.post('/login/logout')
      removeToken()
      navigation.navigate('LoginScreen')
    } catch (error) {
      removeToken()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        logout,
        getToken,
        me,
        updatePassword,
        recoverPassword,
        user,
        isLoading,
        isAuthenticated,
        selectedValidityName,
        setSelectedValidityName,
        scanned,
        setScanned,
        imageBase64,
        setImageBase64,
        loadingImage,
        setLoadingImage
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
