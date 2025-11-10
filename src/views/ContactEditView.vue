<template>
  <div class="form-container" v-if="contact">
    <div class="form-header">
      <button @click="goBack" class="btn-cancel">Cancelar</button>
      <h2>Editar Contato</h2>
      <button @click="handleSubmit" class="btn-save" :disabled="loading">
        {{ loading ? 'Salvando...' : 'Salvar' }}
      </button>
    </div>

    <div class="form-content">
      <div class="avatar-upload" @click="triggerFileInput">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileChange"
          style="display: none"
        />
        <div v-if="imagePreview" class="avatar-preview">
          <img :src="imagePreview" alt="Preview" />
          <div class="avatar-overlay">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="12"
                cy="13"
                r="4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div v-else-if="contact.image_url" class="avatar-preview">
          <img :src="contact.image_url" :alt="contact.name" />
          <div class="avatar-overlay">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="12"
                cy="13"
                r="4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div
          v-else
          class="avatar-placeholder-upload"
          :style="{ background: getAvatarColor(contact.name) }"
        >
          <div class="initials">{{ getInitials(contact.name) }}</div>
          <div class="camera-overlay">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="12"
                cy="13"
                r="4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="contact-form">
        <div class="form-group">
          <input
            v-model="form.name"
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
            v-model="phoneDisplay"
            @input="handlePhoneInput"
            @keypress="preventNonNumeric"
            type="tel"
            placeholder="Telefone"
            required
            autocomplete="tel"
            inputmode="numeric"
            class="input"
          />
          <p v-if="phoneError" class="field-error">{{ phoneError }}</p>
        </div>

        <div class="form-group">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            autocomplete="email"
            inputmode="email"
            class="input"
          />
        </div>
      </form>
    </div>

    <!-- Image Cropper -->
    <ImageCropper
      :show="showCropper"
      :image-src="tempImageSrc"
      @close="showCropper = false"
      @crop="handleCroppedImage"
    />

    <!-- Toast de Notificação -->
    <Transition name="toast">
      <div v-if="showToast" class="toast" :class="toastType">
        <div class="toast-icon">
          <svg
            v-if="toastType === 'success'"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <line
              x1="12"
              y1="16"
              x2="12.01"
              y2="16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useContactStore } from '@/stores/contacts'
import { usePhoneFormatter } from '@/composables/usePhoneFormatter'
import type { Contact } from '@/stores/contacts'
import ImageCropper from '@/components/ImageCropper.vue'

const router = useRouter()
const route = useRoute()
const contactStore = useContactStore()
const { sanitizePhone, validatePhone, preventNonNumeric } = usePhoneFormatter()

const contact = ref<Contact | null>(null)
const form = ref({
  name: '',
  phone: '',
  email: '' as string | null,
})

const phoneDisplay = ref('')
const phoneError = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const tempImageSrc = ref('')
const showCropper = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = sanitizePhone(target.value)
  phoneDisplay.value = value
  form.value.phone = value

  if (value && !validatePhone(value)) {
    phoneError.value = 'Telefone deve ter entre 10 e 20 dígitos'
  } else {
    phoneError.value = ''
  }
}

const getInitials = (name: string): string => {
  const parts = name
    .trim()
    .split(' ')
    .filter((p) => p.length > 0)
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
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % colors.length
  return colors[index]!
}

const goBack = () => {
  router.push('/')
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      tempImageSrc.value = e.target?.result as string
      showCropper.value = true
    }
    reader.readAsDataURL(file)
  }
}

const handleCroppedImage = (blob: Blob) => {
  const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
  imageFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(blob)
  showCropper.value = false
}

const handleSubmit = async () => {
  if (!validatePhone(form.value.phone)) {
    phoneError.value = 'Telefone deve ter entre 10 e 20 dígitos'
    return
  }

  loading.value = true
  try {
    await contactStore.createContact(
      { ...form.value, phone: form.value.phone },
      imageFile.value || undefined,
    )
    showNotification('Contato criado com sucesso!')
    setTimeout(() => router.push('/'), 500)
  } catch (e) {
    showNotification('Erro ao criar contato', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  contact.value = await contactStore.getContact(Number(route.params.id))
  if (contact.value) {
    const cleanPhone = sanitizePhone(contact.value.phone)
    form.value = {
      name: contact.value.name,
      phone: cleanPhone,
      email: contact.value.email || '',
    }
    phoneDisplay.value = cleanPhone
  }
})
</script>

<style scoped>
.form-container {
  min-height: 100vh;
  background: #000;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 20px 20px;
  background: linear-gradient(180deg, #1c1c1e 0%, #000 100%);
  backdrop-filter: blur(10px);
}

.btn-cancel,
.btn-save {
  background: none;
  border: none;
  color: #0a84ff;
  font-size: 17px;
  font-weight: 600;
  padding: 8px;
  transition: transform 0.2s ease;
}

.btn-cancel:active,
.btn-save:active:not(:disabled) {
  transform: scale(0.9);
}

.btn-save:disabled {
  opacity: 0.5;
}

.form-header h2 {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.form-content {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-upload {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
}

.avatar-upload:active {
  transform: scale(0.95);
}

.avatar-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: #fff;
}

.avatar-upload:hover .avatar-overlay {
  opacity: 1;
}

.avatar-placeholder-upload {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.initials {
  font-size: 56px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: absolute;
}

.camera-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: #fff;
}

.avatar-upload:hover .camera-overlay {
  opacity: 1;
}

.contact-form {
  width: 100%;
  max-width: 500px;
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
  font-size: 17px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
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

.field-error {
  font-size: 12px;
  color: #ff453a;
  margin-top: 4px;
  line-height: 1.4;
}

.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(28, 28, 30, 0.95);
  backdrop-filter: blur(20px);
  color: #fff;
  padding: 16px 24px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  min-width: 280px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toast.success {
  border-left: 3px solid #30d158;
}

.toast.error {
  border-left: 3px solid #ff453a;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast.success .toast-icon {
  color: #30d158;
}

.toast.error .toast-icon {
  color: #ff453a;
}

.toast span {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.2px;
}

.toast-enter-active {
  animation: slideDown 0.3s ease;
}

.toast-leave-active {
  animation: slideUp 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
}

@media (max-width: 768px) {
  .form-header {
    padding: 40px 16px 16px;
  }

  .form-content {
    padding: 30px 16px;
  }

  .avatar-upload {
    width: 120px;
    height: 120px;
  }

  .initials {
    font-size: 48px;
  }

  .input {
    font-size: 16px;
    padding: 14px;
  }

  .toast {
    top: 60px;
    left: 16px;
    right: 16px;
    transform: none;
    min-width: auto;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
}
</style>
