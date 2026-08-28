<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  addRecentlyViewed,
  addReview,
  addToCart,
  allProducts,
  formatPrice,
  isInCompare,
  isInPriceAlert,
  isInWishlist,
  showToast,
  toggleCompare,
  togglePriceAlert,
  toggleWishlist,
  voteReviewHelpful,
} from '../data/store'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import Modal from '../components/Modal.vue'
import PriceDisplay from './../components/PriceDisplay.vue'
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

const product = ref(allProducts[0])
const selectedColor = ref('')
const selectedStorage = ref('')
const selectedRam = ref('')
const quantity = ref(1)
const activeTab = ref('overview') // 'overview' | 'features' | 'specs' | 'included' | 'warranty'
const isReviewModalOpen = ref(false)
const reviewSortBy = ref('newest') // 'newest' | 'helpful' | 'highest' | 'lowest'

// New review form
const newReview = ref({
  rating: 5,
  title: '',
  comment: '',
})

const loadProduct = () => {
  const id = Number(props.params?.id || 1)
  const found = allProducts.find((p) => p.id === id) || allProducts[0]
  product.value = found
  selectedColor.value = found.variants?.colors?.[0] || ''
  selectedStorage.value = found.variants?.storage?.[0] || ''
  selectedRam.value = found.variants?.ram?.[0] || ''
  quantity.value = 1
  addRecentlyViewed(found.id)
}

onMounted(() => {
  loadProduct()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

watch(
  () => props.params?.id,
  () => {
    loadProduct()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)

const breadcrumbs = computed(() => [
  { label: 'Home', page: 'welcome' },
  { label: 'Shop', page: 'shop' },
  { label: product.value.category?.toUpperCase() || 'CATEGORY', page: 'shop', params: { category: product.value.category } },
  { label: product.value.name },
])

const handleAddToCart = () => {
  const variantStr = [selectedColor.value, selectedStorage.value, selectedRam.value].filter(Boolean).join(' / ')
  addToCart(product.value, quantity.value, { variant: variantStr })
}

const handleBuyNow = () => {
  handleAddToCart()
  props.navigate('checkout')
}

// Reviews logic
const sortedReviews = computed(() => {
  if (!product.value.reviews) return []
  const list = [...product.value.reviews]
  if (reviewSortBy.value === 'highest') {
    return list.sort((a, b) => b.rating - a.rating)
  } else if (reviewSortBy.value === 'lowest') {
    return list.sort((a, b) => a.rating - b.rating)
  } else if (reviewSortBy.value === 'helpful') {
    return list.sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
  }
  return list.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const ratingDistribution = computed(() => {
  const reviews = product.value.reviews || []
  const total = reviews.length || 1
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => {
    const star = Math.floor(r.rating)
    if (counts[star] !== undefined) counts[star]++
  })

  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percentage: Math.round((counts[star] / total) * 100),
  }))
})

const submitReview = () => {
  if (!newReview.value.title.trim() || !newReview.value.comment.trim()) {
    showToast('Incomplete review', 'Please enter a review headline and comment.', 'error')
    return
  }
  addReview(product.value.id, newReview.value)
  isReviewModalOpen.value = false
  newReview.value = { rating: 5, title: '', comment: '' }
}

// Related products
const relatedProducts = computed(() =>
  allProducts.filter((p) => p.id !== product.value.id && p.category === product.value.category).slice(0, 4)
)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Main Product Hero Card -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <!-- Left Gallery (6 cols) -->
      <div class="lg:col-span-6">
        <ProductGallery
          :images="product.gallery || [product.image]"
          :alt="product.name"
          :badge="product.badge"
        />
      </div>

      <!-- Right Info & Actions (6 cols) -->
      <div class="lg:col-span-6 space-y-6">
        <div>
          <!-- Brand, SKU & Stock -->
          <div class="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
            <span>{{ product.brand }} · SKU: {{ product.sku }}</span>
            <span class="text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {{ product.stockStatus || 'In Stock' }} ({{ product.stock }} units)
            </span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {{ product.name }}
          </h1>

          <!-- Ratings & Sold Count -->
          <div class="flex items-center gap-4 mt-3 flex-wrap">
            <ProductRating :rating="product.rating || 5" :reviews-count="product.reviewsCount || 0" size="md" />
            <span class="text-slate-300">|</span>
            <span class="text-xs text-slate-500 font-medium">🔥 {{ product.salesCount || 150 }}+ customers ordered</span>
            <span class="text-slate-300">|</span>
            <button
              type="button"
              @click="togglePriceAlert(product.id)"
              class="text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              :class="isInPriceAlert(product.id) ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'"
            >
              <span>🔔</span>
              <span>{{ isInPriceAlert(product.id) ? 'Price Alert Active' : 'Notify Price Drop' }}</span>
            </button>
          </div>

          <!-- Price Display -->
          <div class="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <PriceDisplay :price="product.price" :original-price="product.originalPrice" size="xl" />
            <span class="text-xs font-semibold text-slate-500">Free Express Shipping</span>
          </div>

          <p class="text-sm text-slate-600 leading-relaxed mt-4">
            {{ product.description }}
          </p>
        </div>

        <!-- Variants: Colors -->
        <div v-if="product.variants?.colors" class="space-y-2 pt-4 border-t border-slate-200">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-900 uppercase tracking-wider">Color:</span>
            <span class="text-indigo-600 font-semibold">{{ selectedColor }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="c in product.variants.colors"
              :key="c"
              type="button"
              @click="selectedColor = c"
              class="px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
              :class="selectedColor === c ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <!-- Variants: Storage -->
        <div v-if="product.variants?.storage" class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-900 uppercase tracking-wider">Storage Capacity:</span>
            <span class="text-indigo-600 font-semibold">{{ selectedStorage }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in product.variants.storage"
              :key="s"
              type="button"
              @click="selectedStorage = s"
              class="px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
              :class="selectedStorage === s ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <!-- Variants: RAM / Switches -->
        <div v-if="product.variants?.ram" class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-900 uppercase tracking-wider">Unified RAM:</span>
            <span class="text-indigo-600 font-semibold">{{ selectedRam }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="r in product.variants.ram"
              :key="r"
              type="button"
              @click="selectedRam = r"
              class="px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
              :class="selectedRam === r ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
            >
              {{ r }}
            </button>
          </div>
        </div>

        <!-- Action Stepper & Buttons -->
        <div class="pt-6 border-t border-slate-200 space-y-3">
          <div class="flex items-center gap-3">
            <QuantitySelector v-model="quantity" :max="product.stock || 15" size="md" />

            <button
              type="button"
              @click="handleAddToCart"
              class="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Add to Cart — ${{ formatPrice(product.price * quantity) }}</span>
            </button>

            <!-- Wishlist Button -->
            <button
              type="button"
              @click="toggleWishlist(product)"
              class="p-3.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              :class="{ 'text-rose-500 !bg-rose-50 !border-rose-200': isInWishlist(product.id) }"
              title="Save to Wishlist"
            >
              <svg class="w-5 h-5" :fill="isInWishlist(product.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <!-- Compare Button -->
            <button
              type="button"
              @click="toggleCompare(product)"
              class="p-3.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              :class="{ 'text-indigo-600 !bg-indigo-50 !border-indigo-200': isInCompare(product.id) }"
              title="Compare Product"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </button>
          </div>

          <!-- Buy Now direct button -->
          <button
            type="button"
            @click="handleBuyNow"
            class="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            ⚡ Buy Now (Instant Checkout)
          </button>
        </div>

        <!-- Trust Badges Under Buttons -->
        <div class="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500">
          <div class="p-2 rounded-xl bg-slate-50">
            <span class="block font-bold text-slate-900">🛡️ 2-Year Warranty</span>
            <span>Official coverage</span>
          </div>
          <div class="p-2 rounded-xl bg-slate-50">
            <span class="block font-bold text-slate-900">🚚 Free Shipping</span>
            <span>Estimated 2-3 days</span>
          </div>
          <div class="p-2 rounded-xl bg-slate-50">
            <span class="block font-bold text-slate-900">🔄 30-Day Return</span>
            <span>Hassle-free money back</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabbed Specifications & Features Section -->
    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8">
      <!-- Tabs Navigation Header -->
      <div class="flex items-center gap-2 sm:gap-4 border-b border-slate-200 overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          type="button"
          @click="activeTab = 'overview'"
          class="pb-4 border-b-2 transition-all whitespace-nowrap cursor-pointer"
          :class="activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'"
        >
          Overview & Description
        </button>
        <button
          type="button"
          @click="activeTab = 'features'"
          class="pb-4 border-b-2 transition-all whitespace-nowrap cursor-pointer"
          :class="activeTab === 'features' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'"
        >
          Key Features ({{ product.features?.length || 0 }})
        </button>
        <button
          type="button"
          @click="activeTab = 'specs'"
          class="pb-4 border-b-2 transition-all whitespace-nowrap cursor-pointer"
          :class="activeTab === 'specs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'"
        >
          Technical Specifications
        </button>
        <button
          type="button"
          @click="activeTab = 'warranty'"
          class="pb-4 border-b-2 transition-all whitespace-nowrap cursor-pointer"
          :class="activeTab === 'warranty' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'"
        >
          Warranty & Support
        </button>
      </div>

      <!-- Tab Content: Overview -->
      <div v-if="activeTab === 'overview'" class="space-y-4 text-sm text-slate-600 leading-relaxed max-w-4xl">
        <h3 class="text-lg font-bold text-slate-900">Engineering Excellence</h3>
        <p>{{ product.description }}</p>
        <p>
          Each {{ product.name }} undergoes stringent quality verification tests to ensure optimal thermal performance, peak silicon clock stability, and flawless mechanical longevity.
        </p>
      </div>

      <!-- Tab Content: Features -->
      <div v-else-if="activeTab === 'features'" class="space-y-3 max-w-4xl">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Core Feature Highlights</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="(f, i) in product.features"
            :key="i"
            class="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
          >
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </span>
            <span class="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">{{ f }}</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Detailed Specifications -->
      <div v-else-if="activeTab === 'specs'" class="max-w-4xl">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Full Technical Specifications</h3>
        <div class="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
          <div
            v-for="(val, key) in product.specifications"
            :key="key"
            class="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs sm:text-sm bg-white even:bg-slate-50/60"
          >
            <span class="font-bold text-slate-500 uppercase tracking-wider text-xs">{{ key }}</span>
            <span class="sm:col-span-2 font-medium text-slate-900 mt-1 sm:mt-0">{{ val }}</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Warranty -->
      <div v-else-if="activeTab === 'warranty'" class="space-y-4 text-sm text-slate-600 leading-relaxed max-w-4xl">
        <h3 class="text-lg font-bold text-slate-900">Official TechNova Protection</h3>
        <p>
          This product is backed by a comprehensive 2-Year Official Manufacturer Warranty against manufacturing defects, electronic malfunctions, and battery degradation under standard operational conditions.
        </p>
        <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs space-y-1">
          <p class="font-bold">Need assistance or technical RMA support?</p>
          <p>Contact our round-the-clock engineering team at support@technova.com or call +1 (800) 832-4668.</p>
        </div>
      </div>
    </div>

    <!-- Product Customer Reviews Section -->
    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Customer Reviews</h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Verified purchaser opinions & ratings</p>
        </div>

        <button
          type="button"
          @click="isReviewModalOpen = true"
          class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          Write a Review
        </button>
      </div>

      <!-- Rating Breakdown Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <!-- Average Score (4 cols) -->
        <div class="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
          <span class="text-4xl sm:text-5xl font-black text-slate-900">{{ product.rating?.toFixed(1) || '5.0' }}</span>
          <span class="text-lg text-slate-400 font-bold"> / 5.0</span>

          <div class="mt-2 flex items-center justify-center md:justify-start">
            <ProductRating :rating="product.rating || 5" :reviews-count="product.reviewsCount || 0" size="md" :show-count="false" />
          </div>
          <p class="text-xs text-slate-500 mt-2 font-medium">Based on {{ product.reviewsCount || 0 }} verified customer ratings</p>
        </div>

        <!-- Rating Bars (8 cols) -->
        <div class="md:col-span-8 space-y-2">
          <div
            v-for="bar in ratingDistribution"
            :key="bar.star"
            class="flex items-center gap-3 text-xs"
          >
            <span class="w-12 font-bold text-slate-700 shrink-0">{{ bar.star }} Stars</span>
            <div class="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-amber-400 rounded-full transition-all duration-500"
                :style="{ width: `${bar.percentage}%` }"
              ></div>
            </div>
            <span class="w-10 text-right text-slate-400 font-mono">{{ bar.percentage }}%</span>
          </div>
        </div>
      </div>

      <!-- Reviews Sorting & Filter Header -->
      <div class="flex items-center justify-between gap-4">
        <h3 class="text-sm font-bold text-slate-900">
          Showing ({{ sortedReviews.length }}) reviews
        </h3>

        <div class="flex items-center gap-2 text-xs">
          <label for="reviewSortSelect" class="text-slate-500">Sort by:</label>
          <select
            id="reviewSortSelect"
            v-model="reviewSortBy"
            class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
          >
            <option value="newest">Newest First</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      <!-- Reviews Feed -->
      <div class="space-y-4 divide-y divide-slate-100">
        <div
          v-for="rev in sortedReviews"
          :key="rev.id"
          class="pt-4 first:pt-0 space-y-2"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {{ rev.author.charAt(0) }}
              </div>
              <div>
                <p class="text-xs font-bold text-slate-900">{{ rev.author }}</p>
                <span class="text-[10px] text-emerald-600 font-semibold">✓ Verified Buyer</span>
              </div>
            </div>

            <span class="text-[11px] text-slate-400 font-mono">{{ rev.date }}</span>
          </div>

          <div class="flex items-center gap-2">
            <ProductRating :rating="rev.rating" :show-count="false" size="xs" />
            <h4 class="text-xs sm:text-sm font-bold text-slate-900">{{ rev.title }}</h4>
          </div>

          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">{{ rev.comment }}</p>

          <!-- Helpful vote button -->
          <div class="flex items-center gap-2 pt-1">
            <button
              type="button"
              @click="voteReviewHelpful(product.id, rev.id)"
              class="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>👍 Helpful</span>
              <span v-if="rev.helpful > 0" class="text-indigo-600 font-bold">({{ rev.helpful }})</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div v-if="relatedProducts.length > 0" class="space-y-6">
      <div class="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Similar & Related Gear</h2>
          <p class="text-xs text-slate-500">Frequently explored together</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="p in relatedProducts"
          :key="p.id"
          :product="p"
          :navigate="navigate"
        />
      </div>
    </div>

    <!-- Write Review Modal -->
    <Modal :is-open="isReviewModalOpen" title="Write a Customer Review" @close="isReviewModalOpen = false">
      <form @submit.prevent="submitReview" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-900 mb-1.5">Rating (1 to 5 Stars)</label>
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
            <ProductRating v-model:rating="newReview.rating" :interactive="true" size="lg" :show-count="false" />
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">Headline / Summary *</label>
          <input
            v-model="newReview.title"
            type="text"
            placeholder="e.g. Blazing fast compilation speed & crisp screen"
            required
            class="w-full bg-white text-slate-900 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">Your Detailed Experience *</label>
          <textarea
            v-model="newReview.comment"
            rows="4"
            placeholder="What did you love about this device? How is the battery life, thermal noise, and build quality?"
            required
            class="w-full bg-white text-slate-900 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-hidden focus:border-indigo-500 leading-relaxed"
          ></textarea>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            @click="isReviewModalOpen = false"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md cursor-pointer"
          >
            Submit Review
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>
