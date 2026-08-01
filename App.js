import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  TouchableOpacity, Pressable, useWindowDimensions,
  ScrollView, Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AudioPlayerProvider, useAudioPlayer } from './src/hooks/useAudioPlayer';
import { usePWAInstall } from './src/hooks/usePWAInstall';
import { supabase } from './src/services/supabaseClient';
import Sidebar from './src/components/Sidebar';
import SongList from './src/components/SongList';
import PlayerBar from './src/components/PlayerBar';
import MobilePlayer from './src/components/MobilePlayer';
import QueueDrawer from './src/components/QueueDrawer';
import CreatePlaylistModal from './src/components/CreatePlaylistModal';
import AddToPlaylistModal from './src/components/AddToPlaylistModal';
import PwaInstallModal from './src/components/PwaInstallModal';
import FlatIcon from './src/components/FlatIcon';

const MOBILE_TABS = [
  { id: 'all',       label: 'ALL MP3' },
  { id: 'favorites', label: '⭐ FAVS' },
  { id: 'tamil',     label: 'TAMIL' },
  { id: 'english',   label: 'ENGLISH' },
];

function FilterPills({ activeTab, onTabChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pillsRow}
    >
      {MOBILE_TABS.map(tab => (
        <Pressable
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          style={[styles.pill, activeTab === tab.id && styles.pillActive]}
        >
          <Text style={[styles.pillText, activeTab === tab.id && styles.pillTextActive]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <View style={styles.searchBox}>
      <FlatIcon name="search" size={15} color="#ffaa00" />
      <TextInput
        style={styles.searchInput}
        placeholder="SEARCH RETRO TRACKS OR ARTISTS…"
        placeholderTextColor="#64748b"
        value={value}
        onChangeText={onChange}
        clearButtonMode="while-editing"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChange('')} style={styles.clearBtn}>
          <FlatIcon name="close" size={14} color="#94a3b8" />
        </Pressable>
      )}
    </View>
  );
}

