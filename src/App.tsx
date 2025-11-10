import React, { useState, useMemo, useEffect } from 'react';
import { BouquetType, Flower, Foliage, SelectedFlower } from './types';
import Header from './components/Header';
import SectionWrapper from './components/SectionWrapper';
import ItemCard from './components/ItemCard';
import DedicationPreviewModal from './components/DedicationPreviewModal';
import SummaryModal from './components/SummaryModal';
import { SpotifyIcon, LinkIcon, InfoIcon, ShoppingCartIcon, TagIcon, CheckCircleIcon } from './components/Icons';
import FlowerSelector from './components/FlowerSelector';

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const App: React.FC = () => {
    // Data states
    const [bouquetsData, setBouquetsData] = useState<BouquetType[]>([]);
    const [flowersData, setFlowersData] = useState<Flower[]>([]);
    const [foliageData, setFoliageData] = useState<Foliage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // App logic states
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedBouquet, setSelectedBouquet] = useState<BouquetType | null>(null);
    const [selectedFlowers, setSelectedFlowers] = useState<Map<string, SelectedFlower>>(new Map());
    const [selectedFoliage, setSelectedFoliage] = useState<Map<string, Foliage>>(new Map());
    const [dedication, setDedication] = useState('');
    const [spotifyLink, setSpotifyLink] = useState('');
    const [totalPrice, setTotalPrice] = useState<number | null>(null);
    const [openFlower, setOpenFlower] = useState<string | null>(null);
    const [isDedicationModalOpen, setDedicationModalOpen] = useState(false);
    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    useEffect(() => {
        if (!APPS_SCRIPT_URL) {
            setError('La URL de la API no está configurada. Asegúrate de configurar la variable de entorno VITE_APPS_SCRIPT_URL.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    redirect: 'follow',
                    body: JSON.stringify({ action: 'getData' }),
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

                setBouquetsData(data.bouquetsData || []);
                setFlowersData(data.flowersData || []);
                setFoliageData(data.foliageData || []);
            } catch (e) {
                console.error("Failed to fetch data:", e);
                setError('No se pudieron cargar los productos. Asegúrate de que la URL del Apps Script es correcta y está implementada correctamente.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const resetState = () => {
        setCurrentStep(1);
        setSelectedBouquet(null);
        setSelectedFlowers(new Map());
        setSelectedFoliage(new Map());
        setDedication('');
        setSpotifyLink('');
        setTotalPrice(null);
        setOpenFlower(null);
        setDedicationModalOpen(false);
        setSummaryModalOpen(false);
        setSubmissionSuccess(false);
    };

    const handleSubmissionSuccess = () => {
        setSummaryModalOpen(false);
        setSubmissionSuccess(true);
    };
    
    const groupedFlowers = useMemo(() => {
        return flowersData.reduce((acc, flower) => {
            const key = flower.name;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(flower);
            return acc;
        }, {} as Record<string, Flower[]>);
    }, [flowersData]);

    const handleToggleFlower = (name: string) => {
        setOpenFlower(prev => (prev === name ? null : name));
    };

    const handleSelectBouquet = (bouquet: BouquetType) => {
        setSelectedBouquet(bouquet);
        setTotalPrice(null);
    };

    const handleFlowerQuantityChange = (flower: Flower, quantity: number) => {
        const newSelectedFlowers = new Map(selectedFlowers);
        if (quantity > 0) {
            newSelectedFlowers.set(flower.id, { item: flower, quantity });
        } else {
            newSelectedFlowers.delete(flower.id);
        }
        setSelectedFlowers(newSelectedFlowers);
        setTotalPrice(null);
    };

    const handleToggleFoliage = (foliage: Foliage) => {
        const newSelectedFoliage = new Map(selectedFoliage);
        if (newSelectedFoliage.has(foliage.id)) {
            newSelectedFoliage.delete(foliage.id);
        } else {
            if (newSelectedFoliage.size < 2) {
                newSelectedFoliage.set(foliage.id, foliage);
            } else {
                alert("Puedes seleccionar un máximo de 2 tipos de follaje.");
            }
        }
        setSelectedFoliage(newSelectedFoliage);
        setTotalPrice(null);
    };
    
    const calculateTotalPrice = () => {
        if (!selectedBouquet) {
            alert("Por favor, selecciona un tipo de ramo para poder cotizar.");
            return;
        }
        let total = selectedBouquet.price;
        selectedFlowers.forEach(flower => {
            total += flower.item.price * flower.quantity;
        });
        selectedFoliage.forEach(foliage => {
            total += foliage.price;
        });
        setTotalPrice(total);
    };

    const nextStep = () => {
        if (currentStep === 1 && !selectedBouquet) {
            alert("Por favor, selecciona un tipo de ramo para continuar.");
            return;
        }
        window.scrollTo(0, 0);
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        window.scrollTo(0, 0);
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const isReadyForQuote = !!selectedBouquet;
    const isReadyForRequest = totalPrice !== null;

    const summaryData = useMemo(() => ({
      bouquet: selectedBouquet,
      flowers: Array.from(selectedFlowers.values()),
      foliage: Array.from(selectedFoliage.values()),
      dedication,
      spotifyLink,
      totalPrice
    }), [selectedBouquet, selectedFlowers, selectedFoliage, dedication, spotifyLink, totalPrice]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-xl font-semibold">Cargando productos...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-xl text-red-400 p-4 text-center">{error}</div>;
    }

    if (submissionSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <CheckCircleIcon className="w-24 h-24 text-green-400 mb-6"/>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3">Solicitud en Proceso</h1>
                <p className="text-lg text-gray-300 mb-8 max-w-md">Gracias por tu pedido. Nos pondremos en contacto contigo a la brevedad para coordinar los detalles de la entrega y el pago.</p>
                <button 
                    onClick={resetState}
                    className="px-8 py-3 rounded-full font-bold text-gray-800 bg-[#DCBBA0] shadow-md hover:brightness-95 transition"
                >
                    Hacer Nueva Solicitud
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
                <div className="space-y-16">
                    {currentStep === 1 && (
                        <SectionWrapper step="1" title="Elige el tipo de ramo" subtitle="Este paso es obligatorio.">
                            <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                                {bouquetsData.map(bouquet => (
                                    <ItemCard 
                                        key={bouquet.id} 
                                        item={bouquet}
                                        isSelected={selectedBouquet?.id === bouquet.id}
                                        onSelect={() => handleSelectBouquet(bouquet)}
                                        type="bouquet"
                                    />
                                ))}
                            </div>
                        </SectionWrapper>
                    )}
                    
                    {currentStep === 2 && (
                       <SectionWrapper step="2" title="Arma tu Ramo" subtitle="Elige las flores y el follaje que más te gusten.">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-300">Selecciona las flores</h3>
                                <div className="space-y-4">
                                    {Object.entries(groupedFlowers).map(([name, varieties]) => (
                                        <FlowerSelector
                                            key={name}
                                            flowerName={name}
                                            varieties={varieties}
                                            selectedFlowers={selectedFlowers}
                                            onQuantityChange={handleFlowerQuantityChange}
                                            isOpen={openFlower === name}
                                            onToggle={() => handleToggleFlower(name)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mt-16">
                               <h3 className="text-xl font-semibold mb-4 text-gray-300">Añade follaje</h3>
                               <p className="text-sm text-gray-400 mb-6">Selecciona hasta 2 tipos para complementar tu ramo.</p>
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                    {foliageData.map(foliage => (
                                        <ItemCard
                                            key={foliage.id}
                                            item={foliage}
                                            isSelected={selectedFoliage.has(foliage.id)}
                                            onToggle={() => handleToggleFoliage(foliage)}
                                            type="foliage"
                                        />
                                    ))}
                                </div>
                            </div>
                        </SectionWrapper>
                    )}

                    {currentStep === 3 && (
                        <SectionWrapper step="3" title="Detalles finales" subtitle="Añade un toque personal a tu regalo. (Opcional)">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#2a2e3c]/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/20 shadow-lg">
                                <div>
                                    <label htmlFor="dedication" className="block text-lg font-semibold text-gray-200 mb-2">Dedicatoria</label>
                                    <textarea
                                        id="dedication"
                                        rows={4}
                                        className="w-full p-3 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition"
                                        placeholder="Escribe aquí tu mensaje especial..."
                                        value={dedication}
                                        onChange={(e) => setDedication(e.target.value)}
                                    />
                                    <button onClick={() => setDedicationModalOpen(true)} className="mt-2 text-sm text-[#DCBBA0] hover:text-[#e4c9ac] font-medium flex items-center gap-1">
                                        <InfoIcon className="w-4 h-4" />
                                        <span>Así se verá la dedicatoria</span>
                                    </button>
                                </div>
                                <div>
                                    <label htmlFor="spotify" className="block text-lg font-semibold text-gray-200 mb-2">Canción de Spotify</label>
                                    <div className="relative">
                                        <SpotifyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            id="spotify"
                                            className="w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                                            placeholder="Pega el enlace de la canción aquí..."
                                            value={spotifyLink}
                                            onChange={(e) => setSpotifyLink(e.target.value)}
                                        />
                                    </div>
                                    <a href="https://pira.cz/spotify/image.php" target="_blank" rel="noopener noreferrer" className="mt-2 text-sm text-green-400 hover:text-green-300 font-medium flex items-center gap-1">
                                        <LinkIcon className="w-4 h-4"/>
                                        <span>¿Cómo obtengo el código? (Abre en nueva pestaña)</span>
                                    </a>
                                </div>
                            </div>
                        </SectionWrapper>
                    )}
                </div>
            </main>
            
            <div className="fixed bottom-0 left-0 right-0 mt-16 py-4 bg-[#1E212B]/80 backdrop-blur-md border-t border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                    <div>
                        {currentStep > 1 && (
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 rounded-full font-semibold text-gray-200 bg-gray-700 hover:bg-gray-600 transition"
                            >
                                Atrás
                            </button>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 flex-grow">
                        {currentStep < 3 ? (
                            <button
                                onClick={nextStep}
                                disabled={currentStep === 1 && !selectedBouquet}
                                className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-gray-800 bg-[#DCBBA0] shadow-md hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <>
                                {totalPrice !== null && (
                                    <div className="text-xl sm:text-2xl font-bold text-white bg-gray-900/50 px-4 py-2 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 order-first sm:order-none w-full sm:w-auto justify-center">
                                        <TagIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCBBA0]" />
                                        <span>Total: S/{totalPrice.toFixed(2)}</span>
                                    </div>
                                )}
                                <button
                                    onClick={calculateTotalPrice}
                                    disabled={!isReadyForQuote}
                                    className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                                        isReadyForQuote 
                                        ? 'bg-[#DCBBA0] text-gray-800 font-bold shadow-lg hover:brightness-95' 
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingCartIcon className="w-5 h-5"/>
                                    Cotizar Ramo
                                </button>
                                <button
                                    onClick={() => setSummaryModalOpen(true)}
                                    disabled={!isReadyForRequest}
                                    className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                                        isReadyForRequest 
                                        ? 'bg-[#DCBBA0] text-gray-800 font-bold shadow-lg hover:brightness-95'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    Solicitar Ramo
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <DedicationPreviewModal 
                isOpen={isDedicationModalOpen}
                onClose={() => setDedicationModalOpen(false)}
                dedication={dedication}
                spotifyLink={spotifyLink}
            />
            
            <SummaryModal
                isOpen={isSummaryModalOpen}
                onClose={() => setSummaryModalOpen(false)}
                summary={summaryData}
                apiUrl={APPS_SCRIPT_URL}
                onSuccess={handleSubmissionSuccess}
            />
        </div>
    );
};

export default App;