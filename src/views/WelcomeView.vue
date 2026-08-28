<script setup>
import { computed } from 'vue'
import {
  addToCart,
  allProducts,
  bestSellerProducts,
  bundleOffers,
  categories,
  featuredProducts,
  formatPrice,
  newArrivalProducts,
  recentlyViewedProducts,
  recommendedProducts,
  trendingProducts,
} from '../data/store'
import AppIcon from '../components/AppIcon.vue'
import CountdownTimer from '../components/CountdownTimer.vue'
import ProductCard from '../components/ProductCard.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const flashSaleProducts = computed(() =>
  allProducts.filter((p) => p.badge === 'SALE' || p.originalPrice > p.price).slice(0, 4)
)

const bundle = computed(() => bundleOffers[0] || null)

const handleAddBundle = () => {
  if (!bundle.value) return
  bundle.value.items.forEach((p) => {
    addToCart(p, 1)
  })
}
</script>

<template>
  <div class="space-y-10 pb-12">
    <!-- Hero Banner (Simple & Clean) -->
    <section class="bg-white border-b border-gray-200 py-10 md:py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <!-- Text column -->
          <div class="space-y-4 text-center lg:text-left">
            <span class="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded">
              Next-Gen Electronics Store
            </span>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              Technology made simple.
            </h1>

            <p class="text-sm sm:text-base text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Discover high performance laptops, headphones, monitors, smartphones, and accessories backed by a 2-year warranty and free shipping.
            </p>

            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                type="button"
                @click="navigate('shop')"
                class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded transition-colors cursor-pointer"
              >
                Shop Catalog &rarr;
              </button>

              <button
                type="button"
                @click="navigate('deals')"
                class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm rounded transition-colors cursor-pointer"
              >
                View Deals
              </button>
            </div>

            <!-- Value proposition badges -->
            <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-xs text-gray-500">
              <div>
                <strong class="block text-gray-900 font-semibold">Free Shipping</strong>
                <span>Orders over $100</span>
              </div>
              <div>
                <strong class="block text-gray-900 font-semibold">2-Year Warranty</strong>
                <span>Included on all gear</span>
              </div>
              <div>
                <strong class="block text-gray-900 font-semibold">30-Day Returns</strong>
                <span>Hassle-free guarantee</span>
              </div>
            </div>
          </div>

          <!-- Hero Image column -->
          <div class="flex justify-center">
            <div class="relative max-w-md w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80"
                alt="MacBook Pro"
                class="w-full h-72 sm:h-80 object-cover"
              />
              <div class="absolute bottom-3 left-3 bg-white/95 border border-gray-200 rounded px-3 py-1.5 shadow-sm text-xs">
                <span class="text-gray-500 block text-[10px]">Featured Product</span>
                <span class="font-bold text-gray-900">MacBook Pro 16" M3 Max</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-5 pb-2 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Shop by Category</h2>
          <p class="text-xs text-gray-500 mt-0.5">Explore our most popular hardware categories</p>
        </div>

        <button
          type="button"
          @click="navigate('shop')"
          class="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
        >
          View All &rarr;
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          v-for="cat in categories.filter(c => c.id !== 'all').slice(0, 6)"
          :key="cat.id"
          @click="navigate('shop', { category: cat.id })"
          class="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-blue-600 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div class="w-11 h-11 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mx-auto mb-2.5 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <AppIcon :name="cat.id" size="md" />
          </div>
          <h3 class="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{{ cat.name }}</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">{{ cat.count }} items</p>
        </div>
      </div>
    </section>

    <!-- Flash Sale Section with Countdown Timer -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gray-100 border border-gray-200 rounded-lg p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                LIMITED TIME
              </span>
              <h2 class="text-xl font-bold text-gray-900">24-Hour Flash Deals</h2>
            </div>
            <p class="text-xs text-gray-500 mt-1">Special promotional discounts ending soon</p>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-xs font-medium text-gray-700">Deals Expire In:</span>
            <CountdownTimer :hours="18" theme="dark" />
          </div>
        </div>

        <!-- Flash products grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCard
            v-for="p in flashSaleProducts"
            :key="p.id"
            :product="p"
            :navigate="navigate"
          />
        </div>
      </div>
    </section>

    <!-- Trending Products -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-5 pb-2 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Trending Products</h2>
          <p class="text-xs text-gray-500 mt-0.5">Top-rated items favored by customers this week</p>
        </div>

        <button
          type="button"
          @click="navigate('shop')"
          class="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
        >
          View All &rarr;
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="p in trendingProducts"
          :key="p.id"
          :product="p"
          :navigate="navigate"
        />
      </div>
    </section>

    <!-- Bundle Offer Banner -->
    <section v-if="bundle" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center lg:text-left">
          <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
            BUNDLE OFFER
          </span>
          <h2 class="text-xl font-bold text-gray-900">{{ bundle.name }}</h2>
          <p class="text-xs text-gray-600 max-w-lg">{{ bundle.tagline }}</p>
          <div class="flex items-center justify-center lg:justify-start gap-3 pt-2 text-xs">
            <span class="text-gray-500 line-through font-mono">${{ formatPrice(bundle.originalPrice) }}</span>
            <span class="text-lg font-bold text-blue-600 font-mono">${{ formatPrice(bundle.bundlePrice) }}</span>
            <span class="bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded text-[11px]">Save ${{ formatPrice(bundle.savings) }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="handleAddBundle"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
          >
            Add Bundle to Cart (${{ formatPrice(bundle.bundlePrice) }})
          </button>
        </div>
      </div>
    </section>

    <!-- Best Sellers -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-5 pb-2 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Best Sellers</h2>
          <p class="text-xs text-gray-500 mt-0.5">Proven electronics with top user reviews</p>
        </div>

        <button
          type="button"
          @click="navigate('shop')"
          class="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
        >
          View All &rarr;
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="p in bestSellerProducts"
          :key="p.id"
          :product="p"
          :navigate="navigate"
        />
      </div>
    </section>

    <!-- Recommended for You -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-5 pb-2 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Recommended for You</h2>
          <p class="text-xs text-gray-500 mt-0.5">Based on your recent product views and preferences</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="p in recommendedProducts.slice(0, 4)"
          :key="p.id"
          :product="p"
          :navigate="navigate"
        />
      </div>
    </section>

    <!-- Recently Viewed Products -->
    <section v-if="recentlyViewedProducts.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-4 pb-2 border-b border-gray-200">
        <h2 class="text-lg font-bold text-gray-900">Recently Viewed</h2>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          v-for="p in recentlyViewedProducts.slice(0, 6)"
          :key="p.id"
          @click="navigate('product', { id: p.id })"
          class="bg-white border border-gray-200 rounded p-2.5 hover:border-gray-300 transition-colors cursor-pointer group text-xs"
        >
          <div class="aspect-square bg-gray-50 rounded overflow-hidden mb-2">
            <img :src="p.image" :alt="p.name" class="w-full h-full object-cover" />
          </div>
          <p class="font-medium text-gray-900 truncate group-hover:text-blue-600">{{ p.name }}</p>
          <p class="text-blue-600 font-bold font-mono mt-0.5">${{ formatPrice(p.price) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
