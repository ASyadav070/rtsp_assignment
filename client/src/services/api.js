/**
 * API Service Layer
 * Handles all HTTP requests to the Flask backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch all overlays from the backend
 * @returns {Promise<Array>} Array of overlay objects
 */
export const getOverlays = async () => {
  const response = await fetch(`${API_BASE_URL}/overlays`);
  if (!response.ok) {
    throw new Error('Failed to fetch overlays');
  }
  return response.json();
};

/**
 * Create a new overlay
 * @param {Object} overlayData - The overlay data to create
 * @param {string} overlayData.content - Text or image URL
 * @param {string} overlayData.type - 'text' or 'image'
 * @param {Object} overlayData.position - {x, y} coordinates
 * @param {Object} overlayData.size - {width, height} dimensions
 * @returns {Promise<Object>} The created overlay object
 */
export const createOverlay = async (overlayData) => {
  const response = await fetch(`${API_BASE_URL}/overlays`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(overlayData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create overlay');
  }
  return response.json();
};

/**
 * Update an existing overlay
 * @param {string} id - The overlay ID
 * @param {Object} updateData - Partial overlay data to update
 * @returns {Promise<Object>} The updated overlay object
 */
export const updateOverlay = async (id, updateData) => {
  const response = await fetch(`${API_BASE_URL}/overlays/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update overlay');
  }
  return response.json();
};

/**
 * Delete an overlay
 * @param {string} id - The overlay ID to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteOverlay = async (id) => {
  const response = await fetch(`${API_BASE_URL}/overlays/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete overlay');
  }
  return response.json();
};
