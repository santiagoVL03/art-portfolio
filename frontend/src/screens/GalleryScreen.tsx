import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchDrawings, imageUrl, type Drawing } from '../api';
import { colors, fonts } from '../theme';

export default function GalleryScreen() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const load = async () => {
    setState('loading');
    try {
      setDrawings(await fetchDrawings());
      setState('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los dibujos.');
      setState('error');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.brand}>Estudio</Text>
        <Text style={styles.brandSub}>Dibujos originales</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>Galería</Text>
        <Text style={styles.subtitle}>
          Una selección de dibujos hechos a mano. Sin filtros, sin prisa.
        </Text>
      </View>

      {state === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.muted}>Cargando dibujos…</Text>
        </View>
      )}

      {state === 'error' && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No pudimos cargar la galería</Text>
          <Text style={styles.muted}>{error}</Text>
          <Pressable style={styles.button} onPress={load}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      {state === 'ready' && drawings.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Todavía no hay dibujos publicados</Text>
          <Text style={styles.muted}>
            Entrá al panel privado y subí el primero para que aparezca acá.
          </Text>
        </View>
      )}

      <View style={styles.grid}>
        {drawings.map((drawing) => (
          <View key={drawing.id} style={styles.card}>
            <Image
              source={{ uri: imageUrl(drawing.url) }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={drawing.title}
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{drawing.title}</Text>
              {!!drawing.description && (
                <Text style={styles.cardText}>{drawing.description}</Text>
              )}
              <Text style={styles.cardDate}>{formatDate(drawing.createdAt)}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>Hecho a mano · © {new Date().getFullYear()}</Text>
    </ScrollView>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' });
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: 20,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: 0.2,
  },
  brandSub: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  hero: {
    paddingTop: 56,
    paddingBottom: 40,
    gap: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 56,
    lineHeight: 60,
    color: colors.ink,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.muted,
    maxWidth: 460,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  card: {
    flexBasis: 280,
    flexGrow: 1,
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  image: {
    width: '100%',
    height: 240,
    backgroundColor: colors.accentSoft,
  },
  cardBody: {
    padding: 16,
    gap: 6,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.ink,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
  cardDate: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
    paddingTop: 4,
  },
  center: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  muted: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    backgroundColor: colors.ink,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 1,
  },
});
