import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // 依你的實際 store.ts 路徑調整

SplashScreen.preventAutoHideAsync();

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
            if (route.name === 'index') iconName = 'home-outline';
            if (route.name === 'cart') iconName = 'cart-outline';
            if (route.name === 'orders') iconName = 'list-outline';
            if (route.name === 'profile') iconName = 'person-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarBadge:
            route.name === 'cart' && totalCount > 0 ? totalCount : undefined,
        })}
      />
      <StatusBar style="auto" />
    </>
  );
}
