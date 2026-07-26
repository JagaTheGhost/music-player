import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as SecureStore from 'expo-secure-store';

const FAVORITES_KEY = 'nebula_favorites';
const PLAYLISTS_KEY = 'nebula_custom_playlists';
const THEME_KEY = 'nebula_theme_color';

export const THEMES = {
  green: { id: 'green', label: '💚 MATRIX GREEN', color: '#39ff14', glow: 'rgba(57, 255, 20, 0.4)', darkBg: '#081408' },
  blue: { id: 'blue', label: '💙 ELECTRIC BLUE', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)', darkBg: '#05121d' },
  magenta: { id: 'magenta', label: '💖 CYBER MAGENTA', color: '#ff007f', glow: 'rgba(255, 0, 127, 0.4)', darkBg: '#180512' },
  amber: { id: 'amber', label: '🧡 AMBER GOLD', color: '#ffaa00', glow: 'rgba(255, 170, 0, 0.4)', darkBg: '#181205' },
};

// ─── Persistence helpers ──────────────────────────────────────────────────────

const saveStorage = async (key, data) => {
  try {
    const jsonStr = JSON.stringify(data);
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, jsonStr);
    SecureStore?.setItemAsync?.(key, jsonStr).catch(() => {});
  } catch (e) { /* ignore */ }
};

const loadStorage = async (key, defaultVal = []) => {
  try {
    if (SecureStore?.getItemAsync) {
      const stored = await SecureStore.getItemAsync(key);
      if (stored) return JSON.parse(stored);
    }
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultVal;
    }
  } catch (e) { /* ignore */ }
  return defaultVal;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AudioPlayerContext = createContext(null);

