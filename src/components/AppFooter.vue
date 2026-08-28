<script setup>
import { ref } from 'vue'
import { categories, showToast } from '../data/store'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const email = ref('')
const isSubscribed = ref(false)

const handleSubscribe = () => {
  const cleanEmail = email.value.trim()
  if (!cleanEmail || !cleanEmail.includes('@')) {
    showToast('Invalid email', 'Please enter a valid email address.', 'error')
    return
  }
  isSubscribed.value = true
  showToast('Subscribed! 🎉', 'You have been subscribed to TechNova insider tech drops.', 'success')
  email.value = ''
}
</script>

<template>
  <footer class="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
    <!-- Value Propositions Banner -->
    <div class="border-b border-slate-800/80 py-10 bg-slate-950/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl shrink-0">
              🚀
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">Free Express Shipping</h4>
              <p class="text-[11px] text-slate-400 mt-0.5">On all domestic orders over $100</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl shrink-0">
              🛡️
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">2-Year Full Warranty</h4>
              <p class="text-[11px] text-slate-400 mt-0.5">100% genuine authorized products</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl shrink-0">
              🔄
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">30-Day Easy Returns</h4>
              <p class="text-[11px] text-slate-400 mt-0.5">Hassle-free money-back guarantee</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl shrink-0">
              💬
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">24/7 Expert Support</h4>
              <p class="text-[11px] text-slate-400 mt-0.5">Live technical consultation</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Columns -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        <!-- Brand & Newsletter (5 cols) -->
        <div class="md:col-span-5 space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-black text-sm">
              TN
            </div>
            <span class="text-xl font-black text-white tracking-tight">Tech<span class="text-indigo-400">Nova</span></span>
          </div>

          <p class="text-xs text-slate-400 max-w-sm leading-relaxed">
            TechNova is your premier destination for next-generation computing, smartphones, immersive audio, and premium workspace equipment.
          </p>

          <!-- Newsletter Form -->
          <div class="pt-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-white mb-2">Subscribe to Insider Drops & Deals</h4>
            
            <form v-if="!isSubscribed" @submit.prevent="handleSubscribe" class="flex gap-2 max-w-sm">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your work or personal email..."
                required
                class="flex-1 bg-slate-800/80 text-white placeholder:text-slate-500 text-xs rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                Join
              </button>
            </form>

            <div v-else class="flex items-center gap-2 text-emerald-400 font-semibold text-xs p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span>✓ You're subscribed to TechNova exclusive tech drops!</span>
            </div>
          </div>
        </div>

        <!-- Categories Links (2 cols) -->
        <div class="md:col-span-2 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-white">Categories</h4>
          <ul class="space-y-2">
            <li v-for="cat in categories.slice(1, 6)" :key="cat.id">
              <button
                type="button"
                @click="navigate('shop', { category: cat.id })"
                class="hover:text-white transition-colors cursor-pointer text-left"
              >
                {{ cat.name }}
              </button>
            </li>
            <li>
              <button
                type="button"
                @click="navigate('deals')"
                class="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
              >
                🔥 Flash Deals
              </button>
            </li>
          </ul>
        </div>

        <!-- Customer Support (2 cols) -->
        <div class="md:col-span-2 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-white">Customer Hub</h4>
          <ul class="space-y-2">
            <li>
              <button type="button" @click="navigate('order-tracking')" class="hover:text-white transition-colors cursor-pointer">
                Track Order
              </button>
            </li>
            <li>
              <button type="button" @click="navigate('account/orders')" class="hover:text-white transition-colors cursor-pointer">
                Order History
              </button>
            </li>
            <li>
              <button type="button" @click="navigate('account/addresses')" class="hover:text-white transition-colors cursor-pointer">
                Shipping Addresses
              </button>
            </li>
            <li>
              <button type="button" @click="navigate('wishlist')" class="hover:text-white transition-colors cursor-pointer">
                Saved Wishlist
              </button>
            </li>
            <li>
              <button type="button" @click="navigate('compare')" class="hover:text-white transition-colors cursor-pointer">
                Compare Products
              </button>
            </li>
          </ul>
        </div>

        <!-- Security & Payment (3 cols) -->
        <div class="md:col-span-3 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-white">Secure Payments</h4>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            All transactions are processed through 256-bit encrypted secure channels.
          </p>

          <!-- Mock Payment Badges -->
          <div class="flex flex-wrap gap-2 pt-1">
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-[10px] border border-slate-700">
              VISA
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-[10px] border border-slate-700">
              Mastercard
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-[10px] border border-slate-700">
              Apple Pay
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-[10px] border border-slate-700">
              PayPal
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-[10px] border border-slate-700">
              Google Pay
            </span>
          </div>

          <div class="pt-2 text-[11px] text-slate-500">
            <p>Support: <span class="text-slate-300 font-semibold">support@technova.com</span></p>
            <p>Hotline: <span class="text-slate-300 font-semibold">+1 (800) 832-4668</span></p>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>&copy; 2026 TechNova Electronics Inc. All rights reserved.</p>

        <div class="flex items-center gap-4">
          <a href="#" @click.prevent class="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" @click.prevent class="hover:text-slate-400 transition-colors">Terms of Service</a>
          <a href="#" @click.prevent class="hover:text-slate-400 transition-colors">Warranty Policy</a>
          <a href="#" @click.prevent class="hover:text-slate-400 transition-colors">Security</a>
        </div>
      </div>
    </div>
  </footer>
</template>
