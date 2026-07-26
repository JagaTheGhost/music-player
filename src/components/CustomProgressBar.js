import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

export default function CustomProgressBar({ progress, onSeek }) {
  const [width, setWidth] = useState(0);

  const validProgress = typeof progress === 'number' && !isNaN(progress) ? progress : 0;
  const progressPercent = Math.max(0, Math.min(100, validProgress * 100));

  const handlePress = (e) => {
    if (width === 0) return;
    const touchX = e.nativeEvent.locationX;
    const newProgress = Math.max(0, Math.min(1, touchX / width));
    onSeek(newProgress);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View 
        style={styles.container}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        <View style={styles.backgroundBar}>
          <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
          <View style={[styles.progressKnob, { left: `${progressPercent}%` }]} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 18,
    justifyContent: 'center',
    width: '100%',
    marginVertical: 8,
  },
  backgroundBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3f3f46',
    position: 'relative',
    overflow: 'visible',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#3b82f6', // Spotify Electric Blue Theme
  },
  progressKnob: {
    position: 'absolute',
    top: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    marginLeft: -6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  }
});
