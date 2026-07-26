import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import FlatIcon from './FlatIcon';

const NAV_ITEMS = [
  { id: 'all', iconName: 'disc', label: 'All Tracks' },
  { id: 'favorites', iconName: 'star', label: 'Favorites' },
];

const CATEGORY_ITEMS = [
  { id: 'tamil', label: 'Tamil Audio', code: 'TAM' },
  { id: 'english', label: 'English Hits', code: 'ENG' },
];

/**
 * Y2K Hi-Fi Navigation Rack with FlatIcon integration.
 */
export default function Sidebar({ activeTab, onTabChange, onCreatePlaylist }) {
  const { playlists, deletePlaylist } = useAudioPlayer();

  return (
    <View style={styles.sidebar}>
      {/* Y2K Brand Header */}
      <View style={styles.brandBox}>
        <View style={styles.brandBadge}>
          <FlatIcon name="disc" size={18} color="#ffffff" />
        </View>
        <View>
          <Text style={styles.brandTitle}>NEBULA</Text>
          <Text style={styles.brandSubtitle}>DIGITAL MP3 2000</Text>
        </View>
      </View>

      {/* Rack Group 1 */}
      <View style={styles.group}>
        <Text style={styles.groupHeader}>AUDIO SELECT</Text>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => onTabChange(item.id)}
              style={[styles.btn, isActive && styles.btnActive]}
            >
              <FlatIcon
                name={item.iconName}
                size={14}
                color={isActive ? '#39ff14' : '#94a3b8'}
              />
              <Text style={[styles.btnLabel, isActive && styles.btnLabelActive]}>
                {item.label}
              </Text>
              <View style={[styles.ledIndicator, isActive && styles.ledIndicatorActive]} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.divider} />

      {/* Rack Group 2: Genres */}
      <View style={styles.group}>
        <Text style={styles.groupHeader}>GENRE CHANNELS</Text>
        {CATEGORY_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => onTabChange(item.id)}
              style={[styles.btn, isActive && styles.btnActive]}
            >
              <View style={[styles.codeBadge, isActive && styles.codeBadgeActive]}>
                <Text style={[styles.codeText, isActive && styles.codeTextActive]}>{item.code}</Text>
              </View>
              <Text style={[styles.btnLabel, isActive && styles.btnLabelActive]}>
                {item.label}
              </Text>
              <View style={[styles.ledIndicator, isActive && styles.ledIndicatorActive]} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.divider} />

      {/* Rack Group 3: Custom Playlists */}
      <View style={styles.group}>
        <View style={styles.playlistHeaderRow}>
          <Text style={styles.groupHeader}>MY PLAYLISTS ({playlists.length})</Text>
          <Pressable onPress={onCreatePlaylist} style={styles.newPlBtn}>
            <FlatIcon name="add" size={10} color="#39ff14" />
            <Text style={styles.newPlBtnText}>NEW</Text>
          </Pressable>
        </View>

        {playlists.map((pl) => {
          const isActive = activeTab === pl.id;
          return (
            <Pressable
              key={pl.id}
              onPress={() => onTabChange(pl.id)}
              style={[styles.btn, isActive && styles.btnActive]}
            >
              <Text style={styles.btnIcon}>{pl.icon || '🎶'}</Text>
              <Text style={[styles.btnLabel, isActive && styles.btnLabelActive]} numberOfLines={1}>
                {pl.name}
              </Text>
              <Pressable
                onPress={(e) => { e.stopPropagation?.(); deletePlaylist(pl.id); }}
                style={styles.delPlBtn}
              >
                <FlatIcon name="close" size={12} color="#ef4444" />
              </Pressable>
            </Pressable>
          );
        })}
      </View>

      {/* Footer System Status */}
      <View style={styles.footer}>
        <View style={styles.statusBox}>
          <View style={styles.statusRow}>
            <View style={styles.readyLed} />
            <Text style={styles.systemText}>SYSTEM: READY</Text>
          </View>
          <Text style={styles.userText}>USER: JAGADEESH</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: '#0d0e15',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderRightWidth: 2,
    borderRightColor: '#1c1f2e',
  },
  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    padding: 8,
    backgroundColor: '#121522',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#242a3f',
  },
  brandBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0066ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: '#39ff14',
    fontSize: 8,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  group: {
    gap: 6,
  },
  groupHeader: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  playlistHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 4,
  },
  newPlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(57, 255, 20, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#39ff14',
  },
  newPlBtnText: {
    color: '#39ff14',
    fontSize: 8,
    fontWeight: '900',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 10,
    backgroundColor: '#121522',
    borderWidth: 1,
    borderColor: '#1e2438',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  btnActive: {
    backgroundColor: '#0055d4',
    borderColor: '#0088ff',
  },
  btnIcon: {
    fontSize: 14,
  },
  btnLabel: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  btnLabelActive: {
    color: '#ffffff',
  },
  delPlBtn: {
    padding: 2,
    opacity: 0.7,
  },
  codeBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#1c2236',
  },
  codeBadgeActive: {
    backgroundColor: '#39ff14',
  },
  codeText: {
    color: '#94a3b8',
    fontSize: 8,
    fontWeight: '900',
  },
  codeTextActive: {
    color: '#031407',
  },
  ledIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#242a3f',
  },
  ledIndicatorActive: {
    backgroundColor: '#39ff14',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 6px #39ff14',
    }),
  },
  divider: {
    height: 1,
    backgroundColor: '#1e2438',
    marginVertical: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 12,
  },
  statusBox: {
    backgroundColor: '#0a0d15',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1e2438',
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readyLed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#39ff14',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 6px #39ff14',
    }),
  },
  systemText: {
    color: '#39ff14',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  userText: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
});
