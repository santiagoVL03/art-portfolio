import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  clearToken,
  deleteDrawing,
  fetchDrawings,
  getToken,
  imageUrl,
  uploadDrawing,
  type Drawing,
} from '../api';
import { colors, fonts } from '../theme';

export default function AdminScreen() {
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const token = getToken();

  const load = async () => {
    setLoading(true);
    try {
      setDrawings(await fetchDrawings());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los dibujos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) void load();
  }, [token]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!token) return <Navigate to="/login" replace />;

  const pickFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const selected = input.files?.[0] ?? null;
      setFile(selected);
      setError('');
      setMessage('');
    };
    input.click();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
  };

  const onUpload = async () => {
    if (busy) return;

    if (!file) {
      setError('Elegí una imagen antes de subir.');
      return;
    }
    if (!title.trim()) {
      setError('Poné un título para el dibujo.');
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');
    try {
      await uploadDrawing({ title, description, file });
      resetForm();
      setMessage('Dibujo publicado. Ya se ve en la galería.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos subir el dibujo.');
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (drawing: Drawing) => {
    if (!window.confirm(`¿Borrar "${drawing.title}"? Esta acción no se puede deshacer.`)) return;
    setError('');
    setMessage('');
    try {
      await deleteDrawing(drawing.id);
      setDrawings((previous) => previous.filter((item) => item.id !== drawing.id));
      setMessage('Dibujo eliminado.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos borrar el dibujo.');
    }
  };

  const onLogout = () => {
    clearToken();
    navigate('/login', { replace: true });
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.topbar}>
        <View style={styles.brandGroup}>
          <Text style={styles.brand}>Estudio</Text>
          <Text style={styles.badge}>Panel</Text>
        </View>
        <View style={styles.actions}>
          <Link to="/" style={styles.link}>
            Ver galería
          </Link>
          <Pressable onPress={onLogout} style={styles.ghostButton}>
            <Text style={styles.ghostButtonText}>Salir</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Subir un dibujo</Text>
        <Text style={styles.panelHint}>
          Formatos aceptados: JPG, PNG, WEBP, GIF o AVIF. Hasta 10 MB.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título del dibujo"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción (opcional)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Material, año, unas líneas de contexto…"
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textarea]}
          />
        </View>

        <View style={styles.row}>
          <Pressable style={styles.secondaryButton} onPress={pickFile}>
            <Text style={styles.secondaryButtonText}>Elegir imagen</Text>
          </Pressable>
          <Text style={styles.fileName} numberOfLines={1}>
            {file ? file.name : 'Ningún archivo elegido'}
          </Text>
        </View>

        {!!preview && <Image source={{ uri: preview }} style={styles.preview} resizeMode="cover" />}

        {!!error && <Text style={styles.error}>{error}</Text>}
        {!!message && <Text style={styles.success}>{message}</Text>}

        <Pressable
          style={[styles.primaryButton, busy && styles.buttonBusy]}
          onPress={onUpload}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.primaryButtonText}>Publicar dibujo</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.panelTitle}>Publicados</Text>
        <Text style={styles.count}>{drawings.length}</Text>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      )}

      {!loading && drawings.length === 0 && (
        <Text style={styles.panelHint}>Todavía no subiste ningún dibujo.</Text>
      )}

      <View style={styles.grid}>
        {drawings.map((drawing) => (
          <View key={drawing.id} style={styles.card}>
            <Image
              source={{ uri: imageUrl(drawing.url) }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {drawing.title}
              </Text>
              <Pressable onPress={() => onDelete(drawing)}>
                <Text style={styles.delete}>Borrar</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
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
    paddingTop: 36,
    paddingBottom: 48,
    gap: 28,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: 20,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
  },
  badge: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  link: {
    fontSize: 13,
    color: colors.muted,
    textDecorationLine: 'underline',
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  ghostButtonText: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 28,
    gap: 14,
  },
  panelTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.ink,
  },
  panelHint: {
    fontSize: 13,
    lineHeight: 20,
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
  textarea: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.ink,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  fileName: {
    flexShrink: 1,
    fontSize: 13,
    color: colors.muted,
  },
  preview: {
    width: '100%',
    maxWidth: 320,
    height: 180,
    backgroundColor: colors.accentSoft,
  },
  error: {
    fontSize: 13,
    color: colors.danger,
  },
  success: {
    fontSize: 13,
    color: colors.accent,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    paddingVertical: 14,
    paddingHorizontal: 28,
    minWidth: 200,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBusy: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  count: {
    fontSize: 12,
    color: colors.muted,
    backgroundColor: colors.accentSoft,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  center: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  card: {
    flexBasis: 200,
    flexGrow: 1,
    maxWidth: 240,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.accentSoft,
  },
  cardBody: {
    padding: 12,
    gap: 8,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.ink,
  },
  delete: {
    fontSize: 12,
    color: colors.danger,
    textDecorationLine: 'underline',
  },
});
