<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { allProducts, formatPrice } from '../data/store'
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

const query = ref('')

onMounted(() => {
  if (props.params?.q) {
    query.value = props.params.q
  }
})

watch(
  () => props.params?.q,
  (newQ) => {
    if (newQ) query.value = newQ
  }
)

const searchResults = computed(() => {
  if (!query.value.trim()) return allProducts
  const q = query.value.toLowerCase().trim()
  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  )
})

const breadcrumbs = computed(() => [
  { label: 'Home', page: 'welcome' },
  { label: 'Search Results' },
])
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Search Header -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900">
          Search Results
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          Found <strong>{{ searchResults.length }}</strong> products matching "<span class="text-gray-900 font-semibold">{{ query }}</span>"
        </p>
      </div>

      <div class="w-full sm:w-72">
        <input
          v-model="query"
          type="text"
          placeholder="Refine search keyword..."
          class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
        />
      </div>
    </div>

    <!-- Results Grid -->
    <div v-if="searchResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard
        v-for="product in searchResults"
        :key="product.id"
        :product="product"
        :navigate="navigate"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="search"
      :title="`No results found for '${query}'`"
      description="Check for spelling errors or try more generic electronics keywords."
      action-text="Browse All Products"
      :action-click="() => navigate('shop')"
    />
  </div>
</template>
