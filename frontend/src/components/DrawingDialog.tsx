import { useMemo } from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { imageUrl, type Drawing } from '../api';
import { formatDate } from '../format';
import { useTheme } from '../ThemeProvider';
import { fonts, type Palette } from '../theme';
import Dialog from './Dialog';

interface DrawingDialogProps {
  drawing: Drawing | null;
  onClose: () => void;
}

export default function DrawingDialog({ drawing, onClose }: DrawingDialogProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const wide = width >= 760;

  return (
    <Dialog visible={!!drawing} onClose={onClose} title="Ficha del dibujo" wide={wide}>
      {drawing && (
        <View style={[styles.layout, wide && styles.layoutWide]}>
          <Image
            source={{ uri: imageUrl(drawing.url) }}
            style={[styles.image, wide && styles.imageWide]}
            resizeMode="contain"
            accessibilityLabel={drawing.title}
          />

          <View style={styles.info}>
            <Text style={styles.eyebrow}>Dibujo original</Text>
            <Text style={styles.title}>{drawing.title}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.label}>Publicado</Text>
              <Text style={styles.metaValue}>{formatDate(drawing.createdAt) || '—'}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Descripción</Text>
              <Text style={styles.description}>
                {drawing.description || 'Sin descripción.'}
              </Text>
            </View>

            <Text style={styles.note}>Pieza hecha a mano · Archivo personal</Text>
          </View>
        </View>
      )}
    </Dialog>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    layout: {
      gap: 24,
    },
    layoutWide: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    image: {
      width: '100%',
      height: 260,
      backgroundColor: colors.imageBg,
      borderWidth: 1,
      borderColor: colors.line,
    },
    imageWide: {
      flex: 1.1,
      width: 'auto',
      height: 400,
    },
    info: {
      flex: 1,
      minWidth: 240,
      gap: 14,
    },
    eyebrow: {
      fontSize: 10,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      color: colors.accent,
    },
    title: {
      fontFamily: fonts.display,
      fontSize: 32,
      lineHeight: 38,
      color: colors.ink,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.line,
    },
    label: {
      fontSize: 10,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: colors.muted,
    },
    metaValue: {
      flexShrink: 1,
      fontSize: 13,
      color: colors.ink,
      textAlign: 'right',
    },
    section: {
      gap: 8,
    },
    description: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.ink,
    },
    note: {
      marginTop: 4,
      fontSize: 11,
      letterSpacing: 0.8,
      color: colors.muted,
    },
  });
}
