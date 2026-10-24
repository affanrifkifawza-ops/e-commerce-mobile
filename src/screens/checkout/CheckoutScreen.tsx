import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { useShop } from '../../context/ShopContext';
import { RootNavigationProp } from '../../types/navigation';

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const insets = useSafeAreaInsets();
  const { cart, cartTotal, placeOrder, showToast } = useShop();

  // Form states
  const [recipientName, setRecipientName] = useState('Budi Pratama');
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [address, setAddress] = useState('Jl. Sudirman No. 45, Tower A Lt. 12');
  const [city, setCity] = useState('Jakarta Selatan');
  const [postalCode, setPostalCode] = useState('12190');

  const [shippingMethod, setShippingMethod] = useState<'regular' | 'express' | 'instant'>('regular');
  const [paymentMethod, setPaymentMethod] = useState('BCA Virtual Account');

  const shippingCost =
    cartTotal > 5000000
      ? 0
      : shippingMethod === 'express'
      ? 35000
      : shippingMethod === 'instant'
      ? 50000
      : 25000;

  const discount = cartTotal > 10000000 ? 150000 : 0;
  const grandTotal = cartTotal + shippingCost - discount;

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const handleProcessOrder = () => {
    if (!recipientName.trim() || !address.trim() || !phone.trim()) {
      showToast('⚠️ Lengkapi data nama, telepon, dan alamat pengiriman');
      return;
    }

    const order = placeOrder(
      {
        recipientName,
        phone,
        address,
        city,
        postalCode,
      },
      paymentMethod
    );

    navigation.replace('OrderSuccess', { orderId: order.id });
  };

  return (
    <View style={styles.container}>
      <Header title="Pengiriman & Checkout" showBack={true} showSearch={false} showCart={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Shipping Address Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
            </View>
            <TouchableOpacity onPress={() => showToast('📍 Form alamat disiapkan')}>
              <Text style={styles.changeAddressText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Penerima</Text>
            <TextInput
              style={styles.input}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Nama lengkap"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nomor WhatsApp / HP</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+62 8..."
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat Lengkap</Text>
            <TextInput
              style={[styles.input, { minHeight: 60 }]}
              value={address}
              onChangeText={setAddress}
              multiline
              placeholder="Nama jalan, gedung, nomor rumah"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1.5, marginRight: 8 }]}>
              <Text style={styles.label}>Kota / Kabupaten</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Kode Pos</Text>
              <TextInput
                style={styles.input}
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Courier / Shipping Method */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="car-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Opsi Kurir Pengiriman</Text>
          </View>

          {[
            {
              id: 'regular',
              name: 'SiCepat Reguler (2-3 Hari)',
              fee: cartTotal > 5000000 ? 0 : 25000,
            },
            {
              id: 'express',
              name: 'J&T Express Next Day (1 Hari)',
              fee: cartTotal > 5000000 ? 0 : 35000,
            },
            {
              id: 'instant',
              name: 'GoSend / Grab Instant (Hari Ini)',
              fee: cartTotal > 5000000 ? 0 : 50000,
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.methodOption,
                shippingMethod === item.id && styles.methodOptionActive,
              ]}
              onPress={() => setShippingMethod(item.id as any)}
              activeOpacity={0.8}
            >
              <View style={styles.radioRow}>
                <Ionicons
                  name={
                    shippingMethod === item.id
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  size={18}
                  color={shippingMethod === item.id ? Colors.primary : Colors.textMuted}
                />
                <Text style={styles.methodName}>{item.name}</Text>
              </View>
              <Text style={styles.methodFee}>
                {item.fee === 0 ? 'GRATIS' : formatRupiah(item.fee)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          </View>

          {[
            { id: 'BCA Virtual Account', icon: 'card-outline', desc: 'Verifikasi Otomatis' },
            { id: 'Mandiri Virtual Account', icon: 'card-outline', desc: 'Verifikasi Otomatis' },
            { id: 'GoPay / GoPay Coins', icon: 'phone-portrait-outline', desc: 'Instan 1-Klik' },
            { id: 'QRIS Semua Pembayaran', icon: 'qr-code-outline', desc: 'Scan dari mobile banking' },
          ].map((pay) => (
            <TouchableOpacity
              key={pay.id}
              style={[
                styles.methodOption,
                paymentMethod === pay.id && styles.methodOptionActive,
              ]}
              onPress={() => setPaymentMethod(pay.id)}
              activeOpacity={0.8}
            >
              <View style={styles.radioRow}>
                <Ionicons
                  name={
                    paymentMethod === pay.id
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  size={18}
                  color={paymentMethod === pay.id ? Colors.primary : Colors.textMuted}
                />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.methodName}>{pay.id}</Text>
                  <Text style={styles.methodSubtext}>{pay.desc}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Items Brief Review */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ringkasan Barang ({cart.length})</Text>
          {cart.map((c) => (
            <View key={c.product.id} style={styles.reviewItemRow}>
              <Image source={{ uri: c.product.imageUrl }} style={styles.reviewThumb} />
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewName} numberOfLines={1}>
                  {c.product.name}
                </Text>
                <Text style={styles.reviewQty}>
                  {c.quantity}x {formatRupiah(c.product.price)}
                </Text>
              </View>
              <Text style={styles.reviewTotal}>
                {formatRupiah(c.product.price * c.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* Cost Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Rincian Biaya</Text>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Subtotal Produk</Text>
            <Text style={styles.summaryValue}>{formatRupiah(cartTotal)}</Text>
          </View>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Biaya Ongkos Kirim</Text>
            <Text style={[styles.summaryValue, shippingCost === 0 && { color: Colors.success }]}>
              {shippingCost === 0 ? 'GRATIS' : formatRupiah(shippingCost)}
            </Text>
          </View>

          {discount > 0 && (
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Kupon Promo</Text>
              <Text style={[styles.summaryValue, { color: Colors.accent }]}>
                -{formatRupiah(discount)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryLine}>
            <Text style={styles.totalLabel}>Total Tagihan Akhir</Text>
            <Text style={styles.totalValue}>{formatRupiah(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Confirmation Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View>
          <Text style={styles.bottomBarSub}>Total Pembayaran</Text>
          <Text style={styles.bottomBarTotal}>{formatRupiah(grandTotal)}</Text>
        </View>

        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleProcessOrder}
          activeOpacity={0.88}
        >
          <Text style={styles.payBtnText}>Bayar Pesanan</Text>
          <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
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
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  changeAddressText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: Colors.text,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    marginBottom: 8,
  },
  methodOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  methodSubtext: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  methodFee: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  reviewItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  reviewThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  reviewInfo: {
    flex: 1,
    marginLeft: 10,
  },
  reviewName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewQty: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  reviewTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryLine: {
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
    fontWeight: '600',
    color: Colors.text,
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  bottomBarSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bottomBarTotal: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.accent,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
