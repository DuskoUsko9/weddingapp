import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { StaticContent } from '../../types/api';

const KEYS = [
  { key: 'parking',       label: 'Parkovanie',  icon: 'map-pin'  as const },
  { key: 'accommodation', label: 'Ubytovanie',   icon: 'home'     as const },
];

function ContentEditor({ contentKey, label, icon }: { contentKey: string; label: string; icon: React.ComponentProps<typeof Feather>['name'] }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', metadata: '' });

  const { data, isLoading } = useQuery<StaticContent>({
    queryKey: ['static', contentKey],
    queryFn: async () => (await apiClient.get(`/static-content/${contentKey}`)).data,
  });

  useEffect(() => {
    if (data) setForm({ title: data.title, content: data.content, metadata: data.metadata ?? '' });
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => apiClient.put(`/static-content/${contentKey}`, {
      title: form.title.trim(),
      content: form.content.trim(),
      metadata: form.metadata.trim() || null,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['static', contentKey] }); setEditing(false); },
  });

  if (isLoading) return <ActivityIndicator color={Colors.primary} style={{ marginVertical: Spacing.md }} />;

  return (
    <View style={s.section}>
      {/* Header */}
      <View style={s.sectionHeader}>
        <View style={[s.sectionIconWrap, { backgroundColor: Colors.primaryFixed }]}>
          <Feather name={icon} size={18} color={Colors.primary} />
        </View>
        <Text style={s.sectionLabel}>{label}</Text>
        {!editing && (
          <TouchableOpacity style={s.editIconBtn} onPress={() => setEditing(true)} activeOpacity={0.7}>
            <Feather name="edit-2" size={15} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {editing ? (
        <View style={s.form}>
          <Text style={s.label}>Nadpis</Text>
          <TextInput style={s.input} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholderTextColor={Colors.onSurfaceVariant} />

          <Text style={s.label}>Obsah</Text>
          <TextInput
            style={[s.input, s.multiline]}
            value={form.content}
            onChangeText={(v) => setForm({ ...form, content: v })}
            multiline
            placeholderTextColor={Colors.onSurfaceVariant}
          />

          <Text style={s.label}>Metadata (JSON, voliteľné)</Text>
          <TextInput
            style={[s.input, s.metaInput]}
            value={form.metadata}
            onChangeText={(v) => setForm({ ...form, metadata: v })}
            multiline
            placeholder='{"key": "value"}'
            placeholderTextColor={Colors.onSurfaceVariant}
          />

          <View style={s.formActions}>
            <TouchableOpacity style={s.cancelBtn} onPress={() => { setEditing(false); if (data) setForm({ title: data.title, content: data.content, metadata: data.metadata ?? '' }); }} activeOpacity={0.7}>
              <Text style={s.cancelBtnText}>Zrušiť</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.saveBtn, mutation.isPending && s.saveBtnDisabled]} onPress={() => mutation.mutate()} disabled={mutation.isPending} activeOpacity={0.8}>
              {mutation.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.saveBtnText}>Uložiť</Text>}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={s.preview}>
          <Text style={s.previewTitle}>{data?.title}</Text>
          <Text style={s.previewContent}>{data?.content}</Text>
          {data?.metadata && (
            <View style={s.metaBadge}>
              <Feather name="code" size={11} color={Colors.outline} />
              <Text style={s.metaBadgeText}>Metadata nastavené</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function AdminStaticContentScreen() {
  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      <Text style={s.pageTitle}>Statický obsah</Text>
      <Text style={s.pageSubtitle}>Texty zobrazované hosťom v aplikácii.</Text>
      {KEYS.map((k) => (
        <ContentEditor key={k.key} contentKey={k.key} label={k.label} icon={k.icon} />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  pageTitle: { fontFamily: Typography.heading, fontSize: 24, color: Colors.onSurface, marginBottom: 4 },
  pageSubtitle: { fontFamily: Typography.body, fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: Spacing.lg },

  section: {
    backgroundColor: Colors.surface, borderRadius: Radius.card,
    marginBottom: Spacing.md, overflow: 'hidden', ...Shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.md,
  },
  sectionIconWrap: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontFamily: Typography.bodySemiBold, fontSize: 16, color: Colors.onSurface, flex: 1 },
  editIconBtn: {
    width: 36, height: 36, borderRadius: Radius.sm,
    backgroundColor: Colors.primaryFixed, alignItems: 'center', justifyContent: 'center',
  },

  preview: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  previewTitle: { fontFamily: Typography.bodyMedium, fontSize: 14, color: Colors.onSurface, marginBottom: 6 },
  previewContent: { fontFamily: Typography.body, fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20 },
  metaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLow, alignSelf: 'flex-start',
    borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4,
  },
  metaBadgeText: { fontFamily: Typography.body, fontSize: 11, color: Colors.outline },

  form: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  label: { fontFamily: Typography.bodyMedium, fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 6 },
  input: {
    backgroundColor: Colors.surfaceContainerHigh, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontFamily: Typography.body, fontSize: 14, color: Colors.onSurface, marginBottom: Spacing.md,
  },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  metaInput: { minHeight: 60, fontFamily: 'monospace', fontSize: 12 },
  formActions: { flexDirection: 'row', gap: Spacing.md },
  cancelBtn: {
    flex: 1, backgroundColor: Colors.surfaceContainerLow, borderRadius: Radius.button,
    paddingVertical: 12, alignItems: 'center',
  },
  cancelBtnText: { fontFamily: Typography.bodyMedium, fontSize: 14, color: Colors.onSurfaceVariant },
  saveBtn: { flex: 2, backgroundColor: Colors.primary, borderRadius: Radius.button, paddingVertical: 12, alignItems: 'center', ...Shadow.card },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { fontFamily: Typography.bodySemiBold, fontSize: 14, color: '#fff' },
});
