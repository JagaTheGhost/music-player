import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import CdDisc from './CdDisc';

const BOOT_MESSAGES = [
  'BOOTING NEBULA DIGITAL AUDIO HARDWARE…',
  'MOUNTING SUPABASE MP3 CLOUD DATABASE…',
  'CALIBRATING 32-BAND FREQUENCY SPECTRUM…',
  'SYNCHRONIZING LOCK SCREEN MEDIA CONTROLS…',
  'OPTICAL MP3 DECK READY • LOADING TRACKS…',
];

export default function Y2kLoadingScreen() {
  const { activeTheme } = useAudioPlayer();
  const themeColor = activeTheme?.color || '#39ff14';
  const themeBg = activeTheme?.darkBg || '#081408';

  const [msgIndex, setMsgIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Cycle terminal boot messages
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % BOOT_MESSAGES.length);
    }, 700);

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    return () => clearInterval(msgInterval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.terminalCard, { borderColor: themeColor + '66' }]}>
        {/* Header LED Bar */}
        <View style={[styles.cardHeader, { borderBottomColor: themeColor + '33' }]}>
          <View style={styles.ledGroup}>
            <View style={[styles.ledDot, { backgroundColor: themeColor }]} />
            <View style={[styles.ledDot, { backgroundColor: '#0066ff' }]} />
            <View style={[styles.ledDot, { backgroundColor: '#ff007f' }]} />
          </View>
          <Text style={[styles.headerTitle, { color: themeColor }]}>Y2K MP3 HARDWARE BOOT</Text>
        </View>

        {/* Spinning CD Laser Visual */}
        <View style={styles.discWrapper}>
          <CdDisc title="BOOT" isPlaying={true} size={110} />
        </View>

        {/* Dynamic Boot Status Terminal Message */}
        <View style={[styles.terminalBox, { backgroundColor: themeBg, borderColor: themeColor + '44' }]}>
          <Text style={[styles.terminalText, { color: themeColor }]}>
            {BOOT_MESSAGES[msgIndex]}
          </Text>
        </View>

        {/* Progress Bar & Percentage */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: themeColor,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={[styles.footerText, { color: themeColor + 'aa' }]}>NEBULA SYSTEM v2.0 • 320 KBPS</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  terminalCard: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: '#0d0e15',
    borderRadius: 14,
    borderWidth: 2,
    padding: 16,
    gap: 14,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 12px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  ledGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ledDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  discWrapper: {
    marginVertical: 6,
  },
  terminalBox: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  terminalText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    textAlign: 'center',
  },
  progressSection: {
    width: '100%',
    gap: 6,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#161b2a',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#242a3f',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  footerText: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
});
