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


    <a href="/#products" class="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-800 px-4 text-sm font-semibold text-gray-300 transition-colors hover:border-cyan-500 hover:text-white" @click.prevent="navigate('home', '#products')">
      Continue shopping
    </a>
  </nav>

  <main class="px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-400">Your cart</p>
          <h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Review your technology</h1>
        </div>
        <p class="text-sm text-slate-500">{{ cartItems.length }} items ready for checkout</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section class="space-y-4">
          <article v-for="item in cartItems" :key="item.name" class="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
            <div class="aspect-square overflow-hidden rounded-xl bg-slate-800"><img :src="item.image" :alt="item.name" class="h-full w-full object-cover"></div>
            <div>
              <h2 class="text-base font-bold text-white">{{ item.name }}</h2>
              <p class="mt-1 text-sm leading-relaxed text-slate-500">{{ item.detail }}</p>
              <button type="button" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-rose-400 transition-colors hover:text-rose-300">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/></svg>
                Remove
              </button>
            </div>
            <div class="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
              <div class="flex h-10 items-center overflow-hidden rounded-lg border border-slate-700">
                <button type="button" class="flex h-10 w-10 items-center justify-center text-slate-400 transition-colors hover:bg-slate-800 hover:text-white" aria-label="Decrease quantity" @click="item.quantity = Math.max(1, item.quantity - 1)">-</button>
                <span class="flex h-10 w-10 items-center justify-center border-x border-slate-700 text-sm font-bold text-white">{{ item.quantity }}</span>
                <button type="button" class="flex h-10 w-10 items-center justify-center text-slate-400 transition-colors hover:bg-slate-800 hover:text-white" aria-label="Increase quantity" @click="item.quantity++">+</button>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-500">${{ formatPrice(item.price) }} each</p>
                <p class="text-lg font-extrabold text-cyan-400">${{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
          </article>
        </section>

        <aside class="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 class="mb-5 text-lg font-bold text-white">Order summary</h2>
          <div class="mb-5 flex gap-2">
            <input type="text" value="TECH40" aria-label="Promo code" class="min-w-0 flex-1 rounded-lg border border-slate-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-cyan-500">
            <button type="button" class="rounded-lg bg-slate-800 px-4 text-sm font-bold text-white transition-colors hover:bg-slate-700">Apply</button>
          </div>
          <div class="space-y-3 border-y border-slate-800 py-5 text-sm">
            <div class="flex justify-between text-slate-400"><span>Subtotal</span><span>${{ formatPrice(subtotal) }}</span></div>
            <div class="flex justify-between text-slate-400"><span>Shipping</span><span>${{ formatPrice(shipping) }}</span></div>
            <div class="flex justify-between text-emerald-400"><span>Discount</span><span>-${{ formatPrice(discount) }}</span></div>
          </div>
          <div class="my-5 flex items-center justify-between"><span class="text-base font-bold text-white">Total</span><span class="text-2xl font-extrabold text-cyan-400">${{ formatPrice(total) }}</span></div>
          <a href="/checkout" class="flex min-h-12 w-full items-center justify-center rounded-xl bg-cyan-500 px-5 text-sm font-extrabold text-white transition-colors hover:bg-cyan-600 active:bg-cyan-700" @click.prevent="navigate('checkout')">Checkout</a>
          <div class="mt-5 grid gap-3 text-xs text-slate-500">
            <p class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-emerald-400"></span>Secure payment and encrypted checkout</p>
            <p class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-cyan-400"></span>Free returns within 14 days</p>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>
