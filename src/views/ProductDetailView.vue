<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  addRecentlyViewed,
  addReview,
  addToCart,
  allProducts,
  formatPrice,
  isProductInWishlist,
  showToast,
  toggleCompare,
  togglePriceAlert,
  toggleWishlist,
  voteReviewHelpful,
} from '../data/store'
import AppIcon from '../components/AppIcon.vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import Modal from '../components/Modal.vue'
import PriceDisplay from '../components/PriceDisplay.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductGallery from '../components/ProductGallery.vue'
import ProductRating from '../components/ProductRating.vue'
import QuantitySelector from '../components/QuantitySelector.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
  params: {
    type: Object,
    default: () => ({ id: 1 }),
  },
})

const product = computed(() => {
  const targetId = Number(props.params?.id) || 1
  return allProducts.find((p) => p.id === targetId) || allProducts[0]
})

const quantity = ref(1)
const selectedColor = ref('')
const selectedStorage = ref('')
const activeTab = ref('overview') // 'overview' | 'features' | 'specs' | 'reviews'
const reviewSort = ref('newest')
const isReviewModalOpen = ref(false)

// Review Form State
const reviewForm = ref({
  userName: '',
  title: '',
  comment: '',
  rating: 5,
})

const initProductState = () => {
  if (product.value) {
    quantity.value = 1
    selectedColor.value = product.value.variants?.colors?.[0] || product.value.colors?.[0] || ''
    selectedStorage.value = product.value.variants?.storage?.[0] || product.value.storageOptions?.[0] || ''
    addRecentlyViewed(product.value.id)
  }
}

onMounted(initProductState)
watch(() => props.params?.id, initProductState)

const inWishlist = computed(() =>
  product.value ? isProductInWishlist(product.value.id) : false
)

const isProductInStock = computed(() => {
  if (!product.value) return false
  return (product.value.stock || 0) > 0
})

const handleAddToCart = () => {
  if (!product.value) return
  addToCart(
    product.value,
    quantity.value,
    {
      variant: [selectedColor.value, selectedStorage.value].filter(Boolean).join(' / ')
    }
  )
}

const handleBuyNow = () => {
  if (!product.value) return
  addToCart(
    product.value,
    quantity.value,
    {
      variant: [selectedColor.value, selectedStorage.value].filter(Boolean).join(' / ')
    }
  )
  props.navigate('checkout')
}

const handlePriceAlert = () => {
  if (!product.value) return
  togglePriceAlert(product.value.id)
}

// Review submissions
const handleSubmitReview = () => {
  if (!reviewForm.value.userName || !reviewForm.value.title || !reviewForm.value.comment) {
    showToast('Incomplete review', 'Please fill in all review fields.', 'error')
    return
  }
  addReview(product.value.id, {
    userName: reviewForm.value.userName,
    title: reviewForm.value.title,
    comment: reviewForm.value.comment,
    rating: reviewForm.value.rating,
  })
  isReviewModalOpen.value = false
  reviewForm.value = { userName: '', title: '', comment: '', rating: 5 }
}

// Sorted Reviews
const sortedReviews = computed(() => {
  if (!product.value?.reviews) return []
  const list = [...product.value.reviews]
  if (reviewSort.value === 'helpful') {
    list.sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
  } else if (reviewSort.value === 'highest') {
    list.sort((a, b) => b.rating - a.rating)
  } else if (reviewSort.value === 'lowest') {
    list.sort((a, b) => a.rating - b.rating)
  }
  return list
})

// Rating Distribution Percentages
const ratingBreakdown = computed(() => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const reviews = product.value?.reviews || []
  if (reviews.length === 0) return counts

  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.floor(r.rating)))
    counts[star] = (counts[star] || 0) + 1
  })

  const percentages = {}
  for (let s = 5; s >= 1; s--) {
    percentages[s] = Math.round((counts[s] / reviews.length) * 100)
  }
  return percentages
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return allProducts
    .filter((p) => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4)
})

const breadcrumbs = computed(() => [
  { label: 'Home', page: 'welcome' },
  { label: 'Shop', page: 'shop' },
  { label: product.value?.category || 'Category', page: 'shop', params: { category: product.value?.category } },
  { label: product.value?.name || 'Product Details' },
])
</script>

