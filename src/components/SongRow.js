import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import AlbumArt from './AlbumArt';
import FlatIcon from './FlatIcon';

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
        {/* Index / Play Icon */}
        <View style={styles.indexCol}>
          {showPlayIcon ? (
            <FlatIcon name="play" size={10} color={isActive ? '#ffaa00' : '#ffffff'} />
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

        {/* Tag / Format */}
        {isDesktop && (
          <View style={[styles.tagBadge, isActive && styles.tagBadgeActive]}>
            <Text style={[styles.tagText, isActive && styles.tagTextActive]}>
              {song.language || 'MP3'}
            </Text>
          </View>
        )}

        {/* Album */}
        {isDesktop && (
          <Text style={styles.albumText} numberOfLines={1}>
            {song.album || 'Stereo Track'}
          </Text>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsCol}>
          <Pressable
            onPress={(e) => { e.preventDefault?.(); onAddToPlaylist?.(song); }}
            style={styles.addPlaylistBtn}
            accessibilityLabel="Add to playlist"
          >
            <FlatIcon name="add" size={12} color="#ffaa00" />
          </Pressable>

          <Pressable
            onPress={(e) => { e.preventDefault?.(); onLikePress(); }}
            style={styles.starBtn}
          >
            <FlatIcon
              name={isLiked ? 'star' : 'star-outline'}
              size={14}
              color={isLiked ? '#ffaa00' : '#64748b'}
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
    borderRadius: 6,
    marginHorizontal: 2,
    marginBottom: 3,
    gap: 8,
    backgroundColor: '#121624',
    borderWidth: 1,
    borderColor: '#1e2638',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && { cursor: 'pointer', userSelect: 'none' }),
  },
  rowHovered: {
    backgroundColor: '#192032',
    borderColor: '#ffaa00',
  },
  rowActive: {
    backgroundColor: '#1f283e',
    borderColor: '#ffaa00',
    borderWidth: 1.5,
  },
  indexCol: {
    width: 22,
    alignItems: 'center',
  },
  indexText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  indexActive: {
    color: '#ffaa00',
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
    fontWeight: '800',
  },
  songArtist: {
    color: '#ffaa00',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#1b2234',
    borderWidth: 1,
    borderColor: '#293550',
  },
  tagBadgeActive: {
    backgroundColor: '#ffaa00',
    borderColor: '#ffcc00',
  },
  tagText: {
    color: '#94a3b8',
    fontSize: 8.5,
    fontWeight: '900',
  },
  tagTextActive: {
    color: '#000000',
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
    backgroundColor: '#1b2234',
    borderWidth: 1,
    borderColor: '#2f3b58',
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
