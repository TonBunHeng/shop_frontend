<script setup>
import { ref } from 'vue'
import { showToast } from '../../data/store'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const email = ref('')
const isSubmitted = ref(false)
const isSubmitting = ref(false)

const handleSubmit = () => {
  if (!email.value) return
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isSubmitted.value = true
    showToast('Reset Link Sent', `Password reset instructions sent to ${email.value}`, 'success')
  }, 300)
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 shadow-sm space-y-6">
      <div class="text-center space-y-1">
        <h1 class="text-xl font-bold text-gray-900">Forgot Password</h1>
        <p class="text-xs text-gray-500">Enter your email and we'll send a password reset link</p>
      </div>

      <div v-if="isSubmitted" class="p-4 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-3 text-center">
        <p class="font-bold">Instructions sent to {{ email }}</p>
        <p>Please check your inbox for the recovery link.</p>
        <button
          type="button"
          @click="navigate('reset-password')"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded inline-block cursor-pointer"
        >
          Enter Reset Token &rarr;
        </button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-4 text-xs">
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Account Email Address *</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-medium text-xs transition-colors cursor-pointer"
        >
          <span v-if="isSubmitting">Sending Link...</span>
          <span v-else>Send Reset Instructions &rarr;</span>
        </button>
      </form>

      <div class="pt-3 border-t border-gray-100 text-center text-xs">
        <button
          type="button"
          @click="navigate('login')"
          class="text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
        >
          &larr; Return to Sign In
        </button>
      </div>
    </div>
  </div>
</template>
