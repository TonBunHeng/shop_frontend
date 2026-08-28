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
  if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
    cancelOrder(orderId)
  }
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account Hub', page: 'account' },
  { label: 'Order History' },
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Manage and track your recent electronics purchases</p>
      </div>

      <button
        type="button"
        @click="navigate('shop')"
        class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
      >
        + Browse Products
      </button>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-sm">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Order ID, device name..."
          class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-hidden focus:border-indigo-500 focus:bg-white"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          class="px-3 py-1.5 rounded-xl font-bold transition-colors capitalize whitespace-nowrap cursor-pointer"
          :class="selectedStatus === st ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
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
        class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
      >
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs">
          <div class="flex items-center gap-3">
            <div>
              <span class="text-[10px] font-bold uppercase text-slate-400">Order ID</span>
              <p class="font-mono font-black text-slate-900 text-sm">{{ order.id }}</p>
            </div>
            <span class="text-slate-300">|</span>
            <div>
              <span class="text-[10px] font-bold uppercase text-slate-400">Date</span>
              <p class="font-bold text-slate-700">{{ order.date }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 rounded-full text-xs font-black uppercase"
              :class="{
                'bg-emerald-100 text-emerald-800': order.status === 'Delivered',
                'bg-blue-100 text-blue-800': order.status === 'Shipped',
                'bg-amber-100 text-amber-800': order.status === 'Processing',
                'bg-rose-100 text-rose-800': order.status === 'Cancelled',
              }"
            >
              {{ order.status }}
            </span>
          </div>
        </div>

        <!-- Items in order -->
        <div class="divide-y divide-slate-100">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
          >
            <div class="flex items-center gap-3 min-w-0">
              <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100" />
              <div class="truncate">
                <p class="font-bold text-slate-900 truncate">{{ item.name }}</p>
                <p class="text-[11px] text-slate-500 font-mono">Qty: {{ item.quantity }} × ${{ formatPrice(item.price) }}</p>
              </div>
            </div>

            <span class="font-mono font-bold text-slate-900 shrink-0">
              ${{ formatPrice(item.price * item.quantity) }}
            </span>
          </div>
        </div>

        <!-- Order Total & Actions Footer -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <span class="text-slate-500">Order Total: </span>
            <span class="text-base font-black text-slate-900 font-mono">${{ formatPrice(order.total) }}</span>
            <span class="text-[11px] text-slate-400 ml-2">via {{ order.paymentMethod }}</span>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              @click="navigate('order-tracking', { id: order.id })"
              class="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>📍 Track</span>
            </button>

            <button
              type="button"
              @click="handleReorder(order)"
              class="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors cursor-pointer"
            >
              Reorder
            </button>

            <button
              v-if="order.status === 'Processing'"
              type="button"
              @click="handleCancel(order.id)"
              class="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
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
      description="You haven't placed any orders matching these filters yet."
      action-text="Discover Products"
      :action-click="() => navigate('shop')"
    />
  </div>
</template>
