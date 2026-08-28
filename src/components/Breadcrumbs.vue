<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    // [ { label: 'Home', page: 'welcome' }, { label: 'Laptops', page: 'shop', params: { category: 'laptops' } }, { label: 'Current Item' } ]
  },
  navigate: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-xs text-slate-500 py-3 overflow-x-auto">
    <template v-for="(item, idx) in items" :key="idx">
      <!-- Navigable link -->
      <button
        v-if="item.page && idx < items.length - 1"
        type="button"
        @click="navigate(item.page, item.params || '')"
        class="hover:text-indigo-600 transition-colors whitespace-nowrap font-medium cursor-pointer"
      >
        {{ item.label }}
      </button>

      <!-- Current active page (not clickable) -->
      <span v-else class="text-slate-900 font-bold whitespace-nowrap truncate max-w-[200px] sm:max-w-xs">
        {{ item.label }}
      </span>

      <!-- Chevron separator -->
      <svg
        v-if="idx < items.length - 1"
        class="w-3 h-3 text-slate-300 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </template>
  </nav>
</template>
