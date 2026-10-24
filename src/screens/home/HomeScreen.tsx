import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ProductCard';
import { CategoryPill } from '../../components/CategoryPill';
import { CATEGORIES } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { RootNavigationProp } from '../../types/navigation';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { products, showToast } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const flashSaleProducts = products.filter((p) => p.isFlashSale);
  const popularProducts = products.filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  const handleCategoryPress = (catId: string) => {
    setSelectedCategory(catId);
    if (catId !== 'all') {
      // Also allows jumping to explore tab
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar Trigger */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('SearchModal')}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <Text style={styles.searchText}>Cari gadget, audio, laptop impianmu...</Text>
          <View style={styles.filterIconBadge}>
            <Ionicons name="options-outline" size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Hero Promo Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={12} color="#FFFFFF" />
              <Text style={styles.heroBadgeText}>PROMO SPESIAL GAJIAN</Text>
            </View>
            <Text style={styles.heroTitle}>Upgrade Gadget Terbaikmu</Text>
            <Text style={styles.heroSubtitle}>Diskon s/d 30% + Gratis Ongkir Seluruh Indonesia</Text>

            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Explore' })}
              activeOpacity={0.85}
            >
              <Text style={styles.heroButtonText}>Jelajahi Sekarang</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Category Chips */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kategori Pilihan</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'Explore' })}
          >
            <Text style={styles.seeAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat.id}
              name={cat.name}
              icon={cat.icon}
              isActive={selectedCategory === cat.id}
              onPress={() => handleCategoryPress(cat.id)}
            />
          ))}
        </ScrollView>

        {/* Flash Sale Section */}
        <View style={styles.flashSaleContainer}>
          <View style={styles.flashSaleHeader}>
            <View style={styles.flashTitleRow}>
              <View style={styles.flashBadge}>
                <Ionicons name="flash" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.flashSaleTitle}>Flash Sale Hari Ini</Text>
            </View>
            <View style={styles.timerBadge}>
              <Ionicons name="time-outline" size={13} color={Colors.accent} />
              <Text style={styles.timerText}>04 : 25 : 12</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flashSaleScroll}
          >
            {flashSaleProducts.map((product) => (
              <View key={product.id} style={styles.flashSaleItem}>
                <ProductCard product={product} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Voucher Bar */}
        <TouchableOpacity
          style={styles.voucherBar}
          onPress={() => showToast('🎟️ Kupon diskon Rp 50.000 berhasil diklaim!')}
          activeOpacity={0.8}
        >
          <Ionicons name="ticket-outline" size={24} color={Colors.accent} />
          <View style={styles.voucherInfo}>
            <Text style={styles.voucherTitle}>Klaim Kupon Pengguna Baru Rp 50.000</Text>
            <Text style={styles.voucherSubtitle}>Berlaku untuk semua metode pembayaran</Text>
          </View>
          <View style={styles.voucherClaimBtn}>
            <Text style={styles.voucherClaimText}>Klaim</Text>
          </View>
        </TouchableOpacity>

        {/* Popular / Curated Grid Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all'
              ? 'Rekomendasi Terbaik'
              : `Katalog ${CATEGORIES.find((c) => c.id === selectedCategory)?.name}`}
          </Text>
          <Text style={styles.itemCountText}>{popularProducts.length} Produk</Text>
        </View>

        <View style={styles.productGrid}>
          {popularProducts.map((product) => (
            <View key={product.id} style={styles.gridColumn}>
              <ProductCard product={product} />
            </View>
          ))}
        </View>
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
    paddingBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: Colors.textMuted,
  },
  filterIconBadge: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: Colors.primaryLight,
  },
  heroBanner: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    padding: 20,
    overflow: 'hidden',
  },
  heroContent: {
    zIndex: 2,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
    gap: 4,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 28,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  heroButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  itemCountText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    marginBottom: 20,
  },
  flashSaleContainer: {
    backgroundColor: Colors.accentLight,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FED7AA',
  },
  flashSaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  flashTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flashBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashSaleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#9A3412',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accent,
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.accent,
  },
  flashSaleScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  flashSaleItem: {
    width: 200,
  },
  voucherBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  voucherInfo: {
    flex: 1,
    marginLeft: 12,
  },
  voucherTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  voucherSubtitle: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  voucherClaimBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  voucherClaimText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  gridColumn: {
    width: (width - 44) / 2,
  },
});
