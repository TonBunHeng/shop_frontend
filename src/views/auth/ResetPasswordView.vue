<script setup>
import { ref } from 'vue'
import { showToast } from '../../data/store'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const token = ref('TN-RESET-89241')
const newPassword = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)

const handleReset = () => {
  if (!newPassword.value || !confirmPassword.value) {
    showToast('Incomplete fields', 'Please enter your new password.', 'error')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    showToast('Password mismatch', 'Passwords do not match.', 'error')
    return
  }
  if (newPassword.value.length < 8) {
    showToast('Password too short', 'Password must be at least 8 characters.', 'error')
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    showToast('Password Updated! 🔒', 'Your password has been changed. Please sign in.', 'success')
    props.navigate('login')
  }, 400)
}
</script>

<template>
  <div class="min-h-[85vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl space-y-6">
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mx-auto mb-2">
          🔐
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">Set New Password</h1>
        <p class="text-xs text-slate-500">Create a secure password with at least 8 characters</p>
      </div>

      <form @submit.prevent="handleReset" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-900 mb-1">Reset Verification Token</label>
          <input
            v-model="token"
            type="text"
            required
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">New Password *</label>
          <input
            v-model="newPassword"
            type="password"
            required
            placeholder="At least 8 characters"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">Confirm New Password *</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Re-enter new password"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <span v-if="isSubmitting">Updating Password...</span>
          <span v-else>Confirm & Update Password &rarr;</span>
        </button>
      </form>
    </div>
  </div>
</template>
