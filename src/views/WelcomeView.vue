<script setup>
import { computed } from 'vue'
import {
  addToCart,
  allProducts,
  bundleOffers,
  categories,
  formatPrice,
  recentlyViewedProducts,
  selectedCategory,
} from '../data/store'
import CountdownTimer from '../components/CountdownTimer.vue'
import ProductCard from '../components/ProductCard.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

// Trending products
const trendingProducts = computed(() =>
  allProducts.filter((p) => p.isTrending || p.isFeatured).slice(0, 4)
)

// Best sellers
const bestSellers = computed(() =>
  allProducts.filter((p) => p.isBestSeller).slice(0, 4)
)

// New Arrivals
const newArrivals = computed(() =>
  allProducts.filter((p) => p.isNew).slice(0, 4)
)

// Flash Sale items (items with discount >= 10%)
const flashSaleItems = computed(() =>
  allProducts.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 4)
)

// Personalized Recommendations based on recently viewed items or fallback
const personalizedRecommendations = computed(() => {
  if (recentlyViewedProducts.value.length > 0) {
    const lastCategory = recentlyViewedProducts.value[0].category
    return allProducts.filter((p) => p.category === lastCategory).slice(0, 4)
  }
  return allProducts.slice(0, 4)
})

const handleCategoryClick = (catId) => {
  selectedCategory.value = catId
  props.navigate('shop', { category: catId })
}

const handleAddBundle = (bundle) => {
  bundle.items.forEach((item) => {
    addToCart(item, 1)
  })
  props.navigate('cart')
}
</script>

