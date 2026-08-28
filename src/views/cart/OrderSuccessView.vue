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
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div v-if="order" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl space-y-8 text-center sm:text-left">
      <!-- Success Banner Header -->
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
        <div class="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shrink-0 shadow-xs">
          ✓
        </div>

        <div class="space-y-1">
          <span class="text-xs font-black uppercase tracking-widest text-emerald-600">Payment & Order Confirmed</span>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p class="text-xs sm:text-sm text-slate-500">
            A confirmation receipt has been sent to <strong>{{ order.shippingAddress?.email || 'your email' }}</strong>.
          </p>
        </div>
      </div>

      <!-- Order Metadata Box -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Order Number</span>
          <span class="font-mono font-black text-slate-900 text-sm mt-0.5 block">{{ order.id }}</span>
        </div>

        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Order Date</span>
          <span class="font-bold text-slate-900 mt-0.5 block">{{ order.date }}</span>
        </div>

        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Est. Delivery</span>
          <span class="font-bold text-indigo-600 mt-0.5 block">{{ order.estimatedDelivery || 'In 2-3 Days' }}</span>
        </div>

        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Payment Mode</span>
          <span class="font-bold text-slate-900 mt-0.5 block">{{ order.paymentMethod }}</span>
        </div>
      </div>

      <!-- Order Items Summary -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Purchased Devices</h3>
        <div class="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-4">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
          >
            <div class="flex items-center gap-3 min-w-0">
              <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-xl object-cover shrink-0" />
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
      </div>

      <!-- Totals & Shipping Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
        <div class="space-y-1">
          <h4 class="font-bold text-slate-900 mb-1">Shipping Destination</h4>
          <p class="font-bold text-slate-800">{{ order.shippingAddress?.fullName }}</p>
          <p class="text-slate-600">{{ order.shippingAddress?.address }}</p>
          <p class="text-slate-600">{{ order.shippingAddress?.city }}</p>
          <p class="text-slate-500 font-mono">Carrier: {{ order.carrier }}</p>
        </div>

        <div class="space-y-2 sm:text-right text-slate-600">
          <div class="flex justify-between sm:justify-end sm:gap-6">
            <span>Subtotal</span>
            <span class="font-mono font-bold text-slate-900">${{ formatPrice(order.subtotal) }}</span>
          </div>
          <div v-if="order.discount > 0" class="flex justify-between sm:justify-end sm:gap-6 text-emerald-600">
            <span>Discount</span>
            <span class="font-mono font-bold">-${{ formatPrice(order.discount) }}</span>
          </div>
          <div class="flex justify-between sm:justify-end sm:gap-6">
            <span>Shipping</span>
            <span class="font-mono font-medium">{{ order.shipping === 0 ? 'FREE' : `$${formatPrice(order.shipping)}` }}</span>
          </div>
          <div class="flex justify-between sm:justify-end sm:gap-6">
            <span>Sales Tax</span>
            <span class="font-mono font-medium">${{ formatPrice(order.tax) }}</span>
          </div>
          <div class="flex justify-between sm:justify-end sm:gap-6 text-base font-black text-slate-900 pt-2 border-t border-slate-100">
            <span>Total Paid</span>
            <span class="text-indigo-600 font-mono">${{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          @click="navigate('order-tracking', { id: order.id })"
          class="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>📍 Track Shipment Timeline</span>
        </button>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            @click="handleDownloadInvoice"
            class="flex-1 sm:flex-initial px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            📄 Print Invoice
          </button>
          <button
            type="button"
            @click="navigate('shop')"
            class="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
