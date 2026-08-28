<script setup>
import { computed } from 'vue'
import {
  appliedCoupon,
  cart,
  cartDiscount,
  cartSubtotal,
  clearCart,
  formatPrice,
  freeShippingProgress,
  freeShippingRemaining,
  moveToWishlist,
  removeFromCart,
  savedForLater,
  saveForLaterAction,
  updateCartQuantity,
} from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import CouponInput from '../../components/CouponInput.vue'
import EmptyState from '../../components/EmptyState.vue'
import QuantitySelector from '../../components/QuantitySelector.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const estimatedShipping = computed(() => {
  if (appliedCoupon.value?.freeShipping) return 0
  return cartSubtotal.value >= 100 ? 0 : 15
})

const estimatedTax = computed(() => {
  const taxable = Math.max(0, cartSubtotal.value - cartDiscount.value)
  return Math.round(taxable * 0.05 * 100) / 100
})

const grandTotal = computed(() => {
  return Math.max(0, cartSubtotal.value + estimatedShipping.value + estimatedTax.value - cartDiscount.value)
})

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Shopping Cart' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div v-if="cart.length > 0" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Shopping Cart</h1>
          <p class="text-xs text-gray-500 mt-0.5">
            <strong>{{ cart.length }}</strong> products in your cart
          </p>
        </div>

        <button
          type="button"
          @click="clearCart"
          class="text-xs text-red-600 hover:underline font-semibold cursor-pointer self-start sm:self-auto"
        >
          Clear Cart
        </button>
      </div>

      <!-- Free Shipping Meter -->
      <div class="bg-white border border-gray-200 rounded-lg p-4 text-xs">
        <div class="flex justify-between items-center mb-1.5">
          <span v-if="freeShippingRemaining > 0" class="text-gray-700">
            Add <strong class="text-blue-600 font-mono">${{ formatPrice(freeShippingRemaining) }}</strong> more for Free Shipping
          </span>
          <span v-else class="text-emerald-700 font-bold">
            ✓ Free standard shipping unlocked!
          </span>
          <span class="font-mono text-gray-500">{{ Math.round(freeShippingProgress) }}%</span>
        </div>

        <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            class="bg-blue-600 h-full transition-all duration-300 rounded-full"
            :style="{ width: `${freeShippingProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- Main Grid (Cart items 8 cols + Summary 4 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Cart Items (8 cols) -->
        <div class="lg:col-span-8 bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          <div
            v-for="item in cart"
            :key="item.cartItemId || item.id"
            class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
          >
            <!-- Image & Product Details -->
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-16 h-16 rounded object-cover border border-gray-200 shrink-0 bg-gray-50"
              />

              <div class="truncate">
                <span class="text-[10px] uppercase font-bold text-gray-400 block">{{ item.brand }}</span>
                <h3
                  @click="navigate('product', { id: item.id })"
                  class="font-semibold text-gray-900 truncate hover:text-blue-600 cursor-pointer text-sm"
                >
                  {{ item.name }}
                </h3>

                <p v-if="item.selectedColor || item.selectedStorage" class="text-[11px] text-gray-500 mt-0.5">
                  <span v-if="item.selectedColor">Color: {{ item.selectedColor }}</span>
                  <span v-if="item.selectedColor && item.selectedStorage"> · </span>
                  <span v-if="item.selectedStorage">Storage: {{ item.selectedStorage }}</span>
                </p>

                <span class="font-mono text-gray-600 block mt-1">
                  ${{ formatPrice(item.price) }} each
                </span>
              </div>
            </div>

            <!-- Stepper, Total & Actions -->
            <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <!-- Quantity Stepper -->
              <QuantitySelector
                :model-value="item.quantity"
                :max="item.stock || 20"
                size="sm"
                @update:model-value="(q) => updateCartQuantity(item.cartItemId || item.id, q)"
              />

              <!-- Line Item Total -->
              <div class="text-right min-w-[5rem]">
                <span class="font-bold text-gray-900 font-mono text-sm block">
                  ${{ formatPrice(item.price * item.quantity) }}
                </span>
              </div>

              <!-- Action icons -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="saveForLaterAction(item.cartItemId || item.id)"
                  class="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                  title="Save for Later"
                >
                  📌
                </button>
                <button
                  type="button"
                  @click="removeFromCart(item.cartItemId || item.id)"
                  class="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                  title="Remove from Cart"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar (4 cols) -->
        <div class="lg:col-span-4 bg-white border border-gray-200 rounded-lg p-5 space-y-4 text-xs">
          <h2 class="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
            Order Summary
          </h2>

          <div class="space-y-2 text-gray-600">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-mono font-medium text-gray-900">${{ formatPrice(cartSubtotal) }}</span>
            </div>

            <div v-if="cartDiscount > 0" class="flex justify-between text-emerald-600 font-semibold">
              <span>Promo Discount</span>
              <span class="font-mono">-${{ formatPrice(cartDiscount) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Estimated Shipping</span>
              <span class="font-mono font-medium">
                {{ estimatedShipping === 0 ? 'FREE' : `$${formatPrice(estimatedShipping)}` }}
              </span>
            </div>

            <div class="flex justify-between">
              <span>Estimated Tax (5%)</span>
              <span class="font-mono font-medium">${{ formatPrice(estimatedTax) }}</span>
            </div>

            <div class="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Total</span>
              <span class="text-blue-600 font-mono">${{ formatPrice(grandTotal) }}</span>
            </div>
          </div>

          <!-- Coupon Input -->
          <div class="pt-2 border-t border-gray-100">
            <CouponInput />
          </div>

          <!-- Checkout button -->
          <div class="space-y-2 pt-2">
            <button
              type="button"
              @click="navigate('checkout')"
              class="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded text-xs transition-colors cursor-pointer text-center"
            >
              Proceed to Checkout &rarr;
            </button>

            <button
              type="button"
              @click="navigate('shop')"
              class="w-full py-2 bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded text-xs transition-colors cursor-pointer text-center"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <!-- Saved For Later Section -->
      <div v-if="savedForLater.length > 0" class="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
        <h2 class="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
          Saved For Later ({{ savedForLater.length }})
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="sItem in savedForLater"
            :key="sItem.cartItemId || sItem.id"
            class="border border-gray-200 rounded p-3 text-xs space-y-2 flex flex-col justify-between"
          >
            <div class="flex gap-2">
              <img :src="sItem.image" :alt="sItem.name" class="w-12 h-12 rounded object-cover shrink-0" />
              <div class="truncate">
                <h4 class="font-semibold text-gray-900 truncate">{{ sItem.name }}</h4>
                <span class="text-blue-600 font-mono font-bold">${{ formatPrice(sItem.price) }}</span>
              </div>
            </div>

            <button
              type="button"
              @click="saveForLaterAction(sItem.cartItemId || sItem.id)"
              class="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded transition-colors cursor-pointer text-center"
            >
              Move to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Cart State -->
    <EmptyState
      v-else
      icon="cart"
      title="Your shopping cart is empty"
      description="You have no items in your shopping cart. Discover tech essentials and upgrade your workspace today."
      action-text="Start Shopping"
      :action-click="() => navigate('shop')"
    />
  </div>
</template>
