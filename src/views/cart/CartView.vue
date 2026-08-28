<script setup>
import {
  amountForFreeShipping,
  appliedCoupon,
  cart,
  cartDiscount,
  cartShipping,
  cartSubtotal,
  cartTotal,
  clearCart,
  formatPrice,
  freeShippingProgress,
  moveToCartFromSaved,
  removeFromCart,
  removeSavedForLater,
  savedForLater,
  saveForLaterAction,
  toggleWishlist,
  updateCartQuantity,
} from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import CouponInput from '../../components/CouponInput.vue'
import EmptyState from '../../components/EmptyState.vue'
import PriceDisplay from '../../components/PriceDisplay.vue'
import QuantitySelector from '../../components/QuantitySelector.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const handleMoveToWishlist = (item) => {
  toggleWishlist(item.id)
  removeFromCart(item.cartItemId || item.id)
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Shopping Cart' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div v-if="cart.length > 0" class="space-y-8">
      <!-- Header & Clear Cart -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
            You have <strong>{{ cart.length }}</strong> unique items in your cart
          </p>
        </div>

        <button
          type="button"
          @click="clearCart"
          class="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <!-- Free Shipping Meter -->
      <div class="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-100 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-bold text-slate-900 gap-2 mb-2">
          <span v-if="freeShippingProgress >= 100" class="text-emerald-700 flex items-center gap-1.5">
            🎉 You have unlocked <strong>FREE EXPRESS SHIPPING</strong>!
          </span>
          <span v-else class="text-slate-800">
            Add <strong class="font-mono text-indigo-700">${{ formatPrice(amountForFreeShipping) }}</strong> more to unlock <strong>FREE SHIPPING</strong>
          </span>
          <span class="text-indigo-600 font-mono">{{ freeShippingProgress }}%</span>
        </div>

        <div class="w-full h-3 bg-indigo-200/60 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
            :style="{ width: `${freeShippingProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- Main Layout: Cart Items (8 cols) + Order Summary (4 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Cart Items List (8 cols) -->
        <div class="lg:col-span-8 space-y-4">
          <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs divide-y divide-slate-100">
            <div
              v-for="item in cart"
              :key="item.cartItemId || item.id"
              class="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
            >
              <!-- Thumbnail -->
              <img
                :src="item.image"
                :alt="item.name"
                class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-100 shrink-0 bg-slate-50"
              />

              <!-- Item details -->
              <div class="flex-1 min-w-0 w-full flex flex-col justify-between">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ item.brand }} · {{ item.category }}</span>
                    <h3
                      @click="navigate('product', { id: item.id })"
                      class="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {{ item.name }}
                    </h3>
                    <p v-if="item.variant" class="text-xs text-indigo-600 font-semibold mt-0.5">
                      Selected: {{ item.variant }}
                    </p>
                  </div>

                  <!-- Unit Price -->
                  <div class="text-right shrink-0">
                    <span class="text-sm sm:text-base font-bold text-slate-900 font-mono">
                      ${{ formatPrice(item.price * item.quantity) }}
                    </span>
                    <p class="text-[11px] text-slate-400 font-mono">
                      ${{ formatPrice(item.price) }} / unit
                    </p>
                  </div>
                </div>

                <!-- Quantity & Actions -->
                <div class="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 flex-wrap gap-3">
                  <QuantitySelector
                    :model-value="item.quantity"
                    :max="item.stock || 15"
                    size="sm"
                    @update:model-value="(qty) => updateCartQuantity(item.cartItemId || item.id, qty)"
                  />

                  <div class="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      @click="saveForLaterAction(item.cartItemId || item.id)"
                      class="font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      Save for later
                    </button>
                    <span class="text-slate-300">|</span>
                    <button
                      type="button"
                      @click="handleMoveToWishlist(item)"
                      class="font-semibold text-slate-500 hover:text-rose-600 cursor-pointer transition-colors"
                    >
                      Move to Wishlist
                    </button>
                    <span class="text-slate-300">|</span>
                    <button
                      type="button"
                      @click="removeFromCart(item.cartItemId || item.id)"
                      class="font-bold text-rose-600 hover:text-rose-800 cursor-pointer transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Saved For Later Section if any -->
          <div v-if="savedForLater.length > 0" class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Saved For Later ({{ savedForLater.length }})
            </h3>

            <div class="divide-y divide-slate-100">
              <div
                v-for="sItem in savedForLater"
                :key="sItem.cartItemId || sItem.id"
                class="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <img :src="sItem.image" :alt="sItem.name" class="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div class="truncate">
                    <h4 class="text-xs font-bold text-slate-900 truncate">{{ sItem.name }}</h4>
                    <span class="text-xs font-bold text-indigo-600 font-mono">${{ formatPrice(sItem.price) }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    @click="moveToCartFromSaved(sItem.cartItemId || sItem.id)"
                    class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Move to Cart
                  </button>
                  <button
                    type="button"
                    @click="removeSavedForLater(sItem.cartItemId || sItem.id)"
                    class="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary (4 cols) -->
        <div class="lg:col-span-4 space-y-6 sticky top-24">
          <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 class="text-lg font-black text-slate-900">Order Summary</h2>

            <!-- Coupon Input -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700">Promo / Gift Voucher</label>
              <CouponInput />
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 pt-4 border-t border-slate-100">
              <div class="flex justify-between">
                <span>Subtotal ({{ cart.length }} items)</span>
                <span class="font-bold text-slate-900 font-mono">${{ formatPrice(cartSubtotal) }}</span>
              </div>

              <div v-if="cartDiscount > 0" class="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({{ appliedCoupon?.code }})</span>
                <span class="font-mono">-${{ formatPrice(cartDiscount) }}</span>
              </div>

              <div class="flex justify-between">
                <span>Shipping</span>
                <span class="font-mono font-medium">
                  {{ cartShipping === 0 ? 'FREE' : `$${formatPrice(cartShipping)}` }}
                </span>
              </div>

              <div class="flex justify-between">
                <span>Estimated Sales Tax (5%)</span>
                <span class="font-mono font-medium">${{ formatPrice(cartTax) }}</span>
              </div>

              <div class="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span class="text-indigo-600 font-mono">${{ formatPrice(cartTotal) }}</span>
              </div>
            </div>

            <!-- Checkout CTA -->
            <div class="space-y-3">
              <button
                type="button"
                @click="navigate('checkout')"
                class="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <span>&rarr;</span>
              </button>

              <button
                type="button"
                @click="navigate('shop')"
                class="w-full py-2.5 text-center text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                &larr; Continue Shopping
              </button>
            </div>

            <!-- Security & Guarantee -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-500">
              <span class="flex items-center gap-1">🔒 256-bit SSL</span>
              <span class="flex items-center gap-1">🛡️ 2-Year Warranty</span>
              <span class="flex items-center gap-1">⚡ Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Cart State -->
    <EmptyState
      v-else
      icon="cart"
      title="Your shopping cart is empty"
      description="Looks like you haven't added any laptops, smartphones, or accessories to your cart yet."
      action-text="Discover Tech Products"
      :action-click="() => navigate('shop')"
    />
  </div>
</template>
