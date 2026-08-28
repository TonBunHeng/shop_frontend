<script setup>
import { computed } from 'vue'

const props = defineProps({
  rating: {
    type: Number,
    default: 5.0,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  showCount: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: 'sm', // 'xs' | 'sm' | 'md' | 'lg'
  },
  interactive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:rating'])

const starSizes = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-3 h-3'
    case 'md':
      return 'w-5 h-5'
    case 'lg':
      return 'w-6 h-6'
    default:
      return 'w-4 h-4'
  }
})
</script>

<template>
  <div class="inline-flex items-center gap-1.5">
    <div class="flex items-center text-amber-400">
      <template v-for="star in 5" :key="star">
        <button
          v-if="interactive"
          type="button"
          @click="emit('update:rating', star)"
          class="focus:outline-hidden hover:scale-110 transition-transform cursor-pointer"
        >
          <svg
            :class="starSizes"
            :fill="star <= Math.round(rating) ? 'currentColor' : 'none'"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>

        <svg
          v-else
          :class="starSizes"
          :fill="star <= Math.floor(rating) ? 'currentColor' : (star - rating <= 0.5 ? 'url(#half-star)' : 'none')"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      </template>
    </div>

    <!-- Rating number & review count -->
    <div v-if="showCount" class="flex items-center gap-1 text-xs font-semibold text-slate-700">
      <span>{{ rating.toFixed(1) }}</span>
      <span v-if="reviewsCount > 0" class="text-slate-400 font-normal">({{ reviewsCount }})</span>
    </div>
  </div>
</template>
