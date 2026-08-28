<script setup>
import { computed, ref } from 'vue'
import {
  notifications,
  notificationPanelOpen,
  unreadNotificationsCount,
} from '../data/store'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const activeFilter = ref('all') // 'all' | 'order' | 'promo' | 'price_drop'

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return notifications.value
  return notifications.value.filter((n) => n.type === activeFilter.value)
})

const markAllRead = () => {
  notifications.value.forEach((n) => (n.read = true))
}

const handleNotifClick = (notif) => {
  notif.read = true
  notificationPanelOpen.value = false

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
</script>

<template>
  <div v-if="notificationPanelOpen" class="relative z-50">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/10 backdrop-blur-[2px]"
      @click="notificationPanelOpen = false"
    ></div>

    <!-- Dropdown Panel -->
    <div
      class="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <!-- Header -->
      <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-bold text-slate-900">Notifications</h3>
          <span
            v-if="unreadNotificationsCount > 0"
            class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white"
          >
            {{ unreadNotificationsCount }} new
          </span>
        </div>

        <button
          v-if="unreadNotificationsCount > 0"
          type="button"
          @click="markAllRead"
          class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
        >
          Mark all read
        </button>
      </div>

      <!-- Filters -->
      <div class="px-4 py-2 border-b border-slate-100 flex items-center gap-1 overflow-x-auto text-[11px] font-semibold">
        <button
          type="button"
          @click="activeFilter = 'all'"
          class="px-2.5 py-1 rounded-full transition-colors cursor-pointer"
          :class="activeFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
        >
          All
        </button>
        <button
          type="button"
          @click="activeFilter = 'order'"
          class="px-2.5 py-1 rounded-full transition-colors cursor-pointer"
          :class="activeFilter === 'order' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
        >
          Orders
        </button>
        <button
          type="button"
          @click="activeFilter = 'price_drop'"
          class="px-2.5 py-1 rounded-full transition-colors cursor-pointer"
          :class="activeFilter === 'price_drop' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
        >
          Price Drops
        </button>
        <button
          type="button"
          @click="activeFilter = 'promo'"
          class="px-2.5 py-1 rounded-full transition-colors cursor-pointer"
          :class="activeFilter === 'promo' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
        >
          Deals
        </button>
      </div>

      <!-- Notification List -->
      <div class="max-h-80 overflow-y-auto divide-y divide-slate-100">
        <div
          v-if="filteredNotifications.length === 0"
          class="py-10 text-center text-slate-400 text-xs"
        >
          No notifications in this category.
        </div>

        <div
          v-for="notif in filteredNotifications"
          :key="notif.id"
          @click="handleNotifClick(notif)"
          class="p-4 hover:bg-slate-50 flex items-start gap-3 cursor-pointer transition-colors"
          :class="{ 'bg-indigo-50/30': !notif.read }"
        >
          <!-- Icon indicator -->
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm"
            :class="notif.type === 'order' ? 'bg-blue-100 text-blue-700' : notif.type === 'price_drop' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
          >
            <span v-if="notif.type === 'order'">📦</span>
            <span v-else-if="notif.type === 'price_drop'">📉</span>
            <span v-else>🔥</span>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1 mb-0.5">
              <h4 class="text-xs font-bold text-slate-900 truncate">{{ notif.title }}</h4>
              <span class="text-[10px] text-slate-400 shrink-0">{{ notif.time }}</span>
            </div>
            <p class="text-[11px] text-slate-600 leading-snug line-clamp-2">{{ notif.message }}</p>
          </div>

          <!-- Unread Dot -->
          <span
            v-if="!notif.read"
            class="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5"
          ></span>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <button
          type="button"
          @click="notificationPanelOpen = false; navigate('account/notifications')"
          class="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
        >
          View Notification Center &rarr;
        </button>
      </div>
    </div>
  </div>
</template>
