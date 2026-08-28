<script setup>
import { ref } from 'vue'
import { categories, showToast } from '../data/store'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const email = ref('')

const handleSubscribe = () => {
  if (!email.value || !email.value.includes('@')) {
    showToast('Invalid Email', 'Please enter a valid email address.', 'error')
    return
  }
  showToast('Subscribed!', 'Thank you for joining our newsletter list.', 'success')
  email.value = ''
}
</script>

<template>
  <footer class="bg-gray-900 text-gray-400 text-xs mt-16 border-t border-gray-800">
    <!-- Top Value Props -->
    <div class="border-b border-gray-800 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded bg-gray-800 text-blue-400 flex items-center justify-center shrink-0">
            <AppIcon name="truck" size="md" />
          </div>
          <div>
            <h4 class="font-bold text-white text-sm">Free Express Shipping</h4>
            <p class="text-gray-400 text-[11px]">On orders over $100</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded bg-gray-800 text-emerald-400 flex items-center justify-center shrink-0">
            <AppIcon name="shield" size="md" />
          </div>
          <div>
            <h4 class="font-bold text-white text-sm">2-Year Tech Warranty</h4>
            <p class="text-gray-400 text-[11px]">Official brand guarantee</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded bg-gray-800 text-amber-400 flex items-center justify-center shrink-0">
            <AppIcon name="refresh" size="md" />
          </div>
          <div>
            <h4 class="font-bold text-white text-sm">30-Day Easy Return</h4>
            <p class="text-gray-400 text-[11px]">Money back guarantee</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded bg-gray-800 text-sky-400 flex items-center justify-center shrink-0">
            <AppIcon name="chat" size="md" />
          </div>
          <div>
            <h4 class="font-bold text-white text-sm">24/7 Tech Support</h4>
            <p class="text-gray-400 text-[11px]">Live support chat & phone</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      <!-- Brand & Newsletter (2 cols) -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center gap-2 text-xl font-bold text-white">
          <div class="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            TN
          </div>
          <span>Tech<span class="text-blue-500">Nova</span></span>
        </div>

        <p class="text-gray-400 leading-relaxed max-w-sm">
          Your destination for electronics, high-performance computing, audio gear, and workplace tech essentials.
        </p>

        <form @submit.prevent="handleSubscribe" class="flex gap-2 max-w-sm">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="flex-1 bg-gray-800 border border-gray-700 text-white text-xs rounded px-3 py-2 focus:outline-hidden focus:border-blue-500"
          />
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </div>

      <!-- Categories -->
      <div>
        <h4 class="font-bold text-white text-sm mb-3">Popular Categories</h4>
        <ul class="space-y-2">
          <li v-for="cat in categories.filter(c => c.id !== 'all').slice(0, 5)" :key="cat.id">
            <button
              type="button"
              @click="navigate('shop', { category: cat.id })"
              class="hover:text-white transition-colors cursor-pointer text-left"
            >
              {{ cat.name }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Customer Care -->
      <div>
        <h4 class="font-bold text-white text-sm mb-3">Customer Service</h4>
        <ul class="space-y-2">
          <li>
            <button type="button" @click="navigate('order-tracking')" class="hover:text-white cursor-pointer">
              Track Your Order
            </button>
          </li>
          <li>
            <button type="button" @click="navigate('account/orders')" class="hover:text-white cursor-pointer">
              Order History
            </button>
          </li>
          <li>
            <button type="button" @click="navigate('account/addresses')" class="hover:text-white cursor-pointer">
              Shipping & Delivery
            </button>
          </li>
          <li>
            <button type="button" @click="navigate('compare')" class="hover:text-white cursor-pointer">
              Product Comparison
            </button>
          </li>
        </ul>
      </div>

      <!-- Account & Policies -->
      <div>
        <h4 class="font-bold text-white text-sm mb-3">Account & Policies</h4>
        <ul class="space-y-2">
          <li>
            <button type="button" @click="navigate('account')" class="hover:text-white cursor-pointer">
              Account Hub
            </button>
          </li>
          <li>
            <button type="button" @click="navigate('wishlist')" class="hover:text-white cursor-pointer">
              Saved Wishlist
            </button>
          </li>
          <li>
            <button type="button" @click="navigate('deals')" class="hover:text-white cursor-pointer">
              Coupons & Promos
            </button>
          </li>
          <li>
            <button type="button" @click="navigate('account/security')" class="hover:text-white cursor-pointer">
              Privacy & Security
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500">
        <p>© 2026 TechNova Inc. All rights reserved.</p>

        <div class="flex items-center gap-4 text-xs">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>PayPal</span>
          <span>Apple Pay</span>
        </div>
      </div>
    </div>
  </footer>
</template>
