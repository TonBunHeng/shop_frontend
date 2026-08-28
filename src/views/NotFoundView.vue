<script setup>
import { ref } from 'vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const query = ref('')

const handleSearch = () => {
  if (query.value.trim()) {
    props.navigate('search', { q: query.value.trim() })
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
    <div class="space-y-2">
      <span class="text-6xl font-bold font-mono text-gray-400 block">404</span>
      <h1 class="text-2xl font-bold text-gray-900">Page Not Found</h1>
      <p class="text-xs text-gray-500 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
    </div>

    <!-- Search input -->
    <form @submit.prevent="handleSearch" class="flex gap-2 max-w-sm mx-auto">
      <input
        v-model="query"
        type="text"
        placeholder="Search products..."
        class="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:outline-hidden focus:border-blue-600"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
      >
        Search
      </button>
    </form>

    <!-- Navigation Shortcuts -->
    <div class="pt-4 flex justify-center gap-3 text-xs">
      <button
        type="button"
        @click="navigate('home')"
        class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded transition-colors cursor-pointer"
      >
        Go to Homepage
      </button>

      <button
        type="button"
        @click="navigate('shop')"
        class="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded transition-colors cursor-pointer"
      >
        Browse Catalog
      </button>
    </div>
  </div>
</template>
