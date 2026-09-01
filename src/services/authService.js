// Service abstraction for Authentication
import { currentUser } from '../data/store'

export const authService = {
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error('Please enter both email and password'))
          return
        }
        if (password.length < 6) {
          reject(new Error('Password must be at least 6 characters'))
          return
        }

        const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        const user = {
          id: `usr_${Date.now()}`,
          name: nameFromEmail || 'Alex Johnson',
          email,
          avatar: '/public/IMG_9021.jpeg',
          phone: '+1 (555) 234-5678',
          createdAt: '2025-01-15',
          rewardPoints: 1250,
        }
        resolve(user)
      }, 200)
    })
  },

  async register(name, email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password) {
          reject(new Error('Please fill in all required fields'))
          return
        }
        const user = {
          id: `usr_${Date.now()}`,
          name,
          email,
          avatar: '/public/IMG_9021.jpeg',
          phone: '',
          createdAt: new Date().toISOString().split('T')[0],
          rewardPoints: 100, // Welcome bonus
        }
        resolve(user)
      }, 200)
    })
  },

  async forgotPassword(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Password reset link sent to ${email}` })
      }, 200)
    })
  },

  async resetPassword(token, newPassword) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Password has been successfully updated.' })
      }, 200)
    })
  },

  async getCurrentUser() {
    return Promise.resolve(currentUser.value)
  },
}
