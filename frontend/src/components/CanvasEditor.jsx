import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Canvas, Image } from 'fabric';
import { Card } from "@/components/ui/card";
import { MousePointer2, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreativeStore } from '../store/useCreativeStore';
import GuidelineOverlay from '../editor/GuidelineOverlay';
import TemplateModal from './modals/TemplateModal';
import FloatingToolbar from './layout/FloatingToolbar';
import ValidationModal from './modals/ValidationModal';

const CanvasEditor = forwardRef(({ imageUrl, onLoad, className, onExport, onValidate, onAddText }, ref) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const { creative, setSelectedElement, setLayers, updateLayer, layers, canvasSettings, saveHistory, isGridVisible, updateFormat } = useCreativeStore();
  const isInternalUpdate = useRef(false);

  // ... (existing code)

  // Sync Store Updates to Canvas (One-way: Store -> Canvas)
  useEffect(() => {
    if (!fabricCanvas) return;

    isInternalUpdate.current = true;
    const canvasObjects = fabricCanvas.getObjects();

    layers.forEach(layer => {
      const obj = canvasObjects.find(o => o.id === layer.id);
      if (obj) {
        // Visibility & Locking
        if (obj.visible !== layer.visible) obj.set('visible', layer.visible);
        if (obj.lockMovementX !== layer.locked) {
          obj.set({ lockMovementX: layer.locked, lockMovementY: layer.locked, lockRotation: layer.locked, lockScalingX: layer.locked, lockScalingY: layer.locked });
        }

        // Deletion
        if (layer.shouldDelete) {
          fabricCanvas.remove(obj);
          return; // Continue to next layer
        }

        // Typography
        if (layer.type === 'i-text' || layer.type === 'text') {
          obj.set({
            fill: layer.fill,
            fontFamily: layer.fontFamily,
            fontSize: layer.fontSize,
            fontWeight: layer.fontWeight,
            fontStyle: layer.fontStyle,
            underline: layer.underline,
            textAlign: layer.textAlign,
            charSpacing: layer.charSpacing,
            lineHeight: layer.lineHeight,
          });

          // Shadow
          if (layer.shadow) {
            obj.set('shadow', new fabric.Shadow(layer.shadow));
          } else {
            obj.set('shadow', null);
          }
        }

        // Image Filters & Transform
        if (layer.type === 'image') {
          if (layer.filters) {
            // Filters (simplified - requires backend or complex filter pipeline in Fabric)
            // For now, we just store them. Fabric filters are complex to sync reactively without re-creating.
            // But we can handle Flip
            if (obj.flipX !== layer.filters.flipX) obj.set('flipX', layer.filters.flipX);
            if (obj.flipY !== layer.filters.flipY) obj.set('flipY', layer.filters.flipY);
          }
        }
      }
    });

    fabricCanvas.requestRenderAll();
    isInternalUpdate.current = false;

  }, [layers, fabricCanvas]);

  // Handle Canvas Settings Updates
  useEffect(() => {
    if (fabricCanvas) {
      fabricCanvas.setDimensions({ width: canvasSettings.width, height: canvasSettings.height });
      fabricCanvas.backgroundColor = canvasSettings.backgroundColor;
      fabricCanvas.requestRenderAll();
    }
  }, [canvasSettings, fabricCanvas]);

  // Handle Image Loading (Legacy prop support & Event support)
  useEffect(() => {
    const handleAddImage = (e) => {
      const url = e.detail;
      if (fabricCanvas && url) {
        Image.fromURL(url, { crossOrigin: 'anonymous' })
          .then((img) => {
            // Smart scaling to fit
            const scale = Math.min(
              (fabricCanvas.width * 0.4) / img.width,
              (fabricCanvas.height * 0.4) / img.height
            );
            img.scale(scale);
            img.set({
              left: (fabricCanvas.width - img.width * scale) / 2,
              top: (fabricCanvas.height - img.height * scale) / 2,
              id: `asset_${Date.now()}`,
              name: 'Brand Asset'
            });
            fabricCanvas.add(img);
            fabricCanvas.setActiveObject(img);
            fabricCanvas.renderAll();
            syncLayers(fabricCanvas);
            saveHistory(fabricCanvas.toJSON());
          })
          .catch(err => console.error("Error loading image:", err));
      }
    };

    const handleSetBackground = (e) => {
      const url = e.detail;
      if (fabricCanvas && url) {
        fabricCanvas.setBackgroundImage(url, fabricCanvas.renderAll.bind(fabricCanvas), {
          scaleX: fabricCanvas.width / 1080, // Approximate scale, better to use cover logic
          scaleY: fabricCanvas.height / 1080,
          crossOrigin: 'anonymous'
        });
        // Note: Background image scaling needs to be smarter (cover/contain)
        // But for now this works.
        saveHistory(fabricCanvas.toJSON());
      }
    };

    window.addEventListener('add-image', handleAddImage);
    window.addEventListener('set-background', handleSetBackground);

    if (fabricCanvas && imageUrl) {
      // ... existing logic for initial image ...
      Image.fromURL(imageUrl, { crossOrigin: 'anonymous' })
        .then((img) => {
          const scale = Math.min(
            (fabricCanvas.width * 0.8) / img.width,
            (fabricCanvas.height * 0.8) / img.height
          );
          img.scale(scale);
          img.set({
            left: (fabricCanvas.width - img.width * scale) / 2,
            top: (fabricCanvas.height - img.height * scale) / 2,
            id: `asset_${Date.now()}`,
            name: 'Image Layer'
          });
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
          syncLayers(fabricCanvas);
          saveHistory(fabricCanvas.toJSON());
        })
        .catch(err => console.error("Error loading image:", err));
    }

    return () => {
      window.removeEventListener('add-image', handleAddImage);
      window.removeEventListener('set-background', handleSetBackground);
    };
  }, [fabricCanvas, imageUrl]);

  // Auto-scaling logic
  const [scale, setScale] = useState(0.5); // Start smaller to avoid huge flash

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const parent = containerRef.current.parentElement;
      if (!parent) return;

      const targetW = canvasSettings.width;
      const targetH = canvasSettings.height;

      // Get parent dimensions
      const availableW = parent.clientWidth;
      const availableH = parent.clientHeight;

      if (availableW === 0 || availableH === 0) return;

      // Add padding (64px total = 32px each side)
      const padding = 64;
      const safeW = availableW - padding;
      const safeH = availableH - padding;

      const scaleW = safeW / targetW;
      const scaleH = safeH / targetH;

      // Use the smaller scale to ensure it fits entirely
      const newScale = Math.min(scaleW, scaleH, 0.95); // Cap at 0.95 to always have breathing room

      setScale(newScale);
    };

    // Initial calculation with a small delay to ensure layout is ready
    const timer = setTimeout(updateScale, 100);

    // Observe resizing
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateScale);
    });

    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [canvasSettings.width, canvasSettings.height]);

  const handleLoadTemplate = (template) => {
    if (fabricCanvas && template) {
      // Update format first
      updateFormat(template.format);

      // Load objects
      const json = {
        version: "5.3.0",
        objects: template.objects,
        background: template.background || '#ffffff'
      };

      fabricCanvas.loadFromJSON(json, () => {
        fabricCanvas.renderAll();
        syncLayers(fabricCanvas);
        saveHistory(fabricCanvas.toJSON());
        setIsTemplateModalOpen(false);
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-center w-full h-full", className)}
    >
      {/* Toolbar - Absolute Positioned Inside Canvas Container */}
      <FloatingToolbar
        onExport={onExport}
        onValidate={onValidate}
        onAddText={onAddText}
        canvasRef={fabricCanvas ? { current: fabricCanvas } : null}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
      />

      <ValidationModal />

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onLoadTemplate={handleLoadTemplate}
      />

      <div
        style={{
          transform: `scale(${scale})`,
          width: canvasSettings.width,
          height: canvasSettings.height,
          transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
        className="relative shadow-2xl shadow-black/50 rounded-xl"
      >
        {/* Canvas Wrapper - Bright White */}
        <div className="bg-white shadow-xl rounded-xl relative overflow-hidden w-full h-full">
          <GuidelineOverlay width={canvasSettings.width} height={canvasSettings.height} />

          {/* Grid Overlay */}
          {isGridVisible && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />
          )}

          <canvas ref={canvasRef} />
        </div>
      </div>

      <div className="absolute bottom-8 flex items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl z-50">
        <span className="flex items-center gap-1.5">
          <MousePointer2 className="w-3.5 h-3.5" />
          Select
        </span>
        <span className="w-1 h-1 rounded-full bg-white/20"></span>
        <span className="flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5" />
          Edit Text
        </span>
        <span className="w-1 h-1 rounded-full bg-white/20"></span>
        <span className="text-white">{Math.round(scale * 100)}%</span>
      </div>
    </div>
  );
});

CanvasEditor.displayName = "CanvasEditor";

export default CanvasEditor;
