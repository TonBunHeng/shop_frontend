<script setup>
import { computed, ref } from 'vue'
import { registerUser, showToast } from '../../data/store'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(true)
const isSubmitting = ref(false)

const passwordStrength = computed(() => {
  const p = password.value
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

const handleRegister = () => {
  if (!name.value || !email.value || !password.value) {
    showToast('Incomplete fields', 'Please fill in all required fields.', 'error')
    return
  }

  if (password.value !== confirmPassword.value) {
    showToast('Password mismatch', 'Password confirmation does not match.', 'error')
    return
  }

  if (password.value.length < 6) {
    showToast('Password too short', 'Password must be at least 6 characters.', 'error')
    return
  }

  if (!agreeTerms.value) {
    showToast('Terms required', 'Please accept the terms of service.', 'warning')
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    registerUser(name.value, email.value)
    props.navigate('home')
  }, 400)
}
</script>

<template>
  <div class="min-h-[85vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl space-y-6">
      <!-- Logo & Header -->
      <div class="text-center space-y-2">
        <a
          href="/"
          @click.prevent="navigate('home')"
          class="inline-flex items-center gap-2 text-xl font-black text-slate-900 no-underline"
        >
          <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold text-sm">
            TN
          </div>
          <span>Tech<span class="text-indigo-600">Nova</span></span>
        </a>

        <h1 class="text-2xl font-black text-slate-900 tracking-tight mt-2">Create your account</h1>
        <p class="text-xs text-slate-500">Sign up and receive <strong>150 bonus reward points</strong></p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-900 mb-1">Full Name *</label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Alex Johnson"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">Email Address *</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="alex.johnson@example.com"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">Password *</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="At least 8 characters"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />

          <!-- Password strength meter -->
          <div v-if="password" class="mt-2 space-y-1">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Password Strength:</span>
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
          <label class="block font-bold text-slate-900 mb-1">Confirm Password *</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Re-enter password"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <label class="flex items-start gap-2 cursor-pointer pt-1">
          <input
            v-model="agreeTerms"
            type="checkbox"
            required
            class="w-4 h-4 rounded-sm text-indigo-600 accent-indigo-600 mt-0.5"
          />
          <span class="text-slate-600 leading-snug">
            I agree to the <a href="#" @click.prevent class="text-indigo-600 underline">Terms of Service</a> and <a href="#" @click.prevent class="text-indigo-600 underline">Privacy Policy</a>
          </span>
        </label>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <span v-if="isSubmitting">Creating Account...</span>
          <span v-else>Register TechNova Account &rarr;</span>
        </button>
      </form>

      <!-- Bottom Link -->
      <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Already registered?
        <button
          type="button"
          @click="navigate('login')"
          class="text-indigo-600 hover:underline font-bold ml-1 cursor-pointer"
        >
          Sign In instead
        </button>
      </div>
    </div>
  </div>
</template>