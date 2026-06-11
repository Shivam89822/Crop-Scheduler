import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import Button from '../components/Button';
import FormField from '../components/FormField';
import { colors } from '../theme';

export default function AddCropScreen({ farms, onBack, onSubmit }) {
  const [farmId, setFarmId] = useState(farms[0]?._id || '');
  const [type, setType] = useState('CHILLI');
  const [variety, setVariety] = useState('');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async () => {
    setSaving(true);
    setMessage('');
    try {
      await onSubmit({ farmId, type, variety: variety.trim(), sowingDate });
      setMessage('Crop added and schedule generated.');
      setVariety('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const valid = farmId && variety.trim() && sowingDate;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>‹ Back to farms</Text>
      </Pressable>
      <Text style={styles.heading}>Plan a new crop</Text>
      <Text style={styles.description}>
        Add sowing details and the backend will create the complete work schedule.
      </Text>

      <Text style={styles.label}>Select farm</Text>
      <View style={styles.options}>
        {farms.map((farm) => (
          <Pressable
            key={farm._id}
            onPress={() => setFarmId(farm._id)}
            style={[styles.option, farmId === farm._id && styles.optionSelected]}
          >
            <Text style={[styles.optionText, farmId === farm._id && styles.optionTextSelected]}>
              {farm.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Crop type</Text>
      <View style={styles.options}>
        {['CHILLI', 'COTTON'].map((cropType) => (
          <Pressable
            key={cropType}
            onPress={() => setType(cropType)}
            style={[styles.option, type === cropType && styles.optionSelected]}
          >
            <Text style={[styles.optionText, type === cropType && styles.optionTextSelected]}>
              {cropType === 'CHILLI' ? 'Chilli' : 'Cotton'}
            </Text>
          </Pressable>
        ))}
      </View>

      <FormField
        label="Variety"
        onChangeText={setVariety}
        placeholder={type === 'CHILLI' ? 'e.g. LCA 334' : 'e.g. Bt Cotton'}
        value={variety}
      />
      <FormField
        label="Sowing date (YYYY-MM-DD)"
        onChangeText={setSowingDate}
        placeholder="2026-06-11"
        value={sowingDate}
      />

      {!!message && <Text style={styles.message}>{message}</Text>}
      <Button
        disabled={!valid || saving}
        onPress={submit}
        title={saving ? 'Creating schedule...' : 'Create crop schedule'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 60 },
  back: { paddingVertical: 10 },
  backText: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  heading: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 10 },
  description: { color: colors.muted, lineHeight: 21, marginBottom: 26, marginTop: 7 },
  label: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  option: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { color: colors.text, fontWeight: '600' },
  optionTextSelected: { color: '#FFFFFF' },
  message: { color: colors.primary, fontSize: 13, marginBottom: 14 },
});
