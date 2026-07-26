import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { getColorForString } from '../utils/format';

/**
 * Stylish Y2K Alphabet Initial Album Art Component.
 * Displays bold neon-tinted alphabet initial badges for every track.
 */
export default function AlbumArt({ uri, size = 56, title = '', isPlaying = false, style, useImage = false }) {
  const [imgError, setImgError] = useState(false);
  const accentColor = getColorForString(title);
  const initial = title ? title.trim().charAt(0).toUpperCase() : '♪';
  const radius = size * 0.2;
  const fontSize = size * 0.45;

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: radius,
    },
    Platform.OS === 'web'
      ? isPlaying
        ? { boxShadow: `0 0 16px ${accentColor}, 0 4px 14px rgba(0,0,0,0.6)` }
        : { boxShadow: `0 0 8px ${accentColor}44, 0 4px 10px rgba(0,0,0,0.4)` }
      : isPlaying
        ? {
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 8,
          }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 4,
          },
    style,
  ];

  // If explicit useImage prop is true and image exists without error
  if (useImage && !imgError && uri) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri }}
          style={[styles.image, { borderRadius: radius }]}
          onError={() => setImgError(true)}
        />
      </View>
    );
  }

  // Default: Bold Stylish Alphabet Initial Badge
  return (
    <View style={containerStyle}>
      <View style={[styles.badge, { backgroundColor: accentColor, borderRadius: radius }]}>
        <View style={styles.bevelOverlay} />
        <Text style={[styles.initialText, { fontSize }]}>{initial}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bevelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.3)',
  },
  initialText: {
    color: '#ffffff',
    fontWeight: '900',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, sans-serif' : 'System',
    ...(Platform.OS === 'web' && {
      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    }),
  },
});
