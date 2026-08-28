<script setup>
import { ref } from 'vue'
import {
  addAddress,
  addresses,
  deleteAddress,
  setDefaultAddress,
  showToast,
  updateAddress,
} from '../../data/store'
import AppIcon from '../../components/AppIcon.vue'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import Modal from '../../components/Modal.vue'

const props = defineProps({
  navigate: {
    type: Function,
    required: true,
  },
})

const isModalOpen = ref(false)
const editingAddressId = ref(null)

const addressForm = ref({
  title: 'Home Address',
  type: 'Home', // 'Home' | 'Office' | 'Other'
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: 'CA',
  zip: '',
  country: 'United States',
  isDefault: false,
})

const openAddModal = () => {
  editingAddressId.value = null
  addressForm.value = {
    title: 'Home Address',
    type: 'Home',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: 'CA',
    zip: '',
    country: 'United States',
    isDefault: addresses.value.length === 0,
  }
  isModalOpen.value = true
}

const openEditModal = (addr) => {
  editingAddressId.value = addr.id
  addressForm.value = { ...addr }
  isModalOpen.value = true
}

const handleSave = () => {
  if (!addressForm.value.fullName || !addressForm.value.address || !addressForm.value.city) {
    showToast('Incomplete address', 'Please fill in all required fields.', 'error')
    return
  }

  if (editingAddressId.value) {
    updateAddress(editingAddressId.value, addressForm.value)
  } else {
    addAddress(addressForm.value)
  }

  isModalOpen.value = false
}

const handleDelete = (id) => {
  if (confirm('Delete this delivery address?')) {
    deleteAddress(id)
  }
}

const breadcrumbs = [
  { label: 'Home', page: 'welcome' },
  { label: 'Account', page: 'account' },
  { label: 'Address Book' },
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Saved Addresses</h1>
        <p class="text-xs text-gray-500 mt-0.5">Manage delivery destinations for fast checkout</p>
      </div>

      <button
        type="button"
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors cursor-pointer self-start sm:self-auto"
      >
        + Add Address
      </button>
    </div>

    <!-- Address Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="addr in addresses"
        :key="addr.id"
        class="bg-white rounded-lg border p-4 flex flex-col justify-between space-y-3"
        :class="addr.isDefault ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200'"
      >
        <div>
          <!-- Type Badge & Default -->
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {{ addr.type }}
            </span>

            <span
              v-if="addr.isDefault"
              class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase"
            >
              Default
            </span>
          </div>

          <h3 class="font-bold text-gray-900 text-xs">{{ addr.title || addr.fullName }}</h3>
          <p class="text-xs text-gray-700 mt-0.5">{{ addr.fullName }}</p>
          <p class="text-xs text-gray-500 mt-1 leading-relaxed">
            {{ addr.address }}<br />
            {{ addr.city }}, {{ addr.state }} {{ addr.zip }}<br />
            {{ addr.country }}
          </p>
          <p v-if="addr.phone" class="text-xs text-gray-500 mt-1.5 font-mono flex items-center gap-1.5">
            <AppIcon name="phone" size="xs" />
            <span>{{ addr.phone }}</span>
          </p>
        </div>

        <!-- Actions -->
        <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openEditModal(addr)"
              class="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Edit
            </button>
            <span class="text-gray-300">|</span>
            <button
              type="button"
              @click="handleDelete(addr.id)"
              class="text-red-600 hover:underline cursor-pointer"
            >
              Delete
            </button>
          </div>

          <button
            v-if="!addr.isDefault"
            type="button"
            @click="setDefaultAddress(addr.id)"
            class="text-gray-500 hover:text-gray-800 font-medium text-[11px] cursor-pointer"
          >
            Set Default
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Address -->
    <Modal
      :is-open="isModalOpen"
      :title="editingAddressId ? 'Edit Address' : 'Add New Address'"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSave" class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-gray-700 mb-1">Label</label>
            <input
              v-model="addressForm.title"
              type="text"
              placeholder="e.g. Home, Office"
              class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div>
            <label class="block font-semibold text-gray-700 mb-1">Type</label>
            <select
              v-model="addressForm.type"
              class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-gray-700 mb-1">Full Name *</label>
            <input
              v-model="addressForm.fullName"
              type="text"
              required
              class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div>
            <label class="block font-semibold text-gray-700 mb-1">Phone</label>
            <input
              v-model="addressForm.phone"
              type="tel"
              class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">Street Address *</label>
          <input
            v-model="addressForm.address"
            type="text"
            required
            placeholder="Street address, apartment"
            class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block font-semibold text-gray-700 mb-1">City *</label>
            <input
              v-model="addressForm.city"
              type="text"
              required
              class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block font-semibold text-gray-700 mb-1">State</label>
            <input
              v-model="addressForm.state"
              type="text"
              class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
            />
          </div>
          <div>
            <label class="block font-semibold text-gray-700 mb-1">ZIP *</label>
            <input
              v-model="addressForm.zip"
              type="text"
              required
              class="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
            />
          </div>
        </div>

        <label class="flex items-center gap-2 cursor-pointer pt-1">
          <input
            v-model="addressForm.isDefault"
            type="checkbox"
            class="rounded text-blue-600 accent-blue-600 cursor-pointer"
          />
          <span class="text-gray-700">Set as default shipping address</span>
        </label>

        <div class="pt-3 border-t border-gray-200 flex justify-end gap-2">
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded cursor-pointer"
          >
            Save Address
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>
