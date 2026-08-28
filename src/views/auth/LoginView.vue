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
  }, 300)
}

const fillDemo = () => {
  email.value = 'alex.johnson@technova.com'
  password.value = 'password123'
  handleLogin()
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 shadow-sm space-y-6">
      <!-- Logo & Header -->
      <div class="text-center space-y-1">
        <a
          href="/"
          @click.prevent="navigate('home')"
          class="inline-flex items-center gap-2 text-xl font-bold text-gray-900 no-underline cursor-pointer"
        >
          <div class="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            TN
          </div>
          <span>Tech<span class="text-blue-600">Nova</span></span>
        </a>

        <h1 class="text-xl font-bold text-gray-900 pt-2">Sign in to your account</h1>
        <p class="text-xs text-gray-500">Access your saved wishlist, orders, and rewards</p>
      </div>

      <!-- Quick Demo Login Button -->
      <div class="p-3 rounded bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
        <div>
          <span class="font-bold block">Testing the platform?</span>
          <span class="text-[11px] text-blue-700">1-click demo shopper account</span>
        </div>
        <button
          type="button"
          @click="fillDemo"
          class="px-3 py-1.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Demo Login
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4 text-xs">
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Email Address</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="font-semibold text-gray-700">Password</label>
            <button
              type="button"
              @click="navigate('forgot-password')"
              class="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600 pr-10"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="rememberMe" type="checkbox" class="rounded text-blue-600 accent-blue-600" />
            <span class="text-gray-700 font-medium">Remember my session</span>
          </label>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-medium text-xs transition-colors cursor-pointer"
        >
          <span v-if="isSubmitting">Signing In...</span>
          <span v-else>Sign In &rarr;</span>
        </button>
      </form>

      <!-- Bottom link -->
      <div class="pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
        Don't have an account?
        <button
          type="button"
          @click="navigate('register')"
          class="text-blue-600 hover:underline font-bold ml-1 cursor-pointer"
        >
          Create account
        </button>
      </div>
    </div>
  </div>
</template>