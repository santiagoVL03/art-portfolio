import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { artist } from '../content';
import { useTheme } from '../ThemeProvider';
import { fonts, type Palette } from '../theme';
import Dialog from './Dialog';

interface ArtistDialogProps {
  visible: boolean;
  onClose: () => void;
}

export default function ArtistDialog({ visible, onClose }: ArtistDialogProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Dialog visible={visible} onClose={onClose} title="Artista">
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{artist.initials}</Text>
        </View>
        <View style={styles.identityText}>
          <Text style={styles.name}>{artist.name}</Text>
          <Text style={styles.role}>{artist.role}</Text>
        </View>
      </View>

      <Text style={styles.bio}>{artist.bio}</Text>

      <View style={styles.facts}>
        {artist.facts.map((fact) => (
          <View key={fact.label} style={styles.factRow}>
            <Text style={styles.factLabel}>{fact.label}</Text>
            <Text style={styles.factValue}>{fact.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.note}>{artist.note}</Text>
    </Dialog>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    identity: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.line,
    },
    avatarText: {
      fontFamily: fonts.display,
      fontSize: 28,
      color: colors.accent,
    },
    identityText: {
      flexShrink: 1,
      gap: 4,
    },
    name: {
      fontFamily: fonts.display,
      fontSize: 30,
      lineHeight: 34,
      color: colors.ink,
    },
    role: {
      fontSize: 11,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
      color: colors.accent,
    },
    bio: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.ink,
    },
    facts: {
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    factRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.line,
    },
    factLabel: {
      fontSize: 11,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: colors.muted,
    },
    factValue: {
      flexShrink: 1,
      fontSize: 14,
      color: colors.ink,
      textAlign: 'right',
    },
    note: {
      fontSize: 12,
      lineHeight: 19,
      color: colors.muted,
    },
  });
}
