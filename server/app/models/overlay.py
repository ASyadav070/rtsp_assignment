"""
Overlay Model and Validation Schemas
"""
from pydantic import BaseModel, Field, field_validator
from typing import Literal, Optional
from datetime import datetime


class Position(BaseModel):
    """Position schema for overlay coordinates."""
    x: float = Field(..., ge=0, description="X coordinate (pixels from left)")
    y: float = Field(..., ge=0, description="Y coordinate (pixels from top)")


class Size(BaseModel):
    """Size schema for overlay dimensions."""
    width: float = Field(..., gt=0, description="Width in pixels")
    height: float = Field(..., gt=0, description="Height in pixels")


class OverlayCreate(BaseModel):
    """Schema for creating a new overlay."""
    content: str = Field(..., min_length=1, description="Text string or Image URL")
    type: Literal["text", "image"] = Field(..., description="Overlay type")
    position: Position = Field(..., description="Overlay position")
    size: Size = Field(..., description="Overlay dimensions")
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v, info):
        if not v.strip():
            raise ValueError('Content cannot be empty or whitespace only')
        return v.strip()


class OverlayUpdate(BaseModel):
    """Schema for updating an existing overlay."""
    content: Optional[str] = Field(None, min_length=1, description="Text string or Image URL")
    type: Optional[Literal["text", "image"]] = Field(None, description="Overlay type")
    position: Optional[Position] = Field(None, description="Overlay position")
    size: Optional[Size] = Field(None, description="Overlay dimensions")
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v, info):
        if v is not None and not v.strip():
            raise ValueError('Content cannot be empty or whitespace only')
        return v.strip() if v else v


def overlay_to_dict(overlay: dict) -> dict:
    """Convert MongoDB overlay document to JSON-serializable dict."""
    return {
        "id": str(overlay["_id"]),
        "content": overlay["content"],
        "type": overlay["type"],
        "position": overlay["position"],
        "size": overlay["size"],
        "createdAt": overlay.get("createdAt", "").isoformat() if overlay.get("createdAt") else None,
        "updatedAt": overlay.get("updatedAt", "").isoformat() if overlay.get("updatedAt") else None
    }
