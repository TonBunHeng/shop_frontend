<script setup>
import { computed, onMounted } from 'vue'
import {
  allProducts,
  categories,
  filteredProducts,
  searchQuery,
  selectedCategory,
} from '../data/store'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import EmptyState from '../components/EmptyState.vue'
import ProductCard from '../components/ProductCard.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
})

onMounted(() => {
  if (props.params?.q) {
    searchQuery.value = props.params.q
  }
})

const results = computed(() => {
  if (!searchQuery.value.trim()) return allProducts
  const q = searchQuery.value.toLowerCase().trim()
  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
  )
})

const popularSearches = ['MacBook', 'Sony ANC', 'OLED Display', 'Wireless Mouse', 'Titanium iPhone']

const searchPopular = (term) => {
  searchQuery.value = term
}

const breadcrumbs = computed(() => [
  { label: 'Home', page: 'welcome' },
  { label: 'Search Results' },
])
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Search Header -->
    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Search Results</span>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            <span v-if="searchQuery">"{{ searchQuery }}"</span>
            <span v-else>All Products</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Found <strong>{{ results.length }}</strong> products matching your query
          </p>
        </div>

        <button
          v-if="searchQuery"
          type="button"
          @click="searchQuery = ''"
          class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          Clear Search
        </button>
      </div>

      <!-- Popular query shortcuts -->
      <div class="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
        <span class="text-xs font-bold text-slate-500">Popular:</span>
        <button
          v-for="term in popularSearches"
          :key="term"
          type="button"
          @click="searchPopular(term)"
          class="px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
        >
          {{ term }}
        </button>
      </div>
    </div>

    <!-- Results Grid -->
    <div v-if="results.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in results"
        :key="product.id"
        :product="product"
        :navigate="navigate"
      />
    </div>

    <!-- Empty Results -->
    <EmptyState
      v-else
      icon="search"
      title="No products found"
      :description="`We couldn't find any products matching &quot;${searchQuery}&quot;. Try checking for typos or searching a broader term.`"
      action-text="Browse All Products"
      :action-click="() => { searchQuery = ''; navigate('shop'); }"
    />
  </div>
</template>
