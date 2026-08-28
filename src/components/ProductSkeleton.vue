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
      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
      : 'flex flex-col gap-4'"
  >
    <div
      v-for="n in count"
      :key="n"
      class="bg-white border border-gray-200 rounded-lg p-4"
      :class="viewMode === 'list' ? 'flex flex-col sm:flex-row gap-4 items-center' : ''"
    >
      <!-- Image box -->
      <div
        class="bg-gray-100 rounded"
        :class="viewMode === 'list' ? 'w-full sm:w-36 h-36 shrink-0' : 'aspect-square w-full mb-3'"
      ></div>

      <!-- Info skeleton -->
      <div class="flex-1 w-full space-y-2">
        <div class="h-3 w-16 bg-gray-200 rounded"></div>
        <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
        <div class="h-3 w-1/2 bg-gray-100 rounded"></div>
        <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div class="h-4 w-20 bg-gray-200 rounded"></div>
          <div class="h-7 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>
