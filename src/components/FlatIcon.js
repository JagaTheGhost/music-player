import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

/**
 * Pure SVG / Vector Flat Icon Component.
 * Self-contained, ultra-crisp, zero-dependency flat icons for web and mobile.
 */
export default function FlatIcon({ name, size = 18, color = '#ffffff', style }) {
  if (Platform.OS === 'web') {
    const getSvgPath = () => {
      switch (name) {
        case 'play':
          return <polygon points="6 4 20 12 6 20 6 4" fill={color} />;
        case 'pause':
          return (
            <g fill={color}>
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </g>
          );
        case 'skip-next':
          return (
            <g fill={color}>
              <polygon points="5 4 15 12 5 20 5 4" />
              <rect x="16" y="4" width="3" height="16" rx="1" />
            </g>
          );
        case 'skip-prev':
          return (
            <g fill={color}>
              <rect x="5" y="4" width="3" height="16" rx="1" />
              <polygon points="19 4 9 12 19 20 19 4" />
            </g>
          );
        case 'forward-30':
          return (
            <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M12 4 A8 8 0 1 1 5 9" />
              <polyline points="5 4 5 9 10 9" />
              <text x="12" y="15" fontSize="8" fontWeight="bold" fill={color} stroke="none" textAnchor="middle">30</text>
            </g>
          );
        case 'replay-10':
          return (
            <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M12 4 A8 8 0 1 0 19 9" />
              <polyline points="19 4 19 9 14 9" />
              <text x="12" y="15" fontSize="8" fontWeight="bold" fill={color} stroke="none" textAnchor="middle">10</text>
            </g>
          );
        case 'shuffle':
          return (
            <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </g>
          );
        case 'repeat':
          return (
            <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </g>
          );
        case 'repeat-one':
          return (
            <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              <text x="12" y="14" fontSize="8" fontWeight="bold" fill={color} stroke="none" textAnchor="middle">1</text>
            </g>
          );
        case 'star':
          return (
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={color}
            />
          );
        case 'star-outline':
          return (
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          );
        case 'search':
          return (
            <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </g>
          );
        case 'close':
          return (
            <g stroke={color} strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </g>
          );
        case 'add':
          return (
            <g stroke={color} strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </g>
          );
        case 'queue':
          return (
            <g stroke={color} strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="15" y2="18" />
            </g>
          );
        case 'disc':
          return (
            <g stroke={color} strokeWidth="2" fill="none">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
            </g>
          );
        case 'volume-high':
          return (
            <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={color} />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </g>
          );
        case 'volume-mute':
          return (
            <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={color} />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </g>
          );
        case 'moon':
          return (
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          );
        case 'chevron-up':
          return (
            <polyline points="18 15 12 9 6 15" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          );
        case 'chevron-down':
          return (
            <polyline points="6 9 12 15 18 9" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          );
        case 'trash':
          return (
            <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </g>
          );
        default:
          return <circle cx="12" cy="12" r="6" fill={color} />;
      }
    };

    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
          {getSvgPath()}
        </svg>
      </View>
    );
  }

  // Fallback for native
  return <View style={[{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }, style]} />;
}
