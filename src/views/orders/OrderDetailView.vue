<script setup>
import { computed } from 'vue'
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
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div v-if="order" class="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Order Details</span>
          <h1 class="text-xl font-bold text-gray-900 font-mono mt-0.5">{{ order.id }}</h1>
          <p class="text-xs text-gray-500">Placed on {{ order.date }}</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="navigate('order-tracking', { id: order.id })"
            class="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs rounded transition-colors cursor-pointer"
          >
            Track Shipment &rarr;
          </button>
          <button
            type="button"
            @click="handleReorder"
            class="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs rounded transition-colors cursor-pointer"
          >
            Reorder
          </button>
        </div>
      </div>

      <!-- Items List -->
      <div class="space-y-2">
        <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">Ordered Items</h3>
        <div class="divide-y divide-gray-200 border border-gray-200 rounded p-3">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
          >
            <div class="flex items-center gap-3 min-w-0">
              <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded object-cover border border-gray-200 shrink-0" />
              <div class="truncate">
                <p class="font-semibold text-gray-900 truncate">{{ item.name }}</p>
                <p class="text-[11px] text-gray-500 font-mono">Qty: {{ item.quantity }} × ${{ formatPrice(item.price) }}</p>
              </div>
            </div>
            <span class="font-mono font-bold text-gray-900 shrink-0 text-sm">
              ${{ formatPrice(item.price * item.quantity) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Breakdown & Address Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 text-xs">
        <div class="p-3.5 rounded bg-gray-50 border border-gray-200 space-y-1">
          <h4 class="font-bold text-gray-900 mb-1">Shipping Details</h4>
          <p class="font-medium text-gray-800">{{ order.shippingAddress?.fullName }}</p>
          <p class="text-gray-600">{{ order.shippingAddress?.address }}</p>
          <p class="text-gray-600">{{ order.shippingAddress?.city }}</p>
          <p class="text-gray-500 font-mono mt-1">Carrier: {{ order.carrier }}</p>
        </div>

        <div class="p-3.5 rounded bg-gray-50 border border-gray-200 space-y-1.5">
          <h4 class="font-bold text-gray-900 mb-1">Financial Summary</h4>
          <div class="flex justify-between">
            <span class="text-gray-600">Subtotal:</span>
            <span class="font-mono font-medium text-gray-900">${{ formatPrice(order.subtotal) }}</span>
          </div>
          <div v-if="order.discount > 0" class="flex justify-between text-emerald-600">
            <span>Discount:</span>
            <span class="font-mono font-medium">-${{ formatPrice(order.discount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Shipping:</span>
            <span class="font-mono">{{ order.shipping === 0 ? 'FREE' : `$${formatPrice(order.shipping)}` }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Sales Tax:</span>
            <span class="font-mono">${{ formatPrice(order.tax) }}</span>
          </div>
          <div class="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span class="text-blue-600 font-mono">${{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
