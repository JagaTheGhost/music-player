import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { formatTime } from '../utils/format';

/**
 * Early 2000s (Y2K) Retro LCD Matrix Screen with Dynamic Neon Theme support.
 */
export default function LcdDisplay({ currentSong, positionMillis, durationMillis, isPlaying }) {
  const { activeTheme } = useAudioPlayer();
  const themeColor = activeTheme?.color || '#39ff14';
  const themeBg = activeTheme?.darkBg || '#081408';

  return (
    <View style={[styles.lcdFrame, { borderColor: themeColor + '44' }]}>
      <View style={[styles.lcdScreen, { backgroundColor: themeBg, borderColor: themeColor + '33' }]}>
        {/* Top Status Bar */}
        <View style={styles.topStatusRow}>
          <View style={styles.statusBadge}>
            <View style={[
              styles.ledDot,
              isPlaying && { backgroundColor: themeColor, ...(Platform.OS === 'web' && { boxShadow: `0 0 8px ${themeColor}` }) }
            ]} />
            <Text style={[styles.statusText, { color: themeColor }]}>{isPlaying ? 'PLAYING' : 'PAUSED'}</Text>
          </View>
          <Text style={[styles.bitrateText, { color: themeColor + 'aa' }]} numberOfLines={1}>320 KBPS • 44.1 KHZ</Text>
        </View>

        {/* Main Title & Artist LCD Text */}
        <View style={styles.metaRow}>
          <Text
            style={[
              styles.songTitleText,
              { color: themeColor },
              Platform.OS === 'web' && { textShadow: `0 0 8px ${themeColor}88` }
            ]}
            numberOfLines={1}
          >
            {currentSong ? currentSong.title : 'NEBULA AUDIO Y2K DECK'}
          </Text>
          <Text style={[styles.artistText, { color: themeColor + 'cc' }]} numberOfLines={1}>
            {currentSong ? currentSong.artist : 'NO TRACK LOADED'}
          </Text>
        </View>

        {/* Digital Clock & Format */}
        <View style={[styles.bottomRow, { borderTopColor: themeColor + '33' }]}>
          <Text style={[styles.digitalClock, { color: themeColor }]}>
            {formatTime(positionMillis)} <Text style={{ color: themeColor + '66' }}>/</Text> {formatTime(durationMillis)}
          </Text>
          <Text style={[styles.formatBadge, { color: themeColor, backgroundColor: themeColor + '22' }]}>MP3</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lcdFrame: {
    backgroundColor: '#0a0d0a',
    borderRadius: 10,
    borderWidth: 2,
    padding: 2,
  },
  lcdScreen: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
    borderWidth: 1,
  },
  topStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ledDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#222222',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    letterSpacing: 0.5,
  },
  bitrateText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  metaRow: {
    gap: 1,
    marginVertical: 2,
  },
  songTitleText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? 'monospace, sans-serif' : 'Courier',
  },
  artistText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    borderTopWidth: 1,
    paddingTop: 4,
  },
  digitalClock: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  formatBadge: {
    fontSize: 8,
    fontWeight: '900',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
});
