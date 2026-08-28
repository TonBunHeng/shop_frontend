<script setup>
import { computed } from 'vue'
import { allProducts, formatPrice } from '../../data/store'
import AppIcon from '../../components/AppIcon.vue'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import ProductRating from '../../components/ProductRating.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

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
  { label: 'Account', page: 'account' },
  { label: 'My Reviews' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex items-center justify-between pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">My Product Reviews</h1>
        <p class="text-xs text-gray-500 mt-0.5">Ratings and feedback submitted on TechNova</p>
      </div>
    </div>

    <div v-if="myReviews.length > 0" class="space-y-4">
      <div
        v-for="rev in myReviews"
        :key="rev.id"
        class="bg-white rounded-lg border border-gray-200 p-5 space-y-2.5 text-xs"
      >
        <div class="flex items-center justify-between gap-4 pb-2.5 border-b border-gray-100">
          <div
            @click="navigate('product', { id: rev.product.id })"
            class="flex items-center gap-3 cursor-pointer group"
          >
            <img :src="rev.product.image" :alt="rev.product.name" class="w-10 h-10 rounded object-cover border border-gray-200" />
            <div>
              <h3 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ rev.product.name }}</h3>
              <p class="text-blue-600 font-mono">${{ formatPrice(rev.product.price) }}</p>
            </div>
          </div>

          <span class="text-gray-400 font-mono text-[11px]">{{ rev.date }}</span>
        </div>

        <div class="flex items-center gap-2">
          <ProductRating :rating="rev.rating" :show-count="false" size="xs" />
          <h4 class="font-bold text-gray-900">{{ rev.title }}</h4>
        </div>

        <p class="text-gray-600 leading-relaxed">{{ rev.comment }}</p>

        <div class="pt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
          <AppIcon name="thumb-up" size="xs" />
          <span>{{ rev.helpful || 0 }} people found this helpful</span>
        </div>
      </div>
    </div>

    <div v-else class="py-12 text-center text-gray-500 bg-white rounded-lg p-8 border border-gray-200 text-xs">
      You haven't written any product reviews yet.
    </div>
  </div>
</template>
