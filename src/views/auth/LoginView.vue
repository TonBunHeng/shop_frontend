<script setup>
import { ref } from 'vue'
import { loginUser, showToast } from '../../data/store'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const email = ref('alex.johnson@technova.com')
const password = ref('password123')
const rememberMe = ref(true)
const showPassword = ref(false)
const isSubmitting = ref(false)

const handleLogin = () => {
  if (!email.value || !password.value) {
    showToast('Missing details', 'Please enter your email and password.', 'error')
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    loginUser(email.value, password.value)
    props.navigate('home')
  }, 400)
}

const fillDemo = () => {
  email.value = 'alex.johnson@technova.com'
  password.value = 'password123'
  handleLogin()
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

        <h1 class="text-2xl font-black text-slate-900 tracking-tight mt-2">Sign in to your account</h1>
        <p class="text-xs text-slate-500">Access your saved wishlist, rewards, and tracked orders</p>
      </div>

      <!-- Quick Demo Login Button -->
      <div class="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
        <div>
          <span class="font-bold block">Testing the platform?</span>
          <span class="text-[11px] text-indigo-700">1-click demo shopper account</span>
        </div>
        <button
          type="button"
          @click="fillDemo"
          class="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Demo Login
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-900 mb-1">Email Address</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="font-bold text-slate-900">Password</label>
            <button
              type="button"
              @click="navigate('forgot-password')"
              class="text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500 pr-10"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="rememberMe" type="checkbox" class="w-4 h-4 rounded-sm text-indigo-600 accent-indigo-600" />
            <span class="text-slate-600 font-medium">Remember my session</span>
          </label>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <span v-if="isSubmitting">Signing In...</span>
          <span v-else>Sign In to TechNova &rarr;</span>
        </button>
      </form>

      <!-- Bottom link -->
      <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Don't have a TechNova account?
        <button
          type="button"
          @click="navigate('register')"
          class="text-indigo-600 hover:underline font-bold ml-1 cursor-pointer"
        >
          Create an account
        </button>
      </div>
    </div>
  </div>
</template>