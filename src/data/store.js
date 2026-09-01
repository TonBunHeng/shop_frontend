import { computed, ref, watch } from 'vue'

// STORAGE VERSION & HELPERS
const STORAGE_VERSION = 1
const STORAGE_PREFIX = 'technova_'

const loadStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && parsed._v === STORAGE_VERSION) {
      return parsed.data
    }
    // Migration fallback for plain/unversioned items
    return parsed.data !== undefined ? parsed.data : parsed
  } catch (e) {
    return fallback
  }
}

const saveStorage = (key, value) => {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify({ _v: STORAGE_VERSION, data: value })
    )
  } catch (e) {
    // Graceful fallback if localStorage is full or disabled
  }
}

// 1. CATEGORIES
export const categories = [
  { id: 'all', name: 'All Products', icon: 'grid', count: 16, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80' },
  { id: 'laptops', name: 'Laptops & MacBooks', icon: 'laptop', count: 4, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80' },
  { id: 'smartphones', name: 'Smartphones', icon: 'smartphone', count: 3, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80' },
  { id: 'audio', name: 'Audio & Sound', icon: 'headphones', count: 3, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
  { id: 'wearables', name: 'Smart Watches', icon: 'watch', count: 2, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
  { id: 'displays', name: 'Monitors & Displays', icon: 'monitor', count: 2, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80' },
  { id: 'accessories', name: 'Keyboards & Gear', icon: 'keyboard', count: 2, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80' },
]

// 2. BRANDS
export const brands = [
  'All Brands',
  'Apple',
  'Sony',
  'Samsung',
  'Dell',
  'ASUS',
  'Bose',
  'Logitech',
  'LG',
  'Keychron',
]

// 3. PRODUCT CATALOG
export const allProducts = [
  {
    id: 1,
    sku: 'TN-LPT-M3MAX',
    name: 'MacBook Pro 16" M3 Max',
    slug: 'macbook-pro-16-m3-max',
    brand: 'Apple',
    category: 'laptops',
    tagline: 'Extreme power for pro creators, engineers & developers',
    price: 2499,
    originalPrice: 2699,
    discount: 7,
    rating: 4.9,
    reviewsCount: 142,
    stock: 14,
    stockStatus: 'In Stock',
    badge: 'BEST SELLER',
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isTrending: true,
    salesCount: 489,
    createdAt: '2025-11-01',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'The ultimate pro laptop featuring the revolutionary M3 Max chip with 16-core CPU, 40-core GPU, Liquid Retina XDR display with up to 1600 nits peak brightness, and up to 22 hours of battery life.',
    features: [
      'Apple M3 Max chip with 16-core CPU and 40-core GPU',
      '16.2-inch Liquid Retina XDR display (3456 x 2234) at 120Hz',
      '36GB Unified High-Speed Memory & 1TB Superfast SSD Storage',
      'Six-speaker high-fidelity sound system with Force-Cancelling Woofers',
      'MagSafe 3 charging port with 140W USB-C fast power adapter',
    ],
    specifications: {
      Display: '16.2" Liquid Retina XDR (120Hz ProMotion)',
      Processor: 'Apple M3 Max (16-core CPU, 40-core GPU)',
      Memory: '36GB Unified Memory',
      Storage: '1TB NVMe PCIe Gen 4 SSD',
      Battery: 'Up to 22 hours video playback',
      Weight: '2.14 kg (4.71 lbs)',
      Ports: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3',
      Warranty: '2-Year Official AppleCare Warranty',
    },
    variants: {
      colors: ['Space Black', 'Silver'],
      storage: ['1TB SSD', '2TB SSD', '4TB SSD'],
      ram: ['36GB', '64GB', '128GB'],
    },
    tags: ['laptop', 'apple', 'm3 max', 'developer', 'creator', 'macbook'],
    reviews: [
      { id: 101, author: 'David Chen', rating: 5, date: '2026-02-12', title: 'Unmatched performance for compiling', comment: 'Compiles large Rust and Next.js codebases in seconds. Fan rarely kicks on. Best laptop I have ever owned.', helpful: 34 },
      { id: 102, author: 'Sarah Jenkins', rating: 5, date: '2026-01-28', title: 'The Liquid Retina display is breathtaking', comment: 'Color grading 4K HDR footage on this screen is magnificent. Battery lasts through entire transatlantic flights.', helpful: 19 },
      { id: 103, author: 'Marcus Brody', rating: 4, date: '2026-01-14', title: 'Heavy but exceptionally fast', comment: 'It is a bit hefty compared to the 14-inch version, but the screen real estate and cooling are well worth it.', helpful: 8 },
    ],
  },
  {
    id: 2,
    sku: 'TN-PHN-IP16PM',
    name: 'iPhone 16 Pro Max Titanium',
    slug: 'iphone-16-pro-max-titanium',
    brand: 'Apple',
    category: 'smartphones',
    tagline: 'Aerospace-grade titanium with tactile Camera Control',
    price: 1199,
    originalPrice: 1299,
    discount: 8,
    rating: 4.9,
    reviewsCount: 320,
    stock: 24,
    stockStatus: 'In Stock',
    badge: 'HOT',
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    isTrending: true,
    salesCount: 840,
    createdAt: '2025-10-15',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Engineered with premium Grade 5 titanium, Super Retina XDR display, A18 Pro chip, groundbreaking 48MP Fusion camera system with 5x Telephoto zoom, and Camera Control button.',
    features: [
      'A18 Pro chip with 6-core GPU and Apple Intelligence engine',
      '6.9-inch Super Retina XDR OLED with Always-On & 120Hz ProMotion',
      '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto Optical Zoom',
      'All-day 33-hour video playback battery life with Qi2 wireless charging',
      'Action button & dedicated Camera Control sapphire tactile sensor',
    ],
    specifications: {
      Display: '6.9" Super Retina XDR OLED (2868 x 1320, 120Hz)',
      Processor: 'A18 Pro Bionic (3nm architecture)',
      Storage: '256GB / 512GB / 1TB',
      Camera: 'Triple 48MP + 48MP + 12MP 5x Optical',
      Battery: 'Up to 33 hours video playback',
      Weight: '227g (8.0 oz)',
      WaterResistance: 'IP68 (6m depth for up to 30 mins)',
      Warranty: '1-Year Limited Apple Warranty',
    },
    variants: {
      colors: ['Natural Titanium', 'Desert Titanium', 'White Titanium', 'Black Titanium'],
      storage: ['256GB', '512GB', '1TB'],
    },
    tags: ['smartphone', 'apple', 'iphone', '5g', 'camera', 'pro max'],
    reviews: [
      { id: 201, author: 'Elena Rostova', rating: 5, date: '2026-02-18', title: '5x camera zoom is phenomenal', comment: 'The zoom clarity and 4K 120fps video recording makes this feel like a cinema camera in your pocket.', helpful: 42 },
      { id: 202, author: 'Kevin Vance', rating: 5, date: '2026-02-05', title: 'Incredible battery longevity', comment: 'Easily getting 2 full days of moderate use on a single charge. Titanium feels silky and light.', helpful: 27 },
    ],
  },
  {
    id: 3,
    sku: 'TN-AUD-WH1000XM5',
    name: 'Sony WH-1000XM5 Wireless ANC',
    slug: 'sony-wh-1000xm5-wireless-anc',
    brand: 'Sony',
    category: 'audio',
    tagline: 'Industry-leading noise cancellation & LDAC Hi-Res sound',
    price: 349,
    originalPrice: 399,
    discount: 13,
    rating: 4.8,
    reviewsCount: 215,
    stock: 18,
    stockStatus: 'In Stock',
    badge: 'SALE',
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isTrending: true,
    salesCount: 620,
    createdAt: '2025-08-20',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'With dual processors controlling 8 microphones, Auto NC Optimizer, and specially designed 30mm driver unit, these headphones redefine distraction-free listening and ultra-clear hands-free calls.',
    features: [
      'Industry-leading noise cancellation with Integrated Processor V1',
      'Crystal-clear hands-free calling with 4 beamforming mics and AI voice pickup',
      'Up to 30 hours battery life with quick charging (3 min charge = 3 hours playback)',
      'Multipoint connection allows seamless switching between 2 Bluetooth devices',
      'Intuitive touch sensor controls for playback, volume, and Speak-to-Chat',
    ],
    specifications: {
      Driver: '30mm High-Resolution Carbon Fiber Unit',
      Battery: '30 hours (ANC On), 40 hours (ANC Off)',
      Connectivity: 'Bluetooth 5.2, 3.5mm Aux, LDAC, AAC, SBC',
      Weight: '250g (8.8 oz)',
      Charging: 'USB-C Fast Charging (3.5h for full charge)',
      Warranty: '1-Year Sony Official Warranty',
    },
    variants: {
      colors: ['Silver Grey', 'Midnight Black', 'Midnight Blue'],
    },
    tags: ['audio', 'sony', 'headphones', 'anc', 'wireless', 'noise cancelling'],
    reviews: [
      { id: 301, author: 'Bryan O’Connor', rating: 5, date: '2026-02-01', title: 'Silences plane and office noise completely', comment: 'Airplane cabin drone disappears instantly. Comfortable enough to wear all workday.', helpful: 31 },
    ],
  },
  {
    id: 4,
    sku: 'TN-WAT-AWU2',
    name: 'Apple Watch Ultra 2 GPS + Cellular',
    slug: 'apple-watch-ultra-2-gps-cellular',
    brand: 'Apple',
    category: 'wearables',
    tagline: 'The ultimate sports, diving & expedition smartwatch',
    price: 749,
    originalPrice: 799,
    discount: 6,
    rating: 4.9,
    reviewsCount: 98,
    stock: 8,
    stockStatus: 'Only 8 left',
    badge: 'TOP RATED',
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    isTrending: false,
    salesCount: 310,
    createdAt: '2025-11-10',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Rugged 49mm titanium case, brightest Apple display ever at 3000 nits, precision dual-frequency GPS, customizable Action button, and 36-hour battery life for extreme exploration.',
    features: [
      'S9 SiP chip with Double Tap gesture and on-device Siri',
      '49mm aerospace-grade titanium case with raised sapphire front crystal',
      '3000 nits peak brightness with Night Mode automatic activation',
      'Water resistance to 100m with EN13319 dive computer certification',
      'Dual-frequency GPS for precision distance, pace, and route maps',
    ],
    specifications: {
      CaseSize: '49mm Aerospace Titanium',
      Display: 'Always-On Retina OLED (3000 nits peak)',
      Battery: '36 hours normal, 72 hours in Low Power Mode',
      Connectivity: 'LTE Cellular, Wi-Fi, Bluetooth 5.3, UWB Gen 2',
      WaterResistance: '100m Water Resistant, 40m Recreational Dive',
      Weight: '61.4g',
      Warranty: '2-Year Manufacturer Warranty',
    },
    variants: {
      colors: ['Natural Titanium - Alpine Loop', 'Black Titanium - Ocean Band', 'Trail Loop Grey'],
    },
    tags: ['watch', 'wearable', 'apple', 'gps', 'ultra', 'fitness', 'diving'],
    reviews: [
      { id: 401, author: 'Rachel Torres', rating: 5, date: '2026-01-20', title: 'Marathon training essential', comment: 'Battery lasts for entire 50k trail runs with GPS and music playing. Sapphire glass has zero scratches.', helpful: 15 },
    ],
  },
  {
    id: 5,
    sku: 'TN-DSP-DELLU2724D',
    name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
    slug: 'dell-ultrasharp-27-4k-usb-c-monitor',
    brand: 'Dell',
    category: 'displays',
    tagline: 'IPS Black technology with 98% DCI-P3 & 90W Power Delivery',
    price: 549,
    originalPrice: 629,
    discount: 12,
    rating: 4.8,
    reviewsCount: 76,
    stock: 11,
    stockStatus: 'In Stock',
    badge: 'POPULAR',
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    isTrending: true,
    salesCount: 410,
    createdAt: '2025-07-12',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Experience stunning color depth and deeper blacks with revolutionary IPS Black technology. Features 4K resolution, 90W USB-C power delivery, RJ45 Ethernet, and Daisy Chain support.',
    features: [
      '27-inch 4K UHD (3840 x 2160) IPS Black Panel with 2000:1 Contrast',
      '98% DCI-P3 and 100% sRGB color gamut calibrated at deltaE < 2',
      'Single-cable USB-C hub with 90W charging and 2.5Gbps RJ45 LAN',
      'Auto KVM switch allows controlling 2 PCs with single keyboard/mouse',
      'ComfortView Plus reduces blue light without degrading color accuracy',
    ],
    specifications: {
      ScreenSize: '27-inch IPS Black (3840 x 2160 @ 60Hz)',
      ContrastRatio: '2000:1 Static Contrast',
      Brightness: '400 cd/m² (VESA DisplayHDR 400)',
      Ports: 'USB-C (90W PD), DisplayPort 1.4, HDMI 2.0, RJ45, 4x USB-A',
      Adjustability: 'Height, Pivot (90°), Swivel, Tilt',
      Warranty: '3-Year Advanced Exchange Service',
    },
    variants: {
      colors: ['Platinum Silver'],
      size: ['27-inch 4K', '32-inch 4K'],
    },
    tags: ['monitor', 'dell', '4k', 'display', 'usb-c', 'ultrasharp', 'creator'],
    reviews: [
      { id: 501, author: 'Liam Wright', rating: 5, date: '2026-02-10', title: 'Crisp text and flawless USB-C dock', comment: 'Connected to my MacBook with one cable. Power, display, and Ethernet all work through one cord.', helpful: 22 },
    ],
  },
  {
    id: 6,
    sku: 'TN-ACC-LOGIMX3S',
    name: 'Logitech MX Master 3S Wireless Mouse',
    slug: 'logitech-mx-master-3s-wireless-mouse',
    brand: 'Logitech',
    category: 'accessories',
    tagline: 'Quiet clicks & MagSpeed electromagnetic scrolling with 8K DPI',
    price: 99,
    originalPrice: 119,
    discount: 16,
    rating: 4.9,
    reviewsCount: 450,
    stock: 35,
    stockStatus: 'In Stock',
    badge: 'BEST SELLER',
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isTrending: false,
    salesCount: 1200,
    createdAt: '2025-06-01',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'An icon remastered. With Quiet Clicks and 8,000 DPI track-on-glass sensor, the MX Master 3S delivers precision, tactile feel, and silent performance for demanding workflows.',
    features: [
      '8,000 DPI Darkfield optical sensor tracks on glass surfaces',
      'Quiet Click buttons reduce 90% click noise while preserving tactile feel',
      'MagSpeed electromagnetic scroll wheel scrolls 1,000 lines in 1 second',
      'Logitech Flow allows transferring files and cursor across 3 computers',
      'USB-C quick charge provides 3 hours use from 1-minute charge',
    ],
    specifications: {
      Sensor: '8,000 DPI Optical (Darkfield)',
      Battery: 'Up to 70 days on full charge (USB-C)',
      Connectivity: 'Bluetooth Low Energy & Logi Bolt USB Receiver',
      Weight: '141g (4.97 oz)',
      Buttons: '7 customizable buttons + gesture button + thumb wheel',
      Warranty: '2-Year Official Logitech Warranty',
    },
    variants: {
      colors: ['Graphite Black', 'Pale Grey', 'Space Black'],
    },
    tags: ['mouse', 'logitech', 'mx master', 'ergonomic', 'bluetooth', 'gear'],
    reviews: [
      { id: 601, author: 'Samantha Miller', rating: 5, date: '2026-02-14', title: 'The thumb wheel is game changing', comment: 'Horizontal scrolling on timelines and spreadsheets is so smooth. Hand fatigue eliminated.', helpful: 50 },
    ],
  },
  {
    id: 7,
    sku: 'TN-ACC-KEYQ1PRO',
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    slug: 'keychron-q1-pro-wireless-custom-keyboard',
    brand: 'Keychron',
    category: 'accessories',
    tagline: 'Full aluminum body, hot-swappable switches & QMK/VIA support',
    price: 199,
    originalPrice: 229,
    discount: 13,
    rating: 4.8,
    reviewsCount: 89,
    stock: 5,
    stockStatus: 'Only 5 left',
    badge: 'EXCLUSIVE',
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    isTrending: true,
    salesCount: 220,
    createdAt: '2025-11-25',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'A 75% layout wireless custom mechanical keyboard crafted from solid CNC machined aluminum. Features double-gasket design, Bluetooth 5.1, programmable rotary knob, and South-facing RGB.',
    features: [
      'Solid 6063 full CNC aluminum machined body with anodized finish',
      'Double-gasket mount structure for flexible and acoustic typing sound',
      'Wireless Bluetooth 5.1 & Type-C wired mode with 1000Hz polling rate',
      'Fully customizable key remapping with open-source QMK/VIA software',
      'Hot-swappable PCB supports 3-pin and 5-pin MX mechanical switches',
    ],
    specifications: {
      Layout: '75% Compact (81 Keys + Programmable Knob)',
      SwitchOptions: 'Keychron K Pro Red (Linear) / Brown (Tactile) / Banana',
      BodyMaterial: 'Full CNC Machined Aluminum',
      Battery: '4000 mAh Rechargeable (Up to 300h without RGB)',
      Weight: '1.73 kg (3.8 lbs)',
      Warranty: '1-Year Limited Warranty',
    },
    variants: {
      colors: ['Carbon Black', 'Silver Grey', 'Shell White'],
      switches: ['K Pro Red (Linear)', 'K Pro Brown (Tactile)', 'K Pro Banana (Early Bump)'],
    },
    tags: ['keyboard', 'mechanical', 'keychron', 'wireless', 'custom', 'rgb', 'aluminum'],
    reviews: [
      { id: 701, author: 'Alex Turner', rating: 5, date: '2026-01-30', title: 'Thocky sound out of the box', comment: 'The double gasket dampening makes typing feel cushioned and sound premium. Heavy aluminum tank.', helpful: 18 },
    ],
  },
  {
    id: 8,
    sku: 'TN-LPT-DELLXPS16',
    name: 'Dell XPS 16 4K OLED (Intel Core Ultra 9)',
    slug: 'dell-xps-16-4k-oled-intel-ultra-9',
    brand: 'Dell',
    category: 'laptops',
    tagline: 'Futuristic seamless glass touchpad & NVIDIA RTX 4070 Graphics',
    price: 2399,
    originalPrice: 2599,
    discount: 7,
    rating: 4.7,
    reviewsCount: 65,
    stock: 6,
    stockStatus: 'Low Stock',
    badge: 'LIMITED',
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    isTrending: false,
    salesCount: 190,
    createdAt: '2025-10-01',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Iconic design with CNC machined aluminum, Gorilla Glass 3 palm rest with seamless invisible glass touchpad, capacitive touch function row, and vibrant 4K OLED InfinityEdge touchscreen.',
    features: [
      'Intel Core Ultra 9 185H processor with integrated AI NPU engine',
      '16.3-inch 4K+ (3840 x 2400) OLED InfinityEdge 100% DCI-P3 touchscreen',
      'NVIDIA GeForce RTX 4070 (8GB GDDR6) dedicated graphics',
      '32GB LPDDR5x 7467MHz Dual Channel RAM & 1TB Gen4 SSD',
      'Quad-speaker design with 10W total peak output and Waves MaxxAudio',
    ],
    specifications: {
      Display: '16.3" 4K+ OLED Touch (3840 x 2400, 400 nits, 90Hz)',
      Processor: 'Intel Core Ultra 9 185H (16 cores, up to 5.1GHz)',
      Graphics: 'NVIDIA RTX 4070 Laptop GPU 8GB',
      Memory: '32GB LPDDR5x 7467MHz',
      Storage: '1TB M.2 PCIe NVMe SSD',
      Weight: '2.13 kg (4.7 lbs)',
      Warranty: '2-Year Premium Onsite Support',
    },
    variants: {
      colors: ['Platinum Silver', 'Graphite'],
      storage: ['1TB SSD', '2TB SSD'],
    },
    tags: ['laptop', 'dell', 'xps', 'oled', 'rtx 4070', 'windows', 'intel'],
    reviews: [
      { id: 801, author: 'Daniel Craig', rating: 5, date: '2026-02-09', title: 'The OLED screen is sensational', comment: 'Infinite contrast and stunning HDR colors. Handles 3D rendering and Adobe Premiere smoothly.', helpful: 12 },
    ],
  },
  {
    id: 9,
    sku: 'TN-PHN-SGS24U',
    name: 'Samsung Galaxy S24 Ultra Titanium',
    slug: 'samsung-galaxy-s24-ultra-titanium',
    brand: 'Samsung',
    category: 'smartphones',
    tagline: 'Galaxy AI with 200MP camera, titanium frame & built-in S-Pen',
    price: 1299,
    originalPrice: 1419,
    discount: 8,
    rating: 4.8,
    reviewsCount: 290,
    stock: 20,
    stockStatus: 'In Stock',
    badge: 'HOT',
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    isTrending: true,
    salesCount: 780,
    createdAt: '2025-05-15',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Meet Galaxy S24 Ultra with titanium frame, flat 6.8-inch Dynamic AMOLED 2X display with anti-reflective Corning Gorilla Armor, 200MP camera, Snapdragon 8 Gen 3, and integrated S-Pen stylus.',
    features: [
      'Snapdragon 8 Gen 3 for Galaxy processor with Ray Tracing support',
      '6.8-inch QHD+ 120Hz AMOLED display with 2600 nits peak brightness',
      '200MP Wide + 50MP 5x Optical + 10MP 3x Optical + 12MP Ultra Wide',
      'Galaxy AI: Live Translate, Circle to Search, Photo Assist & Transcript Assist',
      'Built-in S-Pen stylus for precision handwriting, sketching, and remote camera control',
    ],
    specifications: {
      Display: '6.8" Dynamic AMOLED 2X (3120 x 1440, 1-120Hz LTPO)',
      Processor: 'Qualcomm Snapdragon 8 Gen 3 (4nm)',
      Camera: 'Quad 200MP + 50MP + 10MP + 12MP (8K Video)',
      Battery: '5000 mAh with 45W Fast Charging',
      Weight: '232g (8.18 oz)',
      WaterResistance: 'IP68 Dust and Water Resistant',
      Warranty: '1-Year Official Samsung Warranty',
    },
    variants: {
      colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow'],
      storage: ['256GB', '512GB', '1TB'],
    },
    tags: ['smartphone', 'samsung', 'galaxy', 's24 ultra', 'android', 'ai', 'spen'],
    reviews: [
      { id: 901, author: 'Carlos Mendez', rating: 5, date: '2026-01-19', title: 'Gorilla Armor anti-reflection is unbelievable', comment: 'Using this outside in direct sunlight is so much clearer than any other phone. S-Pen is unmatched.', helpful: 29 },
    ],
  },
  {
    id: 10,
    sku: 'TN-AUD-BOSEQCULTRA',
    name: 'Bose QuietComfort Ultra Headphones',
    slug: 'bose-quietcomfort-ultra-headphones',
    brand: 'Bose',
    category: 'audio',
    tagline: 'World-class noise cancellation & revolutionary Bose Immersive Audio',
    price: 379,
    originalPrice: 429,
    discount: 11,
    rating: 4.8,
    reviewsCount: 160,
    stock: 14,
    stockStatus: 'In Stock',
    badge: 'POPULAR',
    isFeatured: false,
    isBestSeller: true,
    isNew: true,
    isTrending: false,
    salesCount: 390,
    createdAt: '2025-09-10',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'CustomTune technology personalizes sound to your ear shape. Immersive Audio Spatialized Sound puts music right in front of you. Plush luxury leatherette ear cushions for all-day comfort.',
    features: [
      'CustomTune audio technology automatically adapts noise cancelling to ear profile',
      'Bose Immersive Audio spatializes stereo content for ultra-realistic soundstage',
      'Quiet Mode, Aware Mode, and Immersion Mode with ActiveSense technology',
      'Up to 24 hours battery life (up to 18 hours with Immersive Audio active)',
      'Wind-block microphones filter environmental gusts during phone calls',
    ],
    specifications: {
      Battery: 'Up to 24 hours (USB-C quick charge: 15 mins = 2.5 hours)',
      Bluetooth: 'Bluetooth 5.3 with Snapdragon Sound (aptX Adaptive)',
      Weight: '252g (8.9 oz)',
      Warranty: '1-Year Bose Official Warranty',
    },
    variants: {
      colors: ['Black', 'White Smoke', 'Sandstone Gold'],
    },
    tags: ['audio', 'bose', 'headphones', 'anc', 'spatial audio', 'wireless'],
    reviews: [
      { id: 1001, author: 'Emma Watson', rating: 5, date: '2026-02-11', title: 'Unrivaled comfort for long flights', comment: 'Ear cushions are like clouds. Immersive audio makes acoustic tracks feel like a live private concert.', helpful: 26 },
    ],
  },
  {
    id: 11,
    sku: 'TN-DSP-LG34OLED',
    name: 'LG UltraGear 34" Curved WQHD OLED Gaming Monitor (240Hz)',
    slug: 'lg-ultragear-34-curved-oled-gaming-monitor',
    brand: 'LG',
    category: 'displays',
    tagline: '0.03ms response time, 800R curve & DisplayHDR True Black 400',
    price: 899,
    originalPrice: 1099,
    discount: 18,
    rating: 4.9,
    reviewsCount: 112,
    stock: 4,
    stockStatus: 'Only 4 left',
    badge: 'SALE',
    isFeatured: true,
    isBestSeller: false,
    isNew: false,
    isTrending: true,
    salesCount: 280,
    createdAt: '2025-08-01',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Immerse in gaming reality with a 34-inch 800R curved OLED display, lightning-fast 240Hz refresh rate, 0.03ms (GtG) response time, and NVIDIA G-SYNC Compatible certification.',
    features: [
      '34-inch Curved (800R) UltraWide QHD (3440 x 1440) OLED Panel',
      'Blazing 240Hz refresh rate and ultra-low 0.03ms GtG response time',
      '1,500,000:1 Contrast Ratio with VESA DisplayHDR True Black 400',
      'NVIDIA G-SYNC Compatible & AMD FreeSync Premium Pro',
      'Anti-glare & low reflection coating with Hexagon RGB backlighting',
    ],
    specifications: {
      ScreenSize: '34" Curved 21:9 UltraWide OLED (3440 x 1440)',
      RefreshRate: '240Hz with 0.03ms response time',
      Curvature: '800R Dramatic Immersion',
      Ports: '2x HDMI 2.1, 1x DisplayPort 1.4, 2x USB 3.0 Up/Downstream',
      Warranty: '2-Year OLED Burn-In Coverage Included',
    },
    variants: {
      colors: ['Matte Stealth Grey'],
    },
    tags: ['monitor', 'gaming', 'lg', 'oled', 'ultrawide', '240hz', 'curved'],
    reviews: [
      { id: 1101, author: 'Tyler Harrison', rating: 5, date: '2026-02-15', title: 'Zero ghosting and pure inky blacks', comment: 'Cyberpunk and competitive FPS titles look mind-blowing. The 800R curve wraps perfectly around field of view.', helpful: 38 },
    ],
  },
  {
    id: 12,
    sku: 'TN-LPT-ASUSZEPH',
    name: 'ASUS ROG Zephyrus G16 OLED Gaming Laptop',
    slug: 'asus-rog-zephyrus-g16-oled-gaming-laptop',
    brand: 'ASUS',
    category: 'laptops',
    tagline: 'Ultra-thin CNC aluminum gaming beast with RTX 4080 & 2.5K OLED',
    price: 2199,
    originalPrice: 2399,
    discount: 8,
    rating: 4.8,
    reviewsCount: 84,
    stock: 7,
    stockStatus: 'In Stock',
    badge: 'NEW',
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    isTrending: true,
    salesCount: 210,
    createdAt: '2026-01-05',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Precision crafted from single-block aluminum with customizable Slash Lighting array. Combines Intel Core Ultra 9 AI processor, NVIDIA GeForce RTX 4080, and ROG Nebula OLED display in a 1.85kg chassis.',
    features: [
      'ROG Nebula 16-inch 2.5K (2560 x 1600) 240Hz 0.2ms OLED display',
      'Intel Core Ultra 9 185H & NVIDIA RTX 4080 (12GB GDDR6)',
      'ROG Intelligent Cooling with vapor chamber and 2nd Gen Arc Flow Fans',
      'CNC Aluminum luxury unibody under 1.49cm thin and 1.85kg light',
      'Wi-Fi 7 ready, Thunderbolt 4, SD Card reader, and 100W USB-C charging',
    ],
    specifications: {
      Display: '16" 2.5K OLED (240Hz / 0.2ms / G-Sync / 500 nits)',
      Processor: 'Intel Core Ultra 9 185H AI Processor',
      Graphics: 'NVIDIA GeForce RTX 4080 Laptop GPU 12GB',
      Memory: '32GB LPDDR5X 7467MHz',
      Storage: '2TB PCIe 4.0 NVMe M.2 SSD',
      Weight: '1.85 kg (4.08 lbs)',
      Warranty: '2-Year ASUS Global Warranty',
    },
    variants: {
      colors: ['Eclipse Gray', 'Platinum White'],
    },
    tags: ['laptop', 'asus', 'rog', 'gaming', 'oled', 'rtx 4080', 'intel'],
    reviews: [
      { id: 1201, author: 'Jordan Reed', rating: 5, date: '2026-02-04', title: 'Thin as a MacBook, games like a desktop', comment: 'Plays all AAA games at 2.5K max settings with 100+ FPS. The OLED screen makes colors pop.', helpful: 20 },
    ],
  },
]

// 4. BUNDLE OFFERS
export const bundleOffers = [
  {
    id: 'bundle-creator',
    name: 'Pro Creator Studio Setup',
    tagline: 'MacBook Pro 16" M3 Max + Dell 27" 4K Monitor + MX Master 3S',
    badge: 'SAVE $300',
    items: [allProducts[0], allProducts[4], allProducts[5]], // MacBook + Dell + MX Master
    bundlePrice: 2847,
    originalPrice: 3147,
    savings: 300,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'bundle-audio',
    name: 'Ultimate Noise Cancellation Pack',
    tagline: 'Sony WH-1000XM5 + Apple Watch Ultra 2',
    badge: 'SAVE $120',
    items: [allProducts[2], allProducts[3]], // Sony + Watch
    bundlePrice: 978,
    originalPrice: 1098,
    savings: 120,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
]

// 5. COUPONS DEFINITION
export const availableCoupons = {
  TECH10: { discountPercent: 10, minPurchase: 50, description: '10% off on all tech equipment' },
  SAVE20: { discountPercent: 20, minPurchase: 200, description: '20% off orders over $200' },
  WELCOME15: { discountPercent: 15, minPurchase: 100, description: '15% welcome discount for new members' },
  FREESHIP: { freeShipping: true, description: 'Free Express Shipping on any order' },
  FLASH50: { discountFixed: 50, minPurchase: 300, description: '$50 instant discount on orders over $300' },
}

// 6. INITIAL USER
const defaultUser = {
  id: 'usr_technova_demo',
  name: 'Ton Bunheng',
  email: 'ton.bunheng@technova.com',
  phone: '+1 (555) 234-5678',
  avatar: '/public/IMG_9021.jpeg',
  createdAt: '2025-01-15',
  rewardPoints: 1250,
}

// 7. INITIAL ADDRESSES
const defaultAddresses = [
  {
    id: 'addr_1',
    title: 'Home Address',
    type: 'Home',
    fullName: 'Ton Bunheng',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States',
    isDefault: true,
  },
  {
    id: 'addr_2',
    title: 'Work Headquarters',
    type: 'Office',
    fullName: 'Ton Bunheng (TechNova HQ)',
    phone: '+1 (555) 987-6543',
    address: '500 Howard Street, Suite 1200',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
    isDefault: false,
  },
]

// 8. INITIAL ORDERS
const defaultOrders = [
  {
    id: 'TN-2026-8F4K92',
    date: '2026-02-24',
    status: 'Shipped',
    trackingNumber: 'TN-TRK-98432104',
    carrier: 'FedEx Priority Express',
    estimatedDelivery: '2026-02-28',
    items: [
      {
        id: 3,
        name: 'Sony WH-1000XM5 Wireless ANC',
        price: 349,
        originalPrice: 399,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        variant: 'Midnight Black',
      },
      {
        id: 6,
        name: 'Logitech MX Master 3S Wireless Mouse',
        price: 99,
        originalPrice: 119,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
        variant: 'Graphite Black',
      },
    ],
    subtotal: 448,
    shipping: 0,
    discount: 44.8,
    tax: 20.16,
    total: 423.36,
    paymentMethod: 'Credit Card (•••• 4242)',
    shippingAddress: {
      fullName: 'Ton Bunheng',
      address: '742 Evergreen Terrace, Apt 4B',
      city: 'San Francisco, CA 94107',
      phone: '+1 (555) 234-5678',
    },
    statusTimeline: [
      { title: 'Order Placed', time: 'Feb 24, 09:15 AM', completed: true, current: false },
      { title: 'Payment Confirmed', time: 'Feb 24, 09:16 AM', completed: true, current: false },
      { title: 'Processing & Packaged', time: 'Feb 25, 02:30 PM', completed: true, current: false },
      { title: 'Shipped (In Transit)', time: 'Feb 26, 08:00 AM', completed: true, current: true },
      { title: 'Out for Delivery', time: 'Est. Feb 28', completed: false, current: false },
      { title: 'Delivered', time: 'Est. Feb 28', completed: false, current: false },
    ],
  },
]

// 9. INITIAL NOTIFICATIONS
const defaultNotifications = [
  {
    id: 'notif_1',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order TN-2026-8F4K92 is currently in transit with FedEx.',
    time: '2 hours ago',
    read: false,
    link: '/track-order/TN-2026-8F4K92',
  },
  {
    id: 'notif_2',
    type: 'promo',
    title: 'Flash Sale Alert',
    message: 'Up to 20% off Apple MacBooks and LG Curved Monitors for the next 24 hours!',
    time: '5 hours ago',
    read: false,
    link: '/deals',
  },
  {
    id: 'notif_3',
    type: 'price_drop',
    title: 'Price Dropped on Wishlist Item',
    message: 'Sony WH-1000XM5 price dropped from $399 to $349.',
    time: '1 day ago',
    read: true,
    link: '/product/3',
  },
]

// ==========================================
// REACTIVE STORE STATE
// ==========================================

export const cart = ref(loadStorage('cart', []))
export const savedForLater = ref(loadStorage('saved_for_later', []))
export const wishlist = ref(new Set(loadStorage('wishlist', [1, 3])))
export const compareList = ref(loadStorage('compare', []))
export const recentlyViewed = ref(loadStorage('recently_viewed', [1, 2, 3]))
export const priceAlerts = ref(loadStorage('price_alerts', [3]))
export const searchHistory = ref(loadStorage('search_history', ['MacBook Pro M3', 'Sony Headphones', 'OLED Monitor']))
export const currentUser = ref(loadStorage('user', defaultUser))
export const orders = ref(loadStorage('orders', defaultOrders))
export const addresses = ref(loadStorage('addresses', defaultAddresses))
export const notifications = ref(loadStorage('notifications', defaultNotifications))
export const appliedCoupon = ref(loadStorage('coupon', null))

// Catalog UI Filters
export const selectedCategory = ref('all')
export const selectedBrand = ref('All Brands')
export const priceFilter = ref(3000)
export const minRatingFilter = ref(0)
export const inStockOnlyFilter = ref(false)
export const onSaleOnlyFilter = ref(false)
export const searchQuery = ref('')
export const sortBy = ref('featured')
export const viewMode = ref('grid') // 'grid' | 'list'

// Global UI Modals & Popups
export const cartDrawerOpen = ref(false)
export const quickViewProduct = ref(null)
export const notificationPanelOpen = ref(false)
export const mobileMenuOpen = ref(false)
export const toasts = ref([])
export const lastPlacedOrder = ref(null)

// WATCHERS TO SYNC STATE TO LOCAL STORAGE SAFELY
watch(cart, (val) => saveStorage('cart', val), { deep: true })
watch(savedForLater, (val) => saveStorage('saved_for_later', val), { deep: true })
watch(wishlist, (val) => saveStorage('wishlist', Array.from(val)), { deep: true })
watch(compareList, (val) => saveStorage('compare', val), { deep: true })
watch(recentlyViewed, (val) => saveStorage('recently_viewed', val), { deep: true })
watch(priceAlerts, (val) => saveStorage('price_alerts', val), { deep: true })
watch(searchHistory, (val) => saveStorage('search_history', val), { deep: true })
watch(currentUser, (val) => saveStorage('user', val), { deep: true })
watch(orders, (val) => saveStorage('orders', val), { deep: true })
watch(addresses, (val) => saveStorage('addresses', val), { deep: true })
watch(notifications, (val) => saveStorage('notifications', val), { deep: true })
watch(appliedCoupon, (val) => saveStorage('coupon', val), { deep: true })

// ==========================================
// COMPUTED VALUES
// ==========================================

export const filteredProducts = computed(() => {
  let list = [...allProducts]

  // Category
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    list = list.filter((p) => p.category === selectedCategory.value)
  }

  // Brand
  if (selectedBrand.value && selectedBrand.value !== 'All Brands') {
    list = list.filter((p) => p.brand.toLowerCase() === selectedBrand.value.toLowerCase())
  }

  // Price
  if (priceFilter.value < 3000) {
    list = list.filter((p) => p.price <= priceFilter.value)
  }

  // Rating
  if (minRatingFilter.value > 0) {
    list = list.filter((p) => p.rating >= minRatingFilter.value)
  }

  // Stock
  if (inStockOnlyFilter.value) {
    list = list.filter((p) => p.stock > 0)
  }

  // Sale
  if (onSaleOnlyFilter.value) {
    list = list.filter((p) => p.originalPrice && p.originalPrice > p.price)
  }

  // Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    )
  }

  // Sort
  if (sortBy.value === 'price-low') {
    list.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    list.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'rating') {
    list.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'newest') {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'popular') {
    list.sort((a, b) => b.salesCount - a.salesCount)
  } else if (sortBy.value === 'discount') {
    list.sort((a, b) => {
      const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0
      const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0
      return discB - discA
    })
  }

  return list
})

export const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
export const cartSubtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

export const freeShippingThreshold = 100
export const freeShippingProgress = computed(() => {
  if (cartSubtotal.value >= freeShippingThreshold) return 100
  return Math.min(100, Math.round((cartSubtotal.value / freeShippingThreshold) * 100))
})
export const amountForFreeShipping = computed(() => Math.max(0, freeShippingThreshold - cartSubtotal.value))

export const cartShipping = computed(() => {
  if (cart.value.length === 0) return 0
  if (appliedCoupon.value?.freeShipping) return 0
  return cartSubtotal.value >= freeShippingThreshold ? 0 : 15
})

export const cartDiscount = computed(() => {
  if (!appliedCoupon.value || cartSubtotal.value === 0) return 0
  if (appliedCoupon.value.discountPercent) {
    return Math.round((cartSubtotal.value * (appliedCoupon.value.discountPercent / 100)) * 100) / 100
  }
  if (appliedCoupon.value.discountFixed) {
    return Math.min(cartSubtotal.value, appliedCoupon.value.discountFixed)
  }
  return 0
})

export const cartTax = computed(() => {
  if (cartSubtotal.value === 0) return 0
  const taxable = Math.max(0, cartSubtotal.value - cartDiscount.value)
  return Math.round(taxable * 0.05 * 100) / 100 // 5% standard sales tax
})

export const cartTotal = computed(() => {
  if (cart.value.length === 0) return 0
  return Math.max(0, cartSubtotal.value + cartShipping.value + cartTax.value - cartDiscount.value)
})

export const wishlistCount = computed(() => wishlist.value.size)
export const wishlistProducts = computed(() => allProducts.filter((p) => wishlist.value.has(p.id)))

export const compareProducts = computed(() =>
  compareList.value
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)
)

export const recentlyViewedProducts = computed(() =>
  recentlyViewed.value
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)
)

export const unreadNotificationsCount = computed(
  () => notifications.value.filter((n) => !n.read).length
)

// ==========================================
// HELPER FORMATTERS
// ==========================================

export const formatPrice = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

let toastCounter = 0
export const showToast = (title, message = '', type = 'success') => {
  const id = ++toastCounter
  toasts.value.push({ id, title, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 4000)
}

export const removeToast = (id) => {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

// ==========================================
// ACTIONS
// ==========================================

// CART ACTIONS
export const addToCart = (product, quantity = 1, options = {}) => {
  const cartItemId = options.variant
    ? `${product.id}_${options.variant}`
    : `${product.id}`

  const existing = cart.value.find((item) => item.cartItemId === cartItemId || (item.id === product.id && !item.variant && !options.variant))

  const maxStock = product.stock || 99
  const currentQty = existing ? existing.quantity : 0

  if (currentQty + quantity > maxStock) {
    showToast('Stock limit reached', `Only ${maxStock} units available in stock.`, 'warning')
    return false
  }

  if (existing) {
    existing.quantity += quantity
  } else {
    cart.value.push({
      cartItemId,
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity,
      category: product.category,
      variant: options.variant || '',
      specSummary: options.specSummary || product.tagline || '',
      stock: maxStock,
    })
  }

  showToast('Added to cart', `${product.name} (x${quantity}) has been added.`, 'success')
  return true
}

export const updateCartQuantity = (cartItemId, quantity) => {
  const item = cart.value.find((i) => (i.cartItemId || i.id) === cartItemId)
  if (!item) return

  if (quantity <= 0) {
    removeFromCart(cartItemId)
  } else if (quantity > (item.stock || 99)) {
    showToast('Maximum stock reached', `Cannot add more than ${item.stock} items.`, 'warning')
    item.quantity = item.stock
  } else {
    item.quantity = quantity
  }
}

export const removeFromCart = (cartItemId) => {
  const item = cart.value.find((i) => (i.cartItemId || i.id) === cartItemId)
  if (item) {
    cart.value = cart.value.filter((i) => (i.cartItemId || i.id) !== cartItemId)
    showToast('Item removed', `${item.name} removed from your cart.`, 'info')
  }
}

export const saveForLaterAction = (cartItemId) => {
  const item = cart.value.find((i) => (i.cartItemId || i.id) === cartItemId)
  if (item) {
    cart.value = cart.value.filter((i) => (i.cartItemId || i.id) !== cartItemId)
    savedForLater.value.push(item)
    showToast('Saved for later', `${item.name} moved to your saved list.`, 'info')
  }
}

export const moveToCartFromSaved = (cartItemId) => {
  const item = savedForLater.value.find((i) => (i.cartItemId || i.id) === cartItemId)
  if (item) {
    savedForLater.value = savedForLater.value.filter((i) => (i.cartItemId || i.id) !== cartItemId)
    cart.value.push(item)
    showToast('Moved to cart', `${item.name} moved back to active cart.`, 'success')
  }
}

export const removeSavedForLater = (cartItemId) => {
  savedForLater.value = savedForLater.value.filter((i) => (i.cartItemId || i.id) !== cartItemId)
}

export const clearCart = () => {
  cart.value = []
}

// WISHLIST ACTIONS
export const toggleWishlist = (productOrId) => {
  const id = typeof productOrId === 'object' ? productOrId.id : Number(productOrId)
  const product = allProducts.find((p) => p.id === id)
  const nextWishlist = new Set(wishlist.value)

  if (nextWishlist.has(id)) {
    nextWishlist.delete(id)
    wishlist.value = nextWishlist
    if (product) showToast('Removed from Wishlist', `${product.name} removed.`, 'info')
  } else {
    nextWishlist.add(id)
    wishlist.value = nextWishlist
    if (product) showToast('Saved to Wishlist', `${product.name} added to favorites.`, 'success')
  }
}

export const isInWishlist = (productId) => wishlist.value.has(Number(productId))

export const moveAllWishlistToCart = () => {
  wishlistProducts.value.forEach((p) => {
    addToCart(p, 1)
  })
  wishlist.value = new Set()
  showToast('Moved to Cart', 'All wishlist items have been added to your cart.', 'success')
}

// COMPARE ACTIONS
export const toggleCompare = (productOrId) => {
  const id = typeof productOrId === 'object' ? productOrId.id : Number(productOrId)
  const exists = compareList.value.includes(id)
  const product = allProducts.find((p) => p.id === id)

  if (exists) {
    compareList.value = compareList.value.filter((item) => item !== id)
    if (product) showToast('Removed from Compare', `${product.name} removed.`, 'info')
  } else {
    if (compareList.value.length >= 4) {
      showToast('Compare limit reached', 'You can compare a maximum of 4 products at once.', 'warning')
      return
    }
    compareList.value.push(id)
    if (product) showToast('Added to Compare', `${product.name} ready for comparison.`, 'success')
  }
}

export const removeFromCompare = (productId) => {
  compareList.value = compareList.value.filter((id) => id !== Number(productId))
}

export const clearCompare = () => {
  compareList.value = []
}

export const isInCompare = (productId) => compareList.value.includes(Number(productId))

// RECENTLY VIEWED ACTIONS
export const addRecentlyViewed = (productId) => {
  const id = Number(productId)
  const filtered = recentlyViewed.value.filter((item) => item !== id)
  filtered.unshift(id)
  recentlyViewed.value = filtered.slice(0, 10)
}

// PRICE ALERTS ACTIONS
export const togglePriceAlert = (productId) => {
  const id = Number(productId)
  const product = allProducts.find((p) => p.id === id)
  if (priceAlerts.value.includes(id)) {
    priceAlerts.value = priceAlerts.value.filter((i) => i !== id)
    if (product) showToast('Price alert removed', `You will no longer receive alerts for ${product.name}.`, 'info')
  } else {
    priceAlerts.value.push(id)
    if (product) showToast('Price alert set!', `We will notify you immediately when ${product.name} drops in price.`, 'success')
  }
}

export const isInPriceAlert = (productId) => priceAlerts.value.includes(Number(productId))

// SEARCH HISTORY ACTIONS
export const addSearchQuery = (query) => {
  const clean = query.trim()
  if (!clean) return
  const filtered = searchHistory.value.filter((q) => q.toLowerCase() !== clean.toLowerCase())
  filtered.unshift(clean)
  searchHistory.value = filtered.slice(0, 8)
}

export const removeSearchQuery = (query) => {
  searchHistory.value = searchHistory.value.filter((q) => q !== query)
}

export const clearSearchHistory = () => {
  searchHistory.value = []
}

// REVIEWS & RATINGS
export const addReview = (productId, reviewData) => {
  const product = allProducts.find((p) => p.id === Number(productId))
  if (!product) return

  const newReview = {
    id: Date.now(),
    author: currentUser.value?.name || 'Verified Customer',
    rating: reviewData.rating,
    date: new Date().toISOString().split('T')[0],
    title: reviewData.title,
    comment: reviewData.comment,
    helpful: 0,
  }

  if (!product.reviews) product.reviews = []
  product.reviews.unshift(newReview)
  product.reviewsCount = product.reviews.length

  // Recalculate average rating
  const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0)
  product.rating = Math.round((sum / product.reviews.length) * 10) / 10

  showToast('Review submitted!', 'Thank you for your feedback.', 'success')
}

export const voteReviewHelpful = (productId, reviewId) => {
  const product = allProducts.find((p) => p.id === Number(productId))
  if (!product || !product.reviews) return
  const review = product.reviews.find((r) => r.id === reviewId)
  if (review) {
    review.helpful = (review.helpful || 0) + 1
    showToast('Thank you', 'Your vote was counted.', 'info')
  }
}

// COUPONS ACTIONS
export const applyCoupon = (code) => {
  const cleanCode = code.trim().toUpperCase()
  const coupon = availableCoupons[cleanCode]

  if (!coupon) {
    showToast('Invalid Coupon', `Code "${cleanCode}" is not recognized. Try TECH10 or SAVE20.`, 'error')
    return { success: false, error: 'Invalid coupon code' }
  }

  if (coupon.minPurchase && cartSubtotal.value < coupon.minPurchase) {
    showToast('Minimum requirement not met', `Code ${cleanCode} requires a minimum subtotal of $${coupon.minPurchase}.`, 'warning')
    return { success: false, error: `Minimum purchase of $${coupon.minPurchase} required` }
  }

  appliedCoupon.value = {
    code: cleanCode,
    ...coupon,
  }
  showToast('Coupon Applied!', `${coupon.description}`, 'success')
  return { success: true }
}

export const removeCoupon = () => {
  appliedCoupon.value = null
  showToast('Coupon Removed', 'Discount removed from order.', 'info')
}

// ORDER CREATION
export const createOrder = (shippingInfo, paymentMethod = 'Credit Card', shippingMethod = 'standard') => {
  if (cart.value.length === 0) return null

  const randomNum = Math.floor(100000 + Math.random() * 900000)
  const orderId = `TN-2026-${randomNum}`
  const trackingNumber = `TN-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`

  let shippingCost = cartShipping.value
  let deliveryEstimateDays = 4
  if (shippingMethod === 'express') {
    shippingCost = 20
    deliveryEstimateDays = 2
  } else if (shippingMethod === 'overnight') {
    shippingCost = 35
    deliveryEstimateDays = 1
  }

  const deliveryDateObj = new Date()
  deliveryDateObj.setDate(deliveryDateObj.getDate() + deliveryEstimateDays)
  const estDeliveryStr = deliveryDateObj.toISOString().split('T')[0]

  const newOrder = {
    id: orderId,
    date: new Date().toISOString().split('T')[0],
    status: 'Processing',
    trackingNumber,
    carrier: shippingMethod === 'express' ? 'FedEx Priority Express' : 'Standard Carrier',
    estimatedDelivery: estDeliveryStr,
    items: JSON.parse(JSON.stringify(cart.value)),
    subtotal: cartSubtotal.value,
    shipping: shippingCost,
    discount: cartDiscount.value,
    tax: cartTax.value,
    total: Math.max(0, cartSubtotal.value + shippingCost + cartTax.value - cartDiscount.value),
    paymentMethod,
    shippingMethod,
    shippingAddress: shippingInfo,
    statusTimeline: [
      { title: 'Order Placed', time: 'Just now', completed: true, current: false },
      { title: 'Payment Confirmed', time: 'Just now', completed: true, current: false },
      { title: 'Processing Order', time: 'In progress', completed: true, current: true },
      { title: 'Shipped', time: `Est. ${deliveryEstimateDays} days`, completed: false, current: false },
      { title: 'Out for Delivery', time: 'Pending', completed: false, current: false },
      { title: 'Delivered', time: 'Pending', completed: false, current: false },
    ],
  }

  orders.value.unshift(newOrder)
  lastPlacedOrder.value = newOrder

  // Award rewards points (1 pt per dollar)
  if (currentUser.value) {
    currentUser.value.rewardPoints = (currentUser.value.rewardPoints || 0) + Math.round(newOrder.total)
  }

  // Push notification
  notifications.value.unshift({
    id: `notif_${Date.now()}`,
    type: 'order',
    title: 'Order Confirmed!',
    message: `Your order ${newOrder.id} has been placed successfully.`,
    time: 'Just now',
    read: false,
    link: `/track-order/${newOrder.id}`,
  })

  clearCart()
  showToast('Order Placed Successfully!', `Order ${newOrder.id} is confirmed.`, 'success')
  return newOrder
}

export const cancelOrder = (orderId) => {
  const order = orders.value.find((o) => o.id === orderId)
  if (order) {
    order.status = 'Cancelled'
    showToast('Order Cancelled', `Order ${orderId} has been cancelled.`, 'info')
  }
}

// ADDRESS ACTIONS
export const addAddress = (addressData) => {
  const id = `addr_${Date.now()}`
  const newAddr = { id, isDefault: addresses.value.length === 0, ...addressData }
  if (newAddr.isDefault) {
    addresses.value.forEach((a) => (a.isDefault = false))
  }
  addresses.value.push(newAddr)
  showToast('Address Saved', 'New delivery address added.', 'success')
  return newAddr
}

export const updateAddress = (id, addressData) => {
  const idx = addresses.value.findIndex((a) => a.id === id)
  if (idx !== -1) {
    if (addressData.isDefault) {
      addresses.value.forEach((a) => (a.isDefault = false))
    }
    addresses.value[idx] = { ...addresses.value[idx], ...addressData }
    showToast('Address Updated', 'Address details saved.', 'success')
  }
}

export const deleteAddress = (id) => {
  addresses.value = addresses.value.filter((a) => a.id !== id)
  if (addresses.value.length > 0 && !addresses.value.some((a) => a.isDefault)) {
    addresses.value[0].isDefault = true
  }
  showToast('Address Removed', '', 'info')
}

export const setDefaultAddress = (id) => {
  addresses.value.forEach((a) => {
    a.isDefault = a.id === id
  })
  showToast('Default Address Set', '', 'success')
}

// AUTH ACTIONS
export const loginUser = (email, password) => {
  const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Shopper'
  currentUser.value = {
    id: `usr_${Date.now()}`,
    name: nameFromEmail,
    email,
    avatar: '/public/IMG_9021.jpeg',
    phone: '+1 (555) 234-5678',
    createdAt: '2025-01-15',
    rewardPoints: 1250,
  }
  showToast('Welcome back!', `Signed in as ${currentUser.value.name}`, 'success')
}

export const registerUser = (name, email) => {
  currentUser.value = {
    id: `usr_${Date.now()}`,
    name,
    email,
    avatar: '/public/IMG_9021.jpeg',
    phone: '',
    createdAt: new Date().toISOString().split('T')[0],
    rewardPoints: 150, // Welcome reward bonus
  }
  showToast('Account Created!', `Welcome to TechNova, ${name}! You received 150 bonus reward points.`, 'success')
}

export const logoutUser = () => {
  currentUser.value = null
  showToast('Signed Out', 'You have been safely signed out.', 'info')
}

// UI HELPERS
export const openQuickView = (product) => {
  quickViewProduct.value = product
}

export const closeQuickView = () => {
  quickViewProduct.value = null
}

export const openCartDrawer = () => {
  cartDrawerOpen.value = true
}

export const closeCartDrawer = () => {
  cartDrawerOpen.value = false
}

export const toggleNotificationPanel = () => {
  notificationPanelOpen.value = !notificationPanelOpen.value
}

// ==========================================
// COMPATIBILITY ALIASES & HELPERS
// ==========================================
export const isCartDrawerOpen = cartDrawerOpen
export const isProductInWishlist = isInWishlist
export const isProductInCompare = isInCompare
export const isProductInPriceAlert = isInPriceAlert
export const freeShippingRemaining = amountForFreeShipping
export const removeSearchHistoryItem = removeSearchQuery

export const quickViewProductId = computed({
  get: () => quickViewProduct.value?.id || null,
  set: (val) => {
    if (!val) {
      quickViewProduct.value = null
    } else {
      quickViewProduct.value = allProducts.find((p) => p.id === Number(val)) || null
    }
  },
})

export const moveToWishlist = (cartItemId) => {
  const item = cart.value.find((i) => (i.cartItemId || i.id) === cartItemId)
  if (item) {
    if (!wishlist.value.has(item.id)) {
      toggleWishlist(item.id)
    }
    removeFromCart(cartItemId)
  }
}

export const featuredProducts = computed(() => allProducts.filter((p) => p.isFeatured))
export const trendingProducts = computed(() => allProducts.filter((p) => p.isTrending))
export const bestSellerProducts = computed(() => allProducts.filter((p) => p.isBestSeller))
export const newArrivalProducts = computed(() => allProducts.filter((p) => p.isNew))
export const recommendedProducts = computed(() => allProducts.slice(0, 4))

