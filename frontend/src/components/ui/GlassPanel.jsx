import React from 'react';
import { cn } from "@/lib/utils";

const GlassPanel = ({ children, className, hoverable = false, ...props }) => {
    return (
        <div
            className={cn(
                "glass-panel rounded-2xl relative overflow-hidden transition-all duration-300",
                hoverable && "glass-panel-hover hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 bg-noise pointer-events-none z-0" />

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};

export default GlassPanel;
