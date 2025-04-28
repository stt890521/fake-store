import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function ProductListScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
          setLoading(false);
        });
    }
  }, [category]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push({
              pathname: '/product-detail/[id]',
              params: { id: item.id.toString() },
            })}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>Price: ${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  list: { paddingHorizontal: 20 },
  productCard: { flexDirection: 'row', padding: 10, marginVertical: 8, backgroundColor: '#f0f0f0', borderRadius: 10, alignItems: 'center' },
  productImage: { width: 60, height: 60, resizeMode: 'contain', marginRight: 10 },
  productInfo: { flexShrink: 1 },
  productTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  productPrice: { fontSize: 14, color: '#555' },
  backButton: { marginTop: 10, backgroundColor: '#4CAF50', padding: 12, borderRadius: 8 },
  backButtonText: { color: '#fff', fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
