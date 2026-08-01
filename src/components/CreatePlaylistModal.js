import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable, Modal, Platform,
} from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const ICONS = ['🎶', '🔥', '🌙', '⚡', '🎧', '💖', '🎸', '🪐', '☕', '🚀'];

export default function CreatePlaylistModal({ visible, onClose }) {
  const { createPlaylist } = useAudioPlayer();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎶');

  const handleCreate = () => {
    if (!name.trim()) return;
    createPlaylist(name, description, selectedIcon);
    setName('');
    setDescription('');
    setSelectedIcon('🎶');
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>CREATE RETRO PLAYLIST</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Icon Picker */}
            <Text style={styles.label}>CHOOSE ICON</Text>
            <View style={styles.iconRow}>
              {ICONS.map(icon => (
                <Pressable
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  style={[styles.iconChip, selectedIcon === icon && styles.iconChipActive]}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </Pressable>
              ))}
            </View>

            {/* Name Input */}
            <Text style={styles.label}>PLAYLIST NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Midnight Synth, Retro Hits"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
            />

            {/* Description Input */}
            <Text style={styles.label}>DESCRIPTION (OPTIONAL)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Add optional notes…"
              placeholderTextColor="#64748b"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            {/* Submit */}
            <Pressable
              onPress={handleCreate}
              style={[styles.submitBtn, !name.trim() && styles.submitBtnDisabled]}
              disabled={!name.trim()}
            >
              <Text style={styles.submitBtnText}>SAVE STEREO PLAYLIST</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5,7,12,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#141824',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffaa00',
    padding: 20,
    gap: 16,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#263048',
    paddingBottom: 12,
  },
  title: {
    color: '#ffaa00',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '800',
  },
  form: {
    gap: 12,
  },
  label: {
    color: '#64748b',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#1b2234',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#293550',
  },
  iconChipActive: {
    backgroundColor: '#ffaa00',
    borderColor: '#ffcc00',
  },
  iconText: {
    fontSize: 16,
  },
  input: {
    backgroundColor: '#0a0d14',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#00e5a3',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    borderWidth: 1,
    borderColor: '#263048',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputMultiline: {
    height: 60,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#ffaa00',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ffcc00',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
