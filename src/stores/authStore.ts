import { ref } from 'vue'
import { defineStore } from 'pinia'

import type {Credentials} from 'src/types/authorize'
import type {ApiError} from 'src/types/api'
import type {UserData} from 'src/types/user'

import { authService } from 'src/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserData | null>(null)
  const token = ref(localStorage.getItem('authToken')) || null
  const isAuthenticated = ref(false)
  const errorMessage = ref("")

  async function login(credentials : Credentials) {
    errorMessage.value = ""

    try{
      const response = await authService.login(credentials);
      token.value = response.data.token
      user.value = response.data.user
      isAuthenticated.value = true
      localStorage.setItem('authToken', response.data.token)
      await getUser();
      return {success: true, data: response.data}
    }
    catch(error){
      errorMessage.value = (error as ApiError).userMessage
      return {success: false, error}
    }
  }

  async function getUser(){
    errorMessage.value = ""
    try{
      const response = await authService.getUser();
      user.value = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        is_stuff: response.data.is_stuff
      }
      return {success: true, data: response.data}
    }
    catch(error){
      errorMessage.value = (error as ApiError).userMessage
      return {success: false, error}
    }
  }

  async function logout(){
    await authService.logout();
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('authToken')
  }

  return {user, token, isAuthenticated, errorMessage, login, getUser, logout}
})
