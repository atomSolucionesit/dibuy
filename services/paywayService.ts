import { api } from "@/api";

export interface PaywayTokenData {
  card_number: string;
  card_expiration_month: string;
  card_expiration_year: string;
  security_code: string;
  card_holder_name: string;
  card_holder_identification: {
    type: string;
    number: string;
  };
}

export interface PaywayPaymentData {
  token: string;
  amount: number;
  currency: string;
  installments: number;
  site_transaction_id: string;
  payment_method_id?: number;
  bin?: string;
  payment_type?: string;
  sub_payments?: any[];
}

// Generar token de pago (Paso 1 del flujo Payway)
export const createPaywayToken = async (cardData: PaywayTokenData) => {
  try {
    const response = await api.post("/payway/token", cardData);
    return response.data;
  } catch (error) {
    console.error("Error creando token Payway:", error);
    throw error;
  }
};

// Procesar pago con token (Paso 2 del flujo Payway)
export const processPaywayPayment = async (paymentData: PaywayPaymentData) => {
  try {
    const response = await api.post("/payway/payment", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error procesando pago Payway:", error);
    throw error;
  }
};

// Crear pago directo para sandbox
export const createPaywaySandboxPayment = async (amount: number, siteTransactionId: string) => {
  try {
    const response = await api.post("/payway/sandbox-payment", {
      amount,
      site_transaction_id: siteTransactionId,
      currency: "ARS",
      installments: 1
    });
    return response.data;
  } catch (error) {
    console.error("Error creando pago sandbox:", error);
    throw error;
  }
};

// Confirmar pago sandbox
export const confirmPaywaySandboxPayment = async (paymentId: string) => {
  try {
    const response = await api.post(`/payway/sandbox-payment/${paymentId}/confirm`);
    return response.data;
  } catch (error) {
    console.error("Error confirmando pago sandbox:", error);
    throw error;
  }
};

// Obtener estado del pago
export const getPaywayPaymentStatus = async (paymentId: string) => {
  try {
    const response = await api.get(`/payway/payment/${paymentId}/status`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo estado del pago:", error);
    throw error;
  }
};