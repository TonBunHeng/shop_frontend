<script setup>
import { computed, ref } from 'vue'
import { showToast } from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const currentPass = ref('')
const newPass = ref('')
const confirmPass = ref('')
const twoFactorEnabled = ref(false)

const passwordStrength = computed(() => {
  const p = newPass.value
  if (!p) return { score: 0, label: 'None', color: 'bg-gray-200' }
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500 text-red-600' }
  if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500 text-amber-600' }
  return { score: 3, label: 'Strong', color: 'bg-emerald-500 text-emerald-600' }
})

const handleUpdatePassword = () => {
  if (!currentPass.value || !newPass.value || !confirmPass.value) {
    showToast('Incomplete fields', 'Please enter your current and new password.', 'error')
    return
  }
  if (newPass.value !== confirmPass.value) {
    showToast('Mismatch', 'New passwords do not match.', 'error')
    return
  }
  if (newPass.value.length < 8) {
    showToast('Too short', 'New password must be at least 8 characters long.', 'error')
    return
  }

  showToast('Password Updated!', 'Your account password has been updated securely.', 'success')
  currentPass.value = ''
  newPass.value = ''
  confirmPass.value = ''
}

const toggle2FA = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value
  showToast(
    twoFactorEnabled.value ? '2FA Enabled' : '2FA Disabled',
    twoFactorEnabled.value ? 'Two-Factor Authentication is now active.' : 'Two-Factor security turned off.',
    'info'
  )
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account', page: 'account' },
  { label: 'Security' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex items-center justify-between pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Security & Passwords</h1>
        <p class="text-xs text-gray-500 mt-0.5">Manage your credentials, 2-factor authentication, and sessions</p>
      </div>
    </div>

    <!-- Password Change Card -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-4 text-xs">
      <div class="pb-2 border-b border-gray-100">
        <h3 class="text-sm font-bold text-gray-900">Change Password</h3>
        <p class="text-gray-500 text-[11px]">Must be at least 8 characters long</p>
      </div>

      <form @submit.prevent="handleUpdatePassword" class="space-y-3 max-w-md">
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Current Password *</label>
          <input
            v-model="currentPass"
            type="password"
            required
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">New Password *</label>
          <input
            v-model="newPass"
            type="password"
            required
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
          />

          <!-- Password strength indicator -->
          <div v-if="newPass" class="mt-1.5 space-y-1">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-gray-500">Strength:</span>
              <span class="font-bold capitalize" :class="passwordStrength.color">{{ passwordStrength.label }}</span>
            </div>
            <div class="h-1 bg-gray-200 rounded-full overflow-hidden flex gap-1">
              <div class="h-full rounded-full flex-1" :class="passwordStrength.score >= 1 ? passwordStrength.color : 'bg-gray-200'"></div>
              <div class="h-full rounded-full flex-1" :class="passwordStrength.score >= 2 ? passwordStrength.color : 'bg-gray-200'"></div>
              <div class="h-full rounded-full flex-1" :class="passwordStrength.score >= 3 ? passwordStrength.color : 'bg-gray-200'"></div>
            </div>
          </div>
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">Confirm New Password *</label>
          <input
            v-model="confirmPass"
            type="password"
            required
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
        >
          Update Password
        </button>
      </form>
    </div>

    <!-- 2FA Card -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between gap-4 text-xs">
      <div>
        <h3 class="text-sm font-bold text-gray-900">Two-Factor Authentication (2FA)</h3>
        <p class="text-gray-500 mt-0.5 max-w-md">
          Add an extra layer of security to your account with two-step SMS verification.
        </p>
      </div>

      <button
        type="button"
        @click="toggle2FA"
        class="px-4 py-2 rounded text-xs font-medium transition-colors cursor-pointer shrink-0"
        :class="twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-900 text-white hover:bg-gray-800'"
      >
        {{ twoFactorEnabled ? '✓ Enabled' : 'Enable 2FA' }}
      </button>
    </div>
  </div>
</template>
