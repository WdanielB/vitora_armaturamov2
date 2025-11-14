import React from 'react';
import { BouquetType, Foliage, SelectedFlower } from '../types';
import { XIcon } from './Icons';

interface SummaryData {
    bouquet: BouquetType | null;
    flowers: SelectedFlower[];
    foliage: Foliage[];
    dedication: string;
    spotifyLink: string;
    totalPrice: number | null;
}

interface SummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: SummaryData;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, summary }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative bg-[#2a2e3c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition z-10">
                    <XIcon className="w-6 h-6" />
                </button>
                
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">Resumen de tu Ramo</h2>
                    <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2 text-sm text-gray-200">
                        {summary.bouquet && <p><b className="text-white">Ramo:</b> {summary.bouquet.name}</p>}
                        <div>
                            <b className="text-white">Flores:</b>
                            {summary.flowers.length > 0 ? (
                                <ul className="list-disc pl-5 text-gray-300">
                                    {summary.flowers.map(f => <li key={f.item.id}>{f.quantity}x {f.item.name} {f.item.color}</li>)}
                                </ul>
                            ) : <p className="text-gray-400 pl-5">Sin flores seleccionadas.</p>}
                        </div>
                        <div>
                            <b className="text-white">Follaje:</b>
                            {summary.foliage.length > 0 ? (
                                    <ul className="list-disc pl-5 text-gray-300">
                                    {summary.foliage.map(f => <li key={f.id}>{f.name}</li>)}
                                </ul>
                            ) : <p className="text-gray-400 pl-5">Sin follaje seleccionado.</p>}
                        </div>
                        {summary.dedication && <p><b className="text-white">Dedicatoria:</b> "{summary.dedication}"</p>}
                        {summary.spotifyLink && <p><b className="text-white">Spotify:</b> Enlace incluido</p>}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-700 text-right">
                        <p className="text-2xl font-bold text-gray-100">Total: <span className="text-[#DCBBA0]">S/{summary.totalPrice?.toFixed(2)}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryModal;