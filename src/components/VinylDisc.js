import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Platform } from 'react-native';

/**
 * Interactive Spinning Vinyl Disc component.
 * Features:
 * - Continuous smooth 360-degree rotation when playing
 * - Vinyl grooves and reflection highlights
 * - Center label with custom album thumbnail or gradient fallback
 */
export default function VinylDisc({ uri, title = '', isPlaying = false, size = 180 }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    if (isPlaying) {
      animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: Platform.OS !== 'web',
        })
      );
      animation.start();
    } else {
      rotateAnim.stopAnimation();
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isPlaying]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const centerSize = size * 0.35;

  return (
    <View style={[styles.outerShadow, { width: size, height: size, borderRadius: size / 2 }]}>
      <Animated.View
        style={[
          styles.disc,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {/* Vinyl Grooves & Sheen */}
        <View style={[styles.groove1, { width: size * 0.9, height: size * 0.9, borderRadius: size * 0.45 }]} />
        <View style={[styles.groove2, { width: size * 0.75, height: size * 0.75, borderRadius: size * 0.375 }]} />
        <View style={[styles.groove3, { width: size * 0.6, height: size * 0.6, borderRadius: size * 0.3 }]} />

        {/* Center Label */}
        <View style={[styles.centerLabel, { width: centerSize, height: centerSize, borderRadius: centerSize / 2 }]}>
          {uri ? (
            <Image source={{ uri }} style={styles.centerImage} />
          ) : (
            <View style={styles.centerFallback}>
              <View style={styles.centerDot} />
            </View>
          )}
        </View>

        {/* Center Spindle Hole */}
        <View style={styles.spindleHole} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerShadow: {
    backgroundColor: '#0a0a10',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 12px 40px rgba(0, 240, 255, 0.25), 0 0 20px rgba(255, 0, 127, 0.2)' }
      : { shadowColor: '#00f0ff', shadowOpacity: 0.5, shadowRadius: 16, elevation: 12 }),
  },
  disc: {
    backgroundColor: '#111218',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    position: 'relative',
  },
  groove1: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  groove2: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  groove3: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  centerLabel: {
    backgroundColor: '#8a2be2',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#00f0ff',
  },
  centerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  centerFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ff007f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  spindleHole: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#07070e',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
});
