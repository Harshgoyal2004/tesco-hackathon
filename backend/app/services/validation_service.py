import json
from typing import List, Dict, Any

class ValidationService:
    def validate_creative(self, creative_data: Dict[str, Any], brand_kit: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Validates the creative against brand and retailer guidelines.
        """
        score = 100
        warnings = []
        errors = []
        
        objects = creative_data.get('objects', [])
        width = creative_data.get('width', 1080)
        height = creative_data.get('height', 1080)
        
        # 1. Brand Guidelines Check
        if brand_kit:
            brand_colors = [c.lower() for c in brand_kit.get('colors', [])]
            brand_fonts = [f.lower() for f in brand_kit.get('fonts', [])]
            
            # Check Colors
            used_colors = self._extract_colors(objects)
            non_brand_colors = [c for c in used_colors if c.lower() not in brand_colors and c.lower() != '#ffffff' and c.lower() != '#000000']
            
            if non_brand_colors:
                score -= 10
                warnings.append(f"Non-brand colors used: {', '.join(non_brand_colors[:3])}...")

            # Check Fonts
            used_fonts = self._extract_fonts(objects)
            non_brand_fonts = [f for f in used_fonts if f.lower() not in brand_fonts]
            
            if non_brand_fonts:
                score -= 10
                warnings.append(f"Non-brand fonts used: {', '.join(non_brand_fonts[:3])}...")
                
            # Check Logo
            has_logo = any(obj.get('type') == 'image' and 'logo' in obj.get('src', '').lower() for obj in objects)
            # Also check if any object is named 'logo' or has 'logo' in its custom attributes if we had them
            # For now, simplistic check
            # if not has_logo:
            #     score -= 15
            #     errors.append("Brand logo is missing")

        # 2. Retailer Guidelines Check
        
        # Safe Margins (assuming 10% margin)
        margin_x = width * 0.05
        margin_y = height * 0.05
        
        for obj in objects:
            if obj.get('type') == 'text' or obj.get('type') == 'i-text':
                left = obj.get('left', 0)
                top = obj.get('top', 0)
                # Simple point check, ideally check bounding box
                if left < margin_x or left > (width - margin_x) or top < margin_y or top > (height - margin_y):
                    score -= 5
                    warnings.append(f"Text element '{obj.get('text', '')[:10]}...' is outside safe margins")

                # Text Size
                font_size = obj.get('fontSize', 16) * obj.get('scaleY', 1)
                if font_size < 12:
                    score -= 5
                    warnings.append("Text size is too small (below 12px)")

        # 3. Accessibility Check (Contrast)
        # This is hard to do accurately on backend without rendering, 
        # but we can check if text is pure white on pure white bg (if we knew bg)
        # For now, we'll rely on frontend for detailed contrast checks, 
        # but we can add a placeholder here.
        
        # Final Score Normalization
        score = max(0, min(100, score))
        
        return {
            "score": score,
            "warnings": list(set(warnings)),
            "errors": list(set(errors)),
            "passed": score >= 80 and len(errors) == 0
        }

    def _extract_colors(self, objects: List[Dict[str, Any]]) -> List[str]:
        colors = []
        for obj in objects:
            fill = obj.get('fill')
            if isinstance(fill, str) and fill.startswith('#'):
                colors.append(fill)
        return list(set(colors))

    def _extract_fonts(self, objects: List[Dict[str, Any]]) -> List[str]:
        fonts = []
        for obj in objects:
            if 'fontFamily' in obj:
                fonts.append(obj['fontFamily'])
        return list(set(fonts))

validation_service = ValidationService()
