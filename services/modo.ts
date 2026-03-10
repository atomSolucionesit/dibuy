import { api } from "@/api";

/**
 * Solicita al backend la creación de una intención de pago MODO.
 * El backend se encarga de comunicarse con el endpoint de MODO usando
 * la private key y devolver al cliente los datos necesarios (checkoutId,
 * qrString y deeplink).
 */
export const createModoCheckout = async (price: number) => {
  try {
    const res = await api.post("/modo/checkout", { price });
    return res.data;
  } catch (error) {
    console.error("Error creando intención MODO:", error);
    throw error;
  }
};
