<script setup>
import { computed, ref } from 'vue'
import {
  addresses,
  appliedCoupon,
  cart,
  cartDiscount,
  cartSubtotal,
  createOrder,
  currentUser,
  formatPrice,
  showToast,
} from '../../data/store'
import Breadcrumbs from '../../components/Breadcrumbs.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

// Current Step in Multi-Step Wizard (1 to 4)
const currentStep = ref(1)
const isSubmitting = ref(false)

// Customer & Shipping Info
const customerForm = ref({
  firstName: currentUser.value?.name ? currentUser.value.name.split(' ')[0] : 'Ton',
  lastName: currentUser.value?.name ? currentUser.value.name.split(' ').slice(1).join(' ') : 'Bunheng',
  email: currentUser.value?.email || 'ton.bunheng@technova.com',
  phone: currentUser.value?.phone || '+1 (555) 234-5678',
  address: currentUser.value?.address || '742 Evergreen Terrace, Apt 4B',
  city: currentUser.value?.city ? currentUser.value.city.split(',')[0] : 'San Francisco',
  state: 'CA',
  zip: '94107',
  country: 'United States',
  notes: '',
})

// Selected saved address ID (if using address book)
const selectedAddressId = ref(addresses.value[0]?.id || '')

const applySavedAddress = (addr) => {
  selectedAddressId.value = addr.id
  customerForm.value.address = addr.address
  customerForm.value.city = addr.city
  customerForm.value.state = addr.state
  customerForm.value.zip = addr.zip
  customerForm.value.country = addr.country
  if (addr.phone) customerForm.value.phone = addr.phone
}

// Shipping Method Selection
const shippingMethod = ref('standard') // 'standard' | 'express' | 'overnight'

const shippingFee = computed(() => {
  if (appliedCoupon.value?.freeShipping) return 0
  if (shippingMethod.value === 'express') return 20
  if (shippingMethod.value === 'overnight') return 35
  return cartSubtotal.value >= 100 ? 0 : 15
})

// Payment Form Mock
const paymentMethod = ref('card') // 'card' | 'paypal' | 'cod' | 'bank'
const cardForm = ref({
  number: '•••• •••• •••• 4242',
  holder: 'Alex Johnson',
  expiry: '12/28',
  cvv: '•••',
})

// Calculations
const taxAmount = computed(() => {
  const taxable = Math.max(0, cartSubtotal.value - cartDiscount.value)
  return Math.round(taxable * 0.05 * 100) / 100
})

const grandTotal = computed(() => {
  return Math.max(0, cartSubtotal.value + shippingFee.value + taxAmount.value - cartDiscount.value)
})

// Validation per step
const validateStep1 = () => {
  if (!customerForm.value.firstName || !customerForm.value.lastName || !customerForm.value.email) {
    showToast('Missing details', 'Please complete your contact details.', 'error')
    return false
  }
  return true
}

const validateStep2 = () => {
  if (!customerForm.value.address || !customerForm.value.city || !customerForm.value.zip) {
    showToast('Missing address', 'Please provide a valid delivery address.', 'error')
    return false
  }
  return true
}