function MusicApp() {
  const {
    currentSong, isPlaying, positionMillis, durationMillis,
    playSong, pauseSong, resumeSong,
    favorites, playlists, toggleFavorite, setQueue, playbackError, clearError,
  } = useAudioPlayer();

  const {
    isInstallable, isStandalone, isIOS, showModal, setShowModal, triggerInstall,
  } = usePWAInstall();

  const { width, height } = useWindowDimensions();
  const isDesktop = width > 768 && height > 500;

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [showMobilePlayer, setShowMobilePlayer] = useState(false);
  const [showQueueDrawer, setShowQueueDrawer] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [addToPlaylistSong, setAddToPlaylistSong] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .order('id', { ascending: true });
        if (error) throw error;
        setSongs(data || []);
      } catch (err) {
        setFetchError(err.message || 'Disc Read Failure');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      let tabMatch = true;
      if (activeTab === 'favorites') {
        tabMatch = favorites.includes(song.id);
      } else if (activeTab === 'tamil') {
        tabMatch = song.language === 'Tamil';
      } else if (activeTab === 'english') {
        tabMatch = song.language === 'English';
      } else if (activeTab.startsWith('pl_')) {
        const targetPlaylist = playlists.find(p => p.id === activeTab);
        tabMatch = targetPlaylist ? targetPlaylist.songIds.includes(song.id) : false;
      }

      const q = searchQuery.trim().toLowerCase();
      const searchMatch =
        !q ||
        song.title?.toLowerCase().includes(q) ||
        song.artist?.toLowerCase().includes(q) ||
        song.album?.toLowerCase().includes(q);

      return tabMatch && searchMatch;
    });
  }, [songs, activeTab, favorites, playlists, searchQuery]);

  useEffect(() => {
    setQueue(filteredSongs);
  }, [filteredSongs, setQueue]);

  const handleSongPress = (song) => {
    if (currentSong?.id === song.id) {
      isPlaying ? pauseSong() : resumeSong();
    } else {
      playSong(song);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.body}>
        {isDesktop && (
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onCreatePlaylist={() => setShowCreatePlaylistModal(true)}
            isInstallable={isInstallable}
            isStandalone={isStandalone}
            onTriggerInstall={triggerInstall}
          />
        )}

        <View style={styles.main}>
          {/* Top Retro Header */}
          <View style={styles.contentHeader}>
            <View style={styles.searchRow}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />

              {!isStandalone && (
                <TouchableOpacity
                  style={styles.topInstallBtn}
                  onPress={triggerInstall}
                >
                  <FlatIcon name="download" size={14} color="#000000" />
                  <Text style={styles.topInstallBtnText}>
                    {isDesktop ? 'INSTALL APP' : 'GET APP'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {!isDesktop && (
              <View style={styles.pillsWrapper}>
                <FilterPills activeTab={activeTab} onTabChange={handleTabChange} />
              </View>
            )}
          </View>

          {/* Song List & Main Deck */}
          <SongList
            songs={filteredSongs}
            loading={loading}
            error={fetchError}
            activeTab={activeTab}
            isDesktop={isDesktop}
            currentSong={currentSong}
            isPlaying={isPlaying}
            positionMillis={positionMillis}
            durationMillis={durationMillis}
            favorites={favorites}
            onSongPress={handleSongPress}
            onLikePress={toggleFavorite}
            onAddToPlaylist={(song) => setAddToPlaylistSong(song)}
          />
        </View>

        {/* Up Next Queue Drawer */}
        <QueueDrawer
          visible={showQueueDrawer}
          onClose={() => setShowQueueDrawer(false)}
        />
      </View>

      {/* Retro Transport Master Bar */}
      <PlayerBar
        isDesktop={isDesktop}
        onOpenMobilePlayer={() => setShowMobilePlayer(true)}
        onToggleQueue={() => setShowQueueDrawer(prev => !prev)}
        isQueueOpen={showQueueDrawer}
        isInstallable={isInstallable}
        isStandalone={isStandalone}
        onTriggerInstall={triggerInstall}
      />

      {playbackError && (
        <View style={styles.errBanner}>
          <Text style={styles.errBannerText} numberOfLines={2}>{playbackError}</Text>
          <TouchableOpacity onPress={clearError} style={styles.errBannerClose}>
            <FlatIcon name="close" size={14} color="#fecaca" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modals */}
      <MobilePlayer
        visible={showMobilePlayer && !isDesktop}
        onClose={() => setShowMobilePlayer(false)}
      />

      <CreatePlaylistModal
        visible={showCreatePlaylistModal}
        onClose={() => setShowCreatePlaylistModal(false)}
      />

      <AddToPlaylistModal
        song={addToPlaylistSong}
        visible={addToPlaylistSong !== null}
        onClose={() => setAddToPlaylistSong(null)}
        onCreateNew={() => setShowCreatePlaylistModal(true)}
      />

      <PwaInstallModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        isIOS={isIOS}
        triggerInstall={triggerInstall}
        isInstallable={isInstallable}
      />
    </SafeAreaView>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.crashScreen}>
          <Text style={styles.crashTitle}>⚠️ STEREO SYSTEM FAULT</Text>
          <Text style={styles.crashMsg}>{this.state.error?.toString()}</Text>
          <TouchableOpacity
            style={styles.crashRetry}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.crashRetryText}>RESET STEREO</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AudioPlayerProvider>
        <MusicApp />
      </AudioPlayerProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0b0d12',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
  },
  contentHeader: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#1c2438',
    backgroundColor: '#101420',
    gap: 10,
    ...(Platform.OS === 'web' && {
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141824',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    borderWidth: 1,
    borderColor: '#263048',
    gap: 10,
    maxWidth: 480,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    color: '#00e5a3',
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  clearBtn: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topInstallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffaa00',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffcc00',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  topInstallBtnText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pillsWrapper: {
    width: '100%',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: 10,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#141824',
    borderWidth: 1,
    borderColor: '#263048',
  },
  pillActive: {
    backgroundColor: '#ffaa00',
    borderColor: '#ffcc00',
  },
  pillText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
  },
  pillTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  errBanner: {
    position: 'absolute',
    bottom: 90,
    left: 14,
    right: 14,
    backgroundColor: '#991b1b',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  errBannerText: {
    flex: 1,
    color: '#fecaca',
    fontSize: 11,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  errBannerClose: {
    padding: 4,
  },
  crashScreen: {
    flex: 1,
    backgroundColor: '#0b0d12',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 14,
  },
  crashTitle: {
    color: '#ff3366',
    fontSize: 22,
    fontWeight: '900',
  },
  crashMsg: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  crashRetry: {
    backgroundColor: '#ffaa00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  crashRetryText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 13,
  },
});
