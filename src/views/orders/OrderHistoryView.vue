<script setup>
import { computed, ref } from 'vue'
import {
  addToCart,
  cancelOrder,
  formatPrice,
  orders,
  showToast,
} from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import EmptyState from '../../components/EmptyState.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const searchQuery = ref('')
const selectedStatus = ref('all')

const filteredOrders = computed(() => {
  let list = [...orders.value]

  if (selectedStatus.value !== 'all') {
    list = list.filter((o) => o.status.toLowerCase() === selectedStatus.value.toLowerCase())
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
    )
  }

  return list
})

const handleReorder = (order) => {
  order.items.forEach((item) => {
    addToCart(item, item.quantity)
  })
  showToast('Reordered!', 'Items added to your shopping cart.', 'success')
  props.navigate('cart')
}

const handleCancel = (orderId) => {
  if (confirm(`Cancel order ${orderId}?`)) {
    cancelOrder(orderId)
  }
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account', page: 'account' },
  { label: 'Order History' },
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Order History</h1>
        <p class="text-xs text-gray-500 mt-0.5">Manage and track your recent electronics purchases</p>
      </div>

      <button
        type="button"
        @click="navigate('shop')"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors cursor-pointer self-start sm:self-auto"
      >
        + Shop Products
      </button>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white rounded-lg border border-gray-200 p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-sm">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Order ID, item name..."
          class="w-full bg-gray-50 border border-gray-300 rounded pl-8 pr-3 py-1.5 text-xs focus:outline-hidden focus:border-blue-600 focus:bg-white"
        />
        <svg class="w-4 h-4 text-gray-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Status Tabs -->
      <div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
        <button
          v-for="st in ['all', 'Processing', 'Shipped', 'Delivered', 'Cancelled']"
          :key="st"
          type="button"
          @click="selectedStatus = st"
          class="px-2.5 py-1 rounded font-medium transition-colors capitalize whitespace-nowrap cursor-pointer text-xs"
          :class="selectedStatus === st ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          {{ st }}
        </button>
      </div>
    </div>

    <!-- Orders Cards List -->
    <div v-if="filteredOrders.length > 0" class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white rounded-lg border border-gray-200 p-5 space-y-3"
      >
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
          <div class="flex items-center gap-3">
            <div>
              <span class="text-[10px] font-bold uppercase text-gray-400">Order ID</span>
              <p class="font-mono font-bold text-gray-900">{{ order.id }}</p>
            </div>
            <span class="text-gray-300">|</span>
            <div>
              <span class="text-[10px] font-bold uppercase text-gray-400">Date</span>
              <p class="font-medium text-gray-700">{{ order.date }}</p>
            </div>
          </div>

          <div>
            <span
              class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase"
              :class="{
                'bg-emerald-100 text-emerald-800': order.status === 'Delivered',
                'bg-blue-100 text-blue-800': order.status === 'Shipped',
                'bg-amber-100 text-amber-800': order.status === 'Processing',
                'bg-red-100 text-red-800': order.status === 'Cancelled',
              }"
            >
              {{ order.status }}
            </span>
          </div>
        </div>

        <!-- Items in order -->
        <div class="divide-y divide-gray-100">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <img :src="item.image" :alt="item.name" class="w-10 h-10 rounded object-cover border border-gray-200 shrink-0" />
              <div class="truncate">
                <p class="font-semibold text-gray-900 truncate">{{ item.name }}</p>
                <p class="text-[11px] text-gray-500 font-mono">Qty: {{ item.quantity }} × ${{ formatPrice(item.price) }}</p>
              </div>
            </div>

            <span class="font-mono font-bold text-gray-900 shrink-0">
              ${{ formatPrice(item.price * item.quantity) }}
            </span>
          </div>
        </div>

        <!-- Order Total & Actions Footer -->
        <div class="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span class="text-gray-500">Order Total: </span>
            <span class="font-bold text-gray-900 font-mono text-sm">${{ formatPrice(order.total) }}</span>
            <span class="text-[11px] text-gray-400 ml-2">via {{ order.paymentMethod }}</span>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              @click="navigate('order-tracking', { id: order.id })"
              class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded transition-colors cursor-pointer text-xs"
            >
              Track Status
            </button>

            <button
              type="button"
              @click="handleReorder(order)"
              class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded transition-colors cursor-pointer text-xs"
            >
              Reorder
            </button>

            <button
              v-if="order.status === 'Processing'"
              type="button"
              @click="handleCancel(order.id)"
              class="px-2.5 py-1.5 text-red-600 hover:bg-red-50 font-medium rounded transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="orders"
      title="No orders found"
      description="You have not placed any orders matching the current filter."
      action-text="Browse Products"
      :action-click="() => navigate('shop')"
    />
  </div>
</template>
