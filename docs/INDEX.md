# Documentation Index

Welcome to the RTSP Livestream with Overlay application documentation.

---

## Quick Navigation

| Document | Description |
|----------|-------------|
| [SETUP.md](SETUP.md) | Complete setup instructions for frontend and backend |
| [RUNNING.md](RUNNING.md) | Instructions to run the application locally |
| [RTSP_CONFIGURATION.md](RTSP_CONFIGURATION.md) | How to provide or change the RTSP URL |
| [API.md](API.md) | API documentation with CRUD endpoint examples |
| [USER_GUIDE.md](USER_GUIDE.md) | User guide for livestream playback and overlay management |

---

## Getting Started

1. **First time setup?** → Start with [SETUP.md](SETUP.md)
2. **Ready to run?** → See [RUNNING.md](RUNNING.md)
3. **Need to configure streams?** → Check [RTSP_CONFIGURATION.md](RTSP_CONFIGURATION.md)
4. **Building integrations?** → Refer to [API.md](API.md)
5. **Learning the interface?** → Read [USER_GUIDE.md](USER_GUIDE.md)

---

## Document Overview

### [SETUP.md](SETUP.md) - Setup Instructions

- Prerequisites (Node.js, Python, MongoDB, FFmpeg)
- Backend setup (Flask server)
- Frontend setup (React/Vite client)
- Environment configuration
- Production build instructions
- Troubleshooting common setup issues

### [RUNNING.md](RUNNING.md) - Running the Application

- Quick start guide
- Starting individual services
- Running both services simultaneously
- Development vs production modes
- Verifying the application is running
- Docker setup (optional)

### [RTSP_CONFIGURATION.md](RTSP_CONFIGURATION.md) - RTSP URL Configuration

- Supported stream types (RTSP, HLS, Wowza)
- How streaming works (RTSP → FFmpeg → MJPEG)
- Configuring stream URLs
- FFmpeg settings and optimization
- Stream authentication
- Troubleshooting stream issues

### [API.md](API.md) - API Documentation

- Health check endpoints
- Stream endpoints
- Overlay CRUD operations:
  - GET `/overlays` - List all overlays
  - POST `/overlays` - Create overlay
  - PUT `/overlays/:id` - Update overlay
  - DELETE `/overlays/:id` - Delete overlay
- Data models and schemas
- Error handling
- Code examples (JavaScript, Python, cURL)

### [USER_GUIDE.md](USER_GUIDE.md) - User Guide

- Application layout and interface
- Livestream playback controls
- Creating and managing overlays
- Text vs image overlays
- Dragging and resizing overlays
- Workflow examples
- Tips and best practices
- FAQ and troubleshooting

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React/Vite)                    │
│                         http://localhost:5173                    │
│  ┌─────────────┐  ┌───────────────┐  ┌────────────────────┐    │
│  │ VideoPlayer │  │ OverlayManager │  │ OverlayControls   │    │
│  └─────────────┘  └───────────────┘  └────────────────────┘    │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend (Flask)                          │
│                         http://localhost:5000                    │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │ /overlays API  │  │ /stream/mjpeg  │  │ /health         │   │
│  └───────┬────────┘  └───────┬────────┘  └─────────────────┘   │
│          │                   │                                   │
│          ▼                   ▼                                   │
│    ┌──────────┐        ┌──────────┐                             │
│    │ MongoDB  │        │  FFmpeg  │                             │
│    └──────────┘        └──────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 7, react-draggable, react-resizable |
| **Backend** | Flask 3.0, flask-cors, pydantic |
| **Database** | MongoDB 6.0+ with pymongo |
| **Streaming** | FFmpeg (RTSP → MJPEG transcoding) |

---

## Support

For issues or questions:

1. Check the relevant documentation section
2. Review the troubleshooting guides in each document
3. Examine browser console and server logs for errors
