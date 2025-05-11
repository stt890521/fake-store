import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store'; // 根據你檔案放的位置

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
