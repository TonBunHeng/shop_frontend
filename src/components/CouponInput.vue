<script setup>
import { ref } from 'vue'
import { appliedCoupon, applyCoupon, removeCoupon } from '../data/store'

const couponCode = ref('')

const handleApply = () => {
  if (couponCode.value.trim()) {
    applyCoupon(couponCode.value)
    couponCode.value = ''
  }
}
</script>

<template>
  <div class="space-y-2 text-xs">
    <!-- Active Coupon Badge -->
    <div
      v-if="appliedCoupon"
      class="flex items-center justify-between p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800"
    >
      <div class="flex items-center gap-1.5">
        <span>✓</span>
        <span>Coupon <strong>{{ appliedCoupon.code }}</strong> applied</span>
      </div>
      <button
        type="button"
        @click="removeCoupon"
        class="text-xs text-red-600 hover:underline font-bold cursor-pointer"
      >
        Remove
      </button>
    </div>

    <!-- Input Form -->
    <form v-else @submit.prevent="handleApply" class="flex gap-2">
      <input
        v-model="couponCode"
        type="text"
        placeholder="Enter promo code"
        class="flex-1 uppercase bg-white border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-blue-600 font-mono"
      />
      <button
        type="submit"
        :disabled="!couponCode.trim()"
        class="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium rounded text-xs transition-colors cursor-pointer"
      >
        Apply
      </button>
    </form>
  </div>
</template>
