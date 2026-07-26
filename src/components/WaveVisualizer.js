import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

/**
 * Multi-bar dynamic animated frequency audio spectrum visualizer.
 */
export default function WaveVisualizer({ isPlaying = false, barCount = 16, height = 28, color = '#00f0ff' }) {
  const animValues = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(4))
  ).current;

  useEffect(() => {
    let animation;
    if (isPlaying) {
      const animations = animValues.map((anim, idx) => {
        const targetHeight = Math.floor(Math.random() * (height - 6)) + 6;
        const speed = 200 + (idx % 5) * 80;

        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: targetHeight,
              duration: speed,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 4,
              duration: speed * 0.9,
              useNativeDriver: false,
            }),
          ])
        );
      });

      animation = Animated.parallel(animations);
      animation.start();
    } else {
      animValues.forEach((anim) => anim.setValue(4));
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isPlaying, barCount, height]);

  return (
    <View style={[styles.container, { height }]}>
      {animValues.map((anim, index) => {
        // Gradient color effect across spectrum
        const isPink = index % 3 === 0;
        const barColor = isPink ? '#ff007f' : color;

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height: anim,
                backgroundColor: barColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    paddingHorizontal: 4,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    minHeight: 3,
  },
});
