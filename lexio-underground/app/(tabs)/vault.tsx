import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors, typography, spacing } from '@/theme/tokens';
import { Card } from '@/components/ui';

const MOCK_MEMES = [
  { id: '1', name: 'Saudade', region: 'Brazilian', tag: 'emotion' },
  { id: '2', name: 'Hygge', region: 'Danish', tag: 'lifestyle' },
  { id: '3', name: 'Torschlusspanik', region: 'German', tag: 'time' },
  { id: '4', name: 'Mamihlapinatapai', region: 'Yaghan', tag: 'relationship' },
  { id: '5', name: 'Komorebi', region: 'Japanese', tag: 'nature' },
];

export default function VaultScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stageLabel}>MEME VAULT</Text>
        <Text style={styles.title}>Cultural atoms</Text>
        <Text style={styles.subtitle}>Words that don't translate. Ideas that change you.</Text>
      </View>

      <FlatList
        data={MOCK_MEMES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.memeCard}>
            <Text style={styles.memeName}>{item.name}</Text>
            <View style={styles.memeMeta}>
              <Text style={styles.memeRegion}>{item.region}</Text>
              <Text style={styles.memeTag}>{item.tag}</Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  header: {
    padding: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
  },
  stageLabel: {
    ...typography.caption,
    color: colors.violet,
    letterSpacing: 2,
    marginBottom: spacing[2],
  },
  title: {
    ...typography.h1,
    color: colors.ivory,
  },
  subtitle: {
    ...typography.body,
    color: colors.zinc,
    marginTop: spacing[2],
  },
  list: {
    padding: spacing[4],
    paddingTop: spacing[2],
  },
  row: {
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  memeCard: {
    flex: 1,
    maxWidth: '48%',
  },
  memeName: {
    ...typography.h2,
    color: colors.ivory,
    marginBottom: spacing[2],
  },
  memeMeta: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  memeRegion: {
    ...typography.caption,
    color: colors.violet,
  },
  memeTag: {
    ...typography.caption,
    color: colors.zinc,
  },
});