<script setup>
import { ref } from 'vue'
import { appliedCoupon, applyCoupon, formatPrice, removeCoupon } from '../data/store'

const couponInput = ref('')
const isApplying = ref(false)

const handleApply = () => {
  if (!couponInput.value.trim()) return
  isApplying.value = true
  setTimeout(() => {
    applyCoupon(couponInput.value)
    couponInput.value = ''
    isApplying.value = false
  }, 200)
}
</script>

<template>
  <div class="space-y-2">
    <!-- Input Form when no coupon applied -->
    <form v-if="!appliedCoupon" @submit.prevent="handleApply" class="flex gap-2">
      <div class="relative flex-1">
        <input
          v-model="couponInput"
          type="text"
          placeholder="Promo code (e.g. TECH10, SAVE20)"
          class="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 uppercase font-mono tracking-wider transition-all"
        />
      </div>

      <button
        type="submit"
        :disabled="!couponInput.trim() || isApplying"
        class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-slate-900 text-white text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer shadow-xs"
      >
        {{ isApplying ? 'Checking...' : 'Apply' }}
      </button>
    </form>

    <!-- Active coupon badge -->
    <div
      v-else
      class="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900"
    >
      <div class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
          %
        </span>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="font-mono font-bold text-xs sm:text-sm text-emerald-900">{{ appliedCoupon.code }}</span>
            <span class="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-800">
              Applied
            </span>
          </div>
          <p class="text-[11px] text-emerald-700 font-medium mt-0.5">
            {{ appliedCoupon.description }}
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="removeCoupon"
        class="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline p-1 cursor-pointer"
      >
        Remove
      </button>
    </div>
  </div>
</template>
