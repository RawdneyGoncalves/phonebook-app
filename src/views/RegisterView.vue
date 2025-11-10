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
            minlength="3"
            autocomplete="name"
            class="input"
          />
        </div>

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
          <p v-if="emailError" class="field-error">{{ emailError }}</p>
        </div>

        <div class="form-group">
          <input
            v-model="password"
            type="password"
            placeholder="Senha"
            required
            minlength="6"
            autocomplete="new-password"
            class="input"
          />
          <p v-if="passwordError" class="field-error">{{ passwordError }}</p>
        </div>

        <div class="form-group">
          <input
            v-model="passwordConfirmation"
            type="password"
            placeholder="Confirme a Senha"
            required
            minlength="6"
            autocomplete="new-password"
            class="input"
          />
          <p v-if="passwordConfirmError" class="field-error">{{ passwordConfirmError }}</p>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading || !isFormValid">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref('')

const emailError = ref('')
const passwordError = ref('')
const passwordConfirmError = ref('')

const validateEmail = (emailValue: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailValue)
}

const validatePassword = (passwordValue: string): boolean => {
  return passwordValue.length >= 6
}

const checkEmail = () => {
  if (!email.value) {
    emailError.value = ''
    return
  }

  if (!validateEmail(email.value)) {
    emailError.value = 'Email inválido'
  } else {
    emailError.value = ''
  }
}

const checkPassword = () => {
  if (!password.value) {
    passwordError.value = ''
    return
  }

  if (!validatePassword(password.value)) {
    passwordError.value = 'Senha deve ter no mínimo 6 caracteres'
  } else {
    passwordError.value = ''
  }
}

const checkPasswordConfirmation = () => {
  if (!passwordConfirmation.value) {
    passwordConfirmError.value = ''
    return
  }

  if (password.value !== passwordConfirmation.value) {
    passwordConfirmError.value = 'As senhas não coincidem'
  } else {
    passwordConfirmError.value = ''
  }
}

const isFormValid = computed(() => {
  return (
    name.value.trim().length >= 3 &&
    email.value &&
    validateEmail(email.value) &&
    password.value &&
    validatePassword(password.value) &&
    passwordConfirmation.value &&
    password.value === passwordConfirmation.value
  )
})

const handleRegister = async () => {
  checkEmail()
  checkPassword()
  checkPasswordConfirmation()

  if (!isFormValid.value) {
    error.value = 'Verifique os dados preenchidos'
    return
  }

  loading.value = true
  error.value = ''

  const success = await authStore.register(
    name.value.trim(),
    email.value.trim(),
    password.value,
    passwordConfirmation.value,
  )

  if (success) {
    router.push('/')
  } else {
    error.value = authStore.error || 'Erro ao criar conta. Email pode já estar em uso.'
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

.input::placeholder {
  color: rgba(142, 142, 147, 0.8);
}

.input:focus {
  outline: none;
  border-color: #0a84ff;
  background: rgba(58, 58, 60, 0.7);
  box-shadow: 0 0 0 4px rgba(10, 132, 255, 0.1);
}

.input.error {
  border-color: #ff453a;
}

.field-error {
  font-size: 12px;
  color: #ff453a;
  margin-top: 4px;
  line-height: 1.4;
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
</style>
