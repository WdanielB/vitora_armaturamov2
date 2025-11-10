
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
