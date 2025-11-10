import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SectionWrapper from './components/SectionWrapper';
import ItemCard from './components/ItemCard';
import FlowerSelector from './components/FlowerSelector';
import DedicationPreviewModal from './components/DedicationPreviewModal';
import SummaryModal from './components/SummaryModal';
import { BouquetType, Flower, Foliage, SelectedFlower } from './types';
import { InfoIcon, LinkIcon, ShoppingCartIcon, TagIcon } from './components/Icons';

// FIX: Add mock data since data/mockData.ts content is not provided.
const bouquets: BouquetType[] = [
    { id: 'b1', name: 'Ramo de Rosas Rojas', price: 50, description: 'Clásico y elegante.', image: 'https://images.unsplash.com/photo-1533616688484-4b4a6932a3de?q=80&w=2592&auto=format&fit=crop' },
    { id: 'b2', name: 'Ramo Primaveral', price: 65, description: 'Lleno de colores vivos.', image: 'https://images.unsplash.com/photo-1555648293-63116a4a4ad7?q=80&w=2592&auto=format&fit=crop' },
    { id: 'b3', name: 'Ramo Silvestre', price: 45, description: 'Un toque rústico y natural.', image: 'https://images.unsplash.com/photo-1599057417246-382a33a5953c?q=80&w=2592&auto=format&fit=crop' },
];

