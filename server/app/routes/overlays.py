"""
Overlay CRUD API Routes
"""
from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId
from pydantic import ValidationError
from datetime import datetime

from app.db import get_db
from app.models.overlay import OverlayCreate, OverlayUpdate, overlay_to_dict


overlays_bp = Blueprint('overlays', __name__)


@overlays_bp.route('/overlays', methods=['GET'])
def get_overlays():
    """
    Retrieve all overlays.
    
    Returns:
        JSON array of all overlay objects.
    """
    db = get_db()
    overlays = list(db.overlays.find())
    return jsonify([overlay_to_dict(overlay) for overlay in overlays]), 200


@overlays_bp.route('/overlays', methods=['POST'])
def create_overlay():
    """
    Create a new overlay.
    
    Request Body:
        {
            "content": "string",
            "type": "text" | "image",
            "position": {"x": number, "y": number},
            "size": {"width": number, "height": number}
        }
    
    Returns:
        The created overlay object with generated ID.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        # Validate request data
        overlay_data = OverlayCreate(**data)
        
        # Prepare document for MongoDB
        now = datetime.utcnow()
        document = {
            "content": overlay_data.content,
            "type": overlay_data.type,
            "position": overlay_data.position.model_dump(),
            "size": overlay_data.size.model_dump(),
            "createdAt": now,
            "updatedAt": now
        }
        
        # Insert into database
        db = get_db()
        result = db.overlays.insert_one(document)
        
        # Fetch and return the created document
        created_overlay = db.overlays.find_one({"_id": result.inserted_id})
        return jsonify(overlay_to_dict(created_overlay)), 201
        
    except ValidationError as e:
        return jsonify({"error": "Validation error", "details": e.errors()}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@overlays_bp.route('/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    """
    Update an existing overlay.
    
    Path Parameters:
        overlay_id: MongoDB ObjectId of the overlay to update.
    
    Request Body:
        Partial overlay object with fields to update.
    
    Returns:
        The updated overlay object.
    """
    try:
        # Validate ObjectId
        try:
            oid = ObjectId(overlay_id)
        except InvalidId:
            return jsonify({"error": "Invalid overlay ID format"}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        # Validate update data
        update_data = OverlayUpdate(**data)
        
        # Build update document (only include provided fields)
        update_fields = {}
        if update_data.content is not None:
            update_fields["content"] = update_data.content
        if update_data.type is not None:
            update_fields["type"] = update_data.type
        if update_data.position is not None:
            update_fields["position"] = update_data.position.model_dump()
        if update_data.size is not None:
            update_fields["size"] = update_data.size.model_dump()
        
        if not update_fields:
            return jsonify({"error": "No valid fields to update"}), 400
        
        update_fields["updatedAt"] = datetime.utcnow()
        
        # Update in database
        db = get_db()
        result = db.overlays.update_one({"_id": oid}, {"$set": update_fields})
        
        if result.matched_count == 0:
            return jsonify({"error": "Overlay not found"}), 404
        
        # Fetch and return the updated document
        updated_overlay = db.overlays.find_one({"_id": oid})
        return jsonify(overlay_to_dict(updated_overlay)), 200
        
    except ValidationError as e:
        return jsonify({"error": "Validation error", "details": e.errors()}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@overlays_bp.route('/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    """
    Delete an overlay.
    
    Path Parameters:
        overlay_id: MongoDB ObjectId of the overlay to delete.
    
    Returns:
        Success message.
    """
    try:
        # Validate ObjectId
        try:
            oid = ObjectId(overlay_id)
        except InvalidId:
            return jsonify({"error": "Invalid overlay ID format"}), 400
        
        # Delete from database
        db = get_db()
        result = db.overlays.delete_one({"_id": oid})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Overlay not found"}), 404
        
        return jsonify({"message": "Overlay deleted successfully", "id": overlay_id}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
