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
    showToast('Link Copied! 📋', 'Wishlist link copied to your clipboard.', 'success')
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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div v-if="wishlistCount > 0" class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Saved Wishlist</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
            <strong>{{ wishlistCount }}</strong> items saved · Total value: <strong class="text-slate-900 font-mono">${{ formatPrice(totalWishlistValue) }}</strong>
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            @click="handleShare"
            class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>🔗 Share Wishlist</span>
          </button>

          <button
            type="button"
            @click="moveAllWishlistToCart"
            class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            Move All to Cart
          </button>

          <button
            type="button"
            @click="clearAllWishlist"
            class="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Wishlist Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      description="Save products you love so you can easily find them later, receive price drop alerts, or add them to cart."
      action-text="Start Shopping Now"
      :action-click="() => navigate('shop')"
    />
  </div>
</template>
