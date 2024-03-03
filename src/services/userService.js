import { api } from "./api"

const getMe = async () => {
  try {
    const response = await api.get('/login/me')
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const userService = {
  getMe
}
