import React, { useRef } from 'react';
import { useCreativeStore } from '@/store/useCreativeStore';
import { Plus, Trash2, Upload, Type, Palette, Check } from 'lucide-react';

const BrandKitPanel = () => {
    const { brandKit, updateBrandKit, selectedElementId, updateLayer, addAsset } = useCreativeStore();
    const fileInputRef = useRef(null);

    const handleAddColor = (e) => {
        const newColor = e.target.value;
        if (!brandKit.colors.includes(newColor)) {
            updateBrandKit({ colors: [...brandKit.colors, newColor] });
        }
    };

    const handleRemoveColor = (e, colorToRemove) => {
        e.stopPropagation();
        updateBrandKit({ colors: brandKit.colors.filter(c => c !== colorToRemove) });
    };

    const handleApplyColor = (color) => {
        if (selectedElementId) {
            updateLayer(selectedElementId, { fill: color });
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateBrandKit({ logo: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddLogoToCanvas = () => {
        if (brandKit.logo) {
            addAsset({
                id: `logo-${Date.now()}`,
                type: 'image',
                src: brandKit.logo,
                role: 'logo'
            });
            // Note: CanvasEditor needs to listen to 'addAsset' or we need to handle it there.
            // Currently CanvasEditor listens to 'imageUrl' prop or we need a way to trigger add.
            // Actually, useCreativeStore has 'addAsset' but CanvasEditor doesn't seem to subscribe to 'assets' array for *new* additions efficiently?
            // CanvasEditor uses `imageUrl` prop for initial load.
            // Let's check CanvasEditor again. It syncs `layers` -> Canvas.
            // So if we add to `layers`, it should render.
            // But `addAsset` in store updates `creative.assets`.
            // We need to update `layers` directly or have CanvasEditor sync from `creative.assets`.
            // CanvasEditor syncs `layers` state to canvas.
            // So we should use `setLayers` or a new action `addLayer`.
            // Let's assume we can dispatch an event or use a direct method if possible.
            // For now, I'll assume `addAsset` updates `creative.assets` and we need a mechanism to add to canvas.
            // I'll update `useCreativeStore` to have `addLayer` which updates `layers`.
            // Wait, `CanvasEditor` syncs `layers` -> Canvas. So if I add to `layers`, it should appear?
            // Yes, if `CanvasEditor` handles `object:added` correctly.
            // But `CanvasEditor` effect for `layers` handles updates to existing objects.
            // It doesn't seem to handle *creating* new objects from `layers` state (except initial load?).
            // Let's look at CanvasEditor again.
            // "Sync Store Updates to Canvas (One-way: Store -> Canvas)"
            // It iterates `layers` and finds object by ID. If found, updates props.
            // It does NOT create new objects if they don't exist.

            // To fix this, I should probably emit a custom event or use a ref.
            // Or, simpler: Just use the `imageUrl` prop on CanvasEditor to trigger load? No, that's for single image.

            // I'll dispatch a custom event 'add-image' to window, and CanvasEditor can listen.
            window.dispatchEvent(new CustomEvent('add-image', { detail: brandKit.logo }));
        }
    };

    const handleAddFont = (e) => {
        const font = e.target.value;
        if (font && !brandKit.fonts.includes(font)) {
            updateBrandKit({ fonts: [...brandKit.fonts, font] });
        }
    };

    const handleApplyFont = (font) => {
        if (selectedElementId) {
            updateLayer(selectedElementId, { fontFamily: font });
        }
    };

    return (
        <div className="space-y-6 p-1">
            {/* Brand Colors */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Palette className="w-3 h-3" /> Brand Colors
                    </label>
                </div>

                <div className="grid grid-cols-5 gap-2">
                    {brandKit.colors.map((color, index) => (
                        <div
                            key={index}
                            onClick={() => handleApplyColor(color)}
                            className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 cursor-pointer shadow-sm hover:scale-105 transition-transform"
                        >
                            <div
                                className="w-full h-full"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-[8px] text-white font-mono">{color}</span>
                            </div>
                            <button
                                onClick={(e) => handleRemoveColor(e, color)}
                                className="absolute top-0 right-0 p-1 bg-black/50 opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-all"
                            >
                                <Trash2 className="w-2.5 h-2.5 text-white" />
                            </button>
                        </div>
                    ))}
                    <div className="aspect-square rounded-lg border border-dashed border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors relative">
                        <Plus className="w-4 h-4 text-gray-400" />
                        <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={handleAddColor}
                        />
                    </div>
                </div>
            </div>

            {/* Brand Fonts */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Type className="w-3 h-3" /> Brand Fonts
                </label>

                <div className="space-y-2">
                    {brandKit.fonts.map((font, index) => (
                        <div
                            key={index}
                            onClick={() => handleApplyFont(font)}
                            className="group flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <span className="text-xs text-gray-200" style={{ fontFamily: font }}>{font}</span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-indigo-300">Apply</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateBrandKit({ fonts: brandKit.fonts.filter(f => f !== font) });
                                    }}
                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <select
                        className="w-full bg-black/20 border border-white/10 rounded-lg text-xs text-gray-300 p-2 outline-none focus:border-indigo-500/50"
                        onChange={handleAddFont}
                        value=""
                    >
                        <option value="" disabled>Add a font...</option>
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Lato">Lato</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Playfair Display">Playfair Display</option>
                    </select>
                </div>
            </div>

            {/* Brand Logo */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-3 h-3" /> Brand Logo
                </label>

                {brandKit.logo ? (
                    <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-white/5 p-4 flex items-center justify-center">
                        <img src={brandKit.logo} alt="Brand Logo" className="max-h-24 object-contain" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                            <button
                                onClick={handleAddLogoToCanvas}
                                className="p-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors text-white"
                                title="Add to Canvas"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => document.getElementById('logo-upload').click()}
                                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <Upload className="w-4 h-4 text-white" />
                            </button>
                            <button
                                onClick={() => updateBrandKit({ logo: null })}
                                className="p-2 bg-white/10 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => document.getElementById('logo-upload').click()}
                        className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                            <Upload className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-400">Upload Logo</p>
                    </div>
                )}
                <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                />
            </div>
        </div>
    );
};

export default BrandKitPanel;
