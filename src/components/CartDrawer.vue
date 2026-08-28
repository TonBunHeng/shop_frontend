<script setup>
import {
  amountForFreeShipping,
  appliedCoupon,
  cart,
  cartDiscount,
  cartDrawerOpen,
  cartShipping,
  cartSubtotal,
  cartTotal,
  closeCartDrawer,
  formatPrice,
  freeShippingProgress,
  freeShippingThreshold,
  moveToCartFromSaved,
  removeFromCart,
  removeSavedForLater,
  savedForLater,
  saveForLaterAction,
  updateCartQuantity,
} from '../data/store'
import CouponInput from './CouponInput.vue'
import PriceDisplay from './PriceDisplay.vue'
import QuantitySelector from './QuantitySelector.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const goToCheckout = () => {
  closeCartDrawer()
  props.navigate('checkout')
}

const goToCartPage = () => {
  closeCartDrawer()
  props.navigate('cart')
}
</script>

<template>
  <div v-if="cartDrawerOpen" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      @click="closeCartDrawer"
    ></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
      <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
        <!-- Drawer Header -->
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-2">
            <h2 class="text-base font-extrabold text-slate-900">Your Cart</h2>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              {{ cart.length }}
            </span>
          </div>

          <button
            type="button"
            @click="closeCartDrawer"
            class="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <!-- Free Shipping Meter -->
        <div class="p-4 bg-indigo-50/70 border-b border-indigo-100">
          <div class="flex items-center justify-between text-xs font-bold mb-1.5">
            <span v-if="freeShippingProgress >= 100" class="text-emerald-700 flex items-center gap-1">
              🎉 Congratulations! You have unlocked <strong>FREE SHIPPING</strong>!
            </span>
            <span v-else class="text-indigo-900">
              Add <strong class="font-mono text-indigo-700">${{ formatPrice(amountForFreeShipping) }}</strong> more for <strong>FREE SHIPPING</strong>
            </span>
            <span class="text-indigo-600 font-mono text-[11px]">{{ freeShippingProgress }}%</span>
          </div>

          <div class="w-full h-2 bg-indigo-200/60 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
              :style="{ width: `${freeShippingProgress}%` }"
            ></div>
          </div>
        </div>

        <!-- Scrollable Items List -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          <!-- Empty Cart State -->
          <div v-if="cart.length === 0" class="py-16 text-center text-slate-500">
            <div class="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-slate-900 mb-1">Your cart is empty</h3>
            <p class="text-xs text-slate-500 max-w-xs mx-auto mb-5">
              Explore our tech gear, smart devices, laptops, and audio gear.
            </p>
            <button
              type="button"
              @click="closeCartDrawer(); navigate('shop')"
              class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Start Shopping Now
            </button>
          </div>

          <!-- Active Cart Items -->
          <div
            v-for="item in cart"
            :key="item.cartItemId || item.id"
            class="p-3.5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 shadow-xs flex gap-3.5 items-start transition-all"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
            />

            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-bold text-slate-900 truncate leading-snug">{{ item.name }}</h4>
              <p v-if="item.variant" class="text-[11px] text-indigo-600 font-semibold mt-0.5 truncate">
                {{ item.variant }}
              </p>
              <p class="text-xs font-mono font-bold text-slate-900 mt-1">
                ${{ formatPrice(item.price) }}
              </p>

              <!-- Controls row -->
              <div class="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <QuantitySelector
                  :model-value="item.quantity"
                  :max="item.stock || 15"
                  size="sm"
                  @update:model-value="(qty) => updateCartQuantity(item.cartItemId || item.id, qty)"
                />

                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    @click="saveForLaterAction(item.cartItemId || item.id)"
                    class="text-[11px] text-slate-500 hover:text-indigo-600 font-medium cursor-pointer"
                  >
                    Save for later
                  </button>
                  <button
                    type="button"
                    @click="removeFromCart(item.cartItemId || item.id)"
                    class="text-[11px] text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Saved for Later Accordion if any -->
          <div v-if="savedForLater.length > 0" class="pt-4 border-t border-slate-200">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Saved for later ({{ savedForLater.length }})
            </h4>

            <div class="space-y-2">
              <div
                v-for="sItem in savedForLater"
                :key="sItem.cartItemId || sItem.id"
                class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <img :src="sItem.image" :alt="sItem.name" class="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div class="truncate">
                    <p class="text-xs font-bold text-slate-800 truncate">{{ sItem.name }}</p>
                    <p class="text-[11px] text-slate-500 font-mono">${{ formatPrice(sItem.price) }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    @click="moveToCartFromSaved(sItem.cartItemId || sItem.id)"
                    class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 cursor-pointer"
                  >
                    Move to Cart
                  </button>
                  <button
                    type="button"
                    @click="removeSavedForLater(sItem.cartItemId || sItem.id)"
                    class="text-slate-400 hover:text-rose-600 text-xs p-1 cursor-pointer"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Drawer Footer with Pricing & Checkout -->
        <div v-if="cart.length > 0" class="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
          <!-- Promo Code Input -->
          <CouponInput />

          <!-- Summary Breakdown -->
          <div class="space-y-1.5 text-xs text-slate-600">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-bold text-slate-900 font-mono">${{ formatPrice(cartSubtotal) }}</span>
            </div>

            <div v-if="cartDiscount > 0" class="flex justify-between text-emerald-600 font-medium">
              <span>Promo Discount</span>
              <span class="font-mono">-${{ formatPrice(cartDiscount) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Estimated Shipping</span>
              <span class="font-mono font-medium">
                {{ cartShipping === 0 ? 'FREE' : `$${formatPrice(cartShipping)}` }}
              </span>
            </div>

            <div class="flex justify-between">
              <span>Sales Tax (5%)</span>
              <span class="font-mono font-medium">${{ formatPrice(cartTax) }}</span>
            </div>

            <div class="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total</span>
              <span class="text-indigo-600 font-mono">${{ formatPrice(cartTotal) }}</span>
            </div>
          </div>

          <!-- Checkout Actions -->
          <div class="space-y-2">
            <button
              type="button"
              @click="goToCheckout"
              class="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <span>&rarr;</span>
            </button>

            <button
              type="button"
              @click="goToCartPage"
              class="w-full py-2 text-center text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              View Full Cart & Save Items
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
