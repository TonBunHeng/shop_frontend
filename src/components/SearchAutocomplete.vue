<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  allProducts,
  categories,
  clearSearchHistory,
  formatPrice,
  removeSearchHistoryItem,
  searchHistory,
} from '../data/store'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const query = ref('')
const isOpen = ref(false)
const inputRef = ref(null)
const containerRef = ref(null)

const popularSearches = ['MacBook Pro', 'Sony WH-1000XM5', 'Mechanical Keyboard', 'OLED Monitor', 'iPad Pro']

const matchingProducts = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase().trim()
  return allProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
    .slice(0, 5)
})

const matchingCategories = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase().trim()
  return categories
    .filter((c) => c.id !== 'all' && c.name.toLowerCase().includes(q))
    .slice(0, 3)
})

const handleSearch = (searchTerm) => {
  const term = searchTerm || query.value
  if (!term.trim()) return

  isOpen.value = false
  props.navigate('search', { q: term.trim() })
}

const selectCategory = (cat) => {
  isOpen.value = false
  props.navigate('shop', { category: cat })
}

const selectProduct = (productId) => {
  isOpen.value = false
  props.navigate('product', { id: productId })
}

const handleClickOutside = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="containerRef" class="relative w-full">
    <!-- Search Bar Input -->
    <form @submit.prevent="handleSearch(query)" class="relative flex items-center">
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        placeholder="Search electronics, laptops, audio..."
        @focus="isOpen = true"
        class="w-full bg-gray-50 hover:bg-white focus:bg-white text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm rounded-md pl-9 pr-8 py-2 border border-gray-300 focus:outline-hidden focus:border-blue-600 transition-colors"
      />
      <svg class="w-4 h-4 text-gray-400 absolute left-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <button
        v-if="query"
        type="button"
        @click="query = ''; inputRef?.focus()"
        class="absolute right-2.5 text-gray-400 hover:text-gray-600 text-xs"
      >
        ✕
      </button>
    </form>

    <!-- Suggestions Dropdown -->
    <div
      v-if="isOpen"
      class="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50 text-xs overflow-hidden"
    >
      <!-- Query is typed: show matched products & categories -->
      <div v-if="query.trim()">
        <!-- Matching Categories -->
        <div v-if="matchingCategories.length > 0" class="px-3 py-1 border-b border-gray-100">
          <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Categories</span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="cat in matchingCategories"
              :key="cat.id"
              type="button"
              @click="selectCategory(cat.id)"
              class="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs transition-colors cursor-pointer"
            >
              in {{ cat.name }} &rarr;
            </button>
          </div>
        </div>

        <!-- Matching Products -->
        <div v-if="matchingProducts.length > 0" class="py-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 block mb-1">Products</span>
          <div
            v-for="prod in matchingProducts"
            :key="prod.id"
            @click="selectProduct(prod.id)"
            class="px-3 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <img :src="prod.image" :alt="prod.name" class="w-8 h-8 rounded object-cover border border-gray-100 shrink-0" />
              <div class="truncate">
                <p class="font-medium text-gray-900 truncate">{{ prod.name }}</p>
                <p class="text-[10px] text-gray-500">{{ prod.brand }} · {{ prod.category }}</p>
              </div>
            </div>
            <span class="font-bold text-gray-900 shrink-0 font-mono">${{ formatPrice(prod.price) }}</span>
          </div>
        </div>

        <div v-else class="p-4 text-center text-gray-500">
          No matching products for "{{ query }}"
        </div>

        <!-- View all results link -->
        <div class="p-2 border-t border-gray-100 bg-gray-50 text-center">
          <button
            type="button"
            @click="handleSearch(query)"
            class="text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            See all results for "{{ query }}" &rarr;
          </button>
        </div>
      </div>

      <!-- No query: show popular and recent searches -->
      <div v-else class="space-y-3 p-3">
        <!-- Recent searches -->
        <div v-if="searchHistory.length > 0">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Recent Searches</span>
            <button
              type="button"
              @click="clearSearchHistory"
              class="text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div class="flex flex-wrap gap-1.5">
            <div
              v-for="item in searchHistory"
              :key="item"
              class="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded text-xs text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <button type="button" @click="handleSearch(item)" class="cursor-pointer">
                {{ item }}
              </button>
              <button
                type="button"
                @click.stop="removeSearchHistoryItem(item)"
                class="text-gray-400 hover:text-gray-600 ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Popular Searches -->
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Trending Searches</span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="pop in popularSearches"
              :key="pop"
              type="button"
              @click="handleSearch(pop)"
              class="px-2.5 py-1 border border-gray-200 hover:border-gray-300 rounded text-xs text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <AppIcon name="search" size="xs" className="text-gray-400" />
              <span>{{ pop }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
