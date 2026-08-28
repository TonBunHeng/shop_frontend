// Service abstraction for Cart & Coupons
import { availableCoupons } from '../data/store'

export const cartService = {
  validateCoupon(code, subtotal = 0) {
    if (!code) return { valid: false, message: 'Please enter a coupon code' }
    const cleanCode = code.trim().toUpperCase()
    const coupon = availableCoupons[cleanCode]

    if (!coupon) {
      return { valid: false, message: `Coupon "${cleanCode}" is invalid or expired` }
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return {
        valid: false,
        message: `Minimum purchase of $${coupon.minPurchase} required for coupon ${cleanCode}`,
      }
    }

    return {
      valid: true,
      coupon: {
        code: cleanCode,
        ...coupon,
      },
      message: `Coupon "${cleanCode}" applied successfully!`,
    }
  },

  calculateTotals({ items = [], coupon = null, shippingMethod = 'standard', taxRate = 0.05 }) {
    const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)

    let discount = 0
    let freeShippingFromCoupon = false

    if (coupon) {
      if (coupon.discountPercent) {
        discount = Math.round((subtotal * (coupon.discountPercent / 100)) * 100) / 100
      } else if (coupon.discountFixed) {
        discount = Math.min(subtotal, coupon.discountFixed)
      } else if (coupon.freeShipping) {
        freeShippingFromCoupon = true
      }
    }

    let shipping = 0
    if (items.length > 0) {
      if (freeShippingFromCoupon || (shippingMethod === 'standard' && subtotal >= 100)) {
        shipping = 0
      } else if (shippingMethod === 'express') {
        shipping = 20
      } else if (shippingMethod === 'overnight') {
        shipping = 35
      } else {
        shipping = 15
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount)
    const tax = items.length > 0 ? Math.round(taxableAmount * taxRate * 100) / 100 : 0
    const total = items.length > 0 ? Math.max(0, subtotal + shipping + tax - discount) : 0

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      itemCount: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    }
  },
}
