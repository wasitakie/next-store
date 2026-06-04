
export interface Product {
  id: number;
  slug: string;
  image: string | null;
  price: number;
  stock: number;
  name_th: string ;
  name_en: string ;
  description_th: string ;
  description_en: string ;
  category_th: string ;
  category_en: string ;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalizedProduct extends Omit<Product, 'name_th' | 'name_en' | 'description_th' | 'description_en' |'category_th'| 'category_en'> {
  name: string;
  description: string;
  category: string;
}