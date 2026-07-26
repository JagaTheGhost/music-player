import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import CustomProgressBar from './CustomProgressBar';
import AudioVisualizer from './AudioVisualizer';
import LyricsPanel from './LyricsPanel';

export default function DetailPlayer() {
  const [showLyrics, setShowLyrics] = useState(false);
  const { 
    currentSong, 
    isPlaying, 
    playbackProgress, 
    positionMillis, 
    durationMillis, 
    isLoading, 
    pauseSong, 
    resumeSong, 
    seekTo,
    playNext,
    playPrevious,
    skipForward,
    skipBackward,
    isShuffle,
    toggleShuffle,
    repeatMode,
    cycleRepeat,
    volume,
    changeVolume,
    playbackRate,
    changePlaybackRate,
    sleepTimer,
    setSleepTimer,
    playbackError,
    clearError
  } = useAudioPlayer();

  if (!currentSong) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎵</Text>
        <Text style={styles.emptyTitle}>No Song Selected</Text>
        <Text style={styles.emptySubtitle}>Select a track from the playlist library to start streaming</Text>
      </View>
    );
  }

  const formatTime = (millis) => {
    if (!millis || isNaN(millis)) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatTimer = (secs) => {
    if (secs === null) return '';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTag}>NOW PLAYING</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={() => setShowLyrics(!showLyrics)} 
            style={[styles.lyricsToggleButton, showLyrics && styles.lyricsToggleButtonActive]}
            activeOpacity={0.7}
          >
            <Text style={styles.lyricsToggleText}>
              {showLyrics ? '🎨 Cover' : '📝 Lyrics'}
            </Text>
          </TouchableOpacity>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>HQ STREAM</Text>
          </View>
        </View>
      </View>

      {showLyrics ? (
        <View style={styles.lyricsWrapper}>
          <LyricsPanel />
        </View>
      ) : (
        <Image 
          source={{ uri: currentSong.cover_url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400' }} 
          style={styles.cover} 
        />
      )}

      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={1}>
          {currentSong.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentSong.artist}
        </Text>
        <View style={{ marginTop: 8 }}>
          <AudioVisualizer isPlaying={isPlaying} />
        </View>
      </View>

      <View style={styles.controlsWrapper}>
        <CustomProgressBar progress={playbackProgress} onSeek={seekTo} />
        
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
          <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.auxButton, isShuffle && styles.auxButtonActive]} 
            onPress={toggleShuffle}
            activeOpacity={0.6}
          >
            <Text style={[styles.auxButtonText, isShuffle && styles.auxButtonTextActive]}>🔀</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={skipBackward} style={styles.sideButton} activeOpacity={0.6}>
            <Text style={styles.sideButtonText}>⏪</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={playPrevious} style={styles.sideButton} activeOpacity={0.6}>
            <Text style={styles.sideButtonText}>⏮</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={isPlaying ? pauseSong : resumeSong}
            style={styles.playButton}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text style={styles.playIcon}>
                {isPlaying ? '⏸' : '▶'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => playNext(false)} style={styles.sideButton} activeOpacity={0.6}>
            <Text style={styles.sideButtonText}>⏭</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={skipForward} style={styles.sideButton} activeOpacity={0.6}>
            <Text style={styles.sideButtonText}>⏩</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.auxButton, repeatMode !== 'off' && styles.auxButtonActive]} 
            onPress={cycleRepeat}
            activeOpacity={0.6}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.auxButtonText, repeatMode !== 'off' && styles.auxButtonTextActive]}>
                🔁
              </Text>
              {repeatMode === 'one' && (
                <Text style={styles.repeatOneText}>1</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {playbackError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{playbackError}</Text>
            <TouchableOpacity onPress={clearError} style={styles.errorBannerClose}>
              <Text style={styles.errorBannerCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Volume Slider Row */}
        <View style={styles.volumeRow}>
          <Text style={styles.volumeIcon}>🔈</Text>
          <View style={styles.volumeBarOuter}>
            <CustomProgressBar progress={volume} onSeek={changeVolume} />
          </View>
          <Text style={styles.volumeIcon}>🔊</Text>
        </View>

        {/* Playback speed & Sleep timer row */}
        <View style={styles.extraControlsRow}>
          <TouchableOpacity 
            style={styles.pillControl} 
            onPress={() => {
              const rates = [0.5, 1.0, 1.5, 2.0];
              const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
              changePlaybackRate(rates[nextIdx]);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.pillControlText}>⚡ {playbackRate.toFixed(1)}x</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.pillControl, sleepTimer !== null && styles.pillControlActive]} 
            onPress={() => {
              if (sleepTimer === null) setSleepTimer(60);
              else if (sleepTimer === 60) setSleepTimer(300);
              else if (sleepTimer === 300) setSleepTimer(900);
              else if (sleepTimer === 900) setSleepTimer(1800);
              else if (sleepTimer === 1800) setSleepTimer(3600);
              else setSleepTimer(null);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillControlText, sleepTimer !== null && styles.pillControlTextActive]}>
              🌙 {sleepTimer !== null ? formatTimer(sleepTimer) : 'Timer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lyricsWrapper: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1c1c1e',
    marginBottom: 24,
  },
  auxButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  auxButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  auxButtonText: {
    color: '#b3b3b3',
    fontSize: 16,
  },
  auxButtonTextActive: {
    color: '#3b82f6',
  },
  repeatOneText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#3b82f6',
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 8,
    gap: 12,
  },
  volumeIcon: {
    fontSize: 14,
    color: '#a7a7a7',
  },
  volumeBarOuter: {
    flex: 1,
  },
  extraControlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    gap: 16,
  },
  pillControl: {
    backgroundColor: '#181818',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#282828',
  },
  pillControlActive: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  pillControlText: {
    color: '#b3b3b3',
    fontSize: 11,
    fontWeight: '700',
  },
  pillControlTextActive: {
    color: '#3b82f6',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lyricsToggleButton: {
    backgroundColor: '#181818',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#282828',
  },
  lyricsToggleButtonActive: {
    borderColor: '#3b82f6',
  },
  lyricsToggleText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#121212',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  emptyContainer: {
    backgroundColor: '#121212',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 450,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#b3b3b3',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBanner: {
    backgroundColor: '#7f1d1d',
    borderTopWidth: 1,
    borderTopColor: '#991b1b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  errorBannerText: {
    color: '#fecaca',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  errorBannerClose: {
    marginLeft: 12,
    padding: 4,
  },
  errorBannerCloseText: {
    color: '#fecaca',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  headerTag: {
    color: '#b3b3b3',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  liveBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cover: {
    width: 250,
    height: 250,
    borderRadius: 20,
    backgroundColor: '#282828',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    marginBottom: 24,
  },
  meta: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  controlsWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 16,
  },
  timeText: {
    color: '#a7a7a7',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  sideButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#181818',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#282828',
  },
  sideButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  playIcon: {
    color: '#000000',
    fontSize: 24,
    marginLeft: 2,
  },
});
