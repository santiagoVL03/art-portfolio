import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../ThemeProvider';
import { fonts, type Palette } from '../theme';
import ArtistDialog from './ArtistDialog';

export default function SiteHeader() {
  const navigate = useNavigate();
  const { colors, mode, toggle } = useTheme();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [artistOpen, setArtistOpen] = useState(false);
  const compact = width < 560;

  return (
    <View style={styles.shell}>
      <View style={[styles.inner, compact && styles.innerCompact]}>
        <Pressable
          onPress={() => navigate('/')}
          style={styles.brandBlock}
          accessibilityLabel="Ir a la galería"
        >
          <Text style={styles.brand}>Estudio</Text>
          {!compact && <Text style={styles.brandSub}>Dibujos originales</Text>}
        </Pressable>

        <Pressable
          onPress={() => navigate('/')}
          style={styles.galleryButton}
          accessibilityLabel="Abrir la galería"
        >
          <Text style={styles.galleryText}>Galería</Text>
          <Text style={styles.galleryArrow}>→</Text>
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            onPress={toggle}
            style={styles.themeButton}
            accessibilityLabel={
              mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
            }
          >
            <Text style={styles.themeIcon}>{mode === 'dark' ? '☀' : '☾'}</Text>
            {!compact && (
              <Text style={styles.themeLabel}>
                {mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => setArtistOpen(true)}
            style={styles.artistButton}
            accessibilityLabel="Conocer al artista"
          >
            <Text style={styles.artistText}>Artista</Text>
          </Pressable>
        </View>
      </View>

      <ArtistDialog visible={artistOpen} onClose={() => setArtistOpen(false)} />
    </View>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    shell: {
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      backgroundColor: colors.bg,
    },
    inner: {
      width: '100%',
      maxWidth: 1120,
      alignSelf: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 24,
      paddingVertical: 14,
    },
    innerCompact: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    brandBlock: {
      marginRight: 4,
    },
    brand: {
      fontFamily: fonts.display,
      fontSize: 24,
      lineHeight: 26,
      letterSpacing: 0.2,
      color: colors.ink,
    },
    brandSub: {
      marginTop: 2,
      fontSize: 9,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      color: colors.muted,
    },
    galleryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 48,
      paddingVertical: 13,
      paddingHorizontal: 22,
      backgroundColor: colors.accent,
    },
    galleryText: {
      fontSize: 14,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: colors.onAccent,
    },
    galleryArrow: {
      fontSize: 16,
      color: colors.onAccent,
    },
    actions: {
      marginLeft: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    themeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      minHeight: 40,
      paddingVertical: 9,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.line,
    },
    themeIcon: {
      fontSize: 13,
      color: colors.ink,
    },
    themeLabel: {
      fontSize: 10,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
      color: colors.ink,
    },
    artistButton: {
      minHeight: 44,
      justifyContent: 'center',
      paddingVertical: 11,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: colors.ink,
    },
    artistText: {
      fontSize: 12,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
      color: colors.ink,
    },
  });
}
