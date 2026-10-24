import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { ProductCard } from '../../components/ProductCard';
import { useShop } from '../../context/ShopContext';
import { RootNavigationProp } from '../../types/navigation';

const POPULAR_SEARCHES = [
  'iPhone 15 Pro',
  'Sony WH-1000XM5',
  'Mechanical Keyboard',
  'Apple Watch',
  'MacBook Air',
  'Speaker Bluetooth',
];

export const SearchModalScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const insets = useSafeAreaInsets();
  const { products } = useShop();

  const [query, setQuery] = useState('');

  const searchResults =
    query.trim() === ''
      ? []
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Header Search Bar */}
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Ketik produk atau merek..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Batal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {query.trim() === '' ? (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.sectionTitle}>Paling Banyak Dicari 🔥</Text>
            <View style={styles.tagsContainer}>
              {POPULAR_SEARCHES.map((tag, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.tag}
                  onPress={() => setQuery(tag)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trending-up-outline" size={14} color={Colors.primary} />
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.guideBox}>
              <Ionicons name="bulb-outline" size={20} color={Colors.warning} />
              <Text style={styles.guideText}>
                Tips: Gunakan nama spesifik seperti "Sony" atau "MacBook" untuk hasil yang lebih akurat.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultTitle}>
              Hasil Pencarian ({searchResults.length})
            </Text>

            {searchResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={Colors.border} />
                <Text style={styles.emptyTitle}>Tidak ada produk ditemukan</Text>
                <Text style={styles.emptySubtitle}>
                  Coba periksa ejaan atau gunakan kata kunci umum lainnya.
                </Text>
              </View>
            ) : (
              searchResults.map((product) => (
                <ProductCard key={product.id} product={product} horizontal={true} />
              ))
            )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  clearBtn: {
    padding: 2,
  },
  cancelBtn: {
    paddingVertical: 4,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  suggestionsContainer: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  tagText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  guideBox: {
    flexDirection: 'row',
    backgroundColor: Colors.warningLight,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 10,
  },
  guideText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  resultsContainer: {
    paddingTop: 4,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
