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
    default: 'md', // 'sm' | 'md'
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const decrement = () => {
  if (props.modelValue > props.min) {
    const val = props.modelValue - 1
    emit('update:modelValue', val)
    emit('change', val)
  }
}

const increment = () => {
  if (props.modelValue < props.max) {
    const val = props.modelValue + 1
    emit('update:modelValue', val)
    emit('change', val)
  }
}

const handleInput = (e) => {
  let val = parseInt(e.target.value, 10)
  if (isNaN(val)) val = props.min
  if (val < props.min) val = props.min
  if (val > props.max) val = props.max
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<template>
  <div
    class="inline-flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs"
    :class="size === 'sm' ? 'h-7' : 'h-10'"
  >
    <button
      type="button"
      @click="decrement"
      :disabled="modelValue <= min"
      class="h-full px-2.5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      aria-label="Decrease quantity"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
      </svg>
    </button>

    <input
      type="number"
      :value="modelValue"
      @input="handleInput"
      :min="min"
      :max="max"
      class="w-10 text-center font-bold text-slate-900 bg-transparent border-none text-xs sm:text-sm focus:outline-hidden p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      aria-label="Quantity"
    />

    <button
      type="button"
      @click="increment"
      :disabled="modelValue >= max"
      class="h-full px-2.5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      aria-label="Increase quantity"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>
