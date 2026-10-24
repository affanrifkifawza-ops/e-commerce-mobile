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
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { RootStackParamList, RootNavigationProp } from '../../types/navigation';
import { useShop } from '../../context/ShopContext';

type OrderDetailRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;

export const OrderDetailScreen: React.FC = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation<RootNavigationProp>();
  const { getOrderById, showToast } = useShop();

  const order = getOrderById(route.params.orderId);

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  if (!order) {
    return (
      <View style={styles.container}>
        <Header title="Detail Pesanan" showBack={true} />
        <View style={styles.center}>
          <Text style={styles.notFoundText}>Data pesanan tidak ditemukan</Text>
        </View>
      </View>
    );
  }

  const trackingSteps = [
    { title: 'Pesanan Dibuat', time: order.date, completed: true },
    {
      title: 'Pembayaran Dikonfirmasi',
      time: 'Verifikasi Otomatis',
      completed: true,
    },
    {
      title: 'Sedang Dikemas Penjual',
      time: 'Gudang Utama Jakarta',
      completed: order.status !== 'Menunggu Konfirmasi',
    },
    {
      title: 'Dalam Pengiriman Kurir',
      time: order.estimatedDelivery,
      completed: order.status === 'Dikirim' || order.status === 'Selesai',
    },
    {
      title: 'Pesanan Telah Tiba di Tujuan',
      time: 'Penerima: ' + order.shippingAddress.recipientName,
      completed: order.status === 'Selesai',
    },
  ];

  return (
    <View style={styles.container}>
      <Header title={`Detail #${order.id}`} showBack={true} showCart={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Card Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusBannerHeader}>
            <View>
              <Text style={styles.statusBadgeText}>Status Saat Ini</Text>
              <Text style={styles.statusMainText}>{order.status}</Text>
            </View>
            <Ionicons
              name={
                order.status === 'Selesai'
                  ? 'checkmark-done-circle'
                  : order.status === 'Dikirim'
                  ? 'car'
                  : 'hourglass'
              }
              size={36}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.statusBannerSub}>
            Estimasi Tiba: {order.estimatedDelivery}
          </Text>
        </View>

        {/* Timeline Tracking */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lacak Perjalanan Paket</Text>
          <View style={styles.timeline}>
            {trackingSteps.map((step, idx) => (
              <View key={idx} style={styles.timelineStep}>
                <View style={styles.timelineIndicatorCol}>
                  <View
                    style={[
                      styles.timelineDot,
                      step.completed && styles.timelineDotActive,
                    ]}
                  >
                    <Ionicons
                      name={step.completed ? 'checkmark' : 'ellipse'}
                      size={10}
                      color="#FFFFFF"
                    />
                  </View>
                  {idx < trackingSteps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        trackingSteps[idx + 1].completed && styles.timelineLineActive,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineTextCol}>
                  <Text
                    style={[
                      styles.timelineStepTitle,
                      step.completed && styles.timelineStepTitleActive,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.timelineStepTime}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location-outline" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Alamat Pengiriman</Text>
          </View>
          <Text style={styles.recipientName}>
            {order.shippingAddress.recipientName} ({order.shippingAddress.phone})
          </Text>
          <Text style={styles.addressLine}>
            {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.postalCode}
          </Text>
        </View>

        {/* Ordered Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daftar Produk ({order.items.length})</Text>
          {order.items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.productRow}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: item.productId })
              }
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.productThumb} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.productQty}>
                  {item.quantity} barang x {formatRupiah(item.price)}
                </Text>
              </View>
              <Text style={styles.productTotal}>
                {formatRupiah(item.price * item.quantity)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rincian Pembayaran</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Metode Pembayaran</Text>
            <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Harga Barang</Text>
            <Text style={styles.summaryValue}>{formatRupiah(order.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
            <Text
              style={[
                styles.summaryValue,
                order.shippingFee === 0 && { color: Colors.success },
              ]}
            >
              {order.shippingFee === 0 ? 'GRATIS' : formatRupiah(order.shippingFee)}
            </Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Potongan Promo</Text>
              <Text style={[styles.summaryValue, { color: Colors.accent }]}>
                -{formatRupiah(order.discount)}
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>{formatRupiah(order.totalAmount)}</Text>
          </View>
        </View>

        {/* Help & Support Button */}
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => showToast('💬 Tim Customer Service siap membantu Anda')}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubbles-outline" size={18} color={Colors.primary} />
          <Text style={styles.helpButtonText}>Butuh Bantuan Mengenai Pesanan Ini?</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  statusBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadgeText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusMainText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  statusBannerSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  timelineIndicatorCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotActive: {
    backgroundColor: Colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 3,
  },
  timelineLineActive: {
    backgroundColor: Colors.primary,
  },
  timelineTextCol: {
    flex: 1,
    paddingTop: 1,
  },
  timelineStepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  timelineStepTitleActive: {
    color: Colors.text,
    fontWeight: '700',
  },
  timelineStepTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recipientName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  productQty: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
  productTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
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
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 6,
  },
  helpButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
