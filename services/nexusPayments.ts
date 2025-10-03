// import { api } from "@/lib/ap

import { api } from "@/api";

export interface NexusPaymentData {
  amount: number;
  transactionId: string;
  status: string;
  paymentMethod?: string;
}

export interface NexusSaleData {
  total: number;
  subTotal: number;
  taxAmount: number;
  customerId?: number;
  currencyId: number;
  receiptTypeId: number;
  documentTypeId?: number;
  details: Array<{
    productId?: string;
    quantity: number;
    price: number;
    discount?: number;
  }>;
}

// Procesar pago con Nexus CRM
export const processNexusPayment = async (
  paymentData: NexusPaymentData,
  saleData: NexusSaleData
) => {
  try {
    const response = await api.post("/payway/external-payment", {
      paymentData,
      saleData,
    });
    return response.data;
  } catch (error) {
    console.error("Error procesando pago con Nexus:", error);
    throw error;
  }
};

// Crear token de tarjeta
export const createPaywayToken = async (cardData: any) => {
  try {
    const response = await api.post("/payway/token", cardData);
    return response.data;
  } catch (error) {
    console.error("Error creando token:", error);
    throw error;
  }
};

// Procesar pago con token
export const processPaywayPayment = async (paymentData: any) => {
  try {
    const response = await api.post("/payway/process-payment", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error procesando pago:", error);
    throw error;
  }
};

// Crear pago (redirige a checkout)
export const createNexusPayment = async (amount: number, saleId: string) => {
  try {
    const response = await api.post("/payway/payment", {
      amount,
      site_transaction_id: saleId
    });
    return response.data;
  } catch (error) {
    console.error("Error creando pago:", error);
    throw error;
  }
};

// Confirmar pago
export const confirmNexusPayment = async (paymentId: string) => {
  try {
    const response = await api.get(`/payway/payment/${paymentId}/status`);
    return response.data;
  } catch (error) {
    console.error("Error confirmando pago:", error);
    throw error;
  }
};

// Obtener estado del pago
export const getNexusPaymentStatus = async (paymentId: string) => {
  try {
    const response = await api.get(`/payway/payment/${paymentId}/status`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo estado del pago:", error);
    throw error;
  }
};
