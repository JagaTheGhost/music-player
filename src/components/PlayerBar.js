import React from 'react';
import {
  View, Text, StyleSheet, Pressable, ActivityIndicator, Platform,
} from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AlbumArt from './AlbumArt';
import ProgressBar from './ProgressBar';
import Oscilloscope from './Oscilloscope';
import FlatIcon from './FlatIcon';
import { formatTime, formatTimer } from '../utils/format';

function Y2kBtn({ iconName, onPress, isActive = false, isPlay = false, size = 16, label }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.gelBtn,
        isPlay && styles.gelBtnPlay,
        isActive && styles.gelBtnActive,
        pressed && { transform: [{ scale: 0.94 }] },
      ]}
      accessibilityLabel={label}
    >
      <FlatIcon
        name={iconName}
        size={isPlay ? 18 : size}
        color={isPlay ? '#ffffff' : isActive ? '#0066ff' : '#cbd5e1'}
      />
    </Pressable>
  );
}

/**
 * Early 2000s Y2K Player Bar with vector FlatIcons & Dynamic Theme support.
 */
export default function PlayerBar({ isDesktop, onOpenMobilePlayer, onToggleQueue, isQueueOpen }) {
  const {
    currentSong, isPlaying, isLoading,
    playbackProgress, positionMillis, durationMillis,
    favorites, isShuffle, repeatMode, volume, playbackRate, sleepTimer,
    activeTheme,
    pauseSong, resumeSong, seekTo, playNext, playPrevious,
    skipForward, skipBackward, toggleFavorite, toggleShuffle, cycleRepeat,
    changeVolume, changePlaybackRate, setSleepTimer,
  } = useAudioPlayer();

  if (!currentSong) return null;

  const isLiked = favorites.includes(currentSong.id);
  const themeColor = activeTheme?.color || '#39ff14';

  const handleSleepTimerPress = () => {
    const steps = [null, 60, 300, 900, 1800, 3600];
    const ci = sleepTimer === null ? 0 : steps.findIndex(v => v === sleepTimer);
    const next = ci === -1 || ci === steps.length - 1 ? 0 : ci + 1;
    setSleepTimer(steps[next]);
  };

  const handleRatePress = () => {
    const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const ci = rates.indexOf(playbackRate);
    changePlaybackRate(rates[(ci + 1) % rates.length]);
  };

  const repeatIconName = repeatMode === 'one' ? 'repeat-one' : 'repeat';

  if (!isDesktop) {
    return (
      <Pressable style={styles.mobileBar} onPress={onOpenMobilePlayer}>
        <AlbumArt uri={currentSong.cover_url} size={40} title={currentSong.title} isPlaying={isPlaying} />
        <View style={styles.mobileMeta}>
          <Text style={styles.mobileSongTitle} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={[styles.mobileArtist, { color: themeColor }]} numberOfLines={1}>{currentSong.artist}</Text>
        </View>
        <Pressable
          onPress={(e) => { e.stopPropagation?.(); isPlaying ? pauseSong() : resumeSong(); }}
          style={styles.mobilePlayBtn}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={themeColor} />
          ) : (
            <FlatIcon name={isPlaying ? 'pause' : 'play'} size={20} color="#ffffff" />
          )}
        </Pressable>
        <Pressable
          onPress={(e) => { e.stopPropagation?.(); playNext(false); }}
          style={styles.mobileNextBtn}
        >
          <FlatIcon name="skip-next" size={20} color="#ffffff" />
        </Pressable>
        <View style={styles.mobileProgress} pointerEvents="none">
          <View style={[styles.mobileProgressFill, { width: `${(playbackProgress || 0) * 100}%`, backgroundColor: themeColor }]} />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.barContainer}>
      <View style={styles.y2kDeck}>
        {/* Left Track Info */}
        <View style={styles.left}>
          <AlbumArt
            uri={currentSong.cover_url}
            size={46}
            title={currentSong.title}
            isPlaying={isPlaying}
          />
          <View style={styles.songMeta}>
            <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
            <Text style={[styles.songArtist, { color: themeColor }]} numberOfLines={1}>{currentSong.artist}</Text>
          </View>
          <Pressable onPress={() => toggleFavorite(currentSong.id)} style={styles.starBtn}>
            <FlatIcon
              name={isLiked ? 'star' : 'star-outline'}
              size={18}
              color={isLiked ? '#ffcc00' : '#64748b'}
            />
          </Pressable>
        </View>

        {/* Center Transport Controls & Progress */}
        <View style={styles.center}>
          <View style={styles.controlsRow}>
            <Y2kBtn iconName="replay-10" onPress={skipBackward} label="Back 10s" />
            <Y2kBtn iconName="shuffle" onPress={toggleShuffle} isActive={isShuffle} label="Shuffle" />
            <Y2kBtn iconName="skip-prev" onPress={playPrevious} label="Previous" />

            <Y2kBtn
              iconName={isLoading ? 'disc' : isPlaying ? 'pause' : 'play'}
              onPress={isPlaying ? pauseSong : resumeSong}
              isPlay
              label="Play/Pause"
            />

            <Y2kBtn iconName="skip-next" onPress={() => playNext(false)} label="Next" />
            <Y2kBtn iconName={repeatIconName} onPress={cycleRepeat} isActive={repeatMode !== 'off'} label="Repeat" />
            <Y2kBtn iconName="forward-30" onPress={skipForward} label="Forward 30s" />
          </View>

          <View style={styles.timelineRow}>
            <Text style={[styles.lcdTimeText, { color: themeColor }]}>{formatTime(positionMillis)}</Text>
            <View style={styles.progressWrapper}>
              <ProgressBar
                progress={playbackProgress}
                onSeek={seekTo}
                color="#0066ff"
                trackColor="#1a2030"
                height={5}
              />
            </View>
            <Text style={[styles.lcdTimeText, { color: themeColor }]}>{formatTime(durationMillis)}</Text>
          </View>
        </View>

        {/* Right Utilities */}
        <View style={styles.right}>
          {/* Queue Drawer Button */}
          <Pressable
            onPress={onToggleQueue}
            style={[styles.queueBtn, isQueueOpen && styles.queueBtnActive]}
          >
            <FlatIcon name="queue" size={14} color={isQueueOpen ? '#ffffff' : '#94a3b8'} />
            <Text style={[styles.queueBtnText, isQueueOpen && styles.queueBtnTextActive]}>QUEUE</Text>
          </Pressable>

          <View style={styles.eqBox}>
            <Oscilloscope isPlaying={isPlaying} barCount={10} height={22} />
          </View>

          <Pressable onPress={handleRatePress} style={styles.ratePill}>
            <Text style={styles.rateText}>{playbackRate.toFixed(2)}x</Text>
          </Pressable>

          <Pressable
            onPress={handleSleepTimerPress}
            style={[styles.ratePill, sleepTimer !== null && styles.ratePillActive]}
          >
            <FlatIcon name="moon" size={12} color={sleepTimer !== null ? '#ffffff' : '#94a3b8'} />
            <Text style={[styles.rateText, sleepTimer !== null && styles.rateTextActive]}>
              {sleepTimer !== null ? ` ${formatTimer(sleepTimer)}` : ''}
            </Text>
          </Pressable>

          <View style={styles.volumeRow}>
            <FlatIcon name={volume === 0 ? 'volume-mute' : 'volume-high'} size={14} color="#94a3b8" />
            <View style={styles.volumeSlider}>
              <ProgressBar
                progress={volume}
                onSeek={changeVolume}
                color={themeColor}
                trackColor="#1a2030"
                height={4}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 4,
    backgroundColor: '#07090e',
  },
  y2kDeck: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    height: 80,
    backgroundColor: '#121522',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#242a3f',
    gap: 14,
    ...(Platform.OS === 'web' && {
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.7)',
    }),
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  songMeta: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
  songTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  songArtist: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  starBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1.8,
    alignItems: 'center',
    gap: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  lcdTimeText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    width: 36,
  },
  progressWrapper: {
    flex: 1,
  },
  gelBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e2538',
    borderWidth: 1,
    borderColor: '#343e5c',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  gelBtnPlay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066ff',
    borderColor: '#3399ff',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 14px rgba(0, 102, 255, 0.6)',
    }),
  },
  gelBtnActive: {
    backgroundColor: '#0055d4',
    borderColor: '#0088ff',
  },
  right: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  queueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#1c2236',
    borderWidth: 1,
    borderColor: '#2d3754',
  },
  queueBtnActive: {
    backgroundColor: '#0066ff',
    borderColor: '#3399ff',
  },
  queueBtnText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  queueBtnTextActive: {
    color: '#ffffff',
  },
  eqBox: {
    width: 65,
  },
  ratePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#1c2236',
    borderWidth: 1,
    borderColor: '#2d3754',
  },
  ratePillActive: {
    backgroundColor: '#0066ff',
  },
  rateText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  rateTextActive: {
    color: '#ffffff',
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 75,
  },
  volumeSlider: {
    flex: 1,
  },
  mobileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#121522',
    borderTopWidth: 2,
    borderTopColor: '#0066ff',
    gap: 10,
    position: 'relative',
  },
  mobileMeta: {
    flex: 1,
    minWidth: 0,
  },
  mobileSongTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  mobileArtist: {
    fontSize: 11,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  mobilePlayBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileNextBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#1a2030',
  },
  mobileProgressFill: {
    height: '100%',
  },
});
