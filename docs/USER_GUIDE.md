# User Guide

A comprehensive guide to using the RTSP Livestream with Overlay application.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Livestream Playback](#livestream-playback)
3. [Overlay Management](#overlay-management)
4. [Keyboard Shortcuts](#keyboard-shortcuts)
5. [Tips & Best Practices](#tips--best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Launching the Application

1. Ensure the backend server is running (`python run.py` in the `server/` directory)
2. Ensure the frontend is running (`npm run dev` in the `client/` directory)
3. Open your browser and navigate to: **http://localhost:5173**

### Application Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header / Controls                        │
│  [RTSP URL Input Field........................] [▶ Play] [⏸ Pause] │
├───────────────────────────────────────┬─────────────────────────┤
│                                       │                         │
│                                       │    Overlay Manager      │
│           Video Player                │                         │
│                                       │    [Create Overlay]     │
│       (Livestream Display)            │                         │
│                                       │    [Overlay List]       │
│       [Overlays appear here]          │                         │
│                                       │                         │
└───────────────────────────────────────┴─────────────────────────┘
```

---

## Livestream Playback

### Starting a Stream

1. **Enter the Stream URL**
   - Locate the RTSP URL input field at the top of the page
   - Enter your stream URL (see supported formats below)
   
2. **Click Play**
   - Click the Play button (▶) to start the stream
   - The video will appear in the main player area

3. **Stop the Stream**
   - Click the Pause button (⏸) to stop playback

### Supported Stream Formats

| Format | Example URL | Notes |
|--------|-------------|-------|
| RTSP | `rtsp://server:554/stream` | Transcoded via FFmpeg |
| Wowza Embed | `https://embed.wowza.com/...` | Direct iframe embed |
| HLS | `https://server/stream.m3u8` | Native HTML5 player |

### Test RTSP URLs

Use these public streams for testing:

```
rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4
```

### Stream Controls

| Control | Action |
|---------|--------|
| **Play** | Start stream playback |
| **Pause** | Stop stream playback |
| **Volume** | Adjust audio level (if supported) |

---

## Overlay Management

Overlays are visual elements that appear on top of the livestream. You can add text labels, logos, or images.

### Creating an Overlay

1. **Open the Overlay Manager** panel (right side of the screen)

2. **Select Overlay Type**
   - **Text**: Display text content
   - **Image**: Display an image from a URL

3. **Enter Content**
   - For **Text**: Enter the text to display (e.g., "LIVE", "Breaking News")
   - For **Image**: Enter the full image URL (e.g., `https://example.com/logo.png`)

4. **Set Dimensions**
   - **Width**: Overlay width in pixels
   - **Height**: Overlay height in pixels

5. **Click "Create Overlay"**
   - The overlay appears on the video player at a default position

### Text Overlay Example

```
Type: Text
Content: LIVE
Width: 80
Height: 30
```

### Image Overlay Example

```
Type: Image
Content: https://mycompany.com/logo.png
Width: 150
Height: 75
```

### Moving Overlays

Overlays are **draggable**. To reposition:

1. Click and hold on the overlay
2. Drag to the desired position
3. Release to set the new position
4. Position is automatically saved to the database

### Resizing Overlays

Overlays are **resizable**. To resize:

1. Hover over the overlay to see resize handles
2. Click and drag a corner or edge handle
3. Release to set the new size
4. Size is automatically saved to the database

### Deleting an Overlay

1. Find the overlay in the **Overlay List**
2. Click the **Delete** button (🗑️) next to the overlay
3. Confirm deletion if prompted
4. The overlay is removed immediately

### Overlay Properties

| Property | Description |
|----------|-------------|
| **Content** | The text or image URL |
| **Type** | `text` or `image` |
| **Position** | X/Y coordinates on the video |
| **Size** | Width and height in pixels |

---

## Overlay Types

### Text Overlays

Best for:
- Live indicators (LIVE, RECORDING)
- Titles and captions
- Time/date stamps
- Watermarks

**Tips:**
- Keep text short for readability
- Use contrasting colors
- Position in corners to avoid obstructing content

### Image Overlays

Best for:
- Company logos
- Branding elements
- Icons and badges
- Sponsor logos

**Tips:**
- Use PNG images with transparency
- Ensure images are web-accessible
- Keep file sizes small for performance
- Use appropriate dimensions

---

## Workflow Examples

### Adding a "LIVE" Badge

1. Select Type: **Text**
2. Content: `🔴 LIVE`
3. Width: `100`
4. Height: `35`
5. Click **Create Overlay**
6. Drag to top-left corner of video

### Adding a Logo Watermark

1. Select Type: **Image**
2. Content: `https://yoursite.com/logo.png`
3. Width: `120`
4. Height: `60`
5. Click **Create Overlay**
6. Drag to bottom-right corner of video

### Creating a Lower Third

1. Select Type: **Text**
2. Content: `John Smith - CEO, Company Inc.`
3. Width: `350`
4. Height: `50`
5. Click **Create Overlay**
6. Position at the bottom of the video

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause stream |
| `M` | Mute/Unmute |
| `Delete` | Delete selected overlay |
| `Escape` | Deselect overlay |

---

## Tips & Best Practices

### Stream Performance

1. **Use lower quality for slow connections**
   - Contact admin to adjust FFmpeg quality settings

2. **Close unused browser tabs**
   - Streaming uses significant resources

3. **Use a wired connection**
   - WiFi may introduce latency

### Overlay Design

1. **Keep overlays minimal**
   - Too many overlays can distract from content

2. **Use consistent positioning**
   - Standard positions: corners, lower third

3. **Consider contrast**
   - Ensure text is readable against video content

4. **Test on different content**
   - Overlays should work with various backgrounds

### Data Management

1. **Overlays persist in database**
   - They're saved automatically and survive page refreshes

2. **Regular cleanup**
   - Delete unused overlays to keep the interface clean

3. **Backup considerations**
   - Export overlay configurations if needed

---

## Troubleshooting

### Stream Issues

| Problem | Solution |
|---------|----------|
| Stream won't start | Verify RTSP URL is correct and accessible |
| Black screen | Check if stream source is broadcasting |
| Choppy playback | Reduce quality or check network connection |
| "Stream not available" | Ensure backend server is running |

### Overlay Issues

| Problem | Solution |
|---------|----------|
| Overlay not appearing | Check if it's positioned outside visible area |
| Can't drag overlay | Ensure overlay is selected first |
| Overlay not saving | Check backend server connection |
| Image not loading | Verify image URL is accessible and valid |

### General Issues

| Problem | Solution |
|---------|----------|
| Page won't load | Ensure frontend server is running |
| API errors | Check if backend is running on port 5000 |
| Changes not saving | Verify MongoDB is running |

### Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Failed to fetch overlays" | Cannot reach backend | Start backend server |
| "Validation error" | Invalid overlay data | Check content and dimensions |
| "Overlay not found" | ID doesn't exist | Refresh overlay list |
| "Content is required" | Empty content field | Enter text or image URL |

---

## Frequently Asked Questions

### Q: How many overlays can I create?

A: There's no hard limit, but for performance, we recommend keeping it under 10 active overlays.

### Q: Are overlays visible to stream viewers?

A: In this implementation, overlays are client-side only. To broadcast overlays, you would need to integrate with your streaming software.

### Q: Can I save overlay presets?

A: Currently, overlays are saved individually. Preset functionality may be added in future versions.

### Q: Does the app support multiple streams?

A: The current version supports one stream at a time. Multi-stream support may be added in future updates.

### Q: Can I use local images for overlays?

A: No, images must be hosted on a web-accessible URL. Consider using a service like Imgur or your own server.

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check the console for error messages (F12 → Console)
2. Verify all services are running (MongoDB, Backend, Frontend)
3. Review the [API documentation](API.md) for technical details
4. Check the [RTSP Configuration guide](RTSP_CONFIGURATION.md) for stream issues

---

## Related Documentation

- [Setup Instructions](SETUP.md) - Initial setup guide
- [Running the Application](RUNNING.md) - How to run locally
- [RTSP Configuration](RTSP_CONFIGURATION.md) - Stream URL configuration
- [API Documentation](API.md) - Backend API reference
