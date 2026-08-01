import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import FlatIcon from './FlatIcon';

export default function PwaInstallModal({ visible, onClose, isIOS, triggerInstall, isInstallable }) {
  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation?.()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <FlatIcon name="download" size={16} color="#ffaa00" />
            </View>
            <Text style={styles.title}>INSTALL RETRO MP3 STEREO</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <FlatIcon name="close" size={14} color="#94a3b8" />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Install Nebula Retro directly on your Desktop or Mobile home screen for fast offline access & standalone stereo app experience!
          </Text>

          {/* Quick Trigger Button if browser supports 1-click */}
          {isInstallable && (
            <Pressable
              style={styles.directBtn}
              onPress={() => {
                onClose();
                triggerInstall();
              }}
            >
              <FlatIcon name="download" size={16} color="#000000" />
              <Text style={styles.directBtnText}>INSTALL APP NOW (1-CLICK)</Text>
            </Pressable>
          )}

          {/* iOS Instructions */}
          {isIOS ? (
            <View style={styles.instructionsBox}>
              <Text style={styles.instTitle}>📲 SAFARI / iOS INSTALLATION:</Text>
              <View style={styles.stepRow}>
                <Text style={styles.stepNum}>1</Text>
                <Text style={styles.stepText}>Tap the <Text style={styles.highlight}>Share button</Text> (square with upward arrow) at the bottom of Safari.</Text>
              </View>
              <View style={styles.stepRow}>
                <Text style={styles.stepNum}>2</Text>
                <Text style={styles.stepText}>Scroll down and select <Text style={styles.highlight}>"Add to Home Screen"</Text>.</Text>
              </View>
              <View style={styles.stepRow}>
                <Text style={styles.stepNum}>3</Text>
                <Text style={styles.stepText}>Tap <Text style={styles.highlight}>"Add"</Text> in top right to launch your retro app!</Text>
              </View>
            </View>
          ) : (
            <View style={styles.instructionsBox}>
              <Text style={styles.instTitle}>💻 DESKTOP & ANDROID MANUAL INSTALL:</Text>
              <View style={styles.stepRow}>
                <Text style={styles.stepNum}>1</Text>
                <Text style={styles.stepText}>Look for the <Text style={styles.highlight}>Install icon (⊕ or ⬇)</Text> in your browser address bar (Chrome / Edge / Brave).</Text>
              </View>
              <View style={styles.stepRow}>
                <Text style={styles.stepNum}>2</Text>
                <Text style={styles.stepText}>Or open menu <Text style={styles.highlight}>⋮ → Install Nebula Retro MP3...</Text></Text>
              </View>
            </View>
          )}

          <Pressable style={styles.okBtn} onPress={onClose}>
            <Text style={styles.okBtnText}>GOT IT</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#141824',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffaa00',
    padding: 20,
    gap: 16,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 10px 30px rgba(255, 170, 0, 0.25)',
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 170, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#ffaa00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: '#ffaa00',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  closeBtn: {
    padding: 6,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
  },
  directBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffaa00',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcc00',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  directBtnText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  instructionsBox: {
    backgroundColor: '#0a0c12',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#262d40',
    padding: 12,
    gap: 10,
  },
  instTitle: {
    color: '#00e5a3',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 229, 163, 0.2)',
    color: '#00e5a3',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 18,
  },
  stepText: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
  },
  highlight: {
    color: '#ffffff',
    fontWeight: '700',
  },
  okBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1e2436',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333e5c',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  okBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
