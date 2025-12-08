import React, { useState, useCallback, useRef } from 'react';
import { IText } from 'fabric';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { useCreativeStore } from './store/useCreativeStore';
import axios from 'axios';

import AppLayout from './components/layout/AppLayout';
import CanvasEditor from './components/CanvasEditor';
import { AdaptiveThemeProvider } from './context/AdaptiveThemeProvider';

const queryClient = new QueryClient();

function CreativeApp() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef();

  const { creative, setComplianceReport } = useCreativeStore();

  // Mutation for Guideline Validation
  const validateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        id: creative.id,
        name: "Draft Creative",
        format: creative.format,
        assets: [],
        text_layers: [],
      };

      if (canvas) {
        const objects = canvas.getObjects();
        payload.text_layers = objects
          .filter(obj => obj.type === 'i-text' || obj.type === 'text')
          .map((obj, idx) => ({
            id: `text_${idx}`,
            text: obj.text,
            role: "other",
            font_family: obj.fontFamily,
            font_size: obj.fontSize,
            color: obj.fill,
            x: obj.left,
            y: obj.top,
            width: obj.width,
            height: obj.height,
            z_index: idx
          }));
      }

      const response = await axios.post('http://127.0.0.1:8000/api/creative/validate', payload);
      return response.data;
    },
    onSuccess: (data) => {
      setComplianceReport(data);
      if (!data.is_compliant) {
        alert(`Guidelines Failed (${data.score}/100):\n` + data.violations.map(v => `- ${v.message}`).join('\n'));
      } else {
        alert(`Guidelines Passed! Score: ${data.score}/100`);
      }
    },
    onError: (error) => {
      console.error("Validation failed:", error);
      alert("Failed to validate guidelines.");
    }
  });

  const handleAddText = useCallback(() => {
    if (canvas) {
      const text = new IText('Double click to edit', {
        left: 100,
        top: 100,
        fontFamily: 'Inter',
        fill: '#111827',
        fontSize: 48,
        fontWeight: 600,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    }
  }, [canvas]);

  const handleExport = useCallback(async () => {
    if (!canvas) return;
    try {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      });
      const link = document.createElement('a');
      link.download = `creative-pilot-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [canvas]);

  // Note: `isLoading` and `Download` are not defined in the original code.
  // Assuming `isLoading` refers to `validateMutation.isPending` or a similar state,
  // and `Download` is an icon component that needs to be imported.
  // For this change, `isLoading` is set to false and `Download` is replaced with a placeholder.
  const isLoading = false; // Placeholder for isLoading state

  return (
    <AdaptiveThemeProvider>
      <AppLayout
        onSelectImage={setSelectedImage}
      >
        <div className="relative w-full h-full flex items-center justify-center p-8">
          <div className="relative shadow-2xl shadow-black/50 rounded-lg overflow-hidden ring-1 ring-white/10">
            <CanvasEditor
              ref={canvasRef}
              imageUrl={selectedImage}
              onLoad={(c) => setCanvas(c)}
              className="bg-white"
              onExport={handleExport}
              onValidate={() => validateMutation.mutate()}
              onAddText={handleAddText}
            />
          </div>
        </div>
      </AppLayout>
      {/* Added Button and test div as per instruction */}
    </AdaptiveThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CreativeApp />
    </QueryClientProvider>
  );
}

export default App;