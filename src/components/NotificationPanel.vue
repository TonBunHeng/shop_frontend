<script setup>
import { computed, ref } from 'vue'
import {
  notifications,
  unreadNotificationsCount,
} from '../data/store'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  navigate: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['close'])

const activeFilter = ref('all') // 'all' | 'order' | 'promo'

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return notifications.value
  return notifications.value.filter((n) => n.type === activeFilter.value)
})

const markAllRead = () => {
  notifications.value.forEach((n) => (n.read = true))
}

const handleNotifClick = (notif) => {
  notif.read = true
  emit('close')
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
  <div
    v-if="isOpen"
    class="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 text-xs overflow-hidden"
  >
    <!-- Header -->
    <div class="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h3 class="font-bold text-gray-900">Notifications</h3>
        <span
          v-if="unreadNotificationsCount > 0"
          class="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full"
        >
          {{ unreadNotificationsCount }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="unreadNotificationsCount > 0"
          type="button"
          @click="markAllRead"
          class="text-blue-600 hover:underline text-[11px] font-medium cursor-pointer"
        >
          Mark all read
        </button>
        <button
          type="button"
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Category filter chips -->
    <div class="px-4 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center gap-1">
      <button
        v-for="f in ['all', 'order', 'promo']"
        :key="f"
        type="button"
        @click="activeFilter = f"
        class="px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors cursor-pointer"
        :class="activeFilter === f ? 'bg-blue-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-200'"
      >
        {{ f }}
      </button>
    </div>

    <!-- Notification List -->
    <div class="max-h-72 overflow-y-auto divide-y divide-gray-100">
      <div
        v-for="notif in filteredNotifications"
        :key="notif.id"
        @click="handleNotifClick(notif)"
        class="p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
        :class="{ 'bg-blue-50/40': !notif.read }"
      >
        <div class="w-7 h-7 rounded bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
          <AppIcon v-if="notif.type === 'order'" name="package" size="xs" />
          <AppIcon v-else-if="notif.type === 'price_drop'" name="trend-down" size="xs" />
          <AppIcon v-else name="fire" size="xs" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-1">
            <h4 class="font-bold text-gray-900 truncate">{{ notif.title }}</h4>
            <span class="text-[10px] text-gray-400 font-mono shrink-0">{{ notif.time }}</span>
          </div>
          <p class="text-gray-600 text-[11px] leading-relaxed mt-0.5">{{ notif.message }}</p>
        </div>

        <span
          v-if="!notif.read"
          class="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"
        ></span>
      </div>

      <div v-if="filteredNotifications.length === 0" class="p-6 text-center text-gray-400">
        No notifications in this category
      </div>
    </div>

    <!-- Footer link to notification hub -->
    <div class="p-2 border-t border-gray-100 bg-gray-50 text-center">
      <button
        type="button"
        @click="navigate('account/notifications'); emit('close')"
        class="text-blue-600 hover:underline font-semibold text-xs cursor-pointer"
      >
        Open Notification Center &rarr;
      </button>
    </div>
  </div>
</template>
