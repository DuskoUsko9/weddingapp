import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function ThankYouScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>💌</Text>
      <Text style={styles.title}>Poďakovanie</Text>
      <Text style={styles.subtitle}>Dostupné 6.9.2026 od 8:00.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  icon: { fontSize: 48, marginBottom: Spacing.md },
  title: { fontFamily: Typography.heading, fontSize: 24, color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { fontFamily: Typography.body, fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
});
