import { api } from "@/api";

export const getCarriers = async (): Promise<any> => {
    try {
        const response = await api.get("/shipping/carriers");
        return response.data;
    } catch (error) {
        console.error("Error fetching carriers:", error);
        return [];
    }
};

export const shippingService = {
    getCarriers,
};
