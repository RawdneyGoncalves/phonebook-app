import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

interface AuthResponse {
  message: string
  data: {
    user: User
    token: string
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(!!token.value)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token.value && !endpoint.includes('/register') && !endpoint.includes('/login')) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    })

    if (!response.ok) {
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erro na requisição: ${response.status}`)
      } catch {
        throw new Error(`Erro na requisição: ${response.status}`)
      }
    }

    if (response.status === 204 || response.status === 205) {
      return {} as T
    }

    const text = await response.text()

    if (!text) {
      return {} as T
    }

    try {
      return JSON.parse(text) as T
    } catch (err) {
      console.error('Erro ao fazer parse de JSON:', text)
      throw new Error('Resposta inválida do servidor')
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiCall<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      token.value = response.token
      user.value = response.user
      isAuthenticated.value = true
      localStorage.setItem('token', response.token)

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao fazer login'
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiCall<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      })

      token.value = response.token
      user.value = response.user
      isAuthenticated.value = true
      localStorage.setItem('token', response.token)

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao registrar'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await apiCall('/auth/logout', {
        method: 'POST',
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao fazer logout'
    } finally {
      token.value = null
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('token')
      loading.value = false
    }
  }

  const fetchCurrentUser = async (): Promise<boolean> => {
    if (!token.value) {
      return false
    }

    loading.value = true
    error.value = null

    try {
      const response = await apiCall<{ data: User }>('/auth/me')
      user.value = response.data
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao buscar usuário'
      token.value = null
      localStorage.removeItem('token')
      isAuthenticated.value = false
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
  }
})
