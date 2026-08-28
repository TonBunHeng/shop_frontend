<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { allProducts, brands, categories, formatPrice } from '../data/store'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import EmptyState from '../components/EmptyState.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductFilters from '../components/ProductFilters.vue'
import ProductSkeleton from '../components/ProductSkeleton.vue'

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

const selectedCategory = ref('All')
const selectedBrand = ref('All')
const priceRange = ref(3000)
const minRating = ref(0)
const onlyInStock = ref(false)
const onlyOnSale = ref(false)
const sortBy = ref('featured')
const layoutMode = ref('grid') // 'grid' | 'list'
const isMobileFiltersOpen = ref(false)
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(8)

// Synchronize query parameters
onMounted(() => {
  if (props.params?.category) {
    selectedCategory.value = props.params.category
  }
  if (props.params?.brand) {
    selectedBrand.value = props.params.brand
  }
})

watch(
  () => props.params?.category,
  (newCat) => {
    if (newCat) selectedCategory.value = newCat
  }
)

const resetFilters = () => {
  selectedCategory.value = 'All'
  selectedBrand.value = 'All'
  priceRange.value = 3000
  minRating.value = 0
  onlyInStock.value = false
  onlyOnSale.value = false
  currentPage.value = 1
}

const categoryName = computed(() => {
  if (selectedCategory.value === 'All') return 'All Products'
  const found = categories.find((c) => c.id.toLowerCase() === selectedCategory.value.toLowerCase())
  return found ? found.name : selectedCategory.value
})

const filteredProducts = computed(() => {
  let list = [...allProducts]

  if (selectedCategory.value !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === selectedCategory.value.toLowerCase())
  }

  if (selectedBrand.value !== 'All') {
    list = list.filter((p) => p.brand.toLowerCase() === selectedBrand.value.toLowerCase())
  }

  if (priceRange.value < 3000) {
    list = list.filter((p) => p.price <= priceRange.value)
  }

  if (minRating.value > 0) {
    list = list.filter((p) => p.rating >= minRating.value)
  }

  if (onlyInStock.value) {
    list = list.filter((p) => p.stock > 0)
  }

  if (onlyOnSale.value) {
    list = list.filter((p) => p.badge === 'SALE' || p.originalPrice > p.price)
  }

  // Sorting
  if (sortBy.value === 'price-asc') {
    list.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    list.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'rating') {
    list.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'newest') {
    list.sort((a, b) => b.id - a.id)
  } else if (sortBy.value === 'discount') {
    list.sort((a, b) => {
      const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0
      const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0
      return discB - discA
    })
  }

  return list
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage.value))
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

const breadcrumbs = computed(() => {
  const list = [{ label: 'Home', page: 'welcome' }, { label: 'Shop Catalog' }]
  if (selectedCategory.value !== 'All') {
    list.push({ label: categoryName.value })
  }
  return list
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Page Header & Summary -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          {{ categoryName }}
        </h1>
        <p class="text-xs text-gray-500 mt-0.5">
          Showing <strong>{{ filteredProducts.length }}</strong> products available
        </p>
      </div>

      <!-- Mobile Filter Button Trigger -->
      <button
        type="button"
        @click="isMobileFiltersOpen = true"
        class="lg:hidden px-4 py-2 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 self-start cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span>Filter Products</span>
      </button>
    </div>

    <!-- Active Filter Chips -->
    <div
      v-if="selectedCategory !== 'All' || selectedBrand !== 'All' || priceRange < 3000 || minRating > 0 || onlyInStock || onlyOnSale"
      class="flex flex-wrap items-center gap-2 text-xs"
    >
      <span class="text-gray-500 font-medium">Active Filters:</span>

      <span
        v-if="selectedCategory !== 'All'"
        class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200"
      >
        Category: {{ categoryName }}
        <button type="button" @click="selectedCategory = 'All'" class="cursor-pointer font-bold ml-1">✕</button>
      </span>

      <span
        v-if="selectedBrand !== 'All'"
        class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200"
      >
        Brand: {{ selectedBrand }}
        <button type="button" @click="selectedBrand = 'All'" class="cursor-pointer font-bold ml-1">✕</button>
      </span>

      <span
        v-if="priceRange < 3000"
        class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200"
      >
        Under ${{ formatPrice(priceRange) }}
        <button type="button" @click="priceRange = 3000" class="cursor-pointer font-bold ml-1">✕</button>
      </span>

      <button
        type="button"
        @click="resetFilters"
        class="text-blue-600 hover:underline font-semibold ml-2 cursor-pointer"
      >
        Clear All
      </button>
    </div>

    <!-- Main Content Layout (Sidebar 3 cols + Grid 9 cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left: Filter Sidebar (3 cols) -->
      <div class="lg:col-span-3">
        <ProductFilters
          v-model:selected-category="selectedCategory"
          v-model:selected-brand="selectedBrand"
          v-model:price-range="priceRange"
          v-model:min-rating="minRating"
          v-model:only-in-stock="onlyInStock"
          v-model:only-on-sale="onlyOnSale"
          :is-mobile-open="isMobileFiltersOpen"
          @reset="resetFilters"
          @close-mobile="isMobileFiltersOpen = false"
        />
      </div>

      <!-- Right: Products Catalog Grid (9 cols) -->
      <div class="lg:col-span-9 space-y-6">
        <!-- Toolbar (Sort, View Mode) -->
        <div class="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-4 text-xs">
          <!-- Sorting dropdown -->
          <div class="flex items-center gap-2">
            <label class="text-gray-500 font-medium hidden sm:inline">Sort by:</label>
            <select
              v-model="sortBy"
              class="bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>

          <!-- View Layout Toggle Buttons -->
          <div class="flex items-center gap-1 border border-gray-200 rounded p-0.5">
            <button
              type="button"
              @click="layoutMode = 'grid'"
              class="p-1 rounded cursor-pointer transition-colors"
              :class="layoutMode === 'grid' ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:text-gray-700'"
              title="Grid View"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>

            <button
              type="button"
              @click="layoutMode = 'list'"
              class="p-1 rounded cursor-pointer transition-colors"
              :class="layoutMode === 'list' ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:text-gray-700'"
              title="List View"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Products List / Grid -->
        <div v-if="paginatedProducts.length > 0">
          <div
            class="gap-4"
            :class="[
              layoutMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                : 'space-y-4'
            ]"
          >
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              :layout="layoutMode"
              :navigate="navigate"
            />
          </div>

          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="flex items-center justify-between pt-6 border-t border-gray-200 text-xs">
            <span class="text-gray-500">
              Page <strong>{{ currentPage }}</strong> of <strong>{{ totalPages }}</strong>
            </span>

            <div class="flex items-center gap-1">
              <button
                type="button"
                @click="currentPage--"
                :disabled="currentPage <= 1"
                class="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent font-medium cursor-pointer"
              >
                &larr; Prev
              </button>

              <button
                v-for="p in totalPages"
                :key="p"
                type="button"
                @click="currentPage = p"
                class="w-7 h-7 rounded border font-medium cursor-pointer transition-colors"
                :class="currentPage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
              >
                {{ p }}
              </button>

              <button
                type="button"
                @click="currentPage++"
                :disabled="currentPage >= totalPages"
                class="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent font-medium cursor-pointer"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>

        <!-- Empty Products State -->
        <EmptyState
          v-else
          icon="search"
          title="No products matched your filters"
          description="Try broadening your search criteria or resetting filters to see more electronics."
          action-text="Reset All Filters"
          :action-click="resetFilters"
        />
      </div>
    </div>
  </div>
</template>
