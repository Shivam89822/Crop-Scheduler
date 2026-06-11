import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import FarmCard from '../components/FarmCard';
import { colors } from '../theme';

export default function FarmsScreen({ farms, isDemo, onAddCrop, onAddFarm }) {
  const totalArea = farms.reduce((sum, farm) => sum + Number(farm.area || 0), 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>YOUR LAND</Text>
      <Text style={styles.heading}>My farms</Text>
      <Text style={styles.description}>
        {farms.length} farms · {totalArea.toFixed(1)} acres under management
      </Text>

      <View style={styles.actions}>
        <Button title="Add crop" onPress={onAddCrop} style={styles.action} />
        <Button
          title="Add farm"
          onPress={onAddFarm}
          variant="secondary"
          style={styles.action}
        />
      </View>

      {isDemo && <Text style={styles.demoLabel}>Showing preview farms</Text>}
      {farms.map((farm) => <FarmCard key={farm._id} farm={farm} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 110 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  heading: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 8 },
  description: { color: colors.muted, marginTop: 6 },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 26, marginTop: 22 },
  action: { flex: 1 },
  demoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
});
