"""
RTSP Stream Transcoding Routes
Uses FFmpeg to convert RTSP streams to browser-compatible formats
"""
from flask import Blueprint, Response, request
import subprocess
import urllib.parse
import shutil
import os

stream_bp = Blueprint('stream', __name__)

def get_ffmpeg_path():
    """
    Find FFmpeg executable path.
    Checks:
    1. FFMPEG_PATH environment variable (custom path)
    2. System PATH
    3. Common installation directories (Windows/macOS/Linux)
    """
    # Check environment variable first (allows custom override)
    env_path = os.environ.get('FFMPEG_PATH')
    if env_path and os.path.exists(env_path):
        return env_path
    
    # Try to find in system PATH
    ffmpeg = shutil.which('ffmpeg')
    if ffmpeg:
        return ffmpeg
    
    # Common installation paths (cross-platform)
    common_paths = [
        # Windows
        r"C:\ffmpeg\bin\ffmpeg.exe",
        r"C:\Program Files\ffmpeg\bin\ffmpeg.exe",
        r"C:\Program Files (x86)\ffmpeg\bin\ffmpeg.exe",
        # macOS (Homebrew)
        "/usr/local/bin/ffmpeg",
        "/opt/homebrew/bin/ffmpeg",
        # Linux
        "/usr/bin/ffmpeg",
        "/usr/local/bin/ffmpeg",
    ]
    
    for path in common_paths:
        if os.path.exists(path):
            return path
    
    # Fall back to 'ffmpeg' - will work if it's in PATH
    return 'ffmpeg'

FFMPEG_PATH = get_ffmpeg_path()


@stream_bp.route('/stream/mjpeg')
def mjpeg_stream():
    """
    Convert RTSP stream to MJPEG for browser playback.
    Query param: url - the RTSP URL to stream
    """
    rtsp_url = request.args.get('url')
    
    if not rtsp_url:
        return {"error": "Missing 'url' query parameter"}, 400
    
    # Decode the URL if it was encoded
    rtsp_url = urllib.parse.unquote(rtsp_url)
    
    def generate():
        """Generator function that yields MJPEG frames from FFmpeg"""
        command = [
            FFMPEG_PATH,
            '-rtsp_transport', 'tcp',      # Use TCP for more reliable streaming
            '-i', rtsp_url,                 # Input RTSP URL
            '-f', 'mjpeg',                  # Output format: Motion JPEG
            '-q:v', '5',                    # Quality (1-31, lower is better)
            '-r', '15',                     # Frame rate
            '-an',                          # No audio
            '-update', '1',                 # Update output continuously
            'pipe:1'                        # Output to stdout
        ]
        
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            bufsize=10**8
        )
        
        try:
            # Read JPEG frames from FFmpeg output
            buffer = b''
            while True:
                chunk = process.stdout.read(4096)
                if not chunk:
                    break
                buffer += chunk
                
                # Look for JPEG frame boundaries (FFI marker: 0xFFD8, end: 0xFFD9)
                while True:
                    start = buffer.find(b'\xff\xd8')
                    end = buffer.find(b'\xff\xd9')
                    
                    if start != -1 and end != -1 and end > start:
                        # Extract complete JPEG frame
                        frame = buffer[start:end+2]
                        buffer = buffer[end+2:]
                        
                        # Yield as multipart response
                        yield (b'--frame\r\n'
                               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                    else:
                        break
        except GeneratorExit:
            pass
        finally:
            process.terminate()
            process.wait()
    
    return Response(
        generate(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


@stream_bp.route('/stream/test')
def test_stream():
    """Test endpoint to verify streaming route is working"""
    return {"status": "ok", "message": "Stream endpoint is available"}
