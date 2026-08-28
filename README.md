# TechNova — Modern Electronics E-Commerce Platform

TechNova is a full-featured, production-ready electronics e-commerce single-page application (SPA) built with **Vue 3 (Composition API)**, **Vite**, and **Tailwind CSS**. It follows a **clean, simple, and standard modern e-commerce UI design** with dedicated SVG vector icons, real-time client-side state management, and LocalStorage persistence.

---

## Key Features

### 1. Catalog & Product Discovery
* **Interactive Catalog**: Browse electronics across categories (*Laptops & MacBooks*, *Smartphones*, *Audio & Sound*, *Monitors & Displays*, *Accessories*, *Smart Watches*).
* **Multi-Attribute Filtering**: Filter dynamically by Category, Brand (Apple, Sony, Dell, Samsung, LG, Keychron, Logitech, Bose), Price Range slider, and Customer Star Ratings.
* **Sorting & Views**: Sort by *Featured*, *Price (Low to High)*, *Price (High to Low)*, *Customer Rating*, *Newest Arrivals*, and *Discount Percentage*. Toggle between Grid and List views.
* **Instant Search & Autocomplete**: Real-time autocomplete suggestions for matching products, popular categories, and recent search history with quick clear.
* **Flash Deals & Promotions Hub**: 24-hour countdown timers, active coupon codes (*TECH10*, *SAVE20*, *WELCOME15*, *FREESHIP*, *FLASH50*) with one-click copy.

### 2. Product Details & Comparison
* **Product Detail Page**: Interactive image gallery with thumbnail switcher, color & storage variant selection, stock status badges, and price comparison displays.
* **Technical Hardware Specifications**: Structured hardware spec tables (Display, Processor, Memory, Storage, Battery, Ports, Weight).
* **Ratings & Customer Reviews**: Star breakdown distribution (5 Star to 1 Star), verified buyer badges, review sorting (*Most Recent*, *Most Helpful*, *Highest/Lowest*), helpful upvoting, and an interactive review submission modal.
* **Side-by-Side Comparison**: Compare up to 4 devices simultaneously across hardware specs, dimensions, battery life, warranties, and pricing.
* **Price Drop Alerts**: Subscribe to instant price drop alerts for any catalog item.

### 3. Cart, Wishlist & Seamless Checkout
* **Slide-over Cart Drawer & Full Cart View**: Real-time quantity adjustments, item removals, free shipping threshold progress bar ($100+), and "Save for Later" shelf.
* **Promo Coupons & Discounts**: Real-time voucher calculation supporting flat and percentage-based discounts.
* **Multi-Step Checkout Flow**:
  1. *Customer Information* (Contact details & express autofill).
  2. *Shipping Method* (Standard, Priority Express, Overnight).
  3. *Payment Method* (Credit Card, PayPal, Cash on Delivery, Bank Transfer).
  4. *Order Review & Confirmation*.
* **Wishlist Hub**: Saved items grid with one-click "Move All to Cart" and shareable wishlist link.

### 4. User Account & Order Management
* **Account Dashboard**: Metric overview cards (Total Orders, Saved Wishlist, Unread Alerts, VIP Reward Points).
* **Order History & Live Tracking**: Real-time order timeline tracker (*Placed*, *Payment Confirmed*, *Processing*, *Shipped with FedEx*, *Out for Delivery*, *Delivered*), printable invoice receipt, and one-click reordering.
* **Address Book**: Multi-address management with Add/Edit modal, label categories (Home, Office), and primary default address toggle.
* **Notification Center**: Filtered alerts by category (*Orders*, *Promotions*, *Price Drops*) with mark-as-read functionality.
* **Security & Settings**: Password management, two-factor authentication toggle, session activity log, and localization preferences.

---

## UI & Design System

* **Clean E-Commerce Standard**: Built with a simple white background, soft slate borders (`border-gray-200`), neutral gray surfaces (`bg-gray-50`), and high-contrast typography.
* **100% Vector SVG Icon System**: Powered by a custom `AppIcon.vue` component providing crisp vector icons with zero emoji dependencies.
* **Responsive Layout**: Fluid experience tailored for mobile devices, tablets, laptops, and ultra-wide desktop monitors.
* **Toast & Modal Feedback**: Non-intrusive action feedback toasts for cart additions, wishlist updates, and coupon applications.

