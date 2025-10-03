import { api } from "@/api";

const PAYWAY_TOKEN_URL = "https://developers.decidir.com/api/v2/tokens";

/**
 * Generar token de tarjeta con la publicKey de Payway.
 * ⚠️ Esto siempre se hace en frontend.
 */
export const createToken = async (cardData: {
  card_number: string;
  card_expiration_month: string;
  card_expiration_year: string;
  security_code: string;
  card_holder_name: string;
  card_holder_identification: { type: string; number: string };
}) => {
  try {
    const res = await fetch(PAYWAY_TOKEN_URL, {
      method: "POST",
      headers: {
        apikey: process.env.NEXT_PUBLIC_PAYWAY_PUBLIC_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardData),
    });

    const data = await res.json();

    if (!res.ok || !data.id) {
      throw new Error(`Error al crear token: ${JSON.stringify(data)}`);
    }

    return data; // contiene { id: "tokenId", ... }
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
};

/**
 * Crear pago en tu backend (usa la privateKey).
 */
export const createPayment = async (
  token: string,
  amount: number,
  saleId: string | null,
  deviceFingerprintId: string | null
) => {
  try {
    const res = await api.post("/payway/payment", {
      token,
      amount,
      saleId,
      deviceFingerprintId
    });
    return res.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

/**
 * Consultar estado del pago en tu backend.
 */
export const getPaymentStatus = async (paymentId: string) => {
  try {
    const res = await api.get(`/payway/payment/${paymentId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching payment status:", error);
    throw error;
  }
};

/* 
{
  APPROVED
  card_number: "4507990000000010",
  card_expiration_month: "12",
  card_expiration_year: "25",
  security_code: "123",
}

{
 REJECTED
  card_number: "4000000000000002",
  card_expiration_month: "12",
  card_expiration_year: "30",
  security_code: "123",
}
*/