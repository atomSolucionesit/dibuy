import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '@/services/productService';
import { Product, ProductFilters, Category, Review } from '@/types/api';

// Keys para React Query
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: ['categories'] as const,
  featured: ['products', 'featured'] as const,
  onSale: ['products', 'on-sale'] as const,
  bestSellers: ['products', 'best-sellers'] as const,
  newArrivals: ['products', 'new-arrivals'] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  reviews: (productId: string) => [...productKeys.details(), productId, 'reviews'] as const,
};

// Hook para obtener productos con filtros
export const useProducts = (
  page: number = 1,
  limit: number = 12,
  filters?: ProductFilters
) => {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => ProductService.getProducts(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obtener un producto específico
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => ProductService.getProductById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Hook para obtener productos por categoría
export const useProductsByCategory = (
  categorySlug: string,
  page: number = 1,
  limit: number = 12,
  filters?: Omit<ProductFilters, 'category'>
) => {
  return useQuery({
    queryKey: [...productKeys.lists(), 'category', categorySlug, { page, limit, filters }],
    queryFn: () => ProductService.getProductsByCategory(categorySlug, page, limit, filters),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook para obtener productos destacados
export const useFeaturedProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: [...productKeys.featured, limit],
    queryFn: () => ProductService.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Hook para obtener productos en oferta
export const useOnSaleProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: [...productKeys.onSale, limit],
    queryFn: () => ProductService.getOnSaleProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};

// Hook para obtener productos más vendidos
export const useBestSellers = (limit: number = 8) => {
  return useQuery({
    queryKey: [...productKeys.bestSellers, limit],
    queryFn: () => ProductService.getBestSellers(limit),
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
};

// Hook para obtener productos nuevos
export const useNewArrivals = (limit: number = 8) => {
  return useQuery({
    queryKey: [...productKeys.newArrivals, limit],
    queryFn: () => ProductService.getNewArrivals(limit),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Hook para buscar productos
export const useSearchProducts = (
  query: string,
  page: number = 1,
  limit: number = 12,
  filters?: Omit<ProductFilters, 'search'>
) => {
  return useQuery({
    queryKey: [...productKeys.search(query), { page, limit, filters }],
    queryFn: () => ProductService.searchProducts(query, page, limit, filters),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener categorías
export const useCategories = () => {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: () => ProductService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
};

// Hook para obtener una categoría específica
export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: [...productKeys.categories, slug],
    queryFn: () => ProductService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
};

// Hook para obtener productos relacionados
export const useRelatedProducts = (productId: string, limit: number = 4) => {
  return useQuery({
    queryKey: [...productKeys.detail(productId), 'related', limit],
    queryFn: () => ProductService.getRelatedProducts(productId, limit),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Hook para obtener reseñas de un producto
export const useProductReviews = (
  productId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: [...productKeys.reviews(productId), { page, limit }],
    queryFn: () => ProductService.getProductReviews(productId, page, limit),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};

// Hook para crear una reseña
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, rating, comment }: {
      productId: string;
      rating: number;
      comment: string;
    }) => ProductService.createProductReview(productId, rating, comment),
    onSuccess: (_, { productId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: productKeys.reviews(productId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
    },
  });
};

// Hook para verificar stock
export const useCheckStock = () => {
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      ProductService.checkProductStock(productId, quantity),
  });
};

// Hook para obtener marcas
export const useBrands = () => {
  return useQuery({
    queryKey: [...productKeys.all, 'brands'],
    queryFn: () => ProductService.getBrands(),
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 24 * 60 * 60 * 1000, // 24 horas
  });
};

// Hook para obtener productos por marca
export const useProductsByBrand = (
  brand: string,
  page: number = 1,
  limit: number = 12
) => {
  return useQuery({
    queryKey: [...productKeys.lists(), 'brand', brand, { page, limit }],
    queryFn: () => ProductService.getProductsByBrand(brand, page, limit),
    enabled: !!brand,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};
