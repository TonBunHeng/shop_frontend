<script setup>
import { cartCount, unreadNotificationsCount, wishlistCount } from '../data/store'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
  currentPage: {
    type: String,
    default: 'welcome',
  },
})
</script>

<template>
  <nav class="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 py-1.5 px-2 flex items-center justify-around shadow-sm">
    <!-- Home -->
    <button
      type="button"
      @click="navigate('home')"
      class="flex flex-col items-center justify-center p-1 rounded text-xs transition-colors cursor-pointer"
      :class="currentPage === 'welcome' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-gray-900'"
    >
      <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span>Home</span>
    </button>

    <!-- Shop -->
    <button
      type="button"
      @click="navigate('shop')"
      class="flex flex-col items-center justify-center p-1 rounded text-xs transition-colors cursor-pointer"
      :class="currentPage === 'shop' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-gray-900'"
    >
      <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <span>Shop</span>
    </button>

    <!-- Wishlist -->
    <button
      type="button"
      @click="navigate('wishlist')"
      class="flex flex-col items-center justify-center p-1 rounded text-xs transition-colors relative cursor-pointer"
      :class="currentPage === 'wishlist' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-gray-900'"
    >
      <div class="relative">
        <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span
          v-if="wishlistCount > 0"
          class="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center"
        >
          {{ wishlistCount }}
        </span>
      </div>
      <span>Wishlist</span>
    </button>

    <!-- Cart -->
    <button
      type="button"
      @click="navigate('cart')"
      class="flex flex-col items-center justify-center p-1 rounded text-xs transition-colors relative cursor-pointer"
      :class="currentPage === 'cart' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-gray-900'"
    >
      <div class="relative">
        <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span
          v-if="cartCount > 0"
          class="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center"
        >
          {{ cartCount }}
        </span>
      </div>
      <span>Cart</span>
    </button>

    <!-- Account -->
    <button
      type="button"
      @click="navigate('account')"
      class="flex flex-col items-center justify-center p-1 rounded text-xs transition-colors cursor-pointer"
      :class="currentPage.startsWith('account') ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-gray-900'"
    >
      <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span>Account</span>
    </button>
  </nav>
</template>
