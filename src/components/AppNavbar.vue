<script setup>
import { ref } from 'vue'
import {
  cartCount,
  compareList,
  currentUser,
  logoutUser,
  mobileMenuOpen,
  notificationPanelOpen,
  openCartDrawer,
  toggleNotificationPanel,
  unreadNotificationsCount,
  wishlistCount,
} from '../data/store'
import NotificationPanel from './NotificationPanel.vue'
import SearchAutocomplete from './SearchAutocomplete.vue'

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

const handleNav = (page, params = null) => {
  mobileMenuOpen.value = false
  isUserMenuOpen.value = false
  notificationPanelOpen.value = false
  props.navigate(page, params)
}

const handleLogout = () => {
  isUserMenuOpen.value = false
  logoutUser()
  props.navigate('home')
}
</script>

<template>
  <header class="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
        <!-- Brand Logo -->
        <div class="flex items-center gap-3">
          <!-- Mobile menu button -->
          <button
            type="button"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <a
            href="/"
            class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight hover:text-indigo-600 transition-colors no-underline flex items-center gap-2.5"
            @click.prevent="handleNav('home')"
          >
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 text-white flex items-center justify-center font-extrabold shadow-md shadow-indigo-500/25">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="leading-none font-black tracking-tight text-slate-900">Tech<span class="text-indigo-600">Nova</span></span>
              <span class="text-[9px] uppercase tracking-widest text-slate-400 font-bold hidden sm:block">Next-Gen Electronics</span>
            </div>
          </a>
        </div>

        <!-- Center: Search Bar with Autocomplete -->
        <div class="hidden md:flex flex-1 max-w-lg mx-2">
          <SearchAutocomplete :navigate="navigate" />
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
          <button
            type="button"
            @click="handleNav('home')"
            class="px-3 py-2 rounded-xl transition-colors cursor-pointer"
            :class="currentPage === 'welcome' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'"
          >
            Home
          </button>

          <button
            type="button"
            @click="handleNav('shop')"
            class="px-3 py-2 rounded-xl transition-colors cursor-pointer"
            :class="currentPage === 'shop' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'"
          >
            Shop Catalog
          </button>

          <button
            type="button"
            @click="handleNav('deals')"
            class="px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            :class="currentPage === 'deals' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'"
          >
            <span>Deals</span>
            <span class="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-rose-500 text-white animate-badge">
              Hot
            </span>
          </button>

          <button
            type="button"
            @click="handleNav('compare')"
            class="px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            :class="currentPage === 'compare' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'"
          >
            <span>Compare</span>
            <span v-if="compareList.length > 0" class="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800">
              {{ compareList.length }}
            </span>
          </button>
        </nav>

        <!-- Right Side Quick Actions -->
        <div class="flex items-center gap-1.5 sm:gap-3">
          <!-- Notification Bell -->
          <div class="relative">
            <button
              type="button"
              @click="toggleNotificationPanel"
              class="relative p-2.5 rounded-2xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span
                v-if="unreadNotificationsCount > 0"
                class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white"
              >
                {{ unreadNotificationsCount }}
              </span>
            </button>

            <!-- Dropdown Component -->
            <NotificationPanel :navigate="navigate" />
          </div>

          <!-- Wishlist Button -->
          <button
            type="button"
            @click="handleNav('wishlist')"
            class="relative p-2.5 rounded-2xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span
              v-if="wishlistCount > 0"
              class="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white"
            >
              {{ wishlistCount }}
            </span>
          </button>

          <!-- Cart Drawer Button -->
          <button
            type="button"
            @click="openCartDrawer"
            class="relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
            aria-label="View Cart"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="hidden sm:inline">Cart</span>
            <span
              v-if="cartCount > 0"
              class="bg-white text-indigo-700 text-xs font-black px-1.5 py-0.2 rounded-full min-w-[20px] text-center"
            >
              {{ cartCount }}
            </span>
          </button>

          <!-- User Account Menu -->
          <div class="relative">
            <button
              type="button"
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="p-1 rounded-2xl border border-slate-200 hover:border-indigo-400 flex items-center gap-2 transition-all cursor-pointer"
              aria-label="User Account"
            >
              <img
                v-if="currentUser?.avatar"
                :src="currentUser.avatar"
                :alt="currentUser.name"
                class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover"
              />
              <div
                v-else
                class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs"
              >
                👤
              </div>
            </button>

            <!-- User Menu Dropdown -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs"
              @click="isUserMenuOpen = false"
            >
              <template v-if="currentUser">
                <div class="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <img :src="currentUser.avatar" class="w-10 h-10 rounded-xl object-cover" />
                  <div class="min-w-0">
                    <p class="font-bold text-slate-900 text-sm truncate">{{ currentUser.name }}</p>
                    <p class="text-[11px] text-slate-500 truncate">{{ currentUser.email }}</p>
                    <span class="inline-block mt-0.5 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                      ★ {{ currentUser.rewardPoints || 0 }} pts
                    </span>
                  </div>
                </div>

                <div class="py-1">
                  <button
                    type="button"
                    @click="handleNav('account')"
                    class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <span>📊</span> Account Dashboard
                  </button>
                  <button
                    type="button"
                    @click="handleNav('account/orders')"
                    class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <span>📦</span> Order History
                  </button>
                  <button
                    type="button"
                    @click="handleNav('account/addresses')"
                    class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <span>📍</span> Saved Addresses
                  </button>
                  <button
                    type="button"
                    @click="handleNav('account/notifications')"
                    class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <span>🔔</span> Notifications
                  </button>
                  <button
                    type="button"
                    @click="handleNav('account/security')"
                    class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <span>🔐</span> Security & Passwords
                  </button>
                </div>

                <div class="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              </template>

              <template v-else>
                <div class="p-3 text-center border-b border-slate-100">
                  <p class="font-bold text-slate-900 text-sm">Welcome to TechNova</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">Sign in to track orders & earn reward points</p>
                </div>

                <div class="p-2 space-y-1.5">
                  <button
                    type="button"
                    @click="handleNav('login')"
                    class="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-center cursor-pointer shadow-xs"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    @click="handleNav('register')"
                    class="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-center cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Search Bar Expanded -->
      <div class="md:hidden py-2.5 border-t border-slate-100">
        <SearchAutocomplete :navigate="navigate" :is-mobile="true" />
      </div>
    </div>

    <!-- Mobile Drawer Menu (Slide from Left) -->
    <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 z-50 flex">
      <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" @click="mobileMenuOpen = false"></div>

      <div class="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                TN
              </span>
              <span class="font-black text-slate-900 text-lg">TechNova</span>
            </div>
            <button
              type="button"
              @click="mobileMenuOpen = false"
              class="text-slate-400 hover:text-slate-900 p-1"
            >
              ✕
            </button>
          </div>

          <!-- Links -->
          <div class="space-y-2">
            <button
              type="button"
              @click="handleNav('home')"
              class="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm"
              :class="currentPage === 'welcome' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'"
            >
              🏠 Home
            </button>
            <button
              type="button"
              @click="handleNav('shop')"
              class="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm"
              :class="currentPage === 'shop' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'"
            >
              🛍️ Shop Catalog
            </button>
            <button
              type="button"
              @click="handleNav('deals')"
              class="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm flex items-center justify-between"
              :class="currentPage === 'deals' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'"
            >
              <span>🔥 Flash Deals</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">Sale</span>
            </button>
            <button
              type="button"
              @click="handleNav('compare')"
              class="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm"
              :class="currentPage === 'compare' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'"
            >
              ⚖️ Product Comparison
            </button>
            <button
              type="button"
              @click="handleNav('wishlist')"
              class="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm"
              :class="currentPage === 'wishlist' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'"
            >
              ♡ My Wishlist ({{ wishlistCount }})
            </button>
            <button
              type="button"
              @click="handleNav('order-tracking')"
              class="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm"
              :class="currentPage === 'order-tracking' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'"
            >
              📍 Track Order
            </button>
          </div>
        </div>

        <!-- Footer in Drawer -->
        <div class="pt-6 border-t border-slate-100">
          <div v-if="currentUser" class="space-y-2">
            <button
              type="button"
              @click="handleNav('account')"
              class="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs text-center"
            >
              Account Hub
            </button>
            <button
              type="button"
              @click="handleLogout"
              class="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs text-center"
            >
              Sign Out
            </button>
          </div>

          <div v-else class="space-y-2">
            <button
              type="button"
              @click="handleNav('login')"
              class="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs text-center"
            >
              Sign In
            </button>
            <button
              type="button"
              @click="handleNav('register')"
              class="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs text-center"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
