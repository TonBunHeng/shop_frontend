<script setup>
import { computed, onMounted, ref } from 'vue'
import { addToCart, formatPrice, orders, showToast } from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
  params: {
    type: Object,
    default: () => ({ id: '' }),
  },
})

const order = computed(() => {
  const id = props.params?.id
  if (!id) return orders.value[0] || null
  return orders.value.find((o) => o.id === id) || orders.value[0] || null
})

const handleReorder = () => {
  if (!order.value) return
  order.value.items.forEach((item) => {
    addToCart(item, item.quantity)
  })
  showToast('Reordered!', 'Items added back to your cart.', 'success')
  props.navigate('cart')
}

const breadcrumbs = computed(() => [
  { label: 'Home', page: 'welcome' },
  { label: 'Orders', page: 'account/orders' },
  { label: `Order ${order.value?.id || ''}` },
])
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div v-if="order" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span class="text-xs font-black uppercase tracking-wider text-indigo-600">Order Details</span>
          <h1 class="text-2xl font-black text-slate-900 font-mono mt-0.5">{{ order.id }}</h1>
          <p class="text-xs text-slate-500">Placed on {{ order.date }}</p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="navigate('order-tracking', { id: order.id })"
            class="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs cursor-pointer"
          >
            Track Shipment &rarr;
          </button>
          <button
            type="button"
            @click="handleReorder"
            class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            Reorder
          </button>
        </div>
      </div>

      <!-- Items List -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Ordered Items</h3>
        <div class="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-4">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
          >
            <div class="flex items-center gap-3 min-w-0">
              <img :src="item.image" :alt="item.name" class="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div class="truncate">
                <p class="font-bold text-slate-900 text-sm truncate">{{ item.name }}</p>
                <p class="text-[11px] text-slate-500 font-mono">Qty: {{ item.quantity }} × ${{ formatPrice(item.price) }}</p>
              </div>
            </div>
            <span class="font-mono font-bold text-slate-900 shrink-0 text-sm">
              ${{ formatPrice(item.price * item.quantity) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Breakdown & Address Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <h4 class="font-bold text-slate-900 mb-1">Shipping & Contact Info</h4>
          <p class="font-bold text-slate-800">{{ order.shippingAddress?.fullName }}</p>
          <p class="text-slate-600">{{ order.shippingAddress?.address }}</p>
          <p class="text-slate-600">{{ order.shippingAddress?.city }}</p>
          <p class="text-slate-500 font-mono mt-1">Carrier: {{ order.carrier }}</p>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <h4 class="font-bold text-slate-900 mb-1">Financial Summary</h4>
          <div class="flex justify-between">
            <span class="text-slate-500">Subtotal:</span>
            <span class="font-mono font-bold text-slate-900">${{ formatPrice(order.subtotal) }}</span>
          </div>
          <div v-if="order.discount > 0" class="flex justify-between text-emerald-600">
            <span>Discount:</span>
            <span class="font-mono font-bold">-${{ formatPrice(order.discount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Shipping:</span>
            <span class="font-mono">{{ order.shipping === 0 ? 'FREE' : `$${formatPrice(order.shipping)}` }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Sales Tax:</span>
            <span class="font-mono">${{ formatPrice(order.tax) }}</span>
          </div>
          <div class="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Grand Total:</span>
            <span class="text-indigo-600 font-mono">${{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
