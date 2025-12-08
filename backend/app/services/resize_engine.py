from app.models.creative import Creative, CreativeFormat, AssetRole
import copy

class ResizeEngine:
    def resize(self, creative: Creative, target_format: CreativeFormat) -> Creative:
        resized_creative = copy.deepcopy(creative)
        resized_creative.format = target_format
        
        # Target dimensions
        width, height = map(int, target_format.value.split('x'))
        
        # Simple scaling logic (to be enhanced with AI)
        scale_x = width / 1080  # Assuming base is 1080x1080
        scale_y = height / 1080
        
        for layer in resized_creative.text_layers:
            # Reposition based on role
            if layer.role == "headline":
                layer.x = width * 0.1
                layer.y = height * 0.1
            elif layer.role == "cta":
                layer.x = width * 0.1
                layer.y = height * 0.8
            else:
                layer.x *= scale_x
                layer.y *= scale_y
                
        return resized_creative
