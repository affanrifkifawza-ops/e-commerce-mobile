import { Product, Order, NotificationItem } from '../types/navigation';

export const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: 'grid-outline' },
  { id: 'gadget', name: 'Gadget & HP', icon: 'phone-portrait-outline' },
  { id: 'audio', name: 'Audio & Musik', icon: 'headset-outline' },
  { id: 'laptop', name: 'Laptop & PC', icon: 'laptop-outline' },
  { id: 'wearable', name: 'Smartwatch', icon: 'watch-outline' },
  { id: 'accessories', name: 'Aksesoris', icon: 'hardware-chip-outline' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    category: 'audio',
    price: 4999000,
    originalPrice: 5999000,
    discountPercentage: 17,
    rating: 4.9,
    reviewsCount: 342,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    description: 'Headphone peredam bising terkemuka di industri dengan dua prosesor dan delapan mikrofon untuk kualitas panggilan luar biasa dan audio resolusi tinggi.',
    features: [
      'Industry-leading Noise Cancellation',
      'Battery life hingga 30 jam',
      'Speak-to-Chat & Multipoint connection',
      'Desain ultra nyaman tanpa tekanan'
    ],
    stock: 15,
    isPopular: true,
    isFlashSale: true,
  },
  {
    id: 'prod-2',
    name: 'Apple iPhone 15 Pro 256GB Natural Titanium',
    category: 'gadget',
    price: 19499000,
    originalPrice: 20999000,
    discountPercentage: 7,
    rating: 4.95,
    reviewsCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    description: 'Didesain dengan titanium aerospace yang tangguh dan ringan, tombol Tindakan yang dapat disesuaikan, serta sistem kamera Pro terkuat yang pernah ada.',
    features: [
      'Chip A17 Pro bertenaga monster grafis',
      'Kamera utama 48MP dengan optical zoom 5x',
      'Layar Super Retina XDR ProMotion 120Hz',
      'Port USB-C kecepatan transfer 10Gbps'
    ],
    stock: 8,
    isPopular: true,
    isFlashSale: false,
  },
  {
    id: 'prod-3',
    name: 'Apple Watch Series 9 GPS 45mm Starlight',
    category: 'wearable',
    price: 6799000,
    originalPrice: 7499000,
    discountPercentage: 9,
    rating: 4.8,
    reviewsCount: 215,
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    description: 'Lebih cerdas, lebih cerah, dan lebih bertenaga. Rasakan kontrol gerakan ketuk dua kali ajaib dan layar super terang untuk kemudahan di luar ruangan.',
    features: [
      'Chip S9 SiP baru dengan gesture Double Tap',
      'Sensor oksigen darah & ECG deteksi jantung',
      'Layar Always-On 2000 nits kecerahan',
      'Water resistant hingga 50 meter'
    ],
    stock: 22,
    isPopular: true,
    isFlashSale: true,
  },
  {
    id: 'prod-4',
    name: 'MacBook Air 15" M3 16GB 512GB Midnight',
    category: 'laptop',
    price: 21999000,
    originalPrice: 23499000,
    discountPercentage: 6,
    rating: 4.9,
    reviewsCount: 160,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    description: 'Laptop tipis bertenaga kencang dengan layar Liquid Retina 15,3 inci luas dan daya tahan baterai hingga 18 jam tanpa kompromi.',
    features: [
      'Chip Apple M3 dengan 8-core CPU & 10-core GPU',
      'Daya tahan baterai hingga 18 jam',
      'Liquid Retina Display dengan 1 miliar warna',
      'Desain unibody aluminium solid tipis 11.5mm'
    ],
    stock: 5,
    isPopular: false,
    isFlashSale: false,
  },
  {
    id: 'prod-5',
    name: 'Keychron K2 V2 Wireless Mechanical Keyboard RGB',
    category: 'accessories',
    price: 1350000,
    originalPrice: 1650000,
    discountPercentage: 18,
    rating: 4.75,
    reviewsCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    description: 'Keyboard mekanik nirkabel kompak 75% dengan konektivitas Bluetooth 5.1, baterai 4000mAh besar, dan layout ramah Mac & Windows.',
    features: [
      'Gateron G Pro Switch (Hot-swappable)',
      'Dual mode: Bluetooth & kabel USB Type-C',
      'RGB Backlight dengan 18+ pola dinamis',
      'Kompatibel penuh macOS, Windows, iOS, Android'
    ],
    stock: 30,
    isPopular: true,
    isFlashSale: true,
  },
  {
    id: 'prod-6',
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    category: 'accessories',
    price: 1599000,
    originalPrice: 1899000,
    discountPercentage: 15,
    rating: 4.88,
    reviewsCount: 512,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    description: 'Mouse ikonik dengan klik senyap Quiet Clicks dan sensor 8.000 DPI yang dapat melacak pada permukaan kaca.',
    features: [
      'MagSpeed Electromagnetic Scrolling ultra cepat',
      'Quiet Clicks 90% lebih hening',
      'Sensor Darkfield 8000 DPI akurat',
      'Flow cross-computer control untuk 3 perangkat'
    ],
    stock: 18,
    isPopular: false,
    isFlashSale: false,
  },
  {
    id: 'prod-7',
    name: 'Marshall Emberton II Portable Bluetooth Speaker',
    category: 'audio',
    price: 2699000,
    originalPrice: 3199000,
    discountPercentage: 16,
    rating: 4.82,
    reviewsCount: 184,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    description: 'Speaker portabel ringkas dengan suara 360° True Stereophonic Marshall yang khas, tahan debu & air rating IP67.',
    features: [
      'True Stereophonic multi-directional sound',
      '30+ jam playtime sekali isi ulang daya',
      'IP67 Dust & Water resistant tangguh',
      'Stack Mode untuk menggabungkan speaker'
    ],
    stock: 12,
    isPopular: true,
    isFlashSale: true,
  },
  {
    id: 'prod-8',
    name: 'Samsung Galaxy S24 Ultra 5G 512GB Titanium Gray',
    category: 'gadget',
    price: 21499000,
    originalPrice: 23999000,
    discountPercentage: 10,
    rating: 4.92,
    reviewsCount: 710,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
    description: 'Era baru kecerdasan Galaxy AI dengan bodi titanium kokoh, pena S-Pen bawaan, dan kamera 200MP bertenaga AI processing.',
    features: [
      'Galaxy AI: Circle to Search & Live Translate',
      'Snapdragon 8 Gen 3 for Galaxy terbaru',
      'Kamera Quad 200MP + 50MP periscope zoom',
      'Bodi Titanium & Corning Gorilla Armor anti silau'
    ],
    stock: 9,
    isPopular: true,
    isFlashSale: false,
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Diskon Kilat Payday Sale Dimulai! ⚡',
    message: 'Hemat hingga 30% untuk aneka kategori gadget dan audio pilihan hari ini saja. Jangan lewatkan!',
    time: '10 menit lalu',
    read: false,
    type: 'promo',
  },
  {
    id: 'notif-2',
    title: 'Pesanan #ORD-8921 Sedang Dikirim 🚚',
    message: 'Kurir SiCepat Express sedang mengantar paket Anda ke alamat tujuan. Estimasi tiba sore ini.',
    time: '2 jam lalu',
    read: false,
    type: 'order',
  },
  {
    id: 'notif-3',
    title: 'Voucher Gratis Ongkir Ditambahkan 🎟️',
    message: 'Klaim voucher gratis ongkir tanpa minimum belanja untuk seluruh wilayah Indonesia.',
    time: '1 hari lalu',
    read: true,
    type: 'promo',
  },
  {
    id: 'notif-4',
    title: 'Keamanan Akun Terverifikasi 🛡️',
    message: 'Perangkat baru Anda berhasil terhubung dengan aman. Selamat berbelanja!',
    time: '3 hari lalu',
    read: true,
    type: 'info',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    date: '24 Oktober 2026, 14:20 WIB',
    items: [
      {
        productId: 'prod-6',
        name: 'Logitech MX Master 3S Wireless Performance Mouse',
        price: 1599000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      }
    ],
    subtotal: 1599000,
    shippingFee: 20000,
    discount: 50000,
    totalAmount: 1569000,
    status: 'Dikirim',
    shippingAddress: {
      recipientName: 'Budi Pratama',
      phone: '+62 812-3456-7890',
      address: 'Jl. Sudirman No. 45, Tower A Lt. 12',
      city: 'Jakarta Selatan',
      postalCode: '12190',
    },
    paymentMethod: 'BCA Virtual Account',
    estimatedDelivery: '25 Oktober 2026 (16:00 - 18:00 WIB)',
  },
  {
    id: 'ORD-7634',
    date: '18 Oktober 2026, 09:15 WIB',
    items: [
      {
        productId: 'prod-7',
        name: 'Marshall Emberton II Portable Bluetooth Speaker',
        price: 2699000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
      }
    ],
    subtotal: 2699000,
    shippingFee: 0,
    discount: 100000,
    totalAmount: 2599000,
    status: 'Selesai',
    shippingAddress: {
      recipientName: 'Budi Pratama',
      phone: '+62 812-3456-7890',
      address: 'Jl. Sudirman No. 45, Tower A Lt. 12',
      city: 'Jakarta Selatan',
      postalCode: '12190',
    },
    paymentMethod: 'GoPay',
    estimatedDelivery: '20 Oktober 2026',
  }
];
