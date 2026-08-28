<script setup>
import { computed, ref, watch } from 'vue'
import {
  addSearchQuery,
  allProducts,
  categories,
  formatPrice,
  removeSearchQuery,
  searchHistory,
  searchQuery,
  selectedCategory,
} from '../data/store'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Search laptops, phones, headphones...',
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
})

const isFocused = ref(false)
const popularSearches = ['MacBook Pro M3', 'iPhone 16 Pro Max', 'Sony WH-1000XM5', 'Curved OLED Monitor', 'Keychron Keyboard']

const matchingProducts = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase().trim()
  return allProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    )
    .slice(0, 5)
})

const matchingCategories = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase().trim()
  return categories.filter((c) => c.id !== 'all' && c.name.toLowerCase().includes(q))
})

const handleSearchSubmit = () => {
  if (searchQuery.value.trim()) {
    addSearchQuery(searchQuery.value.trim())
    isFocused.value = false
    props.navigate('search', { q: searchQuery.value.trim() })
  }
}

const selectPopular = (term) => {
  searchQuery.value = term
  addSearchQuery(term)
  isFocused.value = false
  props.navigate('search', { q: term })
}

const selectCategory = (catId) => {
  selectedCategory.value = catId
  searchQuery.value = ''
  isFocused.value = false
  props.navigate('shop', { category: catId })
}

const selectProduct = (productId) => {
  if (searchQuery.value.trim()) {
    addSearchQuery(searchQuery.value.trim())
  }
  isFocused.value = false
  props.navigate('product', { id: productId })
}

const handleClear = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="relative w-full">
    <!-- Search Bar Input -->
    <form @submit.prevent="handleSearchSubmit" class="relative w-full">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        @focus="isFocused = true"
        class="w-full bg-slate-100/80 hover:bg-slate-100 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-full pl-10 pr-9 py-2 sm:py-2.5 border border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:outline-hidden transition-all shadow-xs"
      />

      <!-- Search Icon -->
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        type="button"
        @click="handleClear"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        aria-label="Clear search"
      >
        ✕
      </button>
    </form>

    <!-- Backdrop for dropdown blur -->
    <div
      v-if="isFocused"
      class="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
      @click="isFocused = false"
    ></div>

    <!-- Autocomplete Results Dropdown -->
    <div
      v-if="isFocused"
      class="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 max-h-[80vh] overflow-y-auto"
      @mousedown.stop
    >
      <!-- Mode 1: Empty search -> Show Recent & Popular -->
      <div v-if="!searchQuery.trim()" class="space-y-4">
        <!-- Recent Searches -->
        <div v-if="searchHistory.length > 0">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Searches</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <div
              v-for="item in searchHistory"
              :key="item"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              <button type="button" @click="selectPopular(item)" class="cursor-pointer">
                {{ item }}
              </button>
              <button
                type="button"
                @click.stop="removeSearchQuery(item)"
                class="text-slate-400 hover:text-slate-700 ml-0.5"
                title="Remove"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Popular Searches -->
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Popular Searches</span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="item in popularSearches"
              :key="item"
              type="button"
              @click="selectPopular(item)"
              class="px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              🔥 {{ item }}
            </button>
          </div>
        </div>

        <!-- Quick Categories -->
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Browse Categories</span>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="cat in categories.filter(c => c.id !== 'all')"
              :key="cat.id"
              type="button"
              @click="selectCategory(cat.id)"
              class="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-left flex items-center gap-2 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              <img :src="cat.image" :alt="cat.name" class="w-7 h-7 rounded-lg object-cover" />
              <span class="truncate">{{ cat.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mode 2: Searching -> Matching Products & Categories -->
      <div v-else class="space-y-4">
        <!-- Matching Categories -->
        <div v-if="matchingCategories.length > 0">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Categories</span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="cat in matchingCategories"
              :key="cat.id"
              type="button"
              @click="selectCategory(cat.id)"
              class="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              In {{ cat.name }} &rarr;
            </button>
          </div>
        </div>

        <!-- Matching Products -->
        <div v-if="matchingProducts.length > 0">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Products</span>
            <span class="text-[11px] text-slate-400">{{ matchingProducts.length }} matches</span>
          </div>

          <div class="divide-y divide-slate-100">
            <div
              v-for="product in matchingProducts"
              :key="product.id"
              @click="selectProduct(product.id)"
              class="py-2.5 flex items-center gap-3 hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
            >
              <img :src="product.image" :alt="product.name" class="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-100" />
              
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-slate-900 truncate">{{ product.name }}</p>
                <p class="text-[11px] text-slate-500 truncate">{{ product.brand }} · {{ product.category }}</p>
              </div>

              <div class="text-right shrink-0">
                <p class="text-xs font-bold text-slate-900">${{ formatPrice(product.price) }}</p>
                <p v-if="product.originalPrice" class="text-[10px] text-slate-400 line-through">
                  ${{ formatPrice(product.originalPrice) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- No matching products -->
        <div v-else class="py-6 text-center text-slate-500 text-xs">
          No products directly matching "<strong class="text-slate-800">{{ searchQuery }}</strong>"
        </div>

        <!-- View All Results CTA -->
        <button
          type="button"
          @click="handleSearchSubmit"
          class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>See all results for "{{ searchQuery }}"</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  </div>
</template>
