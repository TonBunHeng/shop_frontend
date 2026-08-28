<script setup>
import { computed } from 'vue'
import {
  addToCart,
  allProducts,
  formatPrice,
  moveAllWishlistToCart,
  showToast,
  wishlist,
  wishlistCount,
  wishlistProducts,
} from '../../data/store'
import AppIcon from '../../components/AppIcon.vue'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import EmptyState from '../../components/EmptyState.vue'
import ProductCard from '../../components/ProductCard.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const totalWishlistValue = computed(() =>
  wishlistProducts.value.reduce((sum, p) => sum + p.price, 0)
)

const handleShare = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href)
    showToast('Link Copied!', 'Wishlist link copied to your clipboard.', 'success')
  }
}

const clearAllWishlist = () => {
  wishlist.value = new Set()
  showToast('Wishlist Cleared', 'All saved items removed.', 'info')
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'My Wishlist' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div v-if="wishlistCount > 0" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Saved Wishlist</h1>
          <p class="text-xs text-gray-500 mt-0.5">
            <strong>{{ wishlistCount }}</strong> items saved · Total value: <strong class="text-gray-900 font-mono">${{ formatPrice(totalWishlistValue) }}</strong>
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            @click="handleShare"
            class="px-3.5 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <AppIcon name="share" size="xs" />
            <span>Share</span>
          </button>

          <button
            type="button"
            @click="moveAllWishlistToCart"
            class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors cursor-pointer"
          >
            Move All to Cart
          </button>

          <button
            type="button"
            @click="clearAllWishlist"
            class="px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs font-medium rounded transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Wishlist Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in wishlistProducts"
          :key="product.id"
          :product="product"
          :navigate="navigate"
        />
      </div>
    </div>

    <!-- Empty Wishlist State -->
    <EmptyState
      v-else
      icon="wishlist"
      title="Your wishlist is empty"
      description="Save products you like to easily buy them later or receive price drop alerts."
      action-text="Browse Products"
      :action-click="() => navigate('shop')"
    />
  </div>
</template>
