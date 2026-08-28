<script setup>
import { computed } from 'vue'
import {
  allProducts,
  bundleOffers,
  formatPrice,
  showToast,
} from '../data/store'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import CountdownTimer from '../components/CountdownTimer.vue'
import ProductCard from '../components/ProductCard.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const discountedProducts = computed(() =>
  allProducts.filter((p) => p.badge === 'SALE' || p.originalPrice > p.price)
)

const activeVouchers = [
  { code: 'TECH10', discount: '10% OFF', description: 'Storewide discount on all electronics', min: '$50' },
  { code: 'SAVE20', discount: '20% OFF', description: 'Applicable on orders $200 and higher', min: '$200' },
  { code: 'WELCOME15', discount: '15% OFF', description: 'Welcome voucher for new shoppers', min: '$75' },
  { code: 'FREESHIP', discount: 'FREE EXPRESS', description: 'Free priority shipping on all orders', min: '$0' },
  { code: 'FLASH50', discount: '$50 FLAT OFF', description: 'Instant $50 off on orders over $500', min: '$500' },
]

const copyCode = (code) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code)
    showToast('Code Copied!', `Promo code ${code} copied to clipboard.`, 'success')
  }
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Flash Deals & Promotions' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Deals Header -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="space-y-1">
        <span class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">
          PROMOTIONS HUB
        </span>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Deals & Promotional Discounts
        </h1>
        <p class="text-xs sm:text-sm text-gray-600">
          Save on premium laptops, displays, noise-cancelling audio, and accessories.
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <span class="text-xs font-medium text-gray-700">Deals Refresh In:</span>
        <CountdownTimer :hours="14" theme="dark" />
      </div>
    </div>

    <!-- Active Promo Codes Grid -->
    <div class="space-y-3">
      <h2 class="text-base font-bold text-gray-900 pb-2 border-b border-gray-200">
        Active Promo Coupons
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="v in activeVouchers"
          :key="v.code"
          class="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3 text-xs"
        >
          <div class="space-y-0.5">
            <span class="font-mono font-bold text-blue-600 text-sm block">{{ v.code }}</span>
            <span class="font-bold text-gray-900">{{ v.discount }}</span>
            <p class="text-gray-500 text-[11px]">{{ v.description }}</p>
          </div>

          <button
            type="button"
            @click="copyCode(v.code)"
            class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded transition-colors cursor-pointer shrink-0"
          >
            Copy
          </button>
        </div>
      </div>
    </div>

    <!-- Discounted Products Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-gray-200">
        <h2 class="text-base font-bold text-gray-900">
          Clearance & On-Sale Products ({{ discountedProducts.length }})
        </h2>
        <button
          type="button"
          @click="navigate('shop')"
          class="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
        >
          View All Catalog &rarr;
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in discountedProducts"
          :key="product.id"
          :product="product"
          :navigate="navigate"
        />
      </div>
    </div>
  </div>
</template>
