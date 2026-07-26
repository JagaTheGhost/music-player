import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AudioVisualizer from './AudioVisualizer';

export default function SongCard({ song, index, isActive, isPlaying, onPress, isLiked, onLikePress }) {
  return (
    <TouchableOpacity 
      style={[
        styles.row, 
        isActive && styles.activeRow
      ]} 
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Index Column */}
      <View style={styles.indexCol}>
        {isActive ? (
          <AudioVisualizer isPlaying={isPlaying} isMini={true} />
        ) : (
          <Text style={styles.indexText}>{index + 1}</Text>
        )}
      </View>

      {/* Title & Artist info */}
      <View style={styles.titleCol}>
        <Image 
          source={{ uri: song.cover_url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100' }} 
          style={styles.cover} 
        />
        <View style={styles.info}>
          <Text style={[styles.title, isActive && styles.activeText]} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
      </View>

      {/* Category / Language Column */}
      <View style={styles.categoryCol}>
        <Text style={styles.categoryText}>{song.language}</Text>
      </View>

      {/* Heart Column */}
      <View style={styles.heartCol}>
        <TouchableOpacity 
          style={styles.heartButton} 
          onPress={(e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            onLikePress();
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.heartIcon, isLiked && styles.heartIconActive]}>
            {isLiked ? '💙' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Duration Column */}
      <View style={styles.durationCol}>
        <Text style={styles.durationText}>{song.duration || '--:--'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  activeRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  indexCol: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '500',
  },
  titleCol: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#282828',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#3b82f6', // Spotify Electric Blue theme active song
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 12,
    marginTop: 2,
  },
  categoryCol: {
    flex: 1.5,
    justifyContent: 'center',
  },
  categoryText: {
    color: '#b3b3b3',
    fontSize: 13,
  },
  heartCol: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartButton: {
    padding: 6,
  },
  heartIcon: {
    fontSize: 16,
    color: '#b3b3b3',
  },
  heartIconActive: {
    color: '#3b82f6', // Filled Blue Heart
  },
  durationCol: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  durationText: {
    color: '#b3b3b3',
    fontSize: 13,
  },
});
