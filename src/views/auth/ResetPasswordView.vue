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
    showToast('Password Updated', 'Your password has been changed. Please sign in.', 'success')
    props.navigate('login')
  }, 300)
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 shadow-sm space-y-6">
      <div class="text-center space-y-1">
        <h1 class="text-xl font-bold text-gray-900">Set New Password</h1>
        <p class="text-xs text-gray-500">Create a secure password with at least 8 characters</p>
      </div>

      <form @submit.prevent="handleReset" class="space-y-3.5 text-xs">
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Reset Token</label>
          <input
            v-model="token"
            type="text"
            required
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 font-mono focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">New Password *</label>
          <input
            v-model="newPassword"
            type="password"
            required
            placeholder="At least 8 characters"
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">Confirm New Password *</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Re-enter password"
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-medium text-xs transition-colors cursor-pointer"
        >
          <span v-if="isSubmitting">Updating Password...</span>
          <span v-else>Update Password &rarr;</span>
        </button>
      </form>
    </div>
  </div>
</template>
