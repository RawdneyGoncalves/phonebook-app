import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any>(null)
  const isAuthenticated = ref<boolean>(!!token.value)

  const login = async (email: string, password: string) => {
    // Mock: aceita qualquer email/senha
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockToken = 'mock-token-' + Date.now()
    const mockUser = { id: 1, name: 'Usuário Teste', email }

    token.value = mockToken
    user.value = mockUser
    isAuthenticated.value = true
    localStorage.setItem('token', mockToken)

    return true
  }

  const register = async (name: string, email: string, password: string) => {
    // Mock: aceita qualquer registro
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockToken = 'mock-token-' + Date.now()
    const mockUser = { id: 1, name, email }

    token.value = mockToken
    user.value = mockUser
    isAuthenticated.value = true
    localStorage.setItem('token', mockToken)

    return true
  }

  const logout = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
