import React, { useState, useRef } from 'react';
import { View, StyleSheet, PanResponder, Animated, Platform } from 'react-native';

const THUMB_SIZE = 14;

/**
 * A cross-platform seekable progress / volume bar.
 *
 * Props:
 *   progress   {number}   0–1 current fill amount
 *   onSeek     {Function} called with 0–1 value on release
 *   color      {string}   fill / thumb color
 *   trackColor {string}   background track color
 *   height     {number}   track thickness in px
 */
export default function ProgressBar({
  progress = 0,
  onSeek,
  color = '#7c3aed',
  trackColor = 'rgba(255,255,255,0.1)',
  height = 4,
}) {
  const containerWidthRef = useRef(0);
  const startPageXRef = useRef(0);
  const startProgressRef = useRef(0);
  const [localProgress, setLocalProgress] = useState(null);
  const thumbScale = useRef(new Animated.Value(1)).current;

  const clamp = (v) => Math.max(0, Math.min(1, isNaN(v) || !isFinite(v) ? 0 : v));
  const display = clamp(localProgress !== null ? localProgress : (progress || 0));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const w = containerWidthRef.current;
        if (w > 0) {
          const p = clamp(evt.nativeEvent.locationX / w);
          startPageXRef.current = evt.nativeEvent.pageX;
          startProgressRef.current = p;
          setLocalProgress(p);
        }
        Animated.spring(thumbScale, { toValue: 1.6, useNativeDriver: true, friction: 5 }).start();
      },

      onPanResponderMove: (evt) => {
        const w = containerWidthRef.current;
        if (w > 0) {
          const delta = (evt.nativeEvent.pageX - startPageXRef.current) / w;
          setLocalProgress(clamp(startProgressRef.current + delta));
        }
      },

      onPanResponderRelease: (evt) => {
        const w = containerWidthRef.current;
        if (w > 0) {
          const delta = (evt.nativeEvent.pageX - startPageXRef.current) / w;
          const p = clamp(startProgressRef.current + delta);
          setLocalProgress(null);
          onSeek?.(p);
        }
        Animated.spring(thumbScale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
      },

      onPanResponderTerminate: () => {
        setLocalProgress(null);
        Animated.spring(thumbScale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
      },
    })
  ).current;

  return (
    <View
      style={[styles.container, { height: THUMB_SIZE + 8 }]}
      onLayout={(e) => { containerWidthRef.current = e.nativeEvent.layout.width; }}
      {...panResponder.panHandlers}
    >
      {/* Track */}
      <View style={[styles.track, { height, backgroundColor: trackColor, borderRadius: height / 2 }]}>
        <View
          style={[
            styles.fill,
            { width: `${display * 100}%`, backgroundColor: color, borderRadius: height / 2 },
          ]}
        />
      </View>

      {/* Thumb */}
      <Animated.View
        style={[
          styles.thumb,
          {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            left: `${display * 100}%`,
            marginLeft: -(THUMB_SIZE / 2),
            marginTop: -(THUMB_SIZE / 2),
            transform: [{ scale: thumbScale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    backgroundColor: '#ffffff',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 0 6px rgba(255,255,255,0.6)' }
      : { shadowColor: '#fff', shadowOpacity: 0.6, shadowRadius: 6 }
    ),
  },
});
