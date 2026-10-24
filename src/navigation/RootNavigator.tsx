import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import { BottomTabNavigator } from './BottomTabNavigator';
import { ProductDetailScreen } from '../screens/product/ProductDetailScreen';
import { CheckoutScreen } from '../screens/checkout/CheckoutScreen';
import { OrderSuccessScreen } from '../screens/checkout/OrderSuccessScreen';
import { OrderDetailScreen } from '../screens/orders/OrderDetailScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { SearchModalScreen } from '../screens/search/SearchModalScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Nested Main Tab Navigator */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* Product Detail Screen */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />

      {/* Checkout Screen */}
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />

      {/* Order Success Screen */}
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{
          gestureEnabled: false,
          animation: 'fade',
        }}
      />

      {/* Order Detail Screen */}
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />

      {/* Notifications Screen */}
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />

      {/* Search Modal Presentation */}
      <Stack.Screen
        name="SearchModal"
        component={SearchModalScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};
