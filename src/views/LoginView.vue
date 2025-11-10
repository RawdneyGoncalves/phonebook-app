<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Agenda</h1>
        <p>Entre para acessar seus contatos</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            autocomplete="email"
            inputmode="email"
            class="input"
          />
        </div>

        <div class="form-group password-group">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Senha"
            required
            autocomplete="current-password"
            class="input"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="btn-toggle-password"
            :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
          >
            <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="1"
                y1="1"
                x2="23"
                y2="23"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p class="auth-link">
          Não tem conta?
          <router-link to="/register">Criar conta</router-link>
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

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const success = await authStore.login(email.value, password.value)

  if (success) {
    router.push('/')
  } else {
    error.value = authStore.error || 'Erro ao fazer login'
  }

  loading.value = false
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  min-height: 100dvh;
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

.password-group {
  position: relative;
}

.input {
  background: rgba(58, 58, 60, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;
  width: 100%;
}

.password-group .input {
  padding-right: 52px;
}

.input::placeholder {
  color: rgba(142, 142, 147, 0.8);
}

.input:focus {
  outline: none;
  border-color: #0a84ff;
  background: rgba(58, 58, 60, 0.7);
  box-shadow: 0 0 0 4px rgba(10, 132, 255, 0.1);
}

.btn-toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #8e8e93;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn-toggle-password:active {
  transform: translateY(-50%) scale(0.9);
  color: #0a84ff;
}

@media (hover: hover) {
  .btn-toggle-password:hover {
    color: #0a84ff;
  }
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
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn-primary:active:not(:disabled) {
  background: #0077ed;
  transform: scale(0.98);
}

@media (hover: hover) {
  .btn-primary:hover:not(:disabled) {
    background: #0077ed;
    transform: translateY(-1px);
  }
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
  line-height: 1.5;
}

.auth-link a {
  color: #0a84ff;
  font-weight: 600;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.error {
  color: #ff453a;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 480px) {
  .auth-container {
    padding: 16px;
    align-items: flex-start;
    padding-top: max(16px, env(safe-area-inset-top));
  }

  .auth-card {
    padding: 32px 24px;
    margin-top: 20px;
  }

  .auth-header {
    margin-bottom: 32px;
  }

  .auth-header h1 {
    font-size: 28px;
  }

  .input {
    font-size: 16px;
    padding: 14px;
  }

  .password-group .input {
    padding-right: 50px;
  }

  .btn-toggle-password {
    right: 10px;
    padding: 10px;
  }

  .btn-primary {
    padding: 14px;
    font-size: 16px;
  }
}

@media (max-width: 360px) {
  .auth-card {
    padding: 24px 20px;
  }

  .auth-header h1 {
    font-size: 24px;
  }

  .auth-form {
    gap: 14px;
  }
}

@media (max-height: 700px) and (max-width: 480px) {
  .auth-container {
    padding-top: 10px;
  }

  .auth-card {
    margin-top: 10px;
    padding: 24px 20px;
  }

  .auth-header {
    margin-bottom: 24px;
  }

  .auth-header h1 {
    font-size: 24px;
  }
}
</style>
