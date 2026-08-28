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
  showToast('Settings Saved', 'Your store preferences have been updated.', 'success')
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account', page: 'account' },
  { label: 'Preferences' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex items-center justify-between pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Account Preferences</h1>
        <p class="text-xs text-gray-500 mt-0.5">Customize localization, currency, and communication settings</p>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-6 text-xs">
      <!-- Localization -->
      <div class="space-y-3">
        <h3 class="text-sm font-bold text-gray-900">Regional & Localization</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-gray-700 mb-1">Currency</label>
            <select
              v-model="currency"
              class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="CAD">CAD ($) - Canadian Dollar</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-gray-700 mb-1">Language</label>
            <select
              v-model="language"
              class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Communications -->
      <div class="space-y-3 pt-4 border-t border-gray-200">
        <h3 class="text-sm font-bold text-gray-900">Notifications & Marketing</h3>

        <div class="space-y-2">
          <label class="flex items-center justify-between p-3 rounded bg-gray-50 border border-gray-200 cursor-pointer">
            <div>
              <p class="font-bold text-gray-900">Flash Sale & Promotional Emails</p>
              <p class="text-[11px] text-gray-500">Receive special discount vouchers and announcements</p>
            </div>
            <input v-model="emailPromos" type="checkbox" class="rounded text-blue-600 accent-blue-600 cursor-pointer" />
          </label>

          <label class="flex items-center justify-between p-3 rounded bg-gray-50 border border-gray-200 cursor-pointer">
            <div>
              <p class="font-bold text-gray-900">Price Drop Notifications</p>
              <p class="text-[11px] text-gray-500">Alerts when wishlisted items go on discount</p>
            </div>
            <input v-model="priceDropAlerts" type="checkbox" class="rounded text-blue-600 accent-blue-600 cursor-pointer" />
          </label>

          <label class="flex items-center justify-between p-3 rounded bg-gray-50 border border-gray-200 cursor-pointer">
            <div>
              <p class="font-bold text-gray-900">Order Tracking SMS Updates</p>
              <p class="text-[11px] text-gray-500">Receive SMS notifications on dispatch and delivery</p>
            </div>
            <input v-model="orderStatusSMS" type="checkbox" class="rounded text-blue-600 accent-blue-600 cursor-pointer" />
          </label>
        </div>
      </div>

      <div class="pt-3 border-t border-gray-200 flex justify-end">
        <button
          type="button"
          @click="saveSettings"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  </div>
</template>
