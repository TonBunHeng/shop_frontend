<script setup>
import { computed, ref } from 'vue'
import {
  addresses,
  addToCart,
  currentUser,
  formatPrice,
  logoutUser,
  orders,
  showToast,
  unreadNotificationsCount,
  wishlistCount,
} from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const handleLogout = () => {
  logoutUser()
  props.navigate('home')
}

const defaultAddress = computed(() => {
  return addresses.value.find((a) => a.isDefault) || addresses.value[0] || null
})

const recentOrders = computed(() => {
  return orders.value.slice(0, 3)
})

const handleReorder = (order) => {
  order.items.forEach((item) => {
    addToCart(item, item.quantity)
  })
  showToast('Reordered!', 'Items added to your shopping cart.', 'success')
  props.navigate('cart')
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account Hub' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- User Welcome Hero Banner -->
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-4 text-center sm:text-left">
        <img
          :src="currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'"
          :alt="currentUser?.name || 'Shopper'"
          class="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-indigo-500 shadow-md shrink-0"
        />
        <div class="space-y-1">
          <div class="flex items-center gap-2 justify-center sm:justify-start">
            <h1 class="text-xl sm:text-2xl font-black text-white">{{ currentUser?.name || 'Shopper' }}</h1>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              VIP Member
            </span>
          </div>
          <p class="text-xs text-slate-300">{{ currentUser?.email || 'shopper@technova.com' }}</p>
          <span class="inline-block text-[11px] font-bold text-amber-400">
            ★ {{ currentUser?.rewardPoints || 1250 }} Reward Points Available
          </span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="navigate('shop')"
          class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          Explore Catalog
        </button>
        <button
          type="button"
          @click="handleLogout"
          class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>

    <!-- Metric Cards Grid (Orders, Wishlist, Notifications, Rewards) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div
        @click="navigate('account/orders')"
        class="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
      >
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
          <span class="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-1 block">{{ orders.length }}</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
          📦
        </div>
      </div>

      <div
        @click="navigate('wishlist')"
        class="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
      >
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Saved Wishlist</span>
          <span class="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-1 block">{{ wishlistCount }}</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl shrink-0">
          ♡
        </div>
      </div>

      <div
        @click="navigate('account/notifications')"
        class="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
      >
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Unread Alerts</span>
          <span class="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-1 block">{{ unreadNotificationsCount }}</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0">
          🔔
        </div>
      </div>

      <div
        class="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between"
      >
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Reward Points</span>
          <span class="text-2xl sm:text-3xl font-black text-amber-600 font-mono mt-1 block">{{ currentUser?.rewardPoints || 1250 }}</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
          ★
        </div>
      </div>
    </div>

    <!-- Main Account Grid (Sidebar Navigation + Content Preview) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Navigation Menu (4 cols) -->
      <div class="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-1 text-xs font-bold">
        <button
          type="button"
          @click="navigate('account')"
          class="w-full text-left px-4 py-3 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-between cursor-pointer"
        >
          <span class="flex items-center gap-2.5"><span>📊</span> Dashboard Overview</span>
          <span>&rarr;</span>
        </button>

        <button
          type="button"
          @click="navigate('account/orders')"
          class="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer"
        >
          <span class="flex items-center gap-2.5"><span>📦</span> Order History</span>
          <span class="text-slate-400">{{ orders.length }}</span>
        </button>

        <button
          type="button"
          @click="navigate('account/profile')"
          class="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer"
        >
          <span class="flex items-center gap-2.5"><span>👤</span> Personal Profile</span>
        </button>

        <button
          type="button"
          @click="navigate('account/addresses')"
          class="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer"
        >
          <span class="flex items-center gap-2.5"><span>📍</span> Shipping Address Book</span>
          <span class="text-slate-400">{{ addresses.length }}</span>
        </button>

        <button
          type="button"
          @click="navigate('account/reviews')"
          class="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer"
        >
          <span class="flex items-center gap-2.5"><span>⭐</span> My Product Reviews</span>
        </button>

        <button
          type="button"
          @click="navigate('account/notifications')"
          class="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer"
        >
          <span class="flex items-center gap-2.5"><span>🔔</span> Notifications & Alerts</span>
          <span v-if="unreadNotificationsCount > 0" class="px-2 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white">
            {{ unreadNotificationsCount }}
          </span>
        </button>

        <button
          type="button"
          @click="navigate('account/security')"
          class="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer"
        >
          <span class="flex items-center gap-2.5"><span>🔐</span> Security & Password</span>
        </button>

        <button
          type="button"
          @click="navigate('account/settings')"
          class="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer"
        >
          <span class="flex items-center gap-2.5"><span>⚙️</span> Store Preferences</span>
        </button>
      </div>

      <!-- Dashboard Overview Content (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Recent Orders Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-base font-bold text-slate-900">Recent Purchases</h2>
            <button
              type="button"
              @click="navigate('account/orders')"
              class="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              View All Orders &rarr;
            </button>
          </div>

          <div v-if="recentOrders.length > 0" class="divide-y divide-slate-100">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div class="flex items-center gap-2 font-mono">
                  <span class="font-black text-slate-900">{{ order.id }}</span>
                  <span class="text-slate-400">· {{ order.date }}</span>
                </div>
                <p class="text-slate-600 mt-1">
                  {{ order.items.map(i => i.name).join(', ') }}
                </p>
                <span class="font-bold text-slate-900 font-mono mt-1 block">
                  Total: ${{ formatPrice(order.total) }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="navigate('order-tracking', { id: order.id })"
                  class="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-colors cursor-pointer"
                >
                  Track
                </button>
                <button
                  type="button"
                  @click="handleReorder(order)"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Reorder
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-6 text-xs text-slate-400">
            No orders placed yet.
          </div>
        </div>

        <!-- Default Address Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-base font-bold text-slate-900">Primary Delivery Address</h2>
            <button
              type="button"
              @click="navigate('account/addresses')"
              class="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Manage Addresses &rarr;
            </button>
          </div>

          <div v-if="defaultAddress" class="text-xs text-slate-600 space-y-1">
            <p class="font-bold text-slate-900 text-sm">{{ defaultAddress.fullName }}</p>
            <p>{{ defaultAddress.address }}</p>
            <p>{{ defaultAddress.city }}, {{ defaultAddress.state }} {{ defaultAddress.zip }}</p>
            <p class="font-mono text-slate-500">Phone: {{ defaultAddress.phone || '+1 (555) 234-5678' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
