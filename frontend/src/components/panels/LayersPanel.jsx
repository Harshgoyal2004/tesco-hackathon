import React, { useState } from 'react';
import { useCreativeStore } from '@/store/useCreativeStore';
import { Eye, EyeOff, Lock, Unlock, Trash2, GripVertical, Image as ImageIcon, Type, Box, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const LayersPanel = () => {
    const { layers, selectedElementId, setSelectedElement, updateLayer, setLayers } = useCreativeStore();
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    // Helper to get icon based on layer type
    const getLayerIcon = (type) => {
        switch (type) {
            case 'image': return <ImageIcon className="w-3.5 h-3.5" />;
            case 'i-text':
            case 'text': return <Type className="w-3.5 h-3.5" />;
            default: return <Box className="w-3.5 h-3.5" />;
        }
    };

    const handleVisibilityToggle = (e, layer) => {
        e.stopPropagation();
        updateLayer(layer.id, { visible: !layer.visible });
    };

    const handleLockToggle = (e, layer) => {
        e.stopPropagation();
        updateLayer(layer.id, { locked: !layer.locked });
    };

    const handleDelete = (e, layerId) => {
        e.stopPropagation();
        updateLayer(layerId, { shouldDelete: true });
    };

    const handleMove = (e, currentIndex, direction) => {
        e.stopPropagation();
        const newLayers = [...layers];
        // layers is bottom-to-top (0 is background)
        // display is top-to-bottom (0 is top)

        // We are operating on the original 'layers' array
        // currentIndex is the index in the original 'layers' array

        if (direction === 'up') {
            // Move towards end of array (visually up)
            if (currentIndex < newLayers.length - 1) {
                [newLayers[currentIndex], newLayers[currentIndex + 1]] = [newLayers[currentIndex + 1], newLayers[currentIndex]];
            }
        } else {
            // Move towards start of array (visually down)
            if (currentIndex > 0) {
                [newLayers[currentIndex], newLayers[currentIndex - 1]] = [newLayers[currentIndex - 1], newLayers[currentIndex]];
            }
        }
        setLayers(newLayers);
        // Force canvas re-render/re-order handled by CanvasEditor syncing?
        // Actually CanvasEditor sync is one-way Store -> Canvas for properties.
        // For z-index, we might need to explicitly tell canvas to re-order.
        // But if we change the order in 'layers', CanvasEditor might not pick it up automatically unless we force it.
        // Let's assume CanvasEditor will handle it or we might need a 'zIndex' property.
        // For now, let's just update store.
    };

    const startEditing = (e, layer) => {
        e.stopPropagation();
        setEditingId(layer.id);
        setEditName(layer.name || layer.type);
    };

    const saveName = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            updateLayer(editingId, { name: editName });
            setEditingId(null);
        }
    };

    if (layers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 space-y-2">
                <Box className="w-8 h-8 opacity-20" />
                <p className="text-xs">No layers yet</p>
            </div>
        );
    }

    // Display layers reversed (Top layer first)
    // We map the original index to the display item to help with moving
    const displayItems = layers.map((layer, index) => ({ layer, index })).reverse();

    return (
        <div className="space-y-2 p-1">
            {displayItems.map(({ layer, index }) => (
                <div
                    key={layer.id}
                    onClick={() => setSelectedElement(layer.id)}
                    className={cn(
                        "group flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer",
                        selectedElementId === layer.id
                            ? "bg-indigo-500/10 border-indigo-500/50"
                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                    )}
                >
                    <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            className="text-gray-500 hover:text-white"
                            onClick={(e) => handleMove(e, index, 'up')}
                            disabled={index === layers.length - 1}
                        >
                            <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                            className="text-gray-500 hover:text-white"
                            onClick={(e) => handleMove(e, index, 'down')}
                            disabled={index === 0}
                        >
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                        {getLayerIcon(layer.type)}
                    </div>

                    <div className="flex-1 min-w-0" onDoubleClick={(e) => startEditing(e, layer)}>
                        {editingId === layer.id ? (
                            <input
                                autoFocus
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={saveName}
                                onBlur={saveName}
                                className="w-full bg-black/50 text-xs px-1 py-0.5 rounded border border-indigo-500 outline-none text-white"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <p className={cn("text-xs font-medium truncate select-none", selectedElementId === layer.id ? "text-indigo-300" : "text-gray-300")}>
                                {layer.name || layer.type}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => handleLockToggle(e, layer)}
                            className={cn("p-1 rounded hover:bg-white/10", layer.locked ? "text-amber-400 opacity-100" : "text-gray-500")}
                        >
                            {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>

                        <button
                            onClick={(e) => handleVisibilityToggle(e, layer)}
                            className={cn("p-1 rounded hover:bg-white/10", !layer.visible ? "text-gray-600" : "text-gray-400")}
                        >
                            {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>

                        <button
                            onClick={(e) => handleDelete(e, layer.id)}
                            className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LayersPanel;
