# ElectroStore - Mobile E-Commerce App (Nested Navigation)

Aplikasi mobile e-commerce sederhana dengan struktur alur navigasi multi-halaman terintegrasi (*nested navigation*) menggunakan **React Navigation** dan **Expo React Native (TypeScript)** dengan menerapkan prinsip UI/UX yang modern dan intuitif.

## 📱 Fitur Utama & Struktur Alur Navigasi

### 1. Root Stack Navigator (`RootNavigator.tsx`)
- **`MainTabs`**: Bottom Tab Navigator utama aplikasi.
- **`ProductDetail`**: Halaman detail produk (spesifikasi, galeri foto, ulasan, opsi kuantitas, tombol *Tambah ke Keranjang* & *Beli Sekarang*).
- **`Checkout`**: Formulir data pengiriman, pemilihan kurir, metode pembayaran, ringkasan kupon dan ongkir.
- **`OrderSuccess`**: Layar konfirmasi pesanan berhasil dengan pintasan pelacakan status.
- **`OrderDetail`**: Halaman pelacakan paket secara *real-time* dengan linimasa status pesanan.
- **`Notifications`**: Pusat notifikasi promo dan status pesanan dengan indikator *read/unread*.
- **`SearchModal`**: Modal pencarian langsung dengan riwayat tren kata kunci populer.

### 2. Bottom Tab Navigator (`BottomTabNavigator.tsx`)
- 🏠 **Beranda (`HomeScreen`)**: Banner flash sale countdown, kategori cepat, kupon gajian, dan rekomendasi produk.
- 🔍 **Katalog (`ExploreScreen`)**: Filter kategori interaktif, sortir harga terendah/tertinggi/rating, dan pencarian.
- 🛒 **Keranjang (`CartScreen`)**: Pengaturan kuantitas barang, kalkulasi diskon & gratis ongkir, serta tombol checkout.
- ❤️ **Favorit (`WishlistScreen`)**: Daftar barang yang disimpan dengan tombol instan masuk keranjang.
- 👤 **Profil (`ProfileScreen`)**: Ringkasan akun, kartu status pesanan (Belum Bayar, Diproses, Dikirim, Selesai), dan pengaturan.

### 3. State Management Terpadu (`ShopContext.tsx`)
- Menyimpan status keranjang belanja, *wishlist*, transaksi aktif, riwayat pesanan, dan umpan balik *toast*.
- Menampilkan *badge counter* otomatis pada tab keranjang dan favorit saat item bertambah.

---

## 🚀 Cara Menjalankan Proyek

1. **Jalankan Development Server**:
   ```bash
   npx expo start
   ```

2. **Jalankan di HP (Expo Go)**:
   - Buka aplikasi **Expo Go** di Android / iOS Anda.
   - Pindai (*scan*) QR code yang tampil di terminal.

3. **Jalankan di Web Browser**:
   - Tekan tombol `w` di terminal untuk melihat di peramban web.
