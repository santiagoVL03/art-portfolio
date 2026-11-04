import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StyleSheet, View } from 'react-native';
import AdminScreen from './screens/AdminScreen';
import GalleryScreen from './screens/GalleryScreen';
import LoginScreen from './screens/LoginScreen';
import { colors } from './theme';

export default function App() {
  return (
    <BrowserRouter>
      <View style={styles.root}>
        <Routes>
          {/* Ruta pública: cualquiera puede ver la galería. */}
          <Route path="/" element={<GalleryScreen />} />
          {/* Ruta privada: solo con credenciales. */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </View>
    </BrowserRouter>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
