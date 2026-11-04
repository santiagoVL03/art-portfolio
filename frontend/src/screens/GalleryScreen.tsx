import { useEffect, useMemo, useState } from 'react';
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
import DrawingDialog from '../components/DrawingDialog';
import { formatDate } from '../format';
import { useTheme } from '../ThemeProvider';
import { fonts, type Palette } from '../theme';

export default function GalleryScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Drawing | null>(null);

  const load = async () => {
    setState('loading');
    setError('');
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
    <>
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Archivo personal</Text>
          <View style={styles.headingRow}>
            <Text style={styles.title}>Dibujos</Text>
            {state === 'ready' && (
              <Text style={styles.count}>
                {drawings.length} {drawings.length === 1 ? 'pieza' : 'piezas'}
              </Text>
            )}
          </View>
          <Text style={styles.subtitle}>
            Una selección de piezas hechas a mano. Sin filtros, sin prisa.
          </Text>
        </View>

        {state === 'loading' && (
          <View style={styles.center}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.muted}>Preparando la galería…</Text>
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
              Estamos preparando las próximas piezas. Volvé pronto para verlas.
            </Text>
          </View>
        )}

        {state === 'ready' && drawings.length > 0 && (
          <View style={styles.grid}>
            {drawings.map((drawing) => (
              <Pressable
                key={drawing.id}
                onPress={() => setSelected(drawing)}
                style={styles.card}
                accessibilityLabel={`Ver la ficha de ${drawing.title}`}
              >
                <Image
                  source={{ uri: imageUrl(drawing.url) }}
                  style={styles.image}
                  resizeMode="cover"
                  accessibilityLabel={drawing.title}
                />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {drawing.title}
                  </Text>
                  {!!drawing.description && (
                    <Text style={styles.cardText} numberOfLines={2}>
                      {drawing.description}
                    </Text>
                  )}
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardDate}>{formatDate(drawing.createdAt)}</Text>
                    <Text style={styles.cardAction}>Ver ficha →</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <DrawingDialog drawing={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    page: {
      flex: 1,
    },
    content: {
      width: '100%',
      maxWidth: 1120,
      alignSelf: 'center',
      paddingHorizontal: 24,
      paddingTop: 44,
      paddingBottom: 56,
    },
    hero: {
      gap: 14,
      paddingBottom: 36,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    eyebrow: {
      fontSize: 11,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: colors.accent,
    },
    headingRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: 16,
    },
    title: {
      fontFamily: fonts.display,
      fontSize: 60,
      lineHeight: 64,
      letterSpacing: -0.5,
      color: colors.ink,
    },
    count: {
      marginBottom: 10,
      paddingVertical: 4,
      paddingHorizontal: 9,
      borderWidth: 1,
      borderColor: colors.line,
      fontSize: 10,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: colors.muted,
    },
    subtitle: {
      maxWidth: 520,
      fontSize: 15,
      lineHeight: 24,
      color: colors.muted,
    },
    grid: {
      marginTop: 32,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 20,
    },
    card: {
      flexBasis: 280,
      flexGrow: 1,
      maxWidth: 340,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: 250,
      backgroundColor: colors.imageBg,
    },
    cardBody: {
      padding: 16,
      gap: 8,
    },
    cardTitle: {
      fontFamily: fonts.display,
      fontSize: 20,
      lineHeight: 25,
      color: colors.ink,
    },
    cardText: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.muted,
    },
    cardFooter: {
      marginTop: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
    cardDate: {
      flexShrink: 1,
      fontSize: 10,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.muted,
    },
    cardAction: {
      fontSize: 10,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: colors.accent,
    },
    center: {
      paddingVertical: 72,
      alignItems: 'center',
      gap: 12,
    },
    muted: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.muted,
      textAlign: 'center',
    },
    empty: {
      marginTop: 32,
      padding: 40,
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.line,
    },
    emptyTitle: {
      fontFamily: fonts.display,
      fontSize: 24,
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
      fontSize: 12,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: colors.onInk,
    },
  });
}
