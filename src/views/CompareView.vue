<script setup>
import { computed } from 'vue'
import {
  addToCart,
  allProducts,
  clearCompare,
  compareList,
  compareProducts,
  formatPrice,
  removeFromCompare,
} from '../data/store'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import EmptyState from '../components/EmptyState.vue'
import PriceDisplay from '../components/PriceDisplay.vue'
import ProductRating from '../components/ProductRating.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const handleAddToCart = (product) => {
  addToCart(product, 1)
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Product Comparison' },
]

// List of all comparison spec keys across the compared products
const comparisonRows = [
  { key: 'category', label: 'Category', getVal: (p) => p.category?.toUpperCase() },
  { key: 'brand', label: 'Brand', getVal: (p) => p.brand },
  { key: 'rating', label: 'Customer Rating', isRating: true },
  { key: 'stockStatus', label: 'Availability', getVal: (p) => p.stockStatus || 'In Stock' },
  { key: 'display', label: 'Display Screen', getVal: (p) => p.specifications?.Display || p.specifications?.ScreenSize || 'N/A' },
  { key: 'processor', label: 'Processor / Chip', getVal: (p) => p.specifications?.Processor || p.specifications?.Sensor || 'N/A' },
  { key: 'storage', label: 'Memory / Storage', getVal: (p) => p.specifications?.Storage || p.specifications?.Memory || 'N/A' },
  { key: 'battery', label: 'Battery Life', getVal: (p) => p.specifications?.Battery || p.specifications?.BatteryLife || 'N/A' },
  { key: 'weight', label: 'Weight', getVal: (p) => p.specifications?.Weight || 'N/A' },
  { key: 'warranty', label: 'Warranty', getVal: (p) => p.specifications?.Warranty || '2-Year Warranty' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Comparison Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Product Comparison</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Comparing <strong>{{ compareProducts.length }}</strong> of 4 maximum devices
        </p>
      </div>

      <div v-if="compareProducts.length > 0" class="flex items-center gap-2">
        <button
          type="button"
          @click="navigate('shop')"
          class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
        >
          + Add More Products
        </button>
        <button
          type="button"
          @click="clearCompare"
          class="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
        >
          Clear Table
        </button>
      </div>
    </div>

    <!-- Comparison Table / Matrix -->
    <div v-if="compareProducts.length > 0" class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-x-auto">
      <table class="w-full min-w-[700px] border-collapse text-left text-xs sm:text-sm">
        <!-- Products Header Row with Images -->
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50/50">
            <th class="p-5 w-48 font-bold text-slate-400 uppercase tracking-wider text-xs align-top">
              Device
            </th>
            <th
              v-for="p in compareProducts"
              :key="p.id"
              class="p-5 align-top border-l border-slate-200"
            >
              <div class="relative flex flex-col justify-between h-full space-y-3">
                <button
                  type="button"
                  @click="removeFromCompare(p.id)"
                  class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-200 hover:bg-rose-100 hover:text-rose-600 text-slate-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="Remove from comparison"
                >
                  ✕
                </button>

                <img :src="p.image" :alt="p.name" class="w-24 h-24 rounded-2xl object-cover border border-slate-200 mx-auto" />

                <div class="text-center">
                  <span class="text-[10px] font-bold text-slate-400 uppercase">{{ p.brand }}</span>
                  <h3
                    @click="navigate('product', { id: p.id })"
                    class="text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-2 mt-0.5"
                  >
                    {{ p.name }}
                  </h3>
                </div>

                <div class="text-center pt-2">
                  <PriceDisplay :price="p.price" :original-price="p.originalPrice" size="md" />
                </div>

                <button
                  type="button"
                  @click="handleAddToCart(p)"
                  class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer mt-2"
                >
                  Add to Cart
                </button>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Spec Comparison Rows -->
        <tbody class="divide-y divide-slate-100">
          <tr v-for="row in comparisonRows" :key="row.key" class="hover:bg-slate-50/60 transition-colors">
            <td class="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/40">
              {{ row.label }}
            </td>

            <td
              v-for="p in compareProducts"
              :key="p.id"
              class="p-4 border-l border-slate-200 text-slate-800"
            >
              <template v-if="row.isRating">
                <ProductRating :rating="p.rating || 5" :reviews-count="p.reviewsCount || 0" size="xs" />
              </template>
              <template v-else>
                <span class="font-medium">{{ row.getVal(p) }}</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="compare"
      title="No devices to compare"
      description="You can compare specifications of up to 4 laptops, smartphones, headphones, and monitors side by side."
      action-text="Browse Products"
      :action-click="() => navigate('shop')"
    />
  </div>
</template>
