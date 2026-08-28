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
  avatar: currentUser.value?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
})

const sampleAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
]

const handleSave = () => {
  if (currentUser.value) {
    currentUser.value.name = form.value.name
    currentUser.value.email = form.value.email
    currentUser.value.phone = form.value.phone
    currentUser.value.avatar = form.value.avatar
  }
  showToast('Profile Updated! 👤', 'Your account profile information has been saved.', 'success')
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account Hub', page: 'account' },
  { label: 'Personal Profile' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Personal Profile</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Manage your contact details and profile representation</p>
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <!-- Avatar Section -->
      <div class="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
        <img :src="form.avatar" alt="Avatar" class="w-20 h-20 rounded-3xl object-cover border-2 border-indigo-600 shadow-md" />

        <div class="space-y-2 text-center sm:text-left">
          <span class="text-xs font-bold text-slate-900 block">Choose Profile Photo:</span>
          <div class="flex items-center justify-center sm:justify-start gap-2">
            <button
              v-for="(img, idx) in sampleAvatars"
              :key="idx"
              type="button"
              @click="form.avatar = img"
              class="w-10 h-10 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer"
              :class="form.avatar === img ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 opacity-60 hover:opacity-100'"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Form Fields -->
      <form @submit.prevent="handleSave" class="space-y-4 max-w-lg text-xs">
        <div>
          <label class="block font-bold text-slate-900 mb-1">Full Legal Name *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">Email Address *</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">Phone Number</label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
