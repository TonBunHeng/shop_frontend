<script setup>
import { ref } from 'vue'
import { currentUser, showToast } from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const form = ref({
  name: currentUser.value?.name || '',
  email: currentUser.value?.email || '',
  phone: currentUser.value?.phone || '+1 (555) 234-5678',
  avatar: currentUser.value?.avatar || '/public/IMG_9021.jpeg',
})

const sampleAvatars = [
  '/public/IMG_9021.jpeg',
  '/public/IMG_9021.jpeg',
  '/public/IMG_9021.jpeg',
  '/public/IMG_9021.jpeg',
]

const handleSave = () => {
  if (currentUser.value) {
    currentUser.value.name = form.value.name
    currentUser.value.email = form.value.email
    currentUser.value.phone = form.value.phone
    currentUser.value.avatar = form.value.avatar
  }
  showToast('Profile Updated!', 'Your account profile information has been saved.', 'success')
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account', page: 'account' },
  { label: 'Personal Profile' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex items-center justify-between pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Personal Profile</h1>
        <p class="text-xs text-gray-500 mt-0.5">Manage your contact details and profile preferences</p>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <!-- Avatar Section -->
      <div class="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-gray-200">
        <img :src="form.avatar" alt="Avatar" class="w-16 h-16 rounded-full object-cover border border-gray-300" />

        <div class="space-y-1.5 text-center sm:text-left">
          <span class="text-xs font-semibold text-gray-700 block">Choose Profile Photo:</span>
          <div class="flex items-center justify-center sm:justify-start gap-2">
            <button
              v-for="(img, idx) in sampleAvatars"
              :key="idx"
              type="button"
              @click="form.avatar = img"
              class="w-8 h-8 rounded-full overflow-hidden border cursor-pointer transition-colors"
              :class="form.avatar === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 opacity-60 hover:opacity-100'"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Form Fields -->
      <form @submit.prevent="handleSave" class="space-y-4 max-w-lg text-xs">
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Full Legal Name *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">Email Address *</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">Phone Number</label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div class="pt-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
