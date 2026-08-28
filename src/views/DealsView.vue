<script setup>
import { computed } from 'vue'
import {
  addToCart,
  allProducts,
  availableCoupons,
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

// Flash sales (discount >= 10%)
const flashSaleProducts = computed(() =>
  allProducts.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 4)
)

// Clearance products
const clearanceProducts = computed(() =>
  allProducts.filter((p) => p.badge === 'SALE' || (p.originalPrice && p.originalPrice - p.price > 100))
)

const copyCode = (code) => {
  navigator.clipboard?.writeText(code)
  showToast('Code Copied! 📋', `Coupon "${code}" copied to clipboard. Apply at checkout!`, 'success')
}

const handleAddBundle = (bundle) => {
  bundle.items.forEach((item) => addToCart(item, 1))
  props.navigate('cart')
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Special Deals & Promotions' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Deals Hero Banner -->
    <div class="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white border border-rose-900/40 shadow-2xl space-y-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-wider">
            🔥 Limited Time Flash Promotions
          </div>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white">
            TechNova Super Deals
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-xl">
            Save up to 20% on Apple MacBooks, LG 240Hz Curved OLED monitors, Sony ANC headphones, and creator desk gear.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 flex flex-col items-start gap-2">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Deals expire in:</span>
          <CountdownTimer :target-hours="14" theme="primary" />
        </div>
      </div>

      <!-- Active Promo Coupons Row -->
      <div>
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Available Promo Vouchers</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div
            v-for="(val, code) in availableCoupons"
            :key="code"
            class="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 hover:border-indigo-400 flex items-center justify-between transition-colors group"
          >
            <div>
              <span class="font-mono font-black text-sm text-white tracking-wider block">{{ code }}</span>
              <p class="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{{ val.description }}</p>
            </div>

            <button
              type="button"
              @click="copyCode(code)"
              class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white text-white hover:text-slate-900 text-[11px] font-bold transition-all cursor-pointer"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 1. Flash Sale Items Grid -->
    <section class="space-y-6">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Today's Flash Deals</h2>
          <p class="text-xs text-slate-500">Limited quantities remaining in stock</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="p in flashSaleProducts"
          :key="p.id"
          :product="p"
          :navigate="navigate"
        />
      </div>
    </section>

    <!-- 2. Bundle Deals Section -->
    <section class="space-y-6">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Curated Bundle Offers</h2>
          <p class="text-xs text-slate-500">Save extra by bundling workspace accessories together</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          v-for="b in bundleOffers"
          :key="b.id"
          class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800">
                {{ b.badge }}
              </span>
              <span class="text-xs font-bold text-slate-400 font-mono">Bundle ID: {{ b.id }}</span>
            </div>

            <h3 class="text-xl font-bold text-slate-900">{{ b.name }}</h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ b.tagline }}</p>

            <!-- Mini items -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              <div
                v-for="bItem in b.items"
                :key="bItem.id"
                class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center"
              >
                <img :src="bItem.image" :alt="bItem.name" class="w-16 h-16 rounded-lg object-cover mb-1.5" />
                <span class="text-xs font-bold text-slate-900 truncate w-full">{{ bItem.name }}</span>
                <span class="text-[11px] text-slate-500 font-mono">${{ formatPrice(bItem.price) }}</span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span class="text-2xl font-black text-slate-900 font-mono">${{ formatPrice(b.bundlePrice) }}</span>
              <span class="text-xs text-slate-400 line-through font-mono ml-2">${{ formatPrice(b.originalPrice) }}</span>
            </div>

            <button
              type="button"
              @click="handleAddBundle(b)"
              class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Shop This Bundle &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Clearance Specials -->
    <section class="space-y-6">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Clearance Specials</h2>
          <p class="text-xs text-slate-500">End of season tech inventory markdown</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="p in clearanceProducts"
          :key="p.id"
          :product="p"
          :navigate="navigate"
        />
      </div>
    </section>
  </div>
</template>
