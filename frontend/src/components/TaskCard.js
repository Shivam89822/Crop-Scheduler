import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shadow } from '../theme';

const categoryColors = {
  IRRIGATION: colors.irrigation,
  FERTILIZER: colors.fertilizer,
  PEST: colors.pest,
  HARVEST: colors.harvest,
  NURSERY: colors.primary,
};

export default function TaskCard({ task, onComplete }) {
  const categoryColor = categoryColors[task.category] || colors.primary;
  const time = new Date(task.dueDate).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <View style={[styles.card, shadow, task.isDone && styles.doneCard]}>
      <View style={[styles.categoryMark, { backgroundColor: categoryColor }]} />
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={[styles.category, { color: categoryColor }]}>
            {task.category}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={[styles.title, task.isDone && styles.doneText]}>{task.title}</Text>
        <Text style={styles.priority}>{task.priority} priority</Text>
      </View>
      <Pressable
        accessibilityLabel={`Mark ${task.title} complete`}
        disabled={task.isDone}
        onPress={() => onComplete(task)}
        style={[styles.check, task.isDone && styles.checked]}
      >
        <Text style={[styles.checkText, task.isDone && styles.checkedText]}>
          {task.isDone ? '✓' : ''}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 112,
    overflow: 'hidden',
    paddingRight: 16,
  },
  doneCard: { opacity: 0.65 },
  categoryMark: { width: 6 },
  content: { flex: 1, justifyContent: 'center', padding: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  category: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  time: { color: colors.muted, fontSize: 12 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 7 },
  priority: { color: colors.muted, fontSize: 12, marginTop: 5 },
  doneText: { textDecorationLine: 'line-through' },
  check: {
    alignSelf: 'center',
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 2,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  checked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkText: { textAlign: 'center' },
  checkedText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
});
