import os
import json
import re
import shutil
import yt_dlp

# Paths
workspace_dir = r"d:\VisualStudio\Projects\Music player"
scratch_tracks_path = r"C:\Users\jagad\.gemini\antigravity\brain\be584913-0435-4430-8c35-4a7fdb7b51a3\scratch\tracks.json"
local_tracks_path = os.path.join(workspace_dir, "tracks.json")
downloads_dir = os.path.join(workspace_dir, "downloads")

# 1. Copy tracks.json to workspace if it exists in scratch
if os.path.exists(scratch_tracks_path):
    shutil.copy(scratch_tracks_path, local_tracks_path)
    print(f"Copied tracks.json to {local_tracks_path}")
else:
    print(f"Warning: scratch tracks.json not found, checking {local_tracks_path}")

# Ensure downloads directory exists
os.makedirs(downloads_dir, exist_ok=True)

# Load tracks
with open(local_tracks_path, "r", encoding="utf-8") as f:
    tracks = json.load(f)

print(f"Loaded {len(tracks)} tracks to download.")

def sanitize_filename(name):
    # Keep alphanumeric, spaces, hyphens, underscores
    sanitized = re.sub(r'[^a-zA-Z0-9\s\-_]', '', name)
    # Replace multiple spaces with a single space
    return re.sub(r'\s+', ' ', sanitized).strip()

def download_track(track):
    index = track["index"]
    title = track["title"]
    artist = track["artist"]
    
    # Format output filename
    filename_base = f"{int(index):02d} - {sanitize_filename(artist)} - {sanitize_filename(title)}"
    expected_filepath = os.path.join(downloads_dir, f"{filename_base}.m4a")
    
    # Check if already downloaded
    if os.path.exists(expected_filepath):
        print(f"[{index}/32] Skipping: {filename_base}.m4a already exists.")
        return True
        
    print(f"\n[{index}/32] Searching & Downloading: {artist} - {title}")
    
    # Search query
    query = f"{artist} {title} audio"
    
    # yt-dlp options
    ydl_opts = {
        'format': '140/ba[ext=m4a]/ba', # Prefer YouTube M4A (140) or any M4A
        'outtmpl': os.path.join(downloads_dir, f"{filename_base}.%(ext)s"),
        'default_search': 'ytsearch1', # Search and get the first result
        'noplaylist': True,
        'quiet': True,
        'no_warnings': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([query])
        print(f"[{index}/32] Successfully downloaded {filename_base}.m4a")
        return True
    except Exception as e:
        print(f"[{index}/32] Error downloading {artist} - {title}: {e}")
        return False

# Download all tracks
success_count = 0
for track in tracks:
    # Let's do them one by one
    success = download_track(track)
    if success:
        success_count += 1

print(f"\nFinished download process. Successfully downloaded: {success_count}/{len(tracks)}")
