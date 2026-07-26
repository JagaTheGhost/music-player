import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';

/**
 * Early 2000s / 90s Retro Cassette Tape Component.
 * Proportional layout designed to fit cleanly inside visualizer containers.
 */
export default function CassetteTape({ title = '', artist = '', isPlaying = false, size = 80 }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    if (isPlaying) {
      animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: Platform.OS !== 'web',
        })
      );
      animation.start();
    } else {
      spinValue.stopAnimation();
    }
    return () => animation?.stop();
  }, [isPlaying]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const width = size * 1.45;
  const height = size * 0.85;

  return (
    <View style={[styles.cassetteBody, { width, height }]}>
      {/* Corner Pins */}
      <View style={styles.screwTopLeft} />
      <View style={styles.screwTopRight} />

      {/* Cassette Label Box */}
      <View style={styles.labelBox}>
        <View style={styles.labelHeader}>
          <Text style={styles.brandText}>NEBULA C-90</Text>
          <Text style={styles.sideText}>SIDE A</Text>
        </View>

        <View style={styles.handwrittenBox}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title || 'UNTITLED TRACK'}
          </Text>
          <Text style={styles.artistText} numberOfLines={1}>
            {artist || 'UNKNOWN ARTIST'}
          </Text>
        </View>

        {/* Center Transparent Reel Window */}
        <View style={styles.reelWindow}>
          {/* Left Reel */}
          <Animated.View style={[styles.reelHub, { transform: [{ rotate: spin }] }]}>
            <View style={styles.teethContainer}>
              <View style={[styles.tooth, { transform: [{ rotate: '0deg' }] }]} />
              <View style={[styles.tooth, { transform: [{ rotate: '60deg' }] }]} />
              <View style={[styles.tooth, { transform: [{ rotate: '120deg' }] }]} />
            </View>
            <View style={styles.reelCenter} />
          </Animated.View>

          {/* Tape Ribbon Strip */}
          <View style={styles.tapeBridge}>
            <View style={[styles.tapeRibbon, isPlaying && styles.tapeRibbonActive]} />
          </View>

          {/* Right Reel */}
          <Animated.View style={[styles.reelHub, { transform: [{ rotate: spin }] }]}>
            <View style={styles.teethContainer}>
              <View style={[styles.tooth, { transform: [{ rotate: '0deg' }] }]} />
              <View style={[styles.tooth, { transform: [{ rotate: '60deg' }] }]} />
              <View style={[styles.tooth, { transform: [{ rotate: '120deg' }] }]} />
            </View>
            <View style={styles.reelCenter} />
          </Animated.View>
        </View>
      </View>

      {/* Bottom Tape Trap Block */}
      <View style={styles.bottomTrapezoid}>
        <View style={styles.tapeHole} />
        <View style={styles.tapeHole} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cassetteBody: {
    backgroundColor: '#161924',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#343b52',
    padding: 4,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  screwTopLeft: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#475569',
  },
  screwTopRight: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#475569',
  },
  labelBox: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    padding: 3,
    gap: 2,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    justifyContent: 'space-between',
  },
  labelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0066ff',
    paddingBottom: 1,
  },
  brandText: {
    color: '#0f172a',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sideText: {
    color: '#ef4444',
    fontSize: 7,
    fontWeight: '900',
  },
  handwrittenBox: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  titleText: {
    color: '#0044cc',
    fontSize: 9,
    fontWeight: '900',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  artistText: {
    color: '#334155',
    fontSize: 7,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  reelWindow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#090b10',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  reelHub: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  teethContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooth: {
    position: 'absolute',
    width: 18,
    height: 3,
    backgroundColor: '#0f172a',
    borderRadius: 1,
  },
  reelCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#090b10',
    zIndex: 2,
  },
  tapeBridge: {
    flex: 1,
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tapeRibbon: {
    width: '100%',
    height: 2,
    backgroundColor: '#78350f',
    borderRadius: 1,
  },
  tapeRibbonActive: {
    backgroundColor: '#b45309',
  },
  bottomTrapezoid: {
    height: 10,
    backgroundColor: '#121520',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#2d3748',
    marginTop: 2,
  },
  tapeHole: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#090b10',
    borderWidth: 1,
    borderColor: '#475569',
  },
});
