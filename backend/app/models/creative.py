from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class AssetType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"
    FONT = "font"

class AssetRole(str, Enum):
    PACKSHOT = "packshot"
    BACKGROUND = "background"
    LOGO = "logo"
    VALUE_TILE = "value_tile"
    CTA = "cta"
    OTHER = "other"

class Asset(BaseModel):
    id: str
    url: str
    type: AssetType
    role: AssetRole
    name: str
    metadata: Dict[str, Any] = {}

class TextLayer(BaseModel):
    id: str
    text: str
    role: str  # headline, subhead, cta, tag
    font_family: str
    font_size: int
    color: str
    x: float
    y: float
    width: float
    height: float
    z_index: int

class CreativeFormat(str, Enum):
    SQUARE = "1080x1080"
    STORY = "1080x1920"
    LANDSCAPE = "1200x628"

class Creative(BaseModel):
    id: str
    name: str
    format: CreativeFormat
    assets: List[Asset]
    text_layers: List[TextLayer]
    background_color: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class GuidelineSeverity(str, Enum):
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"

class GuidelineViolation(BaseModel):
    rule_id: str
    message: str
    severity: GuidelineSeverity
    element_id: Optional[str] = None
    suggestion: Optional[str] = None

class ComplianceReport(BaseModel):
    score: int
    violations: List[GuidelineViolation]
    is_compliant: bool
