import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isMocked = !supabaseUrl || supabaseUrl === 'placeholder' || !supabaseAnonKey || supabaseAnonKey === 'placeholder';

const mockSongs = [
  {
    id: 1,
    title: "Synthwave Breeze",
    artist: "Neon Skyline",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
    language: "English",
    duration: "03:42",
    album: "Demo Tracks"
  },
  {
    id: 2,
    title: "Midnight Drive",
    artist: "Cyber Cruiser",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
    language: "English",
    duration: "04:15",
    album: "Demo Tracks"
  },
  {
    id: 3,
    title: "Cyberpunk Sunrise",
    artist: "Retro Future",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop",
    language: "English",
    duration: "03:28",
    album: "Demo Tracks"
  },
  {
    id: 4,
    title: "Lo-Fi Raindrops",
    artist: "Chilled Dreams",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover_url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&auto=format&fit=crop",
    language: "English",
    duration: "02:55",
    album: "Demo Tracks"
  },
  {
    id: 5,
    title: "Acoustic Horizon",
    artist: "Serene Nomad",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    language: "English",
    duration: "03:10",
    album: "Demo Tracks"
  }
];

let supabaseClient;

if (!isMocked) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn("Failed to initialize Supabase client, falling back to mock provider:", error.message);
    supabaseClient = createMockClient();
  }
} else {
  supabaseClient = createMockClient();
}

function createMockClient() {
  const self = {
    from: (table) => {
      if (table === 'songs') {
        return {
          select: (columns) => {
            return {
              order: (column, { ascending } = {}) => {
                return Promise.resolve({ data: mockSongs, error: null });
              },
              then: (resolve) => {
                resolve({ data: mockSongs, error: null });
              }
            };
          }
        };
      }
      return {
        select: () => Promise.resolve({ data: [], error: new Error(`Table '${table}' not mocked.`) })
      };
    }
  };
  return self;
}

export const supabase = supabaseClient;
