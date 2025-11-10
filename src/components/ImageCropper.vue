<!-- src/components/ImageCropper.vue -->
<template>
  <Transition name="modal">
    <div v-if="show" class="cropper-overlay" @click="emit('close')">
      <div class="cropper-container" @click.stop>
        <div class="cropper-header">
          <button @click="emit('close')" class="btn-cancel">Cancelar</button>
          <h3>Ajustar Foto</h3>
          <button @click="handleCrop" class="btn-save" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>

        <div class="cropper-content">
          <div class="image-container" ref="imageContainer">
            <img ref="imageElement" :src="imageSrc" alt="Crop" @load="initCropper" />
          </div>

          <div class="cropper-controls">
            <div class="control-group">
              <label>Zoom</label>
              <div class="slider-container">
                <button @click="zoomOut" class="btn-zoom">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
                    <path
                      d="M8 11h6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M21 21l-4.35-4.35"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
                <input
                  type="range"
                  v-model.number="zoomLevel"
                  min="1"
                  max="3"
                  step="0.1"
                  class="slider"
                  @input="handleZoom"
                />
                <button @click="zoomIn" class="btn-zoom">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
                    <path
                      d="M11 8v6M8 11h6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M21 21l-4.35-4.35"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="control-group">
              <label>Rotação</label>
              <div class="rotation-buttons">
                <button @click="rotateLeft" class="btn-rotate">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2.5 2v6h6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.66 15.57a10 10 0 1 0 .57-8.38"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Girar Esquerda
                </button>
                <button @click="rotateRight" class="btn-rotate">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21.5 2v6h-6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.34 15.57a10 10 0 1 1-.57-8.38"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Girar Direita
                </button>
              </div>
            </div>

            <div class="control-group">
              <label>Espelhar</label>
              <div class="flip-buttons">
                <button @click="flipHorizontal" class="btn-flip">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2v20M17 7l-5 5 5 5M7 7l5 5-5 5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Horizontal
                </button>
                <button @click="flipVertical" class="btn-flip">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2 12h20M7 17l5-5 5 5M7 7l5 5 5-5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Vertical
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

interface Props {
  show: boolean
  imageSrc: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  crop: [blob: Blob]
}>()

const imageElement = ref<HTMLImageElement | null>(null)
const imageContainer = ref<HTMLDivElement | null>(null)
const loading = ref(false)
const zoomLevel = ref(1)

let cropper: any = null

const initCropper = () => {
  if (imageElement.value && !cropper) {
    cropper = new Cropper(imageElement.value, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      restore: false,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      background: false,
      minContainerWidth: 300,
      minContainerHeight: 300,
    } as any)
  }
}

const handleZoom = () => {
  if (cropper) {
    cropper.zoomTo(zoomLevel.value)
  }
}

const zoomIn = () => {
  zoomLevel.value = Math.min(3, zoomLevel.value + 0.1)
  handleZoom()
}

const zoomOut = () => {
  zoomLevel.value = Math.max(1, zoomLevel.value - 0.1)
  handleZoom()
}

const rotateLeft = () => {
  if (cropper) {
    cropper.rotate(-90)
  }
}

const rotateRight = () => {
  if (cropper) {
    cropper.rotate(90)
  }
}

const flipHorizontal = () => {
  if (cropper) {
    const data = cropper.getData()
    cropper.scaleX(data.scaleX === 1 ? -1 : 1)
  }
}

const flipVertical = () => {
  if (cropper) {
    const data = cropper.getData()
    cropper.scaleY(data.scaleY === 1 ? -1 : 1)
  }
}

const handleCrop = () => {
  if (cropper) {
    loading.value = true

    cropper
      .getCroppedCanvas({
        width: 800,
        height: 800,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      })
      .toBlob(
        (blob: Blob | null) => {
          if (blob) {
            emit('crop', blob)
          }
          loading.value = false
        },
        'image/jpeg',
        0.9,
      )
  }
}

watch(
  () => props.show,
  (newVal) => {
    if (!newVal && cropper) {
      cropper.destroy()
      cropper = null
      zoomLevel.value = 1
    }
  },
)

onUnmounted(() => {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
})
</script>

<style scoped>
.cropper-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.cropper-container {
  background: rgba(28, 28, 30, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.cropper-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.cropper-header h3 {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
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

.cropper-content {
  padding: 24px;
  overflow-y: auto;
}

.image-container {
  width: 100%;
  max-height: 400px;
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
}

.image-container img {
  max-width: 100%;
  display: block;
}

.cropper-controls {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-group label {
  font-size: 14px;
  font-weight: 600;
  color: #8e8e93;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: rgba(58, 58, 60, 0.5);
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #0a84ff;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(10, 132, 255, 0.5);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #0a84ff;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(10, 132, 255, 0.5);
}

.btn-zoom,
.btn-rotate,
.btn-flip {
  background: rgba(58, 58, 60, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.btn-zoom {
  padding: 12px;
}

.btn-zoom:active,
.btn-rotate:active,
.btn-flip:active {
  transform: scale(0.95);
  background: rgba(58, 58, 60, 0.7);
}

@media (hover: hover) {
  .btn-zoom:hover,
  .btn-rotate:hover,
  .btn-flip:hover {
    background: rgba(58, 58, 60, 0.7);
    border-color: #0a84ff;
  }
}

.rotation-buttons,
.flip-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .cropper-container,
.modal-leave-to .cropper-container {
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 768px) {
  .cropper-overlay {
    padding: 0;
  }

  .cropper-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .cropper-header {
    padding: 16px 20px;
  }

  .cropper-content {
    padding: 20px;
  }

  .image-container {
    max-height: 300px;
  }

  .rotation-buttons,
  .flip-buttons {
    grid-template-columns: 1fr;
  }
}

/* Estilos do Cropper.js customizados */
:deep(.cropper-view-box),
:deep(.cropper-face) {
  border-radius: 50%;
  outline: 0;
}

:deep(.cropper-view-box) {
  box-shadow: 0 0 0 1px #39f;
  outline: 0;
}

:deep(.cropper-point),
:deep(.cropper-line) {
  display: none;
}

:deep(.cropper-dashed) {
  border: 0;
}

:deep(.cropper-center) {
  opacity: 0;
}

:deep(.cropper-bg) {
  background-image: none;
}

:deep(.cropper-container) {
  background: transparent;
}

:deep(.cropper-modal) {
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 1;
}
</style>
