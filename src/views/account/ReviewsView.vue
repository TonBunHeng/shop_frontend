<script setup>
import { computed } from 'vue'
import { allProducts, formatPrice } from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import ProductRating from '../../components/ProductRating.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

// Collect all user reviews across products for the logged in user demo
const myReviews = computed(() => {
  const list = []
  allProducts.forEach((p) => {
    if (p.reviews) {
      p.reviews.forEach((r) => {
        list.push({
          ...r,
          product: p,
        })
      })
    }
  })
  return list
})

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account Hub', page: 'account' },
  { label: 'My Reviews' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Product Reviews</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Ratings and feedback submitted on TechNova</p>
      </div>
    </div>

    <div v-if="myReviews.length > 0" class="space-y-4">
      <div
        v-for="rev in myReviews"
        :key="rev.id"
        class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3"
      >
        <div class="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div
            @click="navigate('product', { id: rev.product.id })"
            class="flex items-center gap-3 cursor-pointer group"
          >
            <img :src="rev.product.image" :alt="rev.product.name" class="w-12 h-12 rounded-xl object-cover" />
            <div>
              <h3 class="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{{ rev.product.name }}</h3>
              <p class="text-xs text-indigo-600 font-mono">${{ formatPrice(rev.product.price) }}</p>
            </div>
          </div>

          <span class="text-xs text-slate-400 font-mono">{{ rev.date }}</span>
        </div>

        <div class="flex items-center gap-2">
          <ProductRating :rating="rev.rating" :show-count="false" size="xs" />
          <h4 class="text-sm font-bold text-slate-900">{{ rev.title }}</h4>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed">{{ rev.comment }}</p>

        <div class="pt-2 flex items-center gap-2 text-xs text-slate-400">
          <span>👍 {{ rev.helpful || 0 }} people found this helpful</span>
        </div>
      </div>
    </div>

    <div v-else class="py-12 text-center text-slate-500 bg-white rounded-3xl p-8 border border-slate-200">
      You haven't written any product reviews yet.
    </div>
  </div>
</template>
