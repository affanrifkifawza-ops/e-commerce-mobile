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

export const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { wishlist, products, toggleWishlist, addToCart } = useShop();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  if (favoriteProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Wishlist Favorit" />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="heart-outline" size={60} color={Colors.danger} />
          </View>
          <Text style={styles.emptyTitle}>Wishlist Anda Masih Kosong</Text>
          <Text style={styles.emptySubtitle}>
            Simpan produk yang Anda sukai dengan menekan ikon hati pada katalog produk.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Explore' })}
            activeOpacity={0.85}
          >
            <Ionicons name="compass-outline" size={18} color="#FFFFFF" />
            <Text style={styles.exploreBtnText}>Eksplorasi Produk Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Wishlist Favorit" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>
            Disimpan ({favoriteProducts.length} produk)
          </Text>
        </View>

        {favoriteProducts.map((product) => (
          <View key={product.id} style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: product.id })
              }
              activeOpacity={0.85}
            >
              <Image source={{ uri: product.imageUrl }} style={styles.image} />
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.category}>{product.category.toUpperCase()}</Text>
                <TouchableOpacity
                  onPress={() => toggleWishlist(product.id)}
                  style={styles.heartBtn}
                >
                  <Ionicons name="heart" size={20} color={Colors.danger} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProductDetail', { productId: product.id })
                }
              >
                <Text style={styles.name} numberOfLines={2}>
                  {product.name}
                </Text>
              </TouchableOpacity>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.ratingText}>{product.rating}</Text>
                <Text style={styles.stockText}>• Stok Tersedia ({product.stock})</Text>
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.price}>{formatRupiah(product.price)}</Text>

                <TouchableOpacity
                  style={styles.addToCartBtn}
                  onPress={() => addToCart(product, 1)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.addToCartText}>+ Keranjang</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
  topBar: {
    marginBottom: 12,
  },
  topBarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
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
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  heartBtn: {
    padding: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 18,
    marginVertical: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  stockText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
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
    backgroundColor: Colors.dangerLight,
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
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
