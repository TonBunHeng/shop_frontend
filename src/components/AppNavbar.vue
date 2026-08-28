<script setup>
import { computed, ref } from 'vue'
import {
  cartCount,
  categories,
  currentUser,
  isCartDrawerOpen,
  logoutUser,
  unreadNotificationsCount,
  wishlistCount,
} from '../data/store'
import SearchAutocomplete from './SearchAutocomplete.vue'
import NotificationPanel from './NotificationPanel.vue'

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

const isUserMenuOpen = ref(false)
const isNotificationsOpen = ref(false)
const isMobileMenuOpen = ref(false)

const handleLogout = () => {
  logoutUser()
  isUserMenuOpen.value = false
  props.navigate('home')
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 gap-4 sm:gap-6">
        
        <!-- Left: Brand Logo -->
        <div class="flex items-center gap-6">
          <a
            href="/"
            @click.prevent="navigate('home')"
            class="flex items-center gap-2 text-xl font-bold text-gray-900 no-underline cursor-pointer"
          >
            <div class="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              TN
            </div>
            <span>Tech<span class="text-blue-600">Nova</span></span>
          </a>

          <!-- Desktop Nav Links -->
          <nav class="hidden md:flex items-center gap-5 text-sm font-medium text-gray-700">
            <button
              type="button"
              @click="navigate('home')"
              class="hover:text-blue-600 transition-colors cursor-pointer py-1"
              :class="{ 'text-blue-600 font-semibold': currentPage === 'welcome' }"
            >
              Home
            </button>

            <button
              type="button"
              @click="navigate('shop')"
              class="hover:text-blue-600 transition-colors cursor-pointer py-1"
              :class="{ 'text-blue-600 font-semibold': currentPage === 'shop' }"
            >
              Shop
            </button>

            <button
              type="button"
              @click="navigate('deals')"
              class="hover:text-blue-600 transition-colors cursor-pointer py-1 flex items-center gap-1"
              :class="{ 'text-blue-600 font-semibold': currentPage === 'deals' }"
            >
              <span>Deals</span>
              <span class="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.2 rounded">SALE</span>
            </button>

            <button
              type="button"
              @click="navigate('compare')"
              class="hover:text-blue-600 transition-colors cursor-pointer py-1"
              :class="{ 'text-blue-600 font-semibold': currentPage === 'compare' }"
            >
              Compare
            </button>
          </nav>
        </div>

        <!-- Center: Search Bar -->
        <div class="flex-1 max-w-md hidden sm:block">
          <SearchAutocomplete :navigate="navigate" />
        </div>

        <!-- Right: Actions (Wishlist, Notifications, Cart, Account) -->
        <div class="flex items-center gap-1 sm:gap-3">
          <!-- Notification Bell -->
          <div class="relative">
            <button
              type="button"
              @click="isNotificationsOpen = !isNotificationsOpen"
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span
                v-if="unreadNotificationsCount > 0"
                class="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {{ unreadNotificationsCount }}
              </span>
            </button>

            <NotificationPanel
              :is-open="isNotificationsOpen"
              :navigate="navigate"
              @close="isNotificationsOpen = false"
            />
          </div>

          <!-- Wishlist Button -->
          <button
            type="button"
            @click="navigate('wishlist')"
            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors relative cursor-pointer hidden sm:flex items-center gap-1.5"
            aria-label="Wishlist"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span
              v-if="wishlistCount > 0"
              class="bg-gray-200 text-gray-800 text-xs font-semibold px-1.5 py-0.2 rounded"
            >
              {{ wishlistCount }}
            </span>
          </button>

          <!-- Cart Button -->
          <button
            type="button"
            @click="isCartDrawerOpen = true"
            class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
            aria-label="Shopping Cart"
          >
            <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="text-xs font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
              {{ cartCount }}
            </span>
          </button>

          <!-- User Profile Dropdown -->
          <div class="relative">
            <button
              v-if="currentUser"
              type="button"
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <img
                :src="currentUser.avatar"
                :alt="currentUser.name"
                class="w-7 h-7 rounded-full object-cover border border-gray-300"
              />
              <span class="text-xs font-medium text-gray-700 hidden lg:inline max-w-[100px] truncate">
                {{ currentUser.name.split(' ')[0] }}
              </span>
            </button>

            <button
              v-else
              type="button"
              @click="navigate('login')"
              class="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <!-- User Menu -->
            <div
              v-if="isUserMenuOpen && currentUser"
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 text-xs"
            >
              <div class="px-3 py-2 border-b border-gray-100">
                <p class="font-bold text-gray-900 truncate">{{ currentUser.name }}</p>
                <p class="text-gray-500 truncate text-[11px]">{{ currentUser.email }}</p>
              </div>

              <button
                type="button"
                @click="navigate('account'); isUserMenuOpen = false"
                class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
              >
                Account Hub
              </button>

              <button
                type="button"
                @click="navigate('account/orders'); isUserMenuOpen = false"
                class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
              >
                Orders & Tracking
              </button>

              <button
                type="button"
                @click="navigate('account/addresses'); isUserMenuOpen = false"
                class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
              >
                Saved Addresses
              </button>

              <button
                type="button"
                @click="navigate('account/settings'); isUserMenuOpen = false"
                class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
              >
                Settings
              </button>

              <div class="border-t border-gray-100 my-1"></div>

              <button
                type="button"
                @click="handleLogout"
                class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-medium cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          <!-- Mobile Hamburger Toggle -->
          <button
            type="button"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 cursor-pointer"
            aria-label="Menu"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar (Below Navbar on small screens) -->
      <div class="sm:hidden pb-3">
        <SearchAutocomplete :navigate="navigate" />
      </div>

      <!-- Mobile Menu Dropdown -->
      <div v-if="isMobileMenuOpen" class="md:hidden py-3 border-t border-gray-200 text-sm space-y-2">
        <button
          type="button"
          @click="navigate('home'); isMobileMenuOpen = false"
          class="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50"
        >
          Home
        </button>
        <button
          type="button"
          @click="navigate('shop'); isMobileMenuOpen = false"
          class="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50"
        >
          Shop Products
        </button>
        <button
          type="button"
          @click="navigate('deals'); isMobileMenuOpen = false"
          class="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50"
        >
          Flash Deals & Coupons
        </button>
        <button
          type="button"
          @click="navigate('compare'); isMobileMenuOpen = false"
          class="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50"
        >
          Product Comparison
        </button>
      </div>
    </div>
  </header>
</template>
