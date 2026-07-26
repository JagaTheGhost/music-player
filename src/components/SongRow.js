import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import AlbumArt from './AlbumArt';
import FlatIcon from './FlatIcon';

/**
 * Early 2000s Y2K SongRow with vector FlatIcons.
 */
export default function SongRow({
  song,
  index,
  isActive,
  isPlaying,
  onPress,
  isLiked,
  onLikePress,
  onAddToPlaylist,
  isDesktop,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const rowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rowOpacity, {
      toValue: 1,
      duration: 180,
      delay: Math.min(index * 12, 350),
      useNativeDriver: true,
    }).start();
  }, []);

  const showPlayIcon = isHovered || (isActive && !isPlaying);

  return (
    <Animated.View style={{ opacity: rowOpacity }}>
      <Pressable
        onPress={onPress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[
          styles.row,
          isHovered && !isActive && styles.rowHovered,
          isActive && styles.rowActive,
        ]}
      >
        {/* Index / Play Flat Icon */}
        <View style={styles.indexCol}>
          {showPlayIcon ? (
            <FlatIcon name="play" size={10} color={isActive ? '#39ff14' : '#ffffff'} />
          ) : (
            <Text style={[styles.indexText, isActive && styles.indexActive]}>
              {index < 10 ? `0${index}` : index}
            </Text>
          )}
        </View>

        {/* Thumbnail */}
        <AlbumArt
          uri={song.cover_url}
          size={36}
          title={song.title}
          isPlaying={isActive && isPlaying}
          style={styles.artCol}
        />

        {/* Title + Artist */}
        <View style={styles.titleCol}>
          <Text style={[styles.songTitle, isActive && styles.songTitleActive]} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>

        {/* Tag (Desktop View only) */}
        {isDesktop && (
          <View style={[styles.tagBadge, isActive && styles.tagBadgeActive]}>
            <Text style={[styles.tagText, isActive && styles.tagTextActive]}>
              {song.language || 'MP3'}
            </Text>
          </View>
        )}

        {/* Album (Desktop Wide only) */}
        {isDesktop && (
          <Text style={styles.albumText} numberOfLines={1}>
            {song.album || 'Single'}
          </Text>
        )}

        {/* Action Buttons Container */}
        <View style={styles.actionsCol}>
          {/* Add to Playlist button */}
          <Pressable
            onPress={(e) => { e.preventDefault?.(); onAddToPlaylist?.(song); }}
            style={styles.addPlaylistBtn}
            accessibilityLabel="Add to playlist"
          >
            <FlatIcon name="add" size={12} color="#39ff14" />
          </Pressable>

          {/* Star Favorite */}
          <Pressable
            onPress={(e) => { e.preventDefault?.(); onLikePress(); }}
            style={styles.starBtn}
          >
            <FlatIcon
              name={isLiked ? 'star' : 'star-outline'}
              size={14}
              color={isLiked ? '#ffcc00' : '#475569'}
            />
          </Pressable>
        </View>

        {/* Duration */}
        {isDesktop && (
          <Text style={[styles.durationText, isActive && styles.durationActive]}>
            {song.duration || '—'}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 2,
    marginBottom: 3,
    gap: 8,
    backgroundColor: '#121522',
    borderWidth: 1,
    borderColor: '#1e2438',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && { cursor: 'pointer', userSelect: 'none' }),
  },
  rowHovered: {
    backgroundColor: '#1a1f33',
    borderColor: '#2d3754',
  },
  rowActive: {
    backgroundColor: '#0044b3',
    borderColor: '#0088ff',
  },
  indexCol: {
    width: 20,
    alignItems: 'center',
  },
  indexText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  indexActive: {
    color: '#39ff14',
  },
  artCol: {
    marginRight: 0,
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  songTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  songTitleActive: {
    color: '#ffffff',
  },
  songArtist: {
    color: '#39ff14',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#1c2236',
  },
  tagBadgeActive: {
    backgroundColor: '#39ff14',
  },
  tagText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '900',
  },
  tagTextActive: {
    color: '#031407',
  },
  albumText: {
    flex: 1,
    color: '#64748b',
    fontSize: 11,
    minWidth: 0,
  },
  actionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addPlaylistBtn: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#1c2236',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationText: {
    width: 36,
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'right',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  durationActive: {
    color: '#ffffff',
  },
});