<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Top Main Product Area (2 Cols: Gallery on left, Details on right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left: Image Gallery (5 cols) -->
      <div class="lg:col-span-5">
        <ProductGallery
          :images="product.gallery || [product.image]"
          :product-name="product.name"
        />
      </div>

      <!-- Right: Product Information & Buying Options (7 cols) -->
      <div class="lg:col-span-7 bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <!-- Title & Category -->
        <div class="space-y-1">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-500">
              {{ product.brand }} · {{ product.category }}
            </span>
            <span
              v-if="product.badge"
              class="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded"
              :class="{
                'bg-red-600': product.badge === 'SALE' || product.badge === 'HOT',
                'bg-emerald-600': product.badge === 'NEW',
                'bg-amber-600': product.badge === 'BEST SELLER',
              }"
            >
              {{ product.badge }}
            </span>
          </div>

          <h1 class="text-2xl font-bold text-gray-900 leading-tight">
            {{ product.name }}
          </h1>

          <!-- Rating & SKU -->
          <div class="flex items-center gap-3 pt-1 text-xs">
            <ProductRating :rating="product.rating" size="sm" :count="product.reviewsCount" />
            <span class="text-gray-300">|</span>
            <span class="text-gray-500 font-mono">SKU: {{ product.sku }}</span>
          </div>
        </div>

        <!-- Pricing & Stock Row -->
        <div class="p-4 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
          <div>
            <PriceDisplay :price="product.price" :original-price="product.originalPrice" size="lg" />
            <p v-if="product.originalPrice" class="text-xs text-emerald-700 font-medium mt-1">
              You save ${{ formatPrice(product.originalPrice - product.price) }} ({{ Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) }}%)
            </p>
          </div>

          <div class="text-right">
            <span
              class="inline-block text-xs font-semibold px-2.5 py-1 rounded"
              :class="isProductInStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'"
            >
              {{ isProductInStock ? `In Stock (${product.stock} available)` : 'Out of Stock' }}
            </span>
            <p class="text-[11px] text-gray-500 mt-1">✓ Official Brand Warranty</p>
          </div>
        </div>

        <!-- Short Description -->
        <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {{ product.description }}
        </p>

        <!-- Variants: Colors -->
        <div v-if="(product.variants?.colors || product.colors)?.length > 0" class="space-y-2 text-xs">
          <label class="font-bold text-gray-900 block">
            Color Option: <span class="font-normal text-gray-600">{{ selectedColor }}</span>
          </label>
          <div class="flex gap-2">
            <button
              v-for="col in (product.variants?.colors || product.colors)"
              :key="col"
              type="button"
              @click="selectedColor = col"
              class="px-3 py-1.5 rounded border text-xs cursor-pointer transition-colors"
              :class="selectedColor === col ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            >
              {{ col }}
            </button>
          </div>
        </div>

        <!-- Variants: Storage -->
        <div v-if="(product.variants?.storage || product.storageOptions)?.length > 0" class="space-y-2 text-xs">
          <label class="font-bold text-gray-900 block">
            Storage Capacity: <span class="font-normal text-gray-600">{{ selectedStorage }}</span>
          </label>
          <div class="flex gap-2">
            <button
              v-for="st in (product.variants?.storage || product.storageOptions)"
              :key="st"
              type="button"
              @click="selectedStorage = st"
              class="px-3 py-1.5 rounded border text-xs cursor-pointer transition-colors"
              :class="selectedStorage === st ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            >
              {{ st }}
            </button>
          </div>
        </div>

        <!-- Quantity and Action Buttons -->
        <div class="space-y-4 pt-2 border-t border-gray-200">
          <div class="flex items-center gap-4 text-xs">
            <span class="font-bold text-gray-900">Quantity:</span>
            <QuantitySelector
              v-model="quantity"
              :max="product.stock || 10"
              size="md"
            />
            <span v-if="product.stock < 5" class="text-red-600 text-xs font-semibold">
              Only {{ product.stock }} left!
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              @click="handleAddToCart"
              :disabled="!isProductInStock"
              class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-200 text-white font-medium text-xs rounded transition-colors cursor-pointer text-center"
            >
              Add to Cart
            </button>

            <button
              type="button"
              @click="handleBuyNow"
              :disabled="!isProductInStock"
              class="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 active:bg-black disabled:bg-gray-200 text-white font-medium text-xs rounded transition-colors cursor-pointer text-center"
            >
              Buy Now (Instant Checkout)
            </button>
          </div>

          <!-- Shortcuts row (Wishlist, Compare, Price Alert) -->
          <div class="flex items-center justify-between gap-2 pt-2 text-xs text-gray-600 border-t border-gray-100 flex-wrap">
            <button
              type="button"
              @click="handleAddToCart; toggleWishlist(product.id)"
              class="hover:text-gray-900 cursor-pointer flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" :fill="inWishlist ? 'red' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{{ inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist' }}</span>
            </button>

            <button
              type="button"
              @click="toggleCompare(product.id)"
              class="hover:text-gray-900 cursor-pointer flex items-center gap-1.5"
            >
              <AppIcon name="scale" size="xs" />
              <span>Compare</span>
            </button>

            <button
              type="button"
              @click="handlePriceAlert"
              class="hover:text-gray-900 cursor-pointer flex items-center gap-1.5"
            >
              <AppIcon name="bell" size="xs" />
              <span>Notify on Price Drop</span>
            </button>
          </div>
        </div>

        <!-- Trust Value Props List -->
        <div class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
          <div class="flex items-center gap-2">
            <AppIcon name="truck" size="xs" className="text-blue-600" />
            <span>Free 2-day delivery on $100+</span>
          </div>
          <div class="flex items-center gap-2">
            <AppIcon name="shield" size="xs" className="text-emerald-600" />
            <span>2-Year Comprehensive Warranty</span>
          </div>
          <div class="flex items-center gap-2">
            <AppIcon name="refresh" size="xs" className="text-amber-600" />
            <span>30-Day Money-Back Guarantee</span>
          </div>
          <div class="flex items-center gap-2">
            <AppIcon name="lock" size="xs" className="text-gray-600" />
            <span>Encrypted Bank-Grade Checkout</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabbed Detailed Information Area -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <!-- Tabs Navigation Header -->
      <div class="flex border-b border-gray-200 bg-gray-50 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          @click="activeTab = 'overview'"
          class="px-6 py-3.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap"
          :class="activeTab === 'overview' ? 'border-blue-600 bg-white text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'"
        >
          Product Overview
        </button>

        <button
          type="button"
          @click="activeTab = 'features'"
          class="px-6 py-3.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap"
          :class="activeTab === 'features' ? 'border-blue-600 bg-white text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'"
        >
          Key Features ({{ product.features?.length || 0 }})
        </button>

        <button
          type="button"
          @click="activeTab = 'specs'"
          class="px-6 py-3.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap"
          :class="activeTab === 'specs' ? 'border-blue-600 bg-white text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'"
        >
          Technical Specifications
        </button>

        <button
          type="button"
          @click="activeTab = 'reviews'"
          class="px-6 py-3.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5"
          :class="activeTab === 'reviews' ? 'border-blue-600 bg-white text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'"
        >
          <span>Customer Reviews</span>
          <span class="bg-gray-200 text-gray-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
            {{ product.reviewsCount || 0 }}
          </span>
        </button>
      </div>

      <!-- Tab Content Body -->
      <div class="p-6 text-xs text-gray-700 leading-relaxed">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-4 max-w-3xl">
          <h3 class="text-base font-bold text-gray-900">About {{ product.name }}</h3>
          <p class="text-sm text-gray-600 leading-relaxed">{{ product.description }}</p>
          <p class="text-sm text-gray-600 leading-relaxed">
            Engineered with high standards for reliability, speed, and premium build quality. Tested rigorously to meet developer, creator, and gamer demands.
          </p>
        </div>

        <!-- Features Tab -->
        <div v-else-if="activeTab === 'features'" class="space-y-3 max-w-3xl">
          <h3 class="text-base font-bold text-gray-900">Highlights & Capabilities</h3>
          <ul class="space-y-2">
            <li
              v-for="(feat, idx) in product.features"
              :key="idx"
              class="flex items-start gap-2.5 text-xs text-gray-800"
            >
              <span class="text-blue-600 font-bold">✓</span>
              <span>{{ feat }}</span>
            </li>
          </ul>
        </div>

        <!-- Specifications Tab -->
        <div v-else-if="activeTab === 'specs'" class="space-y-4">
          <h3 class="text-base font-bold text-gray-900">Hardware Specifications</h3>
          <div class="border border-gray-200 rounded divide-y divide-gray-200 max-w-2xl">
            <div
              v-for="(val, key) in (product.specifications || product.specs || {})"
              :key="key"
              class="grid grid-cols-2 p-3 bg-white odd:bg-gray-50 text-xs"
            >
              <span class="font-bold text-gray-600 capitalize">{{ key.replace(/([A-Z])/g, ' $1') }}</span>
              <span class="font-medium text-gray-900 font-mono">{{ val }}</span>
            </div>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-else class="space-y-6">
          <!-- Reviews Header Summary -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-gray-50 border border-gray-200 rounded">
            <!-- Left Score -->
            <div class="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
              <span class="text-4xl font-bold text-gray-900 font-mono">{{ product.rating }}</span>
              <div class="flex justify-center my-1.5">
                <ProductRating :rating="product.rating" size="md" :show-count="false" />
              </div>
              <p class="text-xs text-gray-500">Based on {{ product.reviewsCount }} verified ratings</p>
            </div>

            <!-- Middle Distribution Bars -->
            <div class="md:col-span-5 space-y-1.5 text-xs">
              <div
                v-for="s in [5, 4, 3, 2, 1]"
                :key="s"
                class="flex items-center gap-2"
              >
                <span class="w-8 text-gray-600 font-bold flex items-center gap-0.5">
                  {{ s }}
                  <AppIcon name="star" size="xs" />
                </span>
                <div class="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-amber-400 h-full rounded-full"
                    :style="{ width: `${ratingBreakdown[s] || 0}%` }"
                  ></div>
                </div>
                <span class="w-8 text-right font-mono text-gray-500 text-[11px]">
                  {{ ratingBreakdown[s] || 0 }}%
                </span>
              </div>
            </div>

            <!-- Right: Write Review Trigger -->
            <div class="md:col-span-3 text-center">
              <button
                type="button"
                @click="isReviewModalOpen = true"
                class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
              >
                Write a Review
              </button>
            </div>
          </div>

          <!-- Reviews List Toolbar -->
          <div class="flex items-center justify-between pt-2">
            <span class="font-bold text-gray-900 text-xs">Showing {{ sortedReviews.length }} Reviews</span>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-gray-500">Sort:</span>
              <select
                v-model="reviewSort"
                class="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs cursor-pointer"
              >
                <option value="newest">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          <!-- Reviews Stream -->
          <div class="space-y-4 divide-y divide-gray-100">
            <div
              v-for="rev in sortedReviews"
              :key="rev.id"
              class="pt-4 first:pt-0 space-y-2"
            >
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-gray-900">{{ rev.userName }}</span>
                  <span class="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                    Verified Buyer
                  </span>
                </div>
                <span class="text-gray-400 font-mono text-[11px]">{{ rev.date }}</span>
              </div>

              <div class="flex items-center gap-2">
                <ProductRating :rating="rev.rating" size="xs" :show-count="false" />
                <h4 class="font-bold text-gray-900 text-xs">{{ rev.title }}</h4>
              </div>

              <p class="text-xs text-gray-600 leading-relaxed">{{ rev.comment }}</p>

              <div class="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  @click="voteReviewHelpful(product.id, rev.id)"
                  class="text-[11px] text-gray-500 hover:text-gray-800 border border-gray-200 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1"
                >
                  <AppIcon name="thumb-up" size="xs" />
                  <span>Helpful ({{ rev.helpful || 0 }})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div v-if="relatedProducts.length > 0" class="space-y-4">
      <h2 class="text-lg font-bold text-gray-900 pb-2 border-b border-gray-200">
        Related Products in {{ product.category }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="rel in relatedProducts"
          :key="rel.id"
          :product="rel"
          :navigate="navigate"
        />
      </div>
    </div>

    <!-- Write a Review Modal -->
    <Modal
      :is-open="isReviewModalOpen"
      title="Submit Product Review"
      @close="isReviewModalOpen = false"
    >
      <form @submit.prevent="handleSubmitReview" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-gray-900 mb-1">Your Name *</label>
          <input
            v-model="reviewForm.userName"
            type="text"
            required
            placeholder="e.g. Alex J."
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div>
          <label class="block font-bold text-gray-900 mb-1">Rating *</label>
          <div class="flex items-center gap-2">
            <ProductRating
              :rating="reviewForm.rating"
              :interactive="true"
              size="md"
              @update:rating="(r) => reviewForm.rating = r"
            />
            <span class="font-bold text-gray-700">({{ reviewForm.rating }} / 5 Stars)</span>
          </div>
        </div>

        <div>
          <label class="block font-bold text-gray-900 mb-1">Review Headline *</label>
          <input
            v-model="reviewForm.title"
            type="text"
            required
            placeholder="e.g. Best performance for the price"
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div>
          <label class="block font-bold text-gray-900 mb-1">Detailed Review *</label>
          <textarea
            v-model="reviewForm.comment"
            rows="4"
            required
            placeholder="Share your experience regarding build quality, battery life, ergonomics..."
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-2 border-t border-gray-200">
          <button
            type="button"
            @click="isReviewModalOpen = false"
            class="px-4 py-2 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded cursor-pointer transition-colors"
          >
            Submit Review
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>
