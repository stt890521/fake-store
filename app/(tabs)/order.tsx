import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OrderItem {
  id: number;
  uid: number;
  item_numbers: number;
  is_paid: number;
  is_delivered: number;
  total_price: number;
  order_items: string; // JSON string
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://10.0.2.2:3000/orders/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status === 'OK') {
        setOrders(data.orders);
      } else {
        Alert.alert('Error', data.message || 'Unable to load orders');
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderID: number,
    isPaid: number,
    isDelivered: number
  ) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://10.0.2.2:3000/orders/updateorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderID,
          isPaid,
          isDelivered,
        }),
      });
      const data = await res.json();
      if (data.status === 'OK') {
        fetchOrders(); // Refresh after update
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Failed to update order:', err);
      Alert.alert('Error', 'Failed to update order');
    }
  };

  const renderItem = ({ item }: { item: OrderItem }) => {
    const parsedItems = JSON.parse(item.order_items);

    const statusText = item.is_delivered
      ? 'delivered'
      : item.is_paid
      ? 'paid'
      : 'new';

    return (
      <View style={styles.orderCard}>
        <Text style={styles.orderTitle}>Order #{item.id}</Text>
        <Text>Status: {statusText}</Text>
        <Text>Total: ${item.total_price.toFixed(2)}</Text>
        {parsedItems.map((prod: any, idx: number) => (
          <Text key={idx}>
            - Product #{prod.prodID} x{prod.quantity}
          </Text>
        ))}

        {!item.is_paid && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateOrderStatus(item.id, 1, 0)}
          >
            <Text style={styles.buttonText}>Pay</Text>
          </TouchableOpacity>
        )}

        {item.is_paid && !item.is_delivered && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateOrderStatus(item.id, 1, 1)}
          >
            <Text style={styles.buttonText}>Receive</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
      ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orderCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  orderTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 6 },
  button: {
    backgroundColor: '#2196F3',
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
});
