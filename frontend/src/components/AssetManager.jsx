import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Upload, Sparkles, Image as ImageIcon, Trash2, Plus, Loader2, X } from "lucide-react";

const AssetManager = ({ onSelectImage }) => {
    const [assets, setAssets] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState("");

    const getFullUrl = (url) => {
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `http://127.0.0.1:8000${url}`;
    };

    const onDrop = async (acceptedFiles) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/creative/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const newAsset = {
                id: Date.now(),
                url: getFullUrl(response.data.url),
                name: response.data.filename,
            };
            setAssets([...assets, newAsset]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed!');
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleRemoveBg = async (asset) => {
        try {
            const formData = new FormData();
            formData.append('image_url', asset.url);
            const response = await axios.post('http://127.0.0.1:8000/api/creative/remove-bg', formData);
            const newAsset = {
                id: Date.now(),
                url: getFullUrl(response.data.url),
                name: `no_bg_${asset.name}`
            };
            setAssets([...assets, newAsset]);
        } catch (error) {
            console.error('BG Removal failed:', error);
            alert('Background removal failed.');
        }
    }

    const handleGenerate = async () => {
        if (!prompt) return;

        setGenerating(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('prompt', prompt);
            const response = await axios.post('http://127.0.0.1:8000/api/creative/generate-bg', formData);

            const newAsset = {
                id: Date.now(),
                url: getFullUrl(response.data.url),
                name: response.data.name,
            };
            setAssets(prev => [...prev, newAsset]);
        } catch (error) {
            console.error('Generation failed:', error);
            setError("Generation failed. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
                {/* Upload Section */}
                <section className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Upload Assets</h3>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}`}
                    >
                        <input {...getInputProps()} />
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <p className="text-xs text-muted-foreground">Uploading...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-2 rounded-full bg-muted group-hover:bg-background transition-colors">
                                    <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Click to upload</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <Separator />

                {/* Generate Section */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Generation</h3>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">FLUX.1</span>
                    </div>

                    <Card className="border-muted-foreground/20 bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardContent className="p-3 space-y-3">
                            <div className="space-y-1.5">
                                <label htmlFor="gen-prompt" className="text-xs font-medium text-muted-foreground ml-1">Prompt</label>
                                <Input
                                    id="gen-prompt"
                                    placeholder="Describe your vision..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="bg-background border-muted-foreground/20 text-xs h-9 focus-visible:ring-primary/30"
                                />
                            </div>

                            {error && (
                                <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive flex items-center gap-2">
                                    <X className="w-3 h-3" />
                                    {error}
                                </div>
                            )}

                            <Button
                                className="w-full h-8 text-xs gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                onClick={handleGenerate}
                                disabled={generating || !prompt}
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Generate Background
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* Assets Grid */}
                <section className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Library</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {assets.map((asset) => (
                            <div key={asset.id} className="group relative aspect-square rounded-lg border bg-muted overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-md">
                                <img
                                    src={asset.url}
                                    alt={asset.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onClick={() => onSelectImage(asset.url)}
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 rounded-full hover:scale-110 transition-transform"
                                        onClick={(e) => { e.stopPropagation(); handleRemoveBg(asset); }}
                                        title="Remove Background"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:scale-110 transition-transform"
                                        onClick={(e) => { e.stopPropagation(); onSelectImage(asset.url); }}
                                        title="Use Image"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {assets.length === 0 && (
                            <div className="col-span-2 py-8 flex flex-col items-center justify-center border border-dashed rounded-lg bg-muted/30 text-muted-foreground">
                                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-xs">No assets yet</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </ScrollArea>
    );
};

export default AssetManager;