---

## Tech Stack

* **Framework**: Vue 3 (Composition API with `<script setup>`)
* **Build Tool**: Vite
* **Styling**: Tailwind CSS v4
* **State Management**: Reactive store with Vue 3 `ref`, `computed`, `watch`, and `localStorage` persistence
* **Routing**: Lightweight, reactive SPA client-side view switcher
* **Fonts & Icons**: Inter typography & bespoke inline SVG vector icon library

---

## Project Structure

```text
shop_frontend/
├── index.html                   # Entry HTML with Inter font & viewport meta
├── package.json                 # Project dependencies and npm scripts
├── vite.config.js               # Vite build configuration
├── src/
│   ├── App.vue                  # Main application container & view router
│   ├── main.js                  # Application bootstrap
│   ├── assets/
│   │   └── main.css             # Tailwind CSS imports & base styles
│   ├── data/
│   │   └── store.js             # Global reactive state, actions & catalog data
│   ├── services/
│   │   └── productService.js    # Data access service layer
│   ├── components/
│   │   ├── AppHeader.vue        # Top utility bar
│   │   ├── AppNavbar.vue        # Main navigation header & live search
│   │   ├── AppFooter.vue        # Comprehensive footer & trust value props
│   │   ├── AppIcon.vue          # Central vector SVG icon component
│   │   ├── ProductCard.vue      # Reusable standard product card
│   │   ├── ProductFilters.vue   # Category, brand, price & rating filters
│   │   ├── ProductGallery.vue   # Image gallery with zoom & thumbnail selector
│   │   ├── ProductRating.vue    # Star ratings & review stars
│   │   ├── CartDrawer.vue       # Slide-over quick cart drawer
│   │   ├── SearchAutocomplete.vue # Live instant search dropdown
│   │   ├── NotificationPanel.vue# Header notification flyout
│   │   ├── CountdownTimer.vue   # Deal countdown clock
│   │   ├── ToastContainer.vue   # System toast alert notifications
│   │   ├── Modal.vue            # Accessible modal dialog
│   │   └── EmptyState.vue       # Standard empty state layout
│   └── views/
│       ├── WelcomeView.vue      # Home view (Hero, Categories, Flash Deals)
│       ├── ShopView.vue         # Catalog view with full filter sidebar
│       ├── ProductDetailView.vue# Detailed product view & review hub
│       ├── DealsView.vue        # Promotions & coupon vouchers
│       ├── CompareView.vue      # Product comparison table
│       ├── SearchView.vue       # Search results view
│       ├── NotFoundView.vue     # 404 error page
│       ├── cart/
│       │   ├── CartView.vue         # Full shopping cart
│       │   ├── CheckoutView.vue     # 4-step checkout flow
│       │   └── OrderSuccessView.vue # Order confirmation & invoice receipt
│       ├── orders/
│       │   ├── OrderHistoryView.vue # List of past purchases
│       │   ├── OrderDetailView.vue  # Full order receipt details
│       │   └── OrderTrackingView.vue# Live shipping timeline tracker
│       ├── wishlist/
│       │   └── WishlistView.vue     # Saved items grid
│       ├── account/
│       │   ├── AccountView.vue      # User hub dashboard
│       │   ├── ProfileView.vue      # Profile information editor
│       │   ├── AddressBookView.vue  # Saved addresses manager
│       │   ├── ReviewsView.vue      # User's submitted reviews
│       │   ├── NotificationsView.vue# Notification center
│       │   ├── SecurityView.vue     # Password & 2FA settings
│       │   └── SettingsView.vue     # Regional & email preferences
│       └── auth/
│           ├── LoginView.vue
│           ├── RegisterView.vue
│           ├── ForgotPasswordView.vue
│           └── ResetPasswordView.vue
```

---

## Getting Started

### Prerequisites
* Node.js (version 18.0.0 or higher recommended)
* npm (included with Node.js)

### Installation
1. Clone the repository or navigate to the project directory:
   ```sh
   cd shop_frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

4. Build for production:
   ```sh
   npm run build
   ```

---

## License
This project is for demonstration and commercial portfolio purposes. All rights reserved.
