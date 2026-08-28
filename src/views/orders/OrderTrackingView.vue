<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { formatPrice, orders } from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import EmptyState from '../../components/EmptyState.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
})

const query = ref('')
const selectedOrder = ref(null)

const findOrder = (idOrTracking) => {
  if (!idOrTracking) {
    selectedOrder.value = orders.value[0] || null
    return
  }
  const clean = String(idOrTracking).trim().toLowerCase()
  const found = orders.value.find(
    (o) => o.id.toLowerCase() === clean || o.trackingNumber.toLowerCase() === clean
  )
  selectedOrder.value = found || orders.value[0] || null
}

onMounted(() => {
  if (props.params?.id) {
    query.value = props.params.id
  }
  findOrder(props.params?.id)
})

watch(
  () => props.params?.id,
  (newId) => {
    if (newId) {
      query.value = newId
      findOrder(newId)
    }
  }
)

const handleLookup = () => {
  if (query.value.trim()) {
    findOrder(query.value)
  }
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Order History', page: 'account/orders' },
  { label: 'Order Tracking' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Header & Lookup Form -->
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
      <div class="space-y-1">
        <span class="text-xs font-black uppercase tracking-widest text-indigo-400">Live Logistics</span>
        <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Track Your Shipment</h1>
        <p class="text-xs sm:text-sm text-slate-300">
          Enter your Order ID (e.g. TN-2026-8F4K92) or Tracking Number
        </p>
      </div>

      <form @submit.prevent="handleLookup" class="flex gap-2 max-w-xl">
        <input
          v-model="query"
          type="text"
          placeholder="Enter Order ID or TN-TRK-..."
          class="flex-1 bg-white/10 text-white placeholder:text-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 border border-white/20 focus:outline-hidden focus:border-indigo-400 font-mono"
        />
        <button
          type="submit"
          class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
        >
          Track
        </button>
      </form>
    </div>

    <!-- Active Tracking Status Card -->
    <div v-if="selectedOrder" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8">
      <!-- Top info bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tracking Code</span>
          <p class="text-lg font-mono font-black text-slate-900">{{ selectedOrder.trackingNumber }}</p>
          <p class="text-xs text-slate-500 mt-0.5">Carrier: <strong class="text-slate-800">{{ selectedOrder.carrier }}</strong></p>
        </div>

        <div class="sm:text-right">
          <span class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Estimated Delivery</span>
          <p class="text-base font-bold text-indigo-600">{{ selectedOrder.estimatedDelivery || 'Feb 28, 2026' }}</p>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 inline-block mt-1">
            Status: {{ selectedOrder.status }}
          </span>
        </div>
      </div>

      <!-- Timeline Progress Flow -->
      <div class="space-y-4">
        <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Shipment Milestones</h3>

        <div class="relative pl-6 sm:pl-8 space-y-6 sm:space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          <div
            v-for="(step, idx) in (selectedOrder.statusTimeline || [])"
            :key="idx"
            class="relative flex items-start gap-4"
          >
            <!-- Step Marker Dot -->
            <div
              class="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white z-10"
              :class="step.current
                ? 'bg-indigo-600 text-white animate-pulse'
                : step.completed
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-400 border border-slate-200'"
            >
              <span v-if="step.completed">✓</span>
              <span v-else-if="step.current">●</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>

            <!-- Step Content -->
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4
                  class="text-xs sm:text-sm font-bold"
                  :class="step.completed || step.current ? 'text-slate-900' : 'text-slate-400'"
                >
                  {{ step.title }}
                </h4>
                <span class="text-[11px] text-slate-400 font-mono">{{ step.time }}</span>
              </div>
              <p
                v-if="step.current"
                class="text-xs text-indigo-600 font-semibold mt-0.5"
              >
                Current Phase: Package is in transit with courier hub.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Shipment Details Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <h4 class="font-bold text-slate-900 mb-1">Destination Address</h4>
          <p class="font-bold text-slate-800">{{ selectedOrder.shippingAddress?.fullName }}</p>
          <p class="text-slate-600">{{ selectedOrder.shippingAddress?.address }}</p>
          <p class="text-slate-600">{{ selectedOrder.shippingAddress?.city }}</p>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <h4 class="font-bold text-slate-900 mb-1">Items in Shipment ({{ selectedOrder.items?.length || 0 }})</h4>
          <div class="space-y-1 max-h-24 overflow-y-auto">
            <p v-for="item in selectedOrder.items" :key="item.id" class="text-slate-700 truncate">
              • {{ item.name }} (x{{ item.quantity }})
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty / Not Found -->
    <EmptyState
      v-else
      icon="box"
      title="No Order Selected"
      description="Enter a valid TechNova Order ID to track live delivery updates."
      action-text="View Your Orders"
      :action-click="() => navigate('account/orders')"
    />
  </div>
</template>
