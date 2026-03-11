import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '@/services/productService';
import { ProductFilters } from '@/types/api';

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

export const useProducts = (page = 1, limit = 12, filters?: ProductFilters) =>
  useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => ProductService.getProducts(page, limit, filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => ProductService.getProductById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

export const useProductsByCategory = (
  categorySlug: string,
  page = 1,
  limit = 12,
  _filters?: Omit<ProductFilters, 'category'>,
) =>
  useQuery({
    queryKey: [...productKeys.lists(), 'category', categorySlug, { page, limit }],
    queryFn: () => ProductService.getProductsByCategory(categorySlug, page, limit),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useFeaturedProducts = (limit = 8) =>
  useQuery({
    queryKey: [...productKeys.featured, limit],
    queryFn: () => ProductService.getOutstandingProducts(limit),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

export const useOnSaleProducts = (limit = 8) =>
  useQuery({
    queryKey: [...productKeys.onSale, limit],
    queryFn: async () => {
      const response = await ProductService.getProducts(1, limit);
      return response?.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

export const useBestSellers = (limit = 8) =>
  useQuery({
    queryKey: [...productKeys.bestSellers, limit],
    queryFn: async () => {
      const response = await ProductService.getProducts(1, limit);
      return response?.data || [];
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

export const useNewArrivals = (limit = 8) =>
  useQuery({
    queryKey: [...productKeys.newArrivals, limit],
    queryFn: async () => {
      const response = await ProductService.getProducts(1, limit);
      return response?.data || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

export const useSearchProducts = (
  query: string,
  _page = 1,
  _limit = 12,
  _filters?: Omit<ProductFilters, 'search'>,
) =>
  useQuery({
    queryKey: [...productKeys.search(query)],
    queryFn: () => ProductService.searchProducts(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useCategories = () =>
  useQuery({
    queryKey: productKeys.categories,
    queryFn: () => ProductService.getCategories(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

export const useCategory = (slug: string) =>
  useQuery({
    queryKey: [...productKeys.categories, slug],
    queryFn: async () => {
      const categories = await ProductService.getPublishedCategories();
      return categories.find((category: { slug?: string; id: string }) => category.slug === slug || category.id === slug) || null;
    },
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

export const useRelatedProducts = (productId: string, limit = 4) =>
  useQuery({
    queryKey: [...productKeys.detail(productId), 'related', limit],
    queryFn: async () => {
      const response = await ProductService.getProducts(1, limit + 1);
      const products = response?.data || [];
      return products.filter((product: { id: string }) => product.id !== productId).slice(0, limit);
    },
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

export const useProductReviews = (_productId: string, _page = 1, _limit = 10) =>
  useQuery({
    queryKey: [...productKeys.reviews(_productId), { page: _page, limit: _limit }],
    queryFn: async () => [],
    enabled: !!_productId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId }: { productId: string; rating: number; comment: string }) => ({ success: false, productId }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.reviews(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
    },
  });
};

export const useCheckStock = () =>
  useMutation({
    mutationFn: async ({ quantity }: { productId: string; quantity: number }) => quantity > 0,
  });

export const useBrands = () =>
  useQuery({
    queryKey: [...productKeys.all, 'brands'],
    queryFn: async () => [],
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

export const useProductsByBrand = (brand: string, page = 1, limit = 12) =>
  useQuery({
    queryKey: [...productKeys.lists(), 'brand', brand, { page, limit }],
    queryFn: async () => {
      const response = await ProductService.getProducts(page, limit, { brand });
      return response?.data || [];
    },
    enabled: !!brand,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
