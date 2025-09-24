import { api } from "@/api";

// Generar token (simulado en Payway)
export const createToken = async (cardData: any) => {
  try {
    const res = await api.post("/payway-mock/tokens", cardData);
    return res.data;
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
};

// Crear pago
export const createPayment = async (token: string, amount: number, saleId: string) => {
  try {
    const res = await api.post("/payway-mock/payments", {
      token,
      amount,
      currency: "ARS",
      installments: 1,
      site_transaction_id: saleId,
    });
    return res.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

// Consultar estado del pago
export const getPaymentStatus = async (paymentId: string) => {
  try {
    const res = await api.get(`/payway-mock/payments/${paymentId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching payment status:", error);
    throw error;
  }
};
