<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 99,
  },
  size: {
    type: String,
    default: 'md', // 'sm' | 'md' | 'lg'
  },
})

const emit = defineEmits(['update:modelValue'])

const decrease = () => {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}

const increase = () => {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1)
  }
}
</script>

<template>
  <div
    class="inline-flex items-center border border-gray-300 rounded bg-white"
    :class="size === 'sm' ? 'h-7' : size === 'lg' ? 'h-10' : 'h-8'"
  >
    <button
      type="button"
      @click="decrease"
      :disabled="modelValue <= min"
      class="px-2.5 h-full text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent rounded-l cursor-pointer text-xs font-bold transition-colors"
      aria-label="Decrease quantity"
    >
      −
    </button>

    <span
      class="px-3 text-center font-mono font-semibold text-gray-900 text-xs select-none"
    >
      {{ modelValue }}
    </span>

    <button
      type="button"
      @click="increase"
      :disabled="modelValue >= max"
      class="px-2.5 h-full text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent rounded-r cursor-pointer text-xs font-bold transition-colors"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
</template>
