<script setup>
import { computed } from 'vue'
import {
  addToCart,
  formatPrice,
  isInCompare,
  isInWishlist,
  openQuickView,
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
  viewMode: {
    type: String,
    default: 'grid', // 'grid' | 'list'
  },
  navigate: {
    type: Function,
    default: null,
  },
})

const handleAddToCart = () => {
  addToCart(props.product, 1)
}

const goToProduct = () => {
  if (props.navigate) {
    props.navigate('product', { id: props.product.id })
  } else {
    openQuickView(props.product)
  }
}

const badgeColor = computed(() => {
  switch (props.product.badge) {
    case 'BEST SELLER':
      return 'bg-amber-500 text-white'
    case 'SALE':
      return 'bg-rose-600 text-white'
    case 'NEW':
      return 'bg-emerald-600 text-white'
    case 'HOT':
      return 'bg-indigo-600 text-white'
    case 'EXCLUSIVE':
      return 'bg-purple-600 text-white'
    default:
      return 'bg-slate-900 text-white'
  }
})
</script>

<template>
  <!-- GRID VIEW -->
  <div
    v-if="viewMode === 'grid'"
    class="group bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative"
  >
    <!-- Top Image Container -->
    <div class="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100 mb-3.5 cursor-pointer" @click="goToProduct">
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />

      <!-- Badge -->
      <span
        v-if="product.badge"
        :class="['absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-xs', badgeColor]"
      >
        {{ product.badge }}
      </span>

      <!-- Action Buttons Floating on top-right -->
      <div class="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
        <!-- Wishlist -->
        <button
          type="button"
          @click.stop="toggleWishlist(product)"
          class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-rose-500 transition-all hover:scale-110 cursor-pointer"
          :class="{ 'text-rose-500 !bg-rose-50': isInWishlist(product.id) }"
          title="Save to Wishlist"
          aria-label="Toggle wishlist"
        >
          <svg class="w-4 h-4" :fill="isInWishlist(product.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <!-- Quick View button -->
        <button
          type="button"
          @click.stop="openQuickView(product)"
          class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all hover:scale-110 cursor-pointer opacity-0 group-hover:opacity-100"
          title="Quick View"
          aria-label="Quick view"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        <!-- Compare button -->
        <button
          type="button"
          @click.stop="toggleCompare(product)"
          class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all hover:scale-110 cursor-pointer opacity-0 group-hover:opacity-100"
          :class="{ 'text-indigo-600 !bg-indigo-50 !opacity-100': isInCompare(product.id) }"
          title="Compare product"
          aria-label="Toggle compare"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </button>
      </div>

      <!-- Quick Stock pill -->
      <span
        v-if="product.stockStatus && product.stockStatus !== 'In Stock'"
        class="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 backdrop-blur-xs text-white"
      >
        {{ product.stockStatus }}
      </span>
    </div>

    <!-- Product Info -->
    <div class="flex-1 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
          <span>{{ product.brand }}</span>
          <ProductRating :rating="product.rating || 5" :reviews-count="product.reviewsCount || 0" size="xs" />
        </div>

        <h3
          @click="goToProduct"
          class="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-1 transition-colors"
        >
          {{ product.name }}
        </h3>

        <p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
          {{ product.tagline || product.description }}
        </p>
      </div>

      <!-- Price & Add to Cart -->
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <PriceDisplay :price="product.price" :original-price="product.originalPrice" size="md" />

        <button
          type="button"
          @click="handleAddToCart"
          class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 active:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add</span>
        </button>
      </div>
    </div>
  </div>

  <!-- LIST VIEW -->
  <div
    v-else
    class="group bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-4 flex flex-col sm:flex-row gap-5 items-center hover:shadow-lg transition-all duration-300"
  >
    <!-- Image -->
    <div class="relative w-full sm:w-48 aspect-4/3 sm:aspect-square rounded-xl bg-slate-100 overflow-hidden shrink-0 cursor-pointer" @click="goToProduct">
      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <span
        v-if="product.badge"
        :class="['absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase', badgeColor]"
      >
        {{ product.badge }}
      </span>
    </div>

    <!-- Details -->
    <div class="flex-1 min-w-0 w-full flex flex-col justify-between h-full py-1">
      <div>
        <div class="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
          <span>{{ product.brand }} · {{ product.category }}</span>
          <ProductRating :rating="product.rating || 5" :reviews-count="product.reviewsCount || 0" size="sm" />
        </div>

        <h3 @click="goToProduct" class="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors">
          {{ product.name }}
        </h3>

        <p class="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
          {{ product.description }}
        </p>

        <!-- Feature tags snippet -->
        <div v-if="product.features" class="flex flex-wrap gap-2 mt-2.5">
          <span
            v-for="(f, i) in product.features.slice(0, 2)"
            :key="i"
            class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
          >
            ✓ {{ f }}
          </span>
        </div>
      </div>

      <!-- Action row -->
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <PriceDisplay :price="product.price" :original-price="product.originalPrice" size="lg" />

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="toggleWishlist(product)"
            class="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            :class="{ 'text-rose-600 !bg-rose-50 !border-rose-200': isInWishlist(product.id) }"
            title="Wishlist"
          >
            <svg class="w-4 h-4" :fill="isInWishlist(product.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <button
            type="button"
            @click="openQuickView(product)"
            class="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
          >
            Quick View
          </button>

          <button
            type="button"
            @click="handleAddToCart"
            class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
