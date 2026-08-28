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
  { label: 'Account Hub', page: 'account' },
  { label: 'Address Book' },
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    <Breadcrumbs :items="breadcrumbs" :navigate="navigate" />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Saved Addresses</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Manage delivery destinations for seamless checkout</p>
      </div>

      <button
        type="button"
        @click="openAddModal"
        class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
      >
        <span>+ Add New Address</span>
      </button>
    </div>

    <!-- Address Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="addr in addresses"
        :key="addr.id"
        class="bg-white rounded-3xl border p-6 flex flex-col justify-between space-y-4 shadow-xs transition-all"
        :class="addr.isDefault ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200/80'"
      >
        <div>
          <!-- Type Badge & Default -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
              {{ addr.type }}
            </span>

            <span
              v-if="addr.isDefault"
              class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800"
            >
              ★ Default
            </span>
          </div>

          <h3 class="font-bold text-slate-900 text-sm mb-1">{{ addr.title || addr.fullName }}</h3>
          <p class="text-xs text-slate-700 font-medium">{{ addr.fullName }}</p>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">
            {{ addr.address }}<br />
            {{ addr.city }}, {{ addr.state }} {{ addr.zip }}<br />
            {{ addr.country }}
          </p>
          <p v-if="addr.phone" class="text-xs text-slate-500 mt-2 font-mono">
            📞 {{ addr.phone }}
          </p>
        </div>

        <!-- Card Actions -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openEditModal(addr)"
              class="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
            >
              Edit
            </button>
            <span class="text-slate-300">|</span>
            <button
              type="button"
              @click="handleDelete(addr.id)"
              class="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
            >
              Delete
            </button>
          </div>

          <button
            v-if="!addr.isDefault"
            type="button"
            @click="setDefaultAddress(addr.id)"
            class="text-[11px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Set Default
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Address -->
    <Modal
      :is-open="isModalOpen"
      :title="editingAddressId ? 'Edit Delivery Address' : 'Add New Address'"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSave" class="space-y-4 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-900 mb-1">Address Label</label>
            <input
              v-model="addressForm.title"
              type="text"
              placeholder="e.g. Home, Office, Studio"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-900 mb-1">Address Type</label>
            <select
              v-model="addressForm.type"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-hidden cursor-pointer"
            >
              <option value="Home">Home</option>
              <option value="Office">Office / Workplace</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-900 mb-1">Full Name *</label>
            <input
              v-model="addressForm.fullName"
              type="text"
              required
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-900 mb-1">Phone Number</label>
            <input
              v-model="addressForm.phone"
              type="tel"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-900 mb-1">Street Address *</label>
          <input
            v-model="addressForm.address"
            type="text"
            required
            placeholder="Street address, apartment, suite, unit"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block font-bold text-slate-900 mb-1">City *</label>
            <input
              v-model="addressForm.city"
              type="text"
              required
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-900 mb-1">State / Province</label>
            <input
              v-model="addressForm.state"
              type="text"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-900 mb-1">Postal Code *</label>
            <input
              v-model="addressForm.zip"
              type="text"
              required
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <label class="flex items-center gap-2 cursor-pointer pt-1">
          <input
            v-model="addressForm.isDefault"
            type="checkbox"
            class="w-4 h-4 rounded-sm text-indigo-600 accent-indigo-600 cursor-pointer"
          />
          <span class="text-xs font-semibold text-slate-700">Set as default shipping address</span>
        </label>

        <div class="pt-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md cursor-pointer"
          >
            Save Address
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>
