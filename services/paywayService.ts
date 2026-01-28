import axios from 'axios';

const paywayApi = axios.create({
  baseURL: '/api/payway',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const paywayService = {
  createToken: async (cardData: {
    card_number: string;
    card_expiration_month: string;
    card_expiration_year: string;
    security_code: string;
    card_holder_name: string;
  }) => {
    const response = await paywayApi.post('/token-alt', cardData);
    return response.data;
  },

  processPayment: async (paymentData: {
    token: string;
    amount: number;
    saleId: string;
  }) => {
    const response = await paywayApi.post('/payment', paymentData);
    return response.data;
  }
};