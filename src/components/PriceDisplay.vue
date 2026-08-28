<script setup>
import { computed } from 'vue'
import { formatPrice } from '../data/store'

const props = defineProps({
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    default: null,
  },
  size: {
    type: String,
    default: 'md', // 'sm' | 'md' | 'lg' | 'xl'
  },
})

const discountPercent = computed(() => {
  if (!props.originalPrice || props.originalPrice <= props.price) return 0
  return Math.round(((props.originalPrice - props.price) / props.originalPrice) * 100)
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return { price: 'text-sm font-bold', original: 'text-xs', badge: 'text-[10px] px-1 py-0.2' }
    case 'lg':
      return { price: 'text-2xl font-extrabold', original: 'text-sm', badge: 'text-xs px-2 py-0.5' }
    case 'xl':
      return { price: 'text-3xl sm:text-4xl font-extrabold', original: 'text-base', badge: 'text-xs px-2.5 py-1' }
    default:
      return { price: 'text-lg font-bold', original: 'text-xs', badge: 'text-[11px] px-1.5 py-0.5' }
  }
})
</script>

<template>
  <div class="flex items-baseline gap-2 flex-wrap">
    <span :class="['text-slate-900 tracking-tight', sizeClasses.price]">
      ${{ formatPrice(price) }}
    </span>
    
    <span
      v-if="originalPrice && originalPrice > price"
      :class="['text-slate-400 line-through font-normal', sizeClasses.original]"
    >
      ${{ formatPrice(originalPrice) }}
    </span>

    <span
      v-if="discountPercent > 0"
      :class="['rounded-full font-bold bg-emerald-100 text-emerald-700 tracking-wide', sizeClasses.badge]"
    >
      -{{ discountPercent }}%
    </span>
  </div>
</template>
