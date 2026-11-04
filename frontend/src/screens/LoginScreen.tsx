import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getToken, login } from '../api';
import { useTheme } from '../ThemeProvider';
import { fonts, type Palette } from '../theme';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const signedIn = !!getToken();

  if (signedIn) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos iniciar sesión.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Acceso privado</Text>
        <Text style={styles.title}>Entrar al estudio</Text>
        <Text style={styles.hint}>
          Este espacio es solo para subir y ordenar los dibujos del portafolio.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="tu usuario"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={colors.muted}
            onSubmitEditing={onSubmit}
            style={styles.input}
          />
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, busy && styles.buttonBusy]}
          onPress={onSubmit}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color={colors.onAccent} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>

        <Link to="/" style={styles.link}>
          Volver a la galería
        </Link>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    page: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    card: {
      width: '100%',
      maxWidth: 410,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 2,
      padding: 32,
      gap: 14,
    },
    eyebrow: {
      fontSize: 11,
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
    hint: {
      marginBottom: 6,
      fontSize: 14,
      lineHeight: 22,
      color: colors.muted,
    },
    field: {
      gap: 6,
    },
    label: {
      fontSize: 11,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: colors.muted,
    },
    input: {
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.line,
      paddingVertical: 12,
      paddingHorizontal: 14,
      fontSize: 15,
      color: colors.ink,
    },
    error: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.danger,
    },
    button: {
      marginTop: 4,
      backgroundColor: colors.accent,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    buttonBusy: {
      opacity: 0.7,
    },
    buttonText: {
      fontSize: 13,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: colors.onAccent,
    },
    link: {
      marginTop: 8,
      fontSize: 13,
      color: colors.muted,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
  });
}
