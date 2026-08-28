<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  allProducts,
  filteredProducts,
  searchQuery,
  selectedBrand,
  selectedCategory,
  sortBy,
  viewMode,
} from '../data/store'
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

const isLoading = ref(true)
const isMobileFiltersOpen = ref(false)
const currentPageNum = ref(1)
const itemsPerPage = ref(8)

onMounted(() => {
  if (props.params?.category) {
    selectedCategory.value = props.params.category
  }
  setTimeout(() => {
    isLoading.value = false
  }, 150)
})

// Pagination
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage.value))
)

const paginatedProducts = computed(() => {
  const start = (currentPageNum.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

const resetFilters = () => {
  selectedCategory.value = 'all'
  selectedBrand.value = 'All Brands'
  searchQuery.value = ''
  sortBy.value = 'featured'
  currentPageNum.value = 1
}

const breadcrumbs = computed(() => [
  { label: 'Home', page: 'welcome' },
  { label: 'Shop Catalog', page: 'shop' },
  ...(selectedCategory.value !== 'all' ? [{ label: selectedCategory.value.charAt(0).toUpperCase() + selectedCategory.value.slice(1) }] : []),
])
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Page Header Banner -->
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
      <div>
        <span class="text-xs font-black uppercase tracking-widest text-indigo-400">TechNova Store</span>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
          Explore Electronics Catalog
        </h1>
        <p class="text-xs sm:text-sm text-slate-300 mt-1">
          Showing {{ filteredProducts.length }} pro-grade electronics and accessories
        </p>
      </div>

      <!-- Quick stats / tag -->
      <div class="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/10">
        <span class="text-xs font-bold">Free Returns · 2-Year Warranty</span>
      </div>
    </div>

    <!-- Main Content Layout (Sidebar + Grid) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Desktop Sidebar Filter (3 cols) -->
      <aside class="hidden lg:block lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs sticky top-24">
        <ProductFilters />
      </aside>

      <!-- Mobile Filters Drawer -->
      <div v-if="isMobileFiltersOpen" class="fixed inset-0 z-50 lg:hidden flex">
        <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" @click="isMobileFiltersOpen = false"></div>
        <div class="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 class="text-base font-bold text-slate-900">Filter Products</h3>
            <button type="button" @click="isMobileFiltersOpen = false" class="text-slate-400 p-1">✕</button>
          </div>
          <ProductFilters :is-mobile-drawer="true" @close="isMobileFiltersOpen = false" />
        </div>
      </div>

      <!-- Catalog Main Area (9 cols) -->
      <div class="lg:col-span-9 space-y-6">
        <!-- Top Toolbar -->
        <div class="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <!-- Mobile Filter Button & Product Count -->
          <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              @click="isMobileFiltersOpen = true"
              class="lg:hidden px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filters</span>
            </button>

            <span class="text-xs font-semibold text-slate-500">
              Showing <strong>{{ paginatedProducts.length }}</strong> of <strong>{{ filteredProducts.length }}</strong> items
            </span>
          </div>

          <!-- Sort Select & View Mode (Grid/List) -->
          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            <!-- Sort Selector -->
            <div class="flex items-center gap-1.5 text-xs text-slate-600">
              <label for="shopSortSelect" class="font-medium whitespace-nowrap">Sort:</label>
              <select
                id="shopSortSelect"
                v-model="sortBy"
                class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            <!-- Grid/List Switcher -->
            <div class="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                @click="viewMode = 'grid'"
                class="p-1.5 rounded-lg transition-colors cursor-pointer"
                :class="viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'"
                title="Grid view"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>

              <button
                type="button"
                @click="viewMode = 'list'"
                class="p-1.5 rounded-lg transition-colors cursor-pointer"
                :class="viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'"
                title="List view"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Skeleton Loading Simulation -->
        <ProductSkeleton v-if="isLoading" :count="6" :view-mode="viewMode" />

        <!-- Products Grid / List -->
        <div v-else-if="paginatedProducts.length > 0">
          <div
            :class="viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'"
          >
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              :view-mode="viewMode"
              :navigate="navigate"
            />
          </div>

          <!-- Pagination Row -->
          <div v-if="totalPages > 1" class="pt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              @click="currentPageNum = Math.max(1, currentPageNum - 1)"
              :disabled="currentPageNum === 1"
              class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              &larr; Prev
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              @click="currentPageNum = page"
              class="w-9 h-9 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              :class="currentPageNum === page
                ? 'bg-indigo-600 text-white shadow-md'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'"
            >
              {{ page }}
            </button>

            <button
              type="button"
              @click="currentPageNum = Math.min(totalPages, currentPageNum + 1)"
              :disabled="currentPageNum === totalPages"
              class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Next &rarr;
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else
          icon="search"
          title="No matching products found"
          description="Try relaxing your filters, searching for a different brand, or clearing your search term."
          action-text="Reset All Filters"
          :action-click="resetFilters"
        />
      </div>
    </div>
  </div>
</template>
