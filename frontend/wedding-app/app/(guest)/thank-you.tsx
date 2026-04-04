import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { apiClient } from '../../services/api';
import type { ThankYouMessage } from '../../types/api';

export default function ThankYouScreen() {
  const { isEnabled, isLoading: flagLoading } = useFeatureFlag('thank_you');

  const { data: message, isLoading: msgLoading } = useQuery<ThankYouMessage | null>({
    queryKey: ['thank-you-my'],
    queryFn: async () => (await apiClient.get('/thank-you/my')).data,
    enabled: isEnabled,
  });

  if (flagLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!isEnabled) {
    return (
      <View style={s.center}>
        <View style={s.iconWrap}>
          <Feather name="mail" size={32} color={Colors.onSurfaceVariant} />
        </View>
        <Text style={s.title}>{Copy.thankYou.lockedTitle}</Text>
        <Text style={s.subtitle}>{Copy.thankYou.lockedSubtitle}</Text>
        <View style={s.dateBadge}>
          <Feather name="calendar" size={13} color={Colors.primary} />
          <Text style={s.dateText}>6. september 2026, 8:00</Text>
        </View>
      </View>
    );
  }

  if (msgLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!message) {
    return (
      <View style={s.center}>
        <View style={s.iconWrap}>
          <Feather name="clock" size={32} color={Colors.onSurfaceVariant} />
        </View>
        <Text style={s.title}>Správa sa pripravuje</Text>
        <Text style={s.subtitle}>
          Maťka a Dušan práve píšu vaše osobné poďakovanie. Skúste to znova neskôr.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={s.hero}>
        <View style={[s.iconWrap, s.iconWrapActive]}>
          <Feather name="heart" size={28} color={Colors.primary} />
        </View>
        <Text style={s.heroTitle}>{Copy.thankYou.title}</Text>
        <Text style={s.heroSub}>od Maťky a Dušana</Text>
      </View>

      {/* Message card */}
      <View style={s.card}>
        {message.photoUrl ? (
          <Image
            source={{ uri: message.photoUrl }}
            style={s.photo}
            resizeMode="cover"
          />
        ) : null}
        <View style={s.quoteBar} />
        <Text style={s.messageText}>{message.message}</Text>
        <View style={s.signature}>
          <Text style={s.signatureText}>S láskou,</Text>
          <Text style={s.signatureName}>Maťka & Dušan 💛</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },

  center: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryFixed,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: Spacing.lg,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dateText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.primary,
  },

  hero: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  heroTitle: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  heroSub: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },

  card: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Shadow.card,
  },
  photo: {
    width: '100%',
    height: 220,
  },
  quoteBar: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    marginTop: Spacing.lg,
    marginLeft: Spacing.lg,
  },
  messageText: {
    fontFamily: Typography.body,
    fontSize: 16,
    color: Colors.onSurface,
    lineHeight: 26,
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  signature: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  signatureText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  signatureName: {
    fontFamily: Typography.heading,
    fontSize: 18,
    color: Colors.primary,
    marginTop: 2,
  },
});
