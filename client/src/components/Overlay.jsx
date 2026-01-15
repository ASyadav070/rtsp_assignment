import React, { useState, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';

const Overlay = ({ overlay, containerBounds, onPositionChange, onSizeChange }) => {
  const nodeRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: overlay.size.width, height: overlay.size.height });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Handle drag stop - update position
  const handleDragStop = (e, data) => {
    if (!isResizing) {
      onPositionChange(overlay.id, { x: data.x, y: data.y });
    }
  };

  // Custom resize handlers
  const handleResizeMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };

    let currentSize = { width: size.width, height: size.height };

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - resizeStartRef.current.x;
      const deltaY = moveEvent.clientY - resizeStartRef.current.y;
      
      const newWidth = Math.max(50, Math.min(resizeStartRef.current.width + deltaX, containerBounds?.width || 800));
      const newHeight = Math.max(30, Math.min(resizeStartRef.current.height + deltaY, containerBounds?.height || 450));
      
      currentSize = { width: newWidth, height: newHeight };
      setSize(currentSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Use currentSize which has the latest value
      onSizeChange(overlay.id, currentSize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [size, overlay.id, onSizeChange, containerBounds]);

  // Sync size when overlay prop changes
  React.useEffect(() => {
    setSize({ width: overlay.size.width, height: overlay.size.height });
  }, [overlay.size.width, overlay.size.height]);

  // Save size on resize end
  React.useEffect(() => {
    if (!isResizing && (size.width !== overlay.size.width || size.height !== overlay.size.height)) {
      onSizeChange(overlay.id, size);
    }
  }, [isResizing]);

  // Render text overlay
  const renderTextOverlay = () => (
    <div
      className="overlay-text"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {overlay.content}
    </div>
  );

  // Render image overlay
  const renderImageOverlay = () => (
    <div className="overlay-image" style={{ width: '100%', height: '100%' }}>
      <img
        src={overlay.content}
        alt="Overlay"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        draggable={false}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = '<span style="color: #ff4757;">Image failed to load</span>';
        }}
      />
    </div>
  );

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      position={{ x: overlay.position.x, y: overlay.position.y }}
      onStop={handleDragStop}
      disabled={isResizing}
    >
      <div 
        ref={nodeRef} 
        className="overlay-element" 
        style={{ 
          position: 'absolute',
          width: size.width,
          height: size.height,
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {overlay.type === 'text' ? renderTextOverlay() : renderImageOverlay()}
          
          {/* Custom Resize Handle */}
          <div
            className="custom-resize-handle"
            onMouseDown={handleResizeMouseDown}
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 16,
              height: 16,
              background: '#00d9ff',
              borderRadius: 3,
              cursor: 'se-resize',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="#000">
              <path d="M0 8L8 0M3 8L8 3M6 8L8 6" stroke="#000" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Overlay;
