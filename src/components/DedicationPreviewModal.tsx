
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
            <div className="relative w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-3 -right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5 text-white hover:bg-white/30 transition z-20">
                    <XIcon className="w-6 h-6" />
                </button>
                
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                    <img 
                        src="https://cdn.shopify.com/s/files/1/0649/4083/4883/files/imagen_2025-11-10_133538983.png?v=1762799742" 
                        alt="Vista previa de dedicatoria" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 p-8 flex flex-col justify-between bg-black/30">
                        <p className="text-white text-lg italic whitespace-pre-wrap leading-relaxed shadow-text">
                            {dedication || "Aquí aparecerá tu mensaje especial."}
                        </p>
                        
                        {spotifyLink && (
                            <div className="mt-6 flex items-center gap-4 text-white">
                                <SpotifyIcon className="w-10 h-10 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold shadow-text">Una canción para ti</p>
                                    <p className="text-xs opacity-80 shadow-text">Escanea el código para escucharla</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DedicationPreviewModal;
