import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Header } from '../../components/Header';
import { useShop } from '../../context/ShopContext';
import { RootNavigationProp } from '../../types/navigation';

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useShop();

  const [activeFilter, setActiveFilter] = useState<'all' | 'promo' | 'order'>('all');

  const filteredNotifs = notifications.filter((n) =>
    activeFilter === 'all' ? true : n.type === activeFilter
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'promo':
        return { name: 'ticket-outline', color: Colors.accent, bg: Colors.accentLight };
      case 'order':
        return { name: 'cube-outline', color: Colors.primary, bg: Colors.primaryLight };
      default:
        return { name: 'information-circle-outline', color: Colors.success, bg: Colors.successLight };
    }
  };

  const handleNotificationPress = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.type === 'order') {
      navigation.navigate('MainTabs', { screen: 'Profile' });
    } else if (notif.type === 'promo') {
      navigation.navigate('MainTabs', { screen: 'Explore' });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Notifikasi" showBack={true} showNotifications={false} />

      {/* Filter Chips & Mark All Read */}
      <View style={styles.topControlRow}>
        <View style={styles.chipsRow}>
          {[
            { id: 'all', label: 'Semua' },
            { id: 'promo', label: 'Promo' },
            { id: 'order', label: 'Pesanan' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                activeFilter === item.id && styles.chipActive,
              ]}
              onPress={() => setActiveFilter(item.id as any)}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === item.id && styles.chipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {unreadNotificationsCount > 0 && (
          <TouchableOpacity onPress={markAllNotificationsAsRead}>
            <Text style={styles.markAllReadText}>Baca Semua</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredNotifs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color={Colors.border} />
            <Text style={styles.emptyTitle}>Belum Ada Notifikasi</Text>
            <Text style={styles.emptySubtitle}>
              Kabar promo menarik dan status pesanan Anda akan muncul di sini.
            </Text>
          </View>
        ) : (
          filteredNotifs.map((item) => {
            const iconConfig = getIcon(item.type);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, !item.read && styles.unreadCard]}
                onPress={() => handleNotificationPress(item)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.iconContainer, { backgroundColor: iconConfig.bg }]}
                >
                  <Ionicons
                    name={iconConfig.name as any}
                    size={22}
                    color={iconConfig.color}
                  />
                </View>

                <View style={styles.textContainer}>
                  <View style={styles.cardHeader}>
                    <Text
                      style={[styles.title, !item.read && styles.titleBold]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {!item.read && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.message} numberOfLines={2}>
                    {item.message}
                  </Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            );
          })
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
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  markAllReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
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
        elevation: 1,
      },
    }),
  },
  unreadCard: {
    backgroundColor: '#F8FAFF',
    borderColor: Colors.primaryLight,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
  },
  titleBold: {
    fontWeight: '800',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    marginLeft: 6,
  },
  message: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
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
    lineHeight: 19,
  },
});
