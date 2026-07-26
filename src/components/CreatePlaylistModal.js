import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable, Modal, Platform,
} from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const ICONS = ['🎶', '🔥', '🌙', '⚡', '🎧', '💖', '🎸', '🪐', '☕', '🚀'];

/**
 * Modal to create a new custom playlist.
 */
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
            <Text style={styles.title}>CREATE NEW PLAYLIST</Text>
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
              placeholder="e.g. Midnight Vibes, Workout Bops"
              placeholderTextColor="#475569"
              value={name}
              onChangeText={setName}
            />

            {/* Description Input */}
            <Text style={styles.label}>DESCRIPTION (OPTIONAL)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Add an optional description…"
              placeholderTextColor="#475569"
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
              <Text style={styles.submitBtnText}>SAVE PLAYLIST</Text>
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
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0f121d',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#242a3f',
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
    borderBottomColor: '#1e2438',
    paddingBottom: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
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
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#161c2e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#242a3f',
  },
  iconChipActive: {
    backgroundColor: '#0066ff',
    borderColor: '#3399ff',
  },
  iconText: {
    fontSize: 16,
  },
  input: {
    backgroundColor: '#141829',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#242a3f',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputMultiline: {
    height: 60,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#0066ff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
