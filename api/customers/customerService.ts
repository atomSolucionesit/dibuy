import api from "@/lib/api";

export type CreateCustomerPayload = {
  name: string;
  lastName?: string;
  documentNumber: string;
  phone?: string;
  email?: string;
};

export const createCustomer = async (
  customerData: CreateCustomerPayload
): Promise<any> => {
  try {
    const response = await api.post("/customers", customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const customerService = {
  createCustomer,
};
