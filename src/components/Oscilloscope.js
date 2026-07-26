import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

/**
 * Winamp-Style Graphic Equalizer Wave Oscilloscope with Dynamic Neon Theme support.
 */
export default function Oscilloscope({ isPlaying = false, barCount = 16, height = 36 }) {
  const { activeTheme } = useAudioPlayer();
  const themeColor = activeTheme?.color || '#39ff14';

  const animValues = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(0.15))
  ).current;

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        animValues.forEach((val) => {
          const randomTarget = Math.random() * 0.85 + 0.15;
          Animated.timing(val, {
            toValue: randomTarget,
            duration: 120,
            useNativeDriver: false,
          }).start();
        });
      }, 130);
    } else {
      animValues.forEach((val) => {
        Animated.timing(val, {
          toValue: 0.1,
          duration: 250,
          useNativeDriver: false,
        }).start();
      });
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, barCount]);

  return (
    <View style={[styles.container, { height }]}>
      {animValues.map((anim, idx) => (
        <View key={idx} style={styles.barSlot}>
          <Animated.View
            style={[
              styles.barFill,
              {
                height: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: themeColor,
                ...(Platform.OS === 'web' && isPlaying && {
                  boxShadow: `0 0 6px ${themeColor}`,
                }),
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: '#0a0d14',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#1e2438',
    gap: 3,
  },
  barSlot: {
    flex: 1,
    height: '100%',
    backgroundColor: '#121624',
    borderRadius: 2,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 2,
  },
});
