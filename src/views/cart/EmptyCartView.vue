<script setup>
import AppHeader from '../../components/AppHeader.vue'
defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const cards = [
  ['Laptop deals', 'Performance machines for gaming, work, and study.'],
  ['Mobile gear', 'Flagship phones, watches, audio, and daily carry tech.'],
  ['Fast delivery', 'Tracked shipping and careful packaging for every order.'],
]
</script>

<template>
  <main class="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
    <section class="w-full max-w-4xl">
      <div class="mb-8 text-center">
        
        <AppHeader />

        <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-cyan-400">
          <svg class="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.25 3h1.4c.36 0 .67.25.73.61L6.75 15.75h10.5l2.25-8.25H5.76"/><circle cx="8" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
        </div>
        <p class="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-400">Cart is empty</p>
        <h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Your next upgrade starts here</h1>
        <p class="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">Add laptops, phones, accessories, and smart devices to your cart. Your selected technology will appear here before checkout.</p>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/#products" class="inline-flex min-h-12 items-center justify-center rounded-xl bg-cyan-500 px-7 text-sm font-extrabold text-white transition-colors hover:bg-cyan-600 active:bg-cyan-700" @click.prevent="navigate('home', '#products')">Browse products</a>
          <a href="/login" class="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-800 px-7 text-sm font-bold text-slate-300 transition-colors hover:border-cyan-500 hover:text-white" @click.prevent="navigate('login')">Sign in</a>
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <article v-for="item in cards" :key="item[0]" class="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 class="mb-2 text-sm font-bold text-white">{{ item[0] }}</h2>
          <p class="text-sm leading-relaxed text-slate-500">{{ item[1] }}</p>
        </article>
      </div>
    </section>
  </main>
</template>
