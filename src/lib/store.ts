export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  details: string[];
};

export type CartItem = Product & { quantity: number };
