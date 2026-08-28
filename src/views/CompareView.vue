<script setup>
import {
  addToCart,
  allProducts,
  clearCompare,
  compareList,
  compareProducts,
  formatPrice,
  removeFromCompare,
  showToast,
} from '../data/store'
import AppIcon from '../components/AppIcon.vue'
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

const addSampleToCompare = (product) => {
  if (compareList.value.size >= 4) {
    showToast('Limit Reached', 'You can compare up to 4 products at once.', 'warning')
    return
  }
  compareList.value.add(product.id)
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Product Comparison' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Product Comparison</h1>
        <p class="text-xs text-gray-500 mt-0.5">
          Comparing <strong>{{ compareProducts.length }}</strong> devices side-by-side (max 4)
        </p>
      </div>

      <div v-if="compareProducts.length > 0" class="flex items-center gap-2">
        <button
          type="button"
          @click="clearCompare"
          class="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium rounded transition-colors cursor-pointer"
        >
          Clear All
        </button>
        <button
          type="button"
          @click="navigate('shop')"
          class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors cursor-pointer"
        >
          + Add More Products
        </button>
      </div>
    </div>

    <!-- Comparison Table -->
    <div v-if="compareProducts.length > 0" class="bg-white border border-gray-200 rounded-lg overflow-x-auto">
      <table class="w-full text-xs text-left border-collapse min-w-[650px]">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th class="p-4 w-40 font-bold text-gray-700">Product</th>
            <th
              v-for="prod in compareProducts"
              :key="prod.id"
              class="p-4 w-60 text-center relative align-top"
            >
              <button
                type="button"
                @click="removeFromCompare(prod.id)"
                class="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                title="Remove from comparison"
              >
                ✕
              </button>

              <div class="space-y-2">
                <img :src="prod.image" :alt="prod.name" class="w-24 h-24 mx-auto rounded object-cover border border-gray-200" />
                <h3 class="font-bold text-gray-900 line-clamp-2 text-xs">{{ prod.name }}</h3>
                <PriceDisplay :price="prod.price" :original-price="prod.originalPrice" size="sm" />
                <button
                  type="button"
                  @click="handleAddToCart(prod)"
                  class="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold text-gray-700 bg-gray-50/50">Brand</td>
            <td v-for="p in compareProducts" :key="p.id" class="p-3.5 text-center text-gray-800">
              {{ p.brand }}
            </td>
          </tr>

          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold text-gray-700 bg-gray-50/50">Category</td>
            <td v-for="p in compareProducts" :key="p.id" class="p-3.5 text-center text-gray-800">
              {{ p.category }}
            </td>
          </tr>

          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold text-gray-700 bg-gray-50/50">Customer Rating</td>
            <td v-for="p in compareProducts" :key="p.id" class="p-3.5 text-center">
              <div class="flex items-center justify-center gap-1 text-xs">
                <span class="text-amber-500 font-bold flex items-center gap-1">
                  <AppIcon name="star" size="xs" />
                  <span>{{ p.rating }}</span>
                </span>
                <span class="text-gray-400">({{ p.reviewsCount }})</span>
              </div>
            </td>
          </tr>

          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold text-gray-700 bg-gray-50/50">Availability</td>
            <td v-for="p in compareProducts" :key="p.id" class="p-3.5 text-center">
              <span
                class="font-semibold text-xs"
                :class="p.inStock ? 'text-emerald-600' : 'text-red-600'"
              >
                {{ p.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </td>
          </tr>

          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold text-gray-700 bg-gray-50/50">Display / Screen</td>
            <td v-for="p in compareProducts" :key="p.id" class="p-3.5 text-center text-gray-800 font-mono">
              {{ p.specs?.display || 'N/A' }}
            </td>
          </tr>

          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold text-gray-700 bg-gray-50/50">Processor / Chip</td>
            <td v-for="p in compareProducts" :key="p.id" class="p-3.5 text-center text-gray-800 font-mono">
              {{ p.specs?.processor || p.specs?.sensor || 'N/A' }}
            </td>
          </tr>

          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold text-gray-700 bg-gray-50/50">Memory / Storage</td>
            <td v-for="p in compareProducts" :key="p.id" class="p-3.5 text-center text-gray-800 font-mono">
              {{ p.specs?.ram || 'N/A' }} / {{ p.specs?.storage || 'N/A' }}
            </td>
          </tr>

          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold text-gray-700 bg-gray-50/50">Battery / Power</td>
            <td v-for="p in compareProducts" :key="p.id" class="p-3.5 text-center text-gray-800 font-mono">
              {{ p.specs?.battery || 'N/A' }}
            </td>
          </tr>

          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold text-gray-700 bg-gray-50/50">Weight</td>
            <td v-for="p in compareProducts" :key="p.id" class="p-3.5 text-center text-gray-800 font-mono">
              {{ p.specs?.weight || 'N/A' }}
            </td>
          </tr>

          <tr class="hover:bg-gray-50">
            <td class="p-3.5 font-bold text-gray-700 bg-gray-50/50">Warranty</td>
            <td v-for="p in compareProducts" :key="p.id" class="p-3.5 text-center text-emerald-700 font-medium">
              2-Year TechNova Warranty
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty Compare State -->
    <EmptyState
      v-else
      icon="box"
      title="No products to compare"
      description="Select up to 4 devices to compare side-by-side across dimensions, chips, battery, and price."
      action-text="Discover Products to Compare"
      :action-click="() => navigate('shop')"
    />
  </div>
</template>
