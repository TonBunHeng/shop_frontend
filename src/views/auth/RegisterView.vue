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
    <div class="bg-gray-950 w-full md:w-52 flex-shrink-0 flex flex-col justify-end p-6 md:p-10">
      <div class="w-10 h-1 bg-gray-700 rounded mb-5 hidden md:block"></div>
      <h1 class="text-white text-xl md:text-2xl font-bold leading-snug mb-2 md:mb-3">Join TechNova</h1>
      <p class="text-slate-400 text-sm leading-relaxed hidden md:block">
        Create your account to save details and sign in faster next time.
      </p>
      <!-- Mobile welcome text -->
      <p class="text-slate-400 text-sm leading-relaxed md:hidden">
        Create your account
      </p>
    </div>

    <div class="flex-1 p-4 sm:p-5 md:p-7 relative">
      <h2 class="text-gray-950 text-lg sm:text-xl font-bold mb-1">Create Account</h2>
      <p class="text-gray-500 text-sm mb-4 sm:mb-5">Enter your information below.</p>

      <form @submit.prevent>
        <input 
          type="text" 
          name="name" 
          placeholder="Full name" 
          required 
          class="w-full border border-gray-300 focus:border-cyan-500 focus:ring-0 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition mb-3"
        >
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
        <input 
          type="password" 
          name="password_confirmation" 
          placeholder="Confirm password" 
          required 
          class="w-full border border-gray-300 focus:border-cyan-500 focus:ring-0 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition mb-4"
        >
        <button 
          type="submit" 
          class="w-full bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-bold text-sm rounded-xl py-3 sm:py-3.5 transition-colors"
        >
          Create Account
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
        Already have an account?
        <a 
          href="/login" 
          class="text-cyan-500 hover:text-cyan-700 font-semibold no-underline whitespace-nowrap" 
          @click.prevent="navigate('login')"
        >
          Log In
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