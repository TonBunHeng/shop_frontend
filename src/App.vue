<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import WelcomeView from './views/WelcomeView.vue'
import LoginView from './views/auth/LoginView.vue'
import RegisterView from './views/auth/RegisterView.vue'
import CartView from './views/cart/CartView.vue'
import CheckoutView from './views/cart/CheckoutView.vue'
import EmptyCartView from './views/cart/EmptyCartView.vue'

const currentPage = ref('welcome')
const mobileNavOpen = ref(false)

const pageBodyClasses = computed(() => {
  if (['login', 'register'].includes(currentPage.value)) {
    return 'min-h-screen bg-gray-200 flex items-center justify-center p-6'
  }

  return 'min-h-screen bg-gray-950 font-sans text-slate-100 antialiased'
})

const navigate = async (page, hash = '') => {
  const nextPage = page === 'home' ? 'welcome' : page

  currentPage.value = nextPage
  mobileNavOpen.value = false
  window.history.pushState({}, '', nextPage === 'welcome' ? `/${hash}` : `/${nextPage}`)

  if (hash) {
    await nextTick()
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const setPageFromPath = () => {
  const path = window.location.pathname.replace(/^\/+/, '')
  currentPage.value = ['login', 'register', 'cart', 'checkout', 'empty'].includes(path) ? path : 'welcome'
}

watch(pageBodyClasses, (classes) => {
  document.body.className = classes
}, { immediate: true })

onMounted(() => {
  setPageFromPath()
  window.addEventListener('popstate', setPageFromPath)
})
</script>

<template>
  <WelcomeView
    v-if="currentPage === 'welcome'"
    :mobile-nav-open="mobileNavOpen"
    :navigate="navigate"
    :toggle-mobile-nav="() => mobileNavOpen = !mobileNavOpen"
  />
  <LoginView
    v-else-if="currentPage === 'login'"
    :navigate="navigate"
  />
  <RegisterView
    v-else-if="currentPage === 'register'"
    :navigate="navigate"
  />
  <CartView
    v-else-if="currentPage === 'cart'"
    :navigate="navigate"
  />
  <CheckoutView
    v-else-if="currentPage === 'checkout'"
    :navigate="navigate"
  />
  <EmptyCartView
    v-else
    :navigate="navigate"
  />
</template>
