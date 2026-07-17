import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [isChecking, setIsChecking] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkConnection();
    startPulse();
    return () => pulseAnim.stopAnimation();
  }, []);

  const checkConnection = async () => {
    try {
      const res = await fetch('https://jarvis-server-production-692e.up.railway.app/api');
      const data = await res.json();
      setIsConnected(data.status === 'ok');
    } catch(_) { setIsConnected(false); }
    setIsChecking(false);
  };

  const startPulse = () => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
    ])).start();
  };

  if (isChecking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Jarvis</Text>
          <Text style={styles.loadingSubtext}>Initializing...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#00e676' : '#e74c3c' }]} />
          <Text style={styles.statusText}>{isConnected ? 'Connected' : 'Offline'}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.avatarContainer}>
          <Animated.View style={[styles.pulseRing, { opacity: pulseAnim }]} />
          <View style={styles.avatar}>
            <Ionicons name="sparkles" size={48} color="#6c5ce7" />
          </View>
        </View>
        <Text style={styles.greeting}>I'm listening</Text>
        <Text style={styles.subtitle}>What can I help you with?</Text>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/chat')}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#6c5ce7" />
            <Text style={styles.quickActionText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="time-outline" size={20} color="#6c5ce7" />
            <Text style={styles.quickActionText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/settings')}>
            <Ionicons name="bulb-outline" size={20} color="#6c5ce7" />
            <Text style={styles.quickActionText}>Skills</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.micButton} onPress={() => router.push('/chat')} activeOpacity={0.7}>
          <Ionicons name="chatbubble-ellipses" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.micHint}>Tap to talk to Jarvis</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 36, fontWeight: 'bold', color: '#6c5ce7', letterSpacing: 2 },
  loadingSubtext: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  avatarContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  pulseRing: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(108,92,231,0.15)' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(108,92,231,0.2)', justifyContent: 'center', alignItems: 'center' },
  greeting: { fontSize: 28, fontWeight: '600', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 40 },
  quickActions: { flexDirection: 'row', gap: 16 },
  quickAction: { alignItems: 'center', gap: 6 },
  quickActionText: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  bottomArea: { alignItems: 'center', paddingBottom: 40 },
  micButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#6c5ce7', justifyContent: 'center', alignItems: 'center', shadowColor: '#6c5ce7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  micHint: { fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 12 },
});