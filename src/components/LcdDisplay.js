import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { formatTime } from '../utils/format';

export default function LcdDisplay({ currentSong, positionMillis, durationMillis, isPlaying }) {
  const themeColor = '#00e5a3';
  const themeBg = '#06100c';

  return (
    <View style={styles.lcdFrame}>
      <View style={[styles.lcdScreen, { backgroundColor: themeBg }]}>
        {/* Top Status Bar */}
        <View style={styles.topStatusRow}>
          <View style={styles.statusBadge}>
            <View style={[
              styles.ledDot,
              isPlaying && { backgroundColor: themeColor, ...(Platform.OS === 'web' && { boxShadow: `0 0 8px ${themeColor}` }) }
            ]} />
            <Text style={[styles.statusText, { color: themeColor }]}>{isPlaying ? 'DECK PLAYING' : 'DECK PAUSED'}</Text>
          </View>
          <Text style={[styles.bitrateText, { color: themeColor + 'aa' }]} numberOfLines={1}>STEREO 320 KBPS • 44.1 KHZ</Text>
        </View>

        {/* Main Title & Artist VFD Text */}
        <View style={styles.metaRow}>
          <Text
            style={[
              styles.songTitleText,
              { color: themeColor },
              Platform.OS === 'web' && { textShadow: `0 0 8px ${themeColor}aa` }
            ]}
            numberOfLines={1}
          >
            {currentSong ? currentSong.title : 'NEBULA RETRO STEREO DECK'}
          </Text>
          <Text style={[styles.artistText, { color: themeColor + 'cc' }]} numberOfLines={1}>
            {currentSong ? currentSong.artist : 'NO TRACK LOADED'}
          </Text>
        </View>

        {/* Digital Clock & Format */}
        <View style={styles.bottomRow}>
          <Text style={[styles.digitalClock, { color: themeColor }]}>
            {formatTime(positionMillis)} <Text style={{ color: themeColor + '66' }}>/</Text> {formatTime(durationMillis)}
          </Text>
          <Text style={[styles.formatBadge, { color: '#ffaa00', backgroundColor: '#ffaa0022' }]}>HI-FI MP3</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lcdFrame: {
    backgroundColor: '#0a0d0a',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffaa00',
    padding: 2,
  },
  lcdScreen: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#00e5a344',
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
    backgroundColor: '#1b382b',
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
    borderTopColor: '#00e5a333',
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
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
});
