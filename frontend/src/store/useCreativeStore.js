import { create } from 'zustand';
import axios from 'axios';
import { templates } from '../data/templates';

export const useCreativeStore = create((set, get) => ({
    // Creative State
    creative: {
        id: 'draft-1',
        format: '1080x1080',
        assets: [],
        text_layers: [],
        background_color: '#ffffff',
    },

    // History State (Undo/Redo)
    history: {
        past: [],
        future: []
    },

    // Compliance Report
    complianceReport: {
        score: null,
        warnings: [],
        errors: [],
        passed: false,
    },
    isValidationModalOpen: false,

    // UI State
    selectedElementId: null,
    isSafeZoneVisible: false,
    isGridVisible: false,

    // Brand Kit State (Persisted)
    brandKit: JSON.parse(localStorage.getItem('brandKit')) || {
        colors: ['#FF0000', '#00FF00', '#0000FF'],
        fonts: ['Inter', 'Roboto', 'Poppins'],
        logo: null,
        presets: {
            primaryColor: '#6366f1',
            headlineFont: 'Inter',
        }
    },

    // Layers State
    layers: [],

    // Canvas Settings
    canvasSettings: {
        width: 1080,
        height: 1080,
        backgroundColor: '#ffffff',
        scaleObjects: true,
    },

    // Actions
    setCreative: (creative) => set({ creative }),

    // History Actions
    saveHistory: (json) => set((state) => {
        // Don't save if same as last state (simple check)
        const lastState = state.history.past[state.history.past.length - 1];
        if (JSON.stringify(json) === JSON.stringify(lastState)) return {};

        return {
            history: {
                past: [...state.history.past, json],
                future: []
            }
        };
    }),

    undo: () => {
        const { history } = get();
        if (history.past.length === 0) return null;

        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);

        set({
            history: {
                past: newPast,
                future: [previous, ...history.future] // Store current? Logic needs refinement in component
            }
        });
        return previous; // Component should handle loading this
    },

    redo: () => {
        const { history } = get();
        if (history.future.length === 0) return null;

        const next = history.future[0];
        const newFuture = history.future.slice(1);

        set({
            history: {
                past: [...history.past, next],
                future: newFuture
            }
        });
        return next;
    },

    // Validation Actions
    validateCreative: async (canvasJson) => {
        try {
            const { brandKit } = get();
            const response = await axios.post('http://127.0.0.1:8000/api/creative/validate', {
                creative: canvasJson,
                brandKit: brandKit
            });
            set({ complianceReport: response.data, isValidationModalOpen: true });
        } catch (error) {
            console.error("Validation failed", error);
        }
    },

    closeValidationModal: () => set({ isValidationModalOpen: false }),

    // Template Actions
    loadTemplate: (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            // Return template data for component to load
            return template;
        }
        return null;
    },

    updateFormat: (format) => set((state) => {
        const [w, h] = format.split('x').map(Number);
        return {
            creative: { ...state.creative, format },
            canvasSettings: { ...state.canvasSettings, width: w, height: h }
        };
    }),

    addAsset: (asset) => set((state) => ({
        creative: {
            ...state.creative,
            assets: [...state.creative.assets, asset]
        }
    })),

    addTextLayer: (layer) => set((state) => ({
        creative: {
            ...state.creative,
            text_layers: [...state.creative.text_layers, layer]
        }
    })),

    updateElement: (id, updates) => set((state) => {
        const updatedAssets = state.creative.assets.map(a =>
            a.id === id ? { ...a, ...updates } : a
        );
        const updatedTextLayers = state.creative.text_layers.map(t =>
            t.id === id ? { ...t, ...updates } : t
        );

        return {
            creative: {
                ...state.creative,
                assets: updatedAssets,
                text_layers: updatedTextLayers
            }
        };
    }),

    // Brand Kit Actions
    updateBrandKit: (updates) => set((state) => {
        const newBrandKit = { ...state.brandKit, ...updates };
        localStorage.setItem('brandKit', JSON.stringify(newBrandKit));
        return { brandKit: newBrandKit };
    }),

    // Layer Actions
    setLayers: (layers) => set({ layers }),

    updateLayer: (id, updates) => set((state) => ({
        layers: state.layers.map(l => l.id === id ? { ...l, ...updates } : l)
    })),

    // Canvas Actions
    updateCanvasSettings: (updates) => set((state) => ({
        canvasSettings: { ...state.canvasSettings, ...updates }
    })),

    setComplianceReport: (report) => set({ complianceReport: report }),

    setSelectedElement: (id) => set({ selectedElementId: id }),

    toggleSafeZone: () => set((state) => ({ isSafeZoneVisible: !state.isSafeZoneVisible })),
    toggleGrid: () => set((state) => ({ isGridVisible: !state.isGridVisible })),
}));
