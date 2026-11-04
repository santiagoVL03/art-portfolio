import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StyleSheet, View } from 'react-native';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import AdminScreen from './screens/AdminScreen';
import GalleryScreen from './screens/GalleryScreen';
import LoginScreen from './screens/LoginScreen';
import { ThemeProvider, useTheme } from './ThemeProvider';

function Shell() {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <SiteHeader />
      <View style={styles.main}>
        <Routes>
          {/* Ruta pública: cualquiera puede ver la galería. */}
          <Route path="/" element={<GalleryScreen />} />
          {/* Ruta privada: solo con credenciales. */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </View>
      <SiteFooter />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
});
