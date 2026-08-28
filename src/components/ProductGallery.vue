<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  productName: {
    type: String,
    default: 'Product',
  },
})

const activeIndex = ref(0)
const isZoomed = ref(false)
const isLightboxOpen = ref(false)
const zoomPosition = ref({ x: 50, y: 50 })

const activeImage = computed(() => {
  if (!props.images || props.images.length === 0) return ''
  return props.images[activeIndex.value] || props.images[0]
})

const handleMouseMove = (e) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - left) / width) * 100
  const y = ((e.clientY - top) / height) * 100
  zoomPosition.value = { x, y }
}
</script>

<template>
  <div class="space-y-3">
    <!-- Main Display Frame -->
    <div
      class="relative aspect-square bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center cursor-crosshair group"
      @mouseenter="isZoomed = true"
      @mouseleave="isZoomed = false"
      @mousemove="handleMouseMove"
      @click="isLightboxOpen = true"
    >
      <img
        :src="activeImage"
        :alt="productName"
        class="w-full h-full object-cover transition-transform duration-150"
        :style="isZoomed ? {
          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          transform: 'scale(1.75)'
        } : {}"
      />

      <!-- Fullscreen expand button badge -->
      <button
        type="button"
        @click.stop="isLightboxOpen = true"
        class="absolute bottom-3 right-3 p-1.5 rounded bg-white/90 hover:bg-white text-gray-700 shadow-sm transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
        title="View Fullscreen"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
    </div>

    <!-- Thumbnail Strip -->
    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        type="button"
        @click="activeIndex = idx"
        class="w-16 h-16 rounded border bg-gray-50 overflow-hidden shrink-0 cursor-pointer transition-colors"
        :class="activeIndex === idx ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200 opacity-70 hover:opacity-100'"
      >
        <img :src="img" :alt="`${productName} - View ${idx + 1}`" class="w-full h-full object-cover" />
      </button>
    </div>

    <!-- Fullscreen Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="isLightboxOpen"
        class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        @click="isLightboxOpen = false"
      >
        <button
          type="button"
          @click="isLightboxOpen = false"
          class="absolute top-4 right-4 text-white text-xl bg-black/40 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>

        <div class="max-w-4xl max-h-[85vh] overflow-hidden rounded-lg bg-white p-2" @click.stop>
          <img :src="activeImage" :alt="productName" class="max-h-[80vh] w-auto mx-auto object-contain" />
        </div>
      </div>
    </Teleport>
  </div>
</template>
