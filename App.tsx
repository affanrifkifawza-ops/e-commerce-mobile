import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ShopProvider } from './src/context/ShopContext';
import { Toast } from './src/components/Toast';

export default function App() {
  return (
    <SafeAreaProvider>
      <ShopProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
          <Toast />
        </NavigationContainer>
      </ShopProvider>
    </SafeAreaProvider>
  );
}
