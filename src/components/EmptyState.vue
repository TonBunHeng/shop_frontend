<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  icon: {
    type: String,
    default: 'cart', // 'cart' | 'wishlist' | 'search' | 'orders' | 'box'
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  actionText: {
    type: String,
    default: '',
  },
  actionClick: {
    type: Function,
    default: null,
  },
})
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-10 sm:p-12 text-center max-w-lg mx-auto my-8 space-y-4">
    <!-- Clean Icon Container -->
    <div class="w-14 h-14 mx-auto rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
      <AppIcon v-if="icon === 'wishlist'" name="heart" size="lg" />
      <AppIcon v-else-if="icon === 'search'" name="search" size="lg" />
      <AppIcon v-else-if="icon === 'orders'" name="box" size="lg" />
      <AppIcon v-else name="box" size="lg" />
    </div>

    <!-- Content -->
    <div class="space-y-1.5">
      <h3 class="text-base font-bold text-gray-900">{{ title }}</h3>
      <p v-if="description" class="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
        {{ description }}
      </p>
    </div>

    <!-- Action Button -->
    <div v-if="actionText && actionClick" class="pt-2">
      <button
        type="button"
        @click="actionClick"
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs rounded transition-colors cursor-pointer"
      >
        {{ actionText }}
      </button>
    </div>
  </div>
</template>
