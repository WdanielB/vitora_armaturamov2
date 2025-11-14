
import React from 'react';

interface BouquetDetailsCellProps {
  ramoName: string;
  floresData: string;
  follajeData: string;
}

interface FlowerDetail {
    cantidad: number;
    numero: string;
    color: string;
    precio_unitario: number;
}

interface FoliageDetail {
    cantidad: number;
    numero: string;
    color: string;
    precio_unitario: number;
}


const BouquetDetailsCell: React.FC<BouquetDetailsCellProps> = ({ ramoName, floresData, follajeData }) => {
  const parseJSON = <T,>(jsonString: string, defaultValue: T): T => {
    if (!jsonString || jsonString.toLowerCase() === 'n/a' || jsonString === '[]') return defaultValue;
    try {
      return JSON.parse(jsonString) as T;
    } catch (e) {
      console.error("Failed to parse JSON:", e, jsonString);
      return defaultValue;
    }
  };

  const flores = parseJSON<FlowerDetail[]>(floresData, []);
  const follaje = parseJSON<FoliageDetail[]>(follajeData, []);

  const hasContent = (ramoName && ramoName.toLowerCase() !== 'n/a') || flores.length > 0 || follaje.length > 0;

  if (!hasContent) {
    return <span className="text-gray-400">N/A</span>;
  }

  return (
    <div className="text-xs text-left text-gray-300 space-y-2">
      {ramoName && ramoName.toLowerCase() !== 'n/a' && <p className="font-bold text-white uppercase tracking-wide">{ramoName}</p>}
      
      {flores && flores.length > 0 && (
        <div>
            <h4 className="font-semibold text-gray-400 text-[10px] uppercase">Flores:</h4>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
            {flores.map((flor, index) => (
                <li key={`flor-${index}`}>
                {flor.cantidad}x {flor.numero} {flor.color}
                </li>
            ))}
            </ul>
        </div>
      )}

      {follaje && follaje.length > 0 && (
        <div>
            <h4 className="font-semibold text-gray-400 text-[10px] uppercase">Follaje:</h4>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
            {follaje.map((item, index) => (
                <li key={`follaje-${index}`}>
                {item.cantidad}x {item.numero}
                </li>
            ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default BouquetDetailsCell;
