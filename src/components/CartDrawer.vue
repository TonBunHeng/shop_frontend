<script setup>
import { computed } from 'vue'
import {
  appliedCoupon,
  cart,
  cartDiscount,
  cartSubtotal,
  formatPrice,
  freeShippingProgress,
  freeShippingRemaining,
  isCartDrawerOpen,
  moveToWishlist,
  removeFromCart,
  savedForLater,
  saveForLaterAction,
  updateCartQuantity,
} from '../data/store'
import CouponInput from './CouponInput.vue'
import QuantitySelector from './QuantitySelector.vue'

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

const goToCheckout = () => {
  isCartDrawerOpen.value = false
  props.navigate('checkout')
}

const goToCartPage = () => {
  isCartDrawerOpen.value = false
  props.navigate('cart')
}
</script>

<template>
  <div>
    <!-- Backdrop Overlay -->
    <div
      v-if="isCartDrawerOpen"
      @click="isCartDrawerOpen = false"
      class="fixed inset-0 bg-black/40 z-50 transition-opacity"
    ></div>

    <!-- Slideout Panel -->
    <aside
      class="fixed inset-y-0 right-0 max-w-md w-full bg-white z-50 shadow-xl flex flex-col justify-between transition-transform duration-200 ease-in-out border-l border-gray-200"
      :class="isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h2 class="text-base font-bold text-gray-900">Your Cart</h2>
          <span class="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded">
            {{ cart.length }} items
          </span>
        </div>

        <button
          type="button"
          @click="isCartDrawerOpen = false"
          class="p-1 text-gray-400 hover:text-gray-600 rounded cursor-pointer"
          aria-label="Close cart"
        >
          ✕
        </button>
      </div>

      <!-- Free Shipping Meter -->
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs">
        <div class="flex justify-between items-center mb-1">
          <span v-if="freeShippingRemaining > 0" class="text-gray-700">
            Add <strong class="text-blue-600 font-mono">${{ formatPrice(freeShippingRemaining) }}</strong> for Free Shipping
          </span>
          <span v-else class="text-emerald-700 font-semibold">
            ✓ You've unlocked Free Shipping!
          </span>
          <span class="font-mono text-gray-500">{{ Math.round(freeShippingProgress) }}%</span>
        </div>

        <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div
            class="bg-blue-600 h-full transition-all duration-300 rounded-full"
            :style="{ width: `${freeShippingProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- Scrollable Cart Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-gray-100">
        <!-- Empty State in Drawer -->
        <div v-if="cart.length === 0" class="text-center py-12 space-y-3">
          <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xl mx-auto">
            🛒
          </div>
          <h3 class="text-sm font-semibold text-gray-900">Your cart is empty</h3>
          <p class="text-xs text-gray-500 max-w-xs mx-auto">Looks like you haven't added any products to your cart yet.</p>
          <button
            type="button"
            @click="isCartDrawerOpen = false; navigate('shop')"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors cursor-pointer"
          >
            Start Shopping
          </button>
        </div>

        <!-- Items list -->
        <div
          v-for="item in cart"
          :key="item.cartItemId || item.id"
          class="pt-3 first:pt-0 flex gap-3 text-xs"
        >
          <!-- Thumbnail -->
          <img
            :src="item.image"
            :alt="item.name"
            class="w-16 h-16 rounded object-cover border border-gray-200 shrink-0 bg-gray-50"
          />

          <!-- Details -->
          <div class="flex-1 min-w-0 flex flex-col justify-between">
            <div class="flex justify-between items-start gap-2">
              <div>
                <h4 class="font-semibold text-gray-900 truncate">{{ item.name }}</h4>
                <p v-if="item.selectedColor || item.selectedStorage" class="text-[11px] text-gray-500">
                  {{ item.selectedColor }} <span v-if="item.selectedColor && item.selectedStorage">·</span> {{ item.selectedStorage }}
                </p>
              </div>

              <button
                type="button"
                @click="removeFromCart(item.cartItemId || item.id)"
                class="text-gray-400 hover:text-red-600 text-xs cursor-pointer p-0.5"
                title="Remove item"
              >
                ✕
              </button>
            </div>

            <!-- Stepper & Price Row -->
            <div class="flex items-center justify-between mt-2">
              <QuantitySelector
                :model-value="item.quantity"
                :max="item.stock || 20"
                size="sm"
                @update:model-value="(q) => updateCartQuantity(item.cartItemId || item.id, q)"
              />

              <div class="text-right">
                <span class="font-bold text-gray-900 font-mono">
                  ${{ formatPrice(item.price * item.quantity) }}
                </span>
                <span v-if="item.quantity > 1" class="text-[10px] text-gray-400 block">
                  ${{ formatPrice(item.price) }} each
                </span>
              </div>
            </div>

            <!-- Action shortcuts -->
            <div class="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500">
              <button
                type="button"
                @click="saveForLaterAction(item.cartItemId || item.id)"
                class="hover:text-gray-900 cursor-pointer underline"
              >
                Save for later
              </button>
              <button
                type="button"
                @click="moveToWishlist(item.cartItemId || item.id)"
                class="hover:text-gray-900 cursor-pointer underline"
              >
                Move to wishlist
              </button>
            </div>
          </div>
        </div>

        <!-- Saved For Later section in drawer -->
        <div v-if="savedForLater.length > 0" class="pt-4 border-t border-gray-200">
          <h4 class="text-xs font-bold text-gray-900 mb-2">Saved For Later ({{ savedForLater.length }})</h4>
          <div class="space-y-2">
            <div
              v-for="sItem in savedForLater"
              :key="sItem.cartItemId || sItem.id"
              class="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
            >
              <div class="flex items-center gap-2 min-w-0">
                <img :src="sItem.image" class="w-8 h-8 rounded object-cover shrink-0" />
                <span class="truncate text-gray-800 font-medium">{{ sItem.name }}</span>
              </div>
              <button
                type="button"
                @click="saveForLaterAction(sItem.cartItemId || sItem.id)"
                class="text-blue-600 hover:underline font-semibold shrink-0 cursor-pointer text-[11px]"
              >
                Move to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer / Totals & Checkout -->
      <div v-if="cart.length > 0" class="p-4 border-t border-gray-200 bg-gray-50 space-y-3 text-xs">
        <!-- Coupon input -->
        <CouponInput />

        <!-- Price breakdown -->
        <div class="space-y-1.5 pt-2 border-t border-gray-200 text-gray-600">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span class="font-mono font-medium text-gray-900">${{ formatPrice(cartSubtotal) }}</span>
          </div>

          <div v-if="cartDiscount > 0" class="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span class="font-mono font-medium">-${{ formatPrice(cartDiscount) }}</span>
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

          <div class="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span class="text-blue-600 font-mono">${{ formatPrice(grandTotal) }}</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="space-y-2 pt-1">
          <button
            type="button"
            @click="goToCheckout"
            class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs rounded transition-colors cursor-pointer text-center"
          >
            Proceed to Checkout &rarr;
          </button>

          <button
            type="button"
            @click="goToCartPage"
            class="w-full py-2 px-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium text-xs rounded transition-colors cursor-pointer text-center"
          >
            View Full Cart
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>
