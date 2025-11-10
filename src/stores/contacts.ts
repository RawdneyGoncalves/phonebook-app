import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Contact {
  id?: number
  name: string
  email: string
  phone: string
  image?: string
}

export const useContactStore = defineStore('contacts', () => {
  const contacts = ref<Contact[]>([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 98765-4321',
      image: '',
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '(21) 99876-5432',
      image: '',
    },
    {
      id: 3,
      name: 'Pedro Oliveira',
      email: 'pedro@email.com',
      phone: '(31) 97654-3210',
      image: '',
    },
  ])

  const loading = ref(false)
  let nextId = 4

  const fetchContacts = async () => {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 300))
    loading.value = false
  }

  const getContact = async (id: number): Promise<Contact | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return contacts.value.find((c) => c.id === id) || null
  }

  const createContact = async (contact: Contact, imageFile?: File): Promise<Contact> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    let imageUrl = ''
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile)
    }

    const newContact: Contact = {
      ...contact,
      id: nextId++,
      image: imageUrl,
    }

    contacts.value.push(newContact)
    return newContact
  }

  const updateContact = async (
    id: number,
    contact: Contact,
    imageFile?: File,
  ): Promise<Contact> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = contacts.value.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }

    const existingContact = contacts.value[index]
    let imageUrl = existingContact?.image ?? ''

    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile)
    }

    const updatedContact: Contact = {
      ...contact,
      id,
      image: imageUrl,
    }

    contacts.value[index] = updatedContact
    return updatedContact
  }

  const deleteContact = async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    contacts.value = contacts.value.filter((c) => c.id !== id)
  }

  return {
    contacts,
    loading,
    fetchContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
  }
})
