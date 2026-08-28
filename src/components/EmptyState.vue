<script setup>
defineProps({
  icon: {
    type: String,
    default: 'cart', // 'cart' | 'wishlist' | 'search' | 'compare' | 'orders' | 'box'
  },
  title: {
    type: String,
    default: 'Nothing here yet',
  },
  description: {
    type: String,
    default: 'Explore our catalog to find exciting tech products and deals.',
  },
  actionText: {
    type: String,
    default: 'Explore Shop',
  },
  actionClick: {
    type: Function,
    default: null,
  },
})
</script>

<template>
  <div class="py-16 px-6 text-center max-w-md mx-auto flex flex-col items-center">
    <!-- Icon Container with gradient ring -->
    <div class="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 shadow-xs">
      <!-- Cart Icon -->
      <svg v-if="icon === 'cart'" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <!-- Wishlist Heart -->
      <svg v-else-if="icon === 'wishlist'" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <!-- Search Glass -->
      <svg v-else-if="icon === 'search'" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <!-- Compare Scale -->
      <svg v-else-if="icon === 'compare'" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
      <!-- Orders Box -->
      <svg v-else class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>

    <h3 class="text-lg sm:text-xl font-bold text-slate-900 mb-2">{{ title }}</h3>
    <p class="text-sm text-slate-500 mb-6 leading-relaxed">{{ description }}</p>

    <button
      v-if="actionClick"
      type="button"
      @click="actionClick"
      class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
    >
      {{ actionText }}
    </button>
  </div>
</template>
