import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { Product } from "@/lib/store";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const data = await apiClient.getProducts();
      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        category: p.category,
        image: p.image,
        images: p.images || [],
        description: p.description || "",
        details: p.details || [],
      }));
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async (): Promise<Product | null> => {
      const data = await apiClient.getProduct(id);
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        category: data.category as Product["category"],
        image: data.image,
        images: data.images || [],
        description: data.description || "",
        details: data.details || [],
      };
    },
    enabled: !!id,
  });
};
