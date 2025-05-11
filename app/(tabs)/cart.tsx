import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  increaseQuantity,
  decreaseQuantity,
} from '../../features/cart/cartSlice';

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>Price: ${item.price}</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => dispatch(decreaseQuantity(item.id))}>
            <Text style={styles.controlBtn}>➖</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>quantity: {item.quantity}</Text>
          <TouchableOpacity onPress={() => dispatch(increaseQuantity(item.id))}>
            <Text style={styles.controlBtn}>➕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty!!!</Text>
      ) : (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>Items: {totalItems}</Text>
            <Text style={styles.summaryText}>Total Price: ${totalPrice}</Text>
          </View>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryText: { fontSize: 18, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 20, color: '#888' },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
  },
  image: { width: 80, height: 80, resizeMode: 'contain' },
  info: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  controls: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  controlBtn: { fontSize: 20, paddingHorizontal: 10 },
  quantity: { fontSize: 16, marginHorizontal: 10 },
});
