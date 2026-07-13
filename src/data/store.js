import { computed, ref } from 'vue'

export const stats = [
  ['500+', 'Products'],
  ['24/7', 'Support'],
  ['10k+', 'Customers'],
  ['4.9', 'Reviews'],
]

export const products = [
  ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80', 'Gaming Laptop', 'High-performance laptop for gaming and development', '$1200'],
  ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80', 'Smartphone Pro', 'Flagship phone with AI camera and OLED display', '$899'],
  ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80', 'Smart Watch', 'Track fitness, health, and notifications in real time', '$199'],
  ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80', 'Wireless Headphones', 'Noise cancellation with immersive sound quality', '$149'],
  ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80', '4K Monitor', 'Ultra HD display for designers and developers', '$399'],
  ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80', 'Mechanical Keyboard', 'RGB backlit keyboard with smooth typing experience', '$89'],
]

export const features = [
  ['bolt', 'Fast Performance', 'Experience lightning-fast devices built for modern productivity.'],
  ['lock', 'Secure Devices', 'Advanced security and privacy protection for your digital life.'],
  ['truck', 'Fast Delivery', 'Get your technology products delivered quickly and safely.'],
]

export const cartItems = ref([
  { name: 'Gaming Laptop', detail: 'Intel i7, RTX graphics, 16GB RAM', price: 1200, quantity: 1, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80' },
  { name: 'Smart Watch', detail: 'Health tracking with AMOLED display', price: 199, quantity: 2, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' },
  { name: 'Wireless Headphones', detail: 'Noise cancelling, 32-hour battery', price: 149, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80' },
])

export const favorites = ref(new Set())
export const shipping = 24
export const discount = 40
export const cartCount = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0))
export const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
export const total = computed(() => subtotal.value + shipping - discount)
export const year = new Date().getFullYear()

export const formatPrice = (value) => new Intl.NumberFormat('en-US').format(value)

export const toggleFavorite = (name) => {
  const nextFavorites = new Set(favorites.value)
  nextFavorites.has(name) ? nextFavorites.delete(name) : nextFavorites.add(name)
  favorites.value = nextFavorites
}

export const addToCart = ([image, name, detail, price]) => {
  const cartItem = cartItems.value.find((item) => item.name === name)

  if (cartItem) {
    cartItem.quantity += 1
    return
  }

  cartItems.value.push({
    name,
    detail,
    price: Number(price.replace(/[^0-9.]/g, '')),
    quantity: 1,
    image: image.replace('w=700', 'w=500'),
  })
}
