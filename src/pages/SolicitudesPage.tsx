
import React, { useState, useEffect } from 'react';
import { Solicitud } from '../types';
import Header from '../components/Header';
import BouquetDetailsCell from '../components/BouquetDetailsCell';
import { UserIcon, PhoneIcon, CalendarIcon, SpotifyIcon, TagIcon } from '../components/Icons';

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const SolicitudesPage: React.FC = () => {
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!APPS_SCRIPT_URL) {
            setError('La URL de la API no está configurada.');
            setLoading(false);
            return;
        }

        const fetchSolicitudes = async () => {
            try {
                const response = await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    redirect: 'follow',
                    body: JSON.stringify({ action: 'getSolicitudes' }),
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error de red: ${response.status}`);
                }
                const data = await response.json();

                if (data.status === 'error') {
                    throw new Error(`Error del script: ${data.message}`);
                }
                
                setSolicitudes(data.solicitudes || []);
            } catch (e: any) {
                console.error("Failed to fetch solicitudes:", e);
                setError(`No se pudieron cargar las solicitudes. Verifica que la acción "getSolicitudes" esté implementada en tu Google Apps Script. Error: ${e.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchSolicitudes();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
            return new Date(dateString).toLocaleDateString('es-ES', options);
        } catch(e) {
            return dateString;
        }
    };
    
    const formatDeliveryDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const [year, month, day] = dateString.split('-');
            if (!year || !month || !day) return dateString;
            return `${day}/${month}/${year}`;
        } catch (e) {
            return dateString;
        }
    }

    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-8">Panel de Solicitudes</h1>

                {loading && <p className="text-center text-lg">Cargando solicitudes...</p>}
                {error && <p className="text-center text-lg text-red-400 p-4 bg-red-900/20 rounded-lg">{error}</p>}
                
                {!loading && !error && (
                     <div className="bg-[#2a2e3c]/80 border border-white/10 rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="text-xs text-[#DCBBA0] uppercase bg-gray-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Timestamp</th>
                                        <th scope="col" className="px-6 py-3">Cliente</th>
                                        <th scope="col" className="px-6 py-3">Entrega</th>
                                        <th scope="col" className="px-6 py-3">Detalles del Ramo</th>
                                        <th scope="col" className="px-6 py-3">Extras</th>
                                        <th scope="col" className="px-6 py-3 text-right">Precio Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitudes.length > 0 ? solicitudes.map((solicitud, index) => (
                                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(solicitud.timestamp)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 font-semibold text-white"><UserIcon className="w-4 h-4 text-gray-400"/> {solicitud.name_cliente}</div>
                                                <div className="flex items-center gap-2 text-gray-400 mt-1"><PhoneIcon className="w-4 h-4"/> {solicitud.telefono}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 font-semibold"><CalendarIcon className="w-4 h-4 text-gray-400"/> {formatDeliveryDate(solicitud.fecha_entrega)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <BouquetDetailsCell 
                                                    ramoName={solicitud.ramo_seleccionado}
                                                    floresData={solicitud.flores_seleccionadas}
                                                    follajeData={solicitud.follaje_seleccionado}
                                                />
                                            </td>
                                            <td className="px-6 py-4 max-w-xs break-words">
                                                {solicitud.dedicatoria && <p className="italic">"{solicitud.dedicatoria}"</p>}
                                                {solicitud.spotify_link && (
                                                    <a href={solicitud.spotify_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 text-green-400 hover:underline">
                                                        <SpotifyIcon className="w-4 h-4" /> Ver en Spotify
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-lg text-white">
                                                <div className="flex items-center justify-end gap-1">
                                                   <TagIcon className="w-4 h-4 text-[#DCBBA0]"/> S/{(solicitud.precio_total || 0).toFixed(2)}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-gray-400">No se encontraron solicitudes.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SolicitudesPage;
