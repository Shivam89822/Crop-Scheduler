import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import DashboardScreen from './src/screens/DashboardScreen';
import FarmsScreen from './src/screens/FarmsScreen';
import AddCropScreen from './src/screens/AddCropScreen';
import AddFarmScreen from './src/screens/AddFarmScreen';
import { demoFarms, demoTasks } from './src/data/demoData';
import { api } from './src/services/api';
import { colors } from './src/theme';

const DEMO_USER_ID =
  process.env.EXPO_PUBLIC_DEMO_USER_ID || '665000000000000000000001';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [farms, setFarms] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [farmData, taskData] = await Promise.all([
        api.getFarms(),
        api.getTodayTasks(),
      ]);
      setFarms(farmData);
      setTasks(taskData);
      setIsDemo(false);
    } catch {
      if (!farms.length) setFarms(demoFarms);
      if (!tasks.length) setTasks(demoTasks);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const completeTask = async (task) => {
    setTasks((current) =>
      current.map((item) => item._id === task._id ? { ...item, isDone: true } : item)
    );
    if (!task._id.startsWith('demo-')) {
      try {
        await api.completeTask(task._id);
      } catch {
        setTasks((current) =>
          current.map((item) => item._id === task._id ? { ...item, isDone: false } : item)
        );
      }
    }
  };

  const createFarm = async (farm) => {
    const created = await api.createFarm({ ...farm, userId: DEMO_USER_ID });
    setFarms((current) => [created, ...current.filter((item) => !item._id.startsWith('demo-'))]);
    setIsDemo(false);
  };

  const createCrop = async (crop) => {
    if (crop.farmId.startsWith('demo-')) {
      throw new Error('Connect the backend and add a real farm before creating a crop.');
    }
    await api.createCrop(crop);
    await loadData();
  };

  const content = () => {
    if (loading && !tasks.length && !farms.length) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loaderText}>Preparing your farm plan...</Text>
        </View>
      );
    }

    if (screen === 'addCrop') {
      return <AddCropScreen farms={farms} onBack={() => setScreen('farms')} onSubmit={createCrop} />;
    }
    if (screen === 'addFarm') {
      return <AddFarmScreen onBack={() => setScreen('farms')} onSubmit={createFarm} />;
    }
    if (screen === 'farms') {
      return (
        <FarmsScreen
          farms={farms}
          isDemo={isDemo}
          onAddCrop={() => setScreen('addCrop')}
          onAddFarm={() => setScreen('addFarm')}
        />
      );
    }
    return (
      <DashboardScreen
        isDemo={isDemo}
        loading={loading}
        onComplete={completeTask}
        onRefresh={loadData}
        tasks={tasks}
      />
    );
  };

  const showTabs = screen === 'home' || screen === 'farms';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />
      {content()}
      {showTabs && (
        <View style={styles.tabs}>
          <Tab active={screen === 'home'} label="Today" symbol="T" onPress={() => setScreen('home')} />
          <Tab active={screen === 'farms'} label="My farms" symbol="F" onPress={() => setScreen('farms')} />
        </View>
      )}
    </SafeAreaView>
  );
}

function Tab({ active, label, onPress, symbol }) {
  return (
    <Pressable onPress={onPress} style={styles.tab}>
      <View style={[styles.tabIcon, active && styles.activeTabIcon]}>
        <Text style={[styles.tabSymbol, active && styles.activeTabSymbol]}>{symbol}</Text>
      </View>
      <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  loader: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  loaderText: { color: colors.muted, marginTop: 14 },
  tabs: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    paddingBottom: 10,
    paddingTop: 8,
    position: 'absolute',
    right: 0,
  },
  tab: { alignItems: 'center', flex: 1, minHeight: 56 },
  tabIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 28,
    justifyContent: 'center',
    width: 44,
  },
  activeTabIcon: { backgroundColor: colors.primarySoft },
  tabSymbol: { color: colors.muted, fontSize: 13, fontWeight: '900' },
  activeTabSymbol: { color: colors.primary },
  tabLabel: { color: colors.muted, fontSize: 11, fontWeight: '600', marginTop: 3 },
  activeTabLabel: { color: colors.primary, fontWeight: '800' },
});
