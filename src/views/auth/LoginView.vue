<script setup>
defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <div class="bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-[620px] relative min-h-[460px] mx-4 md:mx-auto">
    <!-- Left Panel - Hidden on mobile, visible on md+ -->
    <div class="bg-gray-950 w-full md:w-52 flex-shrink-0 flex flex-col justify-end p-6 md:p-10 md:block">
      <div class="w-10 h-1 bg-gray-700 rounded mb-5 hidden md:block"></div>
      <h1 class="text-white text-xl md:text-2xl font-bold leading-snug mb-2 md:mb-3">Welcome Back to TechNova</h1>
      <p class="text-slate-400 text-sm leading-relaxed hidden md:block">
        Sign in to continue exploring the latest technology products.
      </p>
      <!-- Mobile welcome text -->
      <p class="text-slate-400 text-sm leading-relaxed md:hidden">
        Sign in to continue exploring
      </p>
    </div>

    <div class="flex-1 p-4 sm:p-5 md:p-7 relative">
      <!-- Social Login Buttons - Stacked on mobile -->
      <a href="#" class="flex items-center gap-3 w-full border border-gray-300 hover:border-gray-500 hover:bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold text-gray-900 transition mb-2.5 no-underline">
        <span class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1877f2] flex items-center justify-center flex-shrink-0">
          <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </span>
        <span class="text-xs sm:text-sm">Continue with Facebook</span>
      </a>
      
      <a href="#" class="flex items-center gap-3 w-full border border-gray-300 hover:border-gray-500 hover:bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold text-gray-900 transition mb-2.5 no-underline">
        <span class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
          <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </span>
        <span class="text-xs sm:text-sm">Continue with Google</span>
      </a>
      
      <a href="#" class="flex items-center gap-3 w-full border border-gray-300 hover:border-gray-500 hover:bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold text-gray-900 transition mb-2.5 no-underline">
        <span class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black flex items-center justify-center flex-shrink-0">
          <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
        </span>
        <span class="text-xs sm:text-sm">Continue with Apple</span>
      </a>
      
      <div class="flex items-center gap-3 my-3 sm:my-4">
        <div class="flex-1 h-px bg-gray-200"></div>
        <span class="text-xs text-gray-400">or</span>
        <div class="flex-1 h-px bg-gray-200"></div>
      </div>

      <form @submit.prevent>
        <input 
          type="email" 
          name="email" 
          placeholder="Email address" 
          required 
          class="w-full border border-gray-300 focus:border-cyan-500 focus:ring-0 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition mb-3"
        >
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          required 
          class="w-full border border-gray-300 focus:border-cyan-500 focus:ring-0 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition mb-3"
        >
        <div class="flex items-center gap-2 mb-4">
          <input 
            type="checkbox" 
            id="remember" 
            name="remember" 
            class="w-3.5 h-3.5 accent-cyan-500 flex-shrink-0"
          >
          <label for="remember" class="text-xs text-gray-600">Keep me signed in until I sign out</label>
        </div>
        <button 
          type="submit" 
          class="w-full bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-bold text-sm rounded-xl py-3 sm:py-3.5 transition-colors"
        >
          Sign In
        </button>
        <a 
          href="/" 
          class="block w-full border border-gray-300 hover:border-gray-500 hover:bg-gray-50 text-center text-gray-900 font-bold text-sm rounded-xl py-3 sm:py-3.5 mt-3 transition-colors no-underline" 
          @click.prevent="navigate('home')"
        >
          Back to Home
        </a>
      </form>

      <p class="text-center text-xs text-gray-500 mt-4 px-2">
        Not a member yet?
        <a 
          href="/register" 
          class="text-cyan-500 hover:text-cyan-700 font-semibold no-underline whitespace-nowrap" 
          @click.prevent="navigate('register')"
        >
          Create an account
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Additional mobile optimizations */
@media (max-width: 640px) {
  .bg-white {
    border-radius: 1rem;
    margin: 0.5rem auto; 
    min-height: auto;
  }
}

/* Touch-friendly button sizing */
@media (max-width: 768px) {
  button, 
  a {
    min-height: 44px; /* Better touch targets */
  }
  
  input {
    font-size: 16px !important; /* Prevents iOS zoom on focus */
  }
}

/* Smooth transitions for responsive changes */
.bg-white {
  transition: all 0.3s ease;
}
</style>