const nextStep = () => {
  if (currentStep.value === 1 && !validateStep1()) return
  if (currentStep.value === 2 && !validateStep2()) return
  currentStep.value++
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handlePlaceOrder = () => {
  if (cart.value.length === 0) {
    showToast('Empty cart', 'Your cart has no items to checkout.', 'error')
    props.navigate('shop')
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    isSubmitting.value = false
    const paymentLabel =
      paymentMethod.value === 'card'
        ? `Credit Card (${cardForm.value.number.slice(-8)})`
        : paymentMethod.value === 'paypal'
        ? 'PayPal Express Checkout'
        : paymentMethod.value === 'cod'
        ? 'Cash on Delivery'
        : 'Direct Bank Wire'

    const order = createOrder(
      {
        fullName: `${customerForm.value.firstName} ${customerForm.value.lastName}`,
        email: customerForm.value.email,
        phone: customerForm.value.phone,
        address: customerForm.value.address,
        city: `${customerForm.value.city}, ${customerForm.value.state} ${customerForm.value.zip}`,
        country: customerForm.value.country,
        notes: customerForm.value.notes,
      },
      paymentLabel,
      shippingMethod.value
    )

    if (order) {
      props.navigate('order-success')
    }
  }, 400)
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Cart', page: 'cart' },
  { label: 'Checkout' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Checkout Header -->
    <div class="flex items-center justify-between pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Checkout</h1>
        <p class="text-xs text-gray-500 mt-0.5">Please complete the steps below to place your order</p>
      </div>

      <button
        type="button"
        @click="navigate('cart')"
        class="text-xs font-semibold text-gray-600 hover:text-blue-600 cursor-pointer"
      >
        &larr; Return to Cart
      </button>
    </div>

    <!-- Stepper Indicator -->
    <div class="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
      <div
        class="p-2.5 rounded border transition-colors"
        :class="currentStep >= 1 ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-white border-gray-200 text-gray-400'"
      >
        <span class="block text-[10px] uppercase tracking-wider opacity-75">Step 1</span>
        <span>Customer</span>
      </div>

      <div
        class="p-2.5 rounded border transition-colors"
        :class="currentStep >= 2 ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-white border-gray-200 text-gray-400'"
      >
        <span class="block text-[10px] uppercase tracking-wider opacity-75">Step 2</span>
        <span>Shipping</span>
      </div>

      <div
        class="p-2.5 rounded border transition-colors"
        :class="currentStep >= 3 ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-white border-gray-200 text-gray-400'"
      >
        <span class="block text-[10px] uppercase tracking-wider opacity-75">Step 3</span>
        <span>Payment</span>
      </div>

      <div
        class="p-2.5 rounded border transition-colors"
        :class="currentStep >= 4 ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-white border-gray-200 text-gray-400'"
      >
        <span class="block text-[10px] uppercase tracking-wider opacity-75">Step 4</span>
        <span>Review</span>
      </div>
    </div>

    <!-- Main Checkout Grid (8 cols form + 4 cols summary) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Steps Form (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- STEP 1: Customer Information -->
        <div v-if="currentStep === 1" class="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div class="pb-3 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-sm font-bold text-gray-900">1. Customer Information</h2>
            <span class="text-xs text-gray-400">Step 1 of 4</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-gray-700 mb-1">First Name *</label>
              <input
                v-model="customerForm.firstName"
                type="text"
                required
                class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">Last Name *</label>
              <input
                v-model="customerForm.lastName"
                type="text"
                required
                class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">Email Address *</label>
              <input
                v-model="customerForm.email"
                type="email"
                required
                class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input
                v-model="customerForm.phone"
                type="tel"
                required
                class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          <div class="pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              @click="nextStep"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
            >
              Continue to Shipping Address &rarr;
            </button>
          </div>
        </div>

        <!-- STEP 2: Shipping Address & Method -->
        <div v-else-if="currentStep === 2" class="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div class="pb-3 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-sm font-bold text-gray-900">2. Shipping Address & Delivery Option</h2>
            <span class="text-xs text-gray-400">Step 2 of 4</span>
          </div>

          <!-- Saved Addresses Selector -->
          <div v-if="addresses.length > 0" class="space-y-2">
            <label class="text-xs font-semibold text-gray-700">Choose from Saved Addresses:</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="addr in addresses"
                :key="addr.id"
                @click="applySavedAddress(addr)"
                class="p-3 rounded border text-xs cursor-pointer transition-colors"
                :class="selectedAddressId === addr.id ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'"
              >
                <div class="flex items-center justify-between font-bold text-gray-900 mb-1">
                  <span>{{ addr.title || addr.type }}</span>
                  <span v-if="selectedAddressId === addr.id" class="text-blue-600 font-semibold">✓ Selected</span>
                </div>
                <p class="text-gray-700">{{ addr.fullName }}</p>
                <p class="text-gray-500 text-[11px] mt-0.5">{{ addr.address }}, {{ addr.city }}, {{ addr.state }} {{ addr.zip }}</p>
              </div>
            </div>
          </div>

          <!-- Address Form Fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div class="sm:col-span-2">
              <label class="block font-semibold text-gray-700 mb-1">Street Address *</label>
              <input
                v-model="customerForm.address"
                type="text"
                required
                class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">City *</label>
              <input
                v-model="customerForm.city"
                type="text"
                required
                class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">State / Province</label>
              <input
                v-model="customerForm.state"
                type="text"
                class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">Postal / ZIP Code *</label>
              <input
                v-model="customerForm.zip"
                type="text"
                required
                class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">Country</label>
              <input
                v-model="customerForm.country"
                type="text"
                class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          <!-- Shipping Speed Options -->
          <div class="space-y-2 pt-4 border-t border-gray-200 text-xs">
            <label class="font-bold text-gray-900 block">Select Delivery Option:</label>
            
            <label
              class="flex items-center justify-between p-3 rounded border cursor-pointer transition-colors"
              :class="shippingMethod === 'standard' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'"
            >
              <div class="flex items-center gap-2.5">
                <input type="radio" v-model="shippingMethod" value="standard" class="accent-blue-600" />
                <div>
                  <p class="font-bold text-gray-900">Standard Shipping (3–5 Business Days)</p>
                  <p class="text-[11px] text-gray-500">Tracked ground delivery</p>
                </div>
              </div>
              <span class="font-mono font-bold text-gray-900">{{ cartSubtotal >= 100 ? 'FREE' : '$15.00' }}</span>
            </label>

            <label
              class="flex items-center justify-between p-3 rounded border cursor-pointer transition-colors"
              :class="shippingMethod === 'express' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'"
            >
              <div class="flex items-center gap-2.5">
                <input type="radio" v-model="shippingMethod" value="express" class="accent-blue-600" />
                <div>
                  <p class="font-bold text-gray-900">Fast 2-Day Air Shipping (1–2 Business Days)</p>
                  <p class="text-[11px] text-gray-500">Priority air delivery</p>
                </div>
              </div>
              <span class="font-mono font-bold text-gray-900">$20.00</span>
            </label>

            <label
              class="flex items-center justify-between p-3 rounded border cursor-pointer transition-colors"
              :class="shippingMethod === 'overnight' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'"
            >
              <div class="flex items-center gap-2.5">
                <input type="radio" v-model="shippingMethod" value="overnight" class="accent-blue-600" />
                <div>
                  <p class="font-bold text-gray-900">Priority Overnight</p>
                  <p class="text-[11px] text-gray-500">Next morning arrival</p>
                </div>
              </div>
              <span class="font-mono font-bold text-gray-900">$35.00</span>
            </label>
          </div>

          <div class="pt-4 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              @click="prevStep"
              class="px-4 py-2 border border-gray-300 rounded text-gray-700 font-medium text-xs hover:bg-gray-50 cursor-pointer"
            >
              &larr; Back
            </button>
            <button
              type="button"
              @click="nextStep"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
            >
              Continue to Payment &rarr;
            </button>
          </div>
        </div>

        <!-- STEP 3: Payment Method -->
        <div v-else-if="currentStep === 3" class="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div class="pb-3 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-sm font-bold text-gray-900">3. Payment Information</h2>
            <span class="text-xs text-gray-400">Step 3 of 4</span>
          </div>

          <!-- Payment Options Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <button
              type="button"
              @click="paymentMethod = 'card'"
              class="p-3 rounded border text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5"
              :class="paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6-11.25h16.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 19.5V7.5A2.25 2.25 0 013.75 5.25z" />
              </svg>
              <span>Credit Card</span>
            </button>

            <button
              type="button"
              @click="paymentMethod = 'paypal'"
              class="p-3 rounded border text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5"
              :class="paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
            >
              <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center font-mono">P</span>
              <span>PayPal</span>
            </button>

            <button
              type="button"
              @click="paymentMethod = 'cod'"
              class="p-3 rounded border text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5"
              :class="paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cash on Delivery</span>
            </button>

            <button
              type="button"
              @click="paymentMethod = 'bank'"
              class="p-3 rounded border text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5"
              :class="paymentMethod === 'bank' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5m-15 10.5V10.5M3 21h18M3 9h18" />
              </svg>
              <span>Bank Transfer</span>
            </button>
          </div>

          <!-- Credit Card Form -->
          <div v-if="paymentMethod === 'card'" class="p-4 rounded bg-gray-50 border border-gray-200 space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-gray-700 mb-1">Card Number</label>
              <input
                v-model="cardForm.number"
                type="text"
                placeholder="4242 •••• •••• 4242"
                class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 font-mono focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Expiration Date</label>
                <input
                  v-model="cardForm.expiry"
                  type="text"
                  placeholder="MM/YY"
                  class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 font-mono focus:outline-hidden focus:border-blue-600"
                />
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Security Code (CVV)</label>
                <input
                  v-model="cardForm.cvv"
                  type="password"
                  placeholder="123"
                  class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 font-mono focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">Cardholder Name</label>
              <input
                v-model="cardForm.holder"
                type="text"
                class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          <div v-else-if="paymentMethod === 'paypal'" class="p-4 rounded bg-gray-50 border border-gray-200 text-center text-xs text-gray-600 space-y-1">
            <p class="font-bold text-gray-900">PayPal Gateway</p>
            <p>You will complete authentication on the PayPal portal upon clicking Next.</p>
          </div>

          <div v-else class="p-4 rounded bg-gray-50 border border-gray-200 text-center text-xs text-gray-600 space-y-1">
            <p class="font-bold text-gray-900">Offline Payment Selected</p>
            <p>Payment will be processed upon handover or bank receipt.</p>
          </div>

          <div class="pt-4 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              @click="prevStep"
              class="px-4 py-2 border border-gray-300 rounded text-gray-700 font-medium text-xs hover:bg-gray-50 cursor-pointer"
            >
              &larr; Back
            </button>
            <button
              type="button"
              @click="nextStep"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
            >
              Review Order Summary &rarr;
            </button>
          </div>
        </div>

        <!-- STEP 4: Review & Place Order -->
        <div v-else class="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div class="pb-3 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-sm font-bold text-gray-900">4. Review & Place Order</h2>
            <span class="text-xs text-gray-400">Step 4 of 4</span>
          </div>

          <!-- Summary Info Box -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 bg-gray-50 border border-gray-200 rounded">
            <div>
              <h4 class="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Customer</h4>
              <p class="font-bold text-gray-900">{{ customerForm.firstName }} {{ customerForm.lastName }}</p>
              <p class="text-gray-600">{{ customerForm.email }}</p>
              <p class="text-gray-600">{{ customerForm.phone }}</p>
            </div>

            <div>
              <h4 class="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Shipping To</h4>
              <p class="text-gray-900">{{ customerForm.address }}</p>
              <p class="text-gray-900">{{ customerForm.city }}, {{ customerForm.state }} {{ customerForm.zip }}</p>
              <p class="text-blue-600 font-semibold mt-1">Tier: {{ shippingMethod.toUpperCase() }}</p>
            </div>
          </div>

          <!-- Items list -->
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">Ordered Items ({{ cart.length }})</h3>
            <div class="divide-y divide-gray-100 max-h-48 overflow-y-auto">
              <div
                v-for="item in cart"
                :key="item.cartItemId || item.id"
                class="py-2 flex items-center justify-between gap-3 text-xs"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <img :src="item.image" :alt="item.name" class="w-8 h-8 rounded object-cover shrink-0" />
                  <div class="truncate">
                    <span class="font-medium text-gray-900 truncate block">{{ item.name }}</span>
                    <span class="text-[11px] text-gray-500">Qty: {{ item.quantity }}</span>
                  </div>
                </div>
                <span class="font-mono font-bold text-gray-900 shrink-0">
                  ${{ formatPrice(item.price * item.quantity) }}
                </span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-200 flex justify-between items-center">
            <button
              type="button"
              @click="prevStep"
              class="px-4 py-2 border border-gray-300 rounded text-gray-700 font-medium text-xs hover:bg-gray-50 cursor-pointer"
            >
              &larr; Back
            </button>

            <button
              type="button"
              @click="handlePlaceOrder"
              :disabled="isSubmitting"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-medium text-xs rounded transition-colors cursor-pointer"
            >
              <span v-if="isSubmitting">Processing Order...</span>
              <span v-else>Place Order — ${{ formatPrice(grandTotal) }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Summary Sidebar (4 cols) -->
      <div class="lg:col-span-4 sticky top-24">
        <div class="bg-white rounded-lg border border-gray-200 p-5 space-y-3 text-xs">
          <h3 class="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">Summary</h3>

          <div class="space-y-1.5 text-gray-600">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-mono font-medium text-gray-900">${{ formatPrice(cartSubtotal) }}</span>
            </div>

            <div v-if="cartDiscount > 0" class="flex justify-between text-emerald-600">
              <span>Discount</span>
              <span class="font-mono">-${{ formatPrice(cartDiscount) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Shipping</span>
              <span class="font-mono font-medium">
                {{ shippingFee === 0 ? 'FREE' : `$${formatPrice(shippingFee)}` }}
              </span>
            </div>

            <div class="flex justify-between">
              <span>Tax (5%)</span>
              <span class="font-mono font-medium">${{ formatPrice(taxAmount) }}</span>
            </div>

            <div class="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span class="text-blue-600 font-mono">${{ formatPrice(grandTotal) }}</span>
            </div>
          </div>

          <div class="p-2.5 rounded bg-gray-50 border border-gray-100 text-[11px] text-gray-500 space-y-0.5">
            <p>✓ 256-bit SSL encrypted checkout</p>
            <p>✓ 30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
