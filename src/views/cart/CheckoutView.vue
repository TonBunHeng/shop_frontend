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
  firstName: currentUser.value?.name ? currentUser.value.name.split(' ')[0] : 'Alex',
  lastName: currentUser.value?.name ? currentUser.value.name.split(' ').slice(1).join(' ') : 'Johnson',
  email: currentUser.value?.email || 'alex.johnson@technova.com',
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
  window.scrollTo({ top: 100, behavior: 'smooth' })
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 100, behavior: 'smooth' })
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
  }, 600)
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Cart', page: 'cart' },
  { label: 'Checkout' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Checkout Header -->
    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Secure Checkout</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">256-bit encrypted bank grade checkout</p>
      </div>

      <button
        type="button"
        @click="navigate('cart')"
        class="text-xs font-bold text-slate-600 hover:text-indigo-600 cursor-pointer"
      >
        &larr; Return to Cart
      </button>
    </div>

    <!-- Stepper Indicator -->
    <div class="grid grid-cols-4 gap-2 text-center text-xs font-bold">
      <div
        class="p-3 rounded-2xl border transition-all"
        :class="currentStep >= 1 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold' : 'bg-white border-slate-200 text-slate-400'"
      >
        <span class="block text-[10px] uppercase tracking-wider opacity-70">Step 1</span>
        <span>Customer</span>
      </div>

      <div
        class="p-3 rounded-2xl border transition-all"
        :class="currentStep >= 2 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold' : 'bg-white border-slate-200 text-slate-400'"
      >
        <span class="block text-[10px] uppercase tracking-wider opacity-70">Step 2</span>
        <span>Shipping</span>
      </div>

      <div
        class="p-3 rounded-2xl border transition-all"
        :class="currentStep >= 3 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold' : 'bg-white border-slate-200 text-slate-400'"
      >
        <span class="block text-[10px] uppercase tracking-wider opacity-70">Step 3</span>
        <span>Payment</span>
      </div>

      <div
        class="p-3 rounded-2xl border transition-all"
        :class="currentStep >= 4 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold' : 'bg-white border-slate-200 text-slate-400'"
      >
        <span class="block text-[10px] uppercase tracking-wider opacity-70">Step 4</span>
        <span>Review</span>
      </div>
    </div>

    <!-- Main Checkout Grid (8 cols form + 4 cols summary) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Steps Form (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- STEP 1: Customer Information -->
        <div v-if="currentStep === 1" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-900">1. Customer Information</h2>
            <span class="text-xs text-slate-400">Step 1 of 4</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-bold text-slate-900 mb-1">First Name *</label>
              <input
                v-model="customerForm.firstName"
                type="text"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-900 mb-1">Last Name *</label>
              <input
                v-model="customerForm.lastName"
                type="text"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-900 mb-1">Email Address *</label>
              <input
                v-model="customerForm.email"
                type="email"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-900 mb-1">Phone Number *</label>
              <input
                v-model="customerForm.phone"
                type="tel"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              @click="nextStep"
              class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Continue to Shipping Address</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        <!-- STEP 2: Shipping Address & Method -->
        <div v-else-if="currentStep === 2" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-900">2. Shipping Address & Delivery Speed</h2>
            <span class="text-xs text-slate-400">Step 2 of 4</span>
          </div>

          <!-- Saved Addresses Selector -->
          <div v-if="addresses.length > 0" class="space-y-2">
            <label class="text-xs font-bold text-slate-700">Choose from Saved Addresses:</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="addr in addresses"
                :key="addr.id"
                @click="applySavedAddress(addr)"
                class="p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between"
                :class="selectedAddressId === addr.id ? 'border-indigo-600 bg-indigo-50/50 shadow-xs' : 'border-slate-200 hover:bg-slate-50'"
              >
                <div>
                  <div class="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>{{ addr.title || addr.type }}</span>
                    <span v-if="selectedAddressId === addr.id" class="text-indigo-600 font-bold">✓ Selected</span>
                  </div>
                  <p class="text-slate-600">{{ addr.fullName }}</p>
                  <p class="text-slate-500 text-[11px] mt-0.5">{{ addr.address }}, {{ addr.city }}, {{ addr.state }} {{ addr.zip }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Form Fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div class="sm:col-span-2">
              <label class="block font-bold text-slate-900 mb-1">Street Address *</label>
              <input
                v-model="customerForm.address"
                type="text"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-900 mb-1">City *</label>
              <input
                v-model="customerForm.city"
                type="text"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-900 mb-1">State / Province</label>
              <input
                v-model="customerForm.state"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-900 mb-1">Postal / ZIP Code *</label>
              <input
                v-model="customerForm.zip"
                type="text"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-900 mb-1">Country</label>
              <input
                v-model="customerForm.country"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <!-- Shipping Speed Options -->
          <div class="space-y-3 pt-4 border-t border-slate-100">
            <label class="text-xs font-bold text-slate-900 uppercase tracking-wider block">Select Delivery Tier</label>
            <div class="space-y-2 text-xs">
              <label
                class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all"
                :class="shippingMethod === 'standard' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'"
              >
                <div class="flex items-center gap-3">
                  <input type="radio" v-model="shippingMethod" value="standard" class="accent-indigo-600" />
                  <div>
                    <p class="font-bold text-slate-900">Standard Express Shipping (3–5 Business Days)</p>
                    <p class="text-[11px] text-slate-500">Tracked FedEx / USPS ground</p>
                  </div>
                </div>
                <span class="font-bold font-mono text-slate-900">{{ cartSubtotal >= 100 ? 'FREE' : '$15.00' }}</span>
              </label>

              <label
                class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all"
                :class="shippingMethod === 'express' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'"
              >
                <div class="flex items-center gap-3">
                  <input type="radio" v-model="shippingMethod" value="express" class="accent-indigo-600" />
                  <div>
                    <p class="font-bold text-slate-900">Fast 2-Day Air Shipping (1–2 Business Days)</p>
                    <p class="text-[11px] text-slate-500">Guaranteed priority air delivery</p>
                  </div>
                </div>
                <span class="font-bold font-mono text-slate-900">$20.00</span>
              </label>

              <label
                class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all"
                :class="shippingMethod === 'overnight' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'"
              >
                <div class="flex items-center gap-3">
                  <input type="radio" v-model="shippingMethod" value="overnight" class="accent-indigo-600" />
                  <div>
                    <p class="font-bold text-slate-900">Next-Day Morning Priority Overnight</p>
                    <p class="text-[11px] text-slate-500">Before 10:30 AM arrival with direct signature</p>
                  </div>
                </div>
                <span class="font-bold font-mono text-slate-900">$35.00</span>
              </label>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              @click="prevStep"
              class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              &larr; Back
            </button>
            <button
              type="button"
              @click="nextStep"
              class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Continue to Payment</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        <!-- STEP 3: Payment Method -->
        <div v-else-if="currentStep === 3" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-900">3. Payment Information</h2>
            <span class="text-xs text-slate-400">Step 3 of 4</span>
          </div>

          <!-- Payment Options Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              @click="paymentMethod = 'card'"
              class="p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
              :class="paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
            >
              <span class="text-lg">💳</span>
              <span class="text-xs">Credit Card</span>
            </button>

            <button
              type="button"
              @click="paymentMethod = 'paypal'"
              class="p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
              :class="paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
            >
              <span class="text-lg">🅿️</span>
              <span class="text-xs">PayPal</span>
            </button>

            <button
              type="button"
              @click="paymentMethod = 'cod'"
              class="p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
              :class="paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
            >
              <span class="text-lg">💵</span>
              <span class="text-xs">Cash on Deliv</span>
            </button>

            <button
              type="button"
              @click="paymentMethod = 'bank'"
              class="p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
              :class="paymentMethod === 'bank' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
            >
              <span class="text-lg">🏦</span>
              <span class="text-xs">Wire Transfer</span>
            </button>
          </div>

          <!-- Credit Card Input Simulation -->
          <div v-if="paymentMethod === 'card'" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
            <div>
              <label class="block font-bold text-slate-900 mb-1">Card Number</label>
              <input
                v-model="cardForm.number"
                type="text"
                placeholder="4242 •••• •••• 4242"
                class="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-900 mb-1">Expiration Date</label>
                <input
                  v-model="cardForm.expiry"
                  type="text"
                  placeholder="MM/YY"
                  class="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <div>
                <label class="block font-bold text-slate-900 mb-1">Security Code (CVV)</label>
                <input
                  v-model="cardForm.cvv"
                  type="password"
                  placeholder="123"
                  class="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-900 mb-1">Cardholder Name</label>
              <input
                v-model="cardForm.holder"
                type="text"
                class="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div v-else-if="paymentMethod === 'paypal'" class="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 space-y-2">
            <p class="font-bold text-slate-900">PayPal Express Checkout Simulation</p>
            <p>You will be redirected to PayPal's secure gateway to finalize authentication.</p>
          </div>

          <div v-else class="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 space-y-2">
            <p class="font-bold text-slate-900">Offline Payment Selection</p>
            <p>Payment will be collected upon parcel handover by courier.</p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              @click="prevStep"
              class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              &larr; Back
            </button>
            <button
              type="button"
              @click="nextStep"
              class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Review Order Summary</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        <!-- STEP 4: Review & Place Order -->
        <div v-else class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-900">4. Review & Place Order</h2>
            <span class="text-xs text-slate-400">Step 4 of 4</span>
          </div>

          <!-- Review Summary Box -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <h4 class="font-bold text-slate-400 uppercase tracking-wider mb-1">Customer</h4>
              <p class="font-bold text-slate-900">{{ customerForm.firstName }} {{ customerForm.lastName }}</p>
              <p class="text-slate-600">{{ customerForm.email }}</p>
              <p class="text-slate-600">{{ customerForm.phone }}</p>
            </div>

            <div>
              <h4 class="font-bold text-slate-400 uppercase tracking-wider mb-1">Shipping To</h4>
              <p class="text-slate-900 font-medium">{{ customerForm.address }}</p>
              <p class="text-slate-900 font-medium">{{ customerForm.city }}, {{ customerForm.state }} {{ customerForm.zip }}</p>
              <p class="text-indigo-600 font-bold mt-1">Tier: {{ shippingMethod.toUpperCase() }}</p>
            </div>
          </div>

          <!-- Items in order -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Order Items ({{ cart.length }})</h3>
            <div class="divide-y divide-slate-100 max-h-56 overflow-y-auto">
              <div
                v-for="item in cart"
                :key="item.cartItemId || item.id"
                class="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <img :src="item.image" :alt="item.name" class="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div class="truncate">
                    <span class="font-bold text-slate-900 truncate block">{{ item.name }}</span>
                    <span class="text-[11px] text-slate-500">Qty: {{ item.quantity }}</span>
                  </div>
                </div>
                <span class="font-mono font-bold text-slate-900 shrink-0">
                  ${{ formatPrice(item.price * item.quantity) }}
                </span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
            <button
              type="button"
              @click="prevStep"
              class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              &larr; Back
            </button>

            <button
              type="button"
              @click="handlePlaceOrder"
              :disabled="isSubmitting"
              class="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <span v-if="isSubmitting">Processing Order...</span>
              <span v-else>Place Order — ${{ formatPrice(grandTotal) }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Summary Sidebar (4 cols) -->
      <div class="lg:col-span-4 sticky top-24">
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 text-xs">
          <h3 class="text-sm font-bold text-slate-900">Summary Breakdown</h3>

          <div class="space-y-2 text-slate-600 pt-2 border-t border-slate-100">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-bold text-slate-900 font-mono">${{ formatPrice(cartSubtotal) }}</span>
            </div>

            <div v-if="cartDiscount > 0" class="flex justify-between text-emerald-600 font-bold">
              <span>Coupon Discount</span>
              <span class="font-mono">-${{ formatPrice(cartDiscount) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Shipping Fee</span>
              <span class="font-mono font-medium">
                {{ shippingFee === 0 ? 'FREE' : `$${formatPrice(shippingFee)}` }}
              </span>
            </div>

            <div class="flex justify-between">
              <span>Sales Tax (5%)</span>
              <span class="font-mono font-medium">${{ formatPrice(taxAmount) }}</span>
            </div>

            <div class="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total to Pay</span>
              <span class="text-indigo-600 font-mono">${{ formatPrice(grandTotal) }}</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1">
            <p>✓ All payments encrypted with TLS 1.3</p>
            <p>✓ 30-Day unconditional money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
