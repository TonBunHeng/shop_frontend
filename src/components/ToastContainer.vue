<script setup>
import { removeToast, toasts } from '../data/store'
</script>

<template>
  <div
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    aria-live="assertive"
  >
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 bg-white transition-all"
        :class="{
          'border-emerald-200 bg-emerald-50/90 text-emerald-900': toast.type === 'success',
          'border-rose-200 bg-rose-50/90 text-rose-900': toast.type === 'error',
          'border-amber-200 bg-amber-50/90 text-amber-900': toast.type === 'warning',
          'border-slate-200 bg-white text-slate-900': toast.type === 'info',
        }"
      >
        <!-- Icon -->
        <div
          class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
          :class="{
            'bg-emerald-200 text-emerald-800': toast.type === 'success',
            'bg-rose-200 text-rose-800': toast.type === 'error',
            'bg-amber-200 text-amber-800': toast.type === 'warning',
            'bg-indigo-100 text-indigo-700': toast.type === 'info',
          }"
        >
          <span v-if="toast.type === 'success'">✓</span>
          <span v-else-if="toast.type === 'error'">✕</span>
          <span v-else-if="toast.type === 'warning'">!</span>
          <span v-else>ℹ</span>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold leading-snug">{{ toast.title }}</h4>
          <p v-if="toast.message" class="text-[11px] opacity-80 mt-0.5 leading-relaxed">{{ toast.message }}</p>
        </div>

        <!-- Dismiss -->
        <button
          type="button"
          @click="removeToast(toast.id)"
          class="opacity-50 hover:opacity-100 text-xs font-bold p-1 transition-opacity cursor-pointer"
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
