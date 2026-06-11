import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import TaskCard from '../components/TaskCard';
import { colors } from '../theme';

export default function DashboardScreen({
  tasks,
  isDemo,
  loading,
  onComplete,
  onRefresh,
}) {
  const pending = tasks.filter((task) => !task.isDone).length;
  const date = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>TODAY ON YOUR FARM</Text>
        <Text style={styles.heading}>Good morning</Text>
        <Text style={styles.date}>{date}</Text>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryValue}>{pending}</Text>
            <Text style={styles.summaryLabel}>tasks remaining</Text>
          </View>
          <View style={styles.weather}>
            <Text style={styles.weatherTemp}>29°C</Text>
            <Text style={styles.weatherLabel}>Clear sky</Text>
          </View>
        </View>
      </View>

      {isDemo && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Preview mode. Pull down to reconnect to your backend.
          </Text>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today’s work</Text>
        <Text style={styles.sectionCount}>{tasks.length} tasks</Text>
      </View>

      {tasks.length ? (
        tasks.map((task) => (
          <TaskCard key={task._id} task={task} onComplete={onComplete} />
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>All clear for today</Text>
          <Text style={styles.emptyText}>No crop tasks are due today.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 110 },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 26,
    marginBottom: 18,
    padding: 22,
  },
  eyebrow: { color: '#BFD6C4', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  heading: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 10 },
  date: { color: '#DDEBDD', fontSize: 14, marginTop: 4 },
  summaryRow: {
    borderTopColor: 'rgba(255,255,255,0.18)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    paddingTop: 18,
  },
  summaryValue: { color: '#FFFFFF', fontSize: 34, fontWeight: '900' },
  summaryLabel: { color: '#DDEBDD', fontSize: 12 },
  weather: { alignItems: 'flex-end' },
  weatherTemp: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  weatherLabel: { color: '#DDEBDD', fontSize: 12, marginTop: 3 },
  notice: {
    backgroundColor: '#FFF4D9',
    borderRadius: 12,
    marginBottom: 18,
    padding: 12,
  },
  noticeText: { color: '#7A5C18', fontSize: 12, lineHeight: 18 },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  sectionCount: { color: colors.muted, fontSize: 12 },
  empty: { alignItems: 'center', paddingVertical: 50 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  emptyText: { color: colors.muted, marginTop: 6 },
});
