<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'

// Global Components
import AppHeader from './components/AppHeader.vue'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import CartDrawer from './components/CartDrawer.vue'
import MobileBottomNav from './components/MobileBottomNav.vue'
import ProductQuickView from './components/ProductQuickView.vue'
import ToastContainer from './components/ToastContainer.vue'

// Views
import WelcomeView from './views/WelcomeView.vue'
import ShopView from './views/ShopView.vue'
import SearchView from './views/SearchView.vue'
import ProductDetailView from './views/ProductDetailView.vue'
import DealsView from './views/DealsView.vue'
import CompareView from './views/CompareView.vue'
import NotFoundView from './views/NotFoundView.vue'

// Auth Views
import LoginView from './views/auth/LoginView.vue'
import RegisterView from './views/auth/RegisterView.vue'
import ForgotPasswordView from './views/auth/ForgotPasswordView.vue'
import ResetPasswordView from './views/auth/ResetPasswordView.vue'

// Cart & Checkout Views
import CartView from './views/cart/CartView.vue'
import CheckoutView from './views/cart/CheckoutView.vue'
import OrderSuccessView from './views/cart/OrderSuccessView.vue'

// Orders Views
import OrderHistoryView from './views/orders/OrderHistoryView.vue'
import OrderDetailView from './views/orders/OrderDetailView.vue'
import OrderTrackingView from './views/orders/OrderTrackingView.vue'

// Wishlist View
import WishlistView from './views/wishlist/WishlistView.vue'

// Account Views
import AccountView from './views/account/AccountView.vue'
import ProfileView from './views/account/ProfileView.vue'
import AddressBookView from './views/account/AddressBookView.vue'
import ReviewsView from './views/account/ReviewsView.vue'
import NotificationsView from './views/account/NotificationsView.vue'
import SecurityView from './views/account/SecurityView.vue'
import SettingsView from './views/account/SettingsView.vue'

const currentPage = ref('welcome')
const currentParams = ref({})

const isAuthPage = computed(() =>
  ['login', 'register', 'forgot-password', 'reset-password'].includes(currentPage.value)
)

const navigate = async (page, params = {}) => {
  let targetPage = page === 'home' ? 'welcome' : page
  let targetParams = typeof params === 'object' && params !== null ? { ...params } : {}
  let hash = typeof params === 'string' && params.startsWith('#') ? params : ''

  currentPage.value = targetPage
  currentParams.value = targetParams

  // Build URL
  let urlPath = '/'
  if (targetPage !== 'welcome') {
    urlPath = `/${targetPage}`
  }

  // Add query params if any
  const queryParts = []
  if (targetParams.id) queryParts.push(`id=${encodeURIComponent(targetParams.id)}`)
  if (targetParams.q) queryParts.push(`q=${encodeURIComponent(targetParams.q)}`)
  if (targetParams.category) queryParts.push(`category=${encodeURIComponent(targetParams.category)}`)

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : ''
  const finalUrl = `${urlPath}${queryString}${hash}`

  window.history.pushState({ page: targetPage, params: targetParams }, '', finalUrl)

  // Scroll
  if (hash) {
    await nextTick()
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Update dynamic document title
  updateDocumentTitle(targetPage, targetParams)
}

const updateDocumentTitle = (page, params) => {
  const titles = {
    welcome: 'TechNova — Next-Gen Electronics Store',
    shop: 'Shop Electronics & Computing Gear — TechNova',
    search: `Search Results — TechNova`,
    product: 'Product Specifications — TechNova',
    deals: 'Flash Deals & Promotions — TechNova',
    compare: 'Product Comparison — TechNova',
    cart: 'Your Shopping Cart — TechNova',
    checkout: 'Secure Checkout — TechNova',
    'order-success': 'Order Confirmed — TechNova',
    'order-tracking': 'Track Shipment — TechNova',
    'account/orders': 'Order History — TechNova',
    'account/profile': 'Profile Settings — TechNova',
    'account/addresses': 'Saved Addresses — TechNova',
    'account/reviews': 'My Reviews — TechNova',
    'account/notifications': 'Notifications — TechNova',
    'account/security': 'Security & Passwords — TechNova',
    'account/settings': 'Store Preferences — TechNova',
    account: 'Customer Account Hub — TechNova',
    wishlist: 'Saved Wishlist — TechNova',
    login: 'Sign In — TechNova',
    register: 'Create Account — TechNova',
    'forgot-password': 'Reset Password — TechNova',
    'reset-password': 'New Password — TechNova',
  }

  document.title = titles[page] || 'TechNova Electronics Store'
}

const setPageFromPath = () => {
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '')
  const urlParams = new URLSearchParams(window.location.search)
  const params = {}
  for (const [k, v] of urlParams.entries()) {
    params[k] = v
  }

  const validPages = [
    'shop',
    'search',
    'product',
    'deals',
    'compare',
    'cart',
    'checkout',
    'order-success',
    'order-tracking',
    'track-order',
    'wishlist',
    'account',
    'account/orders',
    'account/profile',
    'account/addresses',
    'account/reviews',
    'account/notifications',
    'account/security',
    'account/settings',
    'login',
    'register',
    'forgot-password',
    'reset-password',
  ]

  let pageName = 'welcome'
  if (pathname) {
    if (pathname === 'track-order') {
      pageName = 'order-tracking'
    } else if (validPages.includes(pathname)) {
      pageName = pathname
    } else if (pathname.startsWith('product/')) {
      pageName = 'product'
      params.id = pathname.replace('product/', '')
    } else if (pathname.startsWith('track-order/')) {
      pageName = 'order-tracking'
      params.id = pathname.replace('track-order/', '')
    } else if (pathname.startsWith('account/orders/')) {
      pageName = 'account/orders'
      params.id = pathname.replace('account/orders/', '')
    } else {
      pageName = 'not-found'
    }
  }

  currentPage.value = pageName
  currentParams.value = params
  updateDocumentTitle(pageName, params)
}

