import { api } from "@/api";

const PAYWAY_TOKEN_URL = "https://developers.decidir.com/api/v2/tokens";
let paywayPublicConfigCache: {
  publicKey: string;
  companyId: string;
  env: string;
} | null = null;

const getPaywayPublicConfig = async () => {
  if (paywayPublicConfigCache) {
    return paywayPublicConfigCache;
  }

  const companyIdFromSession =
    typeof window !== "undefined"
      ? sessionStorage.getItem("ecommerce_company_id") ||
        process.env.NEXT_PUBLIC_COMPANY_ID
      : process.env.NEXT_PUBLIC_COMPANY_ID;

  const query = companyIdFromSession
    ? `?companyId=${companyIdFromSession}`
    : "";
  const res = await api.get(`/payway/public-config${query}`);
  const info = res?.data;

  if (!info?.publicKey) {
    throw new Error(
      "No se encontró la configuración pública de Payway para esta compañía",
    );
  }

  paywayPublicConfigCache = {
    publicKey: info.publicKey,
    companyId: String(info.companyId || ""),
    env: String(info.env || "developer"),
  };

  return paywayPublicConfigCache;
};

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
    const config = await getPaywayPublicConfig();
    const res = await fetch(PAYWAY_TOKEN_URL, {
      method: "POST",
      headers: {
        apikey: config.publicKey,
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
  deviceFingerprintId: string | null,
  paymentMethodId?: number,
  installments?: number,
  bin?: string,
) => {
  try {
    const res = await api.post("/payway/payment", {
      token,
      amount,
      saleId,
      deviceFingerprintId,
      paymentMethodId,
      installments,
      bin,
    });
    return res.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const getInstallmentOptions = async (paymentMethodId?: number) => {
  try {
    const query = paymentMethodId ? `?paymentMethodId=${paymentMethodId}` : "";
    const res = await api.get(`/payway/installments-options${query}`);
    return res.data?.info?.installments || [1, 3, 6, 9, 12];
  } catch (error) {
    console.error("Error fetching installment options:", error);
    return [1, 3, 6, 9, 12];
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
