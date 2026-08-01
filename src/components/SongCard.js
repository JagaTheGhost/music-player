import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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
      <View style={styles.indexCol}>
        {isActive ? (
          <AudioVisualizer isPlaying={isPlaying} isMini={true} />
        ) : (
          <Text style={styles.indexText}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</Text>
        )}
      </View>

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

      <View style={styles.categoryCol}>
        <Text style={styles.categoryText}>{song.language || 'MP3'}</Text>
      </View>

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
            {isLiked ? '⭐' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

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
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: '#121624',
    borderWidth: 1,
    borderColor: '#1e2638',
  },
  activeRow: {
    backgroundColor: '#1f283e',
    borderColor: '#ffaa00',
  },
  indexCol: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  titleCol: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: '#1a2234',
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  activeText: {
    color: '#ffaa00',
    fontWeight: '800',
  },
  artist: {
    color: '#ffaa00',
    fontSize: 11,
    marginTop: 2,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  categoryCol: {
    flex: 1.5,
    justifyContent: 'center',
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  heartCol: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartButton: {
    padding: 4,
  },
  heartIcon: {
    fontSize: 14,
    color: '#64748b',
  },
  heartIconActive: {
    color: '#ffaa00',
  },
  durationCol: {
    width: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  durationText: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
});
