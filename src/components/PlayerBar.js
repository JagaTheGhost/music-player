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

function RetroBtn({ iconName, onPress, isActive = false, isPlay = false, size = 15, label }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.retroBtn,
        isPlay && styles.retroBtnPlay,
        isActive && styles.retroBtnActive,
        pressed && { transform: [{ scale: 0.93 }] },
      ]}
      accessibilityLabel={label}
    >
      <FlatIcon
        name={iconName}
        size={isPlay ? 18 : size}
        color={isPlay ? '#000000' : isActive ? '#ffaa00' : '#cbd5e1'}
      />
    </Pressable>
  );
}

export default function PlayerBar({
  isDesktop,
  onOpenMobilePlayer,
  onToggleQueue,
  isQueueOpen,
  isInstallable,
  isStandalone,
  onTriggerInstall,
}) {
  const {
    currentSong, isPlaying, isLoading,
    playbackProgress, positionMillis, durationMillis,
    favorites, isShuffle, repeatMode, volume, playbackRate, sleepTimer,
    pauseSong, resumeSong, seekTo, playNext, playPrevious,
    skipForward, skipBackward, toggleFavorite, toggleShuffle, cycleRepeat,
    changeVolume, changePlaybackRate, setSleepTimer,
  } = useAudioPlayer();

  if (!currentSong) return null;

  const isLiked = favorites.includes(currentSong.id);
  const themeColor = '#ffaa00';

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
        <AlbumArt uri={currentSong.cover_url} size={42} title={currentSong.title} isPlaying={isPlaying} />
        <View style={styles.mobileMeta}>
          <Text style={styles.mobileSongTitle} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.mobileArtist} numberOfLines={1}>{currentSong.artist}</Text>
        </View>
        <Pressable
          onPress={(e) => { e.stopPropagation?.(); isPlaying ? pauseSong() : resumeSong(); }}
          style={styles.mobilePlayBtn}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffaa00" />
          ) : (
            <FlatIcon name={isPlaying ? 'pause' : 'play'} size={22} color="#ffaa00" />
          )}
        </Pressable>
        <Pressable
          onPress={(e) => { e.stopPropagation?.(); playNext(false); }}
          style={styles.mobileNextBtn}
        >
          <FlatIcon name="skip-next" size={20} color="#ffffff" />
        </Pressable>

        {!isStandalone && (
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onTriggerInstall(); }}
            style={styles.mobileInstallBtn}
          >
            <FlatIcon name="download" size={14} color="#000000" />
          </Pressable>
        )}

        <View style={styles.mobileProgress} pointerEvents="none">
          <View style={[styles.mobileProgressFill, { width: `${(playbackProgress || 0) * 100}%` }]} />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.barContainer}>
      <View style={styles.masterDeck}>
        {/* Left Track Info & Album Art */}
        <View style={styles.left}>
          <AlbumArt
            uri={currentSong.cover_url}
            size={48}
            title={currentSong.title}
            isPlaying={isPlaying}
          />
          <View style={styles.songMeta}>
            <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
            <Text style={styles.songArtist} numberOfLines={1}>{currentSong.artist}</Text>
          </View>
          <Pressable onPress={() => toggleFavorite(currentSong.id)} style={styles.starBtn}>
            <FlatIcon
              name={isLiked ? 'star' : 'star-outline'}
              size={18}
              color={isLiked ? '#ffaa00' : '#64748b'}
            />
          </Pressable>
        </View>

        {/* Center Transport Controls & VFD Timeline */}
        <View style={styles.center}>
          <View style={styles.controlsRow}>
            <RetroBtn iconName="replay-10" onPress={skipBackward} label="Back 10s" />
            <RetroBtn iconName="shuffle" onPress={toggleShuffle} isActive={isShuffle} label="Shuffle" />
            <RetroBtn iconName="skip-prev" onPress={playPrevious} label="Previous" />

            <RetroBtn
              iconName={isLoading ? 'disc' : isPlaying ? 'pause' : 'play'}
              onPress={isPlaying ? pauseSong : resumeSong}
              isPlay
              label="Play/Pause"
            />

            <RetroBtn iconName="skip-next" onPress={() => playNext(false)} label="Next" />
            <RetroBtn iconName={repeatIconName} onPress={cycleRepeat} isActive={repeatMode !== 'off'} label="Repeat" />
            <RetroBtn iconName="forward-30" onPress={skipForward} label="Forward 30s" />
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.vfdClockBox}>
              <Text style={styles.vfdClockText}>{formatTime(positionMillis)}</Text>
            </View>
            <View style={styles.progressWrapper}>
              <ProgressBar
                progress={playbackProgress}
                onSeek={seekTo}
                color="#ffaa00"
                trackColor="#1c2436"
                height={6}
              />
            </View>
            <View style={styles.vfdClockBox}>
              <Text style={styles.vfdClockText}>{formatTime(durationMillis)}</Text>
            </View>
          </View>
        </View>

        {/* Right Utilities: Volume, VU Meter, Queue & PWA Install */}
        <View style={styles.right}>
          <Pressable
            onPress={onToggleQueue}
            style={[styles.queueBtn, isQueueOpen && styles.queueBtnActive]}
          >
            <FlatIcon name="queue" size={14} color={isQueueOpen ? '#000000' : '#ffaa00'} />
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
            <FlatIcon name="moon" size={12} color={sleepTimer !== null ? '#000000' : '#94a3b8'} />
            <Text style={[styles.rateText, sleepTimer !== null && styles.rateTextActive]}>
              {sleepTimer !== null ? ` ${formatTimer(sleepTimer)}` : ''}
            </Text>
          </Pressable>

          <View style={styles.volumeRow}>
            <FlatIcon name={volume === 0 ? 'volume-mute' : 'volume-high'} size={14} color="#ffaa00" />
            <View style={styles.volumeSlider}>
              <ProgressBar
                progress={volume}
                onSeek={changeVolume}
                color="#ffaa00"
                trackColor="#1c2436"
                height={5}
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
    backgroundColor: '#0b0d12',
  },
  masterDeck: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    height: 82,
    backgroundColor: '#141824',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffaa00',
    gap: 14,
    ...(Platform.OS === 'web' && {
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.8)',
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
    gap: 2,
    minWidth: 0,
  },
  songTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  songArtist: {
    color: '#ffaa00',
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
  vfdClockBox: {
    backgroundColor: '#07090f',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1e2638',
  },
  vfdClockText: {
    color: '#00e5a3',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    width: 38,
    textAlign: 'center',
  },
  progressWrapper: {
    flex: 1,
  },
  retroBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#1b2234',
    borderWidth: 1.5,
    borderColor: '#303b58',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  retroBtnPlay: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffaa00',
    borderColor: '#ffcc00',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 14px rgba(255, 170, 0, 0.6)',
    }),
  },
  retroBtnActive: {
    backgroundColor: '#293552',
    borderColor: '#ffaa00',
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
    backgroundColor: '#1b2234',
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
  queueBtnActive: {
    backgroundColor: '#ffaa00',
  },
  queueBtnText: {
    color: '#ffaa00',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  queueBtnTextActive: {
    color: '#000000',
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
    backgroundColor: '#1b2234',
    borderWidth: 1,
    borderColor: '#2f3b58',
  },
  ratePillActive: {
    backgroundColor: '#ffaa00',
  },
  rateText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  rateTextActive: {
    color: '#000000',
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
    paddingVertical: 8,
    backgroundColor: '#141824',
    borderTopWidth: 2,
    borderTopColor: '#ffaa00',
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
    color: '#ffaa00',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  mobilePlayBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileNextBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileInstallBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#ffaa00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#1c2436',
  },
  mobileProgressFill: {
    height: '100%',
    backgroundColor: '#ffaa00',
  },
});
