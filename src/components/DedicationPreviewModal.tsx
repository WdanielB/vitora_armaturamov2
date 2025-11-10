import React, { useState } from 'react';
// FIX: Import GoogleGenAI from "@google/genai" as per guidelines.
import { GoogleGenAI } from '@google/genai';
import { XIcon } from './Icons';

interface DedicationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dedication: string) => void;
}

// FIX: Create the DedicationPreviewModal component to resolve rendering errors.
const DedicationPreviewModal: React.FC<DedicationPreviewModalProps> = ({ isOpen, onClose, onSave }) => {
  const [recipient, setRecipient] = useState('');
  const [occasion, setOccasion] = useState('');
  const [tone, setTone] = useState('');
  const [generatedDedication, setGeneratedDedication] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!recipient || !occasion || !tone) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedDedication('');

    try {
      // FIX: Use GoogleGenAI with API key from environment variables as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = `Escribe una dedicatoria de no más de 50 palabras para un ramo de flores. El destinatario es "${recipient}", la ocasión es "${occasion}" y el tono debe ser "${tone}".`;
      
      // FIX: Use ai.models.generateContent to generate text content as per guidelines.
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });

      // FIX: Extract text directly from response.text as per guidelines.
      const text = response.text;
      setGeneratedDedication(text);
    } catch (e) {
      console.error(e);
      setError('Hubo un error al generar la dedicatoria. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    onSave(generatedDedication);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative bg-[#2a2e3c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition z-10">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">Generar Dedicatoria</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-300">Destinatario</label>
              <input type="text" id="recipient" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Ej: Mi querida mamá" className="w-full mt-1 pl-3 pr-3 py-2 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition" />
            </div>
            <div>
              <label htmlFor="occasion" className="block text-sm font-medium text-gray-300">Ocasión</label>
              <input type="text" id="occasion" value={occasion} onChange={e => setOccasion(e.target.value)} placeholder="Ej: Día de la Madre" className="w-full mt-1 pl-3 pr-3 py-2 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition" />
            </div>
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-300">Tono</label>
              <input type="text" id="tone" value={tone} onChange={e => setTone(e.target.value)} placeholder="Ej: Cariñoso y agradecido" className="w-full mt-1 pl-3 pr-3 py-2 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#DCBBA0] focus:border-[#DCBBA0] transition" />
            </div>
          </div>
          <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-6 bg-[#DCBBA0] text-gray-800 font-bold py-3 rounded-lg hover:brightness-95 transition disabled:opacity-50">
            {isLoading ? 'Generando...' : 'Generar con IA'}
          </button>
          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
          {generatedDedication && (
            <div className="mt-6 p-4 border border-gray-600 bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Sugerencia:</h3>
              <p className="text-gray-300 italic">"{generatedDedication}"</p>
              <button onClick={handleSave} className="w-full mt-4 bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition">
                Usar esta dedicatoria
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DedicationPreviewModal;