export const AudioPlayerProvider = ({ children }) => {
  // ── Playback state ──
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);

  // ── Theme State ──
  const [themeKey, setThemeKey] = useState('green');

  // ── Queue & library state ──
  const [queue, setQueue] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // ── Controls state ──
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [volume, setVolume] = useState(1.0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [sleepTimer, setSleepTimer] = useState(null);

  // ── Refs ──
  const soundRef = useRef(null);
  const currentSongRef = useRef(null);
  const queueRef = useRef([]);
  const isShuffleRef = useRef(false);
  const repeatModeRef = useRef('off');
  const volumeRef = useRef(1.0);
  const rateRef = useRef(1.0);

  useEffect(() => { currentSongRef.current = currentSong; }, [currentSong]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { rateRef.current = playbackRate; }, [playbackRate]);

  // ── Load persisted settings on mount ──
  useEffect(() => {
    let mounted = true;
    Promise.all([
      loadStorage(FAVORITES_KEY, []),
      loadStorage(PLAYLISTS_KEY, []),
      loadStorage(THEME_KEY, 'green'),
    ]).then(([favs, customPlaylists, savedTheme]) => {
      if (mounted) {
        setFavorites(favs);
        setPlaylists(customPlaylists);
        if (savedTheme && THEMES[savedTheme]) setThemeKey(savedTheme);
      }
    });
    return () => { mounted = false; };
  }, []);

  // ── Change Theme ──
  const changeTheme = (newKey) => {
    if (THEMES[newKey]) {
      setThemeKey(newKey);
      saveStorage(THEME_KEY, newKey);
    }
  };

  // ── Audio mode setup ──
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldRouteThroughEarpieceAndroid: false,
    }).catch(() => {});
    return () => { cleanUpSound(); };
  }, []);

  // ── Sleep timer countdown ──
  const timerIsActive = sleepTimer !== null;
  useEffect(() => {
    if (!timerIsActive) return;
    const intervalId = setInterval(() => {
      setSleepTimer(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          soundRef.current?.pauseAsync().catch(() => {});
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timerIsActive]);

  // ── Helpers ──
  const clampVolume = (v) =>
    typeof v === 'number' && isFinite(v) ? Math.max(0, Math.min(1, v)) : 1.0;

  const clampRate = (r) =>
    typeof r === 'number' && isFinite(r) ? r : 1.0;

  const cleanUpSound = async () => {
    if (soundRef.current) {
      try { await soundRef.current.unloadAsync(); } catch (_) {}
      soundRef.current = null;
    }
  };

  // ── Playback status callback ──
  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) {
      if (status.error) setPlaybackError('Playback error: ' + status.error);
      return;
    }
    setIsPlaying(status.isPlaying);
    setPositionMillis(status.positionMillis ?? 0);
    setDurationMillis(status.durationMillis || 1);
    setPlaybackProgress((status.positionMillis ?? 0) / (status.durationMillis || 1));
    setPlaybackError(null);

    if (status.didJustFinish) {
      setIsPlaying(false);
      setPlaybackProgress(0);
      setPositionMillis(0);
      if (repeatModeRef.current === 'one' && soundRef.current) {
        soundRef.current.setPositionAsync(0).then(() => soundRef.current?.playAsync());
      } else {
        playNext(true);
      }
    }
  };

  // ── Core Playback Actions with DJ Crossfade ──
  const playSong = async (song) => {
    if (!song?.audio_url) {
      setPlaybackError('This track has no audio source.');
      return;
    }
    try {
      setIsLoading(true);
      setPlaybackError(null);

      // Smooth Audio Crossfade (Fade out outgoing sound if playing)
      const oldSound = soundRef.current;
      if (oldSound && isPlaying) {
        let fadeVol = volumeRef.current;
        const fadeInterval = setInterval(async () => {
          fadeVol -= 0.2;
          if (fadeVol <= 0) {
            clearInterval(fadeInterval);
            try { await oldSound.stopAsync(); await oldSound.unloadAsync(); } catch (_) {}
          } else {
            try { await oldSound.setVolumeAsync(Math.max(0, fadeVol)); } catch (_) {}
          }
        }, 80);
      } else {
        await cleanUpSound();
      }

      setCurrentSong(song);
      setIsPlaying(false);
      setPlaybackProgress(0);
      setPositionMillis(0);

      // Create new sound instance with initial volume 0 for DJ fade-in
      const targetVol = clampVolume(volumeRef.current);
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.audio_url },
        {
          shouldPlay: true,
          volume: 0.1,
          rate: clampRate(rateRef.current),
          shouldCorrectPitch: true,
        },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;

      // DJ Fade-In new track to target volume
      let inVol = 0.1;
      const fadeInInterval = setInterval(async () => {
        inVol += 0.2;
        if (inVol >= targetVol) {
          clearInterval(fadeInInterval);
          try { await sound.setVolumeAsync(targetVol); } catch (_) {}
        } else {
          try { await sound.setVolumeAsync(inVol); } catch (_) {}
        }
      }, 70);

    } catch (err) {
      setPlaybackError('Failed to stream: ' + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const pauseSong = async () => {
    try { await soundRef.current?.pauseAsync(); } catch (_) {}
    setIsPlaying(false);
  };

  const resumeSong = async () => {
    if (soundRef.current) {
      try { await soundRef.current.playAsync(); } catch (_) {}
    } else if (currentSong) {
      await playSong(currentSong);
    }
  };

  const playNext = (isAuto = false) => {
    const q = queueRef.current;
    const current = currentSongRef.current;
    if (!q.length || !current) return;

    if (isShuffleRef.current) {
      let idx = Math.floor(Math.random() * q.length);
      if (q.length > 1 && q[idx]?.id === current.id) idx = (idx + 1) % q.length;
      playSong(q[idx]);
    } else {
      const ci = q.findIndex(s => s.id === current.id);
      if (ci !== -1 && ci < q.length - 1) {
        playSong(q[ci + 1]);
      } else if (repeatModeRef.current === 'all') {
        playSong(q[0]);
      } else if (!isAuto) {
        playSong(q[0]);
      } else {
        setIsPlaying(false);
        setPlaybackProgress(0);
        setPositionMillis(0);
      }
    }
  };

  const playPrevious = () => {
    const q = queueRef.current;
    const current = currentSongRef.current;
    if (!q.length || !current) return;

    if (isShuffleRef.current) {
      let idx = Math.floor(Math.random() * q.length);
      if (q.length > 1 && q[idx]?.id === current.id) idx = (idx + 1) % q.length;
      playSong(q[idx]);
    } else {
      if (positionMillis > 3000) {
        soundRef.current?.setPositionAsync(0);
        return;
      }
      const ci = q.findIndex(s => s.id === current.id);
      playSong(ci > 0 ? q[ci - 1] : q[q.length - 1]);
    }
  };

  const seekTo = async (progress) => {
    if (soundRef.current && durationMillis) {
      try { await soundRef.current.setPositionAsync(progress * durationMillis); } catch (_) {}
    }
  };

  const skipForward = async () => {
    if (soundRef.current && durationMillis) {
      const newPos = Math.min(positionMillis + 30000, durationMillis);
      try { await soundRef.current.setPositionAsync(newPos); } catch (_) {}
    }
  };

  const skipBackward = async () => {
    const newPos = Math.max(positionMillis - 10000, 0);
    if (soundRef.current) {
      try { await soundRef.current.setPositionAsync(newPos); } catch (_) {}
    }
  };

  // ── Queue Management ──
  const removeFromQueue = (index) => {
    setQueue(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const moveInQueue = (fromIndex, toIndex) => {
    setQueue(prev => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [movedItem] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, movedItem);
      return next;
    });
  };

  const addToQueue = (song) => {
    setQueue(prev => {
      if (prev.some(s => s.id === song.id)) return prev;
      return [...prev, song];
    });
  };

  // ── Custom Playlists Management ──
  const createPlaylist = (name, description = '', icon = '🎶') => {
    const newPlaylist = {
      id: 'pl_' + Date.now(),
      name: name.trim(),
      description: description.trim(),
      icon,
      songIds: [],
      createdAt: new Date().toISOString(),
    };
    setPlaylists(prev => {
      const updated = [...prev, newPlaylist];
      saveStorage(PLAYLISTS_KEY, updated);
      return updated;
    });
    return newPlaylist;
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => {
      const updated = prev.filter(p => p.id !== playlistId);
      saveStorage(PLAYLISTS_KEY, updated);
      return updated;
    });
  };

  const toggleSongInPlaylist = (playlistId, songId) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id !== playlistId) return p;
        const exists = p.songIds.includes(songId);
        const songIds = exists
          ? p.songIds.filter(id => id !== songId)
          : [...p.songIds, songId];
        return { ...p, songIds };
      });
      saveStorage(PLAYLISTS_KEY, updated);
      return updated;
    });
  };

  const toggleFavorite = (songId) => {
    setFavorites(prev => {
      const updated = prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId];
      saveStorage(FAVORITES_KEY, updated);
      return updated;
    });
  };

  const toggleShuffle = () => setIsShuffle(prev => !prev);

  const cycleRepeat = () => setRepeatMode(prev => {
    if (prev === 'off') return 'all';
    if (prev === 'all') return 'one';
    return 'off';
  });

  const changeVolume = async (val) => {
    const v = clampVolume(val);
    setVolume(v);
    volumeRef.current = v;
    try { await soundRef.current?.setVolumeAsync(v); } catch (_) {}
  };

  const changePlaybackRate = async (rate) => {
    const r = clampRate(rate);
    setPlaybackRate(r);
    rateRef.current = r;
    try { await soundRef.current?.setRateAsync(r, true); } catch (_) {}
  };

  const clearError = () => setPlaybackError(null);

  const activeTheme = THEMES[themeKey] || THEMES.green;

  return (
    <AudioPlayerContext.Provider value={{
      currentSong, isPlaying, playbackProgress, positionMillis, durationMillis,
      isLoading, queue, setQueue, favorites, playlists, playbackError,
      isShuffle, repeatMode, volume, playbackRate, sleepTimer,
      themeKey, activeTheme, changeTheme,
      playSong, pauseSong, resumeSong, seekTo, playNext, playPrevious,
      skipForward, skipBackward, toggleFavorite, toggleShuffle, cycleRepeat,
      changeVolume, changePlaybackRate, setSleepTimer, clearError,
      removeFromQueue, moveInQueue, addToQueue,
      createPlaylist, deletePlaylist, toggleSongInPlaylist,
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
};
