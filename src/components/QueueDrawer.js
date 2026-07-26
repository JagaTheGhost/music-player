import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, Animated, Platform,
} from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AlbumArt from './AlbumArt';
import FlatIcon from './FlatIcon';

/**
 * Slide-out Up Next Queue Drawer with vector FlatIcons.
 */
export default function QueueDrawer({ visible, onClose }) {
  const {
    currentSong, isPlaying, queue, playSong,
    removeFromQueue, moveInQueue,
  } = useAudioPlayer();

  const slideAnim = useRef(new Animated.Value(340)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 340,
      useNativeDriver: true,
      friction: 8,
      tension: 65,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.drawer,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleBox}>
          <FlatIcon name="queue" size={16} color="#0066ff" />
          <Text style={styles.headerTitle}>UP NEXT QUEUE</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{queue.length}</Text>
          </View>
        </View>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <FlatIcon name="close" size={16} color="#94a3b8" />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Now Playing Section */}
        {currentSong && (
          <View style={styles.nowPlayingSection}>
            <Text style={styles.sectionLabel}>NOW PLAYING</Text>
            <View style={styles.nowPlayingCard}>
              <AlbumArt
                uri={currentSong.cover_url}
                size={44}
                title={currentSong.title}
                isPlaying={isPlaying}
              />
              <View style={styles.meta}>
                <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{currentSong.artist}</Text>
              </View>
              <View style={styles.playingBadge}>
                <Text style={styles.playingText}>{isPlaying ? 'PLAYING' : 'PAUSED'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Up Next List */}
        <Text style={styles.sectionLabel}>UP NEXT ({Math.max(0, queue.length - 1)})</Text>

        {queue.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Queue is empty</Text>
          </View>
        ) : (
          queue.map((song, idx) => {
            const isCurrent = song.id === currentSong?.id;

            return (
              <View
                key={`${song.id}_${idx}`}
                style={[styles.itemRow, isCurrent && styles.itemRowActive]}
              >
                <Pressable
                  onPress={() => playSong(song)}
                  style={styles.itemMain}
                >
                  <AlbumArt uri={song.cover_url} size={34} title={song.title} />
                  <View style={styles.itemMeta}>
                    <Text style={[styles.itemTitle, isCurrent && styles.itemTitleActive]} numberOfLines={1}>
                      {song.title}
                    </Text>
                    <Text style={styles.itemArtist} numberOfLines={1}>{song.artist}</Text>
                  </View>
                </Pressable>

                {/* Controls: Up, Down, Remove */}
                <View style={styles.controlsGroup}>
                  <Pressable
                    disabled={idx === 0}
                    onPress={() => moveInQueue(idx, idx - 1)}
                    style={[styles.actionBtn, idx === 0 && styles.actionBtnDisabled]}
                  >
                    <FlatIcon name="chevron-up" size={12} color={idx === 0 ? '#475569' : '#94a3b8'} />
                  </Pressable>

                  <Pressable
                    disabled={idx === queue.length - 1}
                    onPress={() => moveInQueue(idx, idx + 1)}
                    style={[styles.actionBtn, idx === queue.length - 1 && styles.actionBtnDisabled]}
                  >
                    <FlatIcon name="chevron-down" size={12} color={idx === queue.length - 1 ? '#475569' : '#94a3b8'} />
                  </Pressable>

                  <Pressable
                    onPress={() => removeFromQueue(idx)}
                    style={styles.removeBtn}
                  >
                    <FlatIcon name="trash" size={12} color="#ef4444" />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 60,
    right: 0,
    bottom: 90,
    width: 320,
    backgroundColor: '#0d0f18',
    borderLeftWidth: 2,
    borderLeftColor: '#1e2438',
    zIndex: 100,
    ...(Platform.OS === 'web' && {
      boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2438',
    backgroundColor: '#121522',
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  countBadge: {
    backgroundColor: '#1c2236',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  countText: {
    color: '#39ff14',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  closeBtn: {
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  nowPlayingSection: {
    gap: 6,
    marginBottom: 8,
  },
  sectionLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  nowPlayingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: '#141829',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0066ff',
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  songTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  artist: {
    color: '#39ff14',
    fontSize: 10,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  playingBadge: {
    backgroundColor: '#0066ff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  playingText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#121522',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e2438',
    gap: 8,
  },
  itemRowActive: {
    borderColor: '#0066ff',
    backgroundColor: '#161c30',
  },
  itemMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  itemMeta: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
  itemTitle: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  itemTitleActive: {
    color: '#39ff14',
  },
  itemArtist: {
    color: '#64748b',
    fontSize: 10,
  },
  controlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  actionBtn: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#1c2236',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnDisabled: {
    opacity: 0.3,
  },
  removeBtn: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
  },
});
