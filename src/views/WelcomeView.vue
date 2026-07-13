<script setup>
import { ref } from 'vue'
import { addToCart, cartCount, favorites, features, products, stats, toggleFavorite, year } from '../data/store'
import AppHeader from '../components/AppHeader.vue'

const showCartNotice = ref(false)
let cartNoticeTimeout

const handleAddToCart = (item) => {
  addToCart(item)
  showCartNotice.value = true
  clearTimeout(cartNoticeTimeout)
  cartNoticeTimeout = setTimeout(() => {
    showCartNotice.value = false
  }, 1400)
}

defineProps({
  mobileNavOpen: {
    type: Boolean,
    required: true,
  },
  navigate: {
    type: Function,
    required: true,
  },  
  toggleMobileNav: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <nav class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-900 bg-gray-950 px-4 py-3 sm:flex-nowrap sm:px-6 lg:px-10">
  <AppHeader />

    <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 text-gray-300 transition-colors hover:border-gray-500 hover:text-white sm:hidden"
            aria-controls="mobile-nav-actions"
            :aria-expanded="mobileNavOpen"
            aria-label="Open navigation menu"
            @click="toggleMobileNav">
      <svg v-if="!mobileNavOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>
      </svg>
      <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M6 6l12 12"/><path d="M18 6L6 18"/>
      </svg>
    </button>

    <div id="mobile-nav-actions"
         class="flex w-full origin-top flex-col gap-2 overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out motion-reduce:transition-none sm:max-h-none sm:w-auto sm:translate-y-0 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:overflow-visible sm:opacity-100"
         :class="mobileNavOpen ? 'max-h-48 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'">
      <a href="/cart" class="relative inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white sm:px-5" @click.prevent="navigate('cart')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386a.75.75 0 0 1 .737.607l.383 1.916m0 0L6.75 15.75h10.5l2.25-8.25H5.756Zm0 0L5.25 5.25M9 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm10.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
        <span>Cart</span>
        <span v-if="cartCount" class="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1.5 text-xs font-extrabold text-white">{{ cartCount }}</span>
        <span v-if="showCartNotice" class="absolute -bottom-9 right-0 z-10 whitespace-nowrap rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-950/40">Added to cart</span>
      </a>
      <a href="/register" class="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white sm:px-5" @click.prevent="navigate('register')">Register</a>
      <a href="/login" class="inline-flex min-h-10 items-center justify-center rounded-lg bg-cyan-500 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-cyan-600 active:bg-cyan-700 sm:px-5" @click.prevent="navigate('login')">Log in</a>
    </div>
  </nav>

  <section class="flex flex-col items-center px-4 pb-12 pt-14 text-center sm:px-6 sm:pb-16 sm:pt-20">
    <div class="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4 py-1.5 sm:mb-8">
      <span class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
      <span class="truncate text-xs font-medium text-gray-400">Latest gadgets available now</span>
    </div>
    <h1 class="mb-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
      Discover Modern <span class="text-cyan-400">Technology</span><br class="hidden sm:block">
      For Your Digital Life
    </h1>
    <p class="mb-8 max-w-xl text-sm leading-relaxed text-gray-500 sm:mb-10 sm:text-base">
      Explore premium laptops, smartphones, smart watches, and modern gadgets with powerful performance and sleek design.
    </p>
    <div class="mb-12 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mb-16 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
      <a href="#products" class="rounded-xl bg-cyan-500 px-7 py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-cyan-600 active:bg-cyan-700" @click.prevent="navigate('home', '#products')">Shop now</a>
      <a href="#products" class="flex items-center justify-center gap-2 rounded-xl border border-gray-800 px-6 py-3.5 text-sm font-semibold text-gray-400 transition-colors hover:border-gray-700 hover:text-gray-200" @click.prevent="navigate('home', '#products')">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        Explore products
      </a>
    </div>
  </section>

  <div class="grid grid-cols-2 border-t border-b border-gray-900 sm:flex sm:justify-center">
    <div v-for="stat in stats" :key="stat[1]" class="border-b border-r border-gray-900 py-4 text-center even:border-r-0 [&:nth-child(n+3)]:border-b-0 sm:max-w-[160px] sm:flex-1 sm:border-b-0 sm:py-5 sm:even:border-r sm:last:border-r-0">
      <div class="text-white text-2xl font-extrabold tracking-tight">{{ stat[0] }}</div>
      <div class="text-gray-600 text-xs mt-1">{{ stat[1] }}</div>
    </div>
  </div>

  <section id="products" class="px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
    <p class="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1.5">Trending now</p>
    <h2 class="text-white text-2xl font-extrabold tracking-tight mb-7">Latest Technology</h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="item in products" :key="item[1]" class="translate-y-0 cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-4 opacity-100 transition-[opacity,transform,border-color] duration-500 ease-out hover:border-cyan-500 motion-reduce:transition-none sm:p-5">
        <div class="mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-800 sm:h-40 sm:aspect-auto">
          <img :src="item[0]" :alt="item[1]" loading="lazy" class="h-full w-full object-cover transition-transform duration-300 hover:scale-105">
        </div>
        <div class="text-slate-100 text-sm font-bold mb-1">{{ item[1] }}</div>
        <div class="text-slate-500 text-xs leading-relaxed mb-4">{{ item[2] }}</div>
        <div class="flex items-center justify-between">
          <span class="text-cyan-400 text-sm font-extrabold">{{ item[3] }}</span>
          <div class="flex items-center gap-2">
            <button type="button"
                    :aria-label="`Add ${item[1]} to favorites`"
                    class="w-8 h-8 border border-slate-700 hover:border-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors"
                    :class="{ 'border-rose-400 bg-rose-500/10 text-rose-400': favorites.has(item[1]) }"
                    @click="toggleFavorite(item[1])">
              <svg class="w-4 h-4 fill-none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
              </svg>
            </button>
            <button type="button"
                    class="w-8 h-8 bg-cyan-500 hover:bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-base transition-colors"
                    :aria-label="`Add ${item[1]} to cart`"
                    @click="handleAddToCart(item)">+</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="px-4 pb-12 sm:px-6 sm:pb-14 lg:px-10">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
      <div v-for="feature in features" :key="feature[1]" class="translate-y-0 rounded-2xl border border-slate-800 bg-slate-900 p-5 opacity-100 transition-[opacity,transform,border-color] duration-500 ease-out motion-reduce:transition-none sm:p-6">
        <div class="w-11 h-11 mb-4 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
          <svg v-if="feature[0] === 'bolt'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>
          </svg>
          <svg v-else-if="feature[0] === 'lock'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
          </svg>
          <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
          </svg>
        </div>
        <h3 class="text-white text-lg font-bold mb-2">{{ feature[1] }}</h3>
        <p class="text-slate-500 text-sm leading-relaxed">{{ feature[2] }}</p>
      </div>
    </div>
  </section>

  <div class="mx-4 mb-12 flex flex-col items-stretch justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-6 sm:mx-6 sm:mb-14 sm:flex-row sm:items-center sm:px-8 sm:py-8 lg:mx-10">
    <div>
      <h3 class="text-white text-xl font-extrabold tracking-tight mb-1">Upgrade your setup today</h3>
      <p class="text-slate-500 text-sm">Join thousands of customers buying premium technology products online.</p>
    </div>
    <a href="#products" class="whitespace-nowrap rounded-xl bg-cyan-500 px-7 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-cyan-600 active:bg-cyan-700" @click.prevent="navigate('home', '#products')">Start shopping</a>
  </div>

  <footer class="flex flex-col items-center justify-between gap-4 border-t border-gray-900 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-10">
    <span class="text-gray-700 text-xs">© {{ year }} TechNova. All rights reserved.</span>
    <div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
      <a href="#" class="text-gray-700 hover:text-gray-400 text-xs transition-colors">Privacy</a>
      <a href="#" class="text-gray-700 hover:text-gray-400 text-xs transition-colors">Terms</a>
      <a href="#" class="text-gray-700 hover:text-gray-400 text-xs transition-colors">Contact</a>
    </div>
  </footer>
</template>
