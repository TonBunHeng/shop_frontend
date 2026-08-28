<script setup>
import { computed } from 'vue'
import { brands, categories, formatPrice } from '../data/store'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  selectedCategory: {
    type: String,
    default: 'All',
  },
  selectedBrand: {
    type: String,
    default: 'All',
  },
  priceRange: {
    type: Number,
    default: 3000,
  },
  minRating: {
    type: Number,
    default: 0,
  },
  onlyInStock: {
    type: Boolean,
    default: false,
  },
  onlyOnSale: {
    type: Boolean,
    default: false,
  },
  isMobileOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:selectedCategory',
  'update:selectedBrand',
  'update:priceRange',
  'update:minRating',
  'update:onlyInStock',
  'update:onlyOnSale',
  'reset',
  'closeMobile',
])

const activeFiltersCount = computed(() => {
  let count = 0
  if (props.selectedCategory !== 'All') count++
  if (props.selectedBrand !== 'All') count++
  if (props.priceRange < 3000) count++
  if (props.minRating > 0) count++
  if (props.onlyInStock) count++
  if (props.onlyOnSale) count++
  return count
})
</script>

<template>
  <div>
    <!-- Mobile Drawer Overlay -->
    <div
      v-if="isMobileOpen"
      @click="emit('closeMobile')"
      class="fixed inset-0 bg-black/40 z-50 lg:hidden"
    ></div>

    <!-- Filter Content Wrapper (Sidebar or Mobile Drawer) -->
    <aside
      class="bg-white rounded-lg border border-gray-200 p-4 space-y-6 text-xs"
      :class="[
        isMobileOpen
          ? 'fixed inset-y-0 left-0 max-w-xs w-full z-50 shadow-xl overflow-y-auto rounded-none'
          : 'hidden lg:block'
      ]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-bold text-gray-900">Filters</h3>
          <span
            v-if="activeFiltersCount > 0"
            class="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded"
          >
            {{ activeFiltersCount }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="activeFiltersCount > 0"
            type="button"
            @click="emit('reset')"
            class="text-blue-600 hover:underline font-semibold cursor-pointer text-xs"
          >
            Reset
          </button>
          <button
            v-if="isMobileOpen"
            type="button"
            @click="emit('closeMobile')"
            class="lg:hidden text-gray-400 hover:text-gray-600 text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Categories Filter -->
      <div class="space-y-2">
        <h4 class="font-bold text-gray-900 text-xs">Categories</h4>
        <div class="space-y-1">
          <button
            type="button"
            @click="emit('update:selectedCategory', 'All')"
            class="w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer"
            :class="selectedCategory === 'All' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'"
          >
            <span>All Categories</span>
          </button>

          <button
            v-for="cat in categories.filter(c => c.id !== 'all')"
            :key="cat.id"
            type="button"
            @click="emit('update:selectedCategory', cat.id)"
            class="w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer"
            :class="selectedCategory === cat.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'"
          >
            <span>{{ cat.name }}</span>
            <span class="text-gray-400 text-[10px]">{{ cat.count }}</span>
          </button>
        </div>
      </div>

      <!-- Brands Filter -->
      <div class="space-y-2 pt-4 border-t border-gray-100">
        <h4 class="font-bold text-gray-900 text-xs">Brands</h4>
        <div class="space-y-1 max-h-40 overflow-y-auto pr-1">
          <button
            type="button"
            @click="emit('update:selectedBrand', 'All')"
            class="w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer"
            :class="selectedBrand === 'All' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'"
          >
            <span>All Brands</span>
          </button>

          <button
            v-for="b in brands"
            :key="b"
            type="button"
            @click="emit('update:selectedBrand', b)"
            class="w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer"
            :class="selectedBrand === b ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'"
          >
            <span>{{ b }}</span>
          </button>
        </div>
      </div>

      <!-- Price Range Filter -->
      <div class="space-y-2 pt-4 border-t border-gray-100">
        <div class="flex justify-between items-center">
          <h4 class="font-bold text-gray-900 text-xs">Max Price</h4>
          <span class="font-mono font-bold text-gray-900">${{ formatPrice(priceRange) }}</span>
        </div>
        <input
          type="range"
          min="50"
          max="3000"
          step="50"
          :value="priceRange"
          @input="emit('update:priceRange', Number($event.target.value))"
          class="w-full accent-blue-600 cursor-pointer"
        />
        <div class="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>$50</span>
          <span>$1,500</span>
          <span>$3,000</span>
        </div>
      </div>

      <!-- Rating Filter -->
      <div class="space-y-2 pt-4 border-t border-gray-100">
        <h4 class="font-bold text-gray-900 text-xs">Customer Rating</h4>
        <div class="space-y-1">
          <label
            v-for="r in [4.5, 4.0, 3.5]"
            :key="r"
            class="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-50"
          >
            <input
              type="radio"
              name="rating"
              :checked="minRating === r"
              @change="emit('update:minRating', r)"
              class="text-blue-600 accent-blue-600"
            />
            <span class="text-amber-500 font-bold flex items-center gap-1">
              <AppIcon name="star" size="xs" />
              <span>{{ r }} & up</span>
            </span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-50">
            <input
              type="radio"
              name="rating"
              :checked="minRating === 0"
              @change="emit('update:minRating', 0)"
              class="text-blue-600 accent-blue-600"
            />
            <span class="text-gray-600">All Ratings</span>
          </label>
        </div>
      </div>

      <!-- Availability Toggles -->
      <div class="space-y-2 pt-4 border-t border-gray-100">
        <h4 class="font-bold text-gray-900 text-xs">Availability & Offers</h4>
        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="onlyInStock"
              @change="emit('update:onlyInStock', $event.target.checked)"
              class="rounded text-blue-600 accent-blue-600 cursor-pointer"
            />
            <span class="text-gray-700">In Stock Only</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="onlyOnSale"
              @change="emit('update:onlyOnSale', $event.target.checked)"
              class="rounded text-blue-600 accent-blue-600 cursor-pointer"
            />
            <span class="text-gray-700">On Sale / Discounted</span>
          </label>
        </div>
      </div>
    </aside>
  </div>
</template>
