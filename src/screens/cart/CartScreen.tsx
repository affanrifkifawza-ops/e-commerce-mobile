import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { useShop } from '../../context/ShopContext';
import { RootNavigationProp } from '../../types/navigation';

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useShop();

  const shippingFee = cartTotal > 5000000 ? 0 : 25000;
  const discount = cartTotal > 10000000 ? 150000 : 0;
  const grandTotal = cartTotal > 0 ? cartTotal + shippingFee - discount : 0;

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Keranjang Belanja" showSearch={false} showCart={false} />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="cart-outline" size={60} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Keranjang Belanja Kosong</Text>
          <Text style={styles.emptySubtitle}>
            Sepertinya Anda belum menambahkan produk apapun ke dalam keranjang.
          </Text>
          <TouchableOpacity
            style={styles.startShopBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
            activeOpacity={0.85}
          >
            <Ionicons name="bag-handle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.startShopBtnText}>Mulai Belanja Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Keranjang Belanja" showCart={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBar}>
          <Text style={styles.itemsCountText}>
            Daftar Produk ({cart.length} item)
          </Text>
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearCartText}>Kosongkan</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Item Cards */}
        {cart.map((item) => (
          <View key={item.product.id} style={styles.cartCard}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: item.product.id })
              }
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.product.imageUrl }}
                style={styles.itemImage}
              />
            </TouchableOpacity>

            <View style={styles.itemDetails}>
              <View style={styles.itemHeader}>
                <Text
                  style={styles.itemName}
                  numberOfLines={2}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      productId: item.product.id,
                    })
                  }
                >
                  {item.product.name}
                </Text>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.product.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                </TouchableOpacity>
              </View>

              <Text style={styles.itemPrice}>
                {formatRupiah(item.product.price)}
              </Text>

              <View style={styles.actionRow}>
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                  >
                    <Ionicons name="remove" size={16} color={Colors.text} />
                  </TouchableOpacity>

                  <Text style={styles.qtyText}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                  >
                    <Ionicons name="add" size={16} color={Colors.text} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.subtotalText}>
                  Total: {formatRupiah(item.product.price * item.quantity)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* Free Shipping Progress / Note */}
        <View style={styles.shippingNotice}>
          <Ionicons
            name={cartTotal > 5000000 ? 'checkmark-circle' : 'airplane-outline'}
            size={20}
            color={cartTotal > 5000000 ? Colors.success : Colors.primary}
          />
          <Text style={styles.shippingNoticeText}>
            {cartTotal > 5000000
              ? '🎉 Selamat! Pesanan Anda mendapatkan Gratis Ongkir'
              : `Belanja ${formatRupiah(5000000 - cartTotal)} lagi untuk Gratis Ongkir`}
          </Text>
        </View>

        {/* Cost Summary Box */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Pembayaran</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Harga Barang</Text>
            <Text style={styles.summaryValue}>{formatRupiah(cartTotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimasi Ongkos Kirim</Text>
            <Text
              style={[
                styles.summaryValue,
                shippingFee === 0 && { color: Colors.success, fontWeight: '700' },
              ]}
            >
              {shippingFee === 0 ? 'GRATIS' : formatRupiah(shippingFee)}
            </Text>
          </View>

          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Diskon Belanja</Text>
              <Text style={[styles.summaryValue, { color: Colors.accent }]}>
                -{formatRupiah(discount)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Tagihan</Text>
            <Text style={styles.totalValue}>{formatRupiah(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Checkout CTA */}
      <View style={styles.bottomCheckoutBar}>
        <View>
          <Text style={styles.barTotalLabel}>Total Bayar</Text>
          <Text style={styles.barTotalValue}>{formatRupiah(grandTotal)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.88}
        >
          <Text style={styles.checkoutBtnText}>Checkout ({cart.length})</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemsCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  clearCartText: {
    fontSize: 13,
    color: Colors.danger,
    fontWeight: '600',
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  itemImage: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 18,
    marginRight: 8,
  },
  deleteBtn: {
    padding: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  subtotalText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  shippingNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    gap: 10,
  },
  shippingNoticeText: {
    flex: 1,
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accent,
  },
  bottomCheckoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  barTotalLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  barTotalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.accent,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  startShopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  startShopBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
