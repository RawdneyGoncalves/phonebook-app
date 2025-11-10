<!-- src/views/RegisterView.vue -->
<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Criar Conta</h1>
        <p>Registre-se para começar</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <input 
            v-model="name" 
            type="text" 
            placeholder="Nome" 
            required
            class="input"
          />
        </div>
        
        <div class="form-group">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Email" 
            required
            class="input"
          />
        </div>
        
        <div class="form-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Senha" 
            required
            minlength="6"
            class="input"
          />
        </div>
        
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Criando...' : 'Criar Conta' }}
        </button>
        
        <p class="auth-link">
          Já tem conta? 
          <router-link to="/login">Entrar</router-link>
        </p>
      </form>
      
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  const success = await authStore.register(name.value, email.value, password.value)
  
  if (success) {
    router.push('/')
  } else {
    error.value = 'Erro ao criar conta. Email pode já estar em uso.'
  }
  
  loading.value = false
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #1c1c1e 0%, #000 100%);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: rgba(28, 28, 30, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.auth-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.auth-header p {
  color: #8e8e93;
  font-size: 14px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input {
  background: rgba(58, 58, 60, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #0a84ff;
  background: rgba(58, 58, 60, 0.7);
}

.btn-primary {
  background: #0a84ff;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #0077ed;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  margin-top: 20px;
  color: #8e8e93;
  font-size: 14px;
}

.auth-link a {
  color: #0a84ff;
  font-weight: 600;
}

.error {
  color: #ff453a;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }
}
</style>