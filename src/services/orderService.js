// Service abstraction for Orders & Tracking
import { orders } from '../data/store'

export const orderService = {
  async createOrder(orderPayload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomNum = Math.floor(100000 + Math.random() * 900000)
        const orderId = `TN-2026-${randomNum}`
        const trackingNum = `TN-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`

        const newOrder = {
          id: orderId,
          trackingNumber: trackingNum,
          carrier: 'FedEx Express / DHL',
          date: new Date().toISOString().split('T')[0],
          status: 'Processing',
          statusTimeline: [
            { title: 'Order Placed', time: 'Just now', completed: true, current: false },
            { title: 'Payment Confirmed', time: 'Just now', completed: true, current: false },
            { title: 'Processing', time: 'In progress', completed: true, current: true },
            { title: 'Shipped', time: 'Estimated 1-2 days', completed: false, current: false },
            { title: 'Out for Delivery', time: 'Pending', completed: false, current: false },
            { title: 'Delivered', time: 'Pending', completed: false, current: false },
          ],
          ...orderPayload,
        }

        orders.value.unshift(newOrder)
        resolve(newOrder)
      }, 300)
    })
  },

  async getOrderById(id) {
    return new Promise((resolve, reject) => {
      const order = orders.value.find((o) => o.id.toLowerCase() === String(id).toLowerCase() || o.trackingNumber.toLowerCase() === String(id).toLowerCase())
      if (order) {
        resolve(order)
      } else {
        reject(new Error(`Order ${id} not found`))
      }
    })
  },

  async cancelOrder(id) {
    return new Promise((resolve, reject) => {
      const order = orders.value.find((o) => o.id === id)
      if (order) {
        order.status = 'Cancelled'
        resolve(order)
      } else {
        reject(new Error('Order not found'))
      }
    })
  },
}
