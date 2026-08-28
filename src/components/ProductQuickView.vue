<script setup>
import { computed, ref, watch } from 'vue'
import {
  addToCart,
  allProducts,
  formatPrice,
  isProductInWishlist,
  quickViewProductId,
  showToast,
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

const product = computed(() => {
  if (!quickViewProductId.value) return null
  return allProducts.find((p) => p.id === quickViewProductId.value) || null
})

const quantity = ref(1)
const selectedImage = ref('')
const selectedColor = ref('')
const selectedStorage = ref('')

watch(
  product,
  (p) => {
    if (p) {
      quantity.value = 1
      selectedImage.value = p.image
      selectedColor.value = p.colors?.[0] || ''
      selectedStorage.value = p.storageOptions?.[0] || ''
    }
  },
  { immediate: true }
)

const handleAddToCart = () => {
  if (!product.value) return
  addToCart(
    product.value,
    quantity.value,
    selectedColor.value,
    selectedStorage.value
  )
  quickViewProductId.value = null
}

const handleBuyNow = () => {
  if (!product.value) return
  addToCart(
    product.value,
    quantity.value,
    selectedColor.value,
    selectedStorage.value
  )
  quickViewProductId.value = null
  props.navigate('checkout')
}

const viewFullDetails = () => {
  if (!product.value) return
  const id = product.value.id
  quickViewProductId.value = null
  props.navigate('product', { id })
}
</script>

<template>
  <div v-if="product">
    <!-- Backdrop Overlay -->
    <div
      class="fixed inset-0 bg-black/40 z-50 transition-opacity"
      @click="quickViewProductId = null"
    ></div>

    <!-- Center Dialog Container -->
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="bg-white rounded-lg border border-gray-200 shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative p-6"
        @click.stop
      >
        <!-- Close Button -->
        <button
          type="button"
          @click="quickViewProductId = null"
          class="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded cursor-pointer z-10"
        >
          ✕
        </button>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Left: Image Gallery Preview -->
          <div class="space-y-3">
            <div class="aspect-square bg-gray-50 border border-gray-200 rounded overflow-hidden flex items-center justify-center">
              <img
                :src="selectedImage || product.image"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Thumbnail strip -->
            <div v-if="product.gallery && product.gallery.length > 1" class="flex gap-2">
              <button
                v-for="(img, idx) in product.gallery"
                :key="idx"
                type="button"
                @click="selectedImage = img"
                class="w-12 h-12 rounded border cursor-pointer overflow-hidden"
                :class="selectedImage === img ? 'border-blue-600' : 'border-gray-200 opacity-60 hover:opacity-100'"
              >
                <img :src="img" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Right: Details & Buying Flow -->
          <div class="flex flex-col justify-between space-y-4 text-xs">
            <div class="space-y-2">
              <div>
                <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {{ product.brand }} · {{ product.category }}
                </span>
                <h2 class="text-base font-bold text-gray-900 mt-0.5">{{ product.name }}</h2>
              </div>

              <!-- Rating & SKU -->
              <div class="flex items-center gap-2">
                <ProductRating :rating="product.rating" size="xs" :count="product.reviewsCount" />
                <span class="text-gray-300">|</span>
                <span class="text-gray-400 font-mono text-[11px]">SKU: {{ product.sku }}</span>
              </div>

              <!-- Price -->
              <div class="py-2 border-y border-gray-100 flex items-center justify-between">
                <PriceDisplay :price="product.price" :original-price="product.originalPrice" size="md" />
                <span
                  class="font-medium text-[11px]"
                  :class="product.inStock ? 'text-emerald-600' : 'text-red-600'"
                >
                  {{ product.inStock ? `In Stock (${product.stock} units)` : 'Out of Stock' }}
                </span>
              </div>

              <!-- Description -->
              <p class="text-gray-600 leading-relaxed line-clamp-3">
                {{ product.description }}
              </p>

              <!-- Color options -->
              <div v-if="product.colors && product.colors.length > 0" class="space-y-1">
                <label class="font-bold text-gray-700 block">Color: <span class="font-normal">{{ selectedColor }}</span></label>
                <div class="flex gap-1.5">
                  <button
                    v-for="col in product.colors"
                    :key="col"
                    type="button"
                    @click="selectedColor = col"
                    class="px-2.5 py-1 rounded border text-xs cursor-pointer transition-colors"
                    :class="selectedColor === col ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
                  >
                    {{ col }}
                  </button>
                </div>
              </div>

              <!-- Storage options -->
              <div v-if="product.storageOptions && product.storageOptions.length > 0" class="space-y-1">
                <label class="font-bold text-gray-700 block">Capacity: <span class="font-normal">{{ selectedStorage }}</span></label>
                <div class="flex gap-1.5">
                  <button
                    v-for="st in product.storageOptions"
                    :key="st"
                    type="button"
                    @click="selectedStorage = st"
                    class="px-2.5 py-1 rounded border text-xs cursor-pointer transition-colors"
                    :class="selectedStorage === st ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
                  >
                    {{ st }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Actions row -->
            <div class="space-y-3 pt-2">
              <div class="flex items-center gap-3">
                <span class="font-bold text-gray-700">Quantity:</span>
                <QuantitySelector
                  v-model="quantity"
                  :max="product.stock || 10"
                  size="sm"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="handleAddToCart"
                  :disabled="!product.inStock"
                  class="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white font-medium rounded text-xs transition-colors cursor-pointer text-center"
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  @click="handleBuyNow"
                  :disabled="!product.inStock"
                  class="py-2.5 px-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 text-white font-medium rounded text-xs transition-colors cursor-pointer text-center"
                >
                  Buy Now
                </button>
              </div>

              <button
                type="button"
                @click="viewFullDetails"
                class="w-full text-center text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                View Full Product Page &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
