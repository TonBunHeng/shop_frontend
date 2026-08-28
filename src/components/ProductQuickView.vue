<script setup>
import { computed, ref, watch } from 'vue'
import {
  addToCart,
  closeQuickView,
  formatPrice,
  isInWishlist,
  quickViewProduct,
  toggleWishlist,
} from '../data/store'
import PriceDisplay from './PriceDisplay.vue'
import ProductRating from './ProductRating.vue'
import QuantitySelector from './QuantitySelector.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const selectedColor = ref('')
const selectedStorage = ref('')
const quantity = ref(1)
const activeImageIndex = ref(0)

watch(
  quickViewProduct,
  (product) => {
    if (product) {
      selectedColor.value = product.variants?.colors?.[0] || ''
      selectedStorage.value = product.variants?.storage?.[0] || ''
      quantity.value = 1
      activeImageIndex.value = 0
    }
  },
  { immediate: true }
)

const currentImage = computed(() => {
  if (!quickViewProduct.value) return ''
  const gallery = quickViewProduct.value.gallery || [quickViewProduct.value.image]
  return gallery[activeImageIndex.value] || quickViewProduct.value.image
})

const handleAddToCart = () => {
  if (!quickViewProduct.value) return
  const variantStr = [selectedColor.value, selectedStorage.value].filter(Boolean).join(' / ')
  addToCart(quickViewProduct.value, quantity.value, { variant: variantStr })
  closeQuickView()
}

const goToFullDetails = () => {
  if (!quickViewProduct.value) return
  const id = quickViewProduct.value.id
  closeQuickView()
  props.navigate('product', { id })
}
</script>

<template>
  <div v-if="quickViewProduct" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      @click="closeQuickView"
    ></div>

    <!-- Modal Content -->
    <div
      class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8 p-6 sm:p-8"
      @click.stop
    >
      <!-- Close button -->
      <button
        type="button"
        @click="closeQuickView"
        class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Close"
      >
        ✕
      </button>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        <!-- Left: Image & Thumbnails (5 cols) -->
        <div class="md:col-span-5 space-y-3">
          <div class="relative aspect-square w-full rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
            <img
              :src="currentImage"
              :alt="quickViewProduct.name"
              class="w-full h-full object-cover"
            />
            <span
              v-if="quickViewProduct.badge"
              class="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-900 text-white shadow-xs"
            >
              {{ quickViewProduct.badge }}
            </span>
          </div>

          <!-- Thumbnails -->
          <div
            v-if="quickViewProduct.gallery && quickViewProduct.gallery.length > 1"
            class="flex items-center gap-2 overflow-x-auto pb-1"
          >
            <button
              v-for="(img, idx) in quickViewProduct.gallery"
              :key="idx"
              type="button"
              @click="activeImageIndex = idx"
              class="w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer"
              :class="activeImageIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 opacity-60 hover:opacity-100'"
            >
              <img :src="img" :alt="quickViewProduct.name" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Right: Info & Actions (7 cols) -->
        <div class="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
              <span>{{ quickViewProduct.brand }} · SKU: {{ quickViewProduct.sku || 'TN-SKU' }}</span>
              <span class="text-emerald-600 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {{ quickViewProduct.stockStatus || 'In Stock' }}
              </span>
            </div>

            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {{ quickViewProduct.name }}
            </h2>

            <div class="flex items-center gap-3 mt-2">
              <ProductRating :rating="quickViewProduct.rating || 5" :reviews-count="quickViewProduct.reviewsCount || 0" size="sm" />
              <span class="text-slate-300">|</span>
              <span class="text-xs text-slate-500">{{ quickViewProduct.salesCount || 100 }}+ sold</span>
            </div>

            <!-- Price -->
            <div class="mt-4">
              <PriceDisplay :price="quickViewProduct.price" :original-price="quickViewProduct.originalPrice" size="xl" />
            </div>

            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3 line-clamp-3">
              {{ quickViewProduct.description }}
            </p>
          </div>

          <!-- Color Option -->
          <div v-if="quickViewProduct.variants?.colors" class="space-y-2 pt-2 border-t border-slate-100">
            <span class="text-xs font-bold text-slate-900 block">
              Color: <span class="text-slate-500 font-normal">{{ selectedColor }}</span>
            </span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="color in quickViewProduct.variants.colors"
                :key="color"
                type="button"
                @click="selectedColor = color"
                class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                :class="selectedColor === color ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
              >
                {{ color }}
              </button>
            </div>
          </div>

          <!-- Storage Option -->
          <div v-if="quickViewProduct.variants?.storage" class="space-y-2">
            <span class="text-xs font-bold text-slate-900 block">
              Storage: <span class="text-slate-500 font-normal">{{ selectedStorage }}</span>
            </span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in quickViewProduct.variants.storage"
                :key="opt"
                type="button"
                @click="selectedStorage = opt"
                class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                :class="selectedStorage === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
              >
                {{ opt }}
              </button>
            </div>
          </div>

          <!-- Quantity & Action Buttons -->
          <div class="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <QuantitySelector v-model="quantity" :max="quickViewProduct.stock || 10" size="md" />

              <button
                type="button"
                @click="handleAddToCart"
                class="flex-1 py-3 px-6 rounded-xl bg-slate-900 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Cart — ${{ formatPrice(quickViewProduct.price * quantity) }}</span>
              </button>

              <button
                type="button"
                @click="toggleWishlist(quickViewProduct)"
                class="p-3 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                :class="{ 'text-rose-500 !bg-rose-50 !border-rose-200': isInWishlist(quickViewProduct.id) }"
                title="Wishlist"
              >
                <svg class="w-5 h-5" :fill="isInWishlist(quickViewProduct.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <!-- View Full Details Link -->
            <button
              type="button"
              @click="goToFullDetails"
              class="text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline py-1 cursor-pointer"
            >
              View Full Product Specifications & Customer Reviews &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
