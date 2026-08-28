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
  if (!p) return { score: 0, label: 'None', color: 'bg-slate-200' }
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500 text-rose-600' }
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

  showToast('Password Updated! 🔒', 'Your account credentials have been updated securely.', 'success')
  currentPass.value = ''
  newPass.value = ''
  confirmPass.value = ''
}

const toggle2FA = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value
  showToast(
    twoFactorEnabled.value ? '2FA Activated 🛡️' : '2FA Deactivated',
    twoFactorEnabled.value ? 'Two-Factor Authentication is now safeguarding your login.' : 'Two-Factor security disabled.',
    'info'
  )
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account Hub', page: 'account' },
  { label: 'Security & Access' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Security & Authentication</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Manage password credentials, two-factor authentication, and active sessions</p>
      </div>
    </div>

    <!-- Password Change Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div class="pb-3 border-b border-slate-100">
        <h3 class="text-base font-bold text-slate-900">Change Account Password</h3>
        <p class="text-xs text-slate-500 mt-0.5">Ensure your password is at least 8 characters including numbers and symbols</p>
      </div>

      <form @submit.prevent="handleUpdatePassword" class="space-y-4 max-w-lg text-xs">
        <div>
          <label class="block font-bold text-slate-900 mb-1">Current Password *</label>
          <input
            v-model="currentPass"
            type="password"
            required
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">New Password *</label>
          <input
            v-model="newPass"
            type="password"
            required
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />

          <!-- Password strength indicator -->
          <div v-if="newPass" class="mt-2 space-y-1">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Strength:</span>
              <span class="font-bold capitalize" :class="passwordStrength.color">{{ passwordStrength.label }}</span>
            </div>
            <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
              <div class="h-full rounded-full transition-all duration-300 flex-1" :class="passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200'"></div>
              <div class="h-full rounded-full transition-all duration-300 flex-1" :class="passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200'"></div>
              <div class="h-full rounded-full transition-all duration-300 flex-1" :class="passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200'"></div>
            </div>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">Confirm New Password *</label>
          <input
            v-model="confirmPass"
            type="password"
            required
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          Update Password
        </button>
      </form>
    </div>

    <!-- 2FA Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex items-center justify-between gap-4">
      <div>
        <h3 class="text-base font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
        <p class="text-xs text-slate-500 mt-1 max-w-md">
          Require an SMS verification code or authenticator app token in addition to your password on new browser sessions.
        </p>
      </div>

      <button
        type="button"
        @click="toggle2FA"
        class="px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer shrink-0"
        :class="twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-900 text-white hover:bg-slate-800'"
      >
        {{ twoFactorEnabled ? '✓ 2FA Enabled' : 'Enable 2FA' }}
      </button>
    </div>

    <!-- Active Device Sessions -->
    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4 text-xs">
      <h3 class="text-base font-bold text-slate-900">Active Login Sessions</h3>
      <div class="divide-y divide-slate-100">
        <div class="py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-xl">💻</span>
            <div>
              <p class="font-bold text-slate-900">macOS (Chrome 126) · Current Session</p>
              <p class="text-[11px] text-slate-400">San Francisco, CA · IP: 192.0.2.1</p>
            </div>
          </div>
          <span class="text-emerald-600 font-bold text-[11px]">Active Now</span>
        </div>
      </div>
    </div>
  </div>
</template>
