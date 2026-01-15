import React from 'react';
import Overlay from './Overlay';

/**
 * OverlayContainer Component
 * Manages and renders all overlays on top of the video player
 */
const OverlayContainer = ({ overlays, onPositionChange, onSizeChange }) => {
  const containerRef = React.useRef(null);
  const [containerBounds, setContainerBounds] = React.useState(null);

  // Update container bounds on mount and resize
  React.useEffect(() => {
    const updateBounds = () => {
      const videoContainer = document.getElementById('video-container');
      if (videoContainer) {
        const rect = videoContainer.getBoundingClientRect();
        setContainerBounds({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'auto' }}>
        {overlays.map((overlay) => (
          <Overlay
            key={overlay.id}
            overlay={overlay}
            containerBounds={containerBounds}
            onPositionChange={onPositionChange}
            onSizeChange={onSizeChange}
          />
        ))}
      </div>
    </div>
  );
};

export default OverlayContainer;
