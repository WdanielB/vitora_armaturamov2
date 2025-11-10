import React from 'react';
import { SpotifyIcon, XIcon } from './Icons';

interface DedicationPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    dedication: string;
    spotifyLink: string;
}

const DedicationPreviewModal: React.FC<DedicationPreviewModalProps> = ({ isOpen, onClose, dedication, spotifyLink }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative bg-[#2a2e3c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition">
                    <XIcon className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">Vista Previa de la Dedicatoria</h2>

                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 shadow-inner min-h-[200px] flex flex-col justify-between">
                    <p className="text-gray-200 italic whitespace-pre-wrap">
                        {dedication || "Aquí aparecerá tu mensaje especial."}
                    </p>
                    
                    {spotifyLink && (
                        <div className="mt-6 pt-4 border-t border-gray-700 flex items-center gap-3 text-gray-400">
                            <SpotifyIcon className="w-8 h-8 text-green-500" />
                            <div>
                                <p className="font-semibold text-gray-300">Una canción para ti</p>
                                <p className="text-xs">Escanea el código para escucharla</p>
                            </div>
                            <div className="ml-auto flex flex-col items-center gap-1 opacity-50">
                                <div className="h-10 w-1 bg-gray-400"></div>
                                <div className="h-5 w-1 bg-gray-400"></div>
                                <div className="h-8 w-1 bg-gray-400"></div>
                                <div className="h-4 w-1 bg-gray-400"></div>
                                <div className="h-10 w-1 bg-gray-400"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#DCBBA0] text-gray-800 font-bold rounded-full hover:brightness-95 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DedicationPreviewModal;
