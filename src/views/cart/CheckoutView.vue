<script setup>
import { cartItems, discount, formatPrice, shipping, subtotal, total } from '../../data/store'
import AppHeader from '../../components/AppHeader.vue'

defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <nav class="flex items-center justify-between border-b border-gray-900 px-4 py-3 sm:px-6 lg:px-10">

    <AppHeader />

    <a href="/cart" class="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-800 px-4 text-sm font-semibold text-gray-300 transition-colors hover:border-cyan-500 hover:text-white" @click.prevent="navigate('cart')">
      Back to cart
    </a>
  </nav>

  <main class="px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8">
        <p class="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-400">Secure checkout</p>
        <h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Complete your order</h1>
      </div>

      <form class="grid gap-6 lg:grid-cols-[1fr_360px]" @submit.prevent>
        <section class="space-y-5">
          <div class="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 class="mb-5 text-lg font-bold text-white">Contact information</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block"><span class="mb-2 block text-xs font-semibold text-slate-400">First name</span><input type="text" class="w-full rounded-lg border border-slate-700 bg-gray-950 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-500"></label>
              <label class="block"><span class="mb-2 block text-xs font-semibold text-slate-400">Last name</span><input type="text" class="w-full rounded-lg border border-slate-700 bg-gray-950 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-500"></label>
              <label class="block sm:col-span-2"><span class="mb-2 block text-xs font-semibold text-slate-400">Email address</span><input type="email" class="w-full rounded-lg border border-slate-700 bg-gray-950 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-500"></label>
            </div>
          </div>
          <div class="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 class="mb-5 text-lg font-bold text-white">Delivery address</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block sm:col-span-2"><span class="mb-2 block text-xs font-semibold text-slate-400">Street address</span><input type="text" class="w-full rounded-lg border border-slate-700 bg-gray-950 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-500"></label>
              <label class="block"><span class="mb-2 block text-xs font-semibold text-slate-400">City</span><input type="text" class="w-full rounded-lg border border-slate-700 bg-gray-950 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-500"></label>
              <label class="block"><span class="mb-2 block text-xs font-semibold text-slate-400">Phone number</span><input type="tel" class="w-full rounded-lg border border-slate-700 bg-gray-950 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-500"></label>
            </div>
          </div>
          <div class="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 class="mb-5 text-lg font-bold text-white">Payment method</h2>
            <div class="grid gap-3 sm:grid-cols-3">
              <label v-for="(method, index) in ['Card', 'ABA Pay', 'Cash']" :key="method" class="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-gray-950 p-4 transition-colors has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-500/10">
                <input type="radio" name="payment_method" class="h-4 w-4 accent-cyan-500" :checked="index === 0">
                <span class="text-sm font-bold text-white">{{ method }}</span>
              </label>
            </div>
          </div>
        </section>

        <aside class="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 class="mb-5 text-lg font-bold text-white">Order summary</h2>
          <div class="space-y-4">
            <div v-for="item in cartItems" :key="item.name" class="flex items-start justify-between gap-4 text-sm">
              <div><p class="font-bold text-white">{{ item.name }}</p><p class="mt-1 text-xs text-slate-500">Qty {{ item.quantity }}</p></div>
              <span class="font-bold text-slate-300">${{ formatPrice(item.quantity * item.price) }}</span>
            </div>
          </div>
          <div class="my-5 space-y-3 border-y border-slate-800 py-5 text-sm">
            <div class="flex justify-between text-slate-400"><span>Subtotal</span><span>${{ formatPrice(subtotal) }}</span></div>
            <div class="flex justify-between text-slate-400"><span>Shipping</span><span>${{ formatPrice(shipping) }}</span></div>
            <div class="flex justify-between text-emerald-400"><span>Discount</span><span>-${{ formatPrice(discount) }}</span></div>
          </div>
          <div class="mb-5 flex items-center justify-between"><span class="font-bold text-white">Total</span><span class="text-2xl font-extrabold text-cyan-400">${{ formatPrice(total) }}</span></div>
          <button type="submit" class="flex min-h-12 w-full items-center justify-center rounded-xl bg-cyan-500 px-5 text-sm font-extrabold text-white transition-colors hover:bg-cyan-600 active:bg-cyan-700">Place order</button>
          <p class="mt-4 text-center text-xs leading-relaxed text-slate-500">Your payment details are protected with secure checkout encryption.</p>
        </aside>
      </form>
    </div>
  </main>
</template>
