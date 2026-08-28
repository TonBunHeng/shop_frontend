<script setup>
import { cartCount, wishlistCount } from '../data/store'

const props = defineProps({
  currentPage: {
    type: String,
    default: 'welcome',
  },
  navigate: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg safe-area-inset-bottom"
    aria-label="Mobile navigation"
  >
    <div class="grid grid-cols-5 items-center text-center">
      <!-- Home -->
      <button
        type="button"
        @click="navigate('home')"
        class="flex flex-col items-center py-1 text-[10px] font-semibold transition-colors cursor-pointer"
        :class="currentPage === 'welcome' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'"
      >
        <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Home</span>
      </button>

      <!-- Shop / Catalog -->
      <button
        type="button"
        @click="navigate('shop')"
        class="flex flex-col items-center py-1 text-[10px] font-semibold transition-colors cursor-pointer"
        :class="currentPage === 'shop' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'"
      >
        <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span>Shop</span>
      </button>

      <!-- Wishlist -->
      <button
        type="button"
        @click="navigate('wishlist')"
        class="flex flex-col items-center py-1 text-[10px] font-semibold relative transition-colors cursor-pointer"
        :class="currentPage === 'wishlist' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'"
      >
        <div class="relative">
          <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span
            v-if="wishlistCount > 0"
            class="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center"
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
        class="flex flex-col items-center py-1 text-[10px] font-semibold relative transition-colors cursor-pointer"
        :class="currentPage === 'cart' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'"
      >
        <div class="relative">
          <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-2 bg-indigo-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center"
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
        class="flex flex-col items-center py-1 text-[10px] font-semibold transition-colors cursor-pointer"
        :class="currentPage.startsWith('account') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'"
      >
        <svg class="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Account</span>
      </button>
    </div>
  </nav>
</template>
