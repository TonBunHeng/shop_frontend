<script setup>
import { computed, ref } from 'vue'
import { notifications, unreadNotificationsCount } from '../../data/store'
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
  { label: 'Account Hub', page: 'account' },
  { label: 'Notification Center' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Notification Center</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Stay up to date with shipping events, flash deals, and price drops</p>
      </div>

      <button
        v-if="unreadNotificationsCount > 0"
        type="button"
        @click="markAllRead"
        class="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
      >
        Mark All as Read
      </button>
    </div>

    <!-- Filters Tabs -->
    <div class="flex items-center gap-2 text-xs font-bold">
      <button
        v-for="f in ['all', 'order', 'promo', 'price_drop']"
        :key="f"
        type="button"
        @click="activeFilter = f"
        class="px-4 py-2 rounded-xl capitalize transition-colors cursor-pointer"
        :class="activeFilter === f ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'"
      >
        {{ f.replace('_', ' ') }}
      </button>
    </div>

    <!-- Notifications List -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
      <div
        v-for="notif in filteredNotifications"
        :key="notif.id"
        @click="handleNotifClick(notif)"
        class="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
        :class="{ 'bg-indigo-50/20': !notif.read }"
      >
        <div
          class="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0"
          :class="notif.type === 'order' ? 'bg-blue-100 text-blue-700' : notif.type === 'price_drop' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
        >
          <span v-if="notif.type === 'order'">📦</span>
          <span v-else-if="notif.type === 'price_drop'">📉</span>
          <span v-else>🔥</span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2 mb-1">
            <h3 class="text-sm font-bold text-slate-900 truncate">{{ notif.title }}</h3>
            <span class="text-xs text-slate-400 font-mono shrink-0">{{ notif.time }}</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">{{ notif.message }}</p>
        </div>

        <span
          v-if="!notif.read"
          class="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-2"
        ></span>
      </div>
    </div>
  </div>
</template>
