#!/usr/bin/env bash
# Compress every video under public/work/ for the web.
#
#   npm run videos
#
# For each .mp4 / .mov without a matching `<name>.optimized` marker it:
#   - re-encodes to H.264 (CRF 27, preset slow), max 1080 px on the long side,
#     AAC 128k audio, with +faststart so playback starts before the download ends
#   - writes a poster `<name>.jpg` from the frame at 1s (only if none exists)
#   - writes a 4 second muted 480p hover preview `<name>.preview.mp4`
#   - writes a small `<name>.thumb.jpg` (360 px wide) for tiles and grid cards
#   - replaces the original in place and keeps a backup in .video-originals/
#
# Uses `ffmpeg` from your PATH. To use a different binary:
#   FFMPEG=/path/to/ffmpeg npm run videos
set -euo pipefail

cd "$(dirname "$0")/.."

FFMPEG="${FFMPEG:-ffmpeg}"
WORK_DIR="public/work"
BACKUP_DIR=".video-originals"

if ! command -v "$FFMPEG" >/dev/null 2>&1; then
  echo "ffmpeg not found. Install it (e.g. 'brew install ffmpeg') or set FFMPEG=/path/to/ffmpeg." >&2
  exit 1
fi

human() {
  awk -v b="$1" 'BEGIN { if (b < 1048576) printf "%d KB", b / 1024; else printf "%.1f MB", b / 1048576 }'
}

filesize() {
  wc -c <"$1" | tr -d ' '
}

trap 'rm -f "${tmp:-}"' EXIT

count=0
total_before=0
total_after=0

while IFS= read -r -d '' src; do
  dir="$(dirname "$src")"
  file="$(basename "$src")"
  name="${file%.*}"
  marker="$dir/$name.optimized"
  out="$dir/$name.mp4"
  tmp="$dir/$name.tmp.mp4"
  poster="$dir/$name.jpg"
  preview="$dir/$name.preview.mp4"

  if [[ -f "$marker" ]]; then
    continue
  fi

  echo "Optimizing $src"
  before=$(filesize "$src")

  # Keep an untouched copy of the original.
  rel="${src#"$WORK_DIR"/}"
  mkdir -p "$BACKUP_DIR/$(dirname "$rel")"
  cp -p "$src" "$BACKUP_DIR/$rel"

  # Full video: cap the long side at 1080 px, keep even dimensions for H.264.
  "$FFMPEG" -nostdin -hide_banner -loglevel error -y -i "$src" \
    -map 0:v:0 -map 0:a:0? \
    -vf "scale=w='min(1080,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 128k \
    -movflags +faststart \
    "$tmp"

  # Replace the original (a .mov becomes an .mp4).
  if [[ "$src" != "$out" ]]; then
    rm "$src"
  fi
  mv "$tmp" "$out"

  if [[ ! -f "$poster" ]]; then
    "$FFMPEG" -nostdin -hide_banner -loglevel error -y -ss 1 -i "$out" \
      -frames:v 1 -q:v 3 "$poster"
    echo "  poster  -> $poster"
  fi

  # Hover preview: first 4 seconds, no audio, 480 px on the short side.
  "$FFMPEG" -nostdin -hide_banner -loglevel error -y -i "$out" -t 4 -an \
    -vf "scale='if(gt(iw,ih),-2,480)':'if(gt(iw,ih),480,-2)'" \
    -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p \
    -movflags +faststart \
    "$preview"
  echo "  preview -> $preview ($(human "$(filesize "$preview")"))"

  touch "$marker"

  after=$(filesize "$out")
  echo "  $(human "$before") -> $(human "$after")"
  count=$((count + 1))
  total_before=$((total_before + before))
  total_after=$((total_after + after))
done < <(find "$WORK_DIR" -type f \( -iname '*.mp4' -o -iname '*.mov' \) \
  ! -name '*.preview.mp4' ! -name '*.tmp.mp4' -print0 | sort -z)

# Small thumbnails for every poster (also covers posters you replace by hand:
# delete the old .thumb.jpg and run again).
while IFS= read -r -d '' poster; do
  thumb="${poster%.jpg}.thumb.jpg"
  [[ -f "$thumb" ]] && continue
  "$FFMPEG" -nostdin -hide_banner -loglevel error -y -i "$poster" \
    -vf "scale=360:-2" -q:v 9 "$thumb"
  echo "Thumbnail $thumb ($(human "$(filesize "$thumb")"))"
done < <(find "$WORK_DIR" -type f -name '*.jpg' ! -name '*.thumb.jpg' -print0 | sort -z)

if [[ $count -eq 0 ]]; then
  echo "No new videos to optimize."
else
  echo "Done: $count video(s), $(human "$total_before") -> $(human "$total_after")"
fi
