export interface ProductType {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  releaseDate: string;
  productAvailable: boolean;
  imageName?: string;
  quantity: number;
}
