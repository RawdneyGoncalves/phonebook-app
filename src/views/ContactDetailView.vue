<template>
  <div class="detail-container" v-if="contact">
    <div class="detail-header">
      <button @click="goBack" class="btn-back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M12 19l-7-7 7-7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h2>Detalhes</h2>
      <button @click="goToEdit" class="btn-edit">Editar</button>
    </div>

    <div class="detail-content">
      <div class="contact-avatar-large" @click="triggerFileInput">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileChange"
          style="display: none"
        />
        <img v-if="contact.image_url" :src="contact.image_url" :alt="contact.name" />
        <div
          v-else
          class="avatar-placeholder-large"
          :style="{ background: getAvatarColor(contact.name) }"
        >
          {{ getInitials(contact.name) }}
        </div>
        <div class="camera-icon-detail">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

      <h1 class="contact-name">{{ contact.name }}</h1>

      <div class="contact-details">
        <div class="detail-item">
          <div class="detail-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="detail-info">
            <p class="detail-label">Telefone</p>
            <p class="detail-value">{{ contact.phone }}</p>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="m22 6-10 7L2 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="detail-info">
            <p class="detail-label">Email</p>
            <p class="detail-value">{{ contact.email }}</p>
          </div>
        </div>
      </div>

      <button @click="showDeleteConfirm = true" class="btn-delete">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <line
            x1="10"
            y1="11"
            x2="10"
            y2="17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <line
            x1="14"
            y1="11"
            x2="14"
            y2="17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Excluir Contato
      </button>
    </div>

    <!-- Modal de Confirmação -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Excluir Contato</h3>
          </div>
          <div class="modal-body">
            <p>
              Tem certeza que deseja excluir <strong>{{ contact.name }}</strong
              >?
            </p>
            <p class="modal-warning">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-actions">
            <button @click="showDeleteConfirm = false" class="btn-modal-cancel">Cancelar</button>
            <button @click="handleDelete" class="btn-modal-delete" :disabled="loading">
              {{ loading ? 'Excluindo...' : 'Excluir' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

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
import type { Contact } from '@/stores/contacts'

const router = useRouter()
const route = useRoute()
const contactStore = useContactStore()

const contact = ref<Contact | null>(null)
const showDeleteConfirm = ref(false)
const loading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const fileInput = ref<HTMLInputElement | null>(null)
const imageFile = ref<File | null>(null)

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
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

const goToEdit = () => {
  router.push(`/contacts/${route.params.id}/edit`)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && contact.value) {
    imageFile.value = file
    loading.value = true

    try {
      await contactStore.updateContact(
        Number(route.params.id),
        {
          name: contact.value.name,
          phone: contact.value.phone,
          email: contact.value.email,
        },
        file,
      )

      // Recarrega o contato para mostrar a nova imagem
      contact.value = await contactStore.getContact(Number(route.params.id))
      showNotification('Foto atualizada com sucesso!')
    } catch (e) {
      showNotification('Erro ao atualizar foto', 'error')
    } finally {
      loading.value = false
    }
  }
}

const handleDelete = async () => {
  loading.value = true

  try {
    await contactStore.deleteContact(Number(route.params.id))
    showNotification('Contato excluído com sucesso!')
    setTimeout(() => {
      router.push('/')
    }, 500)
  } catch (e) {
    showNotification('Erro ao excluir contato', 'error')
    showDeleteConfirm.value = false
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  contact.value = await contactStore.getContact(Number(route.params.id))
})
</script>

<style scoped>
.detail-container {
  min-height: 100vh;
  background: #000;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 20px 20px;
  background: linear-gradient(180deg, #1c1c1e 0%, #000 100%);
  backdrop-filter: blur(10px);
}

.btn-back {
  background: none;
  border: none;
  color: #0a84ff;
  padding: 8px;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.btn-back:active {
  transform: scale(0.9);
}

.detail-header h2 {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.btn-edit {
  background: none;
  border: none;
  color: #0a84ff;
  font-size: 17px;
  font-weight: 600;
  padding: 8px;
  transition: transform 0.2s ease;
}

.btn-edit:active {
  transform: scale(0.9);
}

.detail-content {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contact-avatar-large {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-avatar-large:active {
  transform: scale(0.95);
}

.contact-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder-large {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.camera-icon-detail {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.contact-avatar-large:hover .camera-icon-detail {
  background: rgba(10, 132, 255, 0.9);
  border-color: rgba(10, 132, 255, 0.5);
  transform: scale(1.1);
}

.contact-avatar-large:active .camera-icon-detail {
  transform: scale(0.95);
}

.contact-name {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: -0.5px;
}

.contact-details {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(28, 28, 30, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(10, 132, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a84ff;
  flex-shrink: 0;
}

.detail-info {
  flex: 1;
  min-width: 0;
}

.detail-label {
  font-size: 13px;
  color: #8e8e93;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.detail-value {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-delete {
  width: 100%;
  max-width: 500px;
  background: rgba(255, 69, 58, 0.15);
  border: 1px solid rgba(255, 69, 58, 0.3);
  border-radius: 14px;
  color: #ff453a;
  padding: 16px;
  font-size: 17px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-delete:active {
  transform: scale(0.98);
  background: rgba(255, 69, 58, 0.25);
}

@media (hover: hover) {
  .btn-delete:hover {
    background: rgba(255, 69, 58, 0.25);
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: rgba(28, 28, 30, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  font-size: 16px;
  line-height: 1.5;
  color: #e5e5e7;
  margin-bottom: 12px;
}

.modal-body strong {
  color: #fff;
  font-weight: 600;
}

.modal-warning {
  font-size: 14px;
  color: #ff453a;
  margin-bottom: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
}

.btn-modal-cancel,
.btn-modal-delete {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-modal-cancel {
  background: rgba(58, 58, 60, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-modal-cancel:active {
  transform: scale(0.98);
  background: rgba(58, 58, 60, 0.7);
}

.btn-modal-delete {
  background: #ff453a;
  border: none;
  color: #fff;
}

.btn-modal-delete:active:not(:disabled) {
  transform: scale(0.98);
  background: #ff3b30;
}

.btn-modal-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

/* Toast */
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
  .detail-header {
    padding: 40px 16px 16px;
  }

  .detail-content {
    padding: 30px 16px;
  }

  .contact-avatar-large {
    width: 120px;
    height: 120px;
  }

  .avatar-placeholder-large {
    font-size: 48px;
  }

  .contact-name {
    font-size: 28px;
  }

  .camera-icon-detail {
    width: 36px;
    height: 36px;
    bottom: 6px;
    right: 6px;
  }

  .camera-icon-detail svg {
    width: 20px;
    height: 20px;
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
