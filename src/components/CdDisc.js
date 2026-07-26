import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Platform } from 'react-native';

/**
 * Early 2000s Rainbow Holographic CD Disc inside a jewel case.
 * Rotates during audio playback.
 */
export default function CdDisc({ uri, title = '', isPlaying = false, size = 160 }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    if (isPlaying) {
      animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3500,
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

  const centerSize = size * 0.32;

  return (
    <View style={[styles.jewelCase, { width: size + 20, height: size + 20 }]}>
      <Animated.View
        style={[
          styles.cdDisc,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {/* Holographic Rainbow Ring Sheen */}
        <View style={[styles.rainbowSheen, { width: size * 0.88, height: size * 0.88, borderRadius: size * 0.44 }]} />
        <View style={[styles.innerDataRing, { width: size * 0.6, height: size * 0.6, borderRadius: size * 0.3 }]} />

        {/* Center Printed Label */}
        <View style={[styles.centerLabel, { width: centerSize, height: centerSize, borderRadius: centerSize / 2 }]}>
          {uri ? (
            <Image source={{ uri }} style={styles.labelImage} />
          ) : (
            <View style={styles.labelFallback} />
          )}
        </View>

        {/* Clear Spindle Hole */}
        <View style={styles.spindleHole} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  jewelCase: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      boxShadow: 'inset 0 0 15px rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.6)',
    }),
  },
  cdDisc: {
    backgroundColor: '#b0c4de',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web' && {
      backgroundImage: 'linear-gradient(135deg, #e6f0fa 0%, #a1c4fd 25%, #c2e9fb 50%, #e6f0fa 75%, #ffd1ff 100%)',
    }),
  },
  rainbowSheen: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...(Platform.OS === 'web' && {
      backgroundImage: 'linear-gradient(45deg, rgba(255,0,128,0.2), rgba(0,255,200,0.2), rgba(255,255,0,0.2))',
    }),
  },
  innerDataRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  centerLabel: {
    backgroundColor: '#0066ff',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  labelImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  labelFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0066ff',
  },
  spindleHole: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0d0e15',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
});
