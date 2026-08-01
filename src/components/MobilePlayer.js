import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, Modal, SafeAreaView,
  ActivityIndicator, Animated, Platform, useWindowDimensions, ScrollView,
} from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import ProgressBar from './ProgressBar';
import Oscilloscope from './Oscilloscope';
import CassetteTape from './CassetteTape';
import FlatIcon from './FlatIcon';
import { formatTime, formatTimer } from '../utils/format';

function MechBtn({ iconName, onPress, isActive = false, isPlay = false, size = 18, label }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.mechBtn,
        isPlay && styles.mechBtnPlay,
        isActive && styles.mechBtnActive,
        pressed && styles.mechBtnPressed,
      ]}
      accessibilityLabel={label}
    >
      <FlatIcon
        name={iconName}
        size={isPlay ? 22 : size}
        color={isPlay ? '#000000' : isActive ? '#ffaa00' : '#cbd5e1'}
      />
    </Pressable>
  );
}

export default function MobilePlayer({ visible, onClose }) {
  const {
    currentSong, isPlaying, isLoading,
    playbackProgress, positionMillis, durationMillis,
    favorites, isShuffle, repeatMode, volume, playbackRate, sleepTimer,
    pauseSong, resumeSong, seekTo, playNext, playPrevious,
    skipForward, skipBackward, toggleFavorite, toggleShuffle, cycleRepeat,
    changeVolume, changePlaybackRate, setSleepTimer,
  } = useAudioPlayer();

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 600,
      useNativeDriver: true,
      friction: 8,
      tension: 65,
    }).start();
  }, [visible]);

  if (!currentSong) return null;

  const isLiked = favorites.includes(currentSong.id);
  const repeatIconName = repeatMode === 'one' ? 'repeat-one' : 'repeat';

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

  // Landscape View
  if (isLandscape) {
    return (
      <Modal
        visible={visible}
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={false}
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[styles.landscapeRoot, { transform: [{ translateY: slideAnim }] }]}>
            <ScrollView
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.landscapeScrollContent}
            >
              <View style={styles.landscapeRow}>
                {/* Left Wing */}
                <View style={styles.landscapeLeft}>
                  <View style={styles.landscapeHeader}>
                    <Pressable onPress={onClose} style={styles.ejectBtn}>
                      <FlatIcon name="chevron-down" size={16} color="#ffaa00" />
                      <Text style={styles.ejectText}>EJECT TAPE</Text>
                    </Pressable>
                    <Text style={styles.deckModelText}>RETRO WALKMAN C-90</Text>
                  </View>

                  <View style={styles.landscapeTapeBox}>
                    <CassetteTape
                      title={currentSong?.title}
                      artist={currentSong?.artist}
                      isPlaying={isPlaying}
                      size={95}
                    />
                  </View>

                  <View style={styles.landscapeEq}>
                    <Oscilloscope isPlaying={isPlaying} barCount={20} height={26} />
                  </View>
                </View>

                {/* Right Wing */}
                <View style={styles.landscapeRight}>
                  <View style={styles.lcdHeader}>
                    <View style={styles.lcdMeta}>
                      <Text style={styles.lcdTitle} numberOfLines={1}>{currentSong.title}</Text>
                      <Text style={styles.lcdArtist} numberOfLines={1}>{currentSong.artist}</Text>
                    </View>
                    <Pressable onPress={() => toggleFavorite(currentSong.id)}>
                      <FlatIcon name={isLiked ? 'star' : 'star-outline'} size={18} color={isLiked ? '#ffaa00' : '#64748b'} />
                    </Pressable>
                  </View>

                  <View style={styles.timeRow}>
                    <Text style={styles.lcdTime}>{formatTime(positionMillis)}</Text>
                    <View style={styles.timelineWrapper}>
                      <ProgressBar progress={playbackProgress} onSeek={seekTo} color="#ffaa00" trackColor="#1c2438" height={5} />
                    </View>
                    <Text style={styles.lcdTime}>{formatTime(durationMillis)}</Text>
                  </View>

                  <View style={styles.landscapeControls}>
                    <MechBtn iconName="shuffle" onPress={toggleShuffle} isActive={isShuffle} label="Shuffle" />
                    <MechBtn iconName="skip-prev" onPress={playPrevious} size={18} label="Previous" />
                    <Pressable
                      onPress={isPlaying ? pauseSong : resumeSong}
                      style={({ pressed }) => [styles.bigPlayBtn, pressed && styles.mechBtnPressed]}
                    >
                      {isLoading ? <ActivityIndicator size="small" color="#000000" /> : <FlatIcon name={isPlaying ? 'pause' : 'play'} size={22} color="#000000" />}
                    </Pressable>
                    <MechBtn iconName="skip-next" onPress={() => playNext(false)} size={18} label="Next" />
                    <MechBtn iconName={repeatIconName} onPress={cycleRepeat} isActive={repeatMode !== 'off'} label="Repeat" />
                  </View>

                  <View style={styles.landscapeSubRow}>
                    <Pressable onPress={handleRatePress} style={styles.pillBtn}>
                      <FlatIcon name="flash" size={12} color="#ffaa00" />
                      <Text style={styles.pillBtnText}>{playbackRate.toFixed(2)}×</Text>
                    </Pressable>

                    <Pressable onPress={handleSleepTimerPress} style={[styles.pillBtn, sleepTimer !== null && styles.pillBtnActive]}>
                      <FlatIcon name="moon" size={12} color={sleepTimer !== null ? '#000000' : '#94a3b8'} />
                      <Text style={[styles.pillBtnText, sleepTimer !== null && styles.pillBtnTextActive]}>
                        {sleepTimer !== null ? ` ${formatTimer(sleepTimer)}` : 'TIMER'}
                      </Text>
                    </Pressable>

                    <View style={styles.volRow}>
                      <FlatIcon name={volume === 0 ? 'volume-mute' : 'volume-high'} size={14} color="#ffaa00" />
                      <View style={{ flex: 1 }}>
                        <ProgressBar progress={volume} onSeek={changeVolume} color="#ffaa00" trackColor="#1c2438" height={4} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    );
  }

  // Portrait View
  return (
    <Modal
      visible={visible}
      animationType="none"
      presentationStyle="overFullScreen"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>

          {/* Top Bar */}
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.ejectBtn}>
              <FlatIcon name="chevron-down" size={18} color="#ffaa00" />
              <Text style={styles.ejectText}>EJECT TAPE</Text>
            </Pressable>

            <View style={styles.brandBadge}>
              <Text style={styles.brandTitleText}>RETRO WALKMAN MP3</Text>
            </View>

            <Pressable onPress={() => toggleFavorite(currentSong.id)} style={styles.starBtn}>
              <FlatIcon name={isLiked ? 'star' : 'star-outline'} size={20} color={isLiked ? '#ffaa00' : '#64748b'} />
            </Pressable>
          </View>

          {/* Cassette Deck Window */}
          <View style={styles.cassetteFrame}>
            <View style={styles.cassetteHeaderRow}>
              <View style={styles.ledDot} />
              <Text style={styles.cassetteStatusText}>{isPlaying ? 'TAPE RUNNING • STEREO' : 'PAUSED • READY'}</Text>
            </View>

            <View style={styles.cassetteWrapper}>
              <CassetteTape
                title={currentSong?.title}
                artist={currentSong?.artist}
                isPlaying={isPlaying}
                size={135}
              />
            </View>
          </View>

          {/* Graphic Equalizer */}
          <View style={styles.eqBox}>
            <Oscilloscope isPlaying={isPlaying} barCount={22} height={32} />
          </View>

          {/* Timeline & Counter */}
          <View style={styles.timeSection}>
            <View style={styles.timeRow}>
              <Text style={styles.lcdTime}>{formatTime(positionMillis)}</Text>
              <Text style={styles.lcdTime}>{formatTime(durationMillis)}</Text>
            </View>
            <ProgressBar
              progress={playbackProgress}
              onSeek={seekTo}
              color="#ffaa00"
              trackColor="#1c2438"
              height={5}
            />
          </View>

          {/* Mechanical Transport Keys */}
          <View style={styles.mechControls}>
            <MechBtn iconName="shuffle" onPress={toggleShuffle} isActive={isShuffle} label="Shuffle" />
            <MechBtn iconName="skip-prev" onPress={playPrevious} size={20} label="Previous" />

            <Pressable
              onPress={isPlaying ? pauseSong : resumeSong}
              style={({ pressed }) => [styles.bigPlayBtn, pressed && styles.mechBtnPressed]}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#000000" />
              ) : (
                <FlatIcon name={isPlaying ? 'pause' : 'play'} size={26} color="#000000" />
              )}
            </Pressable>

            <MechBtn iconName="skip-next" onPress={() => playNext(false)} size={20} label="Next" />
            <MechBtn iconName={repeatIconName} onPress={cycleRepeat} isActive={repeatMode !== 'off'} label="Repeat" />
          </View>

          {/* Speed & Timers */}
          <View style={styles.secondaryControls}>
            <MechBtn iconName="replay-10" onPress={skipBackward} label="Back 10s" />

            <Pressable onPress={handleRatePress} style={styles.pillBtn}>
              <FlatIcon name="flash" size={12} color="#ffaa00" />
              <Text style={styles.pillBtnText}>{playbackRate.toFixed(2)}×</Text>
            </Pressable>

            <Pressable
              onPress={handleSleepTimerPress}
              style={[styles.pillBtn, sleepTimer !== null && styles.pillBtnActive]}
            >
              <FlatIcon name="moon" size={12} color={sleepTimer !== null ? '#000000' : '#94a3b8'} />
              <Text style={[styles.pillBtnText, sleepTimer !== null && styles.pillBtnTextActive]}>
                {sleepTimer !== null ? ` ${formatTimer(sleepTimer)}` : 'TIMER'}
              </Text>
            </Pressable>

            <MechBtn iconName="forward-30" onPress={skipForward} label="Fwd 30s" />
          </View>

          {/* Master Volume */}
          <View style={styles.volumeSection}>
            <FlatIcon name={volume === 0 ? 'volume-mute' : 'volume-high'} size={16} color="#ffaa00" />
            <View style={styles.volumeSlider}>
              <ProgressBar
                progress={volume}
                onSeek={changeVolume}
                color="#ffaa00"
                trackColor="#1c2438"
                height={5}
              />
            </View>
          </View>

        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b0d12',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  ejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#141824',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
  ejectText: {
    color: '#ffaa00',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandBadge: {
    backgroundColor: '#141824',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#242d42',
  },
  brandTitleText: {
    color: '#00e5a3',
    fontSize: 10,
    fontWeight: '900',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  starBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cassetteFrame: {
    backgroundColor: '#101420',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffaa00',
    padding: 10,
    gap: 8,
    alignItems: 'center',
  },
  cassetteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  ledDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00e5a3',
    ...(Platform.OS === 'web' && { boxShadow: '0 0 6px #00e5a3' }),
  },
  cassetteStatusText: {
    color: '#00e5a3',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  cassetteWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  eqBox: {
    marginVertical: 2,
  },
  timeSection: {
    gap: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lcdTime: {
    color: '#00e5a3',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  mechControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mechBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#141824',
    borderWidth: 1.5,
    borderColor: '#263048',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  mechBtnActive: {
    backgroundColor: '#232d44',
    borderColor: '#ffaa00',
  },
  mechBtnPressed: {
    transform: [{ scale: 0.94 }],
  },
  bigPlayBtn: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#ffaa00',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffcc00',
    ...(Platform.OS === 'web' && { boxShadow: '0 0 16px rgba(255, 170, 0, 0.6)' }),
  },
  secondaryControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#141824',
    borderWidth: 1,
    borderColor: '#263048',
  },
  pillBtnActive: {
    backgroundColor: '#ffaa00',
    borderColor: '#ffcc00',
  },
  pillBtnText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  pillBtnTextActive: {
    color: '#000000',
  },
  volumeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 2,
  },
  volumeSlider: {
    flex: 1,
  },
  landscapeRoot: {
    flex: 1,
    backgroundColor: '#0b0d12',
  },
  landscapeScrollContent: {
    padding: 12,
    minHeight: '100%',
  },
  landscapeRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
  landscapeLeft: {
    flex: 1,
    backgroundColor: '#101420',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffaa00',
    padding: 10,
    justifyContent: 'space-between',
    gap: 8,
  },
  landscapeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deckModelText: {
    color: '#00e5a3',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  landscapeTapeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  landscapeEq: {
    paddingTop: 2,
  },
  landscapeRight: {
    flex: 1.2,
    justifyContent: 'space-between',
    gap: 8,
  },
  lcdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141824',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#263048',
  },
  lcdMeta: {
    flex: 1,
    gap: 2,
  },
  lcdTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  lcdArtist: {
    color: '#ffaa00',
    fontSize: 9,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  timelineWrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
  landscapeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  landscapeSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  volRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
