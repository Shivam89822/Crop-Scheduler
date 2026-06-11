import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import Button from '../components/Button';
import FormField from '../components/FormField';
import { colors } from '../theme';

export default function AddFarmScreen({ onBack, onSubmit }) {
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async () => {
    setSaving(true);
    setMessage('');
    try {
      await onSubmit({ name: name.trim(), area: Number(area), location: location.trim() });
      onBack();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>‹ Back to farms</Text>
      </Pressable>
      <Text style={styles.heading}>Add your farm</Text>
      <Text style={styles.description}>
        Keep farm names short and familiar so they are easy to recognize.
      </Text>
      <FormField label="Farm name" onChangeText={setName} placeholder="e.g. Green Field" value={name} />
      <FormField label="Area in acres" keyboardType="decimal-pad" onChangeText={setArea} placeholder="e.g. 4.5" value={area} />
      <FormField label="Village / district" onChangeText={setLocation} placeholder="e.g. Wardha, Maharashtra" value={location} />
      {!!message && <Text style={styles.message}>{message}</Text>}
      <Button
        disabled={!name.trim() || !Number(area) || !location.trim() || saving}
        onPress={submit}
        title={saving ? 'Adding farm...' : 'Add farm'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18 },
  back: { paddingVertical: 10 },
  backText: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  heading: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 10 },
  description: { color: colors.muted, lineHeight: 21, marginBottom: 26, marginTop: 7 },
  message: { color: colors.danger, fontSize: 13, marginBottom: 14 },
});