const allFlowers: Flower[] = [
    { id: 'f1-red', name: 'Rosa', color: 'Roja', price: 3, image: 'https://cdn.shopify.com/s/files/1/0649/4083/4883/files/red-rose.png?v=1720722307', hex_color: '#FF0000', background_image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=3024&auto=format&fit=crop' },
    { id: 'f1-white', name: 'Rosa', color: 'Blanca', price: 3, image: 'https://cdn.shopify.com/s/files/1/0649/4083/4883/files/white-rose.png?v=1720722307', hex_color: '#FFFFFF', background_image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=3024&auto=format&fit=crop' },
    { id: 'f2-yellow', name: 'Tulipán', color: 'Amarillo', price: 2.5, image: 'https://cdn.shopify.com/s/files/1/0649/4083/4883/files/tulip.png?v=1720722307', hex_color: '#FFFF00', background_image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=3148&auto=format&fit=crop' },
    { id: 'f2-pink', name: 'Tulipán', color: 'Rosado', price: 2.5, image: 'https://cdn.shopify.com/s/files/1/0649/4083/4883/files/tulip-pink.png?v=1720722307', hex_color: '#FFC0CB', background_image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=3148&auto=format&fit=crop' },
    { id: 'f3-blue', name: 'Hortensia', color: 'Azul', price: 4, image: 'https://cdn.shopify.com/s/files/1/0649/4083/4883/files/hydrangea.png?v=1720722307', hex_color: '#0000FF', background_image: 'https://images.unsplash.com/photo-1620573950157-a40b15f5c35f?q=80&w=2940&auto=format&fit=crop' },
];

const allFoliage: Foliage[] = [
    { id: 'fol1', name: 'Eucalipto', price: 1.5, image: 'https://cdn.shopify.com/s/files/1/0649/4083/4883/files/eucalyptus.png?v=1720722307' },
    { id: 'fol2', name: 'Helecho de cuero', price: 1, image: 'https://cdn.shopify.com/s/files/1/0649/4083/4883/files/fern.png?v=1720722307' },
    { id: 'fol3', name: 'Pino', price: 1.2, image: 'https://cdn.shopify.com/s/files/1/0649/4083/4883/files/pine.png?v=1720722307' },
];

// FIX: Create the main App component to resolve module and rendering errors.
function App() {
  const [selectedBouquet, setSelectedBouquet] = useState<BouquetType | null>(null);
  const [selectedFlowers, setSelectedFlowers] = useState<Map<string, SelectedFlower>>(new Map());
  const [selectedFoliage, setSelectedFoliage] = useState<Foliage[]>([]);
  const [dedication, setDedication] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');

  const [openFlowerSelector, setOpenFlowerSelector] = useState<string | null>(null);
  const [isDedicationModalOpen, setIsDedicationModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const groupedFlowers = useMemo(() => {
    return allFlowers.reduce((acc, flower) => {
      if (!acc[flower.name]) {
        acc[flower.name] = [];
      }
      acc[flower.name].push(flower);
      return acc;
    }, {} as Record<string, Flower[]>);
  }, []);

  const handleFlowerQuantityChange = (flower: Flower, quantity: number) => {
    const newSelectedFlowers = new Map(selectedFlowers);
    if (quantity > 0) {
      newSelectedFlowers.set(flower.id, { item: flower, quantity });
    } else {
      newSelectedFlowers.delete(flower.id);
    }
    setSelectedFlowers(newSelectedFlowers);
  };
  
  const handleFoliageToggle = (foliageItem: Foliage) => {
    setSelectedFoliage(prev => 
      prev.some(f => f.id === foliageItem.id) 
        ? prev.filter(f => f.id !== foliageItem.id) 
        : [...prev, foliageItem]
    );
  };
  
  const toggleFlowerSelector = (flowerName: string) => {
    setOpenFlowerSelector(prev => prev === flowerName ? null : flowerName);
  };

  const totalPrice = useMemo(() => {
    let total = selectedBouquet?.price || 0;
    selectedFlowers.forEach(f => total += f.item.price * f.quantity);
    selectedFoliage.forEach(f => total += f.price);
    return total;
  }, [selectedBouquet, selectedFlowers, selectedFoliage]);

  const handleOpenSummary = () => {
    if (selectedBouquet && Array.from(selectedFlowers.values()).length > 0) {
      setIsSummaryModalOpen(true);
    } else {
      alert('Por favor, selecciona un tipo de ramo y al menos una flor.');
    }
  };

  const handleSuccess = () => {
    setIsSummaryModalOpen(false);
    setOrderSuccess(true);
    // Reset state
    setSelectedBouquet(null);
    setSelectedFlowers(new Map());
    setSelectedFoliage([]);
    setDedication('');
    setSpotifyLink('');
  }

  if (orderSuccess) {
    return (
      <div className="bg-[#1E212B] min-h-screen text-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold text-[#DCBBA0] mb-4">¡Gracias por tu pedido!</h1>
        <p className="text-lg text-gray-300">Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto.</p>
        <button onClick={() => setOrderSuccess(false)} className="mt-8 bg-[#DCBBA0] text-gray-800 font-bold py-3 px-6 rounded-lg hover:brightness-95 transition">
          Crear otro ramo
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#1E212B] min-h-screen text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-16">
          <SectionWrapper step="1" title="Elige un Estilo de Ramo" subtitle="Define la base de tu creación.">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
          
          <SectionWrapper step="2" title="Selecciona tus Flores" subtitle="El corazón de tu ramo. Elige tipos y colores.">
            <div className="space-y-4">
              {Object.entries(groupedFlowers).map(([name, varieties]) => (
                <FlowerSelector 
                  key={name}
                  flowerName={name}
                  varieties={varieties}
                  selectedFlowers={selectedFlowers}
                  onQuantityChange={handleFlowerQuantityChange}
                  isOpen={openFlowerSelector === name}
                  onToggle={() => toggleFlowerSelector(name)}
                />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper step="3" title="Añade Follaje" subtitle="El toque verde que complementa y da volumen.">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {allFoliage.map(foliage => (
                <ItemCard 
                  key={foliage.id}
                  item={foliage}
                  type="foliage"
                  isSelected={selectedFoliage.some(f => f.id === foliage.id)}
                  onToggle={() => handleFoliageToggle(foliage)}
                />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper step="4" title="Personaliza tu Mensaje" subtitle="Hazlo único con una dedicatoria y una canción.">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#2a2e3c] p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center gap-2">
                  <TagIcon className="w-6 h-6 text-[#DCBBA0]"/> Dedicatoria
                </h3>
                <textarea
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={4}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition"
                ></textarea>
                <button
                  onClick={() => setIsDedicationModalOpen(true)}
                  className="mt-3 text-sm font-semibold text-[#DCBBA0] hover:text-white transition flex items-center gap-1"
                >
                  <InfoIcon className="w-4 h-4" />
                  ¿Necesitas inspiración? Genera una con IA
                </button>
              </div>
              <div className="bg-[#2a2e3c] p-6 rounded-2xl border border-white/10">
                 <h3 className="text-xl font-bold text-gray-200 mb-3 flex items-center gap-2">
                   <LinkIcon className="w-6 h-6 text-[#DCBBA0]"/> Enlace de Spotify
                </h3>
                <input
                  type="url"
                  value={spotifyLink}
                  onChange={(e) => setSpotifyLink(e.target.value)}
                  placeholder="Pega el enlace de una canción o playlist"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition"
                />
              </div>
            </div>
          </SectionWrapper>

        </div>
      </main>

      <footer className="sticky bottom-0 bg-[#1E212B]/80 backdrop-blur-lg border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Precio Total Estimado</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">S/{totalPrice.toFixed(2)}</p>
          </div>
          <button 
            onClick={handleOpenSummary}
            disabled={!selectedBouquet || Array.from(selectedFlowers.values()).length === 0}
            className="flex items-center gap-3 bg-[#DCBBA0] text-gray-800 font-bold py-3 px-6 rounded-lg hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="hidden sm:inline">Revisar y Enviar</span>
            <span className="sm:hidden">Enviar</span>
          </button>
        </div>
      </footer>

      <DedicationPreviewModal
        isOpen={isDedicationModalOpen}
        onClose={() => setIsDedicationModalOpen(false)}
        onSave={(newDedication) => setDedication(newDedication)}
      />

      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={{
          bouquet: selectedBouquet,
          flowers: Array.from(selectedFlowers.values()),
          foliage: selectedFoliage,
          dedication,
          spotifyLink,
          totalPrice,
        }}
        apiUrl={import.meta.env.VITE_APPS_SCRIPT_URL}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default App;
