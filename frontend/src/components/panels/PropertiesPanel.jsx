import React, { useState } from 'react';
import { useCreativeStore } from '@/store/useCreativeStore';
import {
    Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
    Image as ImageIcon, Sliders, Sun, Contrast, Droplets, Layout,
    Grid, Shield, FlipHorizontal, FlipVertical, Palette, Sparkles, Wand2
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import axios from 'axios';

const PropertiesPanel = () => {
    const {
        selectedElementId, layers, updateLayer, creative, updateFormat,
        updateCanvasSettings, canvasSettings, toggleSafeZone, toggleGrid,
        isSafeZoneVisible, isGridVisible, addAsset
    } = useCreativeStore();

    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');

    const selectedLayer = layers.find(l => l.id === selectedElementId);

    const handleTextUpdate = (key, value) => {
        if (selectedElementId) {
            updateLayer(selectedElementId, { [key]: value });
        }
    };

    const handleFilterUpdate = (filter, value) => {
        if (selectedElementId) {
            const currentFilters = selectedLayer?.filters || {};
            updateLayer(selectedElementId, {
                filters: { ...currentFilters, [filter]: value }
            });
        }
    };

    const handleGenerateBackground = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            const formData = new FormData();
            formData.append('prompt', prompt);

            const response = await axios.post('http://localhost:8000/api/creative/generate-bg', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageUrl = `http://localhost:8000${response.data.url}`;

            // Dispatch event to set background
            window.dispatchEvent(new CustomEvent('set-background', { detail: imageUrl }));

        } catch (error) {
            console.error("Failed to generate background", error);
            // Fallback to Picsum if API fails (Unsplash source is deprecated)
            // Use prompt as seed for consistency
            const seed = prompt.replace(/[^a-zA-Z0-9]/g, '');
            const imageUrl = `https://picsum.photos/seed/${seed}/1080/1080`;
            window.dispatchEvent(new CustomEvent('set-background', { detail: imageUrl }));
        } finally {
            setIsGenerating(false);
        }
    };

    if (!selectedLayer) {
        // Canvas Settings
        return (
            <div className="space-y-6 p-1">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Layout className="w-3 h-3" /> Canvas Settings
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <span className="text-xs text-gray-400">Width</span>
                            <input
                                type="number"
                                value={canvasSettings.width}
                                onChange={(e) => updateCanvasSettings({ width: parseInt(e.target.value) })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-xs text-gray-400">Height</span>
                            <input
                                type="number"
                                value={canvasSettings.height}
                                onChange={(e) => updateCanvasSettings({ height: parseInt(e.target.value) })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <span className="text-xs text-gray-400">Preset Formats</span>
                        <div className="grid grid-cols-3 gap-2">
                            {['1080x1080', '1080x1920', '1200x628'].map(fmt => (
                                <button
                                    key={fmt}
                                    onClick={() => updateFormat(fmt)}
                                    className={`px-2 py-1.5 rounded-lg text-[10px] border transition-colors ${creative.format === fmt ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <span className="text-xs text-gray-400">Background</span>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-8 rounded-lg border border-white/10 overflow-hidden relative group">
                                <input
                                    type="color"
                                    value={canvasSettings.backgroundColor}
                                    onChange={(e) => updateCanvasSettings({ backgroundColor: e.target.value })}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="w-full h-full" style={{ backgroundColor: canvasSettings.backgroundColor }} />
                            </div>

                            {/* Gradient Toggle (Mock) */}
                            <button
                                className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400"
                                title="Add Gradient"
                                onClick={() => updateCanvasSettings({ backgroundColor: 'linear-gradient(45deg, #4f46e5, #ec4899)' })}
                            >
                                <Sparkles className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* AI Background Generator */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Wand2 className="w-3 h-3" /> AI Background
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Describe background..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500/50"
                            />
                            <button
                                onClick={handleGenerateBackground}
                                disabled={isGenerating || !prompt}
                                className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                            >
                                {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wand2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-3">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Overlays</label>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={toggleSafeZone}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${isSafeZoneVisible ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-gray-400'}`}
                            >
                                <span className="text-xs flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Safe Margins</span>
                                <div className={`w-2 h-2 rounded-full ${isSafeZoneVisible ? 'bg-indigo-400' : 'bg-gray-600'}`} />
                            </button>
                            <button
                                onClick={toggleGrid}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${isGridVisible ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-gray-400'}`}
                            >
                                <span className="text-xs flex items-center gap-2"><Grid className="w-3.5 h-3.5" /> Grid</span>
                                <div className={`w-2 h-2 rounded-full ${isGridVisible ? 'bg-indigo-400' : 'bg-gray-600'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Text Properties
    if (selectedLayer.type === 'i-text' || selectedLayer.type === 'text') {
        return (
            <div className="space-y-6 p-1">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Type className="w-3 h-3" /> Typography
                    </label>

                    {/* Font Family */}
                    <select
                        value={selectedLayer.fontFamily || 'Inter'}
                        onChange={(e) => handleTextUpdate('fontFamily', e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg text-xs text-gray-300 p-2 outline-none focus:border-indigo-500/50"
                    >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Playfair Display">Playfair Display</option>
                    </select>

                    {/* Size & Color */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={selectedLayer.fontSize || 40}
                            onChange={(e) => handleTextUpdate('fontSize', parseInt(e.target.value))}
                            className="w-20 bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500/50"
                        />
                        <div className="flex-1 h-8 rounded-lg border border-white/10 overflow-hidden relative">
                            <input
                                type="color"
                                value={selectedLayer.fill || '#000000'}
                                onChange={(e) => handleTextUpdate('fill', e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: selectedLayer.fill || '#000000' }} />
                        </div>
                    </div>

                    {/* Styles & Alignment */}
                    <div className="flex items-center justify-between bg-white/5 p-1 rounded-lg border border-white/5">
                        <div className="flex border-r border-white/10 pr-1 mr-1">
                            <button
                                onClick={() => handleTextUpdate('fontWeight', selectedLayer.fontWeight === 'bold' ? 'normal' : 'bold')}
                                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${selectedLayer.fontWeight === 'bold' ? 'text-indigo-400 bg-white/10' : 'text-gray-400'}`}
                            >
                                <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleTextUpdate('fontStyle', selectedLayer.fontStyle === 'italic' ? 'normal' : 'italic')}
                                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${selectedLayer.fontStyle === 'italic' ? 'text-indigo-400 bg-white/10' : 'text-gray-400'}`}
                            >
                                <Italic className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleTextUpdate('underline', !selectedLayer.underline)}
                                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${selectedLayer.underline ? 'text-indigo-400 bg-white/10' : 'text-gray-400'}`}
                            >
                                <Underline className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex">
                            <button
                                onClick={() => handleTextUpdate('textAlign', 'left')}
                                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${selectedLayer.textAlign === 'left' ? 'text-indigo-400 bg-white/10' : 'text-gray-400'}`}
                            >
                                <AlignLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleTextUpdate('textAlign', 'center')}
                                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${selectedLayer.textAlign === 'center' ? 'text-indigo-400 bg-white/10' : 'text-gray-400'}`}
                            >
                                <AlignCenter className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleTextUpdate('textAlign', 'right')}
                                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${selectedLayer.textAlign === 'right' ? 'text-indigo-400 bg-white/10' : 'text-gray-400'}`}
                            >
                                <AlignRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Spacing */}
                    <div className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Letter Spacing</span>
                                <span>{selectedLayer.charSpacing || 0}</span>
                            </div>
                            <input
                                type="range"
                                min="-50" max="300"
                                value={selectedLayer.charSpacing || 0}
                                onChange={(e) => handleTextUpdate('charSpacing', parseInt(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Line Height</span>
                                <span>{selectedLayer.lineHeight || 1.2}</span>
                            </div>
                            <input
                                type="range"
                                min="0.5" max="2.5" step="0.1"
                                value={selectedLayer.lineHeight || 1.2}
                                onChange={(e) => handleTextUpdate('lineHeight', parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Shadow */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Shadow</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={selectedLayer.shadow?.color || '#000000'}
                                onChange={(e) => handleTextUpdate('shadow', { ...selectedLayer.shadow, color: e.target.value, blur: 10, offsetX: 5, offsetY: 5 })}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <button
                                onClick={() => handleTextUpdate('shadow', null)}
                                className="px-2 py-1 text-[10px] bg-white/5 hover:bg-white/10 rounded text-gray-400"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Image Properties
    if (selectedLayer.type === 'image') {
        return (
            <div className="space-y-6 p-1">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3" /> Image Filters
                    </label>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span className="flex items-center gap-1.5"><Sun className="w-3 h-3" /> Brightness</span>
                                <span>{((selectedLayer.filters?.brightness || 0) * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="-1" max="1" step="0.05"
                                value={selectedLayer.filters?.brightness || 0}
                                onChange={(e) => handleFilterUpdate('brightness', parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span className="flex items-center gap-1.5"><Contrast className="w-3 h-3" /> Contrast</span>
                                <span>{((selectedLayer.filters?.contrast || 0) * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="-1" max="1" step="0.05"
                                value={selectedLayer.filters?.contrast || 0}
                                onChange={(e) => handleFilterUpdate('contrast', parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span className="flex items-center gap-1.5"><Droplets className="w-3 h-3" /> Blur</span>
                                <span>{((selectedLayer.filters?.blur || 0) * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={selectedLayer.filters?.blur || 0}
                                onChange={(e) => handleFilterUpdate('blur', parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span className="flex items-center gap-1.5"><Palette className="w-3 h-3" /> Saturation</span>
                                <span>{((selectedLayer.filters?.saturation || 0) * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="-1" max="1" step="0.05"
                                value={selectedLayer.filters?.saturation || 0}
                                onChange={(e) => handleFilterUpdate('saturation', parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-3">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Transform</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleFilterUpdate('flipX', !selectedLayer.filters?.flipX)}
                                className={`flex-1 p-2 rounded hover:bg-white/10 transition-colors border border-white/5 flex items-center justify-center gap-2 ${selectedLayer.filters?.flipX ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'text-gray-400'}`}
                            >
                                <FlipHorizontal className="w-3.5 h-3.5" /> Flip X
                            </button>
                            <button
                                onClick={() => handleFilterUpdate('flipY', !selectedLayer.filters?.flipY)}
                                className={`flex-1 p-2 rounded hover:bg-white/10 transition-colors border border-white/5 flex items-center justify-center gap-2 ${selectedLayer.filters?.flipY ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'text-gray-400'}`}
                            >
                                <FlipVertical className="w-3.5 h-3.5" /> Flip Y
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default PropertiesPanel;
