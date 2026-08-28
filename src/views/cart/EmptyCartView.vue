<script setup>
import { allProducts } from '../../data/store'
import ProductCard from '../../components/ProductCard.vue'

defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const recommendedProducts = allProducts.slice(0, 4)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
    <div class="text-center max-w-md mx-auto bg-white p-8 rounded-lg border border-gray-200">
      <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-500 mx-auto flex items-center justify-center mb-4 text-xl">
        🛒
      </div>
      <h1 class="text-lg font-bold text-gray-900">Your Cart is Empty</h1>
      <p class="text-xs text-gray-500 mt-1">Add some products to your cart and check out.</p>

      <button
        type="button"
        @click="navigate('home', '#products')"
        class="mt-5 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
      >
        Browse Products
      </button>
    </div>

    <!-- Recommendations -->
    <div class="mt-12">
      <h2 class="text-base font-bold text-gray-900 mb-4">Recommended Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <ProductCard
          v-for="product in recommendedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>
