// Service abstraction for Products (ready to replace with Laravel REST API)
import { allProducts, categories, brands } from '../data/store'

export const productService = {
  async getProducts(params = {}) {
    // Simulated network latency
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...allProducts]

        if (params.category && params.category !== 'all') {
          results = results.filter((p) => p.category === params.category)
        }

        if (params.brand && params.brand !== 'all') {
          results = results.filter((p) => p.brand.toLowerCase() === params.brand.toLowerCase())
        }

        if (params.minPrice) {
          results = results.filter((p) => p.price >= params.minPrice)
        }

        if (params.maxPrice) {
          results = results.filter((p) => p.price <= params.maxPrice)
        }

        if (params.minRating) {
          results = results.filter((p) => p.rating >= params.minRating)
        }

        if (params.inStockOnly) {
          results = results.filter((p) => p.inStock)
        }

        if (params.onSaleOnly) {
          results = results.filter((p) => p.originalPrice && p.originalPrice > p.price)
        }

        if (params.query) {
          const q = params.query.toLowerCase().trim()
          results = results.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
          )
        }

        if (params.sortBy) {
          switch (params.sortBy) {
            case 'price-low':
              results.sort((a, b) => a.price - b.price)
              break
            case 'price-high':
              results.sort((a, b) => b.price - a.price)
              break
            case 'rating':
              results.sort((a, b) => b.rating - a.rating)
              break
            case 'newest':
              results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
              break
            case 'popular':
              results.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
              break
            case 'discount':
              results.sort((a, b) => {
                const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0
                const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0
                return discB - discA
              })
              break
            default:
              // featured
              break
          }
        }

        resolve({
          data: results,
          total: results.length,
        })
      }, 50)
    })
  },

  async getProductById(id) {
    return new Promise((resolve, reject) => {
      const numId = Number(id)
      const product = allProducts.find((p) => p.id === numId || p.slug === String(id))
      if (product) {
        resolve(product)
      } else {
        reject(new Error(`Product with ID ${id} not found`))
      }
    })
  },

  async getCategories() {
    return Promise.resolve(categories)
  },

  async getBrands() {
    return Promise.resolve(brands)
  },

  async getRecommendations(productId, category, limit = 4) {
    const currentId = Number(productId)
    const matches = allProducts.filter((p) => p.id !== currentId && p.category === category)
    const fallbacks = allProducts.filter((p) => p.id !== currentId && p.category !== category)
    return Promise.resolve([...matches, ...fallbacks].slice(0, limit))
  },
}
