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

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { orders, showToast } = useShop();

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Diproses' || o.status === 'Dikirim'
  ).length;

  const completedOrdersCount = orders.filter((o) => o.status === 'Selesai').length;

  return (
    <View style={styles.container}>
      <Header title="Profil Saya" showCart={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card */}
        <View style={styles.profileCard}>
          <Image
            source={require('../../../assets/WhatsApp Image 2026-10-25 at 09.17.38_5638f834.jpg')}
            style={styles.avatar}
          />


          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>Affan Rifki Fawza</Text>
              <View style={styles.vipBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
                <Text style={styles.vipBadgeText}>GOLD</Text>
              </View>
            </View>
            <Text style={styles.userEmail}>affanrifki.077@gmail.com</Text>
            <Text style={styles.userPhone}>+62 812-1234-5678</Text>
          </View>
        </View>

        {/* Order Status Fast-Track */}
        <View style={styles.orderStatusCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Pesanan Saya</Text>
            <Text style={styles.historyLinkText}>Riwayat ({orders.length})</Text>
          </View>

          <View style={styles.statusIconsRow}>
            <TouchableOpacity
              style={styles.statusIconItem}
              onPress={() => showToast('Tidak ada pesanan menunggu pembayaran')}
            >
              <View style={styles.statusIconCircle}>
                <Ionicons name="wallet-outline" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.statusIconLabel}>Belum Bayar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusIconItem}
              onPress={() => {
                if (orders.length > 0) {
                  navigation.navigate('OrderDetail', { orderId: orders[0].id });
                }
              }}
            >
              <View style={styles.statusIconCircle}>
                <Ionicons name="time-outline" size={22} color={Colors.primary} />
                {activeOrdersCount > 0 && (
                  <View style={styles.badgeSmall}>
                    <Text style={styles.badgeSmallText}>{activeOrdersCount}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.statusIconLabel}>Diproses</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusIconItem}
              onPress={() => {
                const sending = orders.find((o) => o.status === 'Dikirim');
                if (sending) {
                  navigation.navigate('OrderDetail', { orderId: sending.id });
                } else if (orders.length > 0) {
                  navigation.navigate('OrderDetail', { orderId: orders[0].id });
                }
              }}
            >
              <View style={styles.statusIconCircle}>
                <Ionicons name="car-outline" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.statusIconLabel}>Dikirim</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusIconItem}
              onPress={() => {
                const completed = orders.find((o) => o.status === 'Selesai');
                if (completed) {
                  navigation.navigate('OrderDetail', { orderId: completed.id });
                }
              }}
            >
              <View style={styles.statusIconCircle}>
                <Ionicons name="checkmark-done-circle-outline" size={22} color={Colors.primary} />
                {completedOrdersCount > 0 && (
                  <View style={[styles.badgeSmall, { backgroundColor: Colors.success }]}>
                    <Text style={styles.badgeSmallText}>{completedOrdersCount}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.statusIconLabel}>Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders List */}
        <View style={styles.recentOrdersSection}>
          <Text style={styles.sectionTitle}>Aktivitas Pesanan Terbaru</Text>
          {orders.slice(0, 2).map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderItemCard}
              onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
              activeOpacity={0.85}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderIdText}>#{order.id}</Text>
                  <Text style={styles.orderDateText}>{order.date}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    order.status === 'Selesai' && styles.statusPillSuccess,
                    order.status === 'Dikirim' && styles.statusPillShipping,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      order.status === 'Selesai' && styles.statusPillTextSuccess,
                      order.status === 'Dikirim' && styles.statusPillTextShipping,
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDivider} />

              <View style={styles.orderProductRow}>
                {order.items[0]?.imageUrl && (
                  <Image
                    source={{ uri: order.items[0].imageUrl }}
                    style={styles.orderProductThumb}
                  />
                )}
                <View style={styles.orderProductInfo}>
                  <Text style={styles.orderProductName} numberOfLines={1}>
                    {order.items[0]?.name}
                  </Text>
                  <Text style={styles.orderProductQty}>
                    {order.items.length > 1
                      ? `+${order.items.length - 1} produk lainnya`
                      : `1 barang`}
                  </Text>
                </View>
                <Text style={styles.orderTotalAmount}>
                  Rp {order.totalAmount.toLocaleString('id-ID')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu Items List */}
        <View style={styles.menuCard}>
          {[
            {
              icon: 'location-outline',
              title: 'Alamat Pengiriman',
              subtitle: 'Jl. Sudirman No. 45, Jakarta Selatan',
              onPress: () => showToast('📍 Alamat utama dipilih'),
            },
            {
              icon: 'card-outline',
              title: 'Metode Pembayaran',
              subtitle: 'BCA Virtual Account, GoPay',
              onPress: () => showToast('💳 2 Metode pembayaran terdaftar'),
            },
            {
              icon: 'notifications-outline',
              title: 'Notifikasi',
              subtitle: 'Promo dan status pesanan aktif',
              onPress: () => navigation.navigate('Notifications'),
            },
            {
              icon: 'shield-outline',
              title: 'Keamanan & Privasi',
              subtitle: 'Ubah password & otentikasi biometrik',
              onPress: () => showToast('🔒 Akun terlindungi enkripsi end-to-end'),
            },
            {
              icon: 'help-circle-outline',
              title: 'Pusat Bantuan & FAQ',
              subtitle: 'Hubungi Customer Care 24/7',
              onPress: () => showToast('💬 Menghubungkan ke Tim Support...'),
            },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.menuItem, idx !== 0 && styles.menuItemBorder]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
              </View>
              <View style={styles.menuTextBox}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => showToast('ℹ️ Anda login sebagai akun demo')}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>ElectroStore v1.0.0 • React Navigation Demo</Text>
      </ScrollView>
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
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  vipBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userPhone: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  orderStatusCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  historyLinkText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  statusIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusIconItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  badgeSmall: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeSmallText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  statusIconLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  recentOrdersSection: {
    marginBottom: 16,
  },
  orderItemCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  orderDateText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
  },
  statusPillSuccess: {
    backgroundColor: Colors.successLight,
  },
  statusPillShipping: {
    backgroundColor: '#EFF6FF',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  statusPillTextSuccess: {
    color: Colors.success,
  },
  statusPillTextShipping: {
    color: '#2563EB',
  },
  orderDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 10,
  },
  orderProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderProductThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  orderProductInfo: {
    flex: 1,
    marginLeft: 10,
  },
  orderProductName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  orderProductQty: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  orderTotalAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.accent,
  },
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  menuSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dangerLight,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.danger,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
  },
});
