<script setup>
import { computed } from 'vue'
import {
  brands,
  categories,
  inStockOnlyFilter,
  minRatingFilter,
  onSaleOnlyFilter,
  priceFilter,
  searchQuery,
  selectedBrand,
  selectedCategory,
  sortBy,
} from '../data/store'

const props = defineProps({
  isMobileDrawer: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const resetAllFilters = () => {
  selectedCategory.value = 'all'
  selectedBrand.value = 'All Brands'
  priceFilter.value = 3000
  minRatingFilter.value = 0
  inStockOnlyFilter.value = false
  onSaleOnlyFilter.value = false
  searchQuery.value = ''
  sortBy.value = 'featured'
  if (props.isMobileDrawer) emit('close')
}

const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedCategory.value !== 'all') count++
  if (selectedBrand.value !== 'All Brands') count++
  if (priceFilter.value < 3000) count++
  if (minRatingFilter.value > 0) count++
  if (inStockOnlyFilter.value) count++
  if (onSaleOnlyFilter.value) count++
  if (searchQuery.value.trim()) count++
  return count
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header with clear all -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Filters</h3>
        <span
          v-if="activeFiltersCount > 0"
          class="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white"
        >
          {{ activeFiltersCount }}
        </span>
      </div>

      <button
        v-if="activeFiltersCount > 0"
        type="button"
        @click="resetAllFilters"
        class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
      >
        Clear all
      </button>
    </div>

    <!-- 1. Categories Filter -->
    <div class="space-y-2">
      <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Category</h4>
      <div class="space-y-1">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="selectedCategory = cat.id"
          class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer"
          :class="selectedCategory === cat.id
            ? 'bg-indigo-50 text-indigo-700 font-bold'
            : 'text-slate-600 hover:bg-slate-100'"
        >
          <span>{{ cat.name }}</span>
          <span class="text-[11px] opacity-60">({{ cat.count }})</span>
        </button>
      </div>
    </div>

    <!-- 2. Brands Filter -->
    <div class="space-y-2 pt-4 border-t border-slate-200">
      <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Brand</h4>
      <div class="space-y-1 max-h-48 overflow-y-auto pr-1">
        <button
          v-for="b in brands"
          :key="b"
          type="button"
          @click="selectedBrand = b"
          class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer"
          :class="selectedBrand === b
            ? 'bg-indigo-50 text-indigo-700 font-bold'
            : 'text-slate-600 hover:bg-slate-100'"
        >
          <span>{{ b }}</span>
          <span v-if="selectedBrand === b" class="text-indigo-600 font-bold">✓</span>
        </button>
      </div>
    </div>

    <!-- 3. Price Filter Slider -->
    <div class="space-y-3 pt-4 border-t border-slate-200">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Max Price</h4>
        <span class="text-xs font-extrabold text-slate-900 font-mono">${{ priceFilter }}</span>
      </div>

      <input
        v-model.number="priceFilter"
        type="range"
        min="50"
        max="3000"
        step="50"
        class="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
      />

      <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>$50</span>
        <span>$1,500</span>
        <span>$3,000+</span>
      </div>
    </div>

    <!-- 4. Rating Filter -->
    <div class="space-y-2 pt-4 border-t border-slate-200">
      <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Customer Rating</h4>
      <div class="space-y-1.5">
        <button
          type="button"
          @click="minRatingFilter = 0"
          class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
          :class="minRatingFilter === 0 ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'"
        >
          <span>All Ratings</span>
        </button>

        <button
          v-for="stars in [4.5, 4.0, 3.5]"
          :key="stars"
          type="button"
          @click="minRatingFilter = stars"
          class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
          :class="minRatingFilter === stars ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'"
        >
          <div class="flex items-center gap-1">
            <span class="text-amber-400">★</span>
            <span>{{ stars }} & up</span>
          </div>
          <span v-if="minRatingFilter === stars" class="text-indigo-600 font-bold">✓</span>
        </button>
      </div>
    </div>

    <!-- 5. Toggles (In Stock / Sale) -->
    <div class="space-y-3 pt-4 border-t border-slate-200">
      <label class="flex items-center justify-between cursor-pointer group">
        <span class="text-xs font-medium text-slate-700 group-hover:text-slate-900">In Stock Only</span>
        <input
          v-model="inStockOnlyFilter"
          type="checkbox"
          class="w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
        />
      </label>

      <label class="flex items-center justify-between cursor-pointer group">
        <span class="text-xs font-medium text-slate-700 group-hover:text-slate-900">On Sale / Discounted</span>
        <input
          v-model="onSaleOnlyFilter"
          type="checkbox"
          class="w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
        />
      </label>
    </div>

    <!-- Mobile Drawer Action -->
    <div v-if="isMobileDrawer" class="pt-4 border-t border-slate-200">
      <button
        type="button"
        @click="emit('close')"
        class="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
      >
        View Results
      </button>
    </div>
  </div>
</template>
