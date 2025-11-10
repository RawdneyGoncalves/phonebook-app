<!-- src/views/ContactsView.vue -->
<template>
  <div class="contacts-container">
    <div class="header">
      <h1>Contatos</h1>
      <button @click="logout" class="btn-logout">Sair</button>
    </div>
    
    <div class="search-bar">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Buscar contato..." 
        class="search-input"
      />
    </div>
    
    <div class="contacts-list">
      <div 
        v-for="contact in filteredContacts" 
        :key="contact.id" 
        class="contact-item"
        @click="contact.id && goToDetail(contact.id)"
      >
        <div class="contact-avatar">
          <img 
            v-if="contact.image" 
            :src="contact.image" 
            :alt="contact.name"
          />
          <div v-else class="avatar-placeholder" :style="{ background: getAvatarColor(contact.name) }">
            {{ getInitials(contact.name) }}
          </div>
        </div>
        
        <div class="contact-info">
          <h3>{{ contact.name }}</h3>
          <p>{{ contact.phone }}</p>
        </div>
        
        <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    
    <button @click="goToNew" class="btn-add">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useContactStore } from '@/stores/contacts'

const router = useRouter()
const authStore = useAuthStore()
const contactStore = useContactStore()

const searchQuery = ref('')

const filteredContacts = computed(() => {
  if (!searchQuery.value) {
    return contactStore.contacts
  }
  
  const query = searchQuery.value.toLowerCase()
  return contactStore.contacts.filter(contact => 
    contact.name.toLowerCase().includes(query) ||
    contact.phone.includes(query) ||
    contact.email.toLowerCase().includes(query)
  )
})

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? ''
    const last = parts[parts.length - 1]?.[0] ?? ''
    return (first + last).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const getAvatarColor = (name: string): string => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const index = Math.abs(hash) % colors.length
  return colors[index]!
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const goToDetail = (id: number) => {
  router.push(`/contacts/${id}`)
}

const goToNew = () => {
  router.push('/contacts/new')
}

onMounted(() => {
  contactStore.fetchContacts()
})
</script>

<style scoped>
.contacts-container {
  min-height: 100vh;
  background: #000;
  padding-bottom: 100px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 20px 20px;
  background: linear-gradient(180deg, #1c1c1e 0%, #000 100%);
}

.header h1 {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.btn-logout {
  background: rgba(58, 58, 60, 0.5);
  color: #0a84ff;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.btn-logout:active {
  transform: scale(0.95);
  background: rgba(58, 58, 60, 0.7);
}

.search-bar {
  padding: 0 20px 20px;
}

.search-input {
  width: 100%;
  background: rgba(58, 58, 60, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.search-input::placeholder {
  color: rgba(142, 142, 147, 0.8);
}

.search-input:focus {
  outline: none;
  border-color: #0a84ff;
  background: rgba(58, 58, 60, 0.7);
  box-shadow: 0 0 0 4px rgba(10, 132, 255, 0.1);
}

.contacts-list {
  display: flex;
  flex-direction: column;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: rgba(28, 28, 30, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.contact-item:active {
  background: rgba(58, 58, 60, 0.9);
  transform: scale(0.98);
}

@media (hover: hover) {
  .contact-item:hover {
    background: rgba(58, 58, 60, 0.6);
  }
}

.contact-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.contact-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-info h3 {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.3px;
}

.contact-info p {
  font-size: 14px;
  color: #8e8e93;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chevron {
  color: #8e8e93;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.contact-item:active .chevron {
  transform: translateX(4px);
}

.btn-add {
  position: fixed;
  bottom: 30px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0a84ff 0%, #0077ed 100%);
  border: none;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(10, 132, 255, 0.5);
  transition: all 0.3s ease;
  z-index: 10;
}

.btn-add:active {
  transform: scale(0.9);
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.4);
}

@media (hover: hover) {
  .btn-add:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(10, 132, 255, 0.6);
  }
}

@media (max-width: 768px) {
  .header {
    padding: 40px 16px 16px;
  }
  
  .header h1 {
    font-size: 28px;
  }
  
  .search-bar {
    padding: 0 16px 16px;
  }
  
  .contact-item {
    padding: 12px 16px;
  }
}
</style>