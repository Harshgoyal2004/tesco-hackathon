import React, { useState } from 'react';
import { useCreativeStore } from '@/store/useCreativeStore';
import GlassPanel from '@/components/ui/GlassPanel';
import AssetManager from '@/components/AssetManager';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import PropertiesPanel from '@/components/panels/PropertiesPanel';
import LayersPanel from '@/components/panels/LayersPanel';
import BrandKitPanel from '@/components/panels/BrandKitPanel';

const AppLayout = ({ children, onSelectImage }) => {
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);
    const { creative } = useCreativeStore();

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#0B0F19] text-foreground flex relative selection:bg-primary/30">

            {/* LEFT SIDEBAR - Fixed Width */}
            <div
                className={`relative z-40 h-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex-shrink-0 ${leftOpen ? 'w-[280px]' : 'w-0'} bg-[#070B12] border-r border-white/5`}
            >
                <div className="absolute inset-0 flex flex-col">
                    {/* Header */}
                    <div className="h-14 flex items-center px-4 border-b border-white/5 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="ml-3 font-bold text-sm tracking-wide">CreativePilot</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        <AssetManager onSelectImage={onSelectImage} />
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setLeftOpen(!leftOpen)}
                    className="absolute top-1/2 -right-3 w-6 h-12 bg-gray-900 border border-white/10 rounded-r-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors z-50 shadow-xl"
                >
                    {leftOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
            </div>

            {/* CENTER CANVAS - Flex 1 */}
            <main className="flex-1 relative z-0 flex flex-col bg-[#0B0F19] overflow-hidden">

                {/* Canvas Area */}
                <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px]">
                    {children}
                </div>
            </main>

            {/* RIGHT SIDEBAR - Fixed Width */}
            <div
                className={`relative z-40 h-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex-shrink-0 ${rightOpen ? 'w-[300px]' : 'w-0'} bg-[#070B12] border-l border-white/5`}
            >
                <div className="absolute inset-0 flex flex-col">
                    <Tabs.Root defaultValue="properties" className="flex-1 flex flex-col">
                        <div className="px-4 pt-4 pb-2">
                            <Tabs.List className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                                <Tabs.Trigger value="properties" className="flex-1 py-1.5 text-xs font-medium text-gray-400 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-md transition-all">Properties</Tabs.Trigger>
                                <Tabs.Trigger value="layers" className="flex-1 py-1.5 text-xs font-medium text-gray-400 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-md transition-all">Layers</Tabs.Trigger>
                                <Tabs.Trigger value="brand" className="flex-1 py-1.5 text-xs font-medium text-gray-400 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-md transition-all">Brand</Tabs.Trigger>
                            </Tabs.List>
                        </div>



                        <div className="flex-1 p-4 overflow-y-auto">
                            <Tabs.Content value="properties" className="space-y-6 outline-none">
                                <PropertiesPanel />
                            </Tabs.Content>
                            <Tabs.Content value="layers" className="outline-none">
                                <LayersPanel />
                            </Tabs.Content>
                            <Tabs.Content value="brand" className="outline-none">
                                <BrandKitPanel />
                            </Tabs.Content>
                        </div>
                    </Tabs.Root>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setRightOpen(!rightOpen)}
                    className="absolute top-1/2 -left-3 w-6 h-12 bg-gray-900 border border-white/10 rounded-l-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors z-50 shadow-xl"
                >
                    {rightOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </div>

        </div>
    );
};

export default AppLayout;
