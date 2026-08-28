<script setup>
import { computed } from 'vue'
import {
  addToCart,
  formatPrice,
  isProductInWishlist,
  quickViewProductId,
  showToast,
  toggleCompare,
  toggleWishlist,
} from '../data/store'
import PriceDisplay from './PriceDisplay.vue'
import ProductRating from './ProductRating.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  layout: {
    type: String,
    default: 'grid', // 'grid' | 'list'
  },
  navigate: {
    type: Function,
    required: true,
  },
})

const inWishlist = computed(() => isProductInWishlist(props.product.id))

const handleAddToCart = (e) => {
  e.stopPropagation()
  addToCart(props.product, 1)
}

const handleToggleWishlist = (e) => {
  e.stopPropagation()
  toggleWishlist(props.product.id)
}

const handleToggleCompare = (e) => {
  e.stopPropagation()
  toggleCompare(props.product.id)
}

const handleQuickView = (e) => {
  e.stopPropagation()
  quickViewProductId.value = props.product.id
}

const openProduct = () => {
  props.navigate('product', { id: props.product.id })
}
</script>

<template>
  <!-- Grid View Card -->
  <div
    v-if="layout === 'grid'"
    @click="openProduct"
    class="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer relative group"
  >
    <!-- Top Image Container -->
    <div class="relative w-full aspect-square bg-gray-50 rounded mb-3 flex items-center justify-center overflow-hidden">
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
      />

      <!-- Badge (Sale, Best Seller, New, etc.) -->
      <span
        v-if="product.badge"
        class="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs"
        :class="{
          'bg-red-600': product.badge === 'SALE' || product.badge === 'HOT',
          'bg-emerald-600': product.badge === 'NEW',
          'bg-amber-600': product.badge === 'BEST SELLER',
        }"
      >
        {{ product.badge }}
      </span>

      <!-- Wishlist Action Button -->
      <button
        type="button"
        @click="handleToggleWishlist"
        class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        :class="{ 'text-red-500 fill-red-500': inWishlist }"
        aria-label="Save to Wishlist"
      >
        <svg class="w-4 h-4" :fill="inWishlist ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <!-- Quick View Hover Button -->
      <button
        type="button"
        @click="handleQuickView"
        class="absolute bottom-2 inset-x-2 py-1.5 bg-gray-900/80 hover:bg-gray-900 text-white text-xs font-medium rounded transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer text-center"
      >
        Quick View
      </button>
    </div>

    <!-- Product Info Details -->
    <div class="flex-1 flex flex-col justify-between">
      <div>
        <span class="text-[11px] text-gray-500 font-medium uppercase tracking-wider block">
          {{ product.brand }}
        </span>
        <h3 class="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {{ product.name }}
        </h3>

        <!-- Rating -->
        <div class="mt-1.5 flex items-center gap-1.5">
          <ProductRating :rating="product.rating" size="xs" :count="product.reviewsCount" />
        </div>
      </div>

      <!-- Price & Actions -->
      <div class="mt-3 pt-3 border-t border-gray-100">
        <div class="flex items-baseline justify-between mb-2.5">
          <PriceDisplay :price="product.price" :original-price="product.originalPrice" size="sm" />
          <span
            v-if="product.inStock"
            class="text-[10px] font-medium text-emerald-600"
          >
            In Stock
          </span>
          <span v-else class="text-[10px] font-medium text-red-600">
            Out of Stock
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="handleAddToCart"
            :disabled="!product.inStock"
            class="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-medium rounded transition-colors cursor-pointer text-center"
          >
            Add to Cart
          </button>

          <button
            type="button"
            @click="handleToggleCompare"
            title="Compare"
            class="p-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- List View Card -->
  <div
    v-else
    @click="openProduct"
    class="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow cursor-pointer relative group"
  >
    <!-- Image -->
    <div class="w-full sm:w-36 h-36 bg-gray-50 rounded flex items-center justify-center shrink-0 overflow-hidden relative">
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-cover"
      />
      <span
        v-if="product.badge"
        class="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded"
      >
        {{ product.badge }}
      </span>
    </div>

    <!-- Middle Description -->
    <div class="flex-1 min-w-0">
      <span class="text-[11px] text-gray-500 font-medium uppercase tracking-wider block">
        {{ product.brand }} · {{ product.category }}
      </span>
      <h3 class="text-base font-semibold text-gray-900 mt-0.5 group-hover:text-blue-600 transition-colors">
        {{ product.name }}
      </h3>
      <p class="text-xs text-gray-600 mt-1 line-clamp-2">
        {{ product.description }}
      </p>
      <div class="mt-2 flex items-center gap-2">
        <ProductRating :rating="product.rating" size="xs" :count="product.reviewsCount" />
        <span class="text-gray-300">|</span>
        <span class="text-xs text-emerald-600 font-medium">Free 2-Day Shipping</span>
      </div>
    </div>

    <!-- Right Price & Actions -->
    <div class="w-full sm:w-48 sm:text-right flex flex-col justify-between sm:border-l sm:border-gray-100 sm:pl-4">
      <div>
        <PriceDisplay :price="product.price" :original-price="product.originalPrice" size="md" />
        <span
          class="text-xs font-medium block mt-1"
          :class="product.inStock ? 'text-emerald-600' : 'text-red-600'"
        >
          {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
        </span>
      </div>

      <div class="mt-3 flex items-center gap-2 sm:justify-end">
        <button
          type="button"
          @click="handleAddToCart"
          :disabled="!product.inStock"
          class="flex-1 sm:flex-initial py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors cursor-pointer"
        >
          Add to Cart
        </button>

        <button
          type="button"
          @click="handleToggleWishlist"
          class="p-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" :fill="inWishlist ? 'red' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
