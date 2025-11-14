import React, { useState } from 'react';
import { BouquetType, Foliage, SelectedFlower } from '../types';
import { CalendarIcon, PhoneIcon, XIcon, UserIcon } from './Icons';

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
    apiUrl: string;
    onSuccess: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, summary, apiUrl, onSuccess }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);

        const flores_seleccionadas_array = summary.flowers.map(f => ({
            cantidad: f.quantity,
            color: f.item.color,
            numero: f.item.name,
            precio_unitario: f.item.price,
        }));

        const follaje_seleccionado_array = summary.foliage.map(f => ({
            cantidad: 1,
            color: 'N/A',
            numero: f.name,
            precio_unitario: f.price,
        }));

        const payload = {
            name_cliente: name,
            telefono: phone,
            fecha_entrega: deliveryDate,
            ramo_seleccion: summary.bouquet ? summary.bouquet.name : 'N/A',
            flores_seleccionadas: JSON.stringify(flores_seleccionadas_array),
            follaje_seleccion: JSON.stringify(follaje_seleccionado_array),
            dedicatoria: summary.dedication,
            spotify_link: summary.spotifyLink,
            precio_total: summary.totalPrice,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                redirect: "follow",
                body: JSON.stringify(payload),
                 headers: {
                  "Content-Type": "text/plain;charset=utf-8",
                },
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.status === 'success') {
                onSuccess(); // Call the parent success handler
            } else {
                throw new Error(result.message || 'El servidor devolvió un error.');
            }

        } catch (error) {
            console.error("Error submitting request:", error);
            setSubmitError("Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative bg-[#2a2e3c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition z-10">
                    <XIcon className="w-6 h-6" />
                </button>
                
                <>
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">Resumen de tu Ramo</h2>
                        <div className="max-h-[30vh] overflow-y-auto space-y-4 pr-2 text-sm text-gray-200">
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
                    <form onSubmit={handleSubmit} className="p-8 bg-[#1E212B] rounded-b-2xl">
                        <h3 className="text-xl font-semibold mb-4 text-gray-200">Completa tu solicitud</h3>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombres</label>
                                <div className="relative mt-1">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition" />
                                </div>
                            </div>
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
                        {submitError && <p className="text-red-400 text-sm mt-4 text-center">{submitError}</p>}
                        <button type="submit" disabled={submitting} className="w-full mt-6 bg-[#DCBBA0] text-gray-800 font-bold py-3 rounded-lg hover:brightness-95 transition disabled:opacity-50">
                            {submitting ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </form>
                </>
            </div>
        </div>
    );
};

export default SummaryModal;