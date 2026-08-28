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
  <div class="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
    <div class="w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-600 font-mono font-black text-4xl flex items-center justify-center mx-auto shadow-xs border border-indigo-100">
      404
    </div>

    <div class="space-y-2">
      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Page Not Found</h1>
      <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        The page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>
    </div>

    <!-- Search box -->
    <form @submit.prevent="handleSearch" class="max-w-md mx-auto flex gap-2">
      <input
        v-model="query"
        type="text"
        placeholder="Search for gadgets, laptops, headphones..."
        class="flex-1 bg-white text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-hidden focus:border-indigo-500 shadow-xs"
      />
      <button
        type="submit"
        class="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
      >
        Search
      </button>
    </form>

    <!-- Quick action links -->
    <div class="pt-4 flex items-center justify-center gap-3 flex-wrap">
      <button
        type="button"
        @click="navigate('home')"
        class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
      >
        &larr; Back to Homepage
      </button>
      <button
        type="button"
        @click="navigate('shop')"
        class="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
      >
        Explore Shop Catalog
      </button>
      <button
        type="button"
        @click="navigate('deals')"
        class="px-6 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
      >
        🔥 View Flash Deals
      </button>
    </div>
  </div>
</template>