onMounted(() => {
  setPageFromPath()
  window.addEventListener('popstate', setPageFromPath)
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-600 selection:text-white pb-14 md:pb-0">
    <!-- Top Announcement Bar -->
    <AppHeader v-if="!isAuthPage" :navigate="navigate" />

    <!-- Navbar -->
    <AppNavbar
      v-if="!isAuthPage"
      :navigate="navigate"
      :current-page="currentPage"
    />

    <!-- Dynamic Routed Views -->
    <main class="flex-1">
      <Transition name="fade" mode="out-in">
        <!-- Home / Welcome -->
        <WelcomeView
          v-if="currentPage === 'welcome'"
          :navigate="navigate"
        />

        <!-- Shop Catalog -->
        <ShopView
          v-else-if="currentPage === 'shop'"
          :navigate="navigate"
          :params="currentParams"
        />

        <!-- Dedicated Search -->
        <SearchView
          v-else-if="currentPage === 'search'"
          :navigate="navigate"
          :params="currentParams"
        />

        <!-- Product Detail Page -->
        <ProductDetailView
          v-else-if="currentPage === 'product'"
          :navigate="navigate"
          :params="currentParams"
        />

        <!-- Deals & Promotions -->
        <DealsView
          v-else-if="currentPage === 'deals'"
          :navigate="navigate"
        />

        <!-- Product Comparison -->
        <CompareView
          v-else-if="currentPage === 'compare'"
          :navigate="navigate"
        />

        <!-- Full Cart -->
        <CartView
          v-else-if="currentPage === 'cart'"
          :navigate="navigate"
        />

        <!-- Multi-Step Checkout -->
        <CheckoutView
          v-else-if="currentPage === 'checkout'"
          :navigate="navigate"
        />

        <!-- Order Success Receipt -->
        <OrderSuccessView
          v-else-if="currentPage === 'order-success'"
          :navigate="navigate"
        />

        <!-- Order Tracking Timeline -->
        <OrderTrackingView
          v-else-if="currentPage === 'order-tracking'"
          :navigate="navigate"
          :params="currentParams"
        />

        <!-- Order History List -->
        <OrderHistoryView
          v-else-if="currentPage === 'account/orders'"
          :navigate="navigate"
        />

        <!-- Wishlist -->
        <WishlistView
          v-else-if="currentPage === 'wishlist'"
          :navigate="navigate"
        />

        <!-- Account Hub Dashboard -->
        <AccountView
          v-else-if="currentPage === 'account'"
          :navigate="navigate"
        />

        <!-- Account Profile -->
        <ProfileView
          v-else-if="currentPage === 'account/profile'"
          :navigate="navigate"
        />

        <!-- Address Book -->
        <AddressBookView
          v-else-if="currentPage === 'account/addresses'"
          :navigate="navigate"
        />

        <!-- Account Reviews -->
        <ReviewsView
          v-else-if="currentPage === 'account/reviews'"
          :navigate="navigate"
        />

        <!-- Account Notifications -->
        <NotificationsView
          v-else-if="currentPage === 'account/notifications'"
          :navigate="navigate"
        />

        <!-- Account Security -->
        <SecurityView
          v-else-if="currentPage === 'account/security'"
          :navigate="navigate"
        />

        <!-- Account Settings -->
        <SettingsView
          v-else-if="currentPage === 'account/settings'"
          :navigate="navigate"
        />

        <!-- Auth Views -->
        <LoginView
          v-else-if="currentPage === 'login'"
          :navigate="navigate"
        />

        <RegisterView
          v-else-if="currentPage === 'register'"
          :navigate="navigate"
        />

        <ForgotPasswordView
          v-else-if="currentPage === 'forgot-password'"
          :navigate="navigate"
        />

        <ResetPasswordView
          v-else-if="currentPage === 'reset-password'"
          :navigate="navigate"
        />

        <!-- 404 Not Found fallback -->
        <NotFoundView
          v-else
          :navigate="navigate"
        />
      </Transition>
    </main>

    <!-- App Footer -->
    <AppFooter
      v-if="!isAuthPage"
      :navigate="navigate"
    />

    <!-- Mobile Bottom Navigation (Floating fixed bar on mobile) -->
    <MobileBottomNav
      v-if="!isAuthPage"
      :navigate="navigate"
      :current-page="currentPage"
    />

    <!-- Global Cart Slideover Drawer -->
    <CartDrawer :navigate="navigate" />

    <!-- Global Product Quick View Modal -->
    <ProductQuickView :navigate="navigate" />

    <!-- Global Toast Notifications -->
    <ToastContainer />
  </div>
</template>
