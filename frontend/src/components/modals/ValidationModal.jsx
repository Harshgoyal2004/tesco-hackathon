import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useCreativeStore } from '@/store/useCreativeStore';

const ValidationModal = () => {
    const { complianceReport, isValidationModalOpen, closeValidationModal } = useCreativeStore();

    if (!isValidationModalOpen) return null;

    const { score, warnings, errors, passed } = complianceReport;

    return (
        <Dialog.Root open={isValidationModalOpen} onOpenChange={closeValidationModal}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0B0F19] border border-white/10 rounded-2xl shadow-2xl p-6 z-50 focus:outline-none">

                    <div className="flex items-center justify-between mb-6">
                        <Dialog.Title className="text-xl font-bold text-white">Guideline Validation</Dialog.Title>
                        <button onClick={closeValidationModal} className="text-gray-400 hover:text-white transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Score Circle */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    fill="transparent"
                                    stroke="#374151"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    fill="transparent"
                                    stroke={score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444"}
                                    strokeWidth="8"
                                    strokeDasharray={2 * Math.PI * 60}
                                    strokeDashoffset={2 * Math.PI * 60 * (1 - score / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-4xl font-bold text-white">{score}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Score</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className={`text-center mb-6 font-medium ${passed ? 'text-green-400' : 'text-red-400'}`}>
                        {passed ? 'Creative Passed Guidelines' : 'Creative Failed Guidelines'}
                    </div>

                    {/* Issues List */}
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {errors.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Errors
                                </h4>
                                {errors.map((err, i) => (
                                    <div key={i} className="text-sm text-gray-300 bg-red-500/10 p-2 rounded border border-red-500/20">
                                        {err}
                                    </div>
                                ))}
                            </div>
                        )}

                        {warnings.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> Warnings
                                </h4>
                                {warnings.map((warn, i) => (
                                    <div key={i} className="text-sm text-gray-300 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                                        {warn}
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.length === 0 && warnings.length === 0 && (
                            <div className="text-center text-gray-400 py-4">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                No issues found. Great job!
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={closeValidationModal}
                            className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
                        >
                            Close
                        </button>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ValidationModal;
