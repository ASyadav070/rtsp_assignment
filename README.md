# RTSP Livestream Overlay Application

A web application that plays a livestream video from an RTSP source and allows users to create, manage, and display custom overlays on top of the video in real-time.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [RTSP Guide](#rtsp-guide)
- [API Documentation](#api-documentation)
- [User Guide](#user-guide)

---

## 📁 Project Structure

```
RTSP/
├── server/                          # Flask Backend (API-only)
│   ├── app/
│   │   ├── __init__.py              # Flask app factory
│   │   ├── config.py                # Configuration settings
│   │   ├── db.py                    # MongoDB connection
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── overlay.py           # Overlay Pydantic schemas
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── overlays.py          # CRUD API endpoints
│   ├── requirements.txt             # Python dependencies
│   └── run.py                       # Entry point
│
├── client/                          # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoPlayer.jsx      # RTSP video player
│   │   │   ├── Overlay.jsx          # Draggable/resizable overlay
│   │   │   ├── OverlayContainer.jsx # Overlay manager
│   │   │   └── OverlayControls.jsx  # UI controls
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.jsx                  # Main component
│   │   ├── App.css                  # Styles
│   │   └── index.js                 # Entry point
│   └── package.json
│
└── README.md
```

---

## 🛠 Technology Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 19+vite                |
| Backend    | Python Flask            |
| Database   | MongoDB                 |
| Video      | RTSP via RTSP.me        |

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **MongoDB** (running locally or remote instance)
- **FFmpeg** (required for RTSP stream transcoding)

### FFmpeg Installation

FFmpeg is required for RTSP stream transcoding. Install it based on your OS:

**Windows:**
```bash
# Using winget
winget install ffmpeg

# Or download from https://ffmpeg.org/download.html and add to PATH
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update && sudo apt install ffmpeg
```

Verify installation:
```bash
ffmpeg -version
```

### Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment (optional):**
   
   Copy the example environment file and update as needed:
   ```bash
   cp .env.example .env
   ```

   Or set environment variables directly:
   ```bash
   # Windows PowerShell
   $env:MONGO_URI = "mongodb://your-mongo-uri:27017/"
   $env:MONGO_DB_NAME = "rtsp_overlay_db"
   
   # macOS/Linux
   export MONGO_URI="mongodb://your-mongo-uri:27017/"
   export MONGO_DB_NAME="rtsp_overlay_db"
   ```

5. **Start the Flask server:**
   ```bash
   python run.py
   ```
   
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm run dev
   ```
   
   The application will open at `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (server/.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017/` | MongoDB connection string |
| `MONGO_DB_NAME` | `rtsp_overlay_db` | Database name |
| `FLASK_DEBUG` | `True` | Enable Flask debug mode |
| `SECRET_KEY` | `dev-secret-key...` | Flask secret key (change in production) |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Allowed CORS origins (comma-separated) |
| `FFMPEG_PATH` | (auto-detected) | Custom FFmpeg executable path |

### Frontend (client/.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | Backend API base URL |

---

## 📹 RTSP Guide

### How RTSP Streaming Works

Browsers do not natively support the RTSP protocol. This application provides **built-in RTSP transcoding** using FFmpeg to convert RTSP streams to MJPEG format playable in browsers.

### Supported Stream Types

| Type | Format | How it works |
|------|--------|--------------|
| **RTSP** | `rtsp://...` | Transcoded via FFmpeg backend → MJPEG |
| **HLS** | `https://.../*.m3u8` | Direct playback via HTML5 video |
| **Wowza Embed** | `https://embed.wowza.com/...` | Iframe embed |

### Providing an RTSP URL

1. Enter your RTSP URL in the input field at the top of the page
2. Click "Load Stream" to start playback

**Example RTSP URLs:**
```
rtsp://your-camera-ip:554/stream
rtsp://username:password@camera-ip:554/channel1
rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4
```

### Using RTSP.me (Alternative)

For production use without FFmpeg:
1. Visit [RTSP.me](https://rtsp.me)
2. Register your RTSP stream
3. Obtain a stream key
4. The embed URL will be: `https://rtsp.me/embed/YOUR_STREAM_KEY/`

---

## 📡 API Documentation

Base URL: `http://localhost:5000`

### Endpoints

#### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "message": "RTSP Overlay API is running"
}
```

---

#### Get All Overlays
```
GET /overlays
```
**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "content": "Live Event",
    "type": "text",
    "position": { "x": 50, "y": 30 },
    "size": { "width": 200, "height": 40 },
    "createdAt": "2026-01-15T10:00:00",
    "updatedAt": "2026-01-15T10:00:00"
  }
]
```

---

#### Create Overlay
```
POST /overlays
Content-Type: application/json
```
**Request Body:**
```json
{
  "content": "Hello World",
  "type": "text",
  "position": { "x": 100, "y": 50 },
  "size": { "width": 150, "height": 40 }
}
```
**Response:** `201 Created`
```json
{
  "id": "507f1f77bcf86cd799439012",
  "content": "Hello World",
  "type": "text",
  "position": { "x": 100, "y": 50 },
  "size": { "width": 150, "height": 40 },
  "createdAt": "2026-01-15T10:05:00",
  "updatedAt": "2026-01-15T10:05:00"
}
```

---

#### Update Overlay
```
PUT /overlays/<id>
Content-Type: application/json
```
**Request Body (partial update):**
```json
{
  "position": { "x": 200, "y": 100 }
}
```
**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439012",
  "content": "Hello World",
  "type": "text",
  "position": { "x": 200, "y": 100 },
  "size": { "width": 150, "height": 40 },
  "createdAt": "2026-01-15T10:05:00",
  "updatedAt": "2026-01-15T10:10:00"
}
```

---

#### Delete Overlay
```
DELETE /overlays/<id>
```
**Response:** `200 OK`
```json
{
  "message": "Overlay deleted successfully",
  "id": "507f1f77bcf86cd799439012"
}
```

---

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Overlay doesn't exist |
| 500 | Internal Server Error |

**Error Response Format:**
```json
{
  "error": "Error message",
  "details": [...]  // Optional validation details
}
```

---

## 👤 User Guide

### Playing the Livestream

1. **Enter RTSP URL:** Type your RTSP stream URL in the input field
2. **Load Stream:** Click "Load Stream" to start playback
3. **Playback Controls:**
   - **Play/Pause:** Click the play/pause button
   - **Volume:** Adjust the volume slider

### Managing Overlays

#### Creating an Overlay

1. Select overlay type: **Text** or **Image**
2. Enter content:
   - For Text: Type your overlay text
   - For Image: Enter a valid image URL
3. Set dimensions (width and height in pixels)
4. Click **"Add Overlay"**

The overlay will appear on the video at the default position (50, 50).

#### Moving Overlays (Drag & Drop)

- Click and drag any overlay to reposition it on the video
- Release to save the new position
- Position is automatically synced to the backend

#### Resizing Overlays

- Hover over an overlay to see the resize handle (bottom-right corner)
- Click and drag the handle to resize
- Size is automatically synced to the backend

#### Deleting Overlays

- In the "Active Overlays" list, click the red trash icon next to any overlay
- The overlay is immediately removed from the video and database

### Real-Time Behavior

- All changes (create, update, delete) are immediately reflected on the video
- Changes are persisted to MongoDB and survive page refreshes
- Multiple users viewing the same page will see consistent overlay state after refresh

---

## 🔧 Troubleshooting

### Backend Issues

| Problem | Solution |
|---------|----------|
| MongoDB connection failed | Ensure MongoDB is running on `localhost:27017` |
| Module not found | Run `pip install -r requirements.txt` |
| Port 5000 in use | Change port in `run.py` or kill the process using port 5000 |

### Frontend Issues

| Problem | Solution |
|---------|----------|
| Failed to fetch overlays | Ensure Flask backend is running on port 5000 |
| npm install fails | Delete `node_modules` and `package-lock.json`, then retry |
| CORS error | Verify Flask-CORS is configured for `localhost:3000` |

### RTSP Issues

| Problem | Solution |
|---------|----------|
| Stream not loading | Verify RTSP URL is accessible and correct |
| Black screen | Check if the RTSP stream requires authentication |
| Buffering | RTSP.me may have latency; consider local HLS conversion |

---


