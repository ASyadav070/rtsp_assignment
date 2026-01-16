# Setup Instructions

This document provides detailed setup instructions for both the frontend (React/Vite) and backend (Flask/Python) components of the RTSP Livestream with Overlay application.

---

## Prerequisites

Before setting up the application, ensure you have the following installed:

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | v18+ | Frontend runtime |
| **npm** | v9+ | Frontend package manager |
| **Python** | v3.10+ | Backend runtime |
| **pip** | Latest | Python package manager |
| **MongoDB** | v6.0+ | Database storage |
| **FFmpeg** | v5.0+ | RTSP stream transcoding |

### Installing Prerequisites

#### Node.js & npm
- Download from [nodejs.org](https://nodejs.org/)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

#### Python & pip
- Download from [python.org](https://www.python.org/downloads/)
- Verify installation:
  ```bash
  python --version
  pip --version
  ```

#### MongoDB
- **Option 1:** Install locally from [mongodb.com](https://www.mongodb.com/try/download/community)
- **Option 2:** Use MongoDB Atlas (cloud) at [cloud.mongodb.com](https://cloud.mongodb.com/)
- Verify local installation:
  ```bash
  mongod --version
  ```

#### FFmpeg
- **Windows:** Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH
- **macOS:** `brew install ffmpeg`
- **Linux:** `sudo apt install ffmpeg` (Ubuntu/Debian)
- Verify installation:
  ```bash
  ffmpeg -version
  ```

---

## Backend Setup (Flask Server)

### 1. Navigate to the Server Directory

```bash
cd server
```

### 2. Create a Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies installed:**
- `Flask==3.0.0` - Web framework
- `flask-cors==4.0.0` - Cross-Origin Resource Sharing
- `pymongo==4.6.1` - MongoDB driver
- `pydantic==2.5.3` - Data validation
- `python-dotenv==1.0.0` - Environment variables

### 4. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/
MONGO_DB_NAME=rtsp_overlay_db

# Flask Configuration
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-change-in-production

# CORS Configuration (comma-separated origins)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# FFmpeg Path (optional - only if FFmpeg is not in system PATH)
# FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
```

### 5. Start MongoDB

Ensure MongoDB is running:

```bash
# Windows (if installed as service, it may auto-start)
mongod

# macOS/Linux
sudo systemctl start mongod
# or
mongod --dbpath /path/to/data/db
```

### 6. Run the Backend Server

```bash
python run.py
```

**Expected output:**
```
Starting RTSP Overlay API Server...
API available at: http://localhost:5000
Health check: http://localhost:5000/health
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
```

---

## Frontend Setup (React/Vite Client)

### 1. Navigate to the Client Directory

```bash
cd client
```

### 2. Install Node Dependencies

```bash
npm install
```

**Key dependencies:**
- `react` & `react-dom` - UI framework
- `axios` - HTTP client
- `react-draggable` - Drag functionality
- `react-resizable` - Resize functionality
- `vite` - Build tool

### 3. Configure Environment Variables (Optional)

Create a `.env` file in the `client/` directory:

```env
# API Base URL (defaults to /api with Vite proxy)
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Start the Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Production Build

### Frontend Production Build

```bash
cd client
npm run build
npm run preview  # Preview the production build
```

Build output will be in `client/dist/` directory.

### Backend Production Deployment

For production, consider:

1. **Use a production WSGI server:**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
   ```

2. **Set environment variables:**
   ```env
   FLASK_DEBUG=False
   SECRET_KEY=strong-random-secret-key
   MONGO_URI=mongodb://your-production-mongo-uri
   ```

3. **Configure reverse proxy** (nginx/Apache) for serving static files and SSL termination.

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Ensure MongoDB is running: `mongod --version` |
| FFmpeg not found | Add FFmpeg to system PATH or set `FFMPEG_PATH` env var |
| CORS errors | Check `CORS_ORIGINS` includes your frontend URL |
| Port already in use | Change port or kill existing process |
| npm install fails | Delete `node_modules/` and `package-lock.json`, then retry |

### Verify Installation

1. **Backend Health Check:** Visit `http://localhost:5000/health`
2. **Frontend:** Visit `http://localhost:5173`
3. **Stream Test:** Visit `http://localhost:5000/stream/test`

---

## Next Steps

- See [RUNNING.md](RUNNING.md) for instructions on running the application
- See [RTSP_CONFIGURATION.md](RTSP_CONFIGURATION.md) for RTSP URL configuration
- See [API.md](API.md) for API documentation
- See [USER_GUIDE.md](USER_GUIDE.md) for usage instructions
