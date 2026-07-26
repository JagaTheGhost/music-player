import os
import sys
import json
import boto3
from botocore.client import Config
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Required variables
def get_clean_env(name):
    val = os.getenv(name)
    if val and "PLACEHOLDER" in val:
        return None
    return val

supabase_url = get_clean_env("EXPO_PUBLIC_SUPABASE_URL")
supabase_key = get_clean_env("SUPABASE_SERVICE_ROLE_KEY") or get_clean_env("EXPO_PUBLIC_SUPABASE_ANON_KEY")
r2_account_id = get_clean_env("CLOUDFLARE_R2_ACCOUNT_ID")
r2_access_key_id = get_clean_env("CLOUDFLARE_R2_ACCESS_KEY_ID")
r2_secret_access_key = get_clean_env("CLOUDFLARE_R2_SECRET_ACCESS_KEY")
r2_bucket_name = get_clean_env("CLOUDFLARE_R2_BUCKET_NAME")
r2_public_url = get_clean_env("EXPO_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL")

# Check if environment variables are set
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
    print("\nPlease add these variables to your .env file. For example:")
    print("  CLOUDFLARE_R2_ACCOUNT_ID=your_account_id")
    print("  CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id")
    print("  CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key")
    print("  CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name")
    print("  SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key (recommended to bypass RLS policies)")
    sys.exit(1)

# Initialize Supabase client
try:
    supabase: Client = create_client(supabase_url, supabase_key)
    print("Supabase client initialized successfully.")
except Exception as e:
    print(f"Failed to initialize Supabase client: {e}")
    sys.exit(1)

# Initialize R2/S3 client
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

# Curated high-quality Unsplash music photography cover arts
cover_arts = [
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop"
]

# Load tracks.json
workspace_dir = r"d:\VisualStudio\Projects\Music player"
local_tracks_path = os.path.join(workspace_dir, "tracks.json")
downloads_dir = os.path.join(workspace_dir, "downloads")

if not os.path.exists(local_tracks_path):
    print(f"Error: {local_tracks_path} not found. Run download_playlist.py first.")
    sys.exit(1)

with open(local_tracks_path, "r", encoding="utf-8") as f:
    tracks = json.load(f)

# Help helper to sanitize filenames (same logic as download_playlist.py)
import re
def sanitize_filename(name):
    sanitized = re.sub(r'[^a-zA-Z0-9\s\-_]', '', name)
    return re.sub(r'\s+', ' ', sanitized).strip()

success_count = 0

for i, track in enumerate(tracks):
    index = track["index"]
    title = track["title"]
    artist = track["artist"]
    
    filename_base = f"{int(index):02d} - {sanitize_filename(artist)} - {sanitize_filename(title)}"
    local_filename = f"{filename_base}.m4a"
    local_filepath = os.path.join(downloads_dir, local_filename)
    
    if not os.path.exists(local_filepath):
        print(f"[{index}/32] Local file {local_filename} not found, skipping upload.")
        continue
        
    # Check if song already exists in Supabase
    try:
        query_res = supabase.table("songs").select("id").eq("title", title).eq("artist", artist).execute()
        if query_res.data:
            print(f"[{index}/32] Song already registered in Supabase: {artist} - {title}")
            continue
    except Exception as e:
        print(f"[{index}/32] Error querying Supabase for {artist} - {title}: {e}")
        continue

    # 1. Upload to Cloudflare R2
    # We will upload the file with key 'songs/<filename>'
    r2_key = f"songs/{local_filename}"
    print(f"[{index}/32] Uploading to R2: {local_filename} -> {r2_key}")
    
    try:
        r2_client.upload_file(
            Filename=local_filepath,
            Bucket=r2_bucket_name,
            Key=r2_key,
            ExtraArgs={'ContentType': 'audio/mp4'}
        )
    except Exception as e:
        print(f"[{index}/32] Failed to upload {local_filename} to R2: {e}")
        continue
        
    # 2. Insert into Supabase database
    # Construct streaming URL
    audio_url = f"{r2_public_url.rstrip('/')}/{r2_key}"
    cover_url = cover_arts[i % len(cover_arts)]
    
    song_data = {
        "title": title,
        "artist": artist,
        "audio_url": audio_url,
        "cover_url": cover_url,
        "language": "Tamil"
    }
    
    print(f"[{index}/32] Registering in Supabase...")
    try:
        insert_res = supabase.table("songs").insert(song_data).execute()
        print(f"[{index}/32] Successfully synced: {artist} - {title}")
        success_count += 1
    except Exception as e:
        print(f"[{index}/32] Failed to insert {artist} - {title} into Supabase: {e}")

print(f"\nUpload and sync complete. Successfully synced {success_count} songs.")
