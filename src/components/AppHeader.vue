<script setup>
const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <div class="bg-slate-900 text-slate-300 text-[11px] font-medium py-1.5 px-4 border-b border-slate-800">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <!-- Left: Announcement -->
      <div class="flex items-center gap-2 truncate">
        <span class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase">
          Special
        </span>
        <span class="truncate">
          🎉 Free Express Shipping on orders over $100 · Use code <strong class="text-white font-mono">TECH10</strong> for 10% off
        </span>
      </div>

      <!-- Right: Links & Support -->
      <div class="hidden sm:flex items-center gap-4 shrink-0 text-slate-400">
        <button
          type="button"
          @click="navigate('deals')"
          class="hover:text-white transition-colors cursor-pointer"
        >
          Flash Deals 🔥
        </button>
        <button
          type="button"
          @click="navigate('compare')"
          class="hover:text-white transition-colors cursor-pointer"
        >
          Product Compare
        </button>
        <button
          type="button"
          @click="navigate('order-tracking')"
          class="hover:text-white transition-colors cursor-pointer"
        >
          Track Order
        </button>
        <span class="text-slate-600">|</span>
        <span class="text-slate-300 font-semibold">USD ($)</span>
      </div>
    </div>
  </div>
</template>
