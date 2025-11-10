import React from 'react';
import { XIcon } from './Icons';

interface DedicationPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    dedication: string;
    onDedicationChange: (value: string) => void;
    onGenerate: () => void;
    suggestions: string[];
    isLoading: boolean;
    error: string | null;
}

const DedicationPreviewModal: React.FC<DedicationPreviewModalProps> = ({
    isOpen,
    onClose,
    dedication,
    onDedicationChange,
    onGenerate,
    suggestions,
    isLoading,
    error
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="relative bg-[#2a2e3c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all p-8" 
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition z-10">
                    <XIcon className="w-6 h-6" />
                </button>
                
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">Dedicatoria</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Textarea for writing */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Escribe tu Mensaje</h3>
                        <textarea
                            value={dedication}
                            onChange={e => onDedicationChange(e.target.value)}
                            placeholder="Unas palabras desde el corazón..."
                            rows={8}
                            className="w-full bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg p-3 focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition"
                        />
                    </div>

                    {/* AI Suggestions */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-200">Sugerencias con IA</h3>
                            <button
                                onClick={onGenerate}
                                disabled={isLoading}
                                className="bg-[#DCBBA0] text-gray-800 text-sm font-bold py-1 px-4 rounded-md hover:brightness-95 transition disabled:opacity-50"
                            >
                                {isLoading ? 'Generando...' : 'Generar'}
                            </button>
                        </div>
                        
                        <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-3 h-[218px] flex flex-col">
                            {isLoading && (
                                <div className="flex-grow flex items-center justify-center">
                                    <p className="text-gray-400 animate-pulse">Buscando inspiración...</p>
                                </div>
                            )}
                            {error && !isLoading && (
                                <div className="flex-grow flex items-center justify-center text-center">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}
                            {!isLoading && !error && suggestions.length > 0 && (
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    {suggestions.map((s, i) => (
                                        <li key={i} className="p-2 rounded-md hover:bg-white/10 transition cursor-pointer" onClick={() => onDedicationChange(s)}>
                                            "{s}"
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {!isLoading && !error && suggestions.length === 0 && (
                                <div className="flex-grow flex items-center justify-center text-center">
                                    <p className="text-gray-400">Haz clic en "Generar" para obtener ideas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button onClick={onClose} className="bg-gray-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-gray-500 transition">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DedicationPreviewModal;
