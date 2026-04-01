import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function PhotosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📷</Text>
      <Text style={styles.title}>Fotky</Text>
      <Text style={styles.subtitle}>Dostupné v deň svadby 5.9.2026.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  icon: { fontSize: 48, marginBottom: Spacing.md },
  title: { fontFamily: Typography.heading, fontSize: 24, color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { fontFamily: Typography.body, fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
});
