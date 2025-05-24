import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await AsyncStorage.getItem('user');

        if (user) {
          router.replace('/(tabs)/product'); // 已登入導向首頁
        } else {
          router.replace('/login'); // 未登入導向登入頁
        }
      } catch (error) {
        console.error('Error checking login:', error);
        router.replace('/login');
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
