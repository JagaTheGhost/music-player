import React from 'react';
import {
  View, Text, StyleSheet, Pressable, Modal, ScrollView, Platform,
} from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export default function AddToPlaylistModal({ song, visible, onClose, onCreateNew }) {
  const { playlists, toggleSongInPlaylist } = useAudioPlayer();

  if (!visible || !song) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerIcon}>➕</Text>
              <Text style={styles.title}>ADD TO STEREO PLAYLIST</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Song Meta */}
          <View style={styles.songMetaCard}>
            <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
            <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
          </View>

          {/* Playlists Checklist */}
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {playlists.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No custom playlists created yet</Text>
              </View>
            ) : (
              playlists.map(playlist => {
                const inPlaylist = playlist.songIds.includes(song.id);

                return (
                  <Pressable
                    key={playlist.id}
                    onPress={() => toggleSongInPlaylist(playlist.id, song.id)}
                    style={[styles.playlistRow, inPlaylist && styles.playlistRowActive]}
                  >
                    <Text style={styles.plIcon}>{playlist.icon}</Text>
                    <View style={styles.plMeta}>
                      <Text style={styles.plName}>{playlist.name}</Text>
                      <Text style={styles.plCount}>{playlist.songIds.length} tracks</Text>
                    </View>
                    <View style={[styles.checkbox, inPlaylist && styles.checkboxActive]}>
                      {inPlaylist && <Text style={styles.checkIcon}>✓</Text>}
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          {/* Create New Playlist Option */}
          <Pressable
            onPress={() => { onClose(); onCreateNew(); }}
            style={styles.createNewBtn}
          >
            <Text style={styles.createNewText}>+ CREATE NEW PLAYLIST</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5,7,12,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 380,
    maxHeight: 450,
    backgroundColor: '#141824',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffaa00',
    padding: 18,
    gap: 12,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#263048',
    paddingBottom: 10,
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 14,
  },
  title: {
    color: '#ffaa00',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '800',
  },
  songMetaCard: {
    backgroundColor: '#0a0d14',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#263048',
    gap: 2,
  },
  songTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  songArtist: {
    color: '#ffaa00',
    fontSize: 10,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  scroll: {
    maxHeight: 220,
  },
  scrollContent: {
    gap: 8,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 11,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1b2234',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#263048',
    gap: 10,
  },
  playlistRowActive: {
    borderColor: '#ffaa00',
    backgroundColor: '#232d44',
  },
  plIcon: {
    fontSize: 18,
  },
  plMeta: {
    flex: 1,
    gap: 2,
  },
  plName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  plCount: {
    color: '#94a3b8',
    fontSize: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#303e60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#ffaa00',
    borderColor: '#ffcc00',
  },
  checkIcon: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
  },
  createNewBtn: {
    backgroundColor: '#1b2234',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
  createNewText: {
    color: '#ffaa00',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