<template>
  <div class="space-y-16 sm:space-y-24 pb-16">
    <!-- 1. HERO SECTION -->
    <section class="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24">
      <!-- Glow Gradients in Background -->
      <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Left: Hero Headline (7 cols) -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span>Next-Gen Technology Unveiled</span>
            </div>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              BUILT FOR YOUR <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">FUTURE.</span>
            </h1>

            <p class="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover industry-leading pro laptops, flagship smartphones, studio monitors, and active noise-cancelling sound crafted for modern creators and power users.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                @click="navigate('shop')"
                class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Shop Pro Catalog</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                type="button"
                @click="navigate('deals')"
                class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-sm backdrop-blur-xs border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔥 Explore Flash Deals</span>
              </button>
            </div>

            <!-- Trust highlights row -->
            <div class="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p class="text-lg sm:text-2xl font-black text-white">100%</p>
                <p class="text-[11px] text-slate-400">Authentic Tech</p>
              </div>
              <div>
                <p class="text-lg sm:text-2xl font-black text-white">2-Year</p>
                <p class="text-[11px] text-slate-400">Full Warranty</p>
              </div>
              <div>
                <p class="text-lg sm:text-2xl font-black text-white">&lt; 48h</p>
                <p class="text-[11px] text-slate-400">Fast Express Ship</p>
              </div>
            </div>
          </div>

          <!-- Right: Hero Visual Card (5 cols) -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl group">
              <!-- Featured Product Spotlight -->
              <div class="aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-950 mb-5 relative">
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                  alt="MacBook Pro 16 M3 Max"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black uppercase bg-indigo-600 text-white shadow-md">
                  Featured Powerhouse
                </span>
              </div>

              <div class="space-y-2">
                <span class="text-xs text-indigo-400 font-bold uppercase tracking-wider">M3 Max Silicon</span>
                <h3 class="text-lg sm:text-xl font-bold text-white">MacBook Pro 16" M3 Max</h3>
                <p class="text-xs text-slate-400 leading-relaxed">
                  36GB Unified Memory, 1TB SSD, Liquid Retina XDR 120Hz display with 22h battery life.
                </p>

                <div class="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div>
                    <span class="text-xl font-black text-white">$2,499</span>
                    <span class="text-xs text-slate-500 line-through ml-2">$2,699</span>
                  </div>

                  <button
                    type="button"
                    @click="navigate('product', { id: 1 })"
                    class="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Specs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. FEATURED CATEGORIES CARDS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Explore Categories</h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Engineered for creators, developers & gamers</p>
        </div>

        <button
          type="button"
          @click="navigate('shop')"
          class="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>All Categories</span>
          <span>&rarr;</span>
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        <div
          v-for="cat in categories.filter(c => c.id !== 'all')"
          :key="cat.id"
          @click="handleCategoryClick(cat.id)"
          class="group bg-white rounded-2xl border border-slate-200/80 p-4 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
        >
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-3.5 bg-slate-100 group-hover:scale-105 transition-transform">
            <img :src="cat.image" :alt="cat.name" class="w-full h-full object-cover" />
          </div>
          <h3 class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {{ cat.name }}
          </h3>
          <span class="text-[11px] text-slate-400 font-medium mt-0.5">{{ cat.count }} Models</span>
        </div>
      </div>
    </section>

    <!-- 3. LIVE FLASH SALE WITH COUNTDOWN TIMER -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl text-white">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-wider">
              🔥 24-Hour Flash Sale
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Deals of the Day</h2>
            <p class="text-xs sm:text-sm text-slate-400">Save up to $200 on top-tier electronics before timer ends</p>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span class="text-xs text-slate-400 font-bold uppercase tracking-wider">Ending in:</span>
            <CountdownTimer :target-hours="14" theme="primary" />
          </div>
        </div>

        <!-- Flash Deals Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <ProductCard
            v-for="product in flashSaleItems"
            :key="product.id"
            :product="product"
            :navigate="navigate"
          />
        </div>
      </div>
    </section>

    <!-- 4. TRENDING PRODUCTS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Trending Now</h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Most viewed & purchased gadgets this week</p>
        </div>

        <button
          type="button"
          @click="navigate('shop')"
          class="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All ({{ allProducts.length }})</span>
          <span>&rarr;</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in trendingProducts"
          :key="product.id"
          :product="product"
          :navigate="navigate"
        />
      </div>
    </section>

    <!-- 5. BUNDLE DEALS BANNER -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-tr from-indigo-50 via-sky-50 to-white rounded-3xl p-6 sm:p-10 border border-indigo-100 shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-6 space-y-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider">
              🎁 Complete Workspace Bundle
            </span>

            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Pro Creator Studio Bundle
            </h2>

            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Get the MacBook Pro 16" M3 Max paired with the Dell 27" 4K HDR Monitor and Logitech MX Master 3S wireless mouse. Everything you need to build the ultimate workstation.
            </p>

            <div class="flex items-baseline gap-3 pt-2">
              <span class="text-3xl font-black text-slate-900 font-mono">$2,847</span>
              <span class="text-base text-slate-400 line-through font-mono">$3,147</span>
              <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                Save $300 Instant
              </span>
            </div>

            <div class="pt-3">
              <button
                type="button"
                @click="handleAddBundle(bundleOffers[0])"
                class="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Add Full 3-Piece Bundle to Cart</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>

          <!-- Right: Bundle item miniatures -->
          <div class="lg:col-span-6 grid grid-cols-3 gap-3 sm:gap-4">
            <div
              v-for="(item, i) in bundleOffers[0].items"
              :key="i"
              class="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-col items-center text-center"
            >
              <img :src="item.image" :alt="item.name" class="w-full aspect-square rounded-xl object-cover mb-2" />
              <p class="text-xs font-bold text-slate-900 truncate w-full">{{ item.name }}</p>
              <p class="text-[11px] text-slate-500 font-mono mt-0.5">${{ formatPrice(item.price) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. BEST SELLERS & NEW ARRIVALS TABS/SECTIONS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Best Sellers</h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Proven quality rated 4.8+ stars by verified owners</p>
        </div>

        <button
          type="button"
          @click="navigate('shop')"
          class="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Explore All</span>
          <span>&rarr;</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in bestSellers"
          :key="product.id"
          :product="product"
          :navigate="navigate"
        />
      </div>
    </section>

    <!-- 7. PERSONALIZED RECOMMENDATIONS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Recommended For You</h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Based on your interests and recent browsing activity</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in personalizedRecommendations"
          :key="product.id"
          :product="product"
          :navigate="navigate"
        />
      </div>
    </section>

    <!-- 8. RECENTLY VIEWED (If user viewed any) -->
    <section v-if="recentlyViewedProducts.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
        <h2 class="text-lg font-bold text-slate-900">Recently Viewed</h2>
        <span class="text-xs text-slate-400">Tracked locally</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="product in recentlyViewedProducts.slice(0, 6)"
          :key="product.id"
          @click="navigate('product', { id: product.id })"
          class="bg-white rounded-2xl p-3 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
        >
          <img :src="product.image" :alt="product.name" class="w-full aspect-square rounded-xl object-cover mb-2" />
          <h4 class="text-xs font-bold text-slate-900 truncate">{{ product.name }}</h4>
          <p class="text-xs font-bold text-indigo-600 font-mono mt-1">${{ formatPrice(product.price) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
