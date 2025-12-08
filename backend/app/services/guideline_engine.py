from app.models.creative import Creative, GuidelineViolation, GuidelineSeverity, ComplianceReport, AssetRole, CreativeFormat
import re

class GuidelineEngine:
    def __init__(self):
        self.forbidden_claims = [
            r"survey", r"\*", r"guarantee", r"green", r"sustainable", r"eco-friendly", r"charity"
        ]
        self.allowed_tags = [
            "Only at Tesco",
            "Available at Tesco",
            "Selected stores. While stocks last."
        ]
        self.alcohol_keywords = ["wine", "beer", "spirit", "vodka", "whisky", "gin", "alcohol"]

    def validate(self, creative: Creative) -> ComplianceReport:
        violations = []
        
        # 1. Alcohol Rules (Appendix B)
        if self._is_alcohol_product(creative):
            if not self._has_drinkaware(creative):
                violations.append(GuidelineViolation(
                    rule_id="ALCOHOL_DRINKAWARE",
                    message="Alcohol products must include the Drinkaware lock-up.",
                    severity=GuidelineSeverity.ERROR,
                    suggestion="Add the Drinkaware asset to the creative."
                ))

        # 2. Copy Restrictions
        for layer in creative.text_layers:
            for claim in self.forbidden_claims:
                if re.search(claim, layer.text, re.IGNORECASE):
                    violations.append(GuidelineViolation(
                        rule_id="COPY_RESTRICTION",
                        message=f"Forbidden claim detected: '{claim}'",
                        severity=GuidelineSeverity.ERROR,
                        element_id=layer.id,
                        suggestion="Remove restricted claims (sustainability, guarantees, surveys)."
                    ))
            
            # Price Callouts
            if re.search(r"£|\d+p|%", layer.text):
                 violations.append(GuidelineViolation(
                    rule_id="PRICE_CALLOUT",
                    message="Price callouts are not allowed in this format.",
                    severity=GuidelineSeverity.ERROR,
                    element_id=layer.id
                ))

        # 3. Tesco Tag Rules (Appendix A)
        for layer in creative.text_layers:
            if layer.role == "tag":
                if layer.text not in self.allowed_tags:
                     violations.append(GuidelineViolation(
                        rule_id="TAG_TEXT",
                        message=f"Invalid tag text: '{layer.text}'",
                        severity=GuidelineSeverity.ERROR,
                        element_id=layer.id,
                        suggestion=f"Use one of: {', '.join(self.allowed_tags)}"
                    ))

        # 4. Safe Zones (Stories)
        if creative.format == CreativeFormat.STORY:
            violations.extend(self._check_safe_zones(creative))

        score = max(0, 100 - (len(violations) * 20))
        return ComplianceReport(
            score=score,
            violations=violations,
            is_compliant=len([v for v in violations if v.severity == GuidelineSeverity.ERROR]) == 0
        )

    def _is_alcohol_product(self, creative: Creative) -> bool:
        # heuristic check based on asset names or metadata
        for asset in creative.assets:
            if asset.role == AssetRole.PACKSHOT:
                for keyword in self.alcohol_keywords:
                    if keyword in asset.name.lower():
                        return True
        return False

    def _has_drinkaware(self, creative: Creative) -> bool:
        for asset in creative.assets:
            if "drinkaware" in asset.name.lower():
                return True
        return False

    def _check_safe_zones(self, creative: Creative) -> list[GuidelineViolation]:
        violations = []
        safe_top = 200
        safe_bottom = 1920 - 250
        
        for layer in creative.text_layers:
            # Simple bounding box check
            if layer.y < safe_top:
                violations.append(GuidelineViolation(
                    rule_id="SAFE_ZONE_TOP",
                    message="Element overlaps with top safe zone (200px).",
                    severity=GuidelineSeverity.ERROR,
                    element_id=layer.id
                ))
            if layer.y + layer.height > safe_bottom:
                 violations.append(GuidelineViolation(
                    rule_id="SAFE_ZONE_BOTTOM",
                    message="Element overlaps with bottom safe zone (250px).",
                    severity=GuidelineSeverity.ERROR,
                    element_id=layer.id
                ))
        return violations
