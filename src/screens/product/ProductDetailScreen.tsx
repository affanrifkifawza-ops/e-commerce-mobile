import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { useShop } from '../../context/ShopContext';
import { RootStackParamList, RootNavigationProp } from '../../types/navigation';
import { ProductCard } from '../../components/ProductCard';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<RootNavigationProp>();
  const insets = useSafeAreaInsets();
  const { products, addToCart, isInWishlist, toggleWishlist, cartCount, showToast } =
    useShop();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Default');

  const product = products.find((p) => p.id === route.params.productId);

  if (!product) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Produk tidak ditemukan</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Lihat produk ${product.name} di ElectroStore seharga ${formatRupiah(product.price)}!`,
      });
    } catch (e) {
      // Ignored
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      {/* Floating Header */}
      <View style={[styles.floatingHeader, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={20} color={Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => toggleWishlist(product.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? Colors.danger : Colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}
            activeOpacity={0.8}
          >
            <Ionicons name="cart-outline" size={22} color={Colors.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          {product.discountPercentage ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>HEMAT {product.discountPercentage}%</Text>
            </View>
          ) : null}
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Category & Stock */}
          <View style={styles.metaRow}>
            <Text style={styles.categoryBadge}>{product.category.toUpperCase()}</Text>
            <View style={styles.stockBadge}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={styles.stockText}>Tersedia {product.stock} unit</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating & Reviews */}
          <View style={styles.ratingRow}>
            <View style={styles.starsBox}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingNumber}>{product.rating}</Text>
            </View>
            <Text style={styles.reviewsCount}>• {product.reviewsCount} Ulasan Pembeli</Text>
            <Text style={styles.soldCount}>• Terjual 500+ unit</Text>
          </View>

          {/* Pricing Box */}
          <View style={styles.pricingCard}>
            <View>
              <Text style={styles.currentPrice}>{formatRupiah(product.price)}</Text>
              {product.originalPrice && (
                <View style={styles.originalPriceRow}>
                  <Text style={styles.originalPrice}>
                    {formatRupiah(product.originalPrice)}
                  </Text>
                  <Text style={styles.saveTag}>
                    Hemat {formatRupiah(product.originalPrice - product.price)}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.warrantyBadge}>
              <Ionicons name="shield-checkmark-outline" size={16} color={Colors.primary} />
              <Text style={styles.warrantyText}>Garansi Resmi 1 Thn</Text>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Jumlah Pembelian</Text>
            <View style={styles.quantityRow}>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Ionicons name="remove" size={18} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.stepValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  <Ionicons name="add" size={18} color={Colors.text} />
                </TouchableOpacity>
              </View>
              <Text style={styles.totalPreviewText}>
                Subtotal: {formatRupiah(product.price * quantity)}
              </Text>
            </View>
          </View>

          {/* Key Features */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Spesifikasi Unggulan</Text>
            {product.features.map((feat, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Deskripsi Lengkap</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Delivery & Assurance */}
          <View style={styles.assuranceBox}>
            <View style={styles.assuranceItem}>
              <Ionicons name="cube-outline" size={20} color={Colors.primary} />
              <View style={styles.assuranceContent}>
                <Text style={styles.assuranceTitle}>100% Original & Segel Pabrik</Text>
                <Text style={styles.assuranceDesc}>Jaminan uang kembali jika barang terbukti palsu</Text>
              </View>
            </View>
            <View style={styles.assuranceItem}>
              <Ionicons name="airplane-outline" size={20} color={Colors.accent} />
              <View style={styles.assuranceContent}>
                <Text style={styles.assuranceTitle}>Pengiriman Cepat & Aman</Text>
                <Text style={styles.assuranceDesc}>Asuransi pengiriman penuh gratis</Text>
              </View>
            </View>
          </View>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionLabel}>Produk Serupa Terkait</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedProducts.map((rel) => (
                  <View key={rel.id} style={{ width: 180, marginRight: 12 }}>
                    <ProductCard product={rel} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.cartIconOnlyBtn}
          onPress={() => addToCart(product, quantity)}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryAddToCartBtn}
          onPress={() => addToCart(product, quantity)}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryAddToCartText}>+ Keranjang</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBuyBtn}
          onPress={handleBuyNow}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryBuyText}>Beli Sekarang</Text>
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.accent,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    width: '100%',
    height: 340,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: Colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  body: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  productName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 27,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 6,
  },
  starsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  reviewsCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  soldCount: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  pricingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary,
  },
  originalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  originalPrice: {
    fontSize: 13,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  saveTag: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '700',
  },
  warrantyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  warrantyText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  stepValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  totalPreviewText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  assuranceBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  assuranceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assuranceContent: {
    flex: 1,
  },
  assuranceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  assuranceDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  relatedSection: {
    marginTop: 10,
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
    gap: 10,
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
  cartIconOnlyBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  secondaryAddToCartBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryAddToCartText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  primaryBuyBtn: {
    flex: 1.2,
    height: 46,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBuyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
