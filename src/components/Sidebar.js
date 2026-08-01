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

export default function Sidebar({
  activeTab,
  onTabChange,
  onCreatePlaylist,
  isInstallable,
  isStandalone,
  onTriggerInstall,
}) {
  const { playlists, deletePlaylist } = useAudioPlayer();

  return (
    <View style={styles.sidebar}>
      {/* Vintage Stereo Brand Header */}
      <View style={styles.brandBox}>
        <View style={styles.brandBadge}>
          <FlatIcon name="disc" size={18} color="#000000" />
        </View>
        <View style={styles.brandTextCol}>
          <Text style={styles.brandTitle}>NEBULA STEREO</Text>
          <Text style={styles.brandSubtitle}>HI-FI MP3 RACK • MODEL 2000</Text>
        </View>
      </View>

      {/* Stereo Rack Section 1: Audio Channels */}
      <View style={styles.group}>
        <Text style={styles.groupHeader}>MAIN CHANNEL SELECT</Text>
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
                color={isActive ? '#ffaa00' : '#94a3b8'}
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

      {/* Stereo Rack Section 2: Genre Channels */}
      <View style={styles.group}>
        <Text style={styles.groupHeader}>GENRE BANDS</Text>
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

      {/* Stereo Rack Section 3: Playlists */}
      <View style={styles.group}>
        <View style={styles.playlistHeaderRow}>
          <Text style={styles.groupHeader}>MY PLAYLISTS ({playlists.length})</Text>
          <Pressable onPress={onCreatePlaylist} style={styles.newPlBtn}>
            <FlatIcon name="add" size={10} color="#ffaa00" />
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

      {/* Sidebar Footer: PWA Installation & System Status */}
      <View style={styles.footer}>
        {!isStandalone ? (
          <Pressable style={styles.installAppBtn} onPress={onTriggerInstall}>
            <FlatIcon name="download" size={14} color="#000000" />
            <Text style={styles.installAppBtnText}>
              {isInstallable ? 'INSTALL DESKTOP APP' : 'GET DESKTOP / MOBILE APP'}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.standaloneBadge}>
            <View style={styles.standaloneDot} />
            <Text style={styles.standaloneText}>RETRO PWA ACTIVE</Text>
          </View>
        )}

        <View style={styles.statusBox}>
          <View style={styles.statusRow}>
            <View style={styles.readyLed} />
            <Text style={styles.systemText}>SYSTEM: VINTAGE HI-FI ONLINE</Text>
          </View>
          <Text style={styles.userText}>USER: JAGADEESH</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 230,
    backgroundColor: '#0c0e14',
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderRightWidth: 2,
    borderRightColor: '#1c2232',
  },
  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
    padding: 10,
    backgroundColor: '#141824',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ffaa00',
    ...(Platform.OS === 'web' && {
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.4)',
    }),
  },
  brandBadge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#ffaa00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextCol: {
    flex: 1,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  brandSubtitle: {
    color: '#ffaa00',
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  group: {
    gap: 6,
  },
  groupHeader: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    paddingHorizontal: 6,
    marginBottom: 2,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
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
    gap: 3,
    backgroundColor: 'rgba(255, 170, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
  newPlBtnText: {
    color: '#ffaa00',
    fontSize: 8,
    fontWeight: '900',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 10,
    backgroundColor: '#121622',
    borderWidth: 1,
    borderColor: '#1e2638',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  btnActive: {
    backgroundColor: '#1f273b',
    borderColor: '#ffaa00',
  },
  btnIcon: {
    fontSize: 13,
  },
  btnLabel: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  btnLabelActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  delPlBtn: {
    padding: 2,
    opacity: 0.7,
  },
  codeBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#1b2234',
  },
  codeBadgeActive: {
    backgroundColor: '#ffaa00',
  },
  codeText: {
    color: '#94a3b8',
    fontSize: 8,
    fontWeight: '900',
  },
  codeTextActive: {
    color: '#000000',
  },
  ledIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#263048',
  },
  ledIndicatorActive: {
    backgroundColor: '#ffaa00',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 6px #ffaa00',
    }),
  },
  divider: {
    height: 1,
    backgroundColor: '#1c2232',
    marginVertical: 12,
  },
  footer: {
    marginTop: 'auto',
    gap: 10,
    paddingTop: 12,
  },
  installAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ffaa00',
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffcc00',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  installAppBtnText: {
    color: '#000000',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  standaloneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 229, 163, 0.12)',
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00e5a3',
  },
  standaloneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00e5a3',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 6px #00e5a3',
    }),
  },
  standaloneText: {
    color: '#00e5a3',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  statusBox: {
    backgroundColor: '#080a10',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1e2638',
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
    backgroundColor: '#00e5a3',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 6px #00e5a3',
    }),
  },
  systemText: {
    color: '#00e5a3',
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  userText: {
    color: '#64748b',
    fontSize: 8.5,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
});
