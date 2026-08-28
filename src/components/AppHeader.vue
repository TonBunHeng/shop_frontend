<script setup>
const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <div class="bg-gray-900 text-gray-300 text-xs py-2 px-4 border-b border-gray-800">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <!-- Left: Announcement -->
      <div class="flex items-center gap-2 truncate">
        <span class="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
          DEAL
        </span>
        <span class="truncate">
          Free standard shipping on orders over $100 · Use coupon code <strong class="text-white font-mono">TECH10</strong>
        </span>
      </div>

      <!-- Right: Navigation Shortcuts -->
      <div class="hidden sm:flex items-center gap-4 shrink-0 text-gray-400 text-xs">
        <button
          type="button"
          @click="navigate('deals')"
          class="hover:text-white transition-colors cursor-pointer"
        >
          Deals
        </button>
        <button
          type="button"
          @click="navigate('compare')"
          class="hover:text-white transition-colors cursor-pointer"
        >
          Compare
        </button>
        <button
          type="button"
          @click="navigate('order-tracking')"
          class="hover:text-white transition-colors cursor-pointer"
        >
          Track Order
        </button>
        <span class="text-gray-700">|</span>
        <span class="text-gray-300 font-medium">USD ($)</span>
      </div>
    </div>
  </div>
</template>
