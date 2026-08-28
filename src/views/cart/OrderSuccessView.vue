<script setup>
import { computed } from 'vue'
import { formatPrice, lastPlacedOrder, orders, showToast } from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const order = computed(() => {
  return lastPlacedOrder.value || orders.value[0] || null
})

const handleDownloadInvoice = () => {
  showToast('Invoice Generated 📄', `Invoice for order ${order.value?.id} ready for printing.`, 'success')
  window.print?.()
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Order Confirmation' },
]
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div v-if="order" class="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 space-y-6">
      <!-- Success Header -->
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-gray-200 text-center sm:text-left">
        <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shrink-0 font-bold">
          ✓
        </div>

        <div class="space-y-1">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Order Confirmed</span>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p class="text-xs text-gray-500">
            A confirmation receipt has been sent to <strong>{{ order.shippingAddress?.email || 'your email' }}</strong>.
          </p>
        </div>
      </div>

      <!-- Metadata Box -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded bg-gray-50 border border-gray-200 text-xs">
        <div>
          <span class="text-[10px] uppercase font-bold text-gray-400 block">Order Number</span>
          <span class="font-mono font-bold text-gray-900 text-xs mt-0.5 block">{{ order.id }}</span>
        </div>

        <div>
          <span class="text-[10px] uppercase font-bold text-gray-400 block">Order Date</span>
          <span class="font-medium text-gray-900 mt-0.5 block">{{ order.date }}</span>
        </div>

        <div>
          <span class="text-[10px] uppercase font-bold text-gray-400 block">Est. Delivery</span>
          <span class="font-medium text-blue-600 mt-0.5 block">{{ order.estimatedDelivery || 'In 2-3 Days' }}</span>
        </div>

        <div>
          <span class="text-[10px] uppercase font-bold text-gray-400 block">Payment Method</span>
          <span class="font-medium text-gray-900 mt-0.5 block">{{ order.paymentMethod }}</span>
        </div>
      </div>

      <!-- Order Items -->
      <div class="space-y-2">
        <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">Purchased Items</h3>
        <div class="divide-y divide-gray-200 border border-gray-200 rounded p-3">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <img :src="item.image" :alt="item.name" class="w-10 h-10 rounded object-cover shrink-0 border border-gray-200" />
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
      </div>

      <!-- Totals & Shipping Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 text-xs">
        <div class="space-y-1">
          <h4 class="font-bold text-gray-900 mb-1">Shipping Destination</h4>
          <p class="font-medium text-gray-800">{{ order.shippingAddress?.fullName }}</p>
          <p class="text-gray-600">{{ order.shippingAddress?.address }}</p>
          <p class="text-gray-600">{{ order.shippingAddress?.city }}</p>
          <p class="text-gray-500 font-mono mt-1">Carrier: {{ order.carrier }}</p>
        </div>

        <div class="space-y-1.5 sm:text-right text-gray-600">
          <div class="flex justify-between sm:justify-end sm:gap-6">
            <span>Subtotal</span>
            <span class="font-mono font-medium text-gray-900">${{ formatPrice(order.subtotal) }}</span>
          </div>
          <div v-if="order.discount > 0" class="flex justify-between sm:justify-end sm:gap-6 text-emerald-600">
            <span>Discount</span>
            <span class="font-mono font-medium">-${{ formatPrice(order.discount) }}</span>
          </div>
          <div class="flex justify-between sm:justify-end sm:gap-6">
            <span>Shipping</span>
            <span class="font-mono font-medium">{{ order.shipping === 0 ? 'FREE' : `$${formatPrice(order.shipping)}` }}</span>
          </div>
          <div class="flex justify-between sm:justify-end sm:gap-6">
            <span>Tax (5%)</span>
            <span class="font-mono font-medium">${{ formatPrice(order.tax) }}</span>
          </div>
          <div class="flex justify-between sm:justify-end sm:gap-6 text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total Paid</span>
            <span class="text-blue-600 font-mono">${{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          @click="navigate('order-tracking', { id: order.id })"
          class="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer text-center"
        >
          Track Shipment Timeline &rarr;
        </button>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            @click="handleDownloadInvoice"
            class="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded transition-colors cursor-pointer"
          >
            📄 Print Receipt
          </button>
          <button
            type="button"
            @click="navigate('shop')"
            class="flex-1 sm:flex-initial px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs rounded transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
