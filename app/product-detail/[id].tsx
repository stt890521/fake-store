import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product data when the screen loads
  useEffect(() => {
    if (id) {
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
          setLoading(false);
        });
    }
  }, [id]);

  // Handle add-to-cart button
  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity: 1 }));
      ToastAndroid.show('✅ Added to cart!', ToastAndroid.SHORT);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>Price: ${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
        <Text style={styles.cartButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  productImage: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  price: { fontSize: 20, color: '#4CAF50', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', marginBottom: 20, textAlign: 'center' },
  cartButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 10, marginBottom: 10 },
  cartButtonText: { color: '#fff', fontSize: 16 },
  backButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10 },
  backButtonText: { color: '#fff', fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
