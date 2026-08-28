<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  hours: {
    type: Number,
    default: 24,
  },
  theme: {
    type: String,
    default: 'dark', // 'dark' | 'light' | 'simple'
  },
})

const timeLeft = ref(props.hours * 3600)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      timeLeft.value = props.hours * 3600
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const days = computed(() => Math.floor(timeLeft.value / (3600 * 24)))
const formattedHours = computed(() =>
  String(Math.floor((timeLeft.value % (3600 * 24)) / 3600)).padStart(2, '0')
)
const formattedMinutes = computed(() =>
  String(Math.floor((timeLeft.value % 3600) / 60)).padStart(2, '0')
)
const formattedSeconds = computed(() =>
  String(timeLeft.value % 60).padStart(2, '0')
)
</script>

<template>
  <div class="flex items-center gap-1.5 text-xs font-mono">
    <!-- Hours -->
    <div class="bg-gray-800 text-white px-2 py-1 rounded text-center min-w-[2.2rem]">
      <span class="font-bold block text-sm leading-tight">{{ formattedHours }}</span>
      <span class="text-[9px] text-gray-400 font-sans uppercase block">Hrs</span>
    </div>
    <span class="font-bold text-gray-400">:</span>

    <!-- Minutes -->
    <div class="bg-gray-800 text-white px-2 py-1 rounded text-center min-w-[2.2rem]">
      <span class="font-bold block text-sm leading-tight">{{ formattedMinutes }}</span>
      <span class="text-[9px] text-gray-400 font-sans uppercase block">Min</span>
    </div>
    <span class="font-bold text-gray-400">:</span>

    <!-- Seconds -->
    <div class="bg-gray-800 text-white px-2 py-1 rounded text-center min-w-[2.2rem]">
      <span class="font-bold block text-sm leading-tight">{{ formattedSeconds }}</span>
      <span class="text-[9px] text-gray-400 font-sans uppercase block">Sec</span>
    </div>
  </div>
</template>
