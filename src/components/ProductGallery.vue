<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  alt: {
    type: String,
    default: 'Product image',
  },
  badge: {
    type: String,
    default: '',
  },
})

const activeIndex = ref(0)
const isZoomed = ref(false)
const zoomPosition = ref({ x: 50, y: 50 })
const isLightboxOpen = ref(false)

const currentImage = computed(() => {
  return props.images && props.images.length > 0
    ? props.images[activeIndex.value] || props.images[0]
    : ''
})

const handleMouseMove = (e) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - left) / width) * 100
  const y = ((e.clientY - top) / height) * 100
  zoomPosition.value = { x, y }
}

const prevImage = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
  } else {
    activeIndex.value = props.images.length - 1
  }
}

const nextImage = () => {
  if (activeIndex.value < props.images.length - 1) {
    activeIndex.value++
  } else {
    activeIndex.value = 0
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Main Display Frame -->
    <div
      class="relative aspect-4/3 sm:aspect-square w-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs cursor-crosshair group select-none"
      @mouseenter="isZoomed = true"
      @mouseleave="isZoomed = false"
      @mousemove="handleMouseMove"
      @click="isLightboxOpen = true"
    >
      <!-- Main Image -->
      <img
        :src="currentImage"
        :alt="alt"
        class="w-full h-full object-cover object-center transition-transform duration-200"
        :style="isZoomed ? {
          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          transform: 'scale(1.7)'
        } : {}"
      />

      <!-- Badge Overlay -->
      <div v-if="badge" class="absolute top-4 left-4 z-10">
        <span class="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-900 text-white shadow-md">
          {{ badge }}
        </span>
      </div>

      <!-- Zoom indicator icon -->
      <button
        type="button"
        @click.stop="isLightboxOpen = true"
        class="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-indigo-600 shadow-sm flex items-center justify-center transition-all group-hover:scale-110"
        title="View Fullscreen"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      </button>
    </div>

    <!-- Thumbnails Strip -->
    <div v-if="images && images.length > 1" class="flex items-center gap-3 overflow-x-auto pb-1">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        type="button"
        @click="activeIndex = idx"
        class="relative w-16 sm:w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer"
        :class="activeIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 opacity-70 hover:opacity-100'"
      >
        <img :src="img" :alt="`${alt} thumbnail ${idx + 1}`" class="w-full h-full object-cover" />
      </button>
    </div>

    <!-- Fullscreen Lightbox Modal -->
    <div
      v-if="isLightboxOpen"
      class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
      @click="isLightboxOpen = false"
    >
      <button
        type="button"
        @click="isLightboxOpen = false"
        class="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors text-lg"
      >
        ✕
      </button>

      <button
        v-if="images.length > 1"
        type="button"
        @click.stop="prevImage"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        ‹
      </button>

      <div class="max-w-4xl max-h-[85vh] relative" @click.stop>
        <img :src="currentImage" :alt="alt" class="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl" />
        <p class="text-center text-slate-300 text-xs mt-3">
          Image {{ activeIndex + 1 }} of {{ images.length }}
        </p>
      </div>

      <button
        v-if="images.length > 1"
        type="button"
        @click.stop="nextImage"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        ›
      </button>
    </div>
  </div>
</template>
