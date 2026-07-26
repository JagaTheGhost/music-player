import os
import sys
import json
import re
import boto3
import yt_dlp
from botocore.client import Config
from dotenv import load_dotenv
from supabase import create_client, Client

# Configure UTF-8 encoding for stdout on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Load environment variables
load_dotenv()

def get_clean_env(name):
    val = os.getenv(name)
    if val and "PLACEHOLDER" in val:
        return None
    return val

# Required credentials
supabase_url = get_clean_env("EXPO_PUBLIC_SUPABASE_URL")
supabase_key = get_clean_env("SUPABASE_SERVICE_ROLE_KEY") or get_clean_env("EXPO_PUBLIC_SUPABASE_ANON_KEY")
r2_account_id = get_clean_env("CLOUDFLARE_R2_ACCOUNT_ID")
r2_access_key_id = get_clean_env("CLOUDFLARE_R2_ACCESS_KEY_ID")
r2_secret_access_key = get_clean_env("CLOUDFLARE_R2_SECRET_ACCESS_KEY")
r2_bucket_name = get_clean_env("CLOUDFLARE_R2_BUCKET_NAME")
r2_public_url = get_clean_env("EXPO_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL")

if not supabase_url or not supabase_key or not r2_account_id or not r2_access_key_id or not r2_secret_access_key or not r2_bucket_name or not r2_public_url:
    print("[ERROR] Missing required configuration in .env")
    sys.exit(1)

# Initialize Supabase & R2
supabase: Client = create_client(supabase_url, supabase_key)
r2_client = boto3.client(
    's3',
    endpoint_url=f'https://{r2_account_id}.r2.cloudflarestorage.com',
    aws_access_key_id=r2_access_key_id,
    aws_secret_access_key=r2_secret_access_key,
    config=Config(signature_version='s3v4'),
    region_name='auto'
)

workspace_dir = r"d:\VisualStudio\Projects\Music player"
downloads_dir = os.path.join(workspace_dir, "downloads")
os.makedirs(downloads_dir, exist_ok=True)

cover_arts = [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop"
]

def normalize(text):
    return re.sub(r'[^a-z0-9]', '', str(text).lower())

def sanitize_filename(name):
    sanitized = re.sub(r'[^a-zA-Z0-9\s\-_]', '', name)
    return re.sub(r'\s+', ' ', sanitized).strip()

# 1. Fetch existing songs from Supabase to prevent duplicates
print("Fetching existing songs from Supabase...")
existing_db = supabase.table("songs").select("title, artist").execute().data
existing_set = set()
for item in existing_db:
    t = normalize(item.get("title", ""))
    a = normalize(item.get("artist", ""))
    existing_set.add(f"{t}___{a}")
    existing_set.add(t)

print(f"Loaded {len(existing_db)} existing songs from database.")

# 2. List of candidate tracks
new_tracks = [
    # --- New Tamil Hits ---
    {"title": "Hukum - Thalaivar Alappara", "artist": "Anirudh Ravichander", "language": "Tamil"},
    {"title": "Naa Ready", "artist": "Thalapathy Vijay", "language": "Tamil"},
    {"title": "Hayyoda", "artist": "Anirudh Ravichander", "language": "Tamil"},
    {"title": "Chilla Chilla", "artist": "Anirudh Ravichander", "language": "Tamil"},
    {"title": "Arabic Kuthu - Halamithi Habibo", "artist": "Anirudh Ravichander", "language": "Tamil"},
    {"title": "Katchi Sera", "artist": "Sai Abhyankkar", "language": "Tamil"},
    {"title": "Aasa Kooda", "artist": "Sai Abhyankkar", "language": "Tamil"},
    {"title": "Illuminati", "artist": "Dabzee", "language": "Tamil"},
    {"title": "Ranjithame", "artist": "Thalapathy Vijay", "language": "Tamil"},
    {"title": "Kaavaalaa", "artist": "Shilpa Rao", "language": "Tamil"},
    {"title": "Nira", "artist": "Sid Sriram", "language": "Tamil"},
    {"title": "VIP Title Track", "artist": "Anirudh Ravichander", "language": "Tamil"},

    # --- New English Hits ---
    {"title": "Cruel Summer", "artist": "Taylor Swift", "language": "English"},
    {"title": "As It Was", "artist": "Harry Styles", "language": "English"},
    {"title": "Blinding Lights", "artist": "The Weeknd", "language": "English"},
    {"title": "Vampire", "artist": "Olivia Rodrigo", "language": "English"},
    {"title": "Flowers", "artist": "Miley Cyrus", "language": "English"},
    {"title": "Espresso", "artist": "Sabrina Carpenter", "language": "English"},
    {"title": "Greedy", "artist": "Tate McRae", "language": "English"},
    {"title": "Levitating", "artist": "Dua Lipa", "language": "English"},
    {"title": "Starboy", "artist": "The Weeknd", "language": "English"},
    {"title": "Shape of You", "artist": "Ed Sheeran", "language": "English"},
    {"title": "Stay", "artist": "The Kid LAROI & Justin Bieber", "language": "English"},
    {"title": "Water", "artist": "Tyla", "language": "English"}
]

