import React, { useState, useEffect } from 'react';
import { Flower, SelectedFlower } from '../types';
import { PlusIcon, MinusIcon } from './Icons';

interface FlowerSelectorProps {
  flowerName: string;
  varieties: Flower[];
  selectedFlowers: Map<string, SelectedFlower>;
  onQuantityChange: (flower: Flower, quantity: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

// Helper to determine if a hex color is light or dark
const isColorLight = (hexColor: string): boolean => {
    const color = hexColor.substring(1); // strip #
    const rgb = parseInt(color, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return luma > 128;
};


const FlowerSelector: React.FC<FlowerSelectorProps> = ({ flowerName, varieties, selectedFlowers, onQuantityChange, isOpen, onToggle }) => {
  const findInitialSelected = () => {
    for (const variety of varieties) {
        if (selectedFlowers.has(variety.id) && (selectedFlowers.get(variety.id)?.quantity ?? 0) > 0) {
            return variety;
        }
    }
    return varieties[0];
  };

  const [activeVariety, setActiveVariety] = useState<Flower>(varieties[0]);
  
  // This effect now ONLY runs when the accordion is opened, preventing the bug.
  useEffect(() => {
    if (isOpen && varieties.length > 0) {
        setActiveVariety(findInitialSelected());
    }
  }, [isOpen, varieties]);


  if (!activeVariety) {
    return null; // or a loading/placeholder state
  }

  const quantity = selectedFlowers.get(activeVariety.id)?.quantity || 0;

  const handleColorClick = (variety: Flower) => {
    setActiveVariety(variety);
  };

  const increment = () => {
    onQuantityChange(activeVariety, quantity + 1);
  };

  const decrement = () => {
    if (quantity > 0) {
      onQuantityChange(activeVariety, quantity - 1);
    }
  };
  
  const totalInType = varieties.reduce((sum, v) => sum + (selectedFlowers.get(v.id)?.quantity || 0), 0);
  
  const backgroundImageURL = varieties[0]?.background_image;

  return (
    <div className="relative border border-white/10 rounded-2xl transition-all duration-300 overflow-hidden">
        {isOpen && backgroundImageURL && (
            <div 
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{ backgroundImage: `url(${backgroundImageURL})` }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            </div>
        )}

        <div className={`relative transition-colors duration-300 ${isOpen ? 'bg-transparent' : 'bg-[#2a2e3c]/80'}`}>
            <button onClick={onToggle} className="w-full p-4 flex items-center gap-4 text-left">
                <div className="relative">
                    <img src={varieties[0]?.image} alt={flowerName} className="w-10 h-10 rounded-full object-cover border-2 border-white/50 shadow-sm" />
                    {totalInType > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#2a2e3c]">
                          {totalInType}
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-white">{flowerName}S</h3>
                    <p className="text-xs text-white/80 uppercase -mt-1">Colores Disponibles</p>
                </div>
            </button>

            <div className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-4 pb-4">
                        <div className="min-h-[120px] sm:min-h-[150px] flex flex-col justify-end space-y-4">
                            <div className="flex items-center gap-3 flex-wrap justify-center">
                                {varieties.map(variety => {
                                    const varietyQuantity = selectedFlowers.get(variety.id)?.quantity || 0;
                                    const isWhite = variety.hex_color.toUpperCase() === '#FFFFFF';
                                    const textColor = isColorLight(variety.hex_color) ? 'text-black' : 'text-white';
                                    return (
                                        <button
                                          key={variety.id}
                                          onClick={() => handleColorClick(variety)}
                                          className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 flex-shrink-0 focus:outline-none ${activeVariety.id === variety.id ? 'ring-4 ring-offset-2 ring-offset-transparent ring-white' : 'hover:scale-110'} ${isWhite ? 'border border-gray-400' : ''}`}
                                          style={{ backgroundColor: variety.hex_color }}
                                          aria-label={`Seleccionar ${flowerName} color ${variety.color}`}
                                        >
                                          {varietyQuantity > 0 && (
                                              <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold drop-shadow-sm ${textColor}`}>
                                                  {varietyQuantity}
                                              </span>
                                          )}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex items-center justify-center gap-2 bg-[#1E212B]/70 p-2 rounded-lg">
                                <button onClick={decrement} className="w-10 h-10 rounded-md text-white/80 hover:bg-white/20 transition disabled:opacity-50 flex items-center justify-center" disabled={quantity === 0} aria-label="Disminuir cantidad">
                                    <MinusIcon className="w-5 h-5" />
                                </button>
                                <span className="text-xl font-bold w-12 text-center text-white drop-shadow-sm">{quantity}</span>
                                <button onClick={increment} className="w-10 h-10 rounded-md text-white/80 hover:bg-white/20 transition flex items-center justify-center" aria-label="Aumentar cantidad">
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default FlowerSelector;
