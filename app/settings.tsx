import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    biometricLock: true,
    voiceActivation: false,
    autoListen: true,
    speakResponses: true,
    hapticFeedback: true,
    darkMode: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingRow = ({ icon, label, value, onToggle, danger = false }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={20} color={danger ? '#e74c3c' : 'rgba(255,255,255,0.5)'} />
        <Text style={[styles.settingLabel, danger && { color: '#e74c3c' }]}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(108,92,231,0.4)' }}
        thumbColor={value ? '#6c5ce7' : 'rgba(255,255,255,0.3)'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Security Section */}
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.section}>
          <SettingRow
            icon="lock-closed"
            label="Biometric Lock (Face ID / Touch ID)"
            value={settings.biometricLock}
            onToggle={() => toggleSetting('biometricLock')}
          />
          <View style={styles.settingInfo}>
            <Ionicons name="information-circle" size={14} color="rgba(255,255,255,0.2)" />
            <Text style={styles.settingInfoText}>
              Requires Face ID or Touch ID to unlock Jarvis
            </Text>
          </View>
        </View>

        {/* Voice Section */}
        <Text style={styles.sectionTitle}>Voice</Text>
        <View style={styles.section}>
          <SettingRow
            icon="volume-high"
            label="Speak Responses"
            value={settings.speakResponses}
            onToggle={() => toggleSetting('speakResponses')}
          />
          <SettingRow
            icon="ear"
            label="Always Listen for Wake Word"
            value={settings.voiceActivation}
            onToggle={() => toggleSetting('voiceActivation')}
          />
          <SettingRow
            icon="mic"
            label="Auto-Listen After Response"
            value={settings.autoListen}
            onToggle={() => toggleSetting('autoListen')}
          />
        </View>

        {/* Interaction Section */}
        <Text style={styles.sectionTitle}>Interaction</Text>
        <View style={styles.section}>
          <SettingRow
            icon="phone-portrait"
            label="Haptic Feedback"
            value={settings.hapticFeedback}
            onToggle={() => toggleSetting('hapticFeedback')}
          />
        </View>

        {/* Siri Replacement Guide */}
        <Text style={[styles.sectionTitle, { color: '#a29bfe' }]}>Replace Siri</Text>
        <View style={styles.section}>
          <View style={styles.siriGuideBox}>
            <View style={styles.siriStep}>
              <Text style={styles.siriStepNum}>1</Text>
              <Text style={styles.siriStepText}>Go to <Text style={{fontWeight:'700'}}>Settings → Siri & Search</Text></Text>
            </View>
            <View style={styles.siriStep}>
              <Text style={styles.siriStepNum}>2</Text>
              <Text style={styles.siriStepText}>Turn OFF: <Text style={{fontWeight:'700'}}>"Listen for Hey Siri"</Text></Text>
            </View>
            <View style={styles.siriStep}>
              <Text style={styles.siriStepNum}>3</Text>
              <Text style={styles.siriStepText}>Turn OFF: <Text style={{fontWeight:'700'}}>"Press Side Button for Siri"</Text></Text>
            </View>
            <View style={styles.siriStep}>
              <Text style={styles.siriStepNum}>4</Text>
              <Text style={styles.siriStepText}>Turn OFF: <Text style={{fontWeight:'700'}}>"Allow Siri When Locked"</Text></Text>
            </View>
            <View style={styles.siriDivider} />
            <Text style={styles.siriTipTitle}>⚡ Now set up Jarvis as your default:</Text>
            <View style={styles.siriStep}>
              <Text style={styles.siriStepNum}>→</Text>
              <Text style={styles.siriStepText}><Text style={{fontWeight:'700'}}>Back Tap:</Text> Settings → Accessibility → Touch → Back Tap → Double Tap → Jarvis</Text>
            </View>
            <View style={styles.siriStep}>
              <Text style={styles.siriStepNum}>→</Text>
              <Text style={styles.siriStepText}><Text style={{fontWeight:'700'}}>Lock Screen:</Text> Add Jarvis widget to your lock screen</Text>
            </View>
            <View style={styles.siriStep}>
              <Text style={styles.siriStepNum}>→</Text>
              <Text style={styles.siriStepText}><Text style={{fontWeight:'700'}}>Home Screen:</Text> Put Jarvis in your dock</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.section}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Engine</Text>
            <Text style={styles.aboutValue}>Jarvis Core v1</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Platform</Text>
            <Text style={styles.aboutValue}>iOS (Expo)</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, { color: '#e74c3c' }]}>Data</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerButton}>
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
            <Text style={styles.dangerButtonText}>Clear All Conversations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerButton}>
            <Ionicons name="refresh-outline" size={20} color="#e74c3c" />
            <Text style={styles.dangerButtonText}>Reset Jarvis</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  settingInfoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    flex: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  aboutLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  aboutValue: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  dangerButtonText: {
    fontSize: 14,
    color: '#e74c3c',
  },
  siriGuideBox: {
    padding: 16,
  },
  siriStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  siriStepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(108,92,231,0.2)',
    color: '#a29bfe',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
  },
  siriStepText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  siriDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 12,
  },
  siriTipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a29bfe',
    marginBottom: 12,
  },
});