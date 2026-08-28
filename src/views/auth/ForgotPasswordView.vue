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
    showToast('Reset Link Dispatched 📩', `Password reset instructions sent to ${email.value}`, 'success')
  }, 400)
}
</script>

<template>
  <div class="min-h-[85vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl space-y-6">
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mx-auto mb-2">
          🔑
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">Forgot Password</h1>
        <p class="text-xs text-slate-500">Enter your email and we'll send a secure password reset link</p>
      </div>

      <div v-if="isSubmitted" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-3 text-center">
        <p class="font-bold">Instructions sent to {{ email }}</p>
        <p>Please check your inbox and spam folder for the recovery link.</p>
        <button
          type="button"
          @click="navigate('reset-password')"
          class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-block cursor-pointer shadow-xs"
        >
          Simulate Entering Reset Token &rarr;
        </button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-900 mb-1">Account Email Address *</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <span v-if="isSubmitting">Dispatching Link...</span>
          <span v-else>Send Reset Instructions &rarr;</span>
        </button>
      </form>

      <div class="pt-4 border-t border-slate-100 text-center text-xs">
        <button
          type="button"
          @click="navigate('login')"
          class="text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
        >
          &larr; Return to Sign In
        </button>
      </div>
    </div>
  </div>
</template>
