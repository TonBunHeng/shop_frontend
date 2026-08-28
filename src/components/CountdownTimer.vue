<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  targetHours: {
    type: Number,
    default: 14,
  },
  theme: {
    type: String,
    default: 'dark', // 'dark' | 'light' | 'primary'
  },
})

// Initialize timer targeting X hours from now (persists per session or counts down smoothly)
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  expired: false,
})

let timer = null

const calculateTime = () => {
  // Let's create a stable target end of day or X hours from now
  const now = new Date()
  const endOfDay = new Date()
  endOfDay.setHours(now.getHours() + props.targetHours, 45, 30, 0)
  
  const diff = endOfDay - now

  if (diff <= 0) {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  timeLeft.value = {
    days,
    hours,
    minutes,
    seconds,
    expired: false,
  }
}

onMounted(() => {
  calculateTime()
  timer = setInterval(() => {
    if (timeLeft.value.seconds > 0) {
      timeLeft.value.seconds--
    } else if (timeLeft.value.minutes > 0) {
      timeLeft.value.minutes--
      timeLeft.value.seconds = 59
    } else if (timeLeft.value.hours > 0) {
      timeLeft.value.hours--
      timeLeft.value.minutes = 59
      timeLeft.value.seconds = 59
    } else if (timeLeft.value.days > 0) {
      timeLeft.value.days--
      timeLeft.value.hours = 23
      timeLeft.value.minutes = 59
      timeLeft.value.seconds = 59
    } else {
      timeLeft.value.expired = true
      clearInterval(timer)
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const pad = (n) => String(n).padStart(2, '0')
</script>

<template>
  <div v-if="!timeLeft.expired" class="inline-flex items-center gap-1.5 sm:gap-2">
    <!-- Days -->
    <div
      v-if="timeLeft.days > 0"
      class="flex flex-col items-center justify-center rounded-lg px-2 py-1 min-w-[38px] sm:min-w-[46px]"
      :class="theme === 'light' ? 'bg-white text-slate-900 border border-slate-200' : theme === 'primary' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-900 text-white'"
    >
      <span class="text-xs sm:text-base font-extrabold font-mono leading-none">{{ pad(timeLeft.days) }}</span>
      <span class="text-[9px] uppercase tracking-wider font-semibold opacity-70 mt-0.5">Days</span>
    </div>
    <span v-if="timeLeft.days > 0" class="font-extrabold opacity-60">:</span>

    <!-- Hours -->
    <div
      class="flex flex-col items-center justify-center rounded-lg px-2 py-1 min-w-[38px] sm:min-w-[46px]"
      :class="theme === 'light' ? 'bg-white text-slate-900 border border-slate-200' : theme === 'primary' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-900 text-white'"
    >
      <span class="text-xs sm:text-base font-extrabold font-mono leading-none">{{ pad(timeLeft.hours) }}</span>
      <span class="text-[9px] uppercase tracking-wider font-semibold opacity-70 mt-0.5">Hours</span>
    </div>
    <span class="font-extrabold opacity-60">:</span>

    <!-- Minutes -->
    <div
      class="flex flex-col items-center justify-center rounded-lg px-2 py-1 min-w-[38px] sm:min-w-[46px]"
      :class="theme === 'light' ? 'bg-white text-slate-900 border border-slate-200' : theme === 'primary' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-900 text-white'"
    >
      <span class="text-xs sm:text-base font-extrabold font-mono leading-none">{{ pad(timeLeft.minutes) }}</span>
      <span class="text-[9px] uppercase tracking-wider font-semibold opacity-70 mt-0.5">Mins</span>
    </div>
    <span class="font-extrabold opacity-60">:</span>

    <!-- Seconds -->
    <div
      class="flex flex-col items-center justify-center rounded-lg px-2 py-1 min-w-[38px] sm:min-w-[46px]"
      :class="theme === 'light' ? 'bg-white text-slate-900 border border-slate-200' : theme === 'primary' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-900 text-white'"
    >
      <span class="text-xs sm:text-base font-extrabold font-mono leading-none text-rose-400">{{ pad(timeLeft.seconds) }}</span>
      <span class="text-[9px] uppercase tracking-wider font-semibold opacity-70 mt-0.5">Secs</span>
    </div>
  </div>

  <div v-else class="inline-flex items-center px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold">
    Sale Ended
  </div>
</template>
