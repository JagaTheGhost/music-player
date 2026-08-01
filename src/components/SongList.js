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
import Y2kLoadingScreen from './Y2kLoadingScreen';

const VISUALIZERS = [
  { id: 'cassette', label: '📼 CASSETTE' },
  { id: 'vinyl', label: '🛞 VINYL' },
  { id: 'cd', label: '📀 CD DISC' },
  { id: 'spectrum', label: '🌊 SPECTRUM' },
];

function RetroMainDeck({ currentSong, isPlaying, positionMillis, durationMillis, onPlayToggle, songCount, activeTab, isDesktop }) {
  const { themeKey, changeTheme, activeTheme } = useAudioPlayer();
  const [visualizerMode, setVisualizerMode] = useState('cassette');
  const themeColor = '#ffaa00';

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
      case 'cd':
        return (
          <CdDisc
            uri={currentSong?.cover_url}
            title={currentSong?.title}
            isPlaying={isPlaying}
            size={isDesktop ? 120 : 95}
          />
        );
      case 'spectrum':
        return null;
      case 'cassette':
      default:
        return (
          <CassetteTape
            title={currentSong?.title}
            artist={currentSong?.artist}
            isPlaying={isPlaying}
            size={isDesktop ? 85 : 72}
          />
        );
    }
  };

  return (
    <View style={styles.rackCard}>
      {/* VFD Screen / LCD Meter */}
      <LcdDisplay
        currentSong={currentSong}
        positionMillis={positionMillis}
        durationMillis={durationMillis}
        isPlaying={isPlaying}
      />

      {/* Visualizer Mode & Theme Selector Bar */}
      <View style={styles.visBar}>
        <View style={styles.barGroup}>
          <Text style={styles.visLabel}>STEREO VISUALIZER:</Text>
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
          <Text style={styles.visLabel}>THEME ACCENT:</Text>
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

      {/* Middle Deck Area */}
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
              {visualizerMode === 'spectrum' ? 'DUAL STEREO SPECTRUM • 32 BAND' : 'DUAL ANALOG VU METER • 10 BAND'}
            </Text>
            <View style={styles.channelBadge}>
              <Text style={styles.channelText}>{songCount} TRACKS READY</Text>
            </View>
          </View>

          <Oscilloscope
            isPlaying={isPlaying}
            barCount={visualizerMode === 'spectrum' ? (isDesktop ? 36 : 24) : (isDesktop ? 22 : 16)}
            height={visualizerMode === 'spectrum' ? (isDesktop ? 70 : 54) : (isDesktop ? 48 : 36)}
          />

          <View style={styles.rackFooterRow}>
            <Pressable onPress={onPlayToggle} style={styles.playDeckBtn}>
              <Text style={styles.playDeckBtnText}>{isPlaying ? '⏸ PAUSE STEREO DECK' : '▶ PLAY STEREO DECK'}</Text>
            </Pressable>
            <Text style={styles.retroBadgeText}>RETRO HI-FI SYSTEM</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function TableHeader({ isDesktop }) {
  return (
    <View style={styles.header}>
      <Text style={[styles.headerText, styles.indexColHeader]}>#</Text>
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
      <RetroMainDeck
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
        <Y2kLoadingScreen />
      ) : error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>⚠️</Text>
          <Text style={styles.emptyTitle}>Hardware Disc Error</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
        </View>
      ) : songs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📼</Text>
          <Text style={styles.emptyTitle}>No audio tracks found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search or channel select</Text>
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
    backgroundColor: '#101420',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffaa00',
    marginVertical: 12,
    padding: 12,
    gap: 10,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
    }),
  },
  visBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161c2c',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#232d44',
    flexWrap: 'wrap',
    gap: 8,
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  visLabel: {
    color: '#94a3b8',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  visPillsRow: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
  },
  visPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#1f283e',
    borderWidth: 1,
    borderColor: '#303e60',
  },
  visPillActive: {
    backgroundColor: '#ffaa00',
    borderColor: '#ffcc00',
  },
  visPillText: {
    color: '#cbd5e1',
    fontSize: 8.5,
    fontWeight: '800',
  },
  visPillTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  themePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#1b2234',
    borderWidth: 1,
    borderColor: '#293550',
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
    color: '#94a3b8',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  channelBadge: {
    backgroundColor: '#1c2438',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
  channelText: {
    color: '#ffaa00',
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
  playDeckBtn: {
    backgroundColor: '#ffaa00',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffcc00',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 12px rgba(255, 170, 0, 0.5)',
      cursor: 'pointer',
    }),
  },
  playDeckBtnText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  retroBadgeText: {
    color: '#00e5a3',
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
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  indexColHeader: { width: 22, textAlign: 'center' },
  artColHeader: { width: 38 },
  titleColHeader: { flex: 1 },
  tagColHeader: { width: 44 },
  albumColHeader: { flex: 1 },
  actionsColHeader: { width: 52 },
  durationColHeader: { width: 36, textAlign: 'right' },
  divider: {
    height: 1,
    backgroundColor: '#1c2438',
    marginHorizontal: 4,
    marginBottom: 6,
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
