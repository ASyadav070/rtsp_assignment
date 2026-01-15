import React, { useState } from 'react';

/**
 * OverlayControls Component
 * UI for creating, viewing, and deleting overlays
 */
const OverlayControls = ({ overlays, onCreateOverlay, onDeleteOverlay, loading }) => {
  const [formData, setFormData] = useState({
    content: '',
    type: 'text',
    width: 150,
    height: 40,
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'width' || name === 'height' ? parseInt(value) || 0 : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    if (formData.type === 'image') {
      // Basic URL validation for images
      try {
        new URL(formData.content);
      } catch {
        setError('Please enter a valid image URL');
        return;
      }
    }

    try {
      await onCreateOverlay({
        content: formData.content.trim(),
        type: formData.type,
        position: { x: 50, y: 50 }, // Default position
        size: { width: formData.width, height: formData.height },
      });

      // Reset form
      setFormData({
        content: '',
        type: 'text',
        width: 150,
        height: 40,
      });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="overlay-panel">
      <h2>Overlay Manager</h2>

      {/* Create Overlay Form */}
      <form className="create-overlay-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Overlay Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="text">Text</option>
            <option value="image">Image (URL)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">
            {formData.type === 'text' ? 'Text Content' : 'Image URL'}
          </label>
          <input
            id="content"
            name="content"
            type="text"
            placeholder={formData.type === 'text' ? 'Enter overlay text...' : 'https://example.com/image.png'}
            value={formData.content}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="width">Width (px)</label>
            <input
              id="width"
              name="width"
              type="number"
              min="50"
              max="800"
              value={formData.width}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="height">Height (px)</label>
            <input
              id="height"
              name="height"
              type="number"
              min="30"
              max="600"
              value={formData.height}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Overlay'}
        </button>
      </form>

      {/* Overlay List */}
      <div className="overlay-list">
        <h3>Active Overlays ({overlays.length})</h3>
        
        {overlays.length === 0 ? (
          <div className="empty-state">
            <p>No overlays yet</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              Create your first overlay above
            </p>
          </div>
        ) : (
          overlays.map((overlay) => (
            <div key={overlay.id} className="overlay-item">
              <div className="overlay-item-info">
                <div className="overlay-item-type">{overlay.type}</div>
                <div className="overlay-item-content" title={overlay.content}>
                  {overlay.content}
                </div>
                <div className="overlay-item-size">
                  {Math.round(overlay.size.width)} × {Math.round(overlay.size.height)} px
                </div>
              </div>
              <div className="overlay-item-actions">
                <button
                  className="btn-delete"
                  onClick={() => onDeleteOverlay(overlay.id)}
                  title="Delete overlay"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OverlayControls;
