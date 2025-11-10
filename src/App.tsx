import React, { useState, useMemo } from 'react';
// FIX: Use GoogleGenAI from @google/genai as per the coding guidelines.
import { GoogleGenAI, Type } from "@google/genai";

import { bouquets, flowersData, foliageOptions } from './data/mockData';
import { BouquetType, Flower, Foliage, SelectedFlower } from './types';

import Header from './components/Header';
import SectionWrapper from './components/SectionWrapper';
import ItemCard from './components/ItemCard';
import FlowerSelector from './components/FlowerSelector';
import DedicationPreviewModal from './components/DedicationPreviewModal';
import SummaryModal from './components/SummaryModal';
import { LinkIcon, ShoppingCartIcon, SpotifyIcon } from './components/Icons';

// Group flowers by name for easier rendering
const groupedFlowers: Record<string, Flower[]> = flowersData.reduce((acc, flower) => {
    if (!acc[flower.name]) {
        acc[flower.name] = [];
    }
    acc[flower.name].push(flower);
    return acc;
}, {} as Record<string, Flower[]>);


const App: React.FC = () => {
    // State management for bouquet selections
    const [selectedBouquet, setSelectedBouquet] = useState<BouquetType | null>(bouquets[0]);
    const [selectedFlowers, setSelectedFlowers] = useState<Map<string, SelectedFlower>>(new Map());
    const [selectedFoliage, setSelectedFoliage] = useState<Set<string>>(new Set());
    const [openFlowerAccordion, setOpenFlowerAccordion] = useState<string | null>(Object.keys(groupedFlowers)[0] || null);

    // State for dedication, Spotify, and modals
    const [dedication, setDedication] = useState('');
    const [spotifyLink, setSpotifyLink] = useState('');
    const [isDedicationModalOpen, setIsDedicationModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

    // State for AI-powered suggestions
    const [dedicationSuggestions, setDedicationSuggestions] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    // State for order submission status
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);

    // Handler for generating dedication suggestions using Gemini API
    const handleGenerateSuggestions = async () => {
        setIsGenerating(true);
        setGenerationError(null);
        setDedicationSuggestions([]);

        if (!selectedBouquet) {
            setGenerationError("Por favor, selecciona un tipo de ramo primero.");
            setIsGenerating(false);
            return;
        }

        const flowerList = Array.from(selectedFlowers.values())
            .filter(f => f.quantity > 0)
            .map(f => `${f.quantity} ${f.item.name} ${f.item.color}`)
            .join(', ');

        const foliageList = Array.from(selectedFoliage)
            .map(foliageId => foliageOptions.find(f => f.id === foliageId)?.name)
            .filter(Boolean)
            .join(', ');

        const prompt = `
            Eres un asistente experto en escribir dedicatorias para ramos de flores.
            Basado en la siguiente selección, genera 3 dedicatorias cortas y emotivas (máximo 25 palabras cada una).
            El tono debe ser romántico, amigable o de agradecimiento, según lo que sugieran las flores.
            
            - Tipo de Ramo: ${selectedBouquet.name} (${selectedBouquet.description})
            - Flores seleccionadas: ${flowerList || 'Ninguna'}
            - Follaje seleccionado: ${foliageList || 'Ninguno'}
            
            Las dedicatorias deben ser únicas y creativas. No incluyas saludos como "Querida/o" ni despedidas.
        `;

        try {
            // FIX: Initialize the GoogleGenAI client as per guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // FIX: Use ai.models.generateContent with responseSchema for structured JSON output.
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    dedicatorias: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.STRING,
                        description: "Una dedicatoria corta y emotiva."
                      }
                    }
                  }
                }
              }
            });
            
            // FIX: Access the response text directly via the .text property.
            const textResponse = response.text.trim();
            const jsonResponse = JSON.parse(textResponse);
            
            if (jsonResponse.dedicatorias && Array.isArray(jsonResponse.dedicatorias)) {
                setDedicationSuggestions(jsonResponse.dedicatorias.slice(0, 3)); // Ensure only 3 are shown
            } else {
                throw new Error("La respuesta de la IA no tiene el formato esperado.");
            }

        } catch (error) {
            console.error("Error generating suggestions:", error);
            setGenerationError("No se pudieron generar sugerencias. Inténtalo de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Handler to update flower quantities
    const handleFlowerQuantityChange = (flower: Flower, quantity: number) => {
        setSelectedFlowers(prev => {
            const newMap = new Map(prev);
            if (quantity > 0) {
                newMap.set(flower.id, { item: flower, quantity });
            } else {
                newMap.delete(flower.id);
            }
            return newMap;
        });
    };

    // Handler to toggle foliage selection
    const handleFoliageToggle = (foliageId: string) => {
        setSelectedFoliage(prev => {
            const newSet = new Set(prev);
            if (newSet.has(foliageId)) {
                newSet.delete(foliageId);
            } else {
                newSet.add(foliageId);
            }
            return newSet;
        });
    };
    
    // Handler to toggle flower accordion visibility
    const handleToggleAccordion = (flowerName: string) => {
        setOpenFlowerAccordion(prev => (prev === flowerName ? null : flowerName));
    };

    // Memoized calculation for total price
    const totalPrice = useMemo(() => {
        let total = selectedBouquet?.price ?? 0;
        selectedFlowers.forEach(flower => {
            total += flower.item.price * flower.quantity;
        });
        selectedFoliage.forEach(foliageId => {
            const foliage = foliageOptions.find(f => f.id === foliageId);
            if (foliage) total += foliage.price;
        });
        return total;
    }, [selectedBouquet, selectedFlowers, selectedFoliage]);
    
    // Memoized calculation for total items in the cart
    const totalItems = useMemo(() => {
        const flowerCount = Array.from(selectedFlowers.values()).reduce((sum, f) => sum + f.quantity, 0);
        const foliageCount = selectedFoliage.size;
        return flowerCount + foliageCount + (selectedBouquet ? 1 : 0);
    }, [selectedBouquet, selectedFlowers, selectedFoliage]);
    
    // Handler for successful order submission
    const handleSuccess = () => {
        setIsSummaryModalOpen(false);
        setIsOrderSuccess(true);
    };
    
    // Success screen after order submission
    if (isOrderSuccess) {
        return (
            <div className="bg-[#1E212B] min-h-screen flex items-center justify-center text-center p-4">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-4">¡Gracias por tu pedido!</h2>
                    <p className="text-lg text-gray-300">Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto.</p>
                    <button onClick={() => window.location.reload()} className="mt-8 bg-[#DCBBA0] text-gray-800 font-bold py-3 px-6 rounded-lg hover:brightness-95 transition">
                        Crear otro Ramo
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#1E212B] text-white min-h-screen font-sans">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Step 1: Bouquet */}
                        <SectionWrapper step="1" title="Elige tu Ramo" subtitle="Selecciona el estilo base para tu arreglo.">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {bouquets.map(bouquet => (
                                    <ItemCard
                                        key={bouquet.id}
                                        item={bouquet}
                                        type="bouquet"
                                        isSelected={selectedBouquet?.id === bouquet.id}
                                        onSelect={() => setSelectedBouquet(bouquet)}
                                    />
                                ))}
                            </div>
                        </SectionWrapper>
                        
                        {/* Step 2: Flowers */}
                        <SectionWrapper step="2" title="Añade Flores" subtitle="Elige los colores y cantidades de tus flores favoritas.">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(groupedFlowers).map(([name, varieties]) => (
                                    <FlowerSelector
                                        key={name}
                                        flowerName={name}
                                        varieties={varieties}
                                        selectedFlowers={selectedFlowers}
                                        onQuantityChange={handleFlowerQuantityChange}
                                        isOpen={openFlowerAccordion === name}
                                        onToggle={() => handleToggleAccordion(name)}
                                    />
                                ))}
                           </div>
                        </SectionWrapper>
                        
                        {/* Step 3: Foliage */}
                        <SectionWrapper step="3" title="Agrega Follaje" subtitle="Completa tu ramo con un toque de verdor.">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                               {foliageOptions.map(foliage => (
                                    <ItemCard
                                        key={foliage.id}
                                        item={foliage}
                                        type="foliage"
                                        isSelected={selectedFoliage.has(foliage.id)}
                                        onToggle={() => handleFoliageToggle(foliage.id)}
                                    />
                               ))}
                            </div>
                        </SectionWrapper>
                        
                         {/* Step 4 & 5: Dedication & Spotify */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SectionWrapper step="4" title="Dedicatoria" subtitle="Escribe un mensaje especial.">
                                <div className="relative">
                                    <textarea
                                        value={dedication}
                                        onChange={e => setDedication(e.target.value)}
                                        placeholder="Escribe tu dedicatoria aquí..."
                                        rows={4}
                                        className="w-full bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg p-3 focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition"
                                    ></textarea>
                                    <button
                                        onClick={() => setIsDedicationModalOpen(true)}
                                        className="absolute bottom-2 right-2 bg-[#DCBBA0] text-gray-800 text-xs font-bold py-1 px-3 rounded-md hover:brightness-95 transition"
                                    >
                                        Vista Previa / IA
                                    </button>
                                </div>
                            </SectionWrapper>
                            <SectionWrapper step="5" title="Canción" subtitle="Dedica una canción de Spotify.">
                                <div className="relative">
                                    <SpotifyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={spotifyLink}
                                        onChange={e => setSpotifyLink(e.target.value)}
                                        placeholder="Pega el enlace de Spotify aquí"
                                        className="w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition"
                                    />
                                    <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                            </SectionWrapper>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-28 bg-[#2a2e3c] border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <h3 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3"><ShoppingCartIcon className="w-6 h-6"/>Resumen del Pedido</h3>
                            
                            <div className="space-y-3 text-sm max-h-60 overflow-y-auto pr-2">
                               {selectedBouquet && <div className="flex justify-between items-center"><span className="text-gray-300">Ramo: {selectedBouquet.name}</span> <span className="font-semibold text-gray-200">S/{selectedBouquet.price.toFixed(2)}</span></div>}
                               
                               {Array.from(selectedFlowers.values()).map(({ item, quantity }) => (
                                   <div key={item.id} className="flex justify-between items-center">
                                       <span className="text-gray-300">{quantity}x {item.name} {item.color}</span>
                                       <span className="font-semibold text-gray-200">S/{(item.price * quantity).toFixed(2)}</span>
                                   </div>
                               ))}
                               
                               {Array.from(selectedFoliage).map(id => {
                                   const foliage = foliageOptions.find(f => f.id === id);
                                   return foliage ? (
                                       <div key={id} className="flex justify-between items-center">
                                           <span className="text-gray-300">{foliage.name}</span>
                                           <span className="font-semibold text-gray-200">S/{foliage.price.toFixed(2)}</span>
                                       </div>
                                   ) : null;
                               })}
                               
                               {totalItems === 0 && <p className="text-gray-400 text-center py-4">Tu carrito está vacío.</p>}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-bold text-gray-200">Total</span>
                                    <span className="font-bold text-2xl text-[#DCBBA0]">S/{totalPrice.toFixed(2)}</span>
                                </div>
                                <button 
                                    onClick={() => setIsSummaryModalOpen(true)} 
                                    disabled={totalItems === 0 || !selectedBouquet} 
                                    className="w-full mt-6 bg-[#DCBBA0] text-gray-800 font-bold py-3 rounded-lg hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continuar
                                </button>
                                {(!selectedBouquet || totalItems === 0) && <p className="text-xs text-center text-gray-400 mt-2">Selecciona un ramo para continuar.</p>}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <DedicationPreviewModal 
                isOpen={isDedicationModalOpen}
                onClose={() => setIsDedicationModalOpen(false)}
                dedication={dedication}
                onDedicationChange={setDedication}
                onGenerate={handleGenerateSuggestions}
                suggestions={dedicationSuggestions}
                isLoading={isGenerating}
                error={generationError}
            />
            
            <SummaryModal 
                isOpen={isSummaryModalOpen}
                onClose={() => setIsSummaryModalOpen(false)}
                summary={{
                    bouquet: selectedBouquet,
                    flowers: Array.from(selectedFlowers.values()),
                    foliage: foliageOptions.filter(f => selectedFoliage.has(f.id)),
                    dedication,
                    spotifyLink,
                    totalPrice
                }}
                apiUrl={import.meta.env.VITE_APPS_SCRIPT_URL}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default App;
