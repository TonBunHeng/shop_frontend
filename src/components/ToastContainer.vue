<script setup>
import { removeToast, toasts } from '../data/store'
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
    <TransitionGroup name="fade">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-lg p-3.5 flex items-start gap-3 transition-all"
        :class="{
          'border-l-4 border-l-emerald-600': t.type === 'success',
          'border-l-4 border-l-red-600': t.type === 'error',
          'border-l-4 border-l-amber-500': t.type === 'warning',
          'border-l-4 border-l-blue-600': t.type === 'info',
        }"
      >
        <!-- Icon -->
        <div class="shrink-0 mt-0.5">
          <svg v-if="t.type === 'success'" class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="t.type === 'error'" class="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else-if="t.type === 'warning'" class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 text-xs">
          <h4 class="font-bold text-gray-900">{{ t.title }}</h4>
          <p v-if="t.message" class="text-gray-600 mt-0.5 leading-relaxed">{{ t.message }}</p>
        </div>

        <!-- Close -->
        <button
          type="button"
          @click="removeToast(t.id)"
          class="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 text-xs"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
