import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  createNexusPayment, 
  getNexusPaymentStatus, 
  processNexusPayment,
  NexusPaymentData,
  NexusSaleData 
} from '@/services/nexusPayments';

// Hook para crear pago
export const useCreateNexusPayment = () => {
  return useMutation({
    mutationFn: ({ amount, saleId }: { amount: number; saleId: string }) =>
      createNexusPayment(amount, saleId),
    onError: (error) => {
      console.error('Error creando pago:', error);
    },
  });
};

// Hook para procesar pago completo
export const useProcessNexusPayment = () => {
  return useMutation({
    mutationFn: ({ paymentData, saleData }: { paymentData: NexusPaymentData; saleData: NexusSaleData }) =>
      processNexusPayment(paymentData, saleData),
    onError: (error) => {
      console.error('Error procesando pago:', error);
    },
  });
};

// Hook para obtener estado del pago
export const useNexusPaymentStatus = (paymentId: string, enabled = false) => {
  return useQuery({
    queryKey: ['nexusPaymentStatus', paymentId],
    queryFn: () => getNexusPaymentStatus(paymentId),
    enabled: enabled && !!paymentId,
    refetchInterval: 5000, // Refrescar cada 5 segundos
  });
};