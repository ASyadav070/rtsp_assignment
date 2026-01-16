# API Documentation

Complete API reference for the RTSP Livestream with Overlay backend service.

**Base URL:** `http://localhost:5000`

---

## Table of Contents

1. [Health Check](#health-check)
2. [Stream Endpoints](#stream-endpoints)
3. [Overlay CRUD Endpoints](#overlay-crud-endpoints)
   - [Get All Overlays](#get-all-overlays)
   - [Create Overlay](#create-overlay)
   - [Update Overlay](#update-overlay)
   - [Delete Overlay](#delete-overlay)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)

---

## Health Check

### Check API Status

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "RTSP Overlay API is running"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | API is running |

---

## Stream Endpoints

### Test Stream Availability

```http
GET /stream/test
```

**Response:**
```json
{
  "status": "ok",
  "message": "Stream endpoint is available"
}
```

---

### Get MJPEG Stream

Converts an RTSP stream to browser-compatible MJPEG format using FFmpeg.

```http
GET /stream/mjpeg?url={rtsp_url}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | URL-encoded RTSP stream URL |

**Example Request:**
```bash
curl "http://localhost:5000/stream/mjpeg?url=rtsp%3A%2F%2Fexample.com%2Fstream"
```

**Response:**
- **Content-Type:** `multipart/x-mixed-replace; boundary=frame`
- **Body:** Continuous MJPEG frame stream

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Stream started successfully |
| 400 | Missing or invalid URL parameter |

---

## Overlay CRUD Endpoints

### Get All Overlays

Retrieve all overlays from the database.

```http
GET /overlays
```

**Example Request:**
```bash
curl http://localhost:5000/overlays
```

**Example Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "content": "Breaking News",
    "type": "text",
    "position": {
      "x": 50,
      "y": 100
    },
    "size": {
      "width": 200,
      "height": 50
    },
    "createdAt": "2026-01-15T10:30:00.000000",
    "updatedAt": "2026-01-15T10:30:00.000000"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "content": "https://example.com/logo.png",
    "type": "image",
    "position": {
      "x": 10,
      "y": 10
    },
    "size": {
      "width": 100,
      "height": 100
    },
    "createdAt": "2026-01-15T11:00:00.000000",
    "updatedAt": "2026-01-15T11:00:00.000000"
  }
]
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Success |

---

### Create Overlay

Create a new overlay.

```http
POST /overlays
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "string",
  "type": "text" | "image",
  "position": {
    "x": number,
    "y": number
  },
  "size": {
    "width": number,
    "height": number
  }
}
```

**Field Descriptions:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Text string or image URL (min 1 char) |
| `type` | string | Yes | Either `"text"` or `"image"` |
| `position.x` | number | Yes | X coordinate (pixels from left, ≥ 0) |
| `position.y` | number | Yes | Y coordinate (pixels from top, ≥ 0) |
| `size.width` | number | Yes | Width in pixels (> 0) |
| `size.height` | number | Yes | Height in pixels (> 0) |

**Example Request - Text Overlay:**
```bash
curl -X POST http://localhost:5000/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "content": "LIVE",
    "type": "text",
    "position": {"x": 20, "y": 20},
    "size": {"width": 80, "height": 30}
  }'
```

**Example Request - Image Overlay:**
```bash
curl -X POST http://localhost:5000/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "content": "https://example.com/logo.png",
    "type": "image",
    "position": {"x": 10, "y": 10},
    "size": {"width": 100, "height": 50}
  }'
```

**Success Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "content": "LIVE",
  "type": "text",
  "position": {
    "x": 20,
    "y": 20
  },
  "size": {
    "width": 80,
    "height": 30
  },
  "createdAt": "2026-01-16T12:00:00.000000",
  "updatedAt": "2026-01-16T12:00:00.000000"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation error",
  "details": [
    {
      "loc": ["content"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 201 | Overlay created successfully |
| 400 | Validation error or missing request body |
| 500 | Internal server error |

---

### Update Overlay

Update an existing overlay. Only provided fields will be updated.

```http
PUT /overlays/{overlay_id}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `overlay_id` | string | Yes | MongoDB ObjectId of the overlay |

**Headers:**
```
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "content": "string",
  "type": "text" | "image",
  "position": {
    "x": number,
    "y": number
  },
  "size": {
    "width": number,
    "height": number
  }
}
```

**Example Request - Update Position:**
```bash
curl -X PUT http://localhost:5000/overlays/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -d '{
    "position": {"x": 100, "y": 150}
  }'
```

**Example Request - Update Content and Size:**
```bash
curl -X PUT http://localhost:5000/overlays/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Breaking News!",
    "size": {"width": 250, "height": 60}
  }'
```

**Success Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "content": "Breaking News!",
  "type": "text",
  "position": {
    "x": 100,
    "y": 150
  },
  "size": {
    "width": 250,
    "height": 60
  },
  "createdAt": "2026-01-16T12:00:00.000000",
  "updatedAt": "2026-01-16T14:30:00.000000"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Overlay not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid overlay ID format"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Overlay updated successfully |
| 400 | Invalid ID format or validation error |
| 404 | Overlay not found |
| 500 | Internal server error |

---

### Delete Overlay

Delete an overlay by ID.

```http
DELETE /overlays/{overlay_id}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `overlay_id` | string | Yes | MongoDB ObjectId of the overlay |

**Example Request:**
```bash
curl -X DELETE http://localhost:5000/overlays/507f1f77bcf86cd799439013
```

**Success Response (200 OK):**
```json
{
  "message": "Overlay deleted successfully",
  "id": "507f1f77bcf86cd799439013"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Overlay not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid overlay ID format"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Overlay deleted successfully |
| 400 | Invalid ID format |
| 404 | Overlay not found |
| 500 | Internal server error |

---

## Data Models

### Overlay Object

```json
{
  "id": "string (MongoDB ObjectId)",
  "content": "string",
  "type": "text" | "image",
  "position": {
    "x": "number (≥ 0)",
    "y": "number (≥ 0)"
  },
  "size": {
    "width": "number (> 0)",
    "height": "number (> 0)"
  },
  "createdAt": "string (ISO 8601 datetime)",
  "updatedAt": "string (ISO 8601 datetime)"
}
```

### Position Object

```json
{
  "x": "number - X coordinate in pixels from left edge (≥ 0)",
  "y": "number - Y coordinate in pixels from top edge (≥ 0)"
}
```

### Size Object

```json
{
  "width": "number - Width in pixels (> 0)",
  "height": "number - Height in pixels (> 0)"
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "error": "Error message",
  "details": [] // Optional: validation details
}
```

### Common Error Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 400 | Bad Request | Missing required fields, invalid data format |
| 404 | Not Found | Overlay ID doesn't exist |
| 500 | Internal Server Error | Database connection issues, server bugs |

### Validation Errors

When validation fails, the response includes detailed error information:

```json
{
  "error": "Validation error",
  "details": [
    {
      "loc": ["field_name"],
      "msg": "Error description",
      "type": "error_type"
    }
  ]
}
```

---

## Usage Examples

### JavaScript/Fetch

```javascript
// Get all overlays
const overlays = await fetch('http://localhost:5000/overlays')
  .then(res => res.json());

// Create overlay
const newOverlay = await fetch('http://localhost:5000/overlays', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Hello World',
    type: 'text',
    position: { x: 50, y: 50 },
    size: { width: 150, height: 40 }
  })
}).then(res => res.json());

// Update overlay
await fetch(`http://localhost:5000/overlays/${overlayId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ position: { x: 100, y: 100 } })
});

// Delete overlay
await fetch(`http://localhost:5000/overlays/${overlayId}`, {
  method: 'DELETE'
});
```

### Python/Requests

```python
import requests

BASE_URL = 'http://localhost:5000'

# Get all overlays
overlays = requests.get(f'{BASE_URL}/overlays').json()

# Create overlay
new_overlay = requests.post(f'{BASE_URL}/overlays', json={
    'content': 'Hello World',
    'type': 'text',
    'position': {'x': 50, 'y': 50},
    'size': {'width': 150, 'height': 40}
}).json()

# Update overlay
requests.put(f'{BASE_URL}/overlays/{overlay_id}', json={
    'position': {'x': 100, 'y': 100}
})

# Delete overlay
requests.delete(f'{BASE_URL}/overlays/{overlay_id}')
```

### cURL

```bash
# Get all overlays
curl http://localhost:5000/overlays

# Create overlay
curl -X POST http://localhost:5000/overlays \
  -H "Content-Type: application/json" \
  -d '{"content":"Test","type":"text","position":{"x":0,"y":0},"size":{"width":100,"height":30}}'

# Update overlay
curl -X PUT http://localhost:5000/overlays/OVERLAY_ID \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated"}'

# Delete overlay
curl -X DELETE http://localhost:5000/overlays/OVERLAY_ID
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production deployments, consider adding rate limiting to prevent abuse.

---

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS). Allowed origins are configured via the `CORS_ORIGINS` environment variable:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## Next Steps

- See [USER_GUIDE.md](USER_GUIDE.md) for using the application interface
- See [RTSP_CONFIGURATION.md](RTSP_CONFIGURATION.md) for stream configuration
