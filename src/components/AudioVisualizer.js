import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function AudioVisualizer({ isPlaying, isMini = false }) {
  const barsCount = isMini ? 4 : 8;
  const barHeight = isMini ? 16 : 32;
  const barWidth = isMini ? 2 : 3;
  const barGap = isMini ? 2 : 3;

  // Initialize animated values between 0.15 and 1.0
  const animatedValues = useRef(
    Array.from({ length: barsCount }, () => new Animated.Value(0.15))
  ).current;

  useEffect(() => {
    let active = true;

    const startAnimate = () => {
      animatedValues.forEach((anim) => {
        const pulse = () => {
          if (!active || !isPlaying) return;
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.random() * 0.85 + 0.15,
              duration: Math.random() * 200 + 150,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: Math.random() * 0.85 + 0.15,
              duration: Math.random() * 200 + 150,
              useNativeDriver: false,
            }),
          ]).start(() => {
            if (active && isPlaying) {
              pulse();
            }
          });
        };
        pulse();
      });
    };

    if (isPlaying) {
      startAnimate();
    } else {
      animatedValues.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 0.15,
          duration: 350,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => {
      active = false;
      animatedValues.forEach((anim) => anim.stopAnimation());
    };
  }, [isPlaying]);

  return (
    <View style={[styles.container, { height: barHeight, gap: barGap }]}>
      {animatedValues.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              width: barWidth,
              height: barHeight,
              transform: [
                { scaleY: anim }
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    backgroundColor: '#3b82f6', // Spotify Electric Blue theme
    borderRadius: 1,
  },
});
