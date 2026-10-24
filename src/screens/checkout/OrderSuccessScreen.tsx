import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { RootStackParamList, RootNavigationProp } from '../../types/navigation';
import { useShop } from '../../context/ShopContext';

type OrderSuccessRouteProp = RouteProp<RootStackParamList, 'OrderSuccess'>;

export const OrderSuccessScreen: React.FC = () => {
  const route = useRoute<OrderSuccessRouteProp>();
  const navigation = useNavigation<RootNavigationProp>();
  const { getOrderById } = useShop();

  const order = getOrderById(route.params.orderId);

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-done" size={60} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Pesanan Berhasil Dibuat!</Text>
        <Text style={styles.subtitle}>
          Terima kasih telah berbelanja di ElectroStore. Pesanan Anda telah diterima dan sedang menunggu konfirmasi pembayaran.
        </Text>

        <View style={styles.orderCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Nomor Pesanan</Text>
            <Text style={styles.valueBold}>#{route.params.orderId}</Text>
          </View>

          {order && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Metode Pembayaran</Text>
                <Text style={styles.value}>{order.paymentMethod}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Total Tagihan</Text>
                <Text style={styles.totalValue}>{formatRupiah(order.totalAmount)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Estimasi Pengiriman</Text>
                <Text style={styles.value}>{order.estimatedDelivery}</Text>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() =>
            navigation.replace('OrderDetail', { orderId: route.params.orderId })
          }
          activeOpacity={0.88}
        >
          <Ionicons name="cube-outline" size={20} color="#FFFFFF" />
          <Text style={styles.trackBtnText}>Lacak Status Pesanan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          activeOpacity={0.85}
        >
          <Text style={styles.homeBtnText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.success,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  orderCard: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 24,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
  valueBold: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accent,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginBottom: 12,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  homeBtn: {
    paddingVertical: 10,
  },
  homeBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
