import React, { useState, useEffect, useCallback } from 'react';
import VideoPlayer from './components/VideoPlayer';
import OverlayContainer from './components/OverlayContainer';
import OverlayControls from './components/OverlayControls';
import { getOverlays, createOverlay, updateOverlay, deleteOverlay } from './services/api';
import './App.css';

/**
 * Main Application Component
 * RTSP Livestream Overlay Application
 */
function App() {
  // State management
  const [rtspUrl, setRtspUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [overlays, setOverlays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch overlays from backend on component mount
  const fetchOverlays = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOverlays();
      setOverlays(data);
      setError(null);
    } catch (err) {
      setError('Failed to load overlays. Make sure the backend server is running.');
      console.error('Error fetching overlays:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverlays();
  }, [fetchOverlays]);

  // Handle RTSP URL submission
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setRtspUrl(inputUrl.trim());
      setIsPlaying(true);
    }
  };

  // Handle play/pause toggle
  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  // Create new overlay
  const handleCreateOverlay = async (overlayData) => {
    try {
      setLoading(true);
      const newOverlay = await createOverlay(overlayData);
      setOverlays((prev) => [...prev, newOverlay]);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update overlay position (on drag)
  const handlePositionChange = async (id, position) => {
    try {
      // Optimistic update
      setOverlays((prev) =>
        prev.map((o) => (o.id === id ? { ...o, position } : o))
      );
      await updateOverlay(id, { position });
    } catch (err) {
      console.error('Error updating overlay position:', err);
      // Revert on error
      fetchOverlays();
    }
  };

  // Update overlay size (on resize)
  const handleSizeChange = async (id, size) => {
    try {
      // Optimistic update
      setOverlays((prev) =>
        prev.map((o) => (o.id === id ? { ...o, size } : o))
      );
      await updateOverlay(id, { size });
    } catch (err) {
      console.error('Error updating overlay size:', err);
      // Revert on error
      fetchOverlays();
    }
  };

  // Delete overlay
  const handleDeleteOverlay = async (id) => {
    try {
      // Optimistic update
      setOverlays((prev) => prev.filter((o) => o.id !== id));
      await deleteOverlay(id);
    } catch (err) {
      console.error('Error deleting overlay:', err);
      // Revert on error
      fetchOverlays();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>RTSP Livestream Overlay</h1>
        <p>Play RTSP streams and add custom overlays in real-time</p>
      </header>

      {/* RTSP URL Input */}
      <form className="rtsp-input-section" onSubmit={handleUrlSubmit}>
        <input
          type="text"
          placeholder="Enter RTSP URL (e.g., rtsp://example.com/stream)"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <button type="submit">Load Stream</button>
      </form>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Main Content */}
      <div className="main-content">
        {/* Video Player with Overlays */}
        <div style={{ position: 'relative' }}>
          <VideoPlayer
            rtspUrl={rtspUrl}
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={handlePlayPause}
            onVolumeChange={handleVolumeChange}
          />
          {/* Overlay Container - positioned over video */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% - 70px)' }}>
            <OverlayContainer
              overlays={overlays}
              onPositionChange={handlePositionChange}
              onSizeChange={handleSizeChange}
            />
          </div>
        </div>

        {/* Overlay Controls Panel */}
        <OverlayControls
          overlays={overlays}
          onCreateOverlay={handleCreateOverlay}
          onDeleteOverlay={handleDeleteOverlay}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
