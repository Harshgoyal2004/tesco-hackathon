import React from 'react';
import { useCreativeStore } from '../store/useCreativeStore';

const GuidelineOverlay = ({ width, height }) => {
    const { isSafeZoneVisible, complianceReport, creative } = useCreativeStore();

    if (!isSafeZoneVisible && complianceReport.is_compliant) return null;

    // Safe Zones for Stories (1080x1920)
    const isStory = creative.format === '1080x1920';
    const safeTop = 200;
    const safeBottom = 250;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Safe Zones */}
            {isSafeZoneVisible && isStory && (
                <>
                    <div
                        className="absolute top-0 left-0 right-0 bg-red-500/20 border-b border-red-500 flex items-center justify-center"
                        style={{ height: `${safeTop}px` }}
                    >
                        <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">SAFE ZONE (TOP)</span>
                    </div>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-red-500/20 border-t border-red-500 flex items-center justify-center"
                        style={{ height: `${safeBottom}px` }}
                    >
                        <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">SAFE ZONE (BOTTOM)</span>
                    </div>
                </>
            )}

            {/* Violation Highlights */}
            {(complianceReport.violations || []).map((violation, index) => {
                // In a real implementation, we would map element_id to actual coordinates
                // For now, we'll just show a global toast/banner for the violation
                return null;
            })}
        </div>
    );
};

export default GuidelineOverlay;
