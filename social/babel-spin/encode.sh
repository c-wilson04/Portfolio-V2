#!/usr/bin/env bash
# Encode the rendered frames:  ./encode.sh <frames dir> [output name]
#   <name>.mp4  : H.264, 30 fps, with a silent audio track (what Instagram takes)
#   <name>.webp : animated WebP, 15 fps, loops forever
set -euo pipefail
dir=${1:-frames}
name=${2:-babel-spin}

ffmpeg -y -hide_banner -loglevel error \
  -framerate 30 -i "$dir/f%04d.png" \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -map 0:v -map 1:a -shortest \
  -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.2 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -g 60 -movflags +faststart \
  -c:a aac -b:a 96k \
  "$name.mp4"

ffmpeg -y -hide_banner -loglevel error \
  -framerate 30 -i "$dir/f%04d.png" \
  -vf "fps=15" \
  -c:v libwebp_anim -lossless 0 -quality 72 -compression_level 6 -loop 0 \
  "$name.webp"

ls -la "$name.mp4" "$name.webp"
