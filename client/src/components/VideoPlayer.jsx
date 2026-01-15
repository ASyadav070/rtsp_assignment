import React, { useState, useMemo } from 'react';

/**
 * VideoPlayer Component
 * Handles multiple stream types:
 * - RTSP URLs (rtsp://...) - transcoded via FFmpeg backend
 * - Wowza Embed URLs (https://embed.wowza.com/...) - direct iframe embed
 * - HLS/HTTP streams - direct video element
 */
const VideoPlayer = ({ rtspUrl, isPlaying, volume, onPlayPause, onVolumeChange }) => {
  const [streamError, setStreamError] = useState(false);

  // Detect stream type and generate appropriate URL
  const { streamUrl, streamType } = useMemo(() => {
    if (!rtspUrl) return { streamUrl: '', streamType: null };
    
    const url = rtspUrl.trim();
    
    // Wowza embed URL (iframe)
    if (url.includes('embed.wowza.com')) {
      // Convert .js URL to proper embed URL if needed
      const embedUrl = url.replace('.js', '');
      return { streamUrl: embedUrl, streamType: 'wowza-embed' };
    }
    
    // HLS stream (.m3u8)
    if (url.includes('.m3u8') || url.startsWith('https://') || url.startsWith('http://')) {
      // If it's not an embed URL, treat as direct HLS/HTTP stream
      if (!url.includes('embed')) {
        return { streamUrl: url, streamType: 'hls' };
      }
      // Generic embed URL
      return { streamUrl: url, streamType: 'embed' };
    }
    
    // RTSP stream - needs backend transcoding
    if (url.startsWith('rtsp://')) {
      const encodedUrl = encodeURIComponent(url);
      return { 
        streamUrl: `http://localhost:5000/stream/mjpeg?url=${encodedUrl}`, 
        streamType: 'rtsp' 
      };
    }
    
    // Default: try as RTSP
    const encodedUrl = encodeURIComponent(url);
    return { 
      streamUrl: `http://localhost:5000/stream/mjpeg?url=${encodedUrl}`, 
      streamType: 'rtsp' 
    };
  }, [rtspUrl]);

  const handleImageError = () => {
    setStreamError(true);
  };

  const handleImageLoad = () => {
    setStreamError(false);
  };

  // Render the appropriate player based on stream type
  const renderPlayer = () => {
    if (!rtspUrl || !isPlaying) return null;

    switch (streamType) {
      case 'wowza-embed':
      case 'embed':
        return (
          <iframe
            src={streamUrl}
            title="Wowza Livestream"
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none'
            }}
          />
        );
      
      case 'hls':
        return (
          <video
            src={streamUrl}
            autoPlay={isPlaying}
            muted={volume === 0}
            controls
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain'
            }}
          />
        );
      
      case 'rtsp':
      default:
        return (
          <>
            {streamError && (
              <div className="stream-error">
                <p>⚠️ Unable to connect to stream</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                  Check if the RTSP URL is valid and the backend is running
                </p>
              </div>
            )}
            <img
              src={streamUrl}
              alt="RTSP Livestream"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ 
                display: streamError ? 'none' : 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </>
        );
    }
  };

  return (
    <div className="video-section">
      <div className="video-container" id="video-container">
        {rtspUrl ? (
          <>
            {isPlaying ? (
              renderPlayer()
            ) : (
              <div className="video-placeholder clickable" onClick={onPlayPause}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p>Stream paused - Click to play</p>
              </div>
            )}
          </>
        ) : (
          <div className="video-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <p>Enter a stream URL above to start</p>
            <p style={{ fontSize: '0.8rem', marginTop: '10px', opacity: 0.7 }}>
              Supports: RTSP, Wowza Embed, HLS (.m3u8)
            </p>
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="video-controls">
        <button onClick={onPlayPause} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="volume-control">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            {volume === 0 ? (
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            ) : volume < 0.5 ? (
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
            ) : (
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            )}
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
