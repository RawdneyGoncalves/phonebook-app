import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export interface Contact {
  id: number
  name: string
  email: string | null
  phone: string
  image_url?: string | null
  created_at: string
  updated_at: string
}

interface ContactCreateUpdate {
  name: string
  phone: string
  email: string | null
  image_url?: string | null
}

interface PaginatedResponse {
  data: Contact[]
  pagination: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

interface ContactResponse {
  data: Contact
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const useContactStore = defineStore('contacts', () => {
  const contacts = ref<Contact[]>([])
  const currentContact = ref<Contact | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  })
  const searchQuery = ref<string>('')

  const authStore = useAuthStore()

  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const headers: Record<string, string> = {}

    const isFormData = options.body instanceof FormData

    if (!isFormData && (!options.method || options.method === 'GET')) {
      headers['Content-Type'] = 'application/json'
    }

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
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
        throw new Error(errorData.error || errorData.message || `Erro: ${response.status}`)
      } catch {
        throw new Error(`Erro na requisição: ${response.status}`)
      }
    }

    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  const fetchContacts = async (page: number = 1, query: string = ''): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      if (query) {
        params.append('q', query)
      }

      const response = await apiCall<PaginatedResponse>(`/contacts?${params.toString()}`)

      contacts.value = response.data
      pagination.value = response.pagination
      searchQuery.value = query
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao buscar contatos'
      contacts.value = []
    } finally {
      loading.value = false
    }
  }

  const getContact = async (id: number): Promise<Contact | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await apiCall<ContactResponse>(`/contacts/${id}`)
      currentContact.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao buscar contato'
      return null
    } finally {
      loading.value = false
    }
  }

  const createContact = async (
    contact: ContactCreateUpdate,
    imageFile?: File,
  ): Promise<Contact | null> => {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('name', contact.name)
      formData.append('phone', contact.phone)
      if (contact.email) formData.append('email', contact.email)
      if (imageFile) formData.append('image', imageFile)

      const response = await apiCall<ContactResponse>('/contacts', {
        method: 'POST',
        body: formData,
      })

      contacts.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar contato'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateContact = async (
    id: number,
    contact: ContactCreateUpdate,
    imageFile?: File,
  ): Promise<Contact | null> => {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('name', contact.name)
      formData.append('phone', contact.phone)
      if (contact.email) formData.append('email', contact.email)
      if (imageFile) formData.append('image', imageFile)

      const response = await apiCall<ContactResponse>(`/contacts/${id}`, {
        method: 'PUT',
        body: formData,
      })

      const index = contacts.value.findIndex((c) => c.id === id)
      if (index !== -1) contacts.value[index] = response.data
      currentContact.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar contato'
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteContact = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      await apiCall(`/contacts/${id}`, {
        method: 'DELETE',
      })

      contacts.value = contacts.value.filter((c) => c.id !== id)
      if (currentContact.value?.id === id) {
        currentContact.value = null
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao deletar contato'
      return false
    } finally {
      loading.value = false
    }
  }

  const searchContacts = async (query: string): Promise<void> => {
    if (!query.trim()) {
      await fetchContacts(1)
      return
    }

    await fetchContacts(1, query)
  }

  const hasNextPage = computed(() => pagination.value.current_page < pagination.value.last_page)
  const hasPreviousPage = computed(() => pagination.value.current_page > 1)

  const goToPage = async (page: number): Promise<void> => {
    await fetchContacts(page, searchQuery.value)
  }

  return {
    contacts,
    currentContact,
    loading,
    error,
    pagination,
    searchQuery,
    fetchContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    goToPage,
    hasNextPage,
    hasPreviousPage,
  }
})
