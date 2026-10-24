import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ProductCard';
import { CategoryPill } from '../../components/CategoryPill';
import { CATEGORIES } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { MainTabParamList, RootNavigationProp } from '../../types/navigation';

const { width } = Dimensions.get('window');

type ExploreRouteProp = RouteProp<MainTabParamList, 'Explore'>;

type SortOption = 'popular' | 'price-low' | 'price-high' | 'rating';

export const ExploreScreen: React.FC = () => {
  const route = useRoute<ExploreRouteProp>();
  const navigation = useNavigation<RootNavigationProp>();
  const { products } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params?.category]);

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price-low':
        return 'Harga Terendah';
      case 'price-high':
        return 'Harga Tertinggi';
      case 'rating':
        return 'Rating Tertinggi';
      default:
        return 'Paling Populer';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Katalog Produk" />

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari dalam katalog..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Pill Button */}
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortMenu(!showSortMenu)}
          activeOpacity={0.8}
        >
          <Ionicons name="swap-vertical" size={16} color={Colors.primary} />
          <Text style={styles.sortButtonText}>{getSortLabel()}</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown Options */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          {[
            { id: 'popular', label: 'Paling Populer' },
            { id: 'rating', label: 'Rating Tertinggi' },
            { id: 'price-low', label: 'Harga Terendah' },
            { id: 'price-high', label: 'Harga Tertinggi' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.sortMenuItem,
                sortBy === opt.id && styles.sortMenuItemActive,
              ]}
              onPress={() => {
                setSortBy(opt.id as SortOption);
                setShowSortMenu(false);
              }}
            >
              <Text
                style={[
                  styles.sortMenuText,
                  sortBy === opt.id && styles.sortMenuTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {sortBy === opt.id && (
                <Ionicons name="checkmark" size={16} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Category Pills List */}
      <View style={styles.categoryContainer}>
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
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Products Grid / Results */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsScroll}
      >
        <View style={styles.resultInfoRow}>
          <Text style={styles.resultCount}>
            Menampilkan <Text style={styles.boldText}>{filteredProducts.length}</Text> produk
          </Text>
          {selectedCategory !== 'all' && (
            <TouchableOpacity
              onPress={() => setSelectedCategory('all')}
              style={styles.resetFilterBtn}
            >
              <Text style={styles.resetFilterText}>Reset Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>Produk Tidak Ditemukan</Text>
            <Text style={styles.emptySubtitle}>
              Coba gunakan kata kunci lain atau ubah filter kategori.
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              <Text style={styles.resetBtnText}>Tampilkan Semua Produk</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((product) => (
              <View key={product.id} style={styles.gridColumn}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: Colors.text,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
    gap: 4,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  sortMenu: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  sortMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sortMenuItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  sortMenuText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sortMenuTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  categoryContainer: {
    paddingVertical: 6,
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  resultsScroll: {
    paddingBottom: 30,
  },
  resultInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.text,
  },
  resetFilterBtn: {
    paddingVertical: 2,
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  resetBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
