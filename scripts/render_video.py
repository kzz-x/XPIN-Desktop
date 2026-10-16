"""
XPIN-Desktop · Headless Video Rendering Pipeline
Renders deterministic frame-by-frame 1080p MP4 videos using Playwright & FFmpeg.
"""

import os
import sys
import time
import argparse
import subprocess
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

class QuietHTTPHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Suppress logging

def start_local_server(port, directory):
    def serve():
        handler = lambda *args, **kwargs: QuietHTTPHandler(*args, directory=directory, **kwargs)
        httpd = HTTPServer(('127.0.0.1', port), handler)
        httpd.serve_forever()

    thread = threading.Thread(target=serve, daemon=True)
    thread.start()
    return thread

def render_video(output_path='renders/cinematic_demo.mp4', duration=12.0, fps=24, width=1920, height=1080):
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    
    port = 8765
    start_local_server(port, repo_root)
    time.sleep(0.5)

    total_frames = int(duration * fps)
    print(f"🎬 Starting XPIN-Desktop Video Render...")
    print(f"   Resolution: {width}x{height} | FPS: {fps} | Duration: {duration}s | Total Frames: {total_frames}")
    print(f"   Output: {output_path}")

    # Launch FFmpeg process piping raw image sequence
    ffmpeg_cmd = [
        'ffmpeg',
        '-y',
        '-f', 'image2pipe',
        '-vcodec', 'png',
        '-r', str(fps),
        '-i', '-',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '18',
        '-preset', 'fast',
        output_path
    ]

    ffmpeg_proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create page with exact 1920x1080 viewport
        page = browser.new_page(viewport={'width': width, 'height': height})
        
        # Navigate to studio in headless full-bleed mode
        url = f"http://127.0.0.1:{port}/index.html?mode=headless"
        page.goto(url)
        page.wait_for_selector('#xpin-stage-container')
        
        # Ensure fonts and assets are ready
        page.wait_for_timeout(1000)

        print("⚡ Rendering frames...")
        for frame_idx in range(total_frames):
            current_time = frame_idx / fps
            
            # Deterministically seek to time T
            page.evaluate(f"""
                if (window.xpinStudio) {{
                    window.xpinStudio.timeline.pause();
                    window.xpinStudio.timeline.seek({current_time});
                }}
            """)

            # Capture exact 1920x1080 full viewport
            png_bytes = page.screenshot(type='png')
            
            ffmpeg_proc.stdin.write(png_bytes)

            if frame_idx % (fps * 2) == 0 or frame_idx == total_frames - 1:
                progress = ((frame_idx + 1) / total_frames) * 100
                print(f"   [{progress:5.1f}%] Rendered frame {frame_idx + 1}/{total_frames} (Time: {current_time:.2f}s)")

        browser.close()

    ffmpeg_proc.stdin.close()
    stderr_output = ffmpeg_proc.stderr.read()
    ffmpeg_proc.wait()

    if ffmpeg_proc.returncode == 0:
        file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"✅ Video rendering complete: {output_path} ({file_size_mb:.2f} MB)")
    else:
        print(f"❌ FFmpeg encoding failed:\n{stderr_output.decode('utf-8', errors='ignore')}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='XPIN-Desktop Headless Video Renderer')
    parser.add_argument('--output', default='renders/cinematic_demo.mp4', help='Output video file path')
    parser.add_argument('--duration', type=float, default=12.0, help='Duration in seconds')
    parser.add_argument('--fps', type=int, default=24, help='Frame rate')
    args = parser.parse_args()

    render_video(output_path=args.output, duration=args.duration, fps=args.fps)
