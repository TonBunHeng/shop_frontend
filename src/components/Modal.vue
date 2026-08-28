<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: String,
    default: 'max-w-xl', // 'max-w-md' | 'max-w-xl' | 'max-w-3xl' | 'max-w-5xl'
  },
})

const emit = defineEmits(['close'])

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        @click="emit('close')"
      ></div>

      <!-- Modal Card -->
      <div
        class="relative w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all z-10 my-8"
        :class="maxWidth"
        @click.stop
      >
        <!-- Header -->
        <div v-if="title" class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-base sm:text-lg font-bold text-slate-900">{{ title }}</h3>
          <button
            type="button"
            @click="emit('close')"
            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <button
          v-else
          type="button"
          @click="emit('close')"
          class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          aria-label="Close dialog"
        >
          ✕
        </button>

        <!-- Body -->
        <div class="p-6">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
