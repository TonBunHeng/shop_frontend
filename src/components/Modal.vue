<script setup>
import { onMounted, onUnmounted } from 'vue'

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
    default: 'max-w-lg',
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
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/40 transition-opacity"
        @click="emit('close')"
      ></div>

      <!-- Center Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden text-gray-900 z-10"
          :class="maxWidth"
          @click.stop
        >
          <!-- Modal Header -->
          <div v-if="title" class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-base font-bold text-gray-900">{{ title }}</h3>
            <button
              type="button"
              @click="emit('close')"
              class="text-gray-400 hover:text-gray-600 rounded p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
