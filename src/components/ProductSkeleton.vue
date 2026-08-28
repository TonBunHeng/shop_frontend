<script setup>
defineProps({
  viewMode: {
    type: String,
    default: 'grid', // 'grid' | 'list'
  },
  count: {
    type: Number,
    default: 4,
  },
})
</script>

<template>
  <div
    :class="viewMode === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
      : 'flex flex-col gap-4'"
  >
    <div
      v-for="n in count"
      :key="n"
      class="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs overflow-hidden"
      :class="viewMode === 'list' ? 'flex flex-col sm:flex-row gap-5 items-center' : ''"
    >
      <!-- Image box -->
      <div
        class="animate-shimmer bg-slate-100 rounded-xl"
        :class="viewMode === 'list' ? 'w-full sm:w-48 h-44 shrink-0' : 'aspect-4/3 w-full mb-4'"
      ></div>

      <!-- Info skeleton -->
      <div class="flex-1 w-full space-y-3">
        <div class="flex items-center justify-between">
          <div class="h-3 w-16 bg-slate-200 animate-shimmer rounded-full"></div>
          <div class="h-3 w-12 bg-slate-200 animate-shimmer rounded-full"></div>
        </div>

        <div class="h-4 w-3/4 bg-slate-200 animate-shimmer rounded-md"></div>
        <div class="h-3 w-full bg-slate-100 animate-shimmer rounded-md"></div>
        <div class="h-3 w-2/3 bg-slate-100 animate-shimmer rounded-md"></div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div class="h-5 w-24 bg-slate-200 animate-shimmer rounded-md"></div>
          <div class="h-8 w-20 bg-slate-200 animate-shimmer rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
</template>
