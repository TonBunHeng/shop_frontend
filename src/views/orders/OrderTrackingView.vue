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
  { label: 'Orders', page: 'account/orders' },
  { label: 'Order Tracking' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Lookup Box -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900 tracking-tight">Track Your Shipment</h1>
        <p class="text-xs text-gray-500 mt-0.5">
          Enter your Order ID (e.g. TN-2026-8F4K92) or Tracking Number
        </p>
      </div>

      <form @submit.prevent="handleLookup" class="flex gap-2 max-w-lg">
        <input
          v-model="query"
          type="text"
          placeholder="Enter Order ID or tracking code..."
          class="flex-1 bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 font-mono focus:bg-white focus:outline-hidden focus:border-blue-600"
        />
        <button
          type="submit"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
        >
          Track
        </button>
      </form>
    </div>

    <!-- Active Tracking Status Card -->
    <div v-if="selectedOrder" class="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <!-- Top info bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 text-xs">
        <div>
          <span class="text-[10px] font-bold uppercase text-gray-400">Tracking Code</span>
          <p class="text-base font-mono font-bold text-gray-900">{{ selectedOrder.trackingNumber }}</p>
          <p class="text-gray-500 mt-0.5">Carrier: <strong class="text-gray-800">{{ selectedOrder.carrier }}</strong></p>
        </div>

        <div class="sm:text-right">
          <span class="text-[10px] font-bold uppercase text-gray-400">Estimated Delivery</span>
          <p class="text-sm font-semibold text-blue-600">{{ selectedOrder.estimatedDelivery || 'In 2 Days' }}</p>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 inline-block mt-1">
            Status: {{ selectedOrder.status }}
          </span>
        </div>
      </div>

      <!-- Timeline Progress Flow -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">Milestones</h3>

        <div class="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          <div
            v-for="(step, idx) in (selectedOrder.statusTimeline || [])"
            :key="idx"
            class="relative flex items-start gap-3 text-xs"
          >
            <!-- Step Marker Dot -->
            <div
              class="absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white z-10"
              :class="step.current
                ? 'bg-blue-600 text-white'
                : step.completed
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-400 border border-gray-300'"
            >
              <span v-if="step.completed">✓</span>
              <span v-else-if="step.current">●</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>

            <!-- Step Content -->
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4
                  class="font-semibold text-xs"
                  :class="step.completed || step.current ? 'text-gray-900' : 'text-gray-400'"
                >
                  {{ step.title }}
                </h4>
                <span class="text-[11px] text-gray-400 font-mono">{{ step.time }}</span>
              </div>
              <p
                v-if="step.current"
                class="text-blue-600 font-medium text-[11px] mt-0.5"
              >
                In progress with logistics carrier.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 text-xs">
        <div class="p-3 rounded bg-gray-50 border border-gray-200 space-y-0.5">
          <h4 class="font-bold text-gray-900 mb-1">Destination Address</h4>
          <p class="font-medium text-gray-800">{{ selectedOrder.shippingAddress?.fullName }}</p>
          <p class="text-gray-600">{{ selectedOrder.shippingAddress?.address }}</p>
          <p class="text-gray-600">{{ selectedOrder.shippingAddress?.city }}</p>
        </div>

        <div class="p-3 rounded bg-gray-50 border border-gray-200 space-y-1">
          <h4 class="font-bold text-gray-900 mb-1">Items ({{ selectedOrder.items?.length || 0 }})</h4>
          <div class="space-y-0.5 max-h-20 overflow-y-auto">
            <p v-for="item in selectedOrder.items" :key="item.id" class="text-gray-700 truncate">
              • {{ item.name }} (x{{ item.quantity }})
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <EmptyState
      v-else
      icon="box"
      title="No Order Found"
      description="Please enter a valid TechNova Order ID to track shipment status."
      action-text="View Orders"
      :action-click="() => navigate('account/orders')"
    />
  </div>
</template>
