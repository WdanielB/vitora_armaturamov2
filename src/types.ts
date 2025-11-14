// FIX: Add global type definition for Vite environment variables to resolve type errors.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_APPS_SCRIPT_URL: string;
    };
  }
}

export interface BouquetType {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface Flower {
  id: string;
  name: string;
  color: string;
  price: number;
  image: string;
  hex_color: string;
  background_image: string;
}

export interface Foliage {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface SelectedFlower {
  item: Flower;
  quantity: number;
}

export interface Solicitud {
  timestamp: string;
  name_cliente: string;
  telefono: string;
  fecha_entrega: string;
  ramo_seleccionado: string;
  flores_seleccionadas: string; // JSON string
  follaje_seleccionado: string; // JSON string
  dedicatoria: string;
  spotify_link: string;
  precio_total: number;
}
