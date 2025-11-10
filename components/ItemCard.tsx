import React from 'react';
import { BouquetType, Flower, Foliage } from '../types';
import { CheckCircleIcon } from './Icons';

type Item = BouquetType | Flower | Foliage;

interface ItemCardProps {
    item: Item;
    type: 'bouquet' | 'flower' | 'foliage';
    isSelected?: boolean;
    quantity?: number;
    onSelect?: () => void;
    onToggle?: () => void;
    onQuantityChange?: (quantity: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, type, isSelected = false, onSelect, onToggle }) => {
    const isFlower = (item: Item): item is Flower => 'color' in item;

    const baseClasses = "relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer";
    const selectedClasses = "ring-2 ring-offset-2 ring-offset-[#1E212B] ring-[#DCBBA0]";
    const unselectedClasses = "ring-1 ring-white/10";

    const handleClick = () => {
        if (type === 'bouquet' && onSelect) {
            onSelect();
        } else if (type === 'foliage' && onToggle) {
            onToggle();
        }
    };
    
    if (type === 'bouquet') {
        return (
            <div onClick={handleClick} className={`${baseClasses} aspect-square ${isSelected ? selectedClasses : unselectedClasses}`}>
                {isSelected && (
                    <div className="absolute top-2 right-2 z-20 bg-[#DCBBA0] text-gray-800 rounded-full p-1">
                        <CheckCircleIcon className="w-5 h-5" />
                    </div>
                )}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="relative h-full flex items-end justify-center p-4 text-center">
                    <h3 className="font-bold text-white text-base sm:text-lg tracking-wide uppercase drop-shadow-md">{item.name}</h3>
                </div>
            </div>
        )
    }

    // Foliage Card
    return (
        <div onClick={handleClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            {isSelected && (
                <div className="absolute top-2 right-2 z-10 bg-[#DCBBA0] text-gray-800 rounded-full p-1">
                    <CheckCircleIcon className="w-5 h-5" />
                </div>
            )}
            
            <div className="aspect-square w-full overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>

            <div className="p-2 text-center bg-gray-900/50 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-200 truncate text-sm">{item.name}</h3>
                {isFlower(item) && <p className="text-xs text-gray-400">{item.color}</p>}
            </div>
        </div>
    );
};

export default ItemCard;