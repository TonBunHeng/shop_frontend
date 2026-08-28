// Service abstraction for User Profile, Addresses, and Preferences
import { addresses, currentUser, notifications } from '../data/store'

export const userService = {
  async updateProfile(profileData) {
    if (currentUser.value) {
      currentUser.value = {
        ...currentUser.value,
        ...profileData,
      }
    }
    return Promise.resolve(currentUser.value)
  },

  async getAddresses() {
    return Promise.resolve(addresses.value)
  },

  async addAddress(addressData) {
    const id = `addr_${Date.now()}`
    const newAddress = { id, isDefault: addresses.value.length === 0, ...addressData }
    if (newAddress.isDefault) {
      addresses.value.forEach((a) => (a.isDefault = false))
    }
    addresses.value.push(newAddress)
    return Promise.resolve(newAddress)
  },

  async updateAddress(id, addressData) {
    const idx = addresses.value.findIndex((a) => a.id === id)
    if (idx !== -1) {
      if (addressData.isDefault) {
        addresses.value.forEach((a) => (a.isDefault = false))
      }
      addresses.value[idx] = { ...addresses.value[idx], ...addressData }
      return Promise.resolve(addresses.value[idx])
    }
    return Promise.reject(new Error('Address not found'))
  },

  async deleteAddress(id) {
    addresses.value = addresses.value.filter((a) => a.id !== id)
    if (addresses.value.length > 0 && !addresses.value.some((a) => a.isDefault)) {
      addresses.value[0].isDefault = true
    }
    return Promise.resolve(true)
  },

  async setDefaultAddress(id) {
    addresses.value.forEach((a) => {
      a.isDefault = a.id === id
    })
    return Promise.resolve(true)
  },

  async getNotifications() {
    return Promise.resolve(notifications.value)
  },

  async markNotificationRead(id) {
    const notif = notifications.value.find((n) => n.id === id)
    if (notif) notif.read = true
    return Promise.resolve(true)
  },

  async markAllNotificationsRead() {
    notifications.value.forEach((n) => (n.read = true))
    return Promise.resolve(true)
  },
}
