<script setup>
defineProps({
  title: {
    type: String,
    default: 'Something went wrong',
  },
  message: {
    type: String,
    default: 'We encountered an error loading this content. Please try again.',
  },
  onRetry: {
    type: Function,
    default: null,
  },
})
</script>

<template>
  <div class="py-12 px-6 text-center max-w-md mx-auto bg-white rounded-2xl border border-rose-100 p-8 shadow-xs">
    <div class="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
      <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>

    <h3 class="text-base font-bold text-slate-900 mb-1">{{ title }}</h3>
    <p class="text-xs text-slate-500 mb-5">{{ message }}</p>

    <button
      v-if="onRetry"
      type="button"
      @click="onRetry"
      class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
    >
      Try Again
    </button>
  </div>
</template>
