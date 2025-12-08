import React from 'react';
import {
    Instagram, Smartphone, Monitor, Undo, Redo, Type, LayoutGrid, ShieldCheck, Download, Share2, LayoutTemplate
} from 'lucide-react';
import { useCreativeStore } from '@/store/useCreativeStore';
import { applyAutoLayout } from '@/lib/layoutEngine';
import { exportCanvas } from '@/lib/exportEngine';

const FloatingToolbar = ({ onExport, onValidate, onAddText, canvasRef, onOpenTemplates }) => {
    const { creative, updateFormat, undo, redo, validateCreative, saveHistory } = useCreativeStore();
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const dragStartRef = React.useRef({ x: 0, y: 0 });
    const toolbarRef = React.useRef(null);

    const handleMouseDown = (e) => {
        if (e.target.closest('button')) return; // Don't drag if clicking a button
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            setPosition({
                x: e.clientX - dragStartRef.current.x,
                y: e.clientY - dragStartRef.current.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleAutoLayout = () => {
        if (canvasRef.current) {
            saveHistory(canvasRef.current.toJSON());
            applyAutoLayout(canvasRef.current, 'z-pattern');
            canvasRef.current.requestRenderAll();
        }
    };

    const handleExport = async () => {
        if (canvasRef.current) {
            await exportCanvas(canvasRef.current, 'png');
        }
    };

    const handleValidate = () => {
        if (canvasRef.current) {
            validateCreative(canvasRef.current.toJSON());
        }
    };

    const handleUndo = () => {
        const json = undo();
        if (json && canvasRef.current) {
            canvasRef.current.loadFromJSON(json, () => {
                canvasRef.current.renderAll();
            });
        }
    };

    const handleRedo = () => {
        const json = redo();
        if (json && canvasRef.current) {
            canvasRef.current.loadFromJSON(json, () => {
                canvasRef.current.renderAll();
            });
        }
    };

    return (
        <div
            ref={toolbarRef}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'default'
            }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel p-3 rounded-xl w-[280px] flex flex-col gap-3 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl z-50 transition-shadow duration-200"
        >
            {/* Drag Handle */}
            <div
                onMouseDown={handleMouseDown}
                className="w-12 h-1 bg-white/20 rounded-full mx-auto cursor-grab active:cursor-grabbing hover:bg-white/30 transition-colors"
            />

            {/* Format Selector */}
            <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-lg">
                <button className="p-1.5 rounded-md hover:bg-white/10 transition" onClick={() => updateFormat('1080x1080')}>
                    <Instagram className="w-4 h-4 text-white/80" />
                </button>
                <button className="p-1.5 rounded-md hover:bg-white/10 transition" onClick={() => updateFormat('1080x1920')}>
                    <Smartphone className="w-4 h-4 text-white/80" />
                </button>
                <button className="p-1.5 rounded-md bg-white/15 backdrop-blur rounded-md shadow-inner" onClick={() => updateFormat('1200x628')}>
                    <Monitor className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Undo / Redo */}
            <div className="flex items-center justify-between px-1">
                <button className="p-1.5 hover:bg-white/10 rounded-md transition" onClick={handleUndo}>
                    <Undo className="w-4 h-4 text-white/70" />
                </button>
                <button className="p-1.5 hover:bg-white/10 rounded-md transition" onClick={handleRedo}>
                    <Redo className="w-4 h-4 text-white/70" />
                </button>
            </div>

            <div className="border-t border-white/10"></div>

            {/* Main Actions */}
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-white/80">
                <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-white/10 transition" onClick={onAddText}>
                    <Type className="w-3.5 h-3.5 text-white/70" />
                    <span>Text</span>
                </button>

                <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-white/10 transition" onClick={onOpenTemplates}>
                    <LayoutTemplate className="w-3.5 h-3.5 text-white/70" />
                    <span>Templates</span>
                </button>

                <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-white/10 transition" onClick={handleAutoLayout}>
                    <LayoutGrid className="w-3.5 h-3.5 text-white/70" />
                    <span>AI Layout</span>
                </button>
            </div>

            <div className="border-t border-white/10"></div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between">
                <button className="flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 text-xs font-medium transition" onClick={handleValidate}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Validate</span>
                </button>

                <button className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-lg font-medium text-xs hover:bg-gray-100 transition shadow" onClick={handleExport}>
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>

        </div>
    );
};

export default FloatingToolbar;
