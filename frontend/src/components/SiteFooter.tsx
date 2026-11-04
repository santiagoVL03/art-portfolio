import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../ThemeProvider';
import type { Palette } from '../theme';

export default function SiteFooter() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.shell}>
      <View style={styles.inner}>
        <Text style={styles.copy}>© {new Date().getFullYear()} Estudio</Text>
        <Text style={styles.note}>Dibujos hechos a mano · Piezas originales</Text>
      </View>
    </View>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    shell: {
      borderTopWidth: 1,
      borderTopColor: colors.line,
      backgroundColor: colors.bg,
    },
    inner: {
      width: '100%',
      maxWidth: 1120,
      alignSelf: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      paddingHorizontal: 24,
      paddingVertical: 18,
    },
    copy: {
      fontSize: 12,
      color: colors.muted,
    },
    note: {
      fontSize: 10,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
      color: colors.muted,
    },
  });
}
