import os
import sys
import json
import re
import boto3
import yt_dlp
from botocore.client import Config
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Helper to load and ignore placeholder env vars
def get_clean_env(name):
    val = os.getenv(name)
    if val and "PLACEHOLDER" in val:
        return None
    return val

# Required variables
supabase_url = get_clean_env("EXPO_PUBLIC_SUPABASE_URL")
supabase_key = get_clean_env("SUPABASE_SERVICE_ROLE_KEY") or get_clean_env("EXPO_PUBLIC_SUPABASE_ANON_KEY")
r2_account_id = get_clean_env("CLOUDFLARE_R2_ACCOUNT_ID")
r2_access_key_id = get_clean_env("CLOUDFLARE_R2_ACCESS_KEY_ID")
r2_secret_access_key = get_clean_env("CLOUDFLARE_R2_SECRET_ACCESS_KEY")
r2_bucket_name = get_clean_env("CLOUDFLARE_R2_BUCKET_NAME")
r2_public_url = get_clean_env("EXPO_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL")

# Validate keys
missing_vars = []
if not supabase_url: missing_vars.append("EXPO_PUBLIC_SUPABASE_URL")
if not supabase_key: missing_vars.append("SUPABASE_SERVICE_ROLE_KEY (or EXPO_PUBLIC_SUPABASE_ANON_KEY)")
if not r2_account_id: missing_vars.append("CLOUDFLARE_R2_ACCOUNT_ID")
if not r2_access_key_id: missing_vars.append("CLOUDFLARE_R2_ACCESS_KEY_ID")
if not r2_secret_access_key: missing_vars.append("CLOUDFLARE_R2_SECRET_ACCESS_KEY")
if not r2_bucket_name: missing_vars.append("CLOUDFLARE_R2_BUCKET_NAME")
if not r2_public_url: missing_vars.append("EXPO_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL")

if missing_vars:
    print("\n[ERROR] Missing required configuration values in your .env file:")
    for var in missing_vars:
        print(f"  - {var}")
    sys.exit(1)

# Initialize clients
try:
    supabase: Client = create_client(supabase_url, supabase_key)
    print("Supabase client initialized successfully.")
except Exception as e:
    print(f"Failed to initialize Supabase client: {e}")
    sys.exit(1)

try:
    r2_client = boto3.client(
        's3',
        endpoint_url=f'https://{r2_account_id}.r2.cloudflarestorage.com',
        aws_access_key_id=r2_access_key_id,
        aws_secret_access_key=r2_secret_access_key,
        config=Config(signature_version='s3v4'),
        region_name='auto'
    )
    print("Cloudflare R2 client initialized successfully.")
except Exception as e:
    print(f"Failed to initialize Cloudflare R2 client: {e}")
    sys.exit(1)

# Paths
workspace_dir = r"d:\VisualStudio\Projects\Music player"
english_tracks_path = r"C:\Users\jagad\.gemini\antigravity\brain\be584913-0435-4430-8c35-4a7fdb7b51a3\scratch\english_tracks.json"
downloads_dir = os.path.join(workspace_dir, "downloads")
os.makedirs(downloads_dir, exist_ok=True)

if not os.path.exists(english_tracks_path):
    print(f"Error: {english_tracks_path} not found.")
    sys.exit(1)

with open(english_tracks_path, "r", encoding="utf-8") as f:
    tracks = json.load(f)

print(f"Loaded {len(tracks)} English tracks to process.")

# Curated high-quality Unsplash music photography cover arts for English playlist
cover_arts = [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop"
]

def sanitize_filename(name):
    sanitized = re.sub(r'[^a-zA-Z0-9\s\-_]', '', name)
    return re.sub(r'\s+', ' ', sanitized).strip()

def process_track(track, idx):
    index = track["index"]
    title = track["title"]
    artist = track["artist"]
    
    # 1. Check if song already exists in Supabase
    try:
        query_res = supabase.table("songs").select("id").eq("title", title).eq("artist", artist).eq("language", "English").execute()
        if query_res.data:
            print(f"[{index}/{len(tracks)}] Already synced to Supabase: {artist} - {title}")
            return True
    except Exception as e:
        print(f"[{index}/{len(tracks)}] Error querying Supabase for {artist} - {title}: {e}")
        return False
        
    filename_base = f"EN_{int(index):02d} - {sanitize_filename(artist)} - {sanitize_filename(title)}"
    local_filename = f"{filename_base}.m4a"
    local_filepath = os.path.join(downloads_dir, local_filename)
    
    # 2. Download from YouTube if not exists locally
    if not os.path.exists(local_filepath):
        print(f"\n[{index}/{len(tracks)}] Downloading from YouTube: {artist} - {title}")
        query = f"{artist} {title} audio"
        ydl_opts = {
            'format': '140/ba[ext=m4a]/ba',
            'outtmpl': os.path.join(downloads_dir, f"{filename_base}.%(ext)s"),
            'default_search': 'ytsearch1',
            'noplaylist': True,
            'quiet': True,
            'no_warnings': True,
        }
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([query])
            print(f"[{index}/{len(tracks)}] Downloaded: {local_filename}")
        except Exception as e:
            print(f"[{index}/{len(tracks)}] Download failed for {artist} - {title}: {e}")
            return False
            
    # Double check file exists
    if not os.path.exists(local_filepath):
        print(f"[{index}/{len(tracks)}] File not found after download: {local_filename}")
        return False

    # 3. Upload to Cloudflare R2
    r2_key = f"songs/{local_filename}"
    print(f"[{index}/{len(tracks)}] Uploading to R2: {local_filename} -> {r2_key}")
    try:
        r2_client.upload_file(
            Filename=local_filepath,
            Bucket=r2_bucket_name,
            Key=r2_key,
            ExtraArgs={'ContentType': 'audio/mp4'}
        )
    except Exception as e:
        print(f"[{index}/{len(tracks)}] Upload to R2 failed: {e}")
        return False

    # 4. Insert to Supabase
    audio_url = f"{r2_public_url.rstrip('/')}/{r2_key}"
    cover_url = cover_arts[idx % len(cover_arts)]
    
    song_data = {
        "title": title,
        "artist": artist,
        "audio_url": audio_url,
        "cover_url": cover_url,
        "language": "English"
    }
    
    print(f"[{index}/{len(tracks)}] Registering in Supabase...")
    try:
        supabase.table("songs").insert(song_data).execute()
        print(f"[{index}/{len(tracks)}] Successfully synced to database!")
        return True
    except Exception as e:
        print(f"[{index}/{len(tracks)}] Failed to register in Supabase: {e}")
        return False

# Process all tracks
success_count = 0
for idx, track in enumerate(tracks):
    if process_track(track, idx):
        success_count += 1

print(f"\nCompleted! Successfully synced: {success_count}/{len(tracks)}")
