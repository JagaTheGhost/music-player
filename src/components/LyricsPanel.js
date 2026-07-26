import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { getLyricsForSong } from '../services/lyricsData';

export default function LyricsPanel({ title: propTitle, positionMillis: propPositionMillis }) {
  const { currentSong, positionMillis: contextPosition } = useAudioPlayer();

  const activeTitle = propTitle || (currentSong ? currentSong.title : '');
  const activePosition = propPositionMillis !== undefined ? propPositionMillis : contextPosition;

  const lyrics = useMemo(() => getLyricsForSong(activeTitle), [activeTitle]);
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (activePosition >= lyrics[i].time) {
        idx = i;
      } else {
        break;
      }
    }
    setActiveIndex(idx);
  }, [activePosition, lyrics]);

  useEffect(() => {
    if (flatListRef.current && activeIndex !== -1) {
      try {
        flatListRef.current.scrollToIndex({
          index: activeIndex,
          animated: true,
          viewPosition: 0.5,
        });
      } catch (err) {
        // Fallback for list layout delay
      }
    }
  }, [activeIndex]);

  const renderItem = ({ item, index }) => {
    const isActive = index === activeIndex;
    return (
      <View style={styles.lineWrapper}>
        <Text style={[styles.lineText, isActive && styles.activeLineText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={lyrics}
        renderItem={renderItem}
        keyExtractor={(item, idx) => idx.toString()}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: 50,
          offset: 50 * index,
          index,
        })}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 480,
    width: '100%',
    marginVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 16,
    padding: 10,
    overflow: 'hidden',
  },
  listContent: {
    paddingVertical: 200, 
  },
  lineWrapper: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  lineText: {
    color: '#71717a',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  activeLineText: {
    color: '#3b82f6', // Spotify Electric Blue theme active line highlight
    fontSize: 20,
    fontWeight: '800',
  },
});
