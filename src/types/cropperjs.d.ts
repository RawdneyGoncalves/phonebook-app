declare module 'cropperjs' {
  export interface CropperOptions {
    aspectRatio?: number
    viewMode?: number
    dragMode?: 'crop' | 'move' | 'none'
    autoCropArea?: number
    restore?: boolean
    guides?: boolean
    center?: boolean
    highlight?: boolean
    cropBoxMovable?: boolean
    cropBoxResizable?: boolean
    toggleDragModeOnDblclick?: boolean
    background?: boolean
    minContainerWidth?: number
    minContainerHeight?: number
    [key: string]: any
  }

  export default class Cropper {
    constructor(element: HTMLImageElement, options?: CropperOptions)

    // Métodos principais
    crop(): void
    reset(): void
    clear(): void
    replace(url: string, onlyColorChanged?: boolean): void
    enable(): void
    disable(): void
    destroy(): void
    move(offsetX: number, offsetY?: number): void
    moveTo(x: number, y?: number): void
    zoom(ratio: number): void
    zoomTo(ratio: number, pivot?: { x: number; y: number }): void
    rotate(degree: number): void
    rotateTo(degree: number): void
    scale(scaleX: number, scaleY?: number): void
    scaleX(scaleX: number): void
    scaleY(scaleY: number): void
    getData(rounded?: boolean): CropperData
    setData(data: CropperData): void
    getContainerData(): ContainerData
    getImageData(): ImageData
    getCanvasData(): CanvasData
    setCanvasData(data: CanvasData): void
    getCropBoxData(): CropBoxData
    setCropBoxData(data: CropBoxData): void
    getCroppedCanvas(options?: GetCroppedCanvasOptions): HTMLCanvasElement
    setAspectRatio(aspectRatio: number): void
    setDragMode(mode: 'crop' | 'move' | 'none'): void
  }

  export interface CropperData {
    x: number
    y: number
    width: number
    height: number
    rotate: number
    scaleX: number
    scaleY: number
  }

  export interface ContainerData {
    width: number
    height: number
  }

  export interface ImageData {
    left: number
    top: number
    width: number
    height: number
    naturalWidth: number
    naturalHeight: number
    aspectRatio: number
    rotate: number
    scaleX: number
    scaleY: number
  }

  export interface CanvasData {
    left: number
    top: number
    width: number
    height: number
    naturalWidth: number
    naturalHeight: number
  }

  export interface CropBoxData {
    left: number
    top: number
    width: number
    height: number
  }

  export interface GetCroppedCanvasOptions {
    width?: number
    height?: number
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    fillColor?: string
    imageSmoothingEnabled?: boolean
    imageSmoothingQuality?: 'low' | 'medium' | 'high'
  }
}
