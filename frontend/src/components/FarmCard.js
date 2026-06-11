import { StyleSheet, Text, View } from 'react-native';
import { colors, shadow } from '../theme';

export default function FarmCard({ farm }) {
  return (
    <View style={[styles.card, shadow]}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>F</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{farm.name}</Text>
        <Text style={styles.location}>{farm.location}</Text>
      </View>
      <View style={styles.area}>
        <Text style={styles.areaValue}>{farm.area}</Text>
        <Text style={styles.areaUnit}>acres</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  iconText: { color: colors.primary, fontSize: 20, fontWeight: '800' },
  content: { flex: 1, marginLeft: 14 },
  name: { color: colors.text, fontSize: 17, fontWeight: '700' },
  location: { color: colors.muted, fontSize: 13, marginTop: 4 },
  area: { alignItems: 'flex-end' },
  areaValue: { color: colors.primary, fontSize: 20, fontWeight: '800' },
  areaUnit: { color: colors.muted, fontSize: 11 },
});
