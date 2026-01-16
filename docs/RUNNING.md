# Running the Application

This guide provides instructions for running the RTSP Livestream with Overlay application locally.

---

## Quick Start

### Step 1: Start MongoDB

Ensure MongoDB is running before starting the backend.

```bash
# Windows (Command Prompt as Administrator)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod --dbpath /data/db
```

### Step 2: Start the Backend Server

Open a terminal and run:

```bash
cd server

# Activate virtual environment (if using)
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Start the server
python run.py
```

The API server will be available at: **http://localhost:5000**

### Step 3: Start the Frontend Development Server

Open another terminal and run:

```bash
cd client
npm run dev
```

The frontend will be available at: **http://localhost:5173**

### Step 4: Access the Application

Open your browser and navigate to: **http://localhost:5173**

---

## Running Scripts Summary

| Component | Directory | Command | URL |
|-----------|-----------|---------|-----|
| Backend | `server/` | `python run.py` | http://localhost:5000 |
| Frontend | `client/` | `npm run dev` | http://localhost:5173 |

---

## Available npm Scripts (Frontend)

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint code linting
npm run lint
```

---

## Environment-Specific Running

### Development Mode

Both servers run with hot-reload enabled:

**Backend (Flask):**
```bash
cd server
FLASK_DEBUG=True python run.py
```

**Frontend (Vite):**
```bash
cd client
npm run dev
```

### Production Mode

**Backend with Gunicorn:**
```bash
cd server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

**Frontend Production Build:**
```bash
cd client
npm run build
# Serve the dist/ folder with a static file server
npx serve dist
```

---

## Running with Docker (Optional)

If you prefer using Docker, create the following `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/
      - MONGO_DB_NAME=rtsp_overlay_db
      - CORS_ORIGINS=http://localhost:5173
    depends_on:
      - mongodb

  frontend:
    build: ./client
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Then run:
```bash
docker-compose up
```

---

## Verifying the Application is Running

### 1. Check Backend Health

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "RTSP Overlay API is running"
}
```

### 2. Check Stream Endpoint

```bash
curl http://localhost:5000/stream/test
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Stream endpoint is available"
}
```

### 3. Check Frontend

Open http://localhost:5173 in your browser. You should see:
- Video player area
- RTSP URL input field
- Overlay controls panel

---

## Running Both Services Simultaneously

### Option 1: Using Multiple Terminals

1. **Terminal 1 (Backend):**
   ```bash
   cd server && python run.py
   ```

2. **Terminal 2 (Frontend):**
   ```bash
   cd client && npm run dev
   ```

### Option 2: Using a Process Manager (Windows)

Create a `start.bat` file in the project root:

```batch
@echo off
start cmd /k "cd server && python run.py"
start cmd /k "cd client && npm run dev"
```

### Option 3: Using a Process Manager (macOS/Linux)

Create a `start.sh` file in the project root:

```bash
#!/bin/bash
cd server && python run.py &
cd client && npm run dev &
wait
```

Make it executable: `chmod +x start.sh`

---

## Stopping the Application

### Stop Frontend (Vite)
Press `Ctrl + C` in the terminal running the frontend.

### Stop Backend (Flask)
Press `Ctrl + C` in the terminal running the backend.

### Stop MongoDB

```bash
# Windows
net stop MongoDB

# macOS/Linux
sudo systemctl stop mongod
```

---

## Troubleshooting Runtime Issues

| Issue | Solution |
|-------|----------|
| Backend won't start | Check if port 5000 is in use: `netstat -ano | findstr :5000` |
| Frontend won't start | Check if port 5173 is in use: `netstat -ano | findstr :5173` |
| Can't connect to MongoDB | Verify MongoDB is running: `mongod --version` |
| Stream not working | Verify FFmpeg is installed: `ffmpeg -version` |
| CORS errors in browser | Ensure backend is running and CORS_ORIGINS is configured |

---

## Next Steps

- Configure your RTSP stream URL: [RTSP_CONFIGURATION.md](RTSP_CONFIGURATION.md)
- Learn the API endpoints: [API.md](API.md)
- Learn how to use the application: [USER_GUIDE.md](USER_GUIDE.md)
