import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Platform,
} from 'react-native';
import { useAudioPlayer, THEMES } from '../hooks/useAudioPlayer';
import SongRow from './SongRow';
import LcdDisplay from './LcdDisplay';
import Oscilloscope from './Oscilloscope';
import CdDisc from './CdDisc';
import VinylDisc from './VinylDisc';
import CassetteTape from './CassetteTape';

const VISUALIZERS = [
  { id: 'cd', label: '📀 CD DISC' },
  { id: 'vinyl', label: '🛞 VINYL' },
  { id: 'cassette', label: '📼 CASSETTE' },
  { id: 'spectrum', label: '🌊 SPECTRUM' },
];

function Y2kMainRack({ currentSong, isPlaying, positionMillis, durationMillis, onPlayToggle, songCount, activeTab, isDesktop }) {
  const { themeKey, changeTheme, activeTheme } = useAudioPlayer();
  const [visualizerMode, setVisualizerMode] = useState('cd');
  const themeColor = activeTheme?.color || '#39ff14';

  const renderVisualizer = () => {
    switch (visualizerMode) {
      case 'vinyl':
        return (
          <VinylDisc
            uri={currentSong?.cover_url}
            title={currentSong?.title}
            isPlaying={isPlaying}
            size={isDesktop ? 120 : 95}
          />
        );
      case 'cassette':
        return (
          <CassetteTape
            title={currentSong?.title}
            artist={currentSong?.artist}
            isPlaying={isPlaying}
            size={isDesktop ? 80 : 70}
          />
        );
      case 'spectrum':
        return null;
      case 'cd':
      default:
        return (
          <CdDisc
            uri={currentSong?.cover_url}
            title={currentSong?.title}
            isPlaying={isPlaying}
            size={isDesktop ? 120 : 95}
          />
        );
    }
  };

  return (
    <View style={styles.rackCard}>
      {/* Y2K Green Matrix LCD Screen */}
      <LcdDisplay
        currentSong={currentSong}
        positionMillis={positionMillis}
        durationMillis={durationMillis}
        isPlaying={isPlaying}
      />

      {/* Visualizer Mode & Theme Color Selector Bar */}
      <View style={styles.visBar}>
        <View style={styles.barGroup}>
          <Text style={styles.visLabel}>VISUALIZER:</Text>
          <View style={styles.visPillsRow}>
            {VISUALIZERS.map(vis => (
              <Pressable
                key={vis.id}
                onPress={() => setVisualizerMode(vis.id)}
                style={[styles.visPill, visualizerMode === vis.id && styles.visPillActive]}
              >
                <Text style={[styles.visPillText, visualizerMode === vis.id && styles.visPillTextActive]}>
                  {vis.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Theme Selector */}
        <View style={styles.barGroup}>
          <Text style={styles.visLabel}>THEME:</Text>
          <View style={styles.visPillsRow}>
            {Object.values(THEMES).map(t => (
              <Pressable
                key={t.id}
                onPress={() => changeTheme(t.id)}
                style={[
                  styles.themePill,
                  themeKey === t.id && { borderColor: t.color, backgroundColor: t.color + '22' }
                ]}
              >
                <View style={[styles.themeDot, { backgroundColor: t.color }]} />
                <Text style={[styles.themePillText, themeKey === t.id && { color: t.color }]}>
                  {t.id.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Deck Middle Visualizer Area */}
      <View style={styles.middleDeck}>
        {visualizerMode !== 'spectrum' && (
          <View style={styles.cdBox}>
            {renderVisualizer()}
          </View>
        )}

        {/* Graphic Equalizer / Spectrum Box */}
        <View style={styles.eqBox}>
          <View style={styles.eqTitleRow}>
            <Text style={styles.eqTitleText}>
              {visualizerMode === 'spectrum' ? 'FULL SPECTRUM WAVEFORM • 32 BAND' : 'GRAPHIC EQUALIZER • 10 BAND'}
            </Text>
            <View style={styles.channelBadge}>
              <Text style={[styles.channelText, { color: themeColor }]}>{songCount} TRACKS LOADED</Text>
            </View>
          </View>

          <Oscilloscope
            isPlaying={isPlaying}
            barCount={visualizerMode === 'spectrum' ? (isDesktop ? 36 : 24) : (isDesktop ? 22 : 16)}
            height={visualizerMode === 'spectrum' ? (isDesktop ? 70 : 54) : (isDesktop ? 48 : 36)}
          />

          <View style={styles.rackFooterRow}>
            <Pressable onPress={onPlayToggle} style={styles.aquaPlayBtn}>
              <Text style={styles.aquaPlayBtnText}>{isPlaying ? '⏸ PAUSE DECK' : '▶ PLAY DECK'}</Text>
            </Pressable>
            <Text style={[styles.y2kBadgeText, { color: themeColor }]}>Y2K MP3 SYSTEM</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function TableHeader({ isDesktop }) {
  return (
    <View style={styles.header}>
      <View style={styles.indexColHeader} />
      <View style={styles.artColHeader} />
      <Text style={[styles.headerText, styles.titleColHeader]}>TRACK NAME / ARTIST</Text>
      {isDesktop && <Text style={[styles.headerText, styles.tagColHeader]}>FMT</Text>}
      {isDesktop && <Text style={[styles.headerText, styles.albumColHeader]}>ALBUM</Text>}
      <View style={styles.actionsColHeader} />
      {isDesktop && <Text style={[styles.headerText, styles.durationColHeader]}>TIME</Text>}
    </View>
  );
}

export default function SongList({
  songs,
  loading,
  error,
  activeTab,
  isDesktop,
  currentSong,
  isPlaying,
  positionMillis,
  durationMillis,
  favorites,
  onSongPress,
  onLikePress,
  onAddToPlaylist,
}) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Y2kMainRack
        currentSong={currentSong}
        isPlaying={isPlaying}
        positionMillis={positionMillis}
        durationMillis={durationMillis}
        onPlayToggle={() => currentSong && onSongPress(currentSong)}
        songCount={songs.length}
        activeTab={activeTab}
        isDesktop={isDesktop}
      />

      <TableHeader isDesktop={isDesktop} />
      <View style={styles.divider} />

      {loading ? (
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>READING OPTICAL MP3 DISC…</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>⚠️</Text>
          <Text style={styles.emptyTitle}>Disc Read Error</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
        </View>
      ) : songs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💾</Text>
          <Text style={styles.emptyTitle}>No audio tracks found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your channel search</Text>
        </View>
      ) : (
        songs.map((song, idx) => (
          <SongRow
            key={song.id}
            song={song}
            index={idx + 1}
            isActive={currentSong?.id === song.id}
            isPlaying={currentSong?.id === song.id && isPlaying}
            onPress={() => onSongPress(song)}
            isLiked={favorites.includes(song.id)}
            onLikePress={() => onLikePress(song.id)}
            onAddToPlaylist={onAddToPlaylist}
            isDesktop={isDesktop}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 140,
  },
  rackCard: {
    backgroundColor: '#0f121d',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#242a3f',
    marginVertical: 12,
    padding: 12,
    gap: 10,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 12px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
    }),
  },
  visBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141828',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242a3f',
    flexWrap: 'wrap',
    gap: 8,
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  visLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  visPillsRow: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
  },
  visPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    backgroundColor: '#1c2236',
    borderWidth: 1,
    borderColor: '#2d3754',
  },
  visPillActive: {
    backgroundColor: '#0066ff',
    borderColor: '#3399ff',
  },
  visPillText: {
    color: '#94a3b8',
    fontSize: 8.5,
    fontWeight: '800',
  },
  visPillTextActive: {
    color: '#ffffff',
  },
  themePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    backgroundColor: '#161b2a',
    borderWidth: 1,
    borderColor: '#242e42',
  },
  themeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  themePillText: {
    color: '#94a3b8',
    fontSize: 8.5,
    fontWeight: '900',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  middleDeck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  cdBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  eqBox: {
    flex: 1,
    minWidth: 200,
    gap: 8,
  },
  eqTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eqTitleText: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  channelBadge: {
    backgroundColor: '#1c2236',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  channelText: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  rackFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  aquaPlayBtn: {
    backgroundColor: '#0066ff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3399ff',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 12px rgba(0, 102, 255, 0.5)',
      cursor: 'pointer',
    }),
  },
  aquaPlayBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  y2kBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  headerText: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  indexColHeader: { width: 20 },
  artColHeader: { width: 36 },
  titleColHeader: { flex: 1 },
  tagColHeader: { width: 44 },
  albumColHeader: { flex: 1 },
  actionsColHeader: { width: 52 },
  durationColHeader: { width: 36, textAlign: 'right' },
  divider: {
    height: 1,
    backgroundColor: '#1e2438',
    marginHorizontal: 4,
    marginBottom: 6,
  },
  loadingBox: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  loadingText: {
    color: '#39ff14',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    gap: 6,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
  },
  emptySubtitle: {
    color: '#64748b',
    fontSize: 11,
  },
});
