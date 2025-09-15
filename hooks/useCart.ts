import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CartService } from '@/services/cartService';
import { Cart, CartItem } from '@/types/api';

// Keys para React Query
export const cartKeys = {
  all: ['cart'] as const,
  details: () => [...cartKeys.all, 'detail'] as const,
  detail: () => [...cartKeys.details()] as const,
  count: () => [...cartKeys.all, 'count'] as const,
  summary: () => [...cartKeys.all, 'summary'] as const,
  saved: () => [...cartKeys.all, 'saved'] as const,
  availability: () => [...cartKeys.all, 'availability'] as const,
  shipping: (zipCode: string) => [...cartKeys.all, 'shipping', zipCode] as const,
};

// Hook para obtener el carrito
export const useCart = () => {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: () => CartService.getCart(),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener el conteo de items en el carrito
export const useCartCount = () => {
  return useQuery({
    queryKey: cartKeys.count(),
    queryFn: () => CartService.getCartItemCount(),
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obtener el resumen del carrito
export const useCartSummary = () => {
  return useQuery({
    queryKey: cartKeys.summary(),
    queryFn: () => CartService.getCartSummary(),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para agregar producto al carrito
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      CartService.addToCart(productId, quantity),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
    },
  });
};

// Hook para actualizar cantidad de un item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      CartService.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
    },
  });
};

// Hook para remover item del carrito
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => CartService.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
    },
  });
};

// Hook para limpiar carrito
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
    },
  });
};

// Hook para aplicar cupón
export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => CartService.applyCoupon(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
    },
  });
};

// Hook para remover cupón
export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CartService.removeCoupon(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
    },
  });
};

// Hook para guardar item para más tarde
export const useSaveForLater = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => CartService.saveForLater(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      queryClient.invalidateQueries({ queryKey: cartKeys.saved() });
    },
  });
};

// Hook para mover item de guardado al carrito
export const useMoveToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => CartService.moveToCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      queryClient.invalidateQueries({ queryKey: cartKeys.saved() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
    },
  });
};

// Hook para obtener items guardados
export const useSavedItems = () => {
  return useQuery({
    queryKey: cartKeys.saved(),
    queryFn: () => CartService.getSavedItems(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};

// Hook para verificar disponibilidad
export const useCheckCartAvailability = () => {
  return useQuery({
    queryKey: cartKeys.availability(),
    queryFn: () => CartService.checkCartAvailability(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para calcular envío
export const useCalculateShipping = (zipCode: string) => {
  return useQuery({
    queryKey: cartKeys.shipping(zipCode),
    queryFn: () => CartService.calculateShipping(zipCode),
    enabled: !!zipCode && zipCode.length >= 3,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Hook para seleccionar método de envío
export const useSelectShippingMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shippingId: string) => CartService.selectShippingMethod(shippingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() });
    },
  });
};

// Hook combinado para operaciones rápidas del carrito
export const useCartActions = () => {
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  return {
    addToCart: addToCart.mutate,
    updateCartItem: updateCartItem.mutate,
    removeFromCart: removeFromCart.mutate,
    clearCart: clearCart.mutate,
    isLoading: addToCart.isPending || updateCartItem.isPending || removeFromCart.isPending || clearCart.isPending,
  };
};
