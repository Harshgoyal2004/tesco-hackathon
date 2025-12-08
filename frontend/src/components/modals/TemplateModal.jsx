import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, LayoutTemplate } from 'lucide-react';
import { useCreativeStore } from '@/store/useCreativeStore';
import { templates } from '@/data/templates';

const TemplateModal = ({ isOpen, onClose, onLoadTemplate }) => {
    if (!isOpen) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-[#0B0F19] border border-white/10 rounded-2xl shadow-2xl p-6 z-50 focus:outline-none max-h-[80vh] overflow-hidden flex flex-col">

                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
                            <LayoutTemplate className="w-5 h-5 text-indigo-400" /> Template Library
                        </Dialog.Title>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-6 overflow-y-auto p-2">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => onLoadTemplate(template)}
                                className="group relative aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10"
                            >
                                <img
                                    src={template.thumbnail}
                                    alt={template.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white font-medium truncate">{template.name}</h3>
                                    <p className="text-xs text-gray-400">{template.format}</p>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                                    <span className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium text-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        Use Template
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default TemplateModal;
