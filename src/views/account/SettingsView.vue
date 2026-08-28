<script setup>
import { ref } from 'vue'
import { showToast } from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const currency = ref('USD')
const language = ref('en')
const emailPromos = ref(true)
const priceDropAlerts = ref(true)
const orderStatusSMS = ref(true)

const saveSettings = () => {
  showToast('Preferences Saved! ⚙️', 'Your store preferences have been updated.', 'success')
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account Hub', page: 'account' },
  { label: 'Settings & Preferences' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Account Preferences</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Customize localization, currency, and communication channels</p>
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
      <!-- Localization -->
      <div class="space-y-4">
        <h3 class="text-base font-bold text-slate-900">Regional & Localization</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-slate-900 mb-1">Preferred Currency</label>
            <select
              v-model="currency"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="CAD">CAD ($) - Canadian Dollar</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-900 mb-1">Display Language</label>
            <select
              v-model="language"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              <option value="en">English (United States)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notifications Preferences -->
      <div class="space-y-4 pt-6 border-t border-slate-100">
        <h3 class="text-base font-bold text-slate-900">Communications & Marketing</h3>

        <div class="space-y-3">
          <label class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
            <div>
              <p class="font-bold text-slate-900">Flash Sale & Promotional Emails</p>
              <p class="text-[11px] text-slate-500">Receive special discount vouchers and tech launch announcements</p>
            </div>
            <input v-model="emailPromos" type="checkbox" class="w-4 h-4 rounded-sm text-indigo-600 accent-indigo-600 cursor-pointer" />
          </label>

          <label class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
            <div>
              <p class="font-bold text-slate-900">Price Drop Notifications</p>
              <p class="text-[11px] text-slate-500">Instant alerts when items on your wishlist or subscribed devices go on discount</p>
            </div>
            <input v-model="priceDropAlerts" type="checkbox" class="w-4 h-4 rounded-sm text-indigo-600 accent-indigo-600 cursor-pointer" />
          </label>

          <label class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
            <div>
              <p class="font-bold text-slate-900">Order Tracking SMS Alerts</p>
              <p class="text-[11px] text-slate-500">Receive live SMS updates on dispatch and out-for-delivery events</p>
            </div>
            <input v-model="orderStatusSMS" type="checkbox" class="w-4 h-4 rounded-sm text-indigo-600 accent-indigo-600 cursor-pointer" />
          </label>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          @click="saveSettings"
          class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  </div>
</template>
