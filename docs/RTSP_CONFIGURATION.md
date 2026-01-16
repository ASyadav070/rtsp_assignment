# RTSP URL Configuration Guide

This document explains how to provide, change, and configure RTSP stream URLs for the livestream player.

---

## Supported Stream Types

The application supports multiple stream types:

| Stream Type | URL Pattern | Example |
|-------------|-------------|---------|
| **RTSP** | `rtsp://...` | `rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4` |
| **Wowza Embed** | `https://embed.wowza.com/...` | `https://embed.wowza.com/12345.js` |
| **HLS** | `https://.../*.m3u8` | `https://example.com/stream/playlist.m3u8` |
| **HTTP/HTTPS** | `http(s)://...` | Direct video URLs |

---

## Providing an RTSP URL

### Via the User Interface

1. Open the application at `http://localhost:5173`
2. Locate the **RTSP URL Input** field at the top of the page
3. Enter your RTSP stream URL
4. Click **Play** to start the stream

### Example RTSP URLs for Testing

Here are some public RTSP streams you can use for testing:

```
# Wowza Test Streams
rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4

# Generic RTSP format
rtsp://username:password@ip-address:port/stream
```

---

## How RTSP Streaming Works

```
┌─────────────┐     RTSP      ┌─────────────┐     MJPEG      ┌─────────────┐
│  IP Camera  │ ────────────► │   FFmpeg    │ ─────────────► │   Browser   │
│   / Source  │               │  (Backend)  │                │  (Frontend) │
└─────────────┘               └─────────────┘                └─────────────┘
```

1. **User enters RTSP URL** in the frontend
2. **Frontend sends request** to backend stream endpoint
3. **Backend uses FFmpeg** to transcode RTSP to MJPEG
4. **Browser displays** the MJPEG stream in real-time

---

## Stream Endpoint API

### MJPEG Stream Endpoint

```
GET /stream/mjpeg?url={encoded_rtsp_url}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | URL-encoded RTSP stream URL |

**Example:**
```
http://localhost:5000/stream/mjpeg?url=rtsp%3A%2F%2Fexample.com%2Fstream
```

**Response:** `multipart/x-mixed-replace; boundary=frame` (MJPEG stream)

---

## Configuration Options

### Backend FFmpeg Settings

The FFmpeg transcoding is configured in `server/app/routes/stream.py`:

```python
command = [
    FFMPEG_PATH,
    '-rtsp_transport', 'tcp',  # Transport protocol (tcp/udp)
    '-i', rtsp_url,            # Input RTSP URL
    '-f', 'mjpeg',             # Output format
    '-q:v', '5',               # Quality (1-31, lower = better)
    '-r', '15',                # Frame rate
    '-an',                     # No audio
    '-update', '1',
    'pipe:1'
]
```

**Adjustable Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `-rtsp_transport` | `tcp` | Use `tcp` for reliability, `udp` for lower latency |
| `-q:v` | `5` | JPEG quality (1=best, 31=worst) |
| `-r` | `15` | Output frame rate |

### Setting Custom FFmpeg Path

If FFmpeg is not in your system PATH, set the `FFMPEG_PATH` environment variable:

**Windows:**
```env
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
```

**macOS/Linux:**
```env
FFMPEG_PATH=/usr/local/bin/ffmpeg
```

---

## Changing the RTSP URL

### Method 1: Runtime Change (Recommended)

Simply enter a new URL in the input field and click Play. No restart required.

### Method 2: Default URL in Code

To set a default RTSP URL, modify `client/src/App.jsx`:

```jsx
const [rtspUrl, setRtspUrl] = useState('rtsp://your-default-url-here');
```

### Method 3: Environment Variable

Create a `.env` file in the `client/` directory:

```env
VITE_DEFAULT_RTSP_URL=rtsp://your-stream-url
```

Then use it in your code:
```jsx
const defaultUrl = import.meta.env.VITE_DEFAULT_RTSP_URL || '';
```

---

## RTSP URL Authentication

For streams requiring authentication, include credentials in the URL:

```
rtsp://username:password@host:port/path
```

**Example:**
```
rtsp://admin:password123@192.168.1.100:554/stream1
```

> ⚠️ **Security Warning:** Never commit URLs with credentials to version control. Use environment variables instead.

---

## Wowza Embed URLs

The application automatically detects and handles Wowza embed URLs:

```
https://embed.wowza.com/12345.js
```

These are rendered directly in an iframe without FFmpeg transcoding.

---

## HLS Streams

For HLS streams (`.m3u8` files), the application uses the native HTML5 video player:

```
https://example.com/live/stream.m3u8
```

---

## Troubleshooting

### Stream Won't Play

1. **Verify the RTSP URL** is accessible:
   ```bash
   ffmpeg -i rtsp://your-url -t 5 -f null -
   ```

2. **Check FFmpeg installation:**
   ```bash
   ffmpeg -version
   ```

3. **Test the stream endpoint:**
   ```bash
   curl "http://localhost:5000/stream/test"
   ```

### Common RTSP Issues

| Issue | Solution |
|-------|----------|
| Connection timeout | Check firewall settings, try TCP transport |
| Authentication failed | Verify username/password in URL |
| No video | Check if stream is broadcasting |
| High latency | Reduce quality (`-q:v`) or increase frame rate (`-r`) |

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Missing 'url' parameter" | No URL provided | Include the `url` query parameter |
| "Stream not available" | RTSP source offline | Verify source is broadcasting |
| "FFmpeg error" | Transcoding failed | Check FFmpeg logs, verify URL |

---

## Advanced Configuration

### Custom RTSP Transport

Edit `server/app/routes/stream.py` to change transport:

```python
# For UDP (lower latency, less reliable)
'-rtsp_transport', 'udp',

# For TCP (more reliable, slightly higher latency)
'-rtsp_transport', 'tcp',
```

### Adjusting Stream Quality

Modify FFmpeg parameters:

```python
# Higher quality (larger bandwidth)
'-q:v', '2',
'-r', '30',

# Lower quality (smaller bandwidth)
'-q:v', '10',
'-r', '10',
```

---

## Security Considerations

1. **Never expose RTSP credentials** in client-side code
2. **Use environment variables** for sensitive URLs
3. **Implement authentication** on the stream endpoint for production
4. **Consider rate limiting** to prevent abuse
5. **Use HTTPS** for production deployments

---

## Next Steps

- See [API.md](API.md) for complete API documentation
- See [USER_GUIDE.md](USER_GUIDE.md) for overlay management
