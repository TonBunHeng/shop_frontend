<script setup>
import { computed, ref } from 'vue'
import { notifications, unreadNotificationsCount } from '../../data/store'
import AppIcon from '../../components/AppIcon.vue'
import Breadcrumbs from '../../components/Breadcrumbs.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const activeFilter = ref('all')

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return notifications.value
  return notifications.value.filter((n) => n.type === activeFilter.value)
})

const markAllRead = () => {
  notifications.value.forEach((n) => (n.read = true))
}

const handleNotifClick = (notif) => {
  notif.read = true
  if (notif.link) {
    if (notif.link.startsWith('/track-order/')) {
      const orderId = notif.link.replace('/track-order/', '')
      props.navigate('order-tracking', { id: orderId })
    } else if (notif.link.startsWith('/product/')) {
      const productId = notif.link.replace('/product/', '')
      props.navigate('product', { id: productId })
    } else if (notif.link === '/deals') {
      props.navigate('deals')
    }
  }
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account', page: 'account' },
  { label: 'Notifications' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Notification Center</h1>
        <p class="text-xs text-gray-500 mt-0.5">Stay up to date with shipping events, deals, and price drops</p>
      </div>

      <button
        v-if="unreadNotificationsCount > 0"
        type="button"
        @click="markAllRead"
        class="px-3.5 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded transition-colors cursor-pointer self-start sm:self-auto"
      >
        Mark All as Read
      </button>
    </div>

    <!-- Filters Tabs -->
    <div class="flex items-center gap-1.5 text-xs font-medium">
      <button
        v-for="f in ['all', 'order', 'promo', 'price_drop']"
        :key="f"
        type="button"
        @click="activeFilter = f"
        class="px-3 py-1.5 rounded capitalize transition-colors cursor-pointer"
        :class="activeFilter === f ? 'bg-blue-600 text-white font-bold' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'"
      >
        {{ f.replace('_', ' ') }}
      </button>
    </div>

    <!-- Notifications List -->
    <div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden text-xs">
      <div
        v-for="notif in filteredNotifications"
        :key="notif.id"
        @click="handleNotifClick(notif)"
        class="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
        :class="{ 'bg-blue-50/30': !notif.read }"
      >
        <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
          <AppIcon v-if="notif.type === 'order'" name="package" size="sm" />
          <AppIcon v-else-if="notif.type === 'price_drop'" name="trend-down" size="sm" />
          <AppIcon v-else name="fire" size="sm" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-bold text-gray-900 truncate">{{ notif.title }}</h3>
            <span class="text-gray-400 font-mono text-[11px] shrink-0">{{ notif.time }}</span>
          </div>
          <p class="text-gray-600 leading-relaxed mt-0.5">{{ notif.message }}</p>
        </div>

        <span
          v-if="!notif.read"
          class="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2"
        ></span>
      </div>
    </div>
  </div>
</template>