print(f"\nProcessing {len(new_tracks)} candidate tracks...")

downloaded_count = 0
skipped_count = 0
failed_count = 0

for i, track in enumerate(new_tracks):
    title = track["title"]
    artist = track["artist"]
    language = track["language"]

    t_norm = normalize(title)
    a_norm = normalize(artist)
    key_combo = f"{t_norm}___{a_norm}"

    # Strict Duplicate Check
    if key_combo in existing_set or t_norm in existing_set:
        print(f"[{i+1}/{len(new_tracks)}] SKIPPED (Already in database): {artist} - {title}")
        skipped_count += 1
        continue

    filename_base = f"{language[:2].upper()}_NEW_{i+1:02d} - {sanitize_filename(artist)} - {sanitize_filename(title)}"
    local_filename = f"{filename_base}.m4a"
    local_filepath = os.path.join(downloads_dir, local_filename)

    # Download from YouTube if not exists
    if not os.path.exists(local_filepath):
        print(f"\n[{i+1}/{len(new_tracks)}] DOWNLOADING: {artist} - {title} ({language})")
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
            print(f"Downloaded: {local_filename}")
        except Exception as e:
            print(f"Failed to download {artist} - {title}: {e}")
            failed_count += 1
            continue

    if not os.path.exists(local_filepath):
        print(f"File missing: {local_filepath}")
        failed_count += 1
        continue

    # Upload to Cloudflare R2
    r2_key = f"songs/{local_filename}"
    print(f"Uploading to R2: {r2_key}...")
    try:
        r2_client.upload_file(
            Filename=local_filepath,
            Bucket=r2_bucket_name,
            Key=r2_key,
            ExtraArgs={'ContentType': 'audio/mp4'}
        )
    except Exception as e:
        print(f"R2 Upload failed for {local_filename}: {e}")
        failed_count += 1
        continue

    # Insert into Supabase
    audio_url = f"{r2_public_url.rstrip('/')}/{r2_key}"
    cover_url = cover_arts[i % len(cover_arts)]

    song_record = {
        "title": title,
        "artist": artist,
        "audio_url": audio_url,
        "cover_url": cover_url,
        "language": language
    }

    try:
        supabase.table("songs").insert(song_record).execute()
        print(f"[SUCCESS] SYNCED TO SUPABASE: {artist} - {title}")
        downloaded_count += 1
        existing_set.add(key_combo)
        existing_set.add(t_norm)
    except Exception as e:
        print(f"Supabase Insert error for {artist} - {title}: {e}")
        failed_count += 1

print("\n================ SUMMARY ================")
print(f"Total Candidate Tracks: {len(new_tracks)}")
print(f"Skipped (Duplicates): {skipped_count}")
print(f"Newly Downloaded & Synced: {downloaded_count}")
print(f"Failed: {failed_count}")
print("=========================================")
