<script setup>
import { computed } from 'vue'
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
import AppIcon from '../../components/AppIcon.vue'
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
  { label: 'My Account' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- User Header Banner -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4 text-center sm:text-left">
        <img
          :src="currentUser?.avatar || '../../public/images/IMG_9021.jpeg'"
          :alt="currentUser?.name || 'Shopper'"
          class="w-14 h-14 rounded-full object-cover border border-gray-300 shrink-0"
        />
        <div class="space-y-0.5">
          <div class="flex items-center gap-2 justify-center sm:justify-start">
            <h1 class="text-xl font-bold text-gray-900">{{ currentUser?.name || 'Shopper' }}</h1>
            <span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
              VIP
            </span>
          </div>
          <p class="text-xs text-gray-500">{{ currentUser?.email || 'shopper@technova.com' }}</p>
          <div class="flex items-center gap-1 text-xs text-amber-600 font-semibold pt-0.5 justify-center sm:justify-start">
            <AppIcon name="star" size="xs" />
            <span>{{ currentUser?.rewardPoints || 1250 }} Reward Points</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="navigate('shop')"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
        >
          Shop Catalog
        </button>
        <button
          type="button"
          @click="handleLogout"
          class="px-3.5 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>

    <!-- Metric Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        @click="navigate('account/orders')"
        class="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer flex items-center justify-between"
      >
        <div>
          <span class="text-xs font-semibold text-gray-500 block">Total Orders</span>
          <span class="text-2xl font-bold text-gray-900 font-mono mt-0.5 block">{{ orders.length }}</span>
        </div>
        <div class="w-10 h-10 rounded bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
          <AppIcon name="box" size="md" />
        </div>
      </div>

      <div
        @click="navigate('wishlist')"
        class="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer flex items-center justify-between"
      >
        <div>
          <span class="text-xs font-semibold text-gray-500 block">Saved Wishlist</span>
          <span class="text-2xl font-bold text-gray-900 font-mono mt-0.5 block">{{ wishlistCount }}</span>
        </div>
        <div class="w-10 h-10 rounded bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
          <AppIcon name="heart" size="md" />
        </div>
      </div>

      <div
        @click="navigate('account/notifications')"
        class="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer flex items-center justify-between"
      >
        <div>
          <span class="text-xs font-semibold text-gray-500 block">Unread Alerts</span>
          <span class="text-2xl font-bold text-gray-900 font-mono mt-0.5 block">{{ unreadNotificationsCount }}</span>
        </div>
        <div class="w-10 h-10 rounded bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
          <AppIcon name="bell" size="md" />
        </div>
      </div>

      <div
        class="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
      >
        <div>
          <span class="text-xs font-semibold text-gray-500 block">Reward Points</span>
          <span class="text-2xl font-bold text-amber-600 font-mono mt-0.5 block">{{ currentUser?.rewardPoints || 1250 }}</span>
        </div>
        <div class="w-10 h-10 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <AppIcon name="star" size="md" />
        </div>
      </div>
    </div>

    <!-- Main Account Grid (Sidebar Navigation + Content Preview) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Navigation Menu (4 cols) -->
      <div class="lg:col-span-4 bg-white rounded-lg border border-gray-200 p-3 space-y-1 text-xs font-medium">
        <button
          type="button"
          @click="navigate('account')"
          class="w-full text-left px-3 py-2.5 rounded bg-blue-50 text-blue-700 font-bold flex items-center justify-between cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <AppIcon name="chart" size="sm" />
            <span>Dashboard</span>
          </div>
          <span>&rarr;</span>
        </button>

        <button
          type="button"
          @click="navigate('account/orders')"
          class="w-full text-left px-3 py-2.5 rounded hover:bg-gray-50 text-gray-700 flex items-center justify-between cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <AppIcon name="box" size="sm" />
            <span>Order History</span>
          </div>
          <span class="text-gray-400">{{ orders.length }}</span>
        </button>

        <button
          type="button"
          @click="navigate('account/profile')"
          class="w-full text-left px-3 py-2.5 rounded hover:bg-gray-50 text-gray-700 flex items-center justify-between cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <AppIcon name="user" size="sm" />
            <span>Profile</span>
          </div>
        </button>

        <button
          type="button"
          @click="navigate('account/addresses')"
          class="w-full text-left px-3 py-2.5 rounded hover:bg-gray-50 text-gray-700 flex items-center justify-between cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <AppIcon name="pin" size="sm" />
            <span>Saved Addresses</span>
          </div>
          <span class="text-gray-400">{{ addresses.length }}</span>
        </button>

        <button
          type="button"
          @click="navigate('account/reviews')"
          class="w-full text-left px-3 py-2.5 rounded hover:bg-gray-50 text-gray-700 flex items-center justify-between cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <AppIcon name="star" size="sm" />
            <span>Product Reviews</span>
          </div>
        </button>

        <button
          type="button"
          @click="navigate('account/notifications')"
          class="w-full text-left px-3 py-2.5 rounded hover:bg-gray-50 text-gray-700 flex items-center justify-between cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <AppIcon name="bell" size="sm" />
            <span>Notifications</span>
          </div>
          <span v-if="unreadNotificationsCount > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-600 text-white font-bold">
            {{ unreadNotificationsCount }}
          </span>
        </button>

        <button
          type="button"
          @click="navigate('account/security')"
          class="w-full text-left px-3 py-2.5 rounded hover:bg-gray-50 text-gray-700 flex items-center justify-between cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <AppIcon name="lock" size="sm" />
            <span>Security & Password</span>
          </div>
        </button>

        <button
          type="button"
          @click="navigate('account/settings')"
          class="w-full text-left px-3 py-2.5 rounded hover:bg-gray-50 text-gray-700 flex items-center justify-between cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <AppIcon name="settings" size="sm" />
            <span>Settings</span>
          </div>
        </button>
      </div>

      <!-- Dashboard Overview Content (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Recent Orders Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 class="text-sm font-bold text-gray-900">Recent Purchases</h2>
            <button
              type="button"
              @click="navigate('account/orders')"
              class="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              View All &rarr;
            </button>
          </div>

          <div v-if="recentOrders.length > 0" class="divide-y divide-gray-100">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div class="flex items-center gap-2 font-mono">
                  <span class="font-bold text-gray-900">{{ order.id }}</span>
                  <span class="text-gray-400">· {{ order.date }}</span>
                </div>
                <p class="text-gray-600 mt-0.5">
                  {{ order.items.map(i => i.name).join(', ') }}
                </p>
                <span class="font-bold text-gray-900 font-mono mt-0.5 block">
                  Total: ${{ formatPrice(order.total) }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="navigate('order-tracking', { id: order.id })"
                  class="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded transition-colors cursor-pointer"
                >
                  Track
                </button>
                <button
                  type="button"
                  @click="handleReorder(order)"
                  class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded transition-colors cursor-pointer"
                >
                  Reorder
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-4 text-xs text-gray-400">
            No orders placed yet.
          </div>
        </div>

        <!-- Default Address Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-5 space-y-2">
          <div class="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 class="text-sm font-bold text-gray-900">Primary Delivery Address</h2>
            <button
              type="button"
              @click="navigate('account/addresses')"
              class="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Manage &rarr;
            </button>
          </div>

          <div v-if="defaultAddress" class="text-xs text-gray-600 space-y-0.5">
            <p class="font-bold text-gray-900">{{ defaultAddress.fullName }}</p>
            <p>{{ defaultAddress.address }}</p>
            <p>{{ defaultAddress.city }}, {{ defaultAddress.state }} {{ defaultAddress.zip }}</p>
            <p class="font-mono text-gray-500">Phone: {{ defaultAddress.phone || '+1 (555) 234-5678' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
