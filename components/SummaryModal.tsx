
import React, { useState } from 'react';
import { BouquetType, Flower, Foliage, SelectedFlower } from '../types';
import { CalendarIcon, PhoneIcon, XIcon, CheckCircleIcon } from './Icons';

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
    const [phone, setPhone] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to a backend or via WhatsApp API
        console.log("Pedido enviado:", {
            ...summary,
            phone,
            deliveryDate
        });
        setSubmitted(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative bg-[#2a2e3c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition z-10">
                    <XIcon className="w-6 h-6" />
                </button>
                
                {submitted ? (
                    <div className="p-8 text-center flex flex-col items-center">
                        <CheckCircleIcon className="w-24 h-24 text-green-500 mb-4"/>
                        <h2 className="text-2xl font-bold text-gray-100 mb-2">¡Solicitud Enviada!</h2>
                        <p className="text-gray-300 mb-6">Gracias por tu pedido. Nos pondremos en contacto contigo pronto para confirmar los detalles.</p>
                        <button onClick={onClose} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors">
                            Entendido
                        </button>
                    </div>
                ) : (
                <>
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">Resumen de tu Ramo</h2>
                        <div className="max-h-[30vh] overflow-y-auto space-y-4 pr-2 text-sm text-gray-200">
                            {summary.bouquet && <p><b className="text-white">Ramo:</b> {summary.bouquet.name} - ${summary.bouquet.price.toFixed(2)}</p>}
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
                           <p className="text-2xl font-bold text-gray-100">Total: <span className="text-[#DCBBA0]">${summary.totalPrice?.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 bg-[#1E212B] rounded-b-2xl">
                        <h3 className="text-xl font-semibold mb-4 text-gray-200">Completa tu solicitud</h3>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Número de Teléfono</label>
                                <div className="relative mt-1">
                                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-300">Día de Entrega</label>
                                <div className="relative mt-1">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="date" id="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition" style={{colorScheme: 'dark'}}/>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="w-full mt-6 bg-[#DCBBA0] text-gray-800 font-bold py-3 rounded-lg hover:brightness-95 transition">
                            Enviar Solicitud
                        </button>
                    </form>
                </>
                )}
            </div>
        </div>
    );
};

export default SummaryModal